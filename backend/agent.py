import os
import json
import uuid
import asyncio
import logging
from collections.abc import Awaitable, Callable
from datetime import datetime
from typing import Any, cast
from zoneinfo import ZoneInfo

from fastapi import APIRouter, Depends
from pydantic import BaseModel

import portal
import booking
import channel_sync

logger = logging.getLogger("nexify.agent")
router = APIRouter()

# Injected in init(); cast keeps mypy happy before startup wiring.
_DB = cast(Callable[[], Awaitable[Any]], None)
_LLM = cast(Any, None)
_MODEL = ""
_SEND_EMAIL = cast(Callable[..., Any], None)
_CI_EMAIL = cast(Callable[..., Any], None)
FRONTEND_URL = ""
TZ = ZoneInfo("Europe/Amsterdam")


def init(
    db_getter: Callable[[], Awaitable[Any]],
    llm_client: Any,
    model: str,
    send_email: Callable[..., Any],
    ci_email: Callable[..., Any],
    frontend_url: str,
):
    global _DB, _LLM, _MODEL, _SEND_EMAIL, _CI_EMAIL, FRONTEND_URL
    _DB = db_getter
    _LLM = llm_client
    _MODEL = model
    _SEND_EMAIL = send_email
    _CI_EMAIL = ci_email
    FRONTEND_URL = frontend_url


AGENT_SYSTEM = """Du bist der NeXify Operations-Agent – der persönliche agentische AI-Assistent von Pascal Courbois (Admin) für "NeXify AI by NeXify – chat it. Automate it." (Premium-Agentur für AI-gestützte Websites, Shops, Apps und Automatisierung; Tagessatz 449 EUR netto, B2B, Venlo/NL, mail@nexifyai.cloud, +31 6 133 188 56).
Hintergrund des Inhabers (für Kunden-E-Mails als Vertrauensargument nutzbar): Deutscher aus der Grenzregion Limburg, mit einer Niederländerin verheiratet, seit gut 5 Jahren in NL; 20+ Jahre Berufs- und Praxiserfahrung in IT/Programmierung, kaufmännischem Bereich und Vertrieb (u. a. Telekom Deutschland, Vodafone, Postcon Deutschland).

Du hast über deine Tools vollen Zugriff auf das gesamte System: CRM/Leads, Angebote, Support-Tickets, Rückruf-Termine, Website-KI-Chats, E-Mail-Versand (Absender mail@nexifyai.cloud, NeXify-CI-Design automatisch) und einen eigenen Task-Planer für zeitgesteuerte Folgeaufgaben.

ARBEITSWEISE:
1. DATEN ZUERST: Beschaffe dir vor jeder Aktion die nötigen Fakten über Lese-Tools (search_leads, get_ticket, list_offers …). Wenn ein Kontakt sich meldet oder du über einen Kontakt berichtest, rufe IMMER ZUERST get_contact_context mit seiner E-Mail-Adresse, Telefonnummer oder Kanal-Ref ab — du bekommst damit sofort die vollständige Kanalhistorie (Website, Telegram, WhatsApp, E-Mail, Hermes) und weißt ohne Rückfragen, wo der letzte Stand ist. Rate niemals E-Mail-Adressen, Namen oder Inhalte.
2. SICHERHEITS-GATE: Bevor du nach außen wirkst (E-Mail senden, Angebot senden, Interessent einladen, Ticket beantworten, Lead-Daten ändern), fasse den geplanten Schritt inkl. Entwurf kurz zusammen und hole die Freigabe des Admins ein – AUSSER der Admin hat die Ausführung im aktuellen Auftrag bereits eindeutig angeordnet (z. B. "sende…", "kontaktiere X und kläre Y", "erledige das", "mach das"). Dann führe direkt und vollständig aus.
3. NACHVERFOLGUNG: Setze dir mit schedule_task eigenständig Folgeaufgaben (z. B. "prüfe in 48h, ob kunde@x.de auf Angebot #id geantwortet hat; wenn Status weiterhin 'sent', sende höfliche Nachfass-E-Mail"). Formuliere Instruktionen so präzise und in sich geschlossen, dass du sie später ohne Gesprächskontext ausführen kannst (immer inkl. E-Mail-Adressen, IDs, gewünschtem Verhalten).
4. FEHLER-GATE: Prüfe Ergebnisse jedes Tool-Aufrufs. Schlägt etwas fehl, versuche einen sinnvollen Alternativweg und berichte transparent, was funktioniert hat und was nicht. Erfinde niemals Erfolge.
5. SPRACHE: Mit dem Admin sprichst du Deutsch – kompakt, präzise, ohne Floskeln. Nutze KEINE Markdown-Formatierung (keine **Sternchen**, keine # Überschriften) – nur normale Absätze und einfache Spiegelstriche. E-Mails an Kunden verfasst du in deren Sprache (Deutsch oder Niederländisch), professionell im NeXify-Ton. Unterschrift: "Pascal Courbois · NeXify AI". Kein Markdown in E-Mails, Zeilenumbrüche als normale Absätze.
6. PREISE & ZUSAGEN: Tagessatz 449 EUR netto. Keine Rabatte, Fristen- oder Rechtszusagen ohne explizite Admin-Freigabe.
7. Berichte am Ende jedes Auftrags kurz: was getan wurde, was geplant ist, was offen ist."""

