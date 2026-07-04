from dotenv import load_dotenv
load_dotenv()

import os
import json
import uuid
import asyncio
import logging
from datetime import datetime, timezone, timedelta

import asyncpg
import resend
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, EmailStr
from openai import AsyncOpenAI

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("nexify")

EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY")
MIMO_API_KEY = os.environ.get("MIMO_API_KEY")
MIMO_BASE_URL = os.environ.get("MIMO_BASE_URL_OPENAI")
MIMO_MODEL = os.environ.get("MIMO_MODEL", "mimo-v2.5-pro")
RESEND_API_KEY = os.environ.get("RESEND_API_KEY")
SENDER_EMAIL = os.environ.get("SENDER_EMAIL")
INTERNAL_NOTIFY_EMAIL = os.environ.get("INTERNAL_NOTIFY_EMAIL")
FOLLOWUP_HOURS = int(os.environ.get("FOLLOWUP_HOURS", "24"))

resend.api_key = RESEND_API_KEY

app = FastAPI(title="NeXify AI Backend")
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_POOL: asyncpg.Pool | None = None
HISTORY: dict[str, list[dict]] = {}
LLM = AsyncOpenAI(base_url=MIMO_BASE_URL, api_key=MIMO_API_KEY)

SCHEMA = """
create table if not exists nexify_leads (
  id uuid primary key,
  name text, email text, company text, phone text,
  language text default 'de', message text, source text default 'contact',
  status text default 'new', created_at timestamptz default now()
);
create table if not exists nexify_chat_sessions (
  id uuid primary key, language text default 'de', created_at timestamptz default now()
);
create table if not exists nexify_chat_messages (
  id uuid primary key, session_id uuid, role text, content text, created_at timestamptz default now()
);
create table if not exists nexify_offers (
  id uuid primary key, session_id uuid,
  name text, email text, company text, language text default 'de',
  offer_json jsonb, price_total numeric, status text default 'sent',
  email_id text, followup_at timestamptz, followup_sent boolean default false,
  created_at timestamptz default now()
);
"""

COMPANY_KNOWLEDGE = """
UNTERNEHMEN: NeXifyAI by NeXify – Chat it. Automate it. | Inhaber: Pascal Courbois | Graaf van Loonstraat 1E, 5921 JA Venlo, Niederlande | KvK 90483944 | BTW NL865786276B01 | support@nexify-automate.com | +31 6 133 188 56 | Ausschliesslich B2B.
TAGESSATZ: 999 EUR netto pro Arbeitstag (bis zu 8 Fachstunden). Preise zzgl. USt.; bei EU-B2B ggf. Reverse-Charge.
LEISTUNGEN (Richtdauer in Arbeitstagen):
1. Landingpage – 1 Tag (999 EUR): Premium UI/UX, responsive, Leadformular, technisches SEO.
2. Unternehmenswebsite – 2-3 Tage (1.998-2.997 EUR): Strategie, Leistungsseiten, Kontaktstrecke, SEO, Rechtsseiten.
3. Onlineshop – 6-8 Tage (5.994-7.992 EUR): Produktstruktur, Suche/Filter, Checkout, Zahlungsanbieter.
4. Enterprise-Commerce 50.000+ Artikel – ab 12 Tagen (ab 11.988 EUR): PIM/ERP-Integration, Suchindex, Monitoring.
5. Web-App – 6-8 Tage: Login/Rollen, Dashboards, APIs, Workflows.
6. Mobile App (iOS+Android, Cross-Platform) – 6-8 Tage.
7. AI-Automatisierung – ab 1 Tag: Prozessanalyse, E-Mail-/Dokumentenflows, CRM/ERP-Integration.
8. AI-Agenten – ab 3 Tagen: Rollen, Wissenszugriff, Tool-Anbindung, Freigaben, Monitoring.
PROZESS: 1) Ziel & Nutzen klaeren 2) Konzept & Festpreisrahmen 3) AI-gestuetzte Umsetzung 4) Tests & Abnahme 5) Uebergabe & Weiterentwicklung.
TECHNOLOGIE: Next.js, React, TypeScript, moderne Datenbanken, Supabase, Vercel oder Self-Hosting.
"""

