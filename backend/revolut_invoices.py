# FILE: /backend/revolut_invoices.py
# NIR: 02.08.2026 10:05
# UPDATED: 02.08.2026 10:05
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Revolut Merchant invoices (order+checkout_url) + webhook status sync.
# WHY: Merchant API has no native Invoice resource — Hosted Checkout orders are the invoice.
# BEST-PRACTICE: DE customer copy; due dates Europe/Berlin; HMAC webhook verify when secret set.
# PITFALL: V-PAY-02: Do not re-introduce Stripe; never log REVOLUT_* values.
# DEPENDS: revolut_merchant, portal.get_admin, asyncpg, AgentMemory remember (optional)
# DOCS-REF: docs/operations/REVOLUT-MERCHANT.md
# SESSION: cursor/revolut-replace-stripe-7dd5

from __future__ import annotations

import json
import logging
import os
import uuid
from collections.abc import Awaitable, Callable
from typing import Any, cast

import httpx
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, EmailStr, Field

import portal
import revolut_merchant as revolut

logger = logging.getLogger("nexify.revolut_invoices")
router = APIRouter()

_DB = cast(Callable[[], Awaitable[Any]], None)
_SEND_EMAIL = cast(Callable[..., Any], None)
_CI_EMAIL = cast(Callable[..., Any], None)
FRONTEND_URL = ""

INVOICE_SCHEMA = """
create table if not exists nexify_invoices (
  id uuid primary key,
  offer_id uuid,
  booking_id uuid,
  customer_email text not null,
  customer_name text,
  company text,
  description text not null,
  amount_minor int not null,
  currency text not null default 'EUR',
  due_at timestamptz,
  revolut_order_id text,
  revolut_customer_id text,
  checkout_url text,
  status text not null default 'draft',
  line_items jsonb default '[]',
  metadata jsonb default '{}',
  sent_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_nexify_invoices_email on nexify_invoices (lower(customer_email));
create index if not exists idx_nexify_invoices_order on nexify_invoices (revolut_order_id);
create index if not exists idx_nexify_invoices_offer on nexify_invoices (offer_id);
create index if not exists idx_nexify_invoices_status on nexify_invoices (status);
"""


def init(
    db_getter: Callable[[], Awaitable[Any]],
    send_email: Callable[..., Any],
    ci_email: Callable[..., Any],
    frontend_url: str,
) -> None:
    global _DB, _SEND_EMAIL, _CI_EMAIL, FRONTEND_URL
    _DB = db_getter
    _SEND_EMAIL = send_email
    _CI_EMAIL = ci_email
    FRONTEND_URL = frontend_url or ""


class InvoiceLineIn(BaseModel):
    name: str
    amount_minor: int = Field(..., gt=0)
    quantity: int = Field(1, ge=1)
    description: str = ""


class InvoiceCreateIn(BaseModel):
    customer_email: EmailStr
    customer_name: str = ""
    company: str = ""
    description: str = ""
    amount_minor: int | None = Field(None, gt=0)
    currency: str = "EUR"
    due_days: int = Field(14, ge=1, le=30)
    offer_id: str | None = None
    booking_id: str | None = None
    line_items: list[InvoiceLineIn] = Field(default_factory=list)
    send_email: bool = False
    phone: str = ""


class RefundIn(BaseModel):
    amount_minor: int | None = Field(None, gt=0)
    description: str = "Erstattung laut Kundenwunsch"


def _row_to_dict(row: Any) -> dict[str, Any]:
    return {
        "id": str(row["id"]),
        "offer_id": str(row["offer_id"]) if row["offer_id"] else None,
        "booking_id": str(row["booking_id"]) if row["booking_id"] else None,
        "customer_email": row["customer_email"],
        "customer_name": row["customer_name"],
        "company": row["company"],
        "description": row["description"],
        "amount_minor": row["amount_minor"],
        "amount_eur": round(int(row["amount_minor"]) / 100, 2),
        "currency": row["currency"],
        "due_at": row["due_at"].isoformat() if row["due_at"] else None,
        "revolut_order_id": row["revolut_order_id"],
        "revolut_customer_id": row["revolut_customer_id"],
        "checkout_url": row["checkout_url"],
        "status": row["status"],
        "line_items": json.loads(row["line_items"])
        if isinstance(row["line_items"], str)
        else (row["line_items"] or []),
        "metadata": json.loads(row["metadata"])
        if isinstance(row["metadata"], str)
        else (row["metadata"] or {}),
        "sent_at": row["sent_at"].isoformat() if row["sent_at"] else None,
        "paid_at": row["paid_at"].isoformat() if row["paid_at"] else None,
        "created_at": row["created_at"].isoformat() if row["created_at"] else None,
        "updated_at": row["updated_at"].isoformat() if row["updated_at"] else None,
    }


