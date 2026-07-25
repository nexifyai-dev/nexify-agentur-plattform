# FILE: /backend/flowsearch/mandate.py
"""Helpers asserting FlowSearch knowledge Nutzungspflicht from Python code."""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def assert_mandate() -> None:
    script = ROOT / "scripts/check_knowledge_mandate.py"
    proc = subprocess.run([sys.executable, str(script)], capture_output=True, text=True, check=False)
    if proc.returncode != 0:
        raise RuntimeError(proc.stdout + proc.stderr)


def require_for_workflow_change(task_kind: str = "agentic-workflow-design") -> None:
    """Call at start of any code path that mutates agentic workflows."""
    if task_kind in {"agentic-workflow-design", "llm-pipeline-change"}:
        assert_mandate()
