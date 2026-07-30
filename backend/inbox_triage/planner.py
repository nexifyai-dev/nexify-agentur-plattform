# FILE: /opt/nexifyai/repos/nexify-agentur-plattform/backend/inbox_triage/planner.py
# NIR: 28.07.2026 10:50
# NAME: NeXifyAI Inbox-Triage
# WHAT: Datengetriebene Planung aus IST/SOLL + Research + Repo-Watch
# WHY: Decide-Phase — priorisierte Aktionen ableiten
# BEST-PRACTICE: Priorisierung nach Impact; Cost-Awareness; Merge-Dedup
# PITFALL: V-19: Nicht zu viele Aktionen — Top-N priorisieren
# DEPENDS: assessor, researcher, repo_watcher
# DOCS-REF: /opt/nexifyai/docs/architecture/SOLL-GESAMTKONZEPT.md

"""Datengetriebene Planung — Decide-Phase."""

import os
from dataclasses import dataclass, field
from datetime import datetime, timezone

import requests

AGENTMEMORY_URL = os.environ.get("AGENTMEMORY_URL", "http://127.0.0.1:3111")

# Optimierung: Cost-Awareness — teure Aktionen nur bei critical/high
COST_THRESHOLD_HIGH = 0.05  # $ — teure MCP-Calls nur ab high
COST_THRESHOLD_MEDIUM = 0.01  # $ — medium-Calls nur wenn Budget da


@dataclass
class ActionItem:
    id: str
    title: str
    priority: str  # critical, high, medium, low
    category: str  # fix, research, implement, review, learn
    source: str  # ist-soll, firecrawl, github
    detail: str = ""
    estimated_cost: float = 0.0


@dataclass
class ActionPlan:
    items: list[ActionItem] = field(default_factory=list)
    created_at: str = ""
    summary: str = ""
    total_estimated_cost: float = 0.0


def plan_from_assessment(
    gaps: list[str], recommendations: list[str]
) -> list[ActionItem]:
    """Aus IST/SOLL-Gaps priorisierte Aktionen ableiten."""
    items = []
    for i, gap in enumerate(gaps):
        prio = "critical" if "down" in gap.lower() else "high"
        items.append(
            ActionItem(
                id=f"gap-{i}",
                title=f"Gap beheben: {gap[:80]}",
                priority=prio,
                category="fix",
                source="ist-soll",
                detail=gap,
                estimated_cost=0.001,  # Health-Checks sind billig
            )
        )
    return items


def plan_from_research(bundles: list) -> list[ActionItem]:
    """Aus Research-Bundles Lern-Aktionen ableiten."""
    items = []
    for b in bundles:
        if hasattr(b, "items") and b.items:
            items.append(
                ActionItem(
                    id=f"research-{b.topic[:30]}",
                    title=f"Best Practices prüfen: {b.topic[:60]}",
                    priority="medium",
                    category="learn",
                    source="firecrawl",
                    detail=f"{len(b.items)} Quellen gefunden",
                    estimated_cost=0.005,
                )
            )
    return items


def plan_from_repos(digests: list) -> list[ActionItem]:
    """Aus Repo-Updates Aktionen ableiten."""
    items = []
    for d in digests:
        if d.events:
            has_release = any(e.event_type == "release" for e in d.events)
            prio = "high" if has_release else "medium"
            items.append(
                ActionItem(
                    id=f"repo-{d.repo.replace('/', '-')[:30]}",
                    title=f"Repo-Update prüfen: {d.repo}",
                    priority=prio,
                    category="review",
                    source="github",
                    detail=f"{len(d.events)} neue Events",
                    estimated_cost=0.002,
                )
            )
    return items


def generate_plan(
    gaps: list[str],
    recommendations: list[str],
    research_bundles: list,
    repo_digests: list,
    max_items: int = 10,
) -> ActionPlan:
    """Gesamtplan aus allen Datenquellen generieren.

    Args:
        gaps: IST/SOLL-Gaps
        recommendations: Empfehlungen
        research_bundles: ResearchBundle-Liste
        repo_digests: RepoDigest-Liste
        max_items: Maximale Anzahl Aktionen (Top-N)

    Returns:
        ActionPlan mit priorisierten Aktionen.
    """
    plan = ActionPlan(created_at=datetime.now(timezone.utc).isoformat())
    plan.items.extend(plan_from_assessment(gaps, recommendations))
    plan.items.extend(plan_from_research(research_bundles))
    plan.items.extend(plan_from_repos(repo_digests))

    # Nach Priorität sortieren
    prio_order = {"critical": 0, "high": 1, "medium": 2, "low": 3}
    plan.items.sort(key=lambda x: prio_order.get(x.priority, 99))

    # Optimierung: Dedup ähnlicher Items
    seen_titles = set()
    deduped = []
    for item in plan.items:
        key = item.title[:60]
        if key not in seen_titles:
            seen_titles.add(key)
            deduped.append(item)
    plan.items = deduped

    # Top-N
    plan.items = plan.items[:max_items]

    # Cost-Awareness: teure Aktionen markieren
    for item in plan.items:
        if item.estimated_cost > COST_THRESHOLD_HIGH and item.priority not in (
            "critical",
            "high",
        ):
            item.priority = "low"  # Downgrade teure, nicht-kritische Aktionen

    plan.total_estimated_cost = sum(i.estimated_cost for i in plan.items)
    plan.summary = (
        f"{len(plan.items)} Aktionen — "
        f"{sum(1 for i in plan.items if i.priority == 'critical')} kritisch, "
        f"{sum(1 for i in plan.items if i.priority == 'high')} hoch, "
        f"Cost ~${plan.total_estimated_cost:.4f}"
    )
    return plan


def persist_plan(plan: ActionPlan) -> bool:
    """Plan in AgentMemory speichern."""
    secret = os.environ.get("AGENTMEMORY_SECRET", "")
    if not secret:
        return False
    try:
        import json as _json

        content = _json.dumps(
            {
                "summary": plan.summary,
                "total_estimated_cost": plan.total_estimated_cost,
                "items": [
                    {
                        "id": i.id,
                        "title": i.title,
                        "priority": i.priority,
                        "category": i.category,
                        "source": i.source,
                        "detail": i.detail,
                    }
                    for i in plan.items
                ],
            },
            ensure_ascii=False,
        )
        r = requests.post(
            f"{AGENTMEMORY_URL}/agentmemory/remember",
            json={
                "type": "plan",
                "content": content,
                "tags": ["plan", "decide", "inbox-triage"],
            },
            headers={
                "Authorization": f"Bearer {secret}",
                "Content-Type": "application/json",
            },
            timeout=10,
        )
        return r.status_code == 200
    except Exception:
        return False
