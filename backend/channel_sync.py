# FILE: backend/channel_sync.py
# NIR: 26.07.2026 12:00
# UPDATED: 26.07.2026 12:00
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Unified cross-channel event store + Telegram/WhatsApp webhook handlers.
# WHY: Agent must immediately know the full contact history regardless of channel
#      (website chat, Hermes WebUI, Telegram, WhatsApp, email). All inbound/outbound
#      events from every surface are recorded in nexify_channel_events and queryable
#      by email, phone, or channel-specific reference.
# BEST-PRACTICE: Single source of truth per contact via normalised identifier lookup;
#                channels write to this table, agent reads via get_contact_context.
# PITFALL: V-01: Telegram does not supply email — use telegram:<user_id> as ref.
#          V-02: WhatsApp (Twilio) sends form-encoded, Meta sends JSON — handle both.
#          V-03: TELEGRAM_BOT_TOKEN / WHATSAPP_VERIFY_TOKEN must be set in env for
#                webhooks to function; absence causes graceful 403/pass-through.
# DEPENDS: asyncpg (via db_getter), TELEGRAM_BOT_TOKEN, WHATSAPP_VERIFY_TOKEN,
#          WHATSAPP_ACCESS_TOKEN (Meta) or TWILIO_AUTH_TOKEN (Twilio)
# DOCS-REF: docs/architecture/CHANNEL_SYNC.md

import asyncio
import hashlib
import hmac
import json
import logging
import os
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import PlainTextResponse

logger = logging.getLogger("nexify.channel_sync")

router = APIRouter()

# ── Env config ────────────────────────────────────────────────────────────────
TELEGRAM_BOT_TOKEN: str = os.environ.get("TELEGRAM_BOT_TOKEN", "")
TELEGRAM_SECRET_TOKEN: str = os.environ.get("TELEGRAM_SECRET_TOKEN", "")  # optional extra header

WHATSAPP_VERIFY_TOKEN: str = os.environ.get("WHATSAPP_VERIFY_TOKEN", "")
WHATSAPP_ACCESS_TOKEN: str = os.environ.get("WHATSAPP_ACCESS_TOKEN", "")   # Meta Cloud API
TWILIO_AUTH_TOKEN: str = os.environ.get("TWILIO_AUTH_TOKEN", "")           # Twilio fallback

# ── Module state ──────────────────────────────────────────────────────────────
_db_getter = None
_send_email = None
_internal_notify_email: str = ""
_frontend_url: str = ""

# Callbacks registered by other modules so channel_sync can hand off new
# inbound Telegram/WhatsApp messages to the operations agent for an auto-reply.
_on_inbound_message = None


def init(
    db_getter,
    send_email_fn=None,
    internal_notify_email: str = "",
    frontend_url: str = "",
    on_inbound_message=None,
):
    """Called once from server.py startup."""
    global _db_getter, _send_email, _internal_notify_email, _frontend_url, _on_inbound_message
    _db_getter = db_getter
    _send_email = send_email_fn
    _internal_notify_email = internal_notify_email
    _frontend_url = frontend_url
    _on_inbound_message = on_inbound_message


# ── DB helpers ────────────────────────────────────────────────────────────────
async def _pool():
    if _db_getter is None:
        return None
    return await _db_getter()


async def sync_event(
    *,
    channel: str,           # website | telegram | whatsapp | email | hermes | portal
    direction: str,         # inbound | outbound
    summary: str,           # short human-readable description of the event
    contact_email: str | None = None,
    contact_phone: str | None = None,
    contact_name: str | None = None,
    contact_ref: str | None = None,   # channel-native ID, e.g. "telegram:123456"
    ref_id: str | None = None,        # internal ID (ticket_id, offer_id, session_id …)
    ref_type: str | None = None,      # ticket | offer | chat | lead | message
    metadata: dict | None = None,
) -> str | None:
    """Write one cross-channel event.  Returns the new event UUID or None on failure."""
    pool = await _pool()
    if not pool:
        logger.warning("channel_sync: no DB pool — event not recorded")
        return None
    eid = uuid.uuid4()
    meta_json = json.dumps(metadata or {}, ensure_ascii=False)
    try:
        async with pool.acquire() as con:
            await con.execute(
                """
                INSERT INTO nexify_channel_events
                  (id, channel, direction, summary,
                   contact_email, contact_phone, contact_name, contact_ref,
                   ref_id, ref_type, metadata)
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11::jsonb)
                """,
                eid, channel, direction, summary[:500],
                (contact_email or "").lower() or None,
                contact_phone or None,
                contact_name or None,
                contact_ref or None,
                ref_id or None,
                ref_type or None,
                meta_json,
            )
        return str(eid)
    except Exception as exc:
        logger.warning(f"channel_sync.sync_event failed: {exc}")
        return None


