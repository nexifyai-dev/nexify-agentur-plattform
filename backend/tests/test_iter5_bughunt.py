"""Iteration 5 bug-hunt regression tests for NeXify AI backend.

Covers explicit review-request scenarios:
- /api/health returns ok + supabase
- /api/chat/session creates session
- /api/contact with test data creates lead (uses test@example.com)
- /api/booking/slots returns list
- /api/booking/book with invalid slot_id -> 400 (not 500) via ValueError handler
- /api/booking/book with non-existent valid UUID -> 409
- /api/auth/login with admin credentials returns admin user + cookie
- Admin endpoints reachable after cookie login
- /api/konto endpoints unauthenticated -> 401 (portal redirects UI to /login)
"""
import os
import uuid
import time

import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://rebranding-hub-2.preview.emergentagent.com").rstrip("/")
TEST_EMAIL = "test@example.com"
ADMIN_EMAIL = "mail@nexifyai.cloud"
ADMIN_PASSWORD = "1def!xO2022!!"


@pytest.fixture(scope="module")
def http():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ------------------- Health -------------------
class TestHealth:
    def test_health(self, http):
        r = http.get(f"{BASE_URL}/api/health", timeout=15)
        assert r.status_code == 200
        d = r.json()
        assert d.get("status") == "ok"
        assert d.get("db") == "supabase", d


# ------------------- Chat session -------------------
class TestChatSession:
    def test_session_de(self, http):
        r = http.post(f"{BASE_URL}/api/chat/session", json={"language": "de"}, timeout=15)
        assert r.status_code == 200
        assert isinstance(r.json().get("session_id"), str)


# ------------------- Contact -------------------
class TestContact:
    def test_contact_creates_lead(self, http):
        payload = {
            "name": "TEST_Iter5",
            "email": TEST_EMAIL,
            "company": "TEST GmbH",
            "phone": "+49 000",
            "message": "iter5 automated backend test",
            "language": "de",
        }
        r = http.post(f"{BASE_URL}/api/contact", json=payload, timeout=30)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data.get("status") == "ok"
        assert isinstance(data.get("lead_id"), str) and len(data["lead_id"]) >= 32


# ------------------- Booking public -------------------
class TestBookingSlots:
    def test_slots_public_list(self, http):
        r = http.get(f"{BASE_URL}/api/booking/slots", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        # each slot has id + start_at + duration_min if present
        for s in data[:3]:
            assert "id" in s and "start_at" in s and "duration_min" in s

    def test_book_invalid_slot_id_returns_400(self, http):
        """Non-UUID slot_id triggers ValueError -> handler -> 400 (not 500)."""
        payload = {
            "slot_id": "not-a-uuid",
            "name": "TEST_Iter5",
            "email": TEST_EMAIL,
            "phone": "+49000",
            "language": "de",
        }
        r = http.post(f"{BASE_URL}/api/booking/book", json=payload, timeout=15)
        assert r.status_code == 400, f"expected 400, got {r.status_code}: {r.text}"

    def test_book_nonexistent_uuid_returns_409(self, http):
        """Valid UUID that doesn't exist -> business 409."""
        payload = {
            "slot_id": str(uuid.uuid4()),
            "name": "TEST_Iter5",
            "email": TEST_EMAIL,
            "phone": "+49000",
            "language": "de",
        }
        r = http.post(f"{BASE_URL}/api/booking/book", json=payload, timeout=15)
        assert r.status_code == 409, f"expected 409, got {r.status_code}: {r.text}"


# ------------------- Admin auth -------------------
class TestAdminAuth:
    def test_admin_login_and_stats(self, http):
        r = http.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
            timeout=30,
        )
        assert r.status_code == 200, r.text
        d = r.json()
        # Expect admin role
        user = d.get("user") or d
        role = user.get("role") if isinstance(user, dict) else None
        assert role == "admin", f"admin login returned role={role} data={d}"
        # httpOnly cookie should be set by backend
        set_cookie = r.headers.get("set-cookie", "").lower()
        assert "httponly" in set_cookie, f"expected HttpOnly cookie in set-cookie: {r.headers.get('set-cookie')}"
        # Session usable for /api/admin/stats
        stats = http.get(f"{BASE_URL}/api/admin/stats", timeout=15)
        assert stats.status_code == 200, stats.text
        sdata = stats.json()
        # Typical admin stats include a leads count key
        assert isinstance(sdata, dict) and len(sdata) > 0

    def test_admin_leads_offers_tickets(self, http):
        # http already has admin session cookie from previous test
        for path in ("/api/admin/leads", "/api/admin/offers", "/api/admin/tickets", "/api/admin/sessions"):
            r = http.get(f"{BASE_URL}{path}", timeout=20)
            assert r.status_code == 200, f"{path} -> {r.status_code}: {r.text[:200]}"
            data = r.json()
            assert isinstance(data, (list, dict)), f"{path} bad shape"


# ------------------- Konto unauth -------------------
class TestKontoUnauth:
    def test_konto_me_401(self):
        # Fresh session, no cookies
        r = requests.get(f"{BASE_URL}/api/auth/me", timeout=15)
        # /me should either 401 or return null/empty for anon
        assert r.status_code in (200, 401), r.status_code
        if r.status_code == 200:
            data = r.json()
            assert not data.get("user"), f"anon should not have user, got {data}"

    def test_konto_offers_requires_auth(self):
        r = requests.get(f"{BASE_URL}/api/portal/offers", timeout=15)
        assert r.status_code in (401, 403), f"expected 401/403 without auth, got {r.status_code}"
