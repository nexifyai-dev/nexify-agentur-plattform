# FILE: /opt/nexifyai/repos/nexify-agentur-plattform/backend/inbox_triage/reviewer.py
# NIR: 28.07.2026 10:50
# NAME: NeXifyAI Inbox-Triage
# WHAT: Selbst-Review & Lern-Schleife — ehrlich, evidence-basiert
# WHY: Verify + Learn-Phase — Lessons Learned als Crystals speichern
# BEST-PRACTICE: Evidence-First; konkrete Lessons; Cross-Agent-Sharing
# PITFALL: V-21: Kein Schönreden — ehrliche Fehleranalyse; keine erfundenen Erfolge
# DEPENDS: agentmemory REST API
# DOCS-REF: /opt/nexifyai/docs/live/VOLL-AUTONOMIE-MODUS-2026-07-25.md

"""Selbst-Review & Lern-Schleife — Verify + Learn."""

import json
import os
from dataclasses import dataclass, field
from datetime import datetime, timezone

import requests

AGENTMEMORY_URL = os.environ.get("AGENTMEMORY_URL", "http://127.0.0.1:3111")


@dataclass
class ReviewVerdict:
    action_id: str
    passed: bool
    evidence: str
    what_went_wrong: str = ""
    lesson: str = ""
    reviewed_at: str = ""


@dataclass
class ReviewReport:
    verdicts: list[ReviewVerdict] = field(default_factory=list)
    pass_rate: float = 0.0
    lessons: list[str] = field(default_factory=list)
    created_at: str = ""
    summary: str = ""


# Review-Kriterien (8 — decken alle Qualitätsgates ab)
REVIEW_CRITERIA = [
    "AgentMemory vorher geladen? (memory_recall)",
    "Ergebnis verifiziert? (Evidence)",
    "Fehler/Retries dokumentiert?",
    "Ergebnis in AgentMemory gespeichert? (memory_save)",
    "Code getestet? (pytest)",
    "Relevante MCP-Server genutzt?",
    "Secrets vermieden?",
    "Arbeit nachvollziehbar dokumentiert?",
]


def review_action(action: dict) -> ReviewVerdict:
    """Eine einzelne Aktion reviewen — ehrlich und evidence-basiert.

    Bei Fehlern: Prüft Error-History, speichert Pattern, blockiert Wiederholungen.
    """
    verdict = ReviewVerdict(
        action_id=action.get("id", "unknown"),
        passed=True,
        evidence=action.get("result", action.get("summary", ""))[:200],
        reviewed_at=datetime.now(timezone.utc).isoformat(),
    )

    if action.get("error"):
        verdict.passed = False
        tool = action.get("tool", "unknown")
        verdict.what_went_wrong = str(action["error"])[:200]

        # Prüfe ob dieser Fehler schon bekannt ist (Kern-Imperativ III)
        is_repeated, repeat_count = check_error_history(tool, verdict.what_went_wrong)

        if is_repeated:
            verdict.lesson = (
                f"⚠️ WIEDERHOLTER FEHLER (#{repeat_count + 1}) bei {tool}: "
                f"{verdict.what_went_wrong[:80]} → Action BLOCKED bis Root-Cause-Analyse"
            )
            _auto_block_repeated_error(tool, verdict.what_went_wrong)
        else:
            verdict.lesson = (
                f"Fehler bei {tool}: {verdict.what_went_wrong[:100]} → "
                f"beim nächsten Mal: vorher Validierung/Cache/Fallback prüfen"
            )

        # Immer als Error-Pattern speichern (Kern-Imperativ III)
        save_error_pattern(tool, verdict.what_went_wrong, verdict.lesson)

    elif action.get("ok") is False:
        verdict.passed = False
        tool = action.get("tool", "unknown")
        verdict.what_went_wrong = action.get("summary", "unknown failure")

        is_repeated, _ = check_error_history(tool, verdict.what_went_wrong)
        if is_repeated:
            verdict.lesson = f"⚠️ WIEDERHOLTER FEHLER bei {tool}: {verdict.what_went_wrong[:80]} → BLOCKED"
            _auto_block_repeated_error(tool, verdict.what_went_wrong)
        else:
            verdict.lesson = f"Fehlgeschlagen: {tool} — {verdict.what_went_wrong[:100]}"

        save_error_pattern(tool, verdict.what_went_wrong, verdict.lesson)

    return verdict


def review_session(actions: list[dict]) -> ReviewReport:
    """Gesamte Session reviewen — alle Aktionen prüfen, Lessons sammeln."""
    report = ReviewReport(created_at=datetime.now(timezone.utc).isoformat())
    for action in actions:
        v = review_action(action)
        report.verdicts.append(v)
        if v.lesson:
            report.lessons.append(v.lesson)

    if report.verdicts:
        passed_count = sum(1 for v in report.verdicts if v.passed)
        report.pass_rate = passed_count / len(report.verdicts)

    report.summary = (
        f"Review: {report.pass_rate:.0%} Pass-Rate "
        f"({sum(1 for v in report.verdicts if v.passed)}/{len(report.verdicts)}), "
        f"{len(report.lessons)} Lessons Learned"
    )
    return report


