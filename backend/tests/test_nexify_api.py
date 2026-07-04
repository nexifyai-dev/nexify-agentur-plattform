"""Backend API tests for NeXify AI backend.

Covers:
- /api/health
- /api/chat/session
- /api/chat (SSE stream)
- /api/contact
- /api/offers/request
"""
import json
import os
import time

import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://rebranding-hub-2.preview.emergentagent.com").rstrip("/")
TEST_EMAIL = "support@nexify-automate.com"


@pytest.fixture(scope="module")
def http():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ------------------- Health -------------------
class TestHealth:
    def test_health_ok(self, http):
        r = http.get(f"{BASE_URL}/api/health", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data["status"] == "ok"
        assert data["db"] == "supabase", f"expected db=supabase, got {data}"
        assert "time" in data


# ------------------- Chat session -------------------
class TestChatSession:
    def test_create_session_de(self, http):
        r = http.post(f"{BASE_URL}/api/chat/session", json={"language": "de"}, timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert "session_id" in data
        assert isinstance(data["session_id"], str)
        assert len(data["session_id"]) >= 32

    def test_create_session_nl(self, http):
        r = http.post(f"{BASE_URL}/api/chat/session", json={"language": "nl"}, timeout=15)
        assert r.status_code == 200
        assert "session_id" in r.json()


# ------------------- Chat SSE -------------------
class TestChatStream:
    @pytest.fixture(scope="class")
    def session_id(self, http):
        r = http.post(f"{BASE_URL}/api/chat/session", json={"language": "de"}, timeout=15)
        assert r.status_code == 200
        return r.json()["session_id"]

    def test_chat_stream_returns_delta_and_done(self, http, session_id):
        payload = {"session_id": session_id, "message": "Hallo, ich brauche eine Landingpage fuer mein Cafe.", "language": "de"}
        deltas = []
        got_done = False
        with http.post(f"{BASE_URL}/api/chat", json=payload, stream=True, timeout=60) as r:
            assert r.status_code == 200, r.text
            start = time.time()
            for line in r.iter_lines(decode_unicode=True):
                if line is None:
                    continue
                if not line:
                    continue
                if line.startswith("data:"):
                    ev = json.loads(line[5:].strip())
                    if ev.get("type") == "delta":
                        deltas.append(ev.get("content", ""))
                    elif ev.get("type") == "done":
                        got_done = True
                        break
                    elif ev.get("type") == "error":
                        pytest.fail(f"LLM error event: {ev}")
                if time.time() - start > 90:
                    pytest.fail("Chat stream exceeded 90s")
        assert got_done, "did not receive done event"
        assert len(deltas) > 0, "no delta events received"
        assert len("".join(deltas)) > 10


# ------------------- Contact -------------------
class TestContact:
    def test_contact_creates_lead(self, http):
        payload = {
            "name": "TEST_Automation",
            "email": TEST_EMAIL,
            "company": "TEST GmbH",
            "phone": "+49 000",
            "message": "Automated backend test – please ignore.",
            "language": "de",
        }
        r = http.post(f"{BASE_URL}/api/contact", json=payload, timeout=30)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["status"] == "ok"
        assert "lead_id" in data
        assert len(data["lead_id"]) >= 32


# ------------------- Offer -------------------
class TestOffer:
    @pytest.fixture(scope="class")
    def prepared_session(self, http):
        r = http.post(f"{BASE_URL}/api/chat/session", json={"language": "de"}, timeout=15)
        sid = r.json()["session_id"]
        # Prime the session with 2 messages so the LLM has context.
        for msg in [
            "Ich brauche eine Unternehmenswebsite mit 5 Seiten und Kontaktformular.",
            "Budget ist um 3000 Euro, Zeitrahmen 3 Wochen.",
        ]:
            payload = {"session_id": sid, "message": msg, "language": "de"}
            with http.post(f"{BASE_URL}/api/chat", json=payload, stream=True, timeout=90) as resp:
                for line in resp.iter_lines(decode_unicode=True):
                    if line and line.startswith("data:"):
                        try:
                            ev = json.loads(line[5:].strip())
                        except Exception:
                            continue
                        if ev.get("type") == "done":
                            break
        return sid

    def test_offer_request(self, http, prepared_session):
        payload = {
            "session_id": prepared_session,
            "name": "TEST_Automation",
            "email": TEST_EMAIL,
            "company": "TEST GmbH",
            "language": "de",
        }
        r = http.post(f"{BASE_URL}/api/offers/request", json=payload, timeout=120)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["status"] == "sent", f"expected sent, got {data}"
        assert data["email_sent"] is True
        assert isinstance(data["offer"], dict)
        assert "items" in data["offer"]
        assert isinstance(data["price_total"], (int, float))
        assert data["price_total"] > 0
