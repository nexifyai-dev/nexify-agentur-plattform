# FILE: /opt/nexifyai/repos/nexify-agentur-plattform/backend/tests/test_booking_slots_db_down.py
# NIR: 02.08.2026 10:50
# UPDATED: 02.08.2026 10:52
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Unit tests — booking slots/book survive DB_POOL=None (no 500 AttributeError)
# WHY: Live api.nexifyai.cloud/api/booking/slots returned 500 when Supabase auth failed
# BEST-PRACTICE: Mock _DB; assert public_slots → [] and book → 503
# PITFALL: V-XX: pool.acquire on NoneType is the conversion killer
# DEPENDS: backend/booking.py, pytest
# DOCS-REF: docs/operations/TIMEZONE-EUROPE-BERLIN.md
# SESSION: fix-booking-slots-500

import asyncio
from unittest.mock import AsyncMock

import pytest
from fastapi import HTTPException

import booking


def test_list_slots_core_returns_empty_when_db_none():
    booking._DB = AsyncMock(return_value=None)
    assert asyncio.run(booking.list_slots_core(include_all=False)) == []
    assert asyncio.run(booking.list_slots_core(include_all=True)) == []


def test_public_slots_returns_empty_list_when_db_none():
    booking._DB = AsyncMock(return_value=None)
    assert asyncio.run(booking.public_slots()) == []


def test_book_slot_returns_503_when_db_none():
    booking._DB = AsyncMock(return_value=None)
    body = booking.BookIn(
        slot_id="00000000-0000-0000-0000-000000000001",
        name="Test",
        email="test@example.com",
        phone="+49000",
        language="de",
    )
    with pytest.raises(HTTPException) as ei:
        asyncio.run(booking.book_slot(body))
    assert ei.value.status_code == 503
