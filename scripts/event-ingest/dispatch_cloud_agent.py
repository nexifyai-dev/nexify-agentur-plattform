#!/usr/bin/env python3
# FILE: scripts/event-ingest/dispatch_cloud_agent.py
# NIR: 02.08.2026 08:30
# UPDATED: 02.08.2026 08:35
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI DevOps
# WHAT: Launch Cursor Cloud Agent from CI/webhook events (PC-off path).
# WHY: Events must reach Cursor without a local IDE session.
# BEST-PRACTICE: Circuit breaker → AgentMemory Action → Cloud Agent create.
# PITFALL: V-CA-02: Never print CURSOR_API_KEY; skip launch if missing, queue Action.
# DEPENDS: CURSOR_API_KEY, tools/cursor_agents/client.py, optional CIRCUIT_BREAKER_URL
# DOCS-REF: docs/operations/CLOUD-AGENT-EVENT-INGEST.md
# SESSION: cloud-agent-event-ingest-7dd5
"""Dispatch a Cursor Cloud Agent from GitHub Actions / VPS Autopilot."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import sys
import urllib.request
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "tools" / "cursor_agents"))

try:
    from client import CursorAgentsClient, CursorAgentsError  # type: ignore
except ImportError:  # pragma: no cover
    CursorAgentsClient = None  # type: ignore
    CursorAgentsError = RuntimeError  # type: ignore


def _env(name: str, default: str = "") -> str:
    return (os.environ.get(name) or default).strip()


def circuit_check(tool: str, cost: float, state_hash: str) -> bool:
    url = _env("CIRCUIT_BREAKER_URL", "")
    if not url:
        return True
    payload = {
        "actor": "github-actions",
        "tool": tool,
        "params": {"source": "event-ingest"},
        "cost": cost,
        "state_hash": state_hash,
    }
    try:
        req = urllib.request.Request(
            f"{url.rstrip('/')}/check",
            data=json.dumps(payload).encode(),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode() or "{}")
        allow = bool(data.get("allow", True))
        if not allow:
            print(f"circuit_breaker_deny reason={data.get('reason')}")
        return allow
    except Exception as exc:  # noqa: BLE001
        print(f"circuit_breaker_unreachable soft_allow err={type(exc).__name__}")
        return True


def remember_action(
    title: str, description: str, tags: list[str]
) -> dict[str, Any] | None:
    token = _env("AGENTMEMORY_SECRET") or _env("AGENTMEMORY_TOKEN")
    if not token:
        print("agentmemory_skip: AGENTMEMORY_SECRET missing")
        return None
    base = _env("AGENTMEMORY_URL", "http://127.0.0.1:3111").rstrip("/")
    if "agentmemory" not in base:
        base = f"{base}/agentmemory"
    body = {
        "title": title,
        "description": description,
        "priority": 8,
        "tags": tags,
        "status": "pending",
    }
    for path, payload in (
        ("/actions", body),
        (
            "/remember",
            {
                "content": f"ACTION pending: {title}\n{description}",
                "type": "workflow",
                "concepts": tags,
                "project": "nexify-agentur-plattform",
            },
        ),
    ):
        try:
            req = urllib.request.Request(
                f"{base}{path}",
                data=json.dumps(payload).encode(),
                headers={
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json",
                },
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=12) as resp:
                raw = resp.read().decode()
                print(f"agentmemory_ok path={path}")
                return json.loads(raw) if raw else {}
        except Exception as exc:  # noqa: BLE001
            print(f"agentmemory_soft_fail path={path} err={type(exc).__name__}")
    return None


def build_prompt(args: argparse.Namespace) -> tuple[str, str, bool]:
    event = args.event_name
    reason = args.reason
    auto_pr = True

    if event == "workflow_dispatch":
        prompt = (
            _env("MANUAL_PROMPT")
            or "Investigate repository health and open a fix PR if needed."
        )
        source = _env("MANUAL_SOURCE", "manual")
        auto_pr = _env("MANUAL_AUTO_PR", "true").lower() in ("1", "true", "yes")
        dedupe = f"manual:{args.run_id}"
        return (
            f"""[NeXify Cloud Agent — PC-off event ingest]
Source: {source}
Reason: {reason}

{prompt}

Constraints:
- Repo scope: nexifyai-dev/nexify-agentur-plattform only
- Auto-push branch, open draft PR, label automerge when safe
- No Hermes production cutover; no secrets in commits
- Persist to AgentMemory when reachable
""",
            dedupe,
            auto_pr,
        )

    if event == "repository_dispatch":
        payload_raw = _env("CLIENT_PAYLOAD", "{}")
        try:
            payload = json.loads(payload_raw) if payload_raw else {}
        except json.JSONDecodeError:
            payload = {"raw": payload_raw}
        prompt = str(payload.get("prompt") or payload.get("message") or "")
        if not prompt:
            prompt = (
                f"Handle inbound alert type={_env('DISPATCH_TYPE')} payload="
                f"{json.dumps(payload, ensure_ascii=False)[:4000]}"
            )
        dedupe = str(
            payload.get("dedupe_key")
            or hashlib.sha256(prompt.encode()).hexdigest()[:16]
        )
        auto_pr = bool(payload.get("auto_pr", True))
        return (
            f"""[NeXify Cloud Agent — repository_dispatch]
