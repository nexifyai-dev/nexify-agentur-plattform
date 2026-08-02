#!/usr/bin/env python3
# FILE: scripts/gtm/test_prepare_directory_drafts.py
# NIR: 02.08.2026 09:30
# UPDATED: 02.08.2026 09:30
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI GTM
# WHAT: Smoke-Test für prepare_directory_drafts.py
# SESSION: free-acquisition-dach-7dd5

from __future__ import annotations

import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def test_dry_run_exits_zero() -> None:
    r = subprocess.run(
        [sys.executable, str(ROOT / "scripts/gtm/prepare_directory_drafts.py"), "--dry-run", "--limit", "2"],
        cwd=ROOT,
        capture_output=True,
        text=True,
        check=False,
    )
    assert r.returncode == 0, r.stderr
    assert "dry_run" in r.stdout or "no_channels" in r.stdout


def test_brand_short_nonempty() -> None:
    sys.path.insert(0, str(ROOT / "scripts" / "gtm"))
    import prepare_directory_drafts as m  # noqa: E402

    s = m.brand_short()
    assert "NeXify" in s or "449" in s
    assert len(s) > 40


if __name__ == "__main__":
    test_dry_run_exits_zero()
    test_brand_short_nonempty()
    print("ok")