SYSTEM_PROMPT = f"""Du bist NOVA, der proaktive KI-Berater von NeXify AI – einer Premium-Agentur fuer AI-gestuetzte Websites, Shops, Apps und Automatisierung.

{COMPANY_KNOWLEDGE}

DEINE AUFGABE:
- Berate Besucher professionell, freundlich und auf Augenhoehe. Du bist Vertriebsprofi UND technischer Experte.
- Antworte in der Sprache des Nutzers (Deutsch oder Niederlaendisch). Standardsprache: {{language}}.
- Stelle gezielte Qualifizierungsfragen (eine pro Nachricht): Was fuer ein Projekt? Welche Ziele? Zeitrahmen? Budgetrahmen?
- Rechne Preise transparent vor: Arbeitstage x 999 EUR netto. Nenne immer Spannen, keine verbindlichen Festpreise.
- Sobald du genug weisst (Projekttyp + grober Umfang), biete AKTIV an, ein unverbindliches, schriftliches Angebot zu erstellen und per E-Mail zu senden. Sage dann woertlich, dass der Nutzer auf den Button "Angebot per E-Mail erhalten" im Chat klicken kann.
- Halte Antworten kompakt (max. 120 Woerter), nutze kurze Absaetze. Keine Markdown-Ueberschriften, keine Emojis.
- Bleibe ehrlich: keine erfundenen Referenzen, keine Garantien, B2B only.
"""

OFFER_PROMPT = """Erstelle aus dem bisherigen Gespraech ein strukturiertes Angebot als reines JSON (keine Erklaerung, kein Markdown-Zaun) in der Sprache "{language}" mit exakt diesen Feldern:
{{"title": "...", "intro": "2-3 Saetze persoenliche Einleitung an {name}", "items": [{{"name": "...", "description": "1-2 Saetze", "days_min": 1, "days_max": 2}}], "assumptions": ["..."], "next_steps": ["..."]}}
Regeln: Tagessatz 999 EUR netto. Nutze realistische Arbeitstage gemaess Leistungskatalog. Maximal 5 Positionen. Wenn das Gespraech wenig Details enthaelt, erstelle ein sinnvolles Standard-Angebot fuer das besprochene Thema."""


class ChatSessionCreate(BaseModel):
    language: str = "de"


class ChatMessageIn(BaseModel):
    session_id: str
    message: str
    language: str = "de"


class ContactIn(BaseModel):
    name: str
    email: EmailStr
    company: str | None = None
    phone: str | None = None
    message: str
    language: str = "de"


class OfferRequestIn(BaseModel):
    session_id: str
    name: str
    email: EmailStr
    company: str | None = None
    language: str = "de"


async def db() -> asyncpg.Pool | None:
    return DB_POOL


async def save_message(session_id: str, role: str, content: str):
    pool = await db()
    if not pool:
        return
    try:
        async with pool.acquire() as con:
            await con.execute(
                "insert into nexify_chat_messages (id, session_id, role, content) values ($1,$2,$3,$4)",
                uuid.uuid4(), uuid.UUID(session_id), role, content,
            )
    except Exception as e:
        logger.warning(f"save_message failed: {e}")


def get_history(session_id: str, language: str) -> list[dict]:
    if session_id not in HISTORY:
        HISTORY[session_id] = [
            {"role": "system", "content": SYSTEM_PROMPT.replace("{language}", "Niederlaendisch" if language == "nl" else "Deutsch")}
        ]
    return HISTORY[session_id]


async def llm_complete(messages: list[dict], max_tokens: int = 4000) -> str:
    resp = await LLM.chat.completions.create(model=MIMO_MODEL, messages=messages, max_tokens=max_tokens)
    return resp.choices[0].message.content or ""


