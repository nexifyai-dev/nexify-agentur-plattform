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
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, EmailStr
from openai import AsyncOpenAI

import portal
import booking
import agent as agent_mod
import email_agent
from memory import mem_add, mem_search

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
app.include_router(portal.router)
app.include_router(booking.router)
app.include_router(agent_mod.router)

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
create table if not exists nexify_users (
  id uuid primary key,
  email text unique not null,
  password_hash text not null,
  name text, company text, phone text,
  language text default 'de', role text default 'customer',
  created_at timestamptz default now()
);
create table if not exists nexify_offer_messages (
  id uuid primary key, offer_id uuid, sender text, body text, created_at timestamptz default now()
);
alter table nexify_offers add column if not exists payment_order_id text;
alter table nexify_offers add column if not exists payment_checkout_url text;
alter table nexify_offers add column if not exists payment_status text;
alter table nexify_offers add column if not exists payment_amount numeric;
create table if not exists nexify_tickets (
  id uuid primary key, user_id uuid, name text, email text, subject text,
  language text default 'de', status text default 'open', source text default 'portal',
  created_at timestamptz default now()
);
create table if not exists nexify_ticket_messages (
  id uuid primary key, ticket_id uuid, sender text, body text, created_at timestamptz default now()
);
create table if not exists nexify_slots (
  id uuid primary key, start_at timestamptz not null, duration_min int default 30,
  status text default 'free', name text, email text, phone text, company text, topic text,
  language text default 'de', booked_at timestamptz, created_at timestamptz default now()
);
create table if not exists nexify_agent_messages (
  id uuid primary key, role text, content text, created_at timestamptz default now()
);
create table if not exists nexify_agent_tasks (
  id uuid primary key, title text, instruction text, run_at timestamptz, status text default 'pending',
  result text, created_at timestamptz default now()
);
"""

LEGAL_FOOTER = """NeXify AI by NeXify – chat it. Automate it. · Pascal Courbois<br/>Graaf van Loonstraat 1E · 5921 JA Venlo · NL · KvK 90483944 · BTW NL865786276B01<br/>mail@nexifyai.cloud · +31 6 133 188 56"""


def ci_email(title: str, body_html: str, cta_label: str | None = None, cta_url: str | None = None, language: str = "de") -> str:
    nl = language == "nl"
    cta = ""
    if cta_label and cta_url:
        cta = f"""<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 8px;"><tr><td style="border-radius:999px;background:linear-gradient(120deg,#e4e4e7,#ffffff 45%,#c4c4cc);">
        <a href="{cta_url}" style="display:inline-block;padding:13px 30px;font-family:Arial,sans-serif;font-size:14px;font-weight:700;color:#09090b;text-decoration:none;">{cta_label}</a></td></tr></table>"""
    legal_note = ("Deze e-mail is gericht aan ondernemers (B2B). Vrijblijvende indicaties vormen geen bindend aanbod. Privacyverklaring: nexifyai.cloud/datenschutz"
                  if nl else "Diese E-Mail richtet sich an Unternehmer (B2B). Unverbindliche Indikationen stellen kein bindendes Angebot dar. Datenschutz: nexifyai.cloud/datenschutz")
    return f"""<!doctype html><html><body style="margin:0;padding:0;background:#0a0a0a;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:32px 12px;"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#111114;border:1px solid #26262b;border-radius:16px;overflow:hidden;">
<tr><td style="padding:28px 32px 18px;border-bottom:1px solid #26262b;">
  <div style="font-family:Georgia,serif;font-size:24px;color:#ffffff;letter-spacing:1px;">Ne<span style="color:#c0c0c8;">X</span>ify <span style="color:#9ca3af;">AI</span></div>
  <div style="font-family:Arial,sans-serif;font-size:10px;color:#71717a;letter-spacing:3px;text-transform:uppercase;padding-top:6px;">Chat it. Automate it.</div>
</td></tr>
<tr><td style="padding:28px 32px 8px;font-family:Arial,sans-serif;">
  <h1 style="margin:0 0 14px;color:#ffffff;font-size:19px;font-weight:600;">{title}</h1>
  <div style="color:#a1a1aa;font-size:14px;line-height:1.8;">{body_html}</div>
  {cta}
</td></tr>
<tr><td style="padding:20px 32px 26px;font-family:Arial,sans-serif;">
  <p style="margin:0;color:#52525b;font-size:11px;line-height:1.6;">{legal_note}</p>
</td></tr>
<tr><td style="padding:18px 32px;border-top:1px solid #26262b;font-family:Arial,sans-serif;color:#52525b;font-size:11px;line-height:1.7;">{LEGAL_FOOTER}</td></tr>
</table></td></tr></table></body></html>"""


COMPANY_KNOWLEDGE = """
UNTERNEHMEN: NeXify AI by NeXify – chat it. Automate it. | Inhaber: Pascal Courbois | Graaf van Loonstraat 1E, 5921 JA Venlo, Niederlande | KvK 90483944 | BTW NL865786276B01 | mail@nexifyai.cloud | +31 6 133 188 56 | Ausschliesslich B2B.
INHABER-PROFIL: Pascal Courbois ist Deutscher aus der Grenzregion Limburg, mit einer Niederlaenderin verheiratet und lebt seit gut 5 Jahren in den Niederlanden (Venlo) – zuhause in beiden Kulturen und Sprachen. Mehr als 20 Jahre Berufs- und Praxiserfahrung: IT und Programmierung, kaufmaennischer Bereich sowie jahrelange Vertriebserfahrung u.a. bei Telekom Deutschland, Vodafone und Postcon Deutschland. Daraus resultiert ein tiefes Verstaendnis fuer Unternehmensablaeufe, Vertrieb und Kundenbeduerfnisse in DE und NL – nutze das aktiv als Vertrauensargument, wenn es zum Gespraech passt.
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

SYSTEM_PROMPT = f"""Du bist der offizielle AI-Berater von NeXify AI und trittst unter dem Namen "NeXify AI" auf – einer Premium-Agentur fuer AI-gestuetzte Websites, Shops, Apps und Automatisierung. Nenne dich niemals anders (kein NOVA, kein Assistent-Name).

{COMPANY_KNOWLEDGE}

DEINE ROLLE:
- Du fuehrst eine echte, individuelle Bedarfsanalyse – wie im persoenlichen Erstgespraech einer Premium-Agentur. Der Besucher soll sich verstanden, ernst genommen und individuell betreut fuehlen. Du bist Senior-Berater UND technischer Experte.
- Antworte in der Sprache des Nutzers (Deutsch oder Niederlaendisch). Standardsprache: {{language}}.

BEDARFSANALYSE (natuerlich und gespraechig fuehren, NIEMALS wie einen Fragebogen abarbeiten):
Klaere im Gespraechsverlauf diese Punkte – maximal 1-2 gezielte Fragen pro Nachricht:
1. Unternehmen & Branche: Was macht das Unternehmen, wer ist die Zielgruppe?
2. Ziel: Was soll das Projekt konkret bewirken (mehr Anfragen, Verkauf, Entlastung, Prozesse)?
3. Projekttyp & Kernfunktionen: Website, Shop, App oder Automatisierung? Welche Funktionen sind wichtig?
4. Bestehendes: Gibt es bereits Website, CI/Logo, Inhalte, Systeme (Shop, ERP, CRM)?
5. Stil & Vorbilder: Designrichtung, Beispiele, die gefallen?
6. Zeitrahmen & Besonderheiten.
WICHTIG:
- Gehe auf JEDE Antwort konkret ein: Spiegle kurz, was du verstanden hast, und liefere sofort fachlichen Mehrwert – eine kleine Empfehlung oder Best Practice fuer GENAU seine Branche und Situation.
- Stelle keine Frage doppelt. Rechne Preise transparent vor: Arbeitstage x 999 EUR netto, immer als Spanne.

ANGEBOTS-FREIGABE (STRIKT EINHALTEN):
- Biete das schriftliche Angebot ERST an, wenn du mindestens kennst: Unternehmen/Branche, Projektziel, Projekttyp und die wichtigsten gewuenschten Funktionen. Vorher NIEMALS.
- Sind diese Punkte geklaert: Fasse den verstandenen Bedarf in 2-3 Saetzen zusammen, kuendige ein individuell zugeschnittenes Angebot an und verweise auf den Button "Angebot per E-Mail erhalten" im Chat. Haenge dann als allerletzte Zeichen deiner Nachricht exakt diesen Marker an: [ANGEBOT_BEREIT]
- Der Marker ist ein unsichtbares Systemsignal. Setze ihn ab Angebotsreife in JEDER weiteren Nachricht ans Ende.
- Wuenscht der Nutzer ein persoenliches Gespraech oder einen Anruf: verweise auf die Rueckruf-Seite /rueckruf – dort bucht er einen festen Telefontermin, Pascal Courbois ruft persoenlich an.

STIL & FORMATIERUNG:
- Kompakt (max. 130 Woerter), keine Emojis. Ehrlich bleiben: keine erfundenen Referenzen, keine Garantien, B2B only.
- SPRACHE: Schreibe IMMER korrektes Deutsch mit echten Umlauten und Eszett (ä, ö, ü, ß) – NIEMALS Ersatzschreibweisen wie ae, oe, ue, ss. Beispiel: "für" statt "fuer", "können" statt "koennen". Auf Niederlaendisch: korrektes, natuerliches Niederlaendisch.
- ANREDE: Sieze den Nutzer KONSEQUENT (Sie-Form, niederlaendisch: u-Form). Niemals duzen.
- Strukturiere deine Antworten fuer beste Lesbarkeit: kurze Absaetze (2-3 Saetze), getrennt durch Leerzeilen.
- Hebe zentrale Begriffe, Preise und Zeitraeume mit **Fettschrift** hervor (sparsam, 1-3 pro Nachricht).
- Nutze fuer Aufzaehlungen (Leistungen, Optionen, naechste Schritte) eine Liste mit "- " am Zeilenanfang, max. 5 Punkte, jeder Punkt eine Zeile.
- KEINE Markdown-Ueberschriften (#), KEINE Tabellen, KEINE Links in Markdown-Syntax.
- Deine Frage an den Nutzer steht immer als eigener, letzter Absatz.
"""

OFFER_READY_MARKER = "[ANGEBOT_BEREIT]"

OFFER_PROMPT = """Erstelle aus dem gesamten bisherigen Beratungsgespraech ein INDIVIDUELLES Premium-Angebot als reines JSON (keine Erklaerung, kein Markdown-Zaun) in der Sprache "{language}" mit exakt diesen Feldern:
{{"title": "praegnanter Projekttitel mit Bezug zum Unternehmen des Kunden", "intro": "3-4 Saetze persoenliche Einleitung an {name}: nimm konkret Bezug auf sein Unternehmen, seine Branche und die im Gespraech genannten Ziele", "summary": ["4-7 Stichpunkte: die im Gespraech geaeusserten Anforderungen und Wuensche des Kunden"], "items": [{{"name": "...", "description": "2-3 Saetze, konkret auf die besprochenen Beduerfnisse zugeschnitten – nenne Branche, Funktionen und Ziele aus dem Gespraech", "days_min": 1, "days_max": 2}}], "recommendation": "2-3 Saetze persoenliche Experten-Empfehlung fuer genau diesen Kunden (sinnvolle Prioritaeten, empfohlene erste Ausbaustufe, was sich besonders lohnt)", "assumptions": ["..."], "next_steps": ["..."]}}
REGELN:
- Schreibe IMMER korrekte Umlaute und Eszett (ä, ö, ü, ß) – niemals Ersatzschreibweisen wie ae, oe, ue, ss.
- Tagessatz 999 EUR netto, realistische Arbeitstage gemaess Leistungskatalog, maximal 5 Positionen.
- JEDE Position muss erkennbar aus dem Gespraech abgeleitet sein – keine generischen Fuellpositionen.
- Nicht besprochene Details: KEINE stillen Annahmen im Leistungsumfang – fuehre sie transparent unter assumptions auf.
- Schreibe warm, persoenlich und professionell. Der Kunde muss spueren, dass dieses Angebot exklusiv fuer ihn erstellt wurde."""


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
    phone: str | None = None
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
    summary_items = "".join(f"<li style='padding:3px 0;color:#d4d4d8;font-size:13px;'>{s}</li>" for s in offer.get("summary", []))
    summary_html = f"""<tr><td style="padding:16px 32px 0;font-family:Arial,sans-serif;">
  <div style="font-size:11px;color:#71717a;letter-spacing:2px;text-transform:uppercase;padding-bottom:6px;">{'Uw wensen in het kort' if nl else 'Ihre Anforderungen im Überblick'}</div>
  <ul style="margin:0;padding-left:18px;">{summary_items}</ul></td></tr>""" if summary_items else ""
    reco_html = f"""<tr><td style="padding:14px 32px 4px;font-family:Arial,sans-serif;">
  <div style="border-left:3px solid #c0c0c8;background:#141417;border-radius:8px;padding:14px 16px;">
    <div style="font-size:11px;color:#71717a;letter-spacing:2px;text-transform:uppercase;padding-bottom:6px;">{'Onze aanbeveling voor u' if nl else 'Unsere Empfehlung für Sie'}</div>
    <div style="color:#d4d4d8;font-size:13px;line-height:1.7;">{offer.get('recommendation','')}</div>
  </div></td></tr>""" if offer.get("recommendation") else ""
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
{summary_html}
<tr><td style="padding:20px 32px;font-family:Arial,sans-serif;">
  <div style="font-size:11px;color:#71717a;letter-spacing:2px;text-transform:uppercase;padding-bottom:10px;">{t['scope']}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #26262b;border-radius:12px;background:#141417;">{rows}
  <tr><td style="padding:16px;color:#ffffff;font-size:14px;font-weight:700;">{t['total']}</td><td></td>
  <td style="padding:16px;color:#ffffff;font-size:16px;font-weight:700;text-align:right;white-space:nowrap;">≈ € {price_total:,.0f}</td></tr></table>
  <div style="color:#71717a;font-size:11px;padding-top:8px;">{t['vat']}</div>
</td></tr>
{reco_html}
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
NeXify AI by NeXify – chat it. Automate it. · Pascal Courbois<br/>Graaf van Loonstraat 1E · 5921 JA Venlo · NL · KvK 90483944 · BTW NL865786276B01<br/>mail@nexifyai.cloud · +31 6 133 188 56
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


def _smtp_send(to: str, subject: str, html: str) -> str:
    import smtplib
    from email.mime.text import MIMEText
    msg = MIMEText(html, "html", "utf-8")
    msg["Subject"] = subject
    msg["From"] = SENDER_EMAIL
    msg["To"] = to
    reply_to = os.environ.get("REPLY_TO_EMAIL")
    if reply_to:
        msg["Reply-To"] = reply_to
    with smtplib.SMTP_SSL(os.environ.get("SMTP_HOST", "smtp.hostinger.com"), int(os.environ.get("SMTP_PORT", "465"))) as s:
        s.login(os.environ["IMAP_USER"], os.environ["IMAP_PASSWORD"])
        s.send_message(msg)
    return "smtp"


async def send_email(to: str, subject: str, html: str, attachments: list | None = None) -> str | None:
    try:
        params = {"from": SENDER_EMAIL, "to": [to], "subject": subject, "html": html}
        reply_to = os.environ.get("REPLY_TO_EMAIL")
        if reply_to:
            params["reply_to"] = [reply_to]
        if attachments:
            params["attachments"] = attachments
        result = await asyncio.to_thread(resend.Emails.send, params)
        return result.get("id")
    except Exception as e:
        logger.error(f"resend send failed: {e} – trying Hostinger SMTP fallback")
        try:
            return await asyncio.to_thread(_smtp_send, to, subject, html)
        except Exception as e2:
            logger.error(f"smtp fallback failed: {e2}")
            return None


def offer_pdf_bytes(offer: dict, name: str, company: str | None, language: str, price_total: int) -> bytes:
    import io
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.colors import HexColor
    from reportlab.pdfgen import canvas as pdfcanvas

    nl = language == "nl"
    buf = io.BytesIO()
    c = pdfcanvas.Canvas(buf, pagesize=A4)
    W, H = A4
    bg, panel, line = HexColor("#0a0a0c"), HexColor("#141417"), HexColor("#2a2a30")
    white, silver, muted = HexColor("#fafafa"), HexColor("#c0c0c8"), HexColor("#8f8f98")

    def page_frame():
        c.setFillColor(bg); c.rect(0, 0, W, H, fill=1, stroke=0)
        c.setFillColor(white); c.setFont("Times-Bold", 22)
        c.drawString(48, H - 64, "NeXify")
        c.setFillColor(silver); c.drawString(48 + c.stringWidth("NeXify", "Times-Bold", 22) + 4, H - 64, "AI")
        c.setFillColor(muted); c.setFont("Helvetica", 7)
        c.drawString(48, H - 78, "NEXIFY AI BY NEXIFY  ·  CHAT IT. AUTOMATE IT.")
        c.setStrokeColor(line); c.setLineWidth(0.7); c.line(48, H - 92, W - 48, H - 92)
        c.setFillColor(muted); c.setFont("Helvetica", 7)
        footer = "NeXify AI by NeXify – chat it. Automate it. · Pascal Courbois · Graaf van Loonstraat 1E · 5921 JA Venlo · NL · KvK 90483944 · BTW NL865786276B01"
        c.drawCentredString(W / 2, 42, footer)
        c.drawCentredString(W / 2, 32, "mail@nexifyai.cloud · +31 6 133 188 56 · nexifyai.cloud")

    def wrap(text, font, size, max_w):
        words, lines, cur = (text or "").split(), [], ""
        for w in words:
            test = (cur + " " + w).strip()
            if c.stringWidth(test, font, size) <= max_w:
                cur = test
            else:
                lines.append(cur); cur = w
        if cur:
            lines.append(cur)
        return lines

    page_frame()
    y = H - 130
    c.setFillColor(muted); c.setFont("Helvetica-Bold", 8)
    c.drawString(48, y, ("VRIJBLIJVENDE OFFERTE" if nl else "UNVERBINDLICHES ANGEBOT") + "  ·  " + datetime.now(timezone.utc).strftime("%d.%m.%Y"))
    y -= 26
    c.setFillColor(white); c.setFont("Helvetica-Bold", 17)
    for ln in wrap(offer.get("title", ""), "Helvetica-Bold", 17, W - 96):
        c.drawString(48, y, ln); y -= 22
    y -= 4
    c.setFillColor(muted); c.setFont("Helvetica", 9.5)
    c.drawString(48, y, f"{'Voor' if nl else 'Für'}: {name}" + (f" · {company}" if company else ""))
    y -= 24
    c.setFillColor(HexColor("#d4d4d8")); c.setFont("Helvetica", 10)
    for ln in wrap(offer.get("intro", ""), "Helvetica", 10, W - 96):
        c.drawString(48, y, ln); y -= 15
    y -= 14

    c.setFillColor(muted); c.setFont("Helvetica-Bold", 8)
    c.drawString(48, y, "OMVANG & INVESTERING" if nl else "UMFANG & INVESTITION")
    y -= 12
    for it in offer.get("items", []):
        dmin, dmax = it.get("days_min", 1), it.get("days_max", it.get("days_min", 1))
        rows = wrap(it.get("description", ""), "Helvetica", 8.5, W - 250)
        box_h = 34 + len(rows) * 11
        c.setFillColor(panel); c.setStrokeColor(line)
        c.roundRect(48, y - box_h, W - 96, box_h, 6, fill=1, stroke=1)
        c.setFillColor(white); c.setFont("Helvetica-Bold", 10.5)
        c.drawString(60, y - 18, str(it.get("name", "")))
        c.setFillColor(muted); c.setFont("Helvetica", 8.5)
        yy = y - 32
        for ln in rows:
            c.drawString(60, yy, ln); yy -= 11
        days = f"{dmin}" if dmin == dmax else f"{dmin}–{dmax}"
        pmin, pmax = round(dmin * 999), round(dmax * 999)
        price = f"€ {pmin:,.0f}".replace(",", ".") if dmin == dmax else f"€ {pmin:,.0f} – € {pmax:,.0f}".replace(",", ".")
        c.setFillColor(silver); c.setFont("Helvetica-Bold", 9)
        c.drawRightString(W - 60, y - 18, price)
        c.setFillColor(muted); c.setFont("Helvetica", 8)
        c.drawRightString(W - 60, y - 30, f"{days} {'werkdagen' if nl else 'Arbeitstage'}")
        y -= box_h + 8
        if y < 160:
            c.showPage(); page_frame(); y = H - 130

    y -= 6
    c.setStrokeColor(line); c.line(48, y, W - 48, y)
    y -= 22
    c.setFillColor(white); c.setFont("Helvetica-Bold", 12)
    c.drawString(48, y, "Richtprijs totaal (netto)" if nl else "Richtpreis gesamt (netto)")
    c.drawRightString(W - 48, y, f"≈ € {price_total:,.0f}".replace(",", "."))
    y -= 14
    c.setFillColor(muted); c.setFont("Helvetica", 8)
    c.drawString(48, y, "excl. btw · dagtarief € 999 netto" if nl else "zzgl. USt. · Tagessatz € 999 netto")
    y -= 26

    reco = offer.get("recommendation")
    if reco:
        lines_r = wrap(str(reco), "Helvetica", 9, W - 130)
        box_h = 32 + len(lines_r) * 13
        if y - box_h < 120:
            c.showPage(); page_frame(); y = H - 130
        c.setFillColor(panel); c.setStrokeColor(silver); c.setLineWidth(0.8)
        c.roundRect(48, y - box_h, W - 96, box_h, 6, fill=1, stroke=1)
        c.setFillColor(muted); c.setFont("Helvetica-Bold", 8)
        c.drawString(60, y - 17, "ONZE AANBEVELING VOOR U" if nl else "UNSERE EMPFEHLUNG FÜR SIE")
        c.setFillColor(HexColor("#d4d4d8")); c.setFont("Helvetica", 9)
        yy = y - 31
        for ln in lines_r:
            c.drawString(60, yy, ln); yy -= 13
        y -= box_h + 16

    for label, items in [
        ("AANNAMES" if nl else "ANNAHMEN", offer.get("assumptions", [])),
        ("VOLGENDE STAPPEN" if nl else "NÄCHSTE SCHRITTE", offer.get("next_steps", [])),
    ]:
        if not items:
            continue
        if y < 140:
            c.showPage(); page_frame(); y = H - 130
        c.setFillColor(muted); c.setFont("Helvetica-Bold", 8)
        c.drawString(48, y, label); y -= 14
        c.setFillColor(HexColor("#a1a1aa")); c.setFont("Helvetica", 9)
        for it in items:
            for ln in wrap("•  " + str(it), "Helvetica", 9, W - 110):
                c.drawString(56, y, ln); y -= 13
        y -= 10

    if y < 110:
        c.showPage(); page_frame(); y = H - 130
    c.setFillColor(muted); c.setFont("Helvetica-Oblique", 7.5)
    legal = ("Dit is een vrijblijvende indicatie, uitsluitend B2B. Een bindende offerte volgt na definitieve scope-afstemming. Geldigheid: 30 dagen."
             if nl else "Dies ist eine unverbindliche Indikation, ausschließlich B2B. Ein verbindliches Angebot folgt nach finaler Scope-Abstimmung. Gültigkeit: 30 Tage.")
    for ln in wrap(legal, "Helvetica-Oblique", 7.5, W - 96):
        c.drawString(48, y, ln); y -= 10

    c.save()
    return buf.getvalue()


TICKET_AI_MIN = int(os.environ.get("TICKET_AI_DELAY_MIN_SECONDS", "180"))
TICKET_AI_MAX = int(os.environ.get("TICKET_AI_DELAY_MAX_SECONDS", "1800"))

SUPPORT_PROMPT = """Du bist der AI-Support von "NeXify AI by NeXify – chat it. Automate it." (Premium-Agentur fuer Websites, Shops, Apps, AI-Automatisierung; Tagessatz 999 EUR netto, B2B, Inhaber Pascal Courbois, mail@nexifyai.cloud, +31 6 133 188 56).
Beantworte die folgende Support-Anfrage professionell, konkret und hilfreich in der Sprache der Anfrage (Deutsch oder Niederlaendisch). Schreibe IMMER korrekte Umlaute und Eszett (ä, ö, ü, ß) – niemals ae/oe/ue/ss. Max. 180 Woerter, keine Emojis, kein Markdown. Wenn die Anfrage menschliche Pruefung erfordert (Vertraege, Beschwerden, individuelle Preiszusagen), kuendige an, dass sich Pascal Courbois persoenlich meldet. Unterschreibe nicht (Signatur wird automatisch ergaenzt)."""


async def ai_ticket_reply(ticket_id: str, delay_seconds: int | None = None):
    import random
    delay = delay_seconds if delay_seconds is not None else random.randint(TICKET_AI_MIN, TICKET_AI_MAX)
    logger.info(f"ticket {ticket_id}: AI reply scheduled in {delay}s")
    await asyncio.sleep(delay)
    pool = await db()
    if not pool:
        return
    try:
        async with pool.acquire() as con:
            ticket = await con.fetchrow("select * from nexify_tickets where id = $1", uuid.UUID(ticket_id))
            if not ticket:
                return
            msgs = await con.fetch("select * from nexify_ticket_messages where ticket_id = $1 order by created_at asc", uuid.UUID(ticket_id))
            if msgs and msgs[-1]["sender"] in ("ai", "admin"):
                return
        thread = "\n\n".join(f"[{m['sender']}] {m['body']}" for m in msgs)
        memories = await mem_search(ticket["email"], f"{ticket['subject']} {msgs[-1]['body'][:300]}")
        mem_block = ("\n\nBEKANNTE INFORMATIONEN UEBER DIESEN KUNDEN aus frueheren Kontakten (nutze sie fuer eine persoenlichere Antwort, erwaehne die Quelle nicht):\n- " + "\n- ".join(memories)) if memories else ""
        reply = await llm_complete([
            {"role": "system", "content": SUPPORT_PROMPT},
            {"role": "user", "content": f"Betreff: {ticket['subject']}\nName: {ticket['name']}\n\nVerlauf:\n{thread}{mem_block}"},
        ], max_tokens=2500)
        asyncio.create_task(mem_add(ticket["email"], [
            {"role": "user", "content": f"Support-Anfrage ({ticket['subject']}): {msgs[-1]['body'][:1500]}"},
            {"role": "assistant", "content": reply[:1500]},
        ], {"source": "support_ticket"}))
        async with pool.acquire() as con:
            await con.execute("insert into nexify_ticket_messages (id,ticket_id,sender,body) values ($1,$2,'ai',$3)", uuid.uuid4(), uuid.UUID(ticket_id), reply)
            await con.execute("update nexify_tickets set status='answered' where id=$1", uuid.UUID(ticket_id))
        nl = ticket["language"] == "nl"
        greeting = f"Beste {ticket['name']}," if nl else f"Guten Tag {ticket['name']},"
        sig = ("Met vriendelijke groet<br/><b>NeXify AI Support</b><br/>NeXify AI by NeXify – chat it. Automate it." if nl
               else "Mit besten Grüßen<br/><b>NeXify AI Support</b><br/>NeXify AI by NeXify – chat it. Automate it.")
        body = f"<p>{greeting}</p><p>{reply.replace(chr(10), '<br/>')}</p><p style='margin-top:18px;'>{sig}</p>"
        subject = f"Re: {ticket['subject']} – NeXify AI Support"
        await send_email(ticket["email"], subject, ci_email(subject, body, cta_label="Naar het klantportaal" if nl else "Zum Kundenportal", cta_url=f"{os.environ.get('FRONTEND_URL','')}/konto", language=ticket["language"]))
        logger.info(f"ticket {ticket_id}: AI reply sent")
    except Exception as e:
        logger.error(f"ai_ticket_reply failed: {e}")


@app.get("/api/health")
async def health():
    pool = await db()
    return {"status": "ok", "db": "supabase" if pool else "unavailable", "time": datetime.now(timezone.utc).isoformat()}


@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError):
    from fastapi.responses import JSONResponse
    if "UUID" in str(exc):
        return JSONResponse(status_code=400, content={"detail": "Ungültige ID"})
    return JSONResponse(status_code=500, content={"detail": "Interner Fehler"})