def _require_revolut() -> revolut.RevolutConfig:
    if not revolut.payments_enabled():
        raise HTTPException(
            status_code=503,
            detail="Zahlungen sind deaktiviert (PAYMENTS_PROVIDER).",
        )
    cfg = revolut.load_config()
    if not cfg.enabled:
        raise HTTPException(
            status_code=503,
            detail="Revolut Merchant ist nicht konfiguriert (REVOLUT_API_SECRET_KEY).",
        )
    return cfg


async def _agentmemory_remember(content: str, tags: list[str]) -> None:
    """Best-effort Brain write — never includes secrets."""
    base = (os.environ.get("AGENTMEMORY_URL") or "http://127.0.0.1:3111").rstrip("/")
    secret = os.environ.get("AGENTMEMORY_SECRET") or ""
    headers = {"Content-Type": "application/json"}
    if secret:
        headers["Authorization"] = f"Bearer {secret}"
    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            await client.post(
                f"{base}/agentmemory/remember",
                headers=headers,
                json={
                    "type": "fact",
                    "content": content[:4000],
                    "tags": tags,
                },
            )
    except Exception as exc:
        logger.warning("agentmemory remember failed: %s", exc)


async def create_invoice_record(
    body: InvoiceCreateIn,
    *,
    auto_send: bool | None = None,
) -> dict[str, Any]:
    """Create Revolut order + local invoice row. Used by API and admin script."""
    cfg = _require_revolut()
    lines = list(body.line_items)
    if not lines:
        if not body.amount_minor:
            raise HTTPException(
                status_code=400, detail="amount_minor oder line_items erforderlich."
            )
        desc = body.description.strip() or "NeXify AI – Dienstleistung"
        lines = [
            InvoiceLineIn(
                name=desc[:120],
                amount_minor=int(body.amount_minor),
                quantity=1,
                description=desc,
            )
        ]
    amount_minor = sum(int(li.amount_minor) for li in lines)
    if amount_minor <= 0:
        raise HTTPException(status_code=400, detail="Rechnungsbetrag muss > 0 sein.")

    description = (
        body.description.strip()
        or f"NeXify AI – Rechnung für {body.customer_name or body.customer_email}"
    )
    due = revolut.due_date_berlin(body.due_days)
    expire = revolut.expire_pending_iso8601(due)
    line_payload = [
        revolut.build_invoice_line_item(
            name=li.name,
            amount_minor=li.amount_minor,
            quantity=li.quantity,
            description=li.description or li.name,
        )
        for li in lines
    ]

    invoice_id = uuid.uuid4()
    offer_uuid = uuid.UUID(body.offer_id) if body.offer_id else None
    booking_uuid = uuid.UUID(body.booking_id) if body.booking_id else None
    ext_ref = f"invoice:{invoice_id}"
    if offer_uuid:
        ext_ref = f"offer:{offer_uuid}:invoice:{invoice_id}"

    client = revolut.RevolutMerchantClient(cfg)
    revolut_customer_id = None
    try:
        customer = await client.create_customer(
            full_name=body.customer_name or body.company or "",
            email=str(body.customer_email),
            phone=body.phone,
            business_name=body.company,
        )
        revolut_customer_id = customer.get("id")
    except revolut.RevolutMerchantError as exc:
        # Non-fatal: order can embed customer email without prior customer id.
        logger.warning("revolut customer create skipped: %s", exc)

    customer_payload: dict[str, Any] = {"email": str(body.customer_email).lower()}
    if revolut_customer_id:
        customer_payload = {"id": revolut_customer_id}
    elif body.customer_name:
        customer_payload["full_name"] = body.customer_name

    redirect = f"{FRONTEND_URL}/konto?invoice={invoice_id}" if FRONTEND_URL else ""
    try:
        order = await client.create_order(
            amount_minor=amount_minor,
            currency=(body.currency or "EUR").upper(),
            description=description[:1024],
            redirect_url=redirect,
            merchant_order_ext_ref=ext_ref[:200],
            capture_mode="automatic",
            customer=customer_payload,
            line_items=line_payload,
            expire_pending_after=expire,
            merchant_order_data={"reference": ext_ref[:200]},
            metadata={
                "invoice_id": str(invoice_id),
                "source": "nexify_invoices",
                "tz": "Europe/Berlin",
            },
        )
    except revolut.RevolutMerchantError as exc:
        logger.error("revolut invoice order failed: %s", exc)
        raise HTTPException(
            status_code=502, detail="Rechnung konnte bei Revolut nicht erstellt werden."
        ) from exc

    status = (order.get("state") or "pending").lower()
    pool = await _DB()
    async with pool.acquire() as con:
        row = await con.fetchrow(
            """
            insert into nexify_invoices (
              id, offer_id, booking_id, customer_email, customer_name, company,
              description, amount_minor, currency, due_at, revolut_order_id,
              revolut_customer_id, checkout_url, status, line_items, metadata
            ) values (
              $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15::jsonb,$16::jsonb
            )
            returning *
            """,
            invoice_id,
            offer_uuid,
            booking_uuid,
            str(body.customer_email).lower(),
            body.customer_name or None,
            body.company or None,
            description,
            amount_minor,
            (body.currency or "EUR").upper(),
            due,
            order.get("id"),
            revolut_customer_id,
            order.get("checkout_url"),
            status,
            json.dumps(line_payload, ensure_ascii=False),
            json.dumps(
                {"merchant_order_ext_ref": ext_ref, "expire_pending_after": expire},
                ensure_ascii=False,
            ),
        )

    result = _row_to_dict(row)
    do_send = body.send_email if auto_send is None else auto_send
    if do_send and result.get("checkout_url"):
        result = await send_invoice_email(result["id"])
    await _agentmemory_remember(
        f"Revolut-Rechnung erstellt: id={result['id']} status={result['status']} "
        f"amount_minor={result['amount_minor']} currency={result['currency']} "
        f"(keine Secrets).",
        ["revolut", "invoice", "workflow"],
    )
    return result


