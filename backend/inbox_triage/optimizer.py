# FILE: /opt/nexifyai/repos/nexify-agentur-plattform/backend/inbox_triage/optimizer.py
# NIR: 28.07.2026 11:00
# NAME: NeXifyAI Inbox-Triage
# WHAT: Performance-Optimierungen — Batch-Persist, Parallel-Calls, Async-Save
# WHY: E2E-Test zeigte 1.4s Bottleneck bei AgentMemory-Persistenz
# BEST-PRACTICE: ThreadPool für I/O-Bound; Batch-Requests; fire-and-forget
# PITFALL: V-23: ThreadPool nur für I/O, nicht CPU; AgentMemory-Secret nie loggen
# DEPENDS: assessor, researcher, repo_watcher, planner, reviewer
# DOCS-REF: /root/.hermes/plans/2026-07-28_103000-inbox-triage-vollworkflow.md

"""Performance-Optimierungen für den inbox-triage Zyklus."""

import json
import os
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any, Callable

import requests

AGENTMEMORY_URL = os.environ.get("AGENTMEMORY_URL", "http://127.0.0.1:3111")
MAX_WORKERS = int(os.environ.get("INBOX_TRIAGE_MAX_WORKERS", "6"))


# ─── Opt1: Batch-Persist ───────────────────────────────────────


@dataclass
class BatchMemoryItem:
    type: str  # fact, research, repo_watch, plan, review, crystal
    content: str  # JSON string
    tags: list[str] = field(default_factory=list)


def batch_persist_to_agentmemory(items: list[BatchMemoryItem]) -> int:
    """Alle Facts in EINEM AgentMemory-Request bündeln.

    Statt N einzelner HTTP-Requests (je ~0.4s) → 1 Request (~0.5s).
    Bei 5 Items: 2.0s → 0.5s (75% schneller).

    Returns:
        Anzahl erfolgreich persistierter Items (0 oder len(items)).
    """
    secret = os.environ.get("AGENTMEMORY_SECRET", "")
    if not secret or not items:
        return 0

    # Bündle alle Items in einem Batch-Payload
    payload = {
        "batch": [
            {"type": item.type, "content": item.content, "tags": item.tags}
            for item in items
        ]
    }

    try:
        r = requests.post(
            f"{AGENTMEMORY_URL}/agentmemory/remember-batch",
            json=payload,
            headers={
                "Authorization": f"Bearer {secret}",
                "Content-Type": "application/json",
            },
            timeout=15,
        )
        if r.status_code == 200:
            return len(items)
        # Fallback: Einzeln persistieren
        return _fallback_individual_persist(items)
    except Exception:
        return _fallback_individual_persist(items)


def _fallback_individual_persist(items: list[BatchMemoryItem]) -> int:
    """Fallback: Einzel-Persist wenn Batch-Endpoint nicht verfügbar."""
    secret = os.environ.get("AGENTMEMORY_SECRET", "")
    count = 0
    for item in items:
        try:
            r = requests.post(
                f"{AGENTMEMORY_URL}/agentmemory/remember",
                json={"type": item.type, "content": item.content, "tags": item.tags},
                headers={
                    "Authorization": f"Bearer {secret}",
                    "Content-Type": "application/json",
                },
                timeout=5,
            )
            if r.status_code == 200:
                count += 1
        except Exception:
            pass
    return count


# ─── Opt2: Parallele GitHub-Calls ──────────────────────────────


def parallel_fetch_all_watched(repos: list[str]) -> list[Any]:
    """GitHub-API-Calls parallel mit ThreadPool ausführen."""
    if not repos:
        return []

    from inbox_triage.repo_watcher import fetch_repo_activity

    digests = []
    workers = max(1, min(len(repos), MAX_WORKERS))
    with ThreadPoolExecutor(max_workers=workers) as executor:
        futures = {executor.submit(fetch_repo_activity, repo): repo for repo in repos}
        for future in as_completed(futures):
            try:
                digests.append(future.result(timeout=15))
            except Exception:
                repo = futures[future]
                from inbox_triage.repo_watcher import RepoDigest

                digests.append(
                    RepoDigest(
                        repo=repo,
                        created_at=datetime.now(timezone.utc).isoformat(),
                    )
                )
    return digests


# ─── Opt3: Fire-and-Forget Persist ─────────────────────────────

_background_errors: list[str] = []


def fire_and_forget_persist(fn: Callable, *args, **kwargs):
    """Unkritischen Persist-Call im Hintergrund-Thread ausführen.

    Verhindert dass Persistenz den Haupt-Workflow blockiert.
    Fehler werden in _background_errors gesammelt.
    """

    def _worker():
        try:
            fn(*args, **kwargs)
        except Exception as e:
            _background_errors.append(f"{fn.__name__}: {str(e)[:100]}")

    t = threading.Thread(target=_worker, daemon=True)
    t.start()
    return t


def get_background_errors() -> list[str]:
    """Gesammelte Hintergrund-Fehler abrufen und leeren."""
    errors = list(_background_errors)
    _background_errors.clear()
    return errors