AUTONOMOUS_NOTE = """

MODUS: GEPLANTER TASK. Dieser Auftrag wurde vom Admin bei der Planung bereits freigegeben. Führe ihn jetzt eigenständig und vollständig aus, ohne Rückfragen. Berichte anschließend das Ergebnis."""


def _tool(name, desc, props, required=None):
    return {
        "type": "function",
        "function": {
            "name": name,
            "description": desc,
            "parameters": {
                "type": "object",
                "properties": props,
                "required": required or [],
            },
        },
    }


S = {"type": "string"}
N = {"type": "number"}

TOOLS = [
    _tool(
        "get_stats",
        "Kennzahlen: Leads, Angebote, Kunden, Pipeline, gewonnener Umsatz.",
        {},
    ),
    _tool(
        "search_leads",
        "Leads/Interessenten durchsuchen (Name, E-Mail, Firma, Telefon, Nachricht). Leerer query = neueste zuerst.",
        {"query": S, "limit": N},
    ),
    _tool(
        "update_lead",
        "Lead-Daten ändern. Nur übergebene Felder werden aktualisiert. status: new|contacted|qualified|won|lost.",
        {
            "lead_id": S,
            "name": S,
            "email": S,
            "company": S,
            "phone": S,
            "status": S,
            "message": S,
        },
        ["lead_id"],
    ),
    _tool(
        "create_prospect",
        "Interessenten manuell anlegen: erzeugt Lead + sendet Willkommens-E-Mail mit Portal-Einladung. language: de|nl.",
        {"name": S, "email": S, "company": S, "phone": S, "language": S, "note": S},
        ["name", "email"],
    ),
    _tool(
        "list_offers",
        "Angebote auflisten. status optional: sent|followed_up|accepted|declined.",
        {"status": S, "limit": N},
    ),
    _tool(
        "get_offer",
        "Angebot inkl. Positionen und Nachrichtenverlauf abrufen.",
        {"offer_id": S},
        ["offer_id"],
    ),
    _tool(
        "create_and_send_offer",
        "Angebot erstellen und per E-Mail (CI-Design + PDF) versenden, inkl. Portal-Einladung. items: [{name, description, days_min, days_max}]. Preis = Tage x 449 EUR.",
        {
            "name": S,
            "email": S,
            "company": S,
            "language": S,
            "title": S,
            "intro": S,
            "items": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "name": S,
                        "description": S,
                        "days_min": N,
                        "days_max": N,
                    },
                    "required": ["name"],
                },
            },
            "assumptions": {"type": "array", "items": S},
            "next_steps": {"type": "array", "items": S},
        },
        ["name", "email", "title", "items"],
    ),
    _tool(
        "reply_offer",
        "Antwort auf Angebots-Rückfrage: erscheint im Kundenportal UND wird per E-Mail gesendet.",
        {"offer_id": S, "body": S},
        ["offer_id", "body"],
    ),
    _tool(
        "list_tickets",
        "Support-Tickets auflisten. status optional: open|answered|closed.",
        {"status": S, "limit": N},
    ),
    _tool(
        "get_ticket",
        "Ticket inkl. komplettem Nachrichtenverlauf abrufen.",
        {"ticket_id": S},
        ["ticket_id"],
    ),
    _tool(
        "reply_ticket",
        "Ticket beantworten: erscheint im Portal UND wird per E-Mail gesendet. body = reiner Text.",
        {"ticket_id": S, "body": S},
        ["ticket_id", "body"],
    ),
    _tool(
        "send_email",
        "Individuelle E-Mail im NeXify-CI-Design senden (Absender mail@nexifyai.cloud). body = reiner Text, Absätze durch Leerzeilen.",
        {"to": S, "subject": S, "body": S, "language": S},
        ["to", "subject", "body"],
    ),
    _tool(
        "list_slots",
        "Alle Rückruf-Zeitfenster (frei + gebucht) der nächsten Zeit inkl. Kontaktdaten der Bucher.",
        {},
    ),
    _tool(
        "create_slots",
        "Neue freie Rückruf-Zeitfenster anlegen. slots = Liste ISO-Zeitpunkte Europe/Amsterdam, z. B. ['2026-06-05T14:30']. duration_min Standard 30.",
        {"slots": {"type": "array", "items": S}, "duration_min": N},
        ["slots"],
    ),
    _tool(
        "delete_slot",
        "Freies (ungebuchtes) Zeitfenster löschen.",
        {"slot_id": S},
        ["slot_id"],
    ),
    _tool(
        "schedule_task",
        "Zeitgesteuerten Folge-Task für dich selbst planen. run_at = ISO-Zeitpunkt (Europe/Amsterdam). instruction = präzise, in sich geschlossene Anweisung inkl. aller IDs/E-Mail-Adressen.",
        {"run_at": S, "title": S, "instruction": S},
        ["run_at", "title", "instruction"],
    ),
    _tool("list_tasks", "Geplante/erledigte Agent-Tasks auflisten.", {}),
    _tool("cancel_task", "Geplanten Task stornieren.", {"task_id": S}, ["task_id"]),
    _tool(
        "list_chat_sessions",
        "Website-KI-Chat-Sessions auflisten (neueste zuerst).",
        {"limit": N},
    ),
    _tool(
        "get_chat_session",
        "Kompletten Verlauf einer Website-Chat-Session lesen.",
        {"session_id": S},
        ["session_id"],
    ),
    _tool(
        "get_contact_context",
        "Vollständigen Kanal-Kontext eines Kontakts abrufen — alle Berührungspunkte über ALLE Kanäle (Website, Telegram, WhatsApp, E-Mail, Hermes) (neueste zuerst). identifier = E-Mail-Adresse, Telefonnummer oder Kanal-Ref wie 'telegram:12345'.",
        {"identifier": S, "limit": N},
        ["identifier"],
    ),
]


