"""Backend tests for NeXify AI portal + admin + auth + payment endpoints.

Covers:
- POST /api/auth/login, /register, /me, /profile, brute-force lockout
- Portal: /api/portal/offers, decision, messages, request-new
- Payment: /api/portal/offers/{id}/pay (URL format only – DO NOT pay!), payment-status
- Admin: /api/admin/stats|leads|offers|sessions and access control
- Admin actions: offers/{id}/messages, /api/admin/email
"""
import os
import random
import string
import time

import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://rebranding-hub-2.preview.emergentagent.com").rstrip("/")

ADMIN_EMAIL = "mail@nexifyai.cloud"
ADMIN_PASS = "1def!xO2022!!"
CUSTOMER_EMAIL = "support@nexify-automate.com"
CUSTOMER_PASS = "TestKunde2026!"


def _rand(n: int = 8) -> str:
    return "".join(random.choices(string.ascii_lowercase + string.digits, k=n))


@pytest.fixture(scope="module")
def admin_session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    r = s.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASS}, timeout=15)
    assert r.status_code == 200, f"admin login failed: {r.status_code} {r.text}"
    assert r.json().get("role") == "admin"
    # Verify cookies were set
    assert "access_token" in s.cookies
    assert "refresh_token" in s.cookies
    return s


@pytest.fixture(scope="module")
def customer_session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    r = s.post(f"{BASE_URL}/api/auth/login", json={"email": CUSTOMER_EMAIL, "password": CUSTOMER_PASS}, timeout=15)
    assert r.status_code == 200, f"customer login failed: {r.status_code} {r.text}"
    assert r.json().get("role") == "customer"
    return s