def _strip_html(html: str) -> str:
    import re
    text = re.sub(r"<(style|script)[^>]*>.*?</\1>", " ", html, flags=re.S | re.I)
    text = re.sub(r"<br\s*/?>|</p>|</div>", "\n", text, flags=re.I)
    text = re.sub(r"<[^>]+>", " ", text)
    return re.sub(r"[ \t]+", " ", text).strip()


def _guess_language(text: str) -> str:
    t = f" {text.lower()} "
    nl_hits = sum(t.count(f" {w} ") for w in ("de", "het", "een", "wij", "graag", "offerte", "bedankt", "vriendelijke", "goedemorgen", "kunnen", "jullie", "ik"))
    de_hits = sum(t.count(f" {w} ") for w in ("der", "die", "das", "und", "wir", "bitte", "danke", "angebot", "freundlichen", "können", "ich", "sie"))
    return "nl" if nl_hits > de_hits else "de"


async def process_inbound_email(data: dict):
    import re
    from email.utils import parseaddr
    email_id = data.get("email_id")
    from_name, from_addr = parseaddr(data.get("from") or "")
    from_addr = (from_addr or "").lower()
    subject = data.get("subject") or "(kein Betreff)"
    if not from_addr or from_addr.endswith("@nexifyai.cloud") or from_addr.endswith("@resend.dev"):
        return
    text = ""
    try:
        import httpx
        async with httpx.AsyncClient(timeout=20.0) as client:
            r = await client.get(f"https://api.resend.com/emails/receiving/{email_id}",
                                 headers={"Authorization": f"Bearer {RESEND_API_KEY}"})
        if r.status_code == 200:
            d = r.json()
            subject = d.get("subject") or subject
            text = d.get("text") or _strip_html(d.get("html") or "")
            if not from_name:
                from_name = parseaddr(d.get("headers", {}).get("from", ""))[0]
    except Exception as e:
        logger.warning(f"inbound content fetch failed: {e}")
    if not text:
        text = "(Inhalt konnte nicht geladen werden – siehe Resend-Dashboard)"
    text = text[:6000]
    name = from_name or from_addr.split("@")[0]
    language = _guess_language(f"{subject} {text}")
    pool = await db()
    if not pool:
        return
    ticket_id = None
    clean_subject = re.sub(r"^(re|aw|fwd?|antw)\s*:\s*", "", subject, flags=re.I).strip()
    async with pool.acquire() as con:
        existing = await con.fetchrow(
            "select id from nexify_tickets where lower(email)=$1 and lower(subject) like $2 order by created_at desc limit 1",
            from_addr, f"%{clean_subject.lower()[:60]}%") if clean_subject else None
        if existing and subject.lower().startswith(("re:", "aw:", "antw:")):
            ticket_id = existing["id"]
            await con.execute("update nexify_tickets set status='open' where id=$1", ticket_id)
        else:
            ticket_id = uuid.uuid4()
            await con.execute(
                "insert into nexify_tickets (id,name,email,subject,language,source) values ($1,$2,$3,$4,$5,'email')",
                ticket_id, name, from_addr, subject[:250], language)
        await con.execute("insert into nexify_ticket_messages (id,ticket_id,sender,body) values ($1,$2,'customer',$3)",
                          uuid.uuid4(), ticket_id, text)
        has_lead = await con.fetchval("select 1 from nexify_leads where lower(email)=$1 limit 1", from_addr)
        if not has_lead:
            await con.execute(
                "insert into nexify_leads (id,name,email,language,message,source) values ($1,$2,$3,$4,$5,'email')",
                uuid.uuid4(), name, from_addr, language, f"E-Mail an mail@nexifyai.cloud: {subject}")
    asyncio.create_task(ai_ticket_reply(str(ticket_id)))
    if INTERNAL_NOTIFY_EMAIL:
        asyncio.create_task(send_email(
            INTERNAL_NOTIFY_EMAIL, f"Eingehende E-Mail: {subject} ({from_addr})",
            ci_email("Eingehende E-Mail", f"<p><b>{name}</b> ({from_addr}):</p><p style='border-left:2px solid #52525b;padding-left:12px;white-space:pre-wrap;'>{text[:1500]}</p><p>Die AI antwortet automatisch zeitversetzt. Im Admin-Bereich können Sie vorher selbst antworten.</p>", cta_label="Im CRM öffnen", cta_url=f"{os.environ.get('FRONTEND_URL','')}/admin")))
    logger.info(f"inbound email processed: ticket {ticket_id} from {from_addr}")