def persist_lessons(report: ReviewReport) -> int:
    """Lessons Learned als Crystals in AgentMemory speichern.

    Returns:
        Anzahl erfolgreich persistierter Lessons.
    """
    secret = os.environ.get("AGENTMEMORY_SECRET", "")
    if not secret:
        return 0

    count = 0
    for lesson in report.lessons:
        try:
            r = requests.post(
                f"{AGENTMEMORY_URL}/agentmemory/remember",
                json={
                    "type": "crystal",
                    "content": lesson,
                    "tags": [
                        "lesson",
                        "review",
                        "learn",
                        "inbox-triage",
                        "cross-agent",
                    ],
                },
                headers={
                    "Authorization": f"Bearer {secret}",
                    "Content-Type": "application/json",
                },
                timeout=10,
            )
            if r.status_code == 200:
                count += 1
        except Exception:
            pass
    return count


def persist_review_report(report: ReviewReport) -> bool:
    """Gesamten Review-Report in AgentMemory speichern."""
    secret = os.environ.get("AGENTMEMORY_SECRET", "")
    if not secret:
        return False
    try:
        content = json.dumps(
            {
                "summary": report.summary,
                "pass_rate": report.pass_rate,
                "verdict_count": len(report.verdicts),
                "lesson_count": len(report.lessons),
                "lessons": report.lessons,
            },
            ensure_ascii=False,
        )
        r = requests.post(
            f"{AGENTMEMORY_URL}/agentmemory/remember",
            json={
                "type": "review",
                "content": content,
                "tags": ["review", "verify", "learn", "inbox-triage"],
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


def generate_optimizations(report: ReviewReport) -> list[str]:
    """Aus Lessons Learned proaktive Optimierungsvorschläge generieren."""
    optimizations = []
    fail_count = sum(1 for v in report.verdicts if not v.passed)
    if fail_count > len(report.verdicts) * 0.3:
        optimizations.append(
            f"Hohe Fehlerrate ({fail_count}/{len(report.verdicts)}) — "
            "Caching/Retry-Logik prüfen, Fallback-Strategien verbessern"
        )
    if report.pass_rate < 0.8:
        optimizations.append(
            f"Pass-Rate unter 80% ({report.pass_rate:.0%}) — "
            "Qualitätsgates verschärfen, Pre-Flight-Checks vor kritischen Aktionen"
        )
    if not report.lessons:
        optimizations.append(
            "Keine Lessons Learned — entweder alles perfekt (unwahrscheinlich) "
            "oder Review zu oberflächlich. Tiefere Analyse empfohlen."
        )
    return optimizations


# ─── Fehler-History + Wiederholungsschutz ─────────────────────


def check_error_history(action_type: str, error_msg: str) -> tuple[bool, int]:
    """Prüft ob dieser Fehler bereits in AgentMemory als Error-Pattern existiert.

    Returns:
        (is_repeated, count) — True wenn Fehler schon ≥1 mal passiert ist.
    """
    secret = os.environ.get("AGENTMEMORY_SECRET", "")
    if not secret:
        return (False, 0)
    try:
        query = f"{action_type} error pattern {error_msg[:80]}"
        r = requests.post(
            f"{AGENTMEMORY_URL}/agentmemory/smart-search",
            json={"query": query, "limit": 5},
            headers={
                "Authorization": f"Bearer {secret}",
                "Content-Type": "application/json",
            },
            timeout=10,
        )
        if r.status_code == 200:
            data = r.json()
            memories = data.get("memories", data.get("observations", []))
            # Zähle Matches die "error-pattern" im type/tags haben
            count = 0
            for m in memories:
                tags = m.get("tags", [])
                mtype = m.get("type", "")
                if "error-pattern" in tags or "error" in mtype.lower():
                    count += 1
            return (count > 0, count)
    except Exception:
        pass
    return (False, 0)


def save_error_pattern(tool: str, error_msg: str, lesson: str) -> bool:
    """Fehler als Error-Pattern in AgentMemory speichern — für Cross-Session-Learning."""
    secret = os.environ.get("AGENTMEMORY_SECRET", "")
    if not secret:
        return False
    try:
        content = json.dumps(
            {
                "tool": tool,
                "error": error_msg[:200],
                "lesson": lesson[:200],
                "timestamp": datetime.now(timezone.utc).isoformat(),
            },
            ensure_ascii=False,
        )
        r = requests.post(
            f"{AGENTMEMORY_URL}/agentmemory/remember",
            json={
                "type": "pattern",
                "content": content,
                "tags": ["error-pattern", "review", "avoid", tool, "inbox-triage"],
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


def _auto_block_repeated_error(tool: str, error_msg: str) -> bool:
    """Automatisch Action in AgentMemory als blocked setzen bei wiederholtem Fehler."""
    secret = os.environ.get("AGENTMEMORY_SECRET", "")
    if not secret:
        return False
    try:
        r = requests.post(
            f"{AGENTMEMORY_URL}/agentmemory/action-create",
            json={
                "title": f"BLOCKED: Wiederholter Fehler in {tool}",
                "description": f"Fehler '{error_msg[:100]}' ist erneut aufgetreten. Root-Cause-Analyse nötig.",
                "priority": 10,
                "status": "blocked",
                "tags": "error-pattern,blocked,auto,{tool}",
            },
            headers={
                "Authorization": f"Bearer {secret}",
                "Content-Type": "application/json",
            },
            timeout=10,
        )
        return r.status_code in (200, 201)
    except Exception:
        return False