# ------------------- AUTH -------------------
class TestAuth:
    def test_login_admin_sets_cookies_and_role(self, admin_session):
        r = admin_session.get(f"{BASE_URL}/api/auth/me", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data["email"] == ADMIN_EMAIL
        assert data["role"] == "admin"
        assert "id" in data

    def test_login_wrong_password_401(self):
        s = requests.Session()
        r = s.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong-pass-xyz"}, timeout=15)
        assert r.status_code == 401, f"expected 401, got {r.status_code}"

    def test_login_brute_force_lockout(self):
        # A unique random email so we do not affect real accounts' counters
        bad_email = f"nonexistent+{_rand()}@nexify-automate.com"
        s = requests.Session()
        codes = []
        for _ in range(20):
            r = s.post(f"{BASE_URL}/api/auth/login", json={"email": bad_email, "password": "wrong"}, timeout=15)
            codes.append(r.status_code)
        # 429 must appear once brute-force lockout kicks in. Ingress may route across
        # replicas so we allow up to 20 attempts to observe at least one lockout.
        assert 429 in codes, f"expected 429 lockout, got codes {codes}"

    def test_register_new_random_email_and_duplicate(self):
        email = f"test+{_rand()}@nexify-automate.com"
        s = requests.Session()
        s.headers.update({"Content-Type": "application/json"})
        r = s.post(f"{BASE_URL}/api/auth/register", json={
            "email": email, "password": "SafeTestPass2026!", "name": "TEST_AutoUser", "language": "de"
        }, timeout=20)
        assert r.status_code == 200, f"register failed: {r.status_code} {r.text}"
        data = r.json()
        assert data["email"] == email
        assert data["role"] == "customer"
        assert "access_token" in s.cookies

        # /me must work with cookie
        me = s.get(f"{BASE_URL}/api/auth/me", timeout=15)
        assert me.status_code == 200
        assert me.json()["email"] == email

        # Duplicate registration -> 409
        s2 = requests.Session()
        r2 = s2.post(f"{BASE_URL}/api/auth/register", json={
            "email": email, "password": "SafeTestPass2026!", "name": "TEST_Dup"
        }, timeout=20)
        assert r2.status_code == 409, f"expected 409 duplicate, got {r2.status_code}"

        # PUT /api/auth/profile changes name
        newname = f"TEST_Updated_{_rand(4)}"
        pr = s.put(f"{BASE_URL}/api/auth/profile", json={"name": newname, "language": "de"}, timeout=15)
        assert pr.status_code == 200
        assert pr.json()["name"] == newname

    def test_me_without_auth_401(self):
        s = requests.Session()
        r = s.get(f"{BASE_URL}/api/auth/me", timeout=15)
        assert r.status_code == 401


# ------------------- PORTAL -------------------
class TestPortal:
    def test_portal_offers_returns_list(self, customer_session):
        r = customer_session.get(f"{BASE_URL}/api/portal/offers", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        # Customer should have at least 1 offer per test_credentials.md
        assert len(data) >= 1, "expected >=1 offer for test customer"
        offer = data[0]
        for k in ("id", "name", "email", "status", "created_at"):
            assert k in offer

    def test_portal_offers_requires_auth(self):
        r = requests.get(f"{BASE_URL}/api/portal/offers", timeout=15)
        assert r.status_code == 401

    def test_portal_offer_messages_and_send(self, customer_session):
        offers = customer_session.get(f"{BASE_URL}/api/portal/offers", timeout=15).json()
        assert offers
        oid = offers[0]["id"]
        # GET messages
        rm = customer_session.get(f"{BASE_URL}/api/portal/offers/{oid}/messages", timeout=15)
        assert rm.status_code == 200
        assert isinstance(rm.json(), list)
        # POST message
        rp = customer_session.post(
            f"{BASE_URL}/api/portal/offers/{oid}/messages",
            json={"body": f"TEST_Automation Rueckfrage {_rand()}"}, timeout=20,
        )
        assert rp.status_code == 200
        assert rp.json()["status"] == "ok"

    def test_portal_request_new(self, customer_session):
        r = customer_session.post(
            f"{BASE_URL}/api/portal/offers/request-new",
            json={"description": f"TEST_Automation neues Angebot {_rand()}"}, timeout=20,
        )
        assert r.status_code == 200
        assert r.json()["status"] == "ok"

    def test_portal_decision_flow(self, customer_session):
        offers = customer_session.get(f"{BASE_URL}/api/portal/offers", timeout=15).json()
        assert offers
        oid = offers[0]["id"]
        # Invalid decision -> 400
        rbad = customer_session.post(
            f"{BASE_URL}/api/portal/offers/{oid}/decision",
            json={"decision": "maybe"}, timeout=15,
        )
        assert rbad.status_code == 400
        # Re-accept (idempotent-ish; note: this can change status). Since customer offer is already
        # accepted (per hint), sending accepted again keeps it valid.
        original_status = offers[0]["status"]
        target = "accepted" if original_status != "declined" else "accepted"
        rok = customer_session.post(
            f"{BASE_URL}/api/portal/offers/{oid}/decision",
            json={"decision": target}, timeout=20,
        )
        assert rok.status_code == 200
        assert rok.json()["status"] == target


# ------------------- PAYMENT (URL check only, DO NOT PAY!) -------------------
class TestPayment:
    def test_pay_endpoint_returns_checkout_url_format(self, customer_session):
        offers = customer_session.get(f"{BASE_URL}/api/portal/offers", timeout=15).json()
        accepted = [o for o in offers if o["status"] == "accepted"]
        if not accepted:
            pytest.skip("No accepted offer available for payment test")
        oid = accepted[0]["id"]
        r = customer_session.post(f"{BASE_URL}/api/portal/offers/{oid}/pay", timeout=30)
        assert r.status_code == 200, f"pay failed: {r.status_code} {r.text}"
        data = r.json()
        # Either already completed or must contain checkout_url
        if data.get("status") == "completed":
            return
        assert "checkout_url" in data, f"missing checkout_url in {data}"
        url = data["checkout_url"]
        assert isinstance(url, str) and url.startswith("https://"), f"unexpected checkout_url: {url}"
        # Revolut merchant checkout domain check
        assert "revolut" in url.lower() or "checkout" in url.lower(), f"checkout_url does not look like Revolut: {url}"

    def test_payment_status(self, customer_session):
        offers = customer_session.get(f"{BASE_URL}/api/portal/offers", timeout=15).json()
        accepted = [o for o in offers if o["status"] == "accepted"]
        if not accepted:
            pytest.skip("No accepted offer for status test")
        oid = accepted[0]["id"]
        # Ensure an order exists (calls Revolut once, idempotent because of cached URL)
        customer_session.post(f"{BASE_URL}/api/portal/offers/{oid}/pay", timeout=30)
        r = customer_session.get(f"{BASE_URL}/api/portal/offers/{oid}/payment-status", timeout=30)
        assert r.status_code == 200, f"status: {r.status_code} {r.text}"
        state = r.json().get("status")
        assert state in ("pending", "processing", "authorised", "completed", "failed", "cancelled"), f"unexpected state: {state}"


# ------------------- ADMIN -------------------
class TestAdmin:
    def test_admin_stats(self, admin_session):
        r = admin_session.get(f"{BASE_URL}/api/admin/stats", timeout=15)
        assert r.status_code == 200
        d = r.json()
        for k in ("leads", "offers", "accepted", "declined", "chat_sessions", "customers", "pipeline_value", "won_value"):
            assert k in d

    def test_admin_leads(self, admin_session):
        r = admin_session.get(f"{BASE_URL}/api/admin/leads", timeout=15)
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_admin_offers(self, admin_session):
        r = admin_session.get(f"{BASE_URL}/api/admin/offers", timeout=15)
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_admin_sessions(self, admin_session):
        r = admin_session.get(f"{BASE_URL}/api/admin/sessions", timeout=15)
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_admin_endpoints_forbidden_for_customer(self, customer_session):
        for path in ("/api/admin/stats", "/api/admin/leads", "/api/admin/offers", "/api/admin/sessions"):
            r = customer_session.get(f"{BASE_URL}{path}", timeout=15)
            assert r.status_code == 403, f"{path} expected 403 for customer, got {r.status_code}"

    def test_admin_offer_reply(self, admin_session):
        offers = admin_session.get(f"{BASE_URL}/api/admin/offers", timeout=15).json()
        # Pick the test customer's offer
        target = next((o for o in offers if o["email"].lower() == CUSTOMER_EMAIL), offers[0] if offers else None)
        assert target is not None, "no offers to reply to"
        r = admin_session.post(
            f"{BASE_URL}/api/admin/offers/{target['id']}/messages",
            json={"body": f"TEST_Automation admin reply {_rand()}"}, timeout=30,
        )
        assert r.status_code == 200
        assert r.json()["status"] == "ok"

    def test_admin_send_email_to_test_recipient(self, admin_session):
        r = admin_session.post(
            f"{BASE_URL}/api/admin/email",
            json={
                "to": CUSTOMER_EMAIL,
                "subject": f"TEST_Automation Admin Mail {_rand()}",
                "body": "Automatisierter Test – bitte ignorieren.",
                "language": "de",
            }, timeout=30,
        )
        assert r.status_code == 200, f"admin email failed: {r.status_code} {r.text}"
        assert r.json().get("status") == "sent"
        assert r.json().get("email_id")