@app.post("/api/webhooks/resend-inbound")
async def resend_inbound(request: Request):
    try:
        payload = await request.json()
    except Exception:
        return {"status": "ignored"}
    if payload.get("type") != "email.received":
        return {"status": "ignored"}
    asyncio.create_task(process_inbound_email(payload.get("data") or {}))
    return {"status": "ok"}


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
        hold = len(OFFER_READY_MARKER) + 8
        pending = ""
        try:
            stream = await LLM.chat.completions.create(
                model=MIMO_MODEL, messages=history, max_tokens=3000, stream=True,
            )
            async for chunk in stream:
                delta = chunk.choices[0].delta if chunk.choices else None
                content = getattr(delta, "content", None) if delta else None
                if content:
                    full.append(content)
                    pending += content
                    if len(pending) > hold:
                        emit, pending = pending[:-hold], pending[-hold:]
                        yield f"data: {json.dumps({'type': 'delta', 'content': emit})}\n\n"
        except Exception as e:
            logger.error(f"chat stream error: {e}")
            yield f"data: {json.dumps({'type': 'error', 'content': str(e)})}\n\n"
        text = "".join(full)
        ready = OFFER_READY_MARKER in text
        tail = pending.replace(OFFER_READY_MARKER, "").rstrip()
        if tail:
            yield f"data: {json.dumps({'type': 'delta', 'content': tail})}\n\n"
        if text:
            clean = text.replace(OFFER_READY_MARKER, "").rstrip()
            history.append({"role": "assistant", "content": clean})
            await save_message(body.session_id, "assistant", clean)
        yield f"data: {json.dumps({'type': 'offer_ready', 'ready': ready})}\n\n"
        yield f"data: {json.dumps({'type': 'done'})}\n\n"

    return StreamingResponse(gen(), media_type="text/event-stream",
                             headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})