async def send_invoice_email(invoice_id: str) -> dict[str, Any]:
    pool = await _DB()
    async with pool.acquire() as con:
        row = await con.fetchrow(
            "select * from nexify_invoices where id = $1", uuid.UUID(invoice_id)
        )
    if not row:
        raise HTTPException(status_code=404, detail="Rechnung nicht gefunden.")
    if not row["checkout_url"]:
        raise HTTPException(status_code=400, detail="Keine Zahlungs-URL vorhanden.")

    amount_eur = f"{int(row['amount_minor']) / 100:.2f}".replace(".", ",")
    due_txt = ""
    if row["due_at"]:
        due_local = row["due_at"].astimezone(revolut.BERLIN_TZ)
        due_txt = due_local.strftime("%d.%m.%Y")
    name = row["customer_name"] or "Kunde"
    subject = f"NeXify AI – Rechnung {amount_eur} €"
    body_html = (
        f"<p>Guten Tag {name},</p>"
        f"<p>anbei Ihre Rechnung von NeXify AI:</p>"
        f"<p><b>{row['description']}</b><br/>"
        f"Betrag: <b>{amount_eur} {row['currency']}</b>"
        f"{f'<br/>Fällig bis: <b>{due_txt}</b> (Europe/Berlin)' if due_txt else ''}"
        f"</p>"
        f"<p>Bitte begleichen Sie die Rechnung über den sicheren Revolut-Zahlungslink.</p>"
    )
    html = _CI_EMAIL(
        subject,
        body_html,
        cta_label="Rechnung bezahlen",
        cta_url=row["checkout_url"],
    )
    email_id = await _SEND_EMAIL(row["customer_email"], subject, html)
    if not email_id:
        raise HTTPException(status_code=502, detail="E-Mail-Versand fehlgeschlagen.")

    async with pool.acquire() as con:
        row = await con.fetchrow(
            """
            update nexify_invoices
            set status = case when status in ('draft','pending') then 'sent' else status end,
                sent_at = coalesce(sent_at, now()),
                updated_at = now()
            where id = $1
            returning *
            """,
            uuid.UUID(invoice_id),
        )
    return _row_to_dict(row)


