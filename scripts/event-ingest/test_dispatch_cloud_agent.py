#!/usr/bin/env python3
# FILE: scripts/event-ingest/test_dispatch_cloud_agent.py
# NIR: 04.08.2026 09:35
# UPDATED: 04.08.2026 09:35
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI DevOps
# WHAT: Targeted tests for dry-run behavior of the cloud-agent dispatch script.
# WHY: The P0 event-ingest path must be verifiable without real human-owned secrets.
# BEST-PRACTICE: Test the smallest stable contract: action queue path and missing-secret skip.
# PITFALL: V-CA-04: Never require or print real CURSOR_API_KEY values in tests.
# DEPENDS: pytest, scripts/event-ingest/dispatch_cloud_agent.py
# DOCS-REF: docs/operations/CLOUD-AGENT-EVENT-INGEST.md

from __future__ import annotations

import importlib.util
import os
import sys
from pathlib import Path


def _load_module():
    path = Path(__file__).resolve().parent / "dispatch_cloud_agent.py"
    spec = importlib.util.spec_from_file_location("dispatch_cloud_agent", path)
    module = importlib.util.module_from_spec(spec)
    assert spec is not None and spec.loader is not None
    spec.loader.exec_module(module)
    return module


def test_main_skips_launch_in_action_only_mode(capsys, monkeypatch, tmp_path):
    module = _load_module()
    monkeypatch.setenv("EVENT_INGEST_STATE_DIR", str(tmp_path))
    monkeypatch.delenv("CURSOR_API_KEY", raising=False)
    monkeypatch.delenv("AGENTMEMORY_SECRET", raising=False)
    monkeypatch.setattr(
        sys,
        "argv",
        [
            "dispatch_cloud_agent.py",
            "--repo-url",
            "https://github.com/nexifyai-dev/nexify-agentur-plattform",
            "--ref",
            "main",
            "--event-name",
            "workflow_dispatch",
            "--reason",
            "smoke",
            "--run-id",
            "t1",
            "--action-only",
        ],
    )

    rc = module.main()
    out = capsys.readouterr().out

    assert rc == 0
    assert "launch_skipped: CURSOR_API_KEY missing or --action-only" in out


def test_main_skips_launch_when_secret_missing(capsys, monkeypatch, tmp_path):
    module = _load_module()
    monkeypatch.setenv("EVENT_INGEST_STATE_DIR", str(tmp_path))
    monkeypatch.delenv("CURSOR_API_KEY", raising=False)
    monkeypatch.delenv("AGENTMEMORY_SECRET", raising=False)
    monkeypatch.setenv("MANUAL_PROMPT", "Smoke triage")
    monkeypatch.setattr(
        sys,
        "argv",
        [
            "dispatch_cloud_agent.py",
            "--repo-url",
            "https://github.com/nexifyai-dev/nexify-agentur-plattform",
            "--ref",
            "main",
            "--event-name",
            "workflow_dispatch",
            "--reason",
            "smoke",
            "--run-id",
            "t2",
        ],
    )

    rc = module.main()
    out = capsys.readouterr().out

    assert rc == 0
    assert "launch_skipped: CURSOR_API_KEY missing or --action-only" in out