async def get_contact_context(identifier: str, limit: int = 50) -> dict:
    """Return all cross-channel events for a contact.

    ``identifier`` can be an email address, a phone number (any format), or a
    channel-native ref like "telegram:123456".  Returns events newest-first.
    """
    pool = await _pool()
    if not pool:
        return {"identifier": identifier, "events": [], "error": "no_db"}

    ident = identifier.strip().lower()
    try:
        async with pool.acquire() as con:
            rows = await con.fetch(
                """
                SELECT id, channel, direction, summary,
                       contact_email, contact_phone, contact_name, contact_ref,
                       ref_id, ref_type, metadata, ts
                FROM nexify_channel_events
                WHERE lower(contact_email)  = $1
                   OR lower(contact_phone)  = $1
                   OR lower(contact_ref)    = $1
                ORDER BY ts DESC
                LIMIT $2
                """,
                ident,
                min(max(limit, 1), 200),
            )
    except Exception as exc:
        logger.warning(f"channel_sync.get_contact_context failed: {exc}")
        return {"identifier": identifier, "events": [], "error": str(exc)}

    events = [
        {
            "id": str(r["id"]),
            "channel": r["channel"],
            "direction": r["direction"],
            "summary": r["summary"],
            "contact_email": r["contact_email"],
            "contact_phone": r["contact_phone"],
            "contact_name": r["contact_name"],
            "contact_ref": r["contact_ref"],
            "ref_id": r["ref_id"],
            "ref_type": r["ref_type"],
            "ts": r["ts"].isoformat() if r["ts"] else None,
        }
        for r in rows
    ]

    channels_seen = sorted({e["channel"] for e in events})
    return {
        "identifier": identifier,
        "total": len(events),
        "channels": channels_seen,
        "events": events,
    }


# ── Telegram webhook ──────────────────────────────────────────────────────────
def _verify_telegram_secret(request: Request) -> bool:
    """Verify X-Telegram-Bot-Api-Secret-Token header if TELEGRAM_SECRET_TOKEN is set."""
    if not TELEGRAM_SECRET_TOKEN:
        return True  # token not configured → allow (protect via network/firewall)
    header = request.headers.get("X-Telegram-Bot-Api-Secret-Token", "")
    return hmac.compare_digest(header, TELEGRAM_SECRET_TOKEN)


@router.post("/api/webhooks/telegram")
async def telegram_webhook(request: Request):
    """Receives Telegram Bot API updates (set via setWebhook)."""
    if not _verify_telegram_secret(request):
        raise HTTPException(status_code=403, detail="bad token")

    try:
        update = await request.json()
    except Exception:
        return {"ok": True}  # always 200 to Telegram

    message = update.get("message") or update.get("edited_message") or {}
    if not message:
        return {"ok": True}

    tg_from = message.get("from") or {}
    tg_id = tg_from.get("id", "")
    first = tg_from.get("first_name", "")
    last = tg_from.get("last_name", "")
    username = tg_from.get("username", "")
    contact_name = " ".join(filter(None, [first, last])) or username or f"tg:{tg_id}"
    contact_ref = f"telegram:{tg_id}" if tg_id else None
    text = message.get("text") or message.get("caption") or "(media)"
    chat_id = message.get("chat", {}).get("id", "")

    # Optionally a user may have sent their contact card with phone/email
    contact_obj = message.get("contact")
    contact_phone = None
    if contact_obj:
        contact_phone = contact_obj.get("phone_number")
        if not contact_name:
            contact_name = contact_obj.get("first_name", "")

    summary = f"[Telegram] {contact_name}: {text[:300]}"

    asyncio.create_task(sync_event(
        channel="telegram",
        direction="inbound",
        summary=summary,
        contact_name=contact_name,
        contact_phone=contact_phone,
        contact_ref=contact_ref,
        metadata={"chat_id": chat_id, "update_id": update.get("update_id"), "text": text[:500]},
    ))

    # Hand off to operations agent for auto-reply (if callback registered)
    if _on_inbound_message:
        asyncio.create_task(_on_inbound_message(
            channel="telegram",
            contact_name=contact_name,
            contact_ref=contact_ref,
            text=text,
            reply_fn=_make_telegram_reply(chat_id),
        ))

    return {"ok": True}