@router.post("/api/admin/revolut/invoices")
async def admin_create_invoice(
    body: InvoiceCreateIn, _: dict = Depends(portal.get_admin)
):
    return await create_invoice_record(body)


@router.get("/api/admin/revolut/invoices")
async def admin_list_invoices(
    limit: int = 50,
    status: str | None = None,
    _: dict = Depends(portal.get_admin),
):
    pool = await _DB()
    lim = max(1, min(int(limit), 200))
    async with pool.acquire() as con:
        if status:
            rows = await con.fetch(
                """
                select * from nexify_invoices
                where status = $1
                order by created_at desc
                limit $2
                """,
                status.lower(),
                lim,
            )
        else:
            rows = await con.fetch(
                "select * from nexify_invoices order by created_at desc limit $1",
                lim,
            )
    return {"invoices": [_row_to_dict(r) for r in rows]}


@router.get("/api/admin/revolut/invoices/{invoice_id}")
async def admin_get_invoice(invoice_id: str, _: dict = Depends(portal.get_admin)):
    pool = await _DB()
    async with pool.acquire() as con:
        row = await con.fetchrow(
            "select * from nexify_invoices where id = $1", uuid.UUID(invoice_id)
        )
    if not row:
        raise HTTPException(status_code=404, detail="Rechnung nicht gefunden.")
    data = _row_to_dict(row)
    if row["revolut_order_id"]:
        try:
            order = await revolut.RevolutMerchantClient().retrieve_order(
                row["revolut_order_id"]
            )
            data["revolut_order"] = {
                "id": order.get("id"),
                "state": order.get("state"),
                "amount": order.get("amount"),
                "currency": order.get("currency"),
                "checkout_url": order.get("checkout_url"),
            }
        except revolut.RevolutMerchantError as exc:
            data["revolut_order_error"] = str(exc)[:200]
    return data


@router.post("/api/admin/revolut/invoices/{invoice_id}/send")
async def admin_send_invoice(invoice_id: str, _: dict = Depends(portal.get_admin)):
    return await send_invoice_email(invoice_id)


@router.post("/api/admin/revolut/invoices/{invoice_id}/refund")
async def admin_refund_invoice(
    invoice_id: str, body: RefundIn, _: dict = Depends(portal.get_admin)
):
    _require_revolut()
    pool = await _DB()
    async with pool.acquire() as con:
        row = await con.fetchrow(
            "select * from nexify_invoices where id = $1", uuid.UUID(invoice_id)
        )
    if not row or not row["revolut_order_id"]:
        raise HTTPException(status_code=404, detail="Rechnung/Order nicht gefunden.")
    try:
        refund = await revolut.RevolutMerchantClient().refund_order(
            row["revolut_order_id"],
            amount_minor=body.amount_minor,
            description=body.description or "Erstattung",
            merchant_order_ext_ref=f"refund:invoice:{invoice_id}",
        )
    except revolut.RevolutMerchantError as exc:
        logger.error("revolut refund failed: %s", exc)
        raise HTTPException(status_code=502, detail="Erstattung fehlgeschlagen.") from exc

    async with pool.acquire() as con:
        await con.execute(
            """
            update nexify_invoices
            set status = 'refunded', updated_at = now(),
                metadata = coalesce(metadata, '{}'::jsonb) || $2::jsonb
            where id = $1
            """,
            uuid.UUID(invoice_id),
            json.dumps({"refund_order_id": refund.get("id")}, ensure_ascii=False),
        )
    await _agentmemory_remember(
        f"Revolut-Erstattung: invoice={invoice_id} refund_order={refund.get('id')}",
        ["revolut", "invoice", "refund"],
    )
    return {"status": "refunded", "refund": {"id": refund.get("id"), "state": refund.get("state")}}


