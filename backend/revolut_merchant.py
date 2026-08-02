# FILE: /backend/revolut_merchant.py
# NIR: 02.08.2026 10:00
# UPDATED: 02.08.2026 10:05
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Revolut Merchant API client (orders, invoices-as-orders, customers, refunds, webhooks).
# WHY: NeXify payments use Revolut Merchant only — no Stripe; invoices via Hosted Checkout orders.
# BEST-PRACTICE: Secret key server-side only; public key for client widgets; verify webhook HMAC.
# PITFALL: V-PAY-01: Never log full API keys; prefer REVOLUT_API_* names.
# DEPENDS: httpx; REVOLUT_API_SECRET_KEY (or legacy REVOLUT_SECRET_KEY)
# DOCS-REF: https://developer.revolut.com/docs/guides/merchant/introduction
# SESSION: cursor/revolut-replace-stripe-7dd5

from __future__ import annotations

import hashlib
import hmac
import os
from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Any, Mapping, Optional, Sequence
from zoneinfo import ZoneInfo

import httpx

BERLIN_TZ = ZoneInfo("Europe/Berlin")

DEFAULT_API_BASE = "https://merchant.revolut.com"
DEFAULT_API_VERSION = "2024-09-01"
SANDBOX_API_BASE = "https://sandbox-merchant.revolut.com"


class RevolutMerchantError(RuntimeError):
    """Raised when Revolut Merchant API returns a non-success response."""

    def __init__(self, status_code: int, body: str):
        self.status_code = status_code
        self.body = body
        super().__init__(f"Revolut Merchant HTTP {status_code}: {body[:300]}")


@dataclass(frozen=True)
class RevolutConfig:
    secret_key: str
    public_key: str
    api_base: str
    api_version: str
    env: str
    enabled: bool


def payments_enabled() -> bool:
    """Feature flag: PAYMENTS_PROVIDER=revolut (default) enables payments."""
    provider = (os.environ.get("PAYMENTS_PROVIDER") or "revolut").strip().lower()
    if provider in ("", "none", "off", "disabled"):
        return False
    if provider != "revolut":
        # Explicit non-revolut (e.g. legacy stripe) is rejected — no Stripe path.
        return False
    return True


def load_config() -> RevolutConfig:
    secret = (
        os.environ.get("REVOLUT_API_SECRET_KEY")
        or os.environ.get("REVOLUT_SECRET_KEY")
        or ""
    ).strip()
    public = (
        os.environ.get("REVOLUT_API_PUBLIC_KEY")
        or os.environ.get("REVOLUT_PUBLIC_KEY")
        or ""
    ).strip()
    env = (os.environ.get("REVOLUT_ENV") or "production").strip().lower()
    default_base = SANDBOX_API_BASE if env in ("sandbox", "test") else DEFAULT_API_BASE
    api_base = (os.environ.get("REVOLUT_API_BASE") or default_base).rstrip("/")
    api_version = os.environ.get("REVOLUT_API_VERSION") or DEFAULT_API_VERSION
    enabled = payments_enabled() and bool(secret)
    return RevolutConfig(
        secret_key=secret,
        public_key=public,
        api_base=api_base,
        api_version=api_version,
        env=env,
        enabled=enabled,
    )


