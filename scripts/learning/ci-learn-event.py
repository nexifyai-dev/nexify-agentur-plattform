#!/usr/bin/env python3
# FILE: scripts/learning/ci-learn-event.py
# NIR: 02.08.2026 10:05
# UPDATED: 02.08.2026 10:05
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI DevOps
# WHAT: Persist CI success/failure learning events to AgentMemory (+ optional LightRAG).
# WHY: Merge green and CI fail must become durable lessons without requiring CURSOR_API_KEY.
# BEST-PRACTICE: Soft-skip without AGENTMEMORY_SECRET; never log secrets; DE + Europe/Berlin.
# PITFALL: V-LEARN-03: Treating missing CURSOR_API_KEY as hard fail — degrade to AM-only.
# DEPENDS: AGENTMEMORY_URL/SECRET; optional LIGHTRAG_URL + LIGHTRAG_API_KEY
# DOCS-REF: docs/operations/CONTINUOUS-LEARNING.md
# SESSION: continuous-learning-7dd5
"""CI/CD learning event writer for GitHub Actions."""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import urllib.error
import urllib.request
from datetime import datetime
from typing import Any
from zoneinfo import ZoneInfo

REPO = "nexify-agentur-plattform"
TZ = ZoneInfo("Europe/Berlin")
SECRET_RE = re.compile(
    r"(?i)((?:api[_-]?key|token|secret|password|bearer|authorization)\s*[:=]\s*)\S+"
    r"|ghp_[A-Za-z0-9]+"
    r"|glpat-[A-Za-z0-9_-]+"
)


def redact(text: str) -> str:
    return SECRET_RE.sub(
        lambda m: (m.group(1) + "[REDACTED]") if m.group(1) else "[REDACTED]", text
    )[:3500]


def am_base() -> str:
    base = (os.environ.get("AGENTMEMORY_URL") or "http://127.0.0.1:3111").rstrip("/")
    if not base.endswith("/agentmemory"):
        base = f"{base}/agentmemory"
    return base


def post_json(url: str, body: dict[str, Any], headers: dict[str, str]) -> tuple[int, bool]:
    req = urllib.request.Request(
        url,
        data=json.dumps(body).encode(),
        headers=headers,
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=12) as resp:
            return resp.status, resp.status in (200, 201, 202)
    except urllib.error.HTTPError as exc:
        return exc.code, False
    except Exception:  # noqa: BLE001
        return 0, False


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--outcome", required=True, choices=("success", "failure", "merged"))
    p.add_argument("--source", default="ci")
    p.add_argument("--ref", default="")
    p.add_argument("--run-url", default="")
    p.add_argument("--title", default="")
    p.add_argument("--details", default="")
    args = p.parse_args()

    secret = (os.environ.get("AGENTMEMORY_SECRET") or os.environ.get("AGENTMEMORY_TOKEN") or "").strip()
    if not secret:
        print("ci-learn-event: soft_skip AGENTMEMORY_SECRET missing")
        return 0

    now = datetime.now(TZ).strftime("%Y-%m-%d %H:%M:%S %Z")
    title = redact(args.title or f"CI {args.outcome}")
    details = redact(args.details or "")
    ref = args.ref or "unknown"
    run_url = args.run_url  # URLs ok; no secrets

    if args.outcome == "failure":
        content = (
            f"CI-Fehler ({now}, Europe/Berlin): {title}. Ref={ref}. "
            f"Details: {details or 'siehe run_url'}. Run: {run_url}. "
            f"Error-Pattern speichern und Fix-Branch öffnen."
        )
        tags = ["continuous-learning", "ci-failure", "error-pattern", "de"]
        mem_type = "bug"
        confidence = 0.65
    elif args.outcome == "merged":
        content = (
            f"Merge erfolgreich ({now}, Europe/Berlin): {title}. Ref={ref}. "
            f"{details} Run: {run_url}. Crystal-Kandidat — Wiederverwendbares Muster prüfen."
        )
        tags = ["continuous-learning", "ci-success", "merge", "crystal-candidate", "de"]
        mem_type = "workflow"
        confidence = 0.6
    else:
        content = (
            f"CI grün ({now}, Europe/Berlin): {title}. Ref={ref}. "
            f"{details} Run: {run_url}."
        )
        tags = ["continuous-learning", "ci-success", "de"]
        mem_type = "workflow"
        confidence = 0.55

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {secret}",
    }
    base = am_base()
    out: dict[str, Any] = {"outcome": args.outcome, "am": {}, "lightrag": None}

    lesson = {
        "content": content,
        "confidence": confidence,
        "context": f"ci-learn|{REPO}|{args.source}|Europe/Berlin|DE",
        "tags": tags,
    }
    remember = {
        "content": content,
        "type": mem_type,
        "project": REPO,
        "concepts": tags + [args.source],
    }

    for path, body, key in (("/lessons", lesson, "lesson"), ("/remember", remember, "remember")):
        code, ok = post_json(f"{base}{path}", body, headers)
        out["am"][key] = {"status": code, "ok": ok}

    lr = (os.environ.get("LIGHTRAG_URL") or "").rstrip("/")
    lr_key = (os.environ.get("LIGHTRAG_API_KEY") or "").strip()
    if lr:
        lr_headers = {"Content-Type": "application/json"}
        if lr_key:
            lr_headers["X-API-Key"] = lr_key
        text = f"# CI Learning Event\n{content}\nQuelle: scripts/learning/ci-learn-event.py\n"
        code, ok = post_json(
            f"{lr}/documents/text",
            {
                "text": text,
                "file_source": f"continuous-learning/ci/{args.outcome}/{ref}",
            },
            lr_headers,
        )
        out["lightrag"] = {"status": code, "ok": ok}

    # Optional: note that Cloud Agent launch is separate (event-to-cloud-agent)
    if args.outcome == "failure" and not (os.environ.get("CURSOR_API_KEY") or "").strip():
        out["cloud_agent"] = "degraded_no_CURSOR_API_KEY_am_only"

    print(json.dumps(out, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