def _make_telegram_reply(chat_id):
    """Returns an async function that sends a message back to the given Telegram chat."""
    async def _reply(text: str):
        if not TELEGRAM_BOT_TOKEN:
            return
        import httpx
        url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
        payload = {"chat_id": chat_id, "text": text[:4096], "parse_mode": "HTML"}
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.post(url, json=payload)
            if resp.status_code != 200:
                logger.warning(f"Telegram sendMessage failed: {resp.status_code} {resp.text[:200]}")
            else:
                asyncio.create_task(sync_event(
                    channel="telegram",
                    direction="outbound",
                    summary=f"[Telegram → {chat_id}] {text[:200]}",
                    contact_ref=f"telegram:chat:{chat_id}",
                    metadata={"chat_id": chat_id},
                ))
        except Exception as exc:
            logger.warning(f"Telegram reply failed: {exc}")
    return _reply


# ── WhatsApp webhook ───────────────────────────────────────────────────────────
@router.get("/api/webhooks/whatsapp")
async def whatsapp_verify(request: Request):
    """Meta Business API webhook verification (GET challenge)."""
    params = request.query_params
    mode = params.get("hub.mode")
    token = params.get("hub.verify_token")
    challenge = params.get("hub.challenge", "")
    if mode == "subscribe" and token == WHATSAPP_VERIFY_TOKEN:
        return PlainTextResponse(challenge)
    raise HTTPException(status_code=403, detail="verification failed")


@router.post("/api/webhooks/whatsapp")
async def whatsapp_webhook(request: Request):
    """Handles inbound WhatsApp messages from Meta Cloud API or Twilio."""
    content_type = request.headers.get("content-type", "")

    # ── Twilio path (application/x-www-form-urlencoded) ──
    if "form" in content_type:
        form = await request.form()
        await _handle_twilio_whatsapp(dict(form))
        return PlainTextResponse("", status_code=204)

    # ── Meta Cloud API path (application/json) ──
    try:
        body = await request.json()
    except Exception:
        return {"ok": True}

    if WHATSAPP_ACCESS_TOKEN:
        raw_body = await request.body()
        _verify_meta_signature(request, raw_body)  # non-fatal on failure

    asyncio.create_task(_handle_meta_whatsapp(body))
    return {"ok": True}


async def _handle_twilio_whatsapp(form: dict):
    """Parse a Twilio WhatsApp inbound webhook payload."""
    wa_from = form.get("From", "")            # e.g. "whatsapp:+31612345678"
    body = form.get("Body", "(no text)")
    profile_name = form.get("ProfileName", "")
    contact_phone = wa_from.removeprefix("whatsapp:").strip() or None
    contact_name = profile_name or contact_phone or "WhatsApp user"
    contact_ref = f"whatsapp:{contact_phone}" if contact_phone else None
    summary = f"[WhatsApp/Twilio] {contact_name}: {body[:300]}"

    await sync_event(
        channel="whatsapp",
        direction="inbound",
        summary=summary,
        contact_name=contact_name,
        contact_phone=contact_phone,
        contact_ref=contact_ref,
        metadata={"wa_from": wa_from, "body": body[:500]},
    )

    if _on_inbound_message:
        asyncio.create_task(_on_inbound_message(
            channel="whatsapp",
            contact_name=contact_name,
            contact_ref=contact_ref,
            text=body,
            reply_fn=_make_twilio_wa_reply(contact_phone),
        ))