def _short(v, n=220):
    s = json.dumps(v, ensure_ascii=False) if not isinstance(v, str) else v
    return s[:n] + ("…" if len(s) > n else "")


async def execute_tool(name: str, args: dict) -> dict:
    pool = await _DB()
    try:
        if name == "get_stats":
            async with pool.acquire() as con:
                leads = await con.fetchval("select count(*) from nexify_leads")
                offers = await con.fetchval("select count(*) from nexify_offers")
                accepted = await con.fetchval(
                    "select count(*) from nexify_offers where status='accepted'"
                )
                customers = await con.fetchval(
                    "select count(*) from nexify_users where role='customer'"
                )
                pipeline = await con.fetchval(
                    "select coalesce(sum(price_total),0) from nexify_offers where status in ('sent','followed_up')"
                )
                won = await con.fetchval(
                    "select coalesce(sum(price_total),0) from nexify_offers where status='accepted'"
                )
                open_tickets = await con.fetchval(
                    "select count(*) from nexify_tickets where status='open'"
                )
                booked = await con.fetchval(
                    "select count(*) from nexify_slots where status='booked' and start_at > now()"
                )
            return {
                "leads": leads,
                "offers": offers,
                "accepted": accepted,
                "customers": customers,
                "pipeline_eur": float(pipeline),
                "won_eur": float(won),
                "open_tickets": open_tickets,
                "upcoming_calls": booked,
            }

        if name == "search_leads":
            q = f"%{args.get('query', '')}%"
            limit = int(args.get("limit") or 20)
            async with pool.acquire() as con:
                rows = await con.fetch(
                    """select * from nexify_leads where name ilike $1 or email ilike $1 or coalesce(company,'') ilike $1
                       or coalesce(phone,'') ilike $1 or coalesce(message,'') ilike $1
                       order by created_at desc limit $2""",
                    q,
                    limit,
                )
            return {
                "leads": [
                    {
                        "id": str(r["id"]),
                        "name": r["name"],
                        "email": r["email"],
                        "company": r["company"],
                        "phone": r["phone"],
                        "language": r["language"],
                        "status": r["status"],
                        "source": r["source"],
                        "message": (r["message"] or "")[:300],
                        "created_at": r["created_at"].isoformat(),
                    }
                    for r in rows
                ]
            }

        if name == "update_lead":
            lead_id = args.pop("lead_id")
            return await portal.update_lead_core(lead_id, args)

        if name == "create_prospect":
            return await portal.prospect_core(
                args["name"],
                args["email"],
                args.get("company"),
                args.get("phone"),
                args.get("language", "de"),
                args.get("note"),
            )

        if name == "list_offers":
            limit = int(args.get("limit") or 20)
            async with pool.acquire() as con:
                if args.get("status"):
                    rows = await con.fetch(
                        "select * from nexify_offers where status=$1 order by created_at desc limit $2",
                        args["status"],
                        limit,
                    )
                else:
                    rows = await con.fetch(
                        "select * from nexify_offers order by created_at desc limit $1",
                        limit,
                    )
            return {
                "offers": [
                    {
                        "id": str(r["id"]),
                        "name": r["name"],
                        "email": r["email"],
                        "status": r["status"],
                        "payment_status": r["payment_status"],
                        "price_total": float(r["price_total"] or 0),
                        "title": (
                            json.loads(r["offer_json"]) if r["offer_json"] else {}
                        ).get("title", ""),
                        "created_at": r["created_at"].isoformat(),
                    }
                    for r in rows
                ]
            }

        if name == "get_offer":
            async with pool.acquire() as con:
                r = await con.fetchrow(
                    "select * from nexify_offers where id=$1",
                    uuid.UUID(args["offer_id"]),
                )
                if not r:
                    return {"error": "Angebot nicht gefunden"}
                msgs = await con.fetch(
                    "select * from nexify_offer_messages where offer_id=$1 order by created_at asc",
                    uuid.UUID(args["offer_id"]),
                )
            return {
                "id": str(r["id"]),
                "name": r["name"],
                "email": r["email"],
                "company": r["company"],
                "language": r["language"],
                "status": r["status"],
                "payment_status": r["payment_status"],
                "price_total": float(r["price_total"] or 0),
                "offer": json.loads(r["offer_json"]) if r["offer_json"] else None,
                "created_at": r["created_at"].isoformat(),
                "messages": [
                    {
                        "sender": m["sender"],
                        "body": m["body"],
                        "at": m["created_at"].isoformat(),
                    }
                    for m in msgs
                ],
            }

        if name == "create_and_send_offer":
            return await portal.offer_core(
                args["name"],
                args["email"],
                args.get("company"),
                args.get("language", "de"),
                args["title"],
                args.get("intro", ""),
                [
                    {
                        "name": i.get("name", ""),
                        "description": i.get("description", ""),
                        "days_min": float(i.get("days_min", 1)),
                        "days_max": float(i.get("days_max", i.get("days_min", 1))),
                    }
                    for i in args["items"]
                ],
                args.get("assumptions", []),
                args.get("next_steps", []),
            )

        if name == "reply_offer":
            return await portal.offer_reply_core(args["offer_id"], args["body"])

        if name == "list_tickets":
            limit = int(args.get("limit") or 20)
            async with pool.acquire() as con:
                if args.get("status"):
                    rows = await con.fetch(
                        "select * from nexify_tickets where status=$1 order by created_at desc limit $2",
                        args["status"],
                        limit,
                    )
                else:
                    rows = await con.fetch(
                        "select * from nexify_tickets order by created_at desc limit $1",
                        limit,
                    )
            return {
                "tickets": [
                    {
                        "id": str(r["id"]),
                        "name": r["name"],
                        "email": r["email"],
                        "subject": r["subject"],
                        "status": r["status"],
                        "source": r["source"],
                        "created_at": r["created_at"].isoformat(),
                    }
                    for r in rows
                ]
            }

        if name == "get_ticket":
            async with pool.acquire() as con:
                r = await con.fetchrow(
                    "select * from nexify_tickets where id=$1",
                    uuid.UUID(args["ticket_id"]),
                )
                if not r:
                    return {"error": "Ticket nicht gefunden"}
                msgs = await con.fetch(
                    "select * from nexify_ticket_messages where ticket_id=$1 order by created_at asc",
                    uuid.UUID(args["ticket_id"]),
                )
            return {
                "id": str(r["id"]),
                "name": r["name"],
                "email": r["email"],
                "subject": r["subject"],
                "status": r["status"],
                "language": r["language"],
                "source": r["source"],
                "messages": [
                    {
                        "sender": m["sender"],
                        "body": m["body"],
                        "at": m["created_at"].isoformat(),
                    }
                    for m in msgs
                ],
            }

        if name == "reply_ticket":
            return await portal.ticket_reply_core(args["ticket_id"], args["body"])

        if name == "send_email":
            lang = args.get("language", "de")
            html_body = "".join(
                f"<p>{p.replace(chr(10), '<br/>')}</p>"
                for p in args["body"].split("\n\n")
                if p.strip()
            )
            email_id = await _SEND_EMAIL(
                args["to"],
                args["subject"],
                _CI_EMAIL(args["subject"], html_body, language=lang),
            )
            return {"status": "sent" if email_id else "failed", "email_id": email_id}

        if name == "list_slots":
            slots = await booking.list_slots_core(include_all=True)
            for s in slots:
                s["formatted"] = booking.fmt_slot(datetime.fromisoformat(s["start_at"]))
            return {"slots": slots}

        if name == "create_slots":
            return await booking.create_slots_core(
                args["slots"], int(args.get("duration_min") or 30)
            )

        if name == "delete_slot":
            return await booking.delete_slot_core(args["slot_id"])

        if name == "schedule_task":
            run_at = datetime.fromisoformat(args["run_at"])
            if run_at.tzinfo is None:
                run_at = run_at.replace(tzinfo=TZ)
            tid = uuid.uuid4()
            async with pool.acquire() as con:
                await con.execute(
                    "insert into nexify_agent_tasks (id,title,instruction,run_at) values ($1,$2,$3,$4)",
                    tid,
                    args["title"],
                    args["instruction"],
                    run_at,
                )
            return {
                "status": "scheduled",
                "task_id": str(tid),
                "run_at": run_at.isoformat(),
            }

        if name == "list_tasks":
            async with pool.acquire() as con:
                rows = await con.fetch(
                    "select * from nexify_agent_tasks order by run_at desc limit 50"
                )
            return {
                "tasks": [
                    {
                        "id": str(r["id"]),
                        "title": r["title"],
                        "instruction": r["instruction"][:300],
                        "run_at": r["run_at"].isoformat(),
                        "status": r["status"],
                        "result": (r["result"] or "")[:300],
                    }
                    for r in rows
                ]
            }

        if name == "cancel_task":
            async with pool.acquire() as con:
                res = await con.execute(
                    "update nexify_agent_tasks set status='cancelled' where id=$1 and status='pending'",
                    uuid.UUID(args["task_id"]),
                )
            return {"status": "cancelled" if res.endswith("1") else "not_cancellable"}

        if name == "list_chat_sessions":
            limit = int(args.get("limit") or 15)
            async with pool.acquire() as con:
                rows = await con.fetch(
                    """select s.id, s.language, s.created_at, count(m.id) as n, max(m.created_at) as last_at
                       from nexify_chat_sessions s left join nexify_chat_messages m on m.session_id=s.id
                       group by s.id order by coalesce(max(m.created_at), s.created_at) desc limit $1""",
                    limit,
                )
            return {
                "sessions": [
                    {
                        "id": str(r["id"]),
                        "language": r["language"],
                        "messages": r["n"],
                        "last_at": (r["last_at"] or r["created_at"]).isoformat(),
                    }
                    for r in rows
                ]
            }

        if name == "get_chat_session":
            async with pool.acquire() as con:
                rows = await con.fetch(
                    "select * from nexify_chat_messages where session_id=$1 order by created_at asc",
                    uuid.UUID(args["session_id"]),
                )
            return {
                "messages": [
                    {"role": r["role"], "content": r["content"][:600]} for r in rows
                ]
            }

        if name == "get_contact_context":
            identifier = args.get("identifier", "").strip()
            limit = int(args.get("limit") or 30)
            return await channel_sync.get_contact_context(identifier, limit=limit)

        return {"error": f"Unbekanntes Tool: {name}"}
    except Exception as e:
        logger.error(f"tool {name} failed: {e}")
        return {"error": str(e)}