def offer_email_html(offer: dict, name: str, language: str, price_total: int) -> str:
    nl = language == "nl"
    rows = ""
    for it in offer.get("items", []):
        dmin, dmax = it.get("days_min", 1), it.get("days_max", it.get("days_min", 1))
        days = f"{dmin}" if dmin == dmax else f"{dmin}–{dmax}"
        pmin, pmax = dmin * 999, dmax * 999
        price = f"€ {pmin:,.0f}".replace(",", ".") if dmin == dmax else f"€ {pmin:,.0f} – € {pmax:,.0f}".replace(",", ".")
        rows += f"""<tr>
        <td style="padding:14px 16px;border-bottom:1px solid #26262b;color:#ffffff;font-size:14px;font-weight:600;">{it.get('name','')}<div style="color:#9ca3af;font-weight:400;font-size:13px;padding-top:4px;">{it.get('description','')}</div></td>
        <td style="padding:14px 16px;border-bottom:1px solid #26262b;color:#d4d4d8;font-size:13px;white-space:nowrap;">{days} {'werkdagen' if nl else 'Arbeitstage'}</td>
        <td style="padding:14px 16px;border-bottom:1px solid #26262b;color:#e5e7eb;font-size:13px;white-space:nowrap;text-align:right;">{price}</td></tr>"""
    assumptions = "".join(f"<li style='padding:3px 0;color:#a1a1aa;font-size:13px;'>{a}</li>" for a in offer.get("assumptions", []))
    steps = "".join(f"<li style='padding:3px 0;color:#a1a1aa;font-size:13px;'>{s}</li>" for s in offer.get("next_steps", []))
    t = {
        "subject_note": "Vrijblijvende offerte" if nl else "Unverbindliches Angebot",
        "scope": "Omvang & investering" if nl else "Umfang & Investition",
        "assumptions": "Aannames" if nl else "Annahmen",
        "steps": "Volgende stappen" if nl else "Nächste Schritte",
        "total": "Richtprijs totaal (netto)" if nl else "Richtpreis gesamt (netto)",
        "vat": "excl. btw · dagtarief € 999 netto" if nl else "zzgl. USt. · Tagessatz € 999 netto",
        "cta": "Antwoord eenvoudig op deze e-mail of bel +31 6 133 188 56." if nl else "Antworten Sie einfach auf diese E-Mail oder rufen Sie an: +31 6 133 188 56.",
        "legal": "Dit is een vrijblijvende indicatie, uitsluitend B2B. Een bindende offerte volgt na definitieve scope." if nl else "Dies ist eine unverbindliche Indikation, ausschließlich B2B. Ein verbindliches Angebot folgt nach finaler Scope-Abstimmung.",
    }
    return f"""<!doctype html><html><body style="margin:0;padding:0;background:#0a0a0a;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:32px 12px;"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#111114;border:1px solid #26262b;border-radius:16px;overflow:hidden;">
<tr><td style="padding:32px 32px 20px;border-bottom:1px solid #26262b;">
  <div style="font-family:Georgia,serif;font-size:24px;color:#ffffff;letter-spacing:1px;">Ne<span style="color:#c0c0c8;">X</span>ify <span style="color:#9ca3af;">AI</span></div>
  <div style="font-family:Arial,sans-serif;font-size:11px;color:#71717a;letter-spacing:3px;text-transform:uppercase;padding-top:6px;">{t['subject_note']}</div>
</td></tr>
<tr><td style="padding:28px 32px 8px;font-family:Arial,sans-serif;">
  <h1 style="margin:0 0 12px;color:#ffffff;font-size:20px;font-weight:600;">{offer.get('title','')}</h1>
  <p style="margin:0;color:#a1a1aa;font-size:14px;line-height:1.7;">{offer.get('intro','')}</p>
</td></tr>
<tr><td style="padding:20px 32px;font-family:Arial,sans-serif;">
  <div style="font-size:11px;color:#71717a;letter-spacing:2px;text-transform:uppercase;padding-bottom:10px;">{t['scope']}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #26262b;border-radius:12px;background:#141417;">{rows}
  <tr><td style="padding:16px;color:#ffffff;font-size:14px;font-weight:700;">{t['total']}</td><td></td>
  <td style="padding:16px;color:#ffffff;font-size:16px;font-weight:700;text-align:right;white-space:nowrap;">≈ € {price_total:,.0f}</td></tr></table>
  <div style="color:#71717a;font-size:11px;padding-top:8px;">{t['vat']}</div>
</td></tr>
<tr><td style="padding:8px 32px;font-family:Arial,sans-serif;">
  <div style="font-size:11px;color:#71717a;letter-spacing:2px;text-transform:uppercase;padding-bottom:6px;">{t['assumptions']}</div>
  <ul style="margin:0;padding-left:18px;">{assumptions}</ul>
</td></tr>
<tr><td style="padding:16px 32px;font-family:Arial,sans-serif;">
  <div style="font-size:11px;color:#71717a;letter-spacing:2px;text-transform:uppercase;padding-bottom:6px;">{t['steps']}</div>
  <ul style="margin:0;padding-left:18px;">{steps}</ul>
</td></tr>
<tr><td style="padding:20px 32px 28px;font-family:Arial,sans-serif;">
  <p style="margin:0 0 16px;color:#d4d4d8;font-size:14px;">{t['cta']}</p>
  <p style="margin:0;color:#52525b;font-size:11px;line-height:1.6;">{t['legal']}</p>
</td></tr>
<tr><td style="padding:20px 32px;border-top:1px solid #26262b;font-family:Arial,sans-serif;color:#52525b;font-size:11px;line-height:1.7;">
NeXifyAI by NeXify – Chat it. Automate it. · Pascal Courbois<br/>Graaf van Loonstraat 1E · 5921 JA Venlo · NL · KvK 90483944 · BTW NL865786276B01<br/>support@nexify-automate.com · +31 6 133 188 56
</td></tr>
</table></td></tr></table></body></html>"""


