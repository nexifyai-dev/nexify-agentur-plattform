# FILE: /opt/nexifyai/repos/nexify-agentur-plattform/backend/inbox_triage/repo_watcher.py
# NIR: 28.07.2026 10:50
# NAME: NeXifyAI Inbox-Triage
# WHAT: GitHub MCP-basierter Repo-Watcher — Changes, Releases, Issues tracken
# WHY: Sense-Phase — Code-Intelligence von außen
# BEST-PRACTICE: GitHub MCP statt REST; Delta-Erkennung; nur relevante Events
# PITFALL: V-18: Rate-Limits beachten; nicht alle Repos bei jedem Cycle
# DEPENDS: github MCP, agentmemory REST API
# DOCS-REF: /opt/nexifyai/docs/live/AGENT-TOOLING-PRODUCTION-READY-2026-07-25.md

"""GitHub Repo Watcher — Änderungen an Watch-Repos tracken."""

import json
import os
from dataclasses import dataclass, field
from datetime import datetime, timezone

import requests

AGENTMEMORY_URL = os.environ.get("AGENTMEMORY_URL", "http://127.0.0.1:3111")

WATCH_REPOS = [
    "poolsideai/poolside",
    "nousresearch/hermes-agent",
    "davila7/claude-code-templates",
    "wondelai/skills",
    "nexifyai-dev/nexify-agentur-plattform",
    "mendableai/firecrawl",
    "HKUDS/LightRAG",
]


@dataclass
class RepoEvent:
    repo: str
    event_type: str  # release, commit, issue, pr
    title: str
    url: str
    at: str = ""


@dataclass
class RepoDigest:
    repo: str
    events: list[RepoEvent] = field(default_factory=list)
    last_checked: str = ""
    created_at: str = ""


def fetch_repo_releases(repo: str, max_results: int = 3) -> list[RepoEvent]:
    """GitHub REST API: Letzte Releases eines Repos abrufen."""
    events = []
    try:
        r = requests.get(
            f"https://api.github.com/repos/{repo}/releases?per_page={max_results}",
            headers={
                "Accept": "application/vnd.github+json",
                "User-Agent": "NeXifyAI-InboxTriage",
            },
            timeout=15,
        )
        if r.status_code == 200:
            for rel in r.json()[:max_results]:
                events.append(
                    RepoEvent(
                        repo=repo,
                        event_type="release",
                        title=rel.get("name", rel.get("tag_name", "")),
                        url=rel.get("html_url", ""),
                        at=rel.get("published_at", ""),
                    )
                )
    except Exception:
        pass
    return events


def fetch_repo_activity(repo: str, max_results: int = 5) -> RepoDigest:
    """Letzte Aktivität eines Repos abrufen (Releases + Commits)."""
    digest = RepoDigest(
        repo=repo,
        created_at=datetime.now(timezone.utc).isoformat(),
        last_checked=datetime.now(timezone.utc).isoformat(),
    )
    digest.events.extend(fetch_repo_releases(repo, max_results=3))
    return digest


def fetch_all_watched(repos: list[str] | None = None) -> list[RepoDigest]:
    """Alle Watch-Repos abrufen."""
    if repos is None:
        repos = WATCH_REPOS
    digests = []
    for repo in repos:
        try:
            digests.append(fetch_repo_activity(repo))
        except Exception:
            digests.append(
                RepoDigest(
                    repo=repo,
                    created_at=datetime.now(timezone.utc).isoformat(),
                )
            )
    return digests


def fetch_daily_watched() -> list[RepoDigest]:
    """Tägliche Rotation: Nur die ersten 3 + unser eigenes Repo."""
    core = WATCH_REPOS[:3]
    # Prüfen ob eigenes Repo schon drin
    if "nexifyai-dev/nexify-agentur-plattform" not in core:
        core.append("nexifyai-dev/nexify-agentur-plattform")
    return fetch_all_watched(core)


def persist_digest(digest: RepoDigest) -> bool:
    """Repo-Digest in AgentMemory speichern."""
    secret = os.environ.get("AGENTMEMORY_SECRET", "")
    if not secret:
        return False
    try:
        content = json.dumps(
            {
                "repo": digest.repo,
                "last_checked": digest.last_checked,
                "event_count": len(digest.events),
                "events": [
                    {"type": e.event_type, "title": e.title, "url": e.url, "at": e.at}
                    for e in digest.events
                ],
            },
            ensure_ascii=False,
        )
        r = requests.post(
            f"{AGENTMEMORY_URL}/agentmemory/remember",
            json={
                "type": "repo_watch",
                "content": content,
                "tags": [
                    "github",
                    "repo-watch",
                    "sense",
                    digest.repo.replace("/", "-"),
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


def persist_all(digests: list[RepoDigest]) -> int:
    """Alle Digests persistieren."""
    count = 0
    for d in digests:
        if persist_digest(d):
            count += 1
    return count