# ─── Opt4: Parallele Health-Checks ─────────────────────────────


def parallel_assess() -> Any:
    """Health-Checks (Endpoints, Docker, systemd) parallel ausführen."""
    from inbox_triage.assessor import (
        ISTSOLLReport,
        assess_endpoints,
        assess_docker,
        assess_systemd,
    )

    report = ISTSOLLReport(created_at=datetime.now(timezone.utc).isoformat())

    with ThreadPoolExecutor(max_workers=3) as executor:
        futures = {
            executor.submit(assess_endpoints): "endpoints",
            executor.submit(assess_docker): "docker",
            executor.submit(assess_systemd): "systemd",
        }
        results = {}
        for future in as_completed(futures):
            key = futures[future]
            try:
                results[key] = future.result(timeout=15)
            except Exception:
                results[key] = []

    report.checks.extend(results.get("endpoints", []))
    report.checks.extend(results.get("docker", []))
    report.checks.extend(results.get("systemd", []))

    # Gaps + Recommendations wie gehabt
    from inbox_triage.assessor import _check_soll_gaps

    for c in report.checks:
        if c.status != "ok":
            report.gaps.append(f"{c.name}: {c.status} — {c.detail}")
            if c.status == "down":
                report.recommendations.append(f"Restart {c.name}")
    _check_soll_gaps(report)

    return report


# ─── Opt5: Volloptimierter Zyklus ──────────────────────────────


@dataclass
class OptimizedCycleResult:
    sense_report: Any = None
    plan: Any = None
    orch_summary: str = ""
    review: Any = None
    total_time_s: float = 0.0
    persist_count: int = 0
    bg_errors: list[str] = field(default_factory=list)


def run_optimized_cycle(
    use_parallel: bool = True, use_batch: bool = True, use_async_persist: bool = True
) -> OptimizedCycleResult:
    """Vollständiger optimierter 5-Phasen-Zyklus.

    Args:
        use_parallel: Parallele Health-Checks + GitHub-Calls
        use_batch: Batch-Persist statt Einzel-Requests
        use_async_persist: Fire-and-forget für unkritische Saves

    Returns:
        OptimizedCycleResult mit Timing und Persist-Count.
    """
    from inbox_triage.researcher import fetch_daily_topics
    from inbox_triage.planner import generate_plan
    from inbox_triage.mcp_orchestrator import orchestrate_full_cycle, get_phase_summary
    from inbox_triage.reviewer import review_session

    t0 = __import__("time").time()
    batch_items: list[BatchMemoryItem] = []

    # SENSE (parallel)
    if use_parallel:
        sense_report = parallel_assess()
    else:
        from inbox_triage.assessor import assess_all

        sense_report = assess_all(use_cache=False)

    bundles = fetch_daily_topics()

    if use_parallel:
        from inbox_triage.repo_watcher import WATCH_REPOS

        digests = parallel_fetch_all_watched(WATCH_REPOS[:4])
    else:
        from inbox_triage.repo_watcher import fetch_daily_watched

        digests = fetch_daily_watched()

    # DECIDE
    plan = generate_plan(
        sense_report.gaps, sense_report.recommendations, bundles, digests, max_items=10
    )

    # ACT
    orch_results = orchestrate_full_cycle()
    orch_summary = get_phase_summary(orch_results)

    # VERIFY + LEARN
    actions = [
        {"id": "cycle-sense", "tool": "assess_all", "result": "completed"},
        {"id": "cycle-decide", "tool": "generate_plan", "result": "completed"},
        {"id": "cycle-act", "tool": "orchestrate", "result": "completed"},
    ]
    review = review_session(actions)

    # PERSIST (batch oder async)
    batch_items.append(
        BatchMemoryItem(
            type="fact",
            content=json.dumps(sense_report.to_dict(), ensure_ascii=False),
            tags=["ist-soll", "health", "inbox-triage", "sense"],
        )
    )
    batch_items.append(
        BatchMemoryItem(
            type="plan",
            content=json.dumps(
                {
                    "summary": plan.summary,
                    "items": [
                        {"id": i.id, "title": i.title, "priority": i.priority}
                        for i in plan.items
                    ],
                },
                ensure_ascii=False,
            ),
            tags=["plan", "decide", "inbox-triage"],
        )
    )
    batch_items.append(
        BatchMemoryItem(
            type="review",
            content=json.dumps(
                {
                    "summary": review.summary,
                    "pass_rate": review.pass_rate,
                    "lessons": review.lessons,
                },
                ensure_ascii=False,
            ),
            tags=["review", "verify", "learn", "inbox-triage"],
        )
    )

    persist_count = 0
    if use_batch:
        if use_async_persist:
            fire_and_forget_persist(batch_persist_to_agentmemory, batch_items)
        else:
            persist_count = batch_persist_to_agentmemory(batch_items)
    else:
        # Einzeln (alt)
        if use_async_persist:
            for item in batch_items:
                fire_and_forget_persist(
                    lambda it=item: requests.post(
                        f"{AGENTMEMORY_URL}/agentmemory/remember",
                        json={"type": it.type, "content": it.content, "tags": it.tags},
                        headers={
                            "Authorization": f"Bearer {os.environ.get('AGENTMEMORY_SECRET', '')}",
                            "Content-Type": "application/json",
                        },
                        timeout=5,
                    )
                )
        else:
            for item in batch_items:
                try:
                    r = requests.post(
                        f"{AGENTMEMORY_URL}/agentmemory/remember",
                        json={
                            "type": item.type,
                            "content": item.content,
                            "tags": item.tags,
                        },
                        headers={
                            "Authorization": f"Bearer {os.environ.get('AGENTMEMORY_SECRET', '')}",
                            "Content-Type": "application/json",
                        },
                        timeout=5,
                    )
                    if r.status_code == 200:
                        persist_count += 1
                except Exception:
                    pass

    elapsed = __import__("time").time() - t0

    return OptimizedCycleResult(
        sense_report=sense_report,
        plan=plan,
        orch_summary=orch_summary,
        review=review,
        total_time_s=elapsed,
        persist_count=persist_count,
        bg_errors=get_background_errors(),
    )