async def _save_agent_msg(role: str, content: str):
    pool = await _DB()
    async with pool.acquire() as con:
        await con.execute(
            "insert into nexify_agent_messages (id,role,content) values ($1,$2,$3)",
            uuid.uuid4(),
            role,
            content,
        )


async def _load_history(limit: int = 30) -> list[dict]:
    pool = await _DB()
    async with pool.acquire() as con:
        rows = await con.fetch(
            "select * from nexify_agent_messages order by created_at desc limit $1",
            limit,
        )
    out = []
    for r in reversed(rows):
        if r["role"] == "action":
            try:
                a = json.loads(r["content"])
                out.append(
                    {
                        "role": "assistant",
                        "content": f"[Ausgeführte Aktion: {a.get('tool')} → {a.get('summary', '')}]",
                    }
                )
            except Exception:
                pass
        elif r["role"] in ("user", "assistant"):
            out.append({"role": r["role"], "content": r["content"]})
    return out


async def run_agent(
    user_message: str,
    autonomous: bool = False,
    persist: bool = True,
    max_rounds: int = 8,
):
    now = datetime.now(TZ).strftime("%A, %d.%m.%Y %H:%M")
    system = AGENT_SYSTEM + f"\n\nAKTUELLES DATUM/UHRZEIT (Europe/Amsterdam): {now}"
    if autonomous:
        system += AUTONOMOUS_NOTE
    history = await _load_history() if persist else []
    messages = (
        [{"role": "system", "content": system}]
        + history
        + [{"role": "user", "content": user_message}]
    )
    if persist:
        await _save_agent_msg("user", user_message)
    actions = []
    final = ""
    for _ in range(max_rounds):
        resp = await _LLM.chat.completions.create(
            model=_MODEL, messages=messages, tools=TOOLS, max_tokens=4000
        )
        msg = resp.choices[0].message
        if msg.tool_calls:
            messages.append(
                {
                    "role": "assistant",
                    "content": msg.content or "",
                    "tool_calls": [
                        {
                            "id": tc.id,
                            "type": "function",
                            "function": {
                                "name": tc.function.name,
                                "arguments": tc.function.arguments,
                            },
                        }
                        for tc in msg.tool_calls
                    ],
                }
            )
            for tc in msg.tool_calls:
                try:
                    args = json.loads(tc.function.arguments or "{}")
                except json.JSONDecodeError:
                    args = {}
                result = await execute_tool(tc.function.name, args)
                ok = "error" not in result
                action = {"tool": tc.function.name, "ok": ok, "summary": _short(result)}
                actions.append(action)
                if persist:
                    await _save_agent_msg(
                        "action", json.dumps(action, ensure_ascii=False)
                    )
                messages.append(
                    {
                        "role": "tool",
                        "tool_call_id": tc.id,
                        "content": json.dumps(result, ensure_ascii=False)[:6000],
                    }
                )
            continue
        final = msg.content or ""
        break
    if not final:
        final = "Ich habe die maximale Anzahl an Arbeitsschritten erreicht. Bisherige Aktionen siehe oben – soll ich fortfahren?"
    if persist:
        await _save_agent_msg("assistant", final)
    return {"reply": final, "actions": actions}