def followup_email_html(offer_row, language: str) -> str:
    nl = language == "nl"
    name = offer_row["name"]
    body = (
        f"Beste {name},<br/><br/>onlangs hebben wij u een vrijblijvende offerte gestuurd. Heeft u nog vragen over de omvang, planning of prijs? Ik denk graag met u mee – een kort antwoord op deze e-mail volstaat.<br/><br/>Met vriendelijke groet,<br/>Pascal Courbois · NeXify AI"
        if nl else
        f"Guten Tag {name},<br/><br/>vor Kurzem haben wir Ihnen ein unverbindliches Angebot gesendet. Haben Sie noch Fragen zu Umfang, Zeitplan oder Preis? Ich unterstütze Sie gerne – eine kurze Antwort auf diese E-Mail genügt.<br/><br/>Mit besten Grüßen,<br/>Pascal Courbois · NeXify AI"
    )
    return f"""<!doctype html><html><body style="margin:0;background:#0a0a0a;padding:32px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" align="center" style="max-width:600px;background:#111114;border:1px solid #26262b;border-radius:16px;">
<tr><td style="padding:32px;font-family:Arial,sans-serif;color:#d4d4d8;font-size:14px;line-height:1.8;">
<div style="font-family:Georgia,serif;font-size:22px;color:#fff;padding-bottom:20px;">Ne<span style="color:#c0c0c8;">X</span>ify <span style="color:#9ca3af;">AI</span></div>
{body}
</td></tr></table></body></html>"""


async def send_email(to: str, subject: str, html: str) -> str | None:
    try:
        params = {"from": SENDER_EMAIL, "to": [to], "subject": subject, "html": html}
        result = await asyncio.to_thread(resend.Emails.send, params)
        return result.get("id")
    except Exception as e:
        logger.error(f"resend send failed: {e}")
        return None


@app.get("/api/health")
async def health():
    pool = await db()
    return {"status": "ok", "db": "supabase" if pool else "unavailable", "time": datetime.now(timezone.utc).isoformat()}


@app.post("/api/chat/session")
async def create_session(body: ChatSessionCreate):
    session_id = str(uuid.uuid4())
    pool = await db()
    if pool:
        try:
            async with pool.acquire() as con:
                await con.execute("insert into nexify_chat_sessions (id, language) values ($1,$2)", uuid.UUID(session_id), body.language)
        except Exception as e:
            logger.warning(f"session insert failed: {e}")
    return {"session_id": session_id}