@app.post("/api/contact")
async def contact(body: ContactIn):
    lead_id = uuid.uuid4()
    ticket_id = uuid.uuid4()
    pool = await db()
    if pool:
        try:
            async with pool.acquire() as con:
                await con.execute(
                    "insert into nexify_leads (id,name,email,company,phone,language,message,source) values ($1,$2,$3,$4,$5,$6,$7,'contact')",
                    lead_id, body.name, body.email, body.company, body.phone, body.language, body.message,
                )
                subject_t = "Kontaktanfrage über die Website" if body.language != "nl" else "Contactaanvraag via de website"
                await con.execute(
                    "insert into nexify_tickets (id,name,email,subject,language,source) values ($1,$2,$3,$4,$5,'contact')",
                    ticket_id, body.name, body.email, subject_t, body.language,
                )
                await con.execute(
                    "insert into nexify_ticket_messages (id,ticket_id,sender,body) values ($1,$2,'customer',$3)",
                    uuid.uuid4(), ticket_id, body.message,
                )
            asyncio.create_task(ai_ticket_reply(str(ticket_id)))
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
    try:
        import base64
        pdf = offer_pdf_bytes(offer, body.name, body.company, body.language, price_total)
        attachments = [{"filename": "NeXify-AI-Angebot.pdf" if body.language != "nl" else "NeXify-AI-Offerte.pdf", "content": base64.b64encode(pdf).decode()}]
    except Exception as e:
        logger.error(f"pdf generation failed: {e}")
        attachments = None
    email_id = await send_email(body.email, subject, html, attachments=attachments)

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
                    "insert into nexify_leads (id,name,email,company,phone,language,message,source) values ($1,$2,$3,$4,$5,$6,$7,'chat_offer')",
                    uuid.uuid4(), body.name, body.email, body.company, body.phone, body.language, offer.get("title", ""),
                )
        except Exception as e:
            logger.warning(f"offer insert failed: {e}")
    if INTERNAL_NOTIFY_EMAIL:
        asyncio.create_task(send_email(
            INTERNAL_NOTIFY_EMAIL,
            f"NeXify AI Berater hat ein Angebot erstellt: {body.name} ({body.email})",
            f"<p>Angebot <b>{offer.get('title','')}</b> wurde an {body.name} ({body.email}, Firma: {body.company or '-'}) gesendet.<br/>Richtpreis: € {price_total:,}<br/>Session: {body.session_id}</p>",
        ))
    asyncio.create_task(send_account_invite(str(offer_id), body.name, body.email, body.language))
    convo = [m for m in history if m["role"] in ("user", "assistant")][-12:]
    if convo:
        asyncio.create_task(mem_add(body.email, convo, {"source": "offer_chat", "offer_title": offer.get("title", "")}))
    return {
        "status": "sent" if email_id else "generated",
        "offer_id": str(offer_id),
        "offer": offer,
        "price_total": price_total,
        "email_sent": bool(email_id),
    }