class AgentChatIn(BaseModel):
    message: str


AGENT_BUSY = {"busy": False}


@router.post("/api/admin/agent/chat")
async def agent_chat(body: AgentChatIn, _: dict = Depends(portal.get_admin)):
    if AGENT_BUSY["busy"]:
        return {"status": "busy"}
    AGENT_BUSY["busy"] = True

    async def _run():
        try:
            await run_agent(body.message)
        except Exception as e:
            logger.error(f"agent chat failed: {e}")
            try:
                await _save_agent_msg(
                    "assistant", f"Der Agent ist auf einen Fehler gestoßen: {e}"
                )
            except Exception:
                pass
        finally:
            AGENT_BUSY["busy"] = False

    asyncio.create_task(_run())
    return {"status": "accepted"}


@router.get("/api/admin/agent/status")
async def agent_status(_: dict = Depends(portal.get_admin)):
    return {"busy": AGENT_BUSY["busy"]}


@router.get("/api/admin/agent/history")
async def agent_history(_: dict = Depends(portal.get_admin)):
    pool = await _DB()
    async with pool.acquire() as con:
        rows = await con.fetch(
            "select * from nexify_agent_messages order by created_at desc limit 120"
        )
    return [
        {
            "id": str(r["id"]),
            "role": r["role"],
            "content": r["content"],
            "created_at": r["created_at"].isoformat(),
        }
        for r in reversed(rows)
    ]


