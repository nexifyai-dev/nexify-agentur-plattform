import os
import uuid
import asyncio
import logging
from collections.abc import Awaitable, Callable
from datetime import datetime
from typing import Any, cast
from zoneinfo import ZoneInfo

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr

import portal

logger = logging.getLogger("nexify.booking")
router = APIRouter()

# Injected in init(); cast keeps mypy happy before startup wiring.
_DB = cast(Callable[[], Awaitable[Any]], None)
_SEND_EMAIL = cast(Callable[..., Any], None)
_CI_EMAIL = cast(Callable[..., Any], None)
FRONTEND_URL = ""
TZ = ZoneInfo("Europe/Berlin")

WEEKDAYS = {
    "de": [
        "Montag",
        "Dienstag",
        "Mittwoch",
        "Donnerstag",
        "Freitag",
        "Samstag",
        "Sonntag",
    ],
    "nl": [
        "maandag",
        "dinsdag",
        "woensdag",
        "donderdag",
        "vrijdag",
        "zaterdag",
        "zondag",
    ],
}


def init(
    db_getter: Callable[[], Awaitable[Any]],
    send_email: Callable[..., Any],
    ci_email: Callable[..., Any],
    frontend_url: str,
):
    global _DB, _SEND_EMAIL, _CI_EMAIL, FRONTEND_URL
    _DB = db_getter
    _SEND_EMAIL = send_email
    _CI_EMAIL = ci_email
    FRONTEND_URL = frontend_url


def fmt_slot(dt: datetime, language: str = "de") -> str:
    local = dt.astimezone(TZ)
    wd = WEEKDAYS.get(language, WEEKDAYS["de"])[local.weekday()]
    if language == "nl":
        return f"{wd} {local.strftime('%d-%m-%Y')} om {local.strftime('%H:%M')} uur"
    return f"{wd}, {local.strftime('%d.%m.%Y')} um {local.strftime('%H:%M')} Uhr"


def slot_dict(r) -> dict:
    return {
        "id": str(r["id"]),
        "start_at": r["start_at"].isoformat(),
        "duration_min": r["duration_min"],
        "status": r["status"],
        "name": r["name"],
        "email": r["email"],
        "phone": r["phone"],
        "company": r["company"],
        "topic": r["topic"],
        "language": r["language"],
        "booked_at": r["booked_at"].isoformat() if r["booked_at"] else None,
    }


async def create_slots_core(slots: list[str], duration_min: int = 30) -> dict:
    pool = await _DB()
    if not pool:
        logger.warning("create_slots_core: DB unavailable")
        raise HTTPException(status_code=503, detail="Datenbank nicht verfügbar")
    created, skipped = 0, 0
    async with pool.acquire() as con:
        for s in slots:
            try:
                dt = datetime.fromisoformat(s)
                if dt.tzinfo is None:
                    dt = dt.replace(tzinfo=TZ)
            except ValueError:
                skipped += 1
                continue
            exists = await con.fetchval(
                "select 1 from nexify_slots where start_at = $1", dt
            )
            if exists:
                skipped += 1
                continue
            await con.execute(
                "insert into nexify_slots (id,start_at,duration_min) values ($1,$2,$3)",
                uuid.uuid4(),
                dt,
                duration_min,
            )
            created += 1
    return {"created": created, "skipped": skipped}


async def list_slots_core(include_all: bool = True) -> list[dict]:
    pool = await _DB()
    if not pool:
        # Public calendar must stay usable: empty list, never 500 AttributeError
        logger.warning("list_slots_core: DB unavailable — returning []")
        return []
    try:
        async with pool.acquire() as con:
            if include_all:
                rows = await con.fetch(
                    "select * from nexify_slots where start_at > now() - interval '30 days' order by start_at asc limit 300"
                )
            else:
                rows = await con.fetch(
                    "select * from nexify_slots where status='free' and start_at > now() + interval '2 hours' order by start_at asc limit 100"
                )
        return [slot_dict(r) for r in rows]
    except Exception as e:
        logger.error(f"list_slots_core failed: {e}")
        return []


async def delete_slot_core(slot_id: str) -> dict:
    pool = await _DB()
    if not pool:
        raise HTTPException(status_code=503, detail="Datenbank nicht verfügbar")
    async with pool.acquire() as con:
        res = await con.execute(
            "delete from nexify_slots where id = $1 and status = 'free'",
            uuid.UUID(slot_id),
        )
    return {"status": "deleted" if res.endswith("1") else "not_deleted_or_booked"}


class SlotsCreateIn(BaseModel):
    slots: list[str]
    duration_min: int = 30


class BookIn(BaseModel):
    slot_id: str
    name: str
    email: EmailStr
    phone: str
    company: str | None = None
    topic: str | None = None
    language: str = "de"


@router.post("/api/admin/slots")
async def admin_create_slots(body: SlotsCreateIn, _: dict = Depends(portal.get_admin)):
    return await create_slots_core(body.slots, body.duration_min)


@router.get("/api/admin/slots")
async def admin_list_slots(_: dict = Depends(portal.get_admin)):
    return await list_slots_core(include_all=True)


