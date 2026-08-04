# FILE: backend/tests/unit/test_lead_sla.py
# NIR: 04.08.2026 09:45
# UPDATED: 04.08.2026 09:45
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Unit tests for Lead-SLA business-hour helper and schema migration entries.
# WHY: Issue #215 — ensure SLA measurement logic is correct offline.
# BEST-PRACTICE: No network, no DB; pure logic tests.
# PITFALL: V-SLA-01: Do not import server at module level (triggers env reads).
# DEPENDS: pytest, stdlib datetime
# DOCS-REF: docs/governance/

from __future__ import annotations

import ast
import importlib.util
import sys
import types
from datetime import datetime, timezone, timedelta
from pathlib import Path

import pytest

BACKEND_ROOT = Path(__file__).resolve().parents[2]


# ---------------------------------------------------------------------------
# Helpers to load _is_business_hours_elapsed without running server startup
# ---------------------------------------------------------------------------

def _load_helper():
    """Import _is_business_hours_elapsed directly from server.py source."""
    src = (BACKEND_ROOT / "server.py").read_text(encoding="utf-8")
    tree = ast.parse(src, filename="server.py")

    # Extract the function source lines
    func_src = None
    for node in ast.walk(tree):
        if isinstance(node, ast.FunctionDef) and node.name == "_is_business_hours_elapsed":
            lines = src.splitlines()
            func_src = "\n".join(lines[node.lineno - 1 : node.end_lineno])
            break

    assert func_src is not None, "_is_business_hours_elapsed not found in server.py"

    # Build a minimal module and exec the function into it
    mod = types.ModuleType("_sla_helper")
    mod.__dict__.update({"timedelta": timedelta, "timezone": timezone, "datetime": datetime})
    exec(compile(func_src, "server.py", "exec"), mod.__dict__)  # noqa: S102
    return mod.__dict__["_is_business_hours_elapsed"]


_is_business_hours_elapsed = _load_helper()


# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------

@pytest.mark.unit
def test_sla_not_breached_same_hour():
    now = datetime(2026, 8, 3, 10, 0, tzinfo=timezone.utc)  # Monday 10:00 UTC = 11:00 local
    created = datetime(2026, 8, 3, 9, 30, tzinfo=timezone.utc)  # 30 min ago
    assert not _is_business_hours_elapsed(created, now, hours=8)


@pytest.mark.unit
def test_sla_breached_after_one_full_business_day():
    # Created Monday 08:00 local (07:00 UTC), checked Tuesday 17:00 local (16:00 UTC)
    created = datetime(2026, 8, 3, 7, 0, tzinfo=timezone.utc)   # Mon 08:00 local
    now = datetime(2026, 8, 4, 16, 0, tzinfo=timezone.utc)       # Tue 17:00 local
    assert _is_business_hours_elapsed(created, now, hours=8)


@pytest.mark.unit
def test_sla_weekend_not_counted():
    # Created Friday 16:00 local (15:00 UTC); "now" is Monday 08:00 local (07:00 UTC).
    # Only 2 business hours elapsed (16:00–18:00 Fri) — should NOT be breached.
    created = datetime(2026, 7, 31, 15, 0, tzinfo=timezone.utc)  # Fri 16:00 local
    now = datetime(2026, 8, 3, 7, 0, tzinfo=timezone.utc)         # Mon 08:00 local
    assert not _is_business_hours_elapsed(created, now, hours=8)


@pytest.mark.unit
def test_sla_breached_after_monday_plus_hours():
    # Created Friday 17:00 local (16:00 UTC), checked Monday 18:00 local (17:00 UTC)
    # Fri: 1 biz hour (17–18), Mon: 8 biz hours (08–17) → 9 h → breached
    created = datetime(2026, 7, 31, 16, 0, tzinfo=timezone.utc)  # Fri 17:00 local
    now = datetime(2026, 8, 3, 17, 0, tzinfo=timezone.utc)        # Mon 18:00 local
    assert _is_business_hours_elapsed(created, now, hours=8)


@pytest.mark.unit
def test_schema_contains_sla_columns():
    src = (BACKEND_ROOT / "server.py").read_text(encoding="utf-8")
    assert "first_human_response_at" in src, "SCHEMA migration for first_human_response_at missing"
    assert "sla_alert_sent" in src, "SCHEMA migration for sla_alert_sent missing"


@pytest.mark.unit
def test_schema_contains_sla_metric():
    src = (BACKEND_ROOT / "server.py").read_text(encoding="utf-8")
    assert "nexify_lead_sla_breached" in src, "Prometheus metric nexify_lead_sla_breached missing"


@pytest.mark.unit
def test_lead_sla_worker_defined():
    src = (BACKEND_ROOT / "server.py").read_text(encoding="utf-8")
    tree = ast.parse(src, filename="server.py")
    names = [
        n.name
        for n in ast.walk(tree)
        if isinstance(n, (ast.AsyncFunctionDef, ast.FunctionDef))
    ]
    assert "lead_sla_worker" in names, "lead_sla_worker async function not found in server.py"