@router.get("/api/admin/agent/tasks")
async def agent_tasks(_: dict = Depends(portal.get_admin)):
    pool = await _DB()
    async with pool.acquire() as con:
        rows = await con.fetch(
            "select * from nexify_agent_tasks order by run_at desc limit 100"
        )
    return [
        {
            "id": str(r["id"]),
            "title": r["title"],
            "instruction": r["instruction"],
            "run_at": r["run_at"].isoformat(),
            "status": r["status"],
            "result": r["result"],
            "created_at": r["created_at"].isoformat(),
        }
        for r in rows
    ]


@router.post("/api/admin/agent/tasks/{task_id}/cancel")
async def agent_task_cancel(task_id: str, _: dict = Depends(portal.get_admin)):
    return await execute_tool("cancel_task", {"task_id": task_id})


async def task_worker():
    while True:
        try:
            pool = await _DB()
            if pool:
                async with pool.acquire() as con:
                    rows = await con.fetch(
                        "select * from nexify_agent_tasks where status='pending' and run_at <= now() limit 3"
                    )
                for row in rows:
                    async with pool.acquire() as con:
                        claimed = await con.execute(
                            "update nexify_agent_tasks set status='running' where id=$1 and status='pending'",
                            row["id"],
                        )
                    if not claimed.endswith("1"):
                        continue
                    logger.info(f"agent task starting: {row['title']}")
                    try:
                        result = await run_agent(
                            f"[GEPLANTER TASK „{row['title']}“ – jetzt fällig]\n{row['instruction']}",
                            autonomous=True,
                        )
                        summary = result["reply"][:2000]
                        status = "done"
                    except Exception as e:
                        summary = f"Fehler: {e}"
                        status = "failed"
                    async with pool.acquire() as con:
                        await con.execute(
                            "update nexify_agent_tasks set status=$1, result=$2 where id=$3",
                            status,
                            summary,
                            row["id"],
                        )
                    notify = os.environ.get("INTERNAL_NOTIFY_EMAIL")
                    if notify:
                        await _SEND_EMAIL(
                            notify,
                            f"Agent-Task erledigt: {row['title']}",
                            _CI_EMAIL(
                                f"Agent-Task: {row['title']}",
                                f"<p>Status: <b>{status}</b></p><p style='border-left:2px solid #52525b;padding-left:12px;'>{summary.replace(chr(10), '<br/>')}</p>",
                                cta_label="Zum Agent-Cockpit",
                                cta_url=f"{FRONTEND_URL}/admin",
                            ),
                        )
        except Exception as e:
            logger.warning(f"agent task worker error: {e}")
        await asyncio.sleep(60)