@app.post("/api/chat")
async def chat(body: ChatMessageIn):
    history = get_history(body.session_id, body.language)
    await save_message(body.session_id, "user", body.message)
    history.append({"role": "user", "content": body.message})

    async def gen():
        full = []
        try:
            stream = await LLM.chat.completions.create(
                model=MIMO_MODEL, messages=history, max_tokens=3000, stream=True,
            )
            async for chunk in stream:
                delta = chunk.choices[0].delta if chunk.choices else None
                content = getattr(delta, "content", None) if delta else None
                if content:
                    full.append(content)
                    yield f"data: {json.dumps({'type': 'delta', 'content': content})}\n\n"
        except Exception as e:
            logger.error(f"chat stream error: {e}")
            yield f"data: {json.dumps({'type': 'error', 'content': str(e)})}\n\n"
        text = "".join(full)
        if text:
            history.append({"role": "assistant", "content": text})
            await save_message(body.session_id, "assistant", text)
        yield f"data: {json.dumps({'type': 'done'})}\n\n"

    return StreamingResponse(gen(), media_type="text/event-stream",
                             headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})


@app.post("/api/contact")
async def contact(body: ContactIn):
    lead_id = uuid.uuid4()
    pool = await db()
    if pool:
        try:
            async with pool.acquire() as con:
                await con.execute(
                    "insert into nexify_leads (id,name,email,company,phone,language,message,source) values ($1,$2,$3,$4,$5,$6,$7,'contact')",
                    lead_id, body.name, body.email, body.company, body.phone, body.language, body.message,
                )
        except Exception as e:
            logger.warning(f"lead insert failed: {e}")
    nl = body.language == "nl"
    confirm_subject = "Wij hebben uw aanvraag ontvangen – NeXify AI" if nl else "Wir haben Ihre Anfrage erhalten – NeXify AI"
    confirm_body = (
        f"Beste {body.name},<br/><br/>hartelijk dank voor uw aanvraag. Wij nemen binnen één werkdag contact met u op.<br/><br/>Met vriendelijke groet,<br/>Pascal Courbois · NeXify AI"
        if nl else
        f"Guten Tag {body.name},<br/><br/>vielen Dank für Ihre Anfrage. Wir melden uns innerhalb eines Werktags persönlich bei Ihnen.<br/><br/>Mit besten Grüßen,<br/>Pascal Courbois · NeXify AI"
    )
    html = f"""<!doctype html><html><body style="margin:0;background:#0a0a0a;padding:32px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" align="center" style="max-width:600px;background:#111114;border:1px solid #26262b;border-radius:16px;">
<tr><td style="padding:32px;font-family:Arial,sans-serif;color:#d4d4d8;font-size:14px;line-height:1.8;">
<div style="font-family:Georgia,serif;font-size:22px;color:#fff;padding-bottom:20px;">Ne<span style="color:#c0c0c8;">X</span>ify <span style="color:#9ca3af;">AI</span></div>
{confirm_body}</td></tr></table></body></html>"""
    asyncio.create_task(send_email(body.email, confirm_subject, html))
    if INTERNAL_NOTIFY_EMAIL:
        notify = f"<p>Neue Anfrage über die Website:</p><p><b>{body.name}</b> ({body.email})<br/>Firma: {body.company or '-'}<br/>Telefon: {body.phone or '-'}<br/>Sprache: {body.language}</p><p>{body.message}</p>"
        asyncio.create_task(send_email(INTERNAL_NOTIFY_EMAIL, f"Neue Website-Anfrage von {body.name}", notify))
    return {"status": "ok", "lead_id": str(lead_id)}


