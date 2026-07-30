# FILE: /opt/nexifyai/repos/nexify-agentur-plattform/backend/inbox_triage/researcher.py
# NIR: 28.07.2026 10:50
# NAME: NeXifyAI Inbox-Triage
# WHAT: Firecrawl-basierte Best-Practice-Recherche — täglich aktuelle Trends fetchen
# WHY: Sense-Phase — Wissen von außen einsammeln
# BEST-PRACTICE: Firecrawl MCP statt curl; Topics rotieren; Ergebnisse strukturiert in AgentMemory
# PITFALL: V-17: Firecrawl ohne API-Key → Fallback auf Hermes web_search
# DEPENDS: firecrawl MCP, agentmemory REST API
# DOCS-REF: /opt/nexifyai/docs/live/AGENT-TOOLING-PRODUCTION-READY-2026-07-25.md

"""Firecrawl-Recherche — tägliche Best-Practice-Fetches."""

import json
import os
from dataclasses import dataclass, field
from datetime import datetime, timezone

import requests

AGENTMEMORY_URL = os.environ.get("AGENTMEMORY_URL", "http://127.0.0.1:3111")

# Optimierung: Topics rotieren — nicht jeden Tag alle 5
RESEARCH_TOPICS = [
    "AI agent best practices 2026 autonomous coding workflow",
    "Poolside CLI agent AGENTS.md skills MCP configuration",
    "Hermes agent skill development best practices 2026",
    "AgentMemory knowledge graph patterns multi-agent",
    "MCP server integration patterns autonomous agents 2026",
    "Firecrawl web scraping best practices structured data",
    "GitHub actions CI/CD autonomous deployment agents",
    "LightRAG knowledge graph retrieval augmented generation",
]


@dataclass
class ResearchItem:
    url: str
    title: str
    snippet: str
    source: str  # firecrawl, web_search, fallback
    fetched_at: str = ""


@dataclass
class ResearchBundle:
    topic: str
    items: list[ResearchItem] = field(default_factory=list)
    summary: str = ""
    source_count: int = 0
    created_at: str = ""


def fetch_topic_via_firecrawl(topic: str, max_results: int = 5) -> ResearchBundle:
    """
    Firecrawl MCP search + extract für ein Topic.
    In Produktion wird dies über den Firecrawl MCP-Server aufgerufen.
    Für direkte Python-Integration: Firecrawl SDK oder REST API.
    """
    bundle = ResearchBundle(
        topic=topic,
        created_at=datetime.now(timezone.utc).isoformat(),
        source_count=0,
    )

    firecrawl_key = os.environ.get("FIRECRAWL_API_KEY", "")
    if not firecrawl_key:
        bundle.summary = "FIRECRAWL_API_KEY fehlt — Fallback auf web_search nötig"
        return bundle

    try:
        # Firecrawl REST API (v1/search)
        r = requests.post(
            "https://api.firecrawl.dev/v1/search",
            json={"query": topic, "limit": max_results},
            headers={
                "Authorization": f"Bearer {firecrawl_key}",
                "Content-Type": "application/json",
            },
            timeout=30,
        )
        if r.status_code == 200:
            data = r.json()
            for item in data.get("data", [])[:max_results]:
                bundle.items.append(
                    ResearchItem(
                        url=item.get("url", ""),
                        title=item.get("title", "")[:200],
                        snippet=item.get("description", "")[:500],
                        source="firecrawl",
                        fetched_at=datetime.now(timezone.utc).isoformat(),
                    )
                )
            bundle.source_count = len(bundle.items)
            bundle.summary = f"{bundle.source_count} Quellen via Firecrawl"
        else:
            bundle.summary = f"Firecrawl error: HTTP {r.status_code}"
    except Exception as e:
        bundle.summary = f"Firecrawl error: {str(e)[:200]}"

    return bundle


def fetch_all_topics(
    topics: list[str] | None = None, max_per_topic: int = 5
) -> list[ResearchBundle]:
    """Alle Research-Topics fetchen (oder übergebene Teilmenge)."""
    if topics is None:
        topics = RESEARCH_TOPICS
    bundles = []
    for topic in topics:
        try:
            bundle = fetch_topic_via_firecrawl(topic, max_results=max_per_topic)
            bundles.append(bundle)
        except Exception as e:
            bundles.append(
                ResearchBundle(
                    topic=topic,
                    summary=f"Error: {str(e)[:200]}",
                    created_at=datetime.now(timezone.utc).isoformat(),
                )
            )
    return bundles


def fetch_daily_topics() -> list[ResearchBundle]:
    """Tägliche Rotation: Nur die ersten 3 Topics + 1 rotierendes."""
    today = datetime.now(timezone.utc).day
    # 3 feste Kern-Topics + 1 rotierend aus dem Rest
    core = RESEARCH_TOPICS[:3]
    rotating_idx = today % (len(RESEARCH_TOPICS) - 3)
    rotating = [RESEARCH_TOPICS[3 + rotating_idx]]
    return fetch_all_topics(core + rotating, max_per_topic=3)


def persist_research(bundle: ResearchBundle) -> bool:
    """Research-Ergebnisse in AgentMemory speichern."""
    secret = os.environ.get("AGENTMEMORY_SECRET", "")
    if not secret:
        return False
    try:
        content = json.dumps(
            {
                "topic": bundle.topic,
                "summary": bundle.summary,
                "source_count": bundle.source_count,
                "items": [
                    {
                        "url": i.url,
                        "title": i.title,
                        "snippet": i.snippet,
                        "source": i.source,
                    }
                    for i in bundle.items
                ],
            },
            ensure_ascii=False,
        )
        r = requests.post(
            f"{AGENTMEMORY_URL}/agentmemory/remember",
            json={
                "type": "research",
                "content": content,
                "tags": [
                    "research",
                    "best-practices",
                    "firecrawl",
                    "sense",
                    bundle.topic.replace(" ", "-")[:50],
                ],
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


def persist_all(bundles: list[ResearchBundle]) -> int:
    """Alle Bundles persistieren, Count der erfolgreichen zurückgeben."""
    count = 0
    for bundle in bundles:
        if persist_research(bundle):
            count += 1
    return count