async def seed_recurring_tasks():
    """Seed weekly autonomous self-optimization and system health tasks if not already scheduled.
    Called once from server startup. Idempotent — only inserts if no matching pending/future task exists.
    """
    pool = await _DB()
    if not pool:
        return
    now = datetime.now(TZ)

    tasks = [
        {
            "title": "Wöchentliche Selbstoptimierung & System-Review",
            "days": 7,
            "instruction": (
                "WÖCHENTLICHE SELBSTOPTIMIERUNG – Autonomer Review.\n"
                "1. Rufe get_stats auf und analysiere aktuelle Zahlen (Leads, Angebote, Tickets, Pipeline).\n"
                "2. Rufe list_tasks auf und prüfe: gibt es steckengebliebene Tasks (>7 Tage pending)? Wenn ja, storniere sie via cancel_task und plane neue mit klarer Instruktion.\n"
                "3. Rufe list_tickets(status='open') auf. Tickets die >5 Tage alt und unanswered sind: prüfe ob AI-Antwort sinnvoll wäre, antworte professionell via reply_ticket.\n"
                "4. Rufe list_offers(status='sent') auf. Angebote >48h ohne Reaktion: plane follow-up via schedule_task für den nächsten Arbeitstag.\n"
                "5. Plane die nächste Selbstoptimierung in 7 Tagen via schedule_task mit identischer Instruktion.\n"
                "Berichte kompakt was du erledigt hast (kein Markdown, keine Sternchen)."
            ),
        },
        {
            "title": "Monatlicher Pipeline-Bericht",
            "days": 30,
            "instruction": (
                "MONATLICHER PIPELINE-BERICHT.\n"
                "1. Rufe get_stats auf für aktuelle Kennzahlen.\n"
                "2. Rufe list_offers(status='accepted') auf und berechne den gewonnenen Umsatz.\n"
                "3. Rufe list_leads auf und analysiere Conversion-Rate (won vs. total).\n"
                "4. Verfasse einen kompakten Bericht (keine Markdown-Formatierung) und sende ihn via send_email an den Admin (mail@nexifyai.cloud).\n"
                "   Betreff: 'NeXify AI – Monatsbericht Pipeline & KPI'\n"
                "5. Plane den nächsten Monatsbericht in 30 Tagen via schedule_task mit identischer Instruktion."
            ),
        },
    ]

    for t in tasks:
        run_at = now + __import__("datetime").timedelta(days=t["days"])
        title_prefix = t["title"][:60]
        async with pool.acquire() as con:
            existing = await con.fetchval(
                "SELECT 1 FROM nexify_agent_tasks WHERE title LIKE $1 AND status='pending' AND run_at > now() LIMIT 1",
                f"{title_prefix}%",
            )
            if not existing:
                tid = uuid.uuid4()
                await con.execute(
                    "INSERT INTO nexify_agent_tasks (id,title,instruction,run_at) VALUES ($1,$2,$3,$4)",
                    tid,
                    t["title"],
                    t["instruction"],
                    run_at,
                )
                logger.info(
                    f"Seeded recurring task: {t['title']} @ {run_at.isoformat()}"
                )
