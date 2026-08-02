# FILE: backend/tests/unit/test_portal_lifecycle.py
# NIR: 02.08.2026 10:50
# UPDATED: 02.08.2026 10:50
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Offline unit tests for offer lifecycle phase derivation.
# WHY: Kundenportal Auftrag-Status must stay deterministic without DB.
# BEST-PRACTICE: Pure functions, no network.
# PITFALL: Do not call Revolut in unit lane.
# DEPENDS: pytest, lifecycle.py
# DOCS-REF: docs/operations/QUALITY-GATES.md
# SESSION: website-gesamtkonzept-kundenportal-7dd5

from __future__ import annotations

import pytest

from lifecycle import LIFECYCLE_PHASES, derive_lifecycle_phase, lifecycle_timeline


class _Row(dict):
    pass


@pytest.mark.unit
def test_lifecycle_phases_order() -> None:
    assert LIFECYCLE_PHASES == (
        "anfrage",
        "angebot",
        "freigabe",
        "umsetzung",
        "abnahme",
        "rechnung",
    )


@pytest.mark.unit
def test_derive_from_explicit_phase() -> None:
    row = _Row(lifecycle_phase="abnahme", status="accepted", payment_status="completed")
    assert derive_lifecycle_phase(row) == "abnahme"


@pytest.mark.unit
def test_derive_from_payment_completed() -> None:
    row = _Row(lifecycle_phase=None, status="accepted", payment_status="completed")
    assert derive_lifecycle_phase(row) == "umsetzung"


@pytest.mark.unit
def test_derive_from_accepted() -> None:
    row = _Row(lifecycle_phase=None, status="accepted", payment_status=None)
    assert derive_lifecycle_phase(row) == "freigabe"


@pytest.mark.unit
def test_timeline_marks_current() -> None:
    tl = lifecycle_timeline("freigabe")
    assert [p["state"] for p in tl] == [
        "done",
        "done",
        "current",
        "upcoming",
        "upcoming",
        "upcoming",
    ]
    assert tl[2]["label"] == "Freigabe"