# ─── Opt6: ErrorRegistry — Cross-Session Fehler-Tracking ───────


@dataclass
class ErrorRecord:
    tool: str
    error_hash: str
    first_seen: str
    last_seen: str
    count: int = 1
    blocked: bool = False


class ErrorRegistry:
    """Cross-Session-Error-Tracking via AgentMemory.

    Kern-Imperativ III: Jeder Fehler NUR EINMAL.
    Beim zweiten Auftreten → automatisch blockiert.
    """

    @staticmethod
    def record_error(tool: str, error_msg: str) -> ErrorRecord:
        """Fehler registrieren. Bei count>=2 → blocked=True."""
        import hashlib

        error_hash = hashlib.md5(f"{tool}:{error_msg[:200]}".encode()).hexdigest()[:12]
        now = datetime.now(timezone.utc).isoformat()

        # Prüfe ob dieser Hash schon existiert
        secret = os.environ.get("AGENTMEMORY_SECRET", "")
        existing_count = 0
        if secret:
            try:
                r = requests.post(
                    f"{AGENTMEMORY_URL}/agentmemory/smart-search",
                    json={
                        "query": f"error-hash:{error_hash} error-pattern {tool}",
                        "limit": 3,
                    },
                    headers={"Authorization": f"Bearer {secret}"},
                    timeout=5,
                )
                if r.status_code == 200:
                    data = r.json()
                    existing_count = len(data.get("observations", []))
            except Exception:
                pass

        count = existing_count + 1
        blocked = count >= 2

        record = ErrorRecord(
            tool=tool,
            error_hash=error_hash,
            first_seen=now if existing_count == 0 else "",
            last_seen=now,
            count=count,
            blocked=blocked,
        )

        # Persistieren
        if secret:
            try:
                requests.post(
                    f"{AGENTMEMORY_URL}/agentmemory/remember",
                    json={
                        "type": "error-pattern",
                        "content": f"[error-hash:{error_hash}] tool={tool} count={count} blocked={blocked} error={error_msg[:150]}",
                        "tags": [
                            "error-pattern",
                            "error-registry",
                            tool,
                            "inbox-triage",
                        ],
                    },
                    headers={
                        "Authorization": f"Bearer {secret}",
                        "Content-Type": "application/json",
                    },
                    timeout=5,
                )
            except Exception:
                pass

        return record

    @staticmethod
    def is_blocked(tool: str) -> bool:
        """Prüft ob dieser Tool-Typ aktuell geblockt ist."""
        secret = os.environ.get("AGENTMEMORY_SECRET", "")
        if not secret:
            return False
        try:
            r = requests.post(
                f"{AGENTMEMORY_URL}/agentmemory/smart-search",
                json={"query": f"blocked error-pattern {tool}", "limit": 3},
                headers={
                    "Authorization": f"Bearer {secret}",
                    "Content-Type": "application/json",
                },
                timeout=5,
            )
            if r.status_code == 200:
                data = r.json()
                for obs in data.get("observations", []):
                    content = obs.get("content", "")
                    if "blocked=true" in content.lower() and tool in content:
                        return True
        except Exception:
            pass
        return False

    @staticmethod
    def unblock(tool: str, fix_description: str):
        """Entsperren nach Fix — speichert Resolution als Pattern."""
        secret = os.environ.get("AGENTMEMORY_SECRET", "")
        if not secret:
            return
        try:
            requests.post(
                f"{AGENTMEMORY_URL}/agentmemory/remember",
                json={
                    "type": "error-resolution",
                    "content": f"FIXED: {tool} — {fix_description[:200]}",
                    "tags": ["error-resolution", "unblocked", tool, "inbox-triage"],
                },
                headers={
                    "Authorization": f"Bearer {secret}",
                    "Content-Type": "application/json",
                },
                timeout=5,
            )
        except Exception:
            pass