async def send_account_invite(offer_id: str, name: str, email: str, language: str):
    nl = language == "nl"
    pool = await db()
    existing = None
    if pool:
        try:
            async with pool.acquire() as con:
                existing = await con.fetchrow("select id from nexify_users where email = $1", email.lower())
        except Exception as e:
            logger.warning(f"invite lookup failed: {e}")
    frontend = os.environ.get("FRONTEND_URL", "")
    if existing:
        cta_url = f"{frontend}/login"
        cta_label = "Naar het klantportaal" if nl else "Zum Kundenportal"
        body = (f"Beste {name},<br/><br/>uw nieuwe offerte staat klaar in uw klantportaal. Daar kunt u de offerte inzien, aannemen of afwijzen, vragen stellen en uw gegevens beheren."
                if nl else
                f"Guten Tag {name},<br/><br/>Ihr neues Angebot liegt in Ihrem Kundenportal bereit. Dort können Sie das Angebot einsehen, annehmen oder ablehnen, Rückfragen stellen und Ihre Daten verwalten.")
        title = "Uw offerte staat klaar in het klantportaal" if nl else "Ihr Angebot liegt im Kundenportal bereit"
    else:
        token = portal.create_invite_token(email.lower(), offer_id)
        cta_url = f"{frontend}/registrieren?token={token}"
        cta_label = "Klantaccount aanmaken" if nl else "Kundenkonto jetzt anlegen"
        body = (f"Beste {name},<br/><br/>maak in één minuut uw persoonlijke klantaccount aan. Daar kunt u uw offerte inzien, aannemen of afwijzen, vragen stellen, nieuwe offertes aanvragen en uw gegevens beheren – overzichtelijk op één plek."
                if nl else
                f"Guten Tag {name},<br/><br/>legen Sie in einer Minute Ihr persönliches Kundenkonto an. Dort können Sie Ihr Angebot einsehen, annehmen oder ablehnen, Rückfragen stellen, neue Angebote anfordern und Ihre Daten verwalten – übersichtlich an einem Ort.")
        title = "Uw persoonlijke klantaccount bij NeXify AI" if nl else "Ihr persönliches Kundenkonto bei NeXify AI"
    await send_email(email, title, ci_email(title, body, cta_label=cta_label, cta_url=cta_url, language=language))


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
    portal.init(db, send_email, ci_email, os.environ.get("FRONTEND_URL", ""), extras={
        "offer_pdf": offer_pdf_bytes,
        "offer_email_html": offer_email_html,
        "send_account_invite": send_account_invite,
        "ai_ticket_reply": ai_ticket_reply,
    })
    await portal.seed_admin(db)
    booking.init(db, send_email, ci_email, os.environ.get("FRONTEND_URL", ""))
    agent_mod.init(db, LLM, MIMO_MODEL, send_email, ci_email, os.environ.get("FRONTEND_URL", ""))
    email_agent.init(db, llm_complete, ai_ticket_reply, send_email, ci_email, os.environ.get("FRONTEND_URL", ""))
    asyncio.create_task(followup_worker())
    asyncio.create_task(agent_mod.task_worker())
    asyncio.create_task(email_agent.email_worker())


@app.on_event("shutdown")
async def shutdown():
    if DB_POOL:
        await DB_POOL.close()