async def _handle_meta_whatsapp(body: dict):
    """Parse a Meta Cloud API WhatsApp webhook body."""
    try:
        for entry in body.get("entry", []):
            for change in entry.get("changes", []):
                value = change.get("value", {})
                for msg in value.get("messages", []):
                    wa_id = msg.get("from", "")  # phone number without +
                    contact_phone = f"+{wa_id}" if wa_id else None
                    contact_ref = f"whatsapp:{contact_phone}" if contact_phone else None
                    text = (msg.get("text") or {}).get("body") or "(media)"
                    # contact name from contacts array
                    contact_name = contact_phone or "WhatsApp user"
                    for c in value.get("contacts", []):
                        if c.get("wa_id") == wa_id:
                            contact_name = c.get("profile", {}).get("name", contact_name)
                            break
                    summary = f"[WhatsApp/Meta] {contact_name}: {text[:300]}"
                    await sync_event(
                        channel="whatsapp",
                        direction="inbound",
                        summary=summary,
                        contact_name=contact_name,
                        contact_phone=contact_phone,
                        contact_ref=contact_ref,
                        metadata={"wa_id": wa_id, "msg_id": msg.get("id"), "text": text[:500]},
                    )
                    if _on_inbound_message:
                        asyncio.create_task(_on_inbound_message(
                            channel="whatsapp",
                            contact_name=contact_name,
                            contact_ref=contact_ref,
                            text=text,
                            reply_fn=_make_meta_wa_reply(contact_phone, value.get("metadata", {}).get("phone_number_id", "")),
                        ))
    except Exception as exc:
        logger.warning(f"Meta WhatsApp parse error: {exc}")


def _verify_meta_signature(request: Request, raw_body: bytes) -> bool:
    """Verify X-Hub-Signature-256 from Meta.  Non-fatal on missing secret."""
    app_secret = os.environ.get("META_APP_SECRET", "")
    if not app_secret:
        return True
    sig_header = request.headers.get("X-Hub-Signature-256", "")
    if not sig_header.startswith("sha256="):
        return False
    expected = "sha256=" + hmac.new(
        app_secret.encode(), raw_body, hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(sig_header, expected)


def _make_twilio_wa_reply(contact_phone: str | None):
    """Returns an async function that sends a WhatsApp reply via Twilio."""
    async def _reply(text: str):
        if not contact_phone or not TWILIO_AUTH_TOKEN:
            return
        twilio_wa_from = os.environ.get("TWILIO_WHATSAPP_FROM", "")
        if not twilio_wa_from:
            return
        import httpx
        account_sid = os.environ.get("TWILIO_ACCOUNT_SID", "")
        url = f"https://api.twilio.com/2010-04-01/Accounts/{account_sid}/Messages.json"
        payload = {
            "From": f"whatsapp:{twilio_wa_from}",
            "To": f"whatsapp:{contact_phone}",
            "Body": text[:1600],
        }
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.post(url, data=payload, auth=(account_sid, TWILIO_AUTH_TOKEN))
            if resp.status_code not in (200, 201):
                logger.warning(f"Twilio WA reply failed: {resp.status_code} {resp.text[:200]}")
            else:
                asyncio.create_task(sync_event(
                    channel="whatsapp",
                    direction="outbound",
                    summary=f"[WhatsApp → {contact_phone}] {text[:200]}",
                    contact_phone=contact_phone,
                    contact_ref=f"whatsapp:{contact_phone}",
                ))
        except Exception as exc:
            logger.warning(f"Twilio WA reply exception: {exc}")
    return _reply


def _make_meta_wa_reply(contact_phone: str | None, phone_number_id: str):
    """Returns an async function that sends a WhatsApp reply via Meta Cloud API."""
    async def _reply(text: str):
        if not contact_phone or not WHATSAPP_ACCESS_TOKEN or not phone_number_id:
            return
        import httpx
        url = f"https://graph.facebook.com/v19.0/{phone_number_id}/messages"
        payload = {
            "messaging_product": "whatsapp",
            "to": contact_phone.lstrip("+"),
            "type": "text",
            "text": {"body": text[:4096]},
        }
        headers = {"Authorization": "Bearer " + WHATSAPP_ACCESS_TOKEN, "Content-Type": "application/json"}
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.post(url, json=payload, headers=headers)
            if resp.status_code != 200:
                logger.warning(f"Meta WA reply failed: {resp.status_code} {resp.text[:200]}")
            else:
                asyncio.create_task(sync_event(
                    channel="whatsapp",
                    direction="outbound",
                    summary=f"[WhatsApp → {contact_phone}] {text[:200]}",
                    contact_phone=contact_phone,
                    contact_ref=f"whatsapp:{contact_phone}",
                ))
        except Exception as exc:
            logger.warning(f"Meta WA reply exception: {exc}")
    return _reply