Type: {_env("DISPATCH_TYPE")}
Reason: {reason}
Dedupe: {dedupe}

{prompt}

Fix-Loop: diagnose → commit → push → draft PR → checks → automerge if policy ok.
No force-push to main. No Hermes cutover.
""",
            dedupe,
            auto_pr,
        )

    if event == "workflow_run":
        wr_url = _env("WR_URL")
        prompt = f"""CI failed on {args.repo_url} (ref={args.ref}).
Workflow run: {wr_url}
Conclusion: {_env("WR_CONCLUSION")}

Investigate, fix on a branch, push, open/update PR, explain root cause.
"""
        dedupe = (
            f"ci:{hashlib.sha256((wr_url or args.run_id).encode()).hexdigest()[:16]}"
        )
        return (prompt, dedupe, True)

    if event == "issues":
        num = _env("ISSUE_NUMBER")
        title = _env("ISSUE_TITLE")
        body = _env("ISSUE_BODY")[:6000]
        prompt = f"""GitHub Issue #{num}: {title}

{body}

Triage and fix if actionable. Push branch + draft PR referencing #{num}.
"""
        auto_pr = "issue_label" in reason or "agent-fix" in reason
        dedupe = f"issue:{num}:{reason}"
        return (prompt, dedupe, auto_pr)

    if event == "pull_request":
        num = _env("PR_NUMBER")
        title = _env("PR_TITLE")
        body = _env("PR_BODY")[:4000]
        prompt = f"""PR #{num} labeled for agent fix: {title}

{body}

Inspect CI/diff, push fixes to the PR branch, keep scope minimal.
"""
        dedupe = f"pr:{num}:{reason}"
        return (prompt, dedupe, False)

    prompt = f"Unhandled event={event} reason={reason}. Inspect repo health and report."
    return (prompt, f"other:{args.run_id}", True)


def already_launched(dedupe: str) -> bool:
    state_dir = Path(
        os.environ.get("EVENT_INGEST_STATE_DIR", "/tmp/nexify-event-ingest")
    )
    try:
        state_dir.mkdir(parents=True, exist_ok=True)
        marker = state_dir / f"{dedupe}.done"
        if marker.exists():
            return True
        marker.write_text(
            json.dumps(
                {"ts": __import__("datetime").datetime.utcnow().isoformat() + "Z"}
            )
        )
        return False
    except OSError:
        return False


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--repo-url", required=True)
    p.add_argument("--ref", default="main")
    p.add_argument("--event-name", required=True)
    p.add_argument("--reason", default="unknown")
    p.add_argument("--run-id", default="local")
    p.add_argument("--action-only", action="store_true")
    p.add_argument("--force", action="store_true")
    args = p.parse_args()

    prompt, dedupe, auto_pr = build_prompt(args)
    title = f"[event-ingest] {args.event_name}:{args.reason} ({dedupe})"
    remember_action(
        title=title,
        description=prompt[:4000],
        tags=["event-ingest", "cloud-agent", args.event_name, "pending"],
    )

    if not args.force and already_launched(dedupe):
        print(f"dedupe_skip key={dedupe}")
        return 0

    state_hash = hashlib.sha256(f"{dedupe}:{args.run_id}".encode()).hexdigest()[:24]
    if not circuit_check("cursor_cloud_agent_create", cost=0.5, state_hash=state_hash):
        print("blocked_by_circuit_breaker")
        return 0

    api_key = _env("CURSOR_API_KEY")
    if args.action_only or not api_key:
        print("launch_skipped: CURSOR_API_KEY missing or --action-only (Action queued)")
        return 0

    if CursorAgentsClient is None:
        print("launch_failed: cursor_agents client import error", file=sys.stderr)
        return 1

    try:
        client = CursorAgentsClient(api_key=api_key)
        result = client.create_agent(
            prompt,
            name=f"event-{args.event_name}-{dedupe[:12]}",
            repos=[{"url": args.repo_url, "startingRef": args.ref}],
            auto_create_pr=auto_pr,
        )
        agent_id = result.get("id") or result.get("agentId") or result.get("agent_id")
        print(
            json.dumps(
                {"ok": True, "agent_id": agent_id, "dedupe": dedupe, "auto_pr": auto_pr}
            )
        )
        return 0
    except CursorAgentsError as exc:
        print(
            f"launch_api_error status={exc.status} code={exc.code} msg={exc.message}",
            file=sys.stderr,
        )
        return 1
    except Exception as exc:  # noqa: BLE001
        print(f"launch_error type={type(exc).__name__}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