@app.post("/api/offers/request")
async def request_offer(body: OfferRequestIn):
    history = get_history(body.session_id, body.language)
    prompt = OFFER_PROMPT.format(language=body.language, name=body.name)
    try:
        raw = await llm_complete(history + [{"role": "user", "content": prompt}], max_tokens=4000)
    except Exception as e:
        logger.error(f"offer llm failed: {e}")
        raise HTTPException(status_code=502, detail="offer generation failed")
    raw = raw.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    try:
        offer = json.loads(raw)
    except Exception:
        start, end = raw.find("{"), raw.rfind("}")
        if start == -1 or end == -1:
            raise HTTPException(status_code=502, detail="offer parse failed")
        offer = json.loads(raw[start:end + 1])

    total_min = sum(int(i.get("days_min", 1)) for i in offer.get("items", []))
    total_max = sum(int(i.get("days_max", i.get("days_min", 1))) for i in offer.get("items", []))
    price_total = round((total_min + total_max) / 2) * 999

    nl = body.language == "nl"
    subject = f"Uw vrijblijvende offerte van NeXify AI – {offer.get('title', '')}" if nl else f"Ihr unverbindliches Angebot von NeXify AI – {offer.get('title', '')}"
    html = offer_email_html(offer, body.name, body.language, price_total)
    email_id = await send_email(body.email, subject, html)

    offer_id = uuid.uuid4()
    pool = await db()
    if pool:
        try:
            async with pool.acquire() as con:
                await con.execute(
                    """insert into nexify_offers (id,session_id,name,email,company,language,offer_json,price_total,email_id,followup_at)
                       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)""",
                    offer_id, uuid.UUID(body.session_id), body.name, body.email, body.company, body.language,
                    json.dumps(offer), price_total, email_id,
                    datetime.now(timezone.utc) + timedelta(hours=FOLLOWUP_HOURS),
                )
                await con.execute(
                    "insert into nexify_leads (id,name,email,company,language,message,source) values ($1,$2,$3,$4,$5,$6,'chat_offer')",
                    uuid.uuid4(), body.name, body.email, body.company, body.language, offer.get("title", ""),
                )
        except Exception as e:
            logger.warning(f"offer insert failed: {e}")
    if INTERNAL_NOTIFY_EMAIL:
        asyncio.create_task(send_email(
            INTERNAL_NOTIFY_EMAIL,
            f"NOVA hat ein Angebot erstellt: {body.name} ({body.email})",
            f"<p>Angebot <b>{offer.get('title','')}</b> wurde an {body.name} ({body.email}, Firma: {body.company or '-'}) gesendet.<br/>Richtpreis: € {price_total:,}<br/>Session: {body.session_id}</p>",
        ))
    return {
        "status": "sent" if email_id else "generated",
        "offer_id": str(offer_id),
        "offer": offer,
        "price_total": price_total,
        "email_sent": bool(email_id),
    }


async def followup_worker():
    while True:
        try:
            pool = await db()
            if pool:
                async with pool.acquire() as con:
                    rows = await con.fetch(
                        "select * from nexify_offers where followup_sent = false and followup_at < now() limit 20"
                    )
                    for row in rows:
                        nl = row["language"] == "nl"
                        subject = "Heeft u onze offerte ontvangen? – NeXify AI" if nl else "Haben Sie unser Angebot erhalten? – NeXify AI"
                        await send_email(row["email"], subject, followup_email_html(row, row["language"]))
                        await con.execute("update nexify_offers set followup_sent = true, status = 'followed_up' where id = $1", row["id"])
                        logger.info(f"follow-up sent to {row['email']}")
        except Exception as e:
            logger.warning(f"followup worker error: {e}")
        await asyncio.sleep(900)


@app.on_event("startup")
async def startup():
    global DB_POOL
    try:
        DB_POOL = await asyncpg.create_pool(
            host=os.environ.get("SUPABASE_DB_HOST"),
            port=int(os.environ.get("SUPABASE_DB_PORT", "5432")),
            user=os.environ.get("SUPABASE_DB_USER"),
            password=os.environ.get("SUPABASE_DB_PASSWORD"),
            database=os.environ.get("SUPABASE_DB_NAME", "postgres"),
            ssl="require",
            min_size=1,
            max_size=4,
            statement_cache_size=0,
        )
        async with DB_POOL.acquire() as con:
            await con.execute(SCHEMA)
        logger.info("Supabase Postgres connected")
    except Exception as e:
        DB_POOL = None
        logger.error(f"Supabase connection failed: {e}")
    asyncio.create_task(followup_worker())


@app.on_event("shutdown")
async def shutdown():
    if DB_POOL:
        await DB_POOL.close()