class RevolutMerchantClient:
    """Minimal Merchant API client: create/retrieve orders for Hosted Checkout."""

    def __init__(self, config: Optional[RevolutConfig] = None, client: Optional[httpx.AsyncClient] = None):
        self.config = config or load_config()
        self._client = client

    def _headers(self) -> dict[str, str]:
        if not self.config.secret_key:
            raise RevolutMerchantError(401, "REVOLUT_API_SECRET_KEY missing")
        return {
            "Authorization": f"Bearer {self.config.secret_key}",
            "Content-Type": "application/json",
            "Revolut-Api-Version": self.config.api_version,
            "Accept": "application/json",
        }

    async def _request(
        self,
        method: str,
        path: str,
        *,
        json: Optional[Mapping[str, Any]] = None,
        params: Optional[Mapping[str, Any]] = None,
        timeout: float = 15.0,
        allow_empty: bool = False,
    ) -> dict[str, Any]:
        url = f"{self.config.api_base}{path}"
        owns_client = self._client is None
        client = self._client or httpx.AsyncClient(timeout=timeout)
        try:
            resp = await client.request(
                method, url, headers=self._headers(), json=json, params=params
            )
        except httpx.RequestError as exc:
            raise RevolutMerchantError(502, f"unreachable: {exc}") from exc
        finally:
            if owns_client:
                await client.aclose()
        if resp.status_code == 204 and allow_empty:
            return {}
        if resp.status_code not in (200, 201):
            raise RevolutMerchantError(resp.status_code, resp.text)
        raw = getattr(resp, "content", None)
        if raw is not None and len(raw) == 0:
            return {}
        text = getattr(resp, "text", None)
        if text is not None and str(text).strip() == "" and resp.status_code == 204:
            return {}
        data = resp.json()
        if not isinstance(data, dict):
            raise RevolutMerchantError(502, "unexpected non-object JSON")
        return data

    async def create_order(
        self,
        *,
        amount_minor: int,
        currency: str = "EUR",
        description: str = "",
        redirect_url: str = "",
        merchant_order_ext_ref: str = "",
        capture_mode: str = "automatic",
        metadata: Optional[Mapping[str, str]] = None,
        customer: Optional[Mapping[str, Any]] = None,
        line_items: Optional[Sequence[Mapping[str, Any]]] = None,
        expire_pending_after: str = "",
        merchant_order_data: Optional[Mapping[str, Any]] = None,
    ) -> dict[str, Any]:
        """
        Create a Merchant order. Amount is in minor units (cents).

        Official docs (Hosted Checkout): POST /api/orders with Bearer secret key;
        response includes id, token, checkout_url, state.
        """
        payload: dict[str, Any] = {
            "amount": int(amount_minor),
            "currency": currency.upper(),
            "capture_mode": capture_mode,
        }
        if description:
            payload["description"] = description[:1024]
        if redirect_url:
            payload["redirect_url"] = redirect_url
        if merchant_order_ext_ref:
            payload["merchant_order_ext_ref"] = merchant_order_ext_ref
        if metadata:
            payload["metadata"] = dict(metadata)
        if customer:
            payload["customer"] = dict(customer)
        if line_items:
            payload["line_items"] = [dict(item) for item in line_items]
        if expire_pending_after:
            payload["expire_pending_after"] = expire_pending_after
        if merchant_order_data:
            payload["merchant_order_data"] = dict(merchant_order_data)
        return await self._request("POST", "/api/orders", json=payload)

    async def retrieve_order(self, order_id: str) -> dict[str, Any]:
        oid = (order_id or "").strip()
        if not oid:
            raise RevolutMerchantError(400, "order_id required")
        return await self._request("GET", f"/api/orders/{oid}")

    async def list_orders(
        self,
        *,
        limit: int = 50,
        from_ts: str = "",
        to_ts: str = "",
        customer_id: str = "",
        merchant_order_data_reference: str = "",
    ) -> dict[str, Any]:
        params: dict[str, Any] = {"limit": max(1, min(int(limit), 100))}
        if from_ts:
            params["from"] = from_ts
        if to_ts:
            params["to"] = to_ts
        if customer_id:
            params["customer_id"] = customer_id
        if merchant_order_data_reference:
            params["merchant_order_data_reference"] = merchant_order_data_reference
        return await self._request("GET", "/api/orders", params=params)

    async def refund_order(
        self,
        order_id: str,
        *,
        amount_minor: Optional[int] = None,
        description: str = "",
        merchant_order_ext_ref: str = "",
    ) -> dict[str, Any]:
        oid = (order_id or "").strip()
        if not oid:
            raise RevolutMerchantError(400, "order_id required")
        payload: dict[str, Any] = {}
        if amount_minor is not None:
            payload["amount"] = int(amount_minor)
        if description:
            payload["description"] = description[:1024]
        if merchant_order_ext_ref:
            payload["merchant_order_ext_ref"] = merchant_order_ext_ref
        return await self._request("POST", f"/api/orders/{oid}/refund", json=payload or None)

    async def create_customer(
        self,
        *,
        full_name: str = "",
        email: str = "",
        phone: str = "",
        business_name: str = "",
    ) -> dict[str, Any]:
        payload: dict[str, Any] = {}
        if full_name:
            payload["full_name"] = full_name[:250]
        if email:
            payload["email"] = email.strip().lower()
        if phone:
            payload["phone"] = phone
        if business_name:
            payload["business_name"] = business_name[:250]
        if not payload.get("email") and not payload.get("phone"):
            raise RevolutMerchantError(400, "customer email or phone required")
        return await self._request("POST", "/api/customers", json=payload)

    async def list_customers(self, *, limit: int = 50) -> dict[str, Any]:
        return await self._request(
            "GET", "/api/customers", params={"limit": max(1, min(int(limit), 100))}
        )

    async def retrieve_customer(self, customer_id: str) -> dict[str, Any]:
        cid = (customer_id or "").strip()
        if not cid:
            raise RevolutMerchantError(400, "customer_id required")
        return await self._request("GET", f"/api/customers/{cid}")


