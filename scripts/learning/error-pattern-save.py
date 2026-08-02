#!/usr/bin/env python3
# FILE: scripts/learning/error-pattern-save.py
# NIR: 02.08.2026 10:00
# UPDATED: 02.08.2026 10:00
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI DevOps
# WHAT: Save Error-Patterns as AgentMemory lessons (type error / tags error-pattern).
# WHY: Failures must become durable PITFALL lessons, never lost after a session.
# BEST-PRACTICE: stdin or CLI args; redact secrets; fail soft (exit 0) when AM down.
# PITFALL: V-LEARN-02: Storing raw tokens in lesson content — always redact.
# DEPENDS: AGENTMEMORY_URL, optional AGENTMEMORY_SECRET; optional LIGHTRAG_URL+API_KEY
# DOCS-REF: docs/operations/CONTINUOUS-LEARNING.md
# SESSION: continuous-learning-7dd5
"""Persist an Error-Pattern to AgentMemory (+ optional LightRAG).

Usage:
  python3 scripts/learning/error-pattern-save.py --pitfall V-99 --summary "..." --fix "..."
  echo '{"pitfall":"V-99","summary":"...","fix":"..."}' | python3 scripts/learning/error-pattern-save.py --stdin
"""

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
    r"|sk-[A-Za-z0-9]+"
)


def redact(text: str) -> str:
    return SECRET_RE.sub(lambda m: (m.group(1) + "[REDACTED]") if m.group(1) else "[REDACTED]", text)[
        :4000
    ]


def am_base() -> str:
    base = (os.environ.get("AGENTMEMORY_URL") or "http://127.0.0.1:3111").rstrip("/")
    if not base.endswith("/agentmemory"):
        base = f"{base}/agentmemory"
    return base


def post_json(url: str, body: dict[str, Any], headers: dict[str, str]) -> tuple[int, str]:
    req = urllib.request.Request(
        url,
        data=json.dumps(body).encode(),
        headers=headers,
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            return resp.status, resp.read().decode()[:500]
    except urllib.error.HTTPError as exc:
        return exc.code, (exc.read().decode() or "")[:500]
    except Exception as exc:  # noqa: BLE001
        return 0, f"{type(exc).__name__}:{exc}"


def main() -> int:
    parser = argparse.ArgumentParser(description="Save Error-Pattern to AgentMemory")
    parser.add_argument("--pitfall", default="", help="PITFALL id e.g. V-42")
    parser.add_argument("--summary", default="", help="Short failure summary (DE)")
    parser.add_argument("--fix", default="", help="Root-cause + remediation (DE)")
    parser.add_argument("--tags", default="", help="Extra comma-separated tags")
    parser.add_argument("--stdin", action="store_true", help="Read JSON from stdin")
    parser.add_argument("--no-lightrag", action="store_true", help="Skip LightRAG insert")
    parser.add_argument("--dry-run", action="store_true", help="Print payload only")
    args = parser.parse_args()

    pitfall = args.pitfall.strip()
    summary = args.summary.strip()
    fix = args.fix.strip()
    extra_tags = [t.strip() for t in args.tags.split(",") if t.strip()]

    if args.stdin:
        raw = sys.stdin.read().strip()
        if raw:
            try:
                data = json.loads(raw)
            except json.JSONDecodeError:
                data = {"summary": raw}
            pitfall = str(data.get("pitfall") or pitfall or "V-UNSET").strip()
            summary = str(data.get("summary") or summary or "").strip()
            fix = str(data.get("fix") or data.get("remediation") or fix or "").strip()
            if isinstance(data.get("tags"), list):
                extra_tags.extend(str(t) for t in data["tags"])

    if not summary:
        print("error-pattern-save: missing --summary or stdin", file=sys.stderr)
        return 0  # fail soft

    pitfall = pitfall or "V-UNSET"
    now = datetime.now(TZ).strftime("%Y-%m-%d %H:%M:%S %Z")
    summary = redact(summary)
    fix = redact(fix)

    lesson_content = (
        f"Error-Pattern {pitfall} ({now}, Europe/Berlin): {summary}. "
        f"Fix/Remediation: {fix or 'noch offen — beim nächsten Auftreten ergänzen'}."
    )
    tags = ["error-pattern", f"pitfall-{pitfall}", "continuous-learning", "de"] + extra_tags

    lesson_body = {
        "content": lesson_content,
        "confidence": 0.7,
        "context": f"error-pattern|{REPO}|{pitfall}|DE",
        "tags": tags,
    }
    remember_body = {
        "content": lesson_content,
        "type": "bug",
        "project": REPO,
        "concepts": tags,
    }

    if args.dry_run:
        print(json.dumps({"lesson": lesson_body, "remember": remember_body}, ensure_ascii=False, indent=2))
        return 0

    secret = (os.environ.get("AGENTMEMORY_SECRET") or os.environ.get("AGENTMEMORY_TOKEN") or "").strip()
    headers = {"Content-Type": "application/json"}
    if secret:
        headers["Authorization"] = f"Bearer {secret}"

    base = am_base()
    out: dict[str, Any] = {"pitfall": pitfall, "am": {}, "lightrag": None}

    for path, body, key in (
        ("/lessons", lesson_body, "lesson"),
        ("/remember", remember_body, "remember"),
    ):
        code, raw = post_json(f"{base}{path}", body, headers)
        out["am"][key] = {"status": code, "ok": code in (200, 201)}

    if not args.no_lightrag:
        lr = (os.environ.get("LIGHTRAG_URL") or "").rstrip("/")
        lr_key = (os.environ.get("LIGHTRAG_API_KEY") or "").strip()
        if lr:
            lr_headers = {"Content-Type": "application/json"}
            if lr_key:
                lr_headers["X-API-Key"] = lr_key
            text = (
                f"# Error-Pattern {pitfall}\nZeit: {now}\n"
                f"Summary: {summary}\nFix: {fix}\n"
                f"Quelle: scripts/learning/error-pattern-save.py\n"
            )
            code, raw = post_json(
                f"{lr}/documents/text",
                {"text": text, "file_source": f"continuous-learning/error-pattern/{pitfall}"},
                lr_headers,
            )
            out["lightrag"] = {"status": code, "ok": code in (200, 201, 202)}

    print(json.dumps(out, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