@router.delete("/api/admin/slots/{slot_id}")
async def admin_delete_slot(slot_id: str, _: dict = Depends(portal.get_admin)):
    return await delete_slot_core(slot_id)


@router.get("/api/booking/slots")
async def public_slots():
    slots = await list_slots_core(include_all=False)
    return [
        {"id": s["id"], "start_at": s["start_at"], "duration_min": s["duration_min"]}
        for s in slots
    ]


@router.post("/api/booking/book")
async def book_slot(body: BookIn):
    pool = await _DB()
    if not pool:
        raise HTTPException(
            status_code=503,
            detail=(
                "Terminbuchung derzeit nicht möglich (Datenbank offline). "
                "Bitte Kontaktformular oder mail@nexifyai.cloud nutzen."
                if body.language != "nl"
                else "Boeken momenteel niet mogelijk (database offline). "
                "Gebruik het contactformulier of mail@nexifyai.cloud."
            ),
        )
    async with pool.acquire() as con:
        row = await con.fetchrow(
            """update nexify_slots set status='booked', name=$2, email=$3, phone=$4, company=$5, topic=$6,
               language=$7, booked_at=now()
               where id=$1 and status='free' and start_at > now() returning *""",
            uuid.UUID(body.slot_id),
            body.name,
            body.email.lower(),
            body.phone,
            body.company,
            body.topic,
            body.language,
        )
        if not row:
            raise HTTPException(
                status_code=409,
                detail="Dieser Termin ist leider nicht mehr verfügbar. Bitte wählen Sie einen anderen."
                if body.language != "nl"
                else "Deze afspraak is helaas niet meer beschikbaar. Kies een ander tijdstip.",
            )
        await con.execute(
            "insert into nexify_leads (id,name,email,company,phone,language,message,source) values ($1,$2,$3,$4,$5,$6,$7,'callback')",
            uuid.uuid4(),
            body.name,
            body.email.lower(),
            body.company,
            body.phone,
            body.language,
            f"Rückruf-Termin gebucht: {fmt_slot(row['start_at'])}"
            + (f" – Thema: {body.topic}" if body.topic else ""),
        )
    nl = body.language == "nl"
    when = fmt_slot(row["start_at"], body.language)
    title = (
        "Uw terugbelafspraak is bevestigd" if nl else "Ihr Rückruf-Termin ist bestätigt"
    )
    body_html = (
        f"Beste {body.name},<br/><br/>hartelijk dank – uw terugbelafspraak is definitief geboekt:<br/><br/>"
        f"<b style='color:#ffffff;font-size:16px;'>{when}</b><br/>Duur: ca. {row['duration_min']} minuten<br/><br/>"
        f"Pascal Courbois belt u persoonlijk op <b>{body.phone}</b>."
        + (f"<br/>Onderwerp: {body.topic}" if body.topic else "")
        + "<br/><br/>Moet u de afspraak verzetten? Antwoord dan eenvoudig op deze e-mail.<br/><br/>Met vriendelijke groet<br/><b>Pascal Courbois</b><br/>NeXify AI by NeXify – chat it. Automate it."
        if nl
        else f"Guten Tag {body.name},<br/><br/>vielen Dank – Ihr Rückruf-Termin ist verbindlich gebucht:<br/><br/>"
        f"<b style='color:#ffffff;font-size:16px;'>{when}</b><br/>Dauer: ca. {row['duration_min']} Minuten<br/><br/>"
        f"Pascal Courbois ruft Sie persönlich unter <b>{body.phone}</b> an."
        + (f"<br/>Thema: {body.topic}" if body.topic else "")
        + "<br/><br/>Sie möchten den Termin verschieben? Antworten Sie einfach auf diese E-Mail.<br/><br/>Mit besten Grüßen<br/><b>Pascal Courbois</b><br/>NeXify AI by NeXify – chat it. Automate it."
    )
    asyncio.create_task(
        _SEND_EMAIL(
            body.email,
            f"{title} – {when}",
            _CI_EMAIL(title, body_html, language=body.language),
        )
    )
    asyncio.create_task(
        _SEND_EMAIL(
            os.environ.get("INTERNAL_NOTIFY_EMAIL"),
            f"NEUER RÜCKRUF-TERMIN: {body.name} – {fmt_slot(row['start_at'])}",
            _CI_EMAIL(
                "Neuer Rückruf-Termin gebucht",
                f"<p><b>{body.name}</b>{f' · {body.company}' if body.company else ''}</p>"
                f"<p>Termin: <b>{fmt_slot(row['start_at'])}</b> ({row['duration_min']} Min.)<br/>"
                f"Telefon: <b>{body.phone}</b><br/>E-Mail: {body.email}<br/>Sprache: {body.language}</p>"
                + (f"<p>Thema: {body.topic}</p>" if body.topic else ""),
                cta_label="Im CRM öffnen",
                cta_url=f"{FRONTEND_URL}/admin",
            ),
        )
    )
    return {
        "status": "booked",
        "start_at": row["start_at"].isoformat(),
        "formatted": when,
    }
