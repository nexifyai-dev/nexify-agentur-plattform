# FILE: /backend/tests/test_revolut_invoices.py
# NIR: 02.08.2026 10:05
# UPDATED: 02.08.2026 10:05
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Unit tests for Revolut invoice helpers + webhook signature (offline).
# WHY: Invoice layer must be deterministic without live Merchant calls or secrets.
# BEST-PRACTICE: anyio + mocked httpx; no real keys.
# PITFALL: Do not assert production checkout URLs against live API.
# DEPENDS: pytest, anyio, revolut_merchant
# DOCS-REF: docs/operations/REVOLUT-MERCHANT.md
# SESSION: cursor/revolut-replace-stripe-7dd5

from __future__ import annotations

from datetime import datetime

import pytest

import revolut_merchant as rm


@pytest.fixture(autouse=True)
def _env(monkeypatch):
    monkeypatch.setenv("PAYMENTS_PROVIDER", "revolut")
    monkeypatch.setenv("REVOLUT_API_SECRET_KEY", "sk_test_dummy_secret")
    monkeypatch.setenv("REVOLUT_API_PUBLIC_KEY", "pk_test_dummy_public")
    monkeypatch.setenv("REVOLUT_ENV", "sandbox")
    monkeypatch.setenv("REVOLUT_WEBHOOK_SECRET", "wsk_test_signing_secret")
    monkeypatch.delenv("REVOLUT_SECRET_KEY", raising=False)
    monkeypatch.delenv("REVOLUT_API_BASE", raising=False)


def test_due_date_berlin_timezone():
    now = datetime(2026, 8, 2, 10, 0, 0, tzinfo=rm.BERLIN_TZ)
    due = rm.due_date_berlin(14, now=now)
    assert due.tzinfo == rm.BERLIN_TZ
    assert due.day == 16
    assert due.hour == 23
    assert due.minute == 59


def test_expire_pending_iso8601_capped():
    now = datetime(2026, 8, 2, 10, 0, 0, tzinfo=rm.BERLIN_TZ)
    due = rm.due_date_berlin(14, now=now)
    assert rm.expire_pending_iso8601(due, now=now) == "PT350H"
    far = rm.due_date_berlin(60, now=now)
    assert rm.expire_pending_iso8601(far, now=now) == "PT720H"


def test_build_invoice_line_item_de_service():
    item = rm.build_invoice_line_item(
        name="Website-Relaunch",
        amount_minor=44900,
        quantity=1,
        description="Anzahlung 1. Arbeitstag",
    )
    assert item["type"] == "service"
    assert item["total_amount"] == 44900
    assert item["quantity"]["unit"] == "Stück"


def test_verify_webhook_signature_valid():
    raw = b'{"event":"ORDER_COMPLETED","order_id":"ord_1"}'
    ts = "1683650202360"
    secret = "wsk_test_signing_secret"
    import hashlib
    import hmac

    digest = hmac.new(
        secret.encode(),
        f"v1.{ts}.{raw.decode()}".encode(),
        hashlib.sha256,
    ).hexdigest()
    header = f"v1={digest}"
    assert (
        rm.verify_webhook_signature(
            raw_body=raw,
            timestamp=ts,
            signature_header=header,
            signing_secret=secret,
        )
        is True
    )


def test_verify_webhook_signature_rejects_tamper():
    assert (
        rm.verify_webhook_signature(
            raw_body=b"{}",
            timestamp="1683650202360",
            signature_header="v1=deadbeef",
            signing_secret="wsk_test_signing_secret",
        )
        is False
    )


@pytest.mark.anyio
async def test_create_order_with_line_items_and_expiry(monkeypatch):
    calls = {}

    class FakeResp:
        status_code = 201
        text = "{}"
        content = b'{"id":"ord_inv"}'

        def json(self):
            return {
                "id": "ord_inv",
                "checkout_url": "https://checkout.revolut.com/payment-link/x",
                "state": "pending",
            }

    class FakeClient:
        def __init__(self, *a, **k):
            pass

        async def request(self, method, url, headers=None, json=None, params=None):
            calls["json"] = json
            return FakeResp()

        async def aclose(self):
            return None

    monkeypatch.setattr(rm.httpx, "AsyncClient", FakeClient)
    item = rm.build_invoice_line_item(name="Beratung", amount_minor=10000)
    data = await rm.RevolutMerchantClient().create_order(
        amount_minor=10000,
        currency="EUR",
        description="NeXify AI – Rechnung Beratung",
        line_items=[item],
        expire_pending_after="PT336H",
        customer={"email": "kunde@example.com"},
    )
    assert data["id"] == "ord_inv"
    assert calls["json"]["line_items"][0]["name"] == "Beratung"
    assert calls["json"]["expire_pending_after"] == "PT336H"
    assert calls["json"]["customer"]["email"] == "kunde@example.com"


@pytest.mark.anyio
async def test_refund_and_list_customers(monkeypatch):
    seen = []

    class FakeResp:
        status_code = 200
        text = "{}"
        content = b"{}"

        def json(self):
            if seen[-1][0] == "POST":
                return {"id": "ref_1", "type": "refund", "state": "pending"}
            return {"customers": [{"id": "cus_1", "email": "a@b.c"}]}

    class FakeClient:
        def __init__(self, *a, **k):
            pass

        async def request(self, method, url, headers=None, json=None, params=None):
            seen.append((method, url))
            return FakeResp()

        async def aclose(self):
            return None

    monkeypatch.setattr(rm.httpx, "AsyncClient", FakeClient)
    client = rm.RevolutMerchantClient()
    refund = await client.refund_order("ord_1", amount_minor=500, description="Erstattung")
    assert refund["id"] == "ref_1"
    customers = await client.list_customers(limit=10)
    assert customers["customers"][0]["id"] == "cus_1"
