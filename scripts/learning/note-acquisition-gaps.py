#!/usr/bin/env python3
# FILE: /opt/nexifyai/repos/nexify-agentur-plattform/scripts/learning/note-acquisition-gaps.py
# NIR: 02.08.2026 10:10
# UPDATED: 02.08.2026 10:10
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI GTM
# WHAT: After session-learn — note acquisition/lead/conversion opportunities (fail-soft)
# WHY: Permanent proactivity; continuous learning must also capture GTM gaps
# BEST-PRACTICE: Call from session-learn.sh stop hook; never block agent; redact secrets
# PITFALL: V-GTM-LEARN-01: Do not invent paid-ads plans or fake review claims
# DEPENDS: AGENTMEMORY_URL optional; docs/gtm/ONGOING-GAP-AND-ACQUISITION-RADAR.md
# DOCS-REF: .cursor/rules/60-proactive-acquisition-gaps.mdc
# SESSION: proactive-gaps-acquisition-7dd5

"""Fail-soft helper: persist a short DE acquisition-gap note to AgentMemory.

Intended call site (after Continuous Learning PR merges):

  # near end of scripts/learning/session-learn.sh
  python3 scripts/learning/note-acquisition-gaps.py \\
    --summary "${SUMMARY:-Session-Ende}" || true

Standalone: python3 scripts/learning/note-acquisition-gaps.py --summary "…"
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
from zoneinfo import ZoneInfo

TZ = ZoneInfo("Europe/Berlin")
RADAR = "docs/gtm/ONGOING-GAP-AND-ACQUISITION-RADAR.md"
RULE = ".cursor/rules/60-proactive-acquisition-gaps.mdc"


def redact(text: str) -> str:
    patterns = [
        r"(?i)((?:api[_-]?key|token|secret|password|bearer|authorization)\s*[:=]\s*)\S+",
        r"(?i)ghp_[A-Za-z0-9]+",
        r"(?i)glpat-[A-Za-z0-9_-]+",
        r"(?i)sk-[A-Za-z0-9]+",
    ]
    out = text
    for p in patterns:
        out = re.sub(p, lambda m: (m.group(1) + "[REDACTED]") if m.lastindex else "[REDACTED]", out)
    return out[:2000]


def am_base() -> str:
    base = os.environ.get("AGENTMEMORY_URL", "http://127.0.0.1:3111").rstrip("/")
    if not base.endswith("/agentmemory"):
        base = f"{base}/agentmemory"
    return base


def memory_save(content: str) -> bool:
    url = f"{am_base()}/remember"
    body = json.dumps(
        {
            "content": content,
            "type": "workflow",
            "metadata": {
                "project": "nexify-agentur-plattform",
                "tags": ["acquisition", "gtm", "gap-radar", "session-learn"],
                "source": "note-acquisition-gaps.py",
            },
        }
    ).encode("utf-8")
    headers = {"Content-Type": "application/json"}
    secret = os.environ.get("AGENTMEMORY_SECRET", "").strip()
    if secret:
        headers["Authorization"] = f"Bearer {secret}"
    req = urllib.request.Request(url, data=body, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=4) as resp:
            return 200 <= resp.status < 300
    except (urllib.error.URLError, TimeoutError, OSError):
        return False


def main() -> int:
    parser = argparse.ArgumentParser(description="Note acquisition gaps after session-learn")
    parser.add_argument("--summary", default="", help="Session summary (DE preferred)")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    now = datetime.now(TZ).strftime("%Y-%m-%d %H:%M %Z")
    summary = redact(args.summary.strip() or "Session ohne Summary")
    note = (
        f"[ACQUISITION-GAP-NOTE] {now}\n"
        f"Session: {summary}\n"
        f"Pflicht: Radar prüfen ({RADAR}), Rule {RULE}.\n"
        "Scan: Lead/Conversion/Trust/Ops — Quick-Win fixen oder Issue gtm+agent-fix+P1.\n"
        "HARD: keine Fake-Reviews, kein Hermes-Cutover, keine Secrets, kein Paid-Ads-Spend.\n"
        "Nicht duplizieren: Blog #190, free GTM #175, Outreach #173, Revolut #205."
    )

    if args.dry_run:
        print(note)
        return 0

    ok = memory_save(note)
    # Always exit 0 — fail-soft for hooks
    print("acquisition-note:ok" if ok else "acquisition-note:soft-fail-am-down", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