@router.post("/api/admin/offers/{offer_id}/invoice")
async def admin_invoice_from_offer(
    offer_id: str,
    due_days: int = 14,
    send_email: bool = True,
    _: dict = Depends(portal.get_admin),
):
    """Create invoice after signed/accepted offer (agent automation hook)."""
    pool = await _DB()
    async with pool.acquire() as con:
        offer = await con.fetchrow(
            "select * from nexify_offers where id = $1", uuid.UUID(offer_id)
        )
    if not offer:
        raise HTTPException(status_code=404, detail="Angebot nicht gefunden.")
    if offer["status"] not in ("accepted", "signed"):
        raise HTTPException(
            status_code=400,
            detail="Angebot muss angenommen/unterschrieben sein (accepted|signed).",
        )
    offer_json = json.loads(offer["offer_json"]) if offer["offer_json"] else {}
    title = offer_json.get("title") or "Projekt"
    # Prefer remaining project total; fall back to deposit 449 EUR.
    price_total = offer.get("price_total")
    if price_total is not None and float(price_total) > 0:
        amount_minor = int(round(float(price_total) * 100))
        description = f"NeXify AI – Rechnung Projekt „{str(title)[:80]}“"
    else:
        amount_minor = 44900
        description = f"NeXify AI – Anzahlung 1. Arbeitstag: {str(title)[:80]}"

    body = InvoiceCreateIn(
        customer_email=offer["email"],
        customer_name=offer["name"] or "",
        company=offer["company"] or "",
        description=description,
        amount_minor=amount_minor,
        currency="EUR",
        due_days=due_days,
        offer_id=offer_id,
        send_email=send_email,
    )
    return await create_invoice_record(body)


@router.get("/api/admin/revolut/customers")
async def admin_list_customers(
    limit: int = 50, _: dict = Depends(portal.get_admin)
):
    _require_revolut()
    try:
        data = await revolut.RevolutMerchantClient().list_customers(limit=limit)
    except revolut.RevolutMerchantError as exc:
        raise HTTPException(status_code=502, detail="Kundenliste nicht abrufbar.") from exc
    return data


@router.post("/api/webhooks/revolut")
async def revolut_webhook(request: Request):
    raw = await request.body()
    timestamp = request.headers.get("Revolut-Request-Timestamp", "")
    signature = request.headers.get("Revolut-Signature", "")
    secret = (os.environ.get("REVOLUT_WEBHOOK_SECRET") or "").strip()
    if secret:
        if not revolut.verify_webhook_signature(
            raw_body=raw,
            timestamp=timestamp,
            signature_header=signature,
            signing_secret=secret,
        ):
            raise HTTPException(status_code=401, detail="Ungültige Webhook-Signatur.")
    else:
        logger.warning("REVOLUT_WEBHOOK_SECRET unset — accepting webhook without verify")

    try:
        payload = json.loads(raw.decode("utf-8") or "{}")
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=400, detail="Invalid JSON") from exc

    event = str(payload.get("event") or "").upper()
    order_id = payload.get("order_id") or ""
    ext_ref = payload.get("merchant_order_ext_ref") or ""
    logger.info("revolut webhook event=%s order_id=%s", event, order_id)

    state_map = {
        "ORDER_COMPLETED": "completed",
        "ORDER_AUTHORISED": "authorised",
        "ORDER_CANCELLED": "cancelled",
        "ORDER_FAILED": "failed",
        "ORDER_PAYMENT_DECLINED": "declined",
        "ORDER_PAYMENT_FAILED": "failed",
    }
    new_status = state_map.get(event)
    pool = await _DB()
    if pool and order_id and new_status:
        async with pool.acquire() as con:
            await con.execute(
                """
                update nexify_invoices
                set status = $2,
                    paid_at = case when $2 = 'completed' then coalesce(paid_at, now()) else paid_at end,
                    updated_at = now()
                where revolut_order_id = $1
                """,
                order_id,
                new_status,
            )
            # Offer deposit payments use merchant_order_ext_ref = offer uuid
            if new_status == "completed":
                await con.execute(
                    """
                    update nexify_offers
                    set payment_status = 'completed'
                    where payment_order_id = $1
                       or id::text = $2
                    """,
                    order_id,
                    ext_ref,
                )

    await _agentmemory_remember(
        f"Revolut webhook: event={event} order_id={order_id} ext_ref={ext_ref} "
        f"status={new_status or 'n/a'}",
        ["revolut", "webhook", "invoice", "action"],
    )
    return {"ok": True, "event": event, "status": new_status}
