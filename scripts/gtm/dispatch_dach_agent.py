#!/usr/bin/env python3
"""Dispatch GTM DACH prompt to event-to-cloud-agent workflow."""
from __future__ import annotations

import argparse
import json
import os
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PROMPT_FILE = ROOT / ".cursor" / "automations" / "gtm-dach-content-to-agent.md"


def extract_prompt() -> str:
    text = PROMPT_FILE.read_text(encoding="utf-8")
    start = text.find("## Prompt")
    chunk = text[start:] if start >= 0 else text
    a = chunk.find("```")
    b = chunk.find("```", a + 3) if a >= 0 else -1
    if a >= 0 and b > a:
        body = chunk[a + 3 : b].strip()
    else:
        body = chunk.strip()
    return body


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--mode", default="blog")
    p.add_argument("--event-name", default="schedule")
    p.add_argument("--repo", required=True)
    p.add_argument("--run-id", default="manual")
    args = p.parse_args()

    token = (os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_TOKEN") or "").strip()
    if not token:
        print("skip: no GH_TOKEN")
        return 0

    prompt = extract_prompt()
    prompt = f"{prompt}\n\nMode hint: {args.mode}. Event: {args.event_name}. Run: {args.run_id}."
    payload = {
        "ref": "main",
        "inputs": {
            "prompt": prompt[:120000],
            "source": "gtm-dach",
            "auto_pr": "true",
        },
    }
    url = f"https://api.github.com/repos/{args.repo}/actions/workflows/event-to-cloud-agent.yml/dispatches"
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {token}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            print(f"workflow_dispatch status={resp.status}")
    except urllib.error.HTTPError as exc:
        print(f"dispatch_soft_fail http={exc.code}")
        print((exc.read() or b"")[:500].decode("utf-8", "replace"))
    except Exception as exc:  # noqa: BLE001
        print(f"dispatch_soft_fail err={type(exc).__name__}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