def due_date_berlin(days: int = 14, *, now: Optional[datetime] = None) -> datetime:
    """Fälligkeitsdatum (Ende des Tages) in Europe/Berlin."""
    base = now.astimezone(BERLIN_TZ) if now else datetime.now(BERLIN_TZ)
    due = (base + timedelta(days=max(1, int(days)))).replace(
        hour=23, minute=59, second=59, microsecond=0
    )
    return due


def expire_pending_iso8601(due: datetime, *, now: Optional[datetime] = None) -> str:
    """
    ISO-8601 duration for expire_pending_after (PT1M … PT720H).
    Maps due date (Europe/Berlin) to hours from now, capped at 30 days.
    """
    start = now.astimezone(BERLIN_TZ) if now else datetime.now(BERLIN_TZ)
    due_local = due.astimezone(BERLIN_TZ)
    seconds = max(60, int((due_local - start).total_seconds()))
    hours = min(720, max(1, (seconds + 3599) // 3600))
    return f"PT{hours}H"


def build_invoice_line_item(
    *,
    name: str,
    amount_minor: int,
    quantity: int = 1,
    description: str = "",
    unit: str = "Stück",
) -> dict[str, Any]:
    qty = max(1, int(quantity))
    total = int(amount_minor)
    unit_price = total // qty
    item: dict[str, Any] = {
        "name": name[:250],
        "type": "service",
        "quantity": {"value": qty, "unit": unit},
        "unit_price_amount": unit_price,
        "total_amount": total,
    }
    if description:
        item["description"] = description[:1024]
    return item


def verify_webhook_signature(
    *,
    raw_body: bytes | str,
    timestamp: str,
    signature_header: str,
    signing_secret: str = "",
) -> bool:
    """
    Verify Revolut Merchant webhook HMAC-SHA256.

    payload_to_sign = v1.{Revolut-Request-Timestamp}.{raw_body}
    expected = v1={hexdigest}
    """
    secret = (signing_secret or os.environ.get("REVOLUT_WEBHOOK_SECRET") or "").strip()
    if not secret:
        return False
    ts = (timestamp or "").strip()
    if not ts or not signature_header:
        return False
    body = raw_body.decode("utf-8") if isinstance(raw_body, (bytes, bytearray)) else str(raw_body)
    payload_to_sign = f"v1.{ts}.{body}"
    digest = hmac.new(
        secret.encode("utf-8"),
        payload_to_sign.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()
    expected = f"v1={digest}"
    provided = [part.strip() for part in signature_header.split(",") if part.strip()]
    return any(hmac.compare_digest(expected, part) for part in provided)


def public_checkout_config() -> dict[str, str]:
    """Safe subset for frontend (public key + env only)."""
    cfg = load_config()
    return {
        "provider": "revolut",
        "env": cfg.env,
        "public_key_configured": "true" if cfg.public_key else "false",
        # Public key may be exposed to browser for Revolut Checkout Widget.
        "public_key": cfg.public_key if cfg.public_key else "",
        "enabled": "true" if cfg.enabled else "false",
    }
