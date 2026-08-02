# FILE: backend/tests/unit/test_offline_contracts.py
# NIR: 02.08.2026 09:45
# UPDATED: 02.08.2026 09:50
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Offline unit contracts — AST/syntax without remote DB.
# WHY: Issue #167 — fail-hard CI lane separate from integration tests.
# BEST-PRACTICE: No network; no REACT_APP_BACKEND_URL.
# PITFALL: V-CI-01: Do not assert live supabase/db here.
# DEPENDS: pytest, stdlib ast
# DOCS-REF: docs/operations/QUALITY-GATES.md
# SESSION: issues-quality-ci-7dd5

from __future__ import annotations

import ast
from pathlib import Path

import pytest

BACKEND_ROOT = Path(__file__).resolve().parents[2]


@pytest.mark.unit
def test_server_py_parses() -> None:
    src = (BACKEND_ROOT / "server.py").read_text(encoding="utf-8")
    tree = ast.parse(src, filename="server.py")
    assert isinstance(tree, ast.AST)
    assert any(
        isinstance(n, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef))
        for n in ast.walk(tree)
    )


@pytest.mark.unit
def test_portal_server_py_parses() -> None:
    path = BACKEND_ROOT / "portal" / "server.py"
    tree = ast.parse(path.read_text(encoding="utf-8"), filename=str(path))
    assert isinstance(tree, ast.AST)


@pytest.mark.unit
def test_booking_module_parses() -> None:
    path = BACKEND_ROOT / "booking.py"
    assert path.is_file()
    tree = ast.parse(path.read_text(encoding="utf-8"), filename="booking.py")
    assert isinstance(tree, ast.AST)


@pytest.mark.unit
def test_requirements_lists_fastapi() -> None:
    req = (BACKEND_ROOT / "requirements.txt").read_text(encoding="utf-8").lower()
    assert "fastapi" in req
    assert "uvicorn" in req
