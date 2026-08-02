# FILE: /backend/tests/test_revolut_merchant.py
# NIR: 02.08.2026 10:00
# UPDATED: 02.08.2026 10:00
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Unit tests for Revolut Merchant client (no live network, no secrets).
# WHY: Payments must not depend on Stripe; client must respect REVOLUT_* env.
# BEST-PRACTICE: Mock httpx; never assert real key values.
# PITFALL: Do not call production Merchant API from CI.
# DEPENDS: pytest, revolut_merchant
# DOCS-REF: docs/operations/REVOLUT-MERCHANT.md

from __future__ import annotations

import pytest

import revolut_merchant as rm


@pytest.fixture(autouse=True)
def _env(monkeypatch):
    monkeypatch.setenv("PAYMENTS_PROVIDER", "revolut")
    monkeypatch.setenv("REVOLUT_API_SECRET_KEY", "sk_test_dummy_secret")
    monkeypatch.setenv("REVOLUT_API_PUBLIC_KEY", "pk_test_dummy_public")
    monkeypatch.setenv("REVOLUT_ENV", "sandbox")
    monkeypatch.delenv("REVOLUT_SECRET_KEY", raising=False)
    monkeypatch.delenv("REVOLUT_API_BASE", raising=False)


def test_load_config_prefers_api_secret_names():
    cfg = rm.load_config()
    assert cfg.secret_key == "sk_test_dummy_secret"
    assert cfg.public_key == "pk_test_dummy_public"
    assert cfg.env == "sandbox"
    assert cfg.api_base == rm.SANDBOX_API_BASE
    assert cfg.enabled is True


def test_legacy_secret_alias(monkeypatch):
    monkeypatch.delenv("REVOLUT_API_SECRET_KEY", raising=False)
    monkeypatch.setenv("REVOLUT_SECRET_KEY", "sk_legacy_alias")
    cfg = rm.load_config()
    assert cfg.secret_key == "sk_legacy_alias"


def test_payments_disabled_when_provider_off(monkeypatch):
    monkeypatch.setenv("PAYMENTS_PROVIDER", "none")
    assert rm.payments_enabled() is False
    assert rm.load_config().enabled is False


def test_payments_reject_stripe_provider(monkeypatch):
    monkeypatch.setenv("PAYMENTS_PROVIDER", "stripe")
    assert rm.payments_enabled() is False


@pytest.mark.asyncio
async def test_create_order_posts_expected_payload(monkeypatch):
    calls = {}

    class FakeResp:
        status_code = 201

        def json(self):
            return {
                "id": "ord_1",
                "token": "tok_1",
                "checkout_url": "https://checkout.revolut.com/payment-link/tok_1",
                "state": "pending",
            }

        @property
        def text(self):
            return "{}"

    class FakeClient:
        def __init__(self, *a, **k):
            pass

        async def request(self, method, url, headers=None, json=None, params=None):
            calls["method"] = method
            calls["url"] = url
            calls["headers"] = headers
            calls["json"] = json
            return FakeResp()

        async def aclose(self):
            return None

    monkeypatch.setattr(rm.httpx, "AsyncClient", FakeClient)
    client = rm.RevolutMerchantClient()
    data = await client.create_order(
        amount_minor=44900,
        currency="EUR",
        description="Anzahlung",
        redirect_url="https://www.nexifyai.cloud/konto?paid=1",
        merchant_order_ext_ref="offer-uuid",
    )
    assert data["id"] == "ord_1"
    assert calls["method"] == "POST"
    assert calls["url"].endswith("/api/orders")
    assert calls["json"]["amount"] == 44900
    assert calls["json"]["currency"] == "EUR"
    assert "Bearer sk_test_dummy_secret" in calls["headers"]["Authorization"]
    assert calls["headers"]["Revolut-Api-Version"] == rm.DEFAULT_API_VERSION


@pytest.mark.asyncio
async def test_retrieve_order(monkeypatch):
    class FakeResp:
        status_code = 200
        text = "{}"

        def json(self):
            return {"id": "ord_1", "state": "completed"}

    class FakeClient:
        def __init__(self, *a, **k):
            pass

        async def request(self, method, url, headers=None, json=None, params=None):
            assert method == "GET"
            assert url.endswith("/api/orders/ord_1")
            return FakeResp()

        async def aclose(self):
            return None

    monkeypatch.setattr(rm.httpx, "AsyncClient", FakeClient)
    data = await rm.RevolutMerchantClient().retrieve_order("ord_1")
    assert data["state"] == "completed"


def test_public_checkout_config_no_secret_leak():
    pub = rm.public_checkout_config()
    assert pub["provider"] == "revolut"
    assert "secret" not in pub
    assert pub["public_key"] == "pk_test_dummy_public"
