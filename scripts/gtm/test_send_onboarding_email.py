#!/usr/bin/env python3
# FILE: scripts/gtm/test_send_onboarding_email.py
# SESSION: neukunden-begeisterung-7dd5
"""Unit checks for onboarding email hook (dry-run only)."""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SCRIPT = ROOT / "scripts" / "gtm" / "send-onboarding-email.py"


def run(template: str) -> dict:
    out = subprocess.check_output(
        [
            sys.executable,
            str(SCRIPT),
            "--template",
            template,
            "--to",
            "dryrun@example.com",
            "--name",
            "Test",
            "--slot",
            "Mo 10:00",
        ],
        text=True,
    )
    start = out.index("{")
    depth = 0
    end = start
    for i, ch in enumerate(out[start:], start=start):
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                end = i + 1
                break
    return json.loads(out[start:end])


def main() -> None:
    for t in ("lead_magnet", "booking_confirmed", "offer_sent"):
        meta = run(t)
        assert meta["template"] == t
        assert meta["mode"] == "dry-run"
        assert meta["html_chars"] > 100
    print("ok")


if __name__ == "__main__":
    main()
