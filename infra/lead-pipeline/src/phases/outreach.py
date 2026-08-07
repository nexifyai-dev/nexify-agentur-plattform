"""NeXify AI Späher — Phase 4: Outreach

Generiert personalisierte Outreach-E-Mail via 9Router LLM,
erwähnt Demo-Link + Preis 449€/Tag, deutsch, max 120 Wörter.

Pipeline-Phase 4 von 4: Discovery → Enrichment → Demo-Gen → Outreach
"""

import asyncio
import json
import logging
import os
import httpx
from urllib.parse import urlparse

logger = logging.getLogger(__name__)

NINE_ROUTER_URL = os.getenv("NINE_ROUTER_URL", "http://127.0.0.1:20128/v1")
NINE_ROUTER_KEY = os.getenv("NINE_ROUTER_KEY") or os.getenv("OPENAI_API_KEY") or os.getenv("NINEROUTER_API_KEY") or "nexifyai-internal"
OUTREACH_MODEL = os.getenv("OUTREACH_MODEL", "ds/deepseek-v4-flash")


async def send_outreach(lead: dict, demo: dict) -> dict:
    """Phase 4: Generiere personalisierte Outreach-E-Mail.

    1. Personalisierte E-Mail via 9Router LLM
    2. Demo-Link + Preis 449€/Tag erwähnt
    3. Max 120 Wörter, Deutsch, CTA: 15-Min Call

    Args:
        lead: Angereicherter Lead-Dict (mit enrichment-Daten)
        demo: Demo-Dict aus generate_demo (wird nicht mehr für URL genutzt)

    Returns:
        Dict mit subject, body, recipient, status
    """
    demo_url = demo.get("demo_url", "")  # noqa: kept for compat, unused — Calendly replaces demos
    contact_email = lead.get("contact_email", "")
    if not contact_email:
        recipient = lead.get("url", "unbekannt")
        recipient = urlparse(recipient).netloc if recipient.startswith("http") else recipient
        # Keine Fake-Emails für Aggregator-Domains
        if recipient in ("unbekannt", "") or recipient.startswith("www.") and "." not in recipient[4:]:
            contact_email = ""
        elif any(d in recipient for d in ("anwalt.de", "doctolib.de", "jameda.de", "gelbeseiten.de")):
            contact_email = ""
        else:
            contact_email = f"info@{recipient}" if recipient != "unbekannt" else ""

    # Kein Empfänger = kein Outreach
    if not contact_email:
        return {
            "status": "skipped",
            "reason": "Keine valide E-Mail-Adresse",
            "subject": None,
            "body": None,
            "recipient": "",
        }

    company_name = lead.get("business_name", lead.get("name", "Ihr Unternehmen"))
    industry = lead.get("industry", "")
    pain_points = lead.get("pain_points", [])
    region = lead.get("region", "")
    website_quality = lead.get("website_quality", "")
    has_chatbot = lead.get("has_chatbot", False)

    # Skip if already has chatbot
    if has_chatbot:
        return {
            "status": "skipped",
            "reason": "Lead hat bereits Chatbot",
            "subject": None,
            "body": None,
            "recipient": contact_email,
        }

    pain_text = "\n".join(f"- {p}" for p in pain_points[:3]) if pain_points else "Keine spezifischen Daten"

    prompt = f"""Schreibe eine professionelle B2B-Outreach-E-Mail an einen Handwerksbetrieb.

Firma: {company_name}
Branche: {industry}
Region: {region}
Website-Qualität: {website_quality}
Schmerzpunkte: {pain_text}
Preis: 449€/Tag

Regeln (NXAI-KOMM-001 v2.0, verbindlich):
- Max 100 Wörter Fließtext
- Deutsch, nüchtern-professionell, formelles "Sie"
- Aufbau: [1] Eröffnung 1 Satz persönlich, [2] Problem/Beobachtung 1-2 Sätze, [3] Brücke mit konkreter Zahl/Ergebnis, [4] CTA = 1 einfache Frage, [5] KEINE Signatur (wird automatisch angehängt)
- KEINE Selbstvorstellung, KEIN "Ich heiße", KEIN Satzanfang mit "Ich" oder "Wir"
- CTA NICHT Termin/Demo — sondern: "Ist das ein Thema, das bei Ihnen gerade auf der Agenda steht?" oder "Passt das zu einem Problem, das Sie gerade beschäftigt?"
- KEINE URLs, KEINE Links im Body-Text
- KEINE Emojis, KEINE Ausrufezeichen, KEINE GROSSBUCHSTABEN
- Betreff: max 7 Wörter, max 60 Zeichen, konkreter Firmenbezug, kein Emoji, kein Ausrufezeichen

Antworte NUR mit diesem JSON:
{{"subject": "Betreffzeile", "body": "E-Mail-Text ohne URLs/Links"}}"""

    raw = None
    for attempt in (1, 2, 3):
        try:
            async with httpx.AsyncClient(timeout=60) as client:
                resp = await client.post(
                    f"{NINE_ROUTER_URL}/chat/completions",
                    json={
                        "model": OUTREACH_MODEL,
                        "messages": [{"role": "user", "content": prompt}],
                        "response_format": {"type": "json_object"},
                        "temperature": 0.7,
                    },
                    headers={"Authorization": f"Bearer {NINE_ROUTER_KEY}"},
                )
                resp.raise_for_status()
                raw = resp.text
            break
        except Exception as e:
            logger.warning("Outreach LLM call failed (Versuch %d/3): %s", attempt, e)
            if attempt < 3:
                await asyncio.sleep(5 * attempt)
    if raw is None:
        raise RuntimeError("Outreach LLM nach 3 Versuchen fehlgeschlagen")

    try:
        decoder = json.JSONDecoder()
        obj, _ = decoder.raw_decode(raw)
        content = obj["choices"][0]["message"]["content"].strip()

        # Strip markdown fences
        if content.startswith("```"):
            content = content.split("\n", 1)[-1] if "\n" in content else content[3:]
            if content.endswith("```"):
                content = content[:-3]
            content = content.strip()

        # Extract JSON
        start = content.find("{")
        end = content.rfind("}")
        if start >= 0 and end > start:
            content = content[start:end + 1]

        email_data = json.loads(content)
        subject = email_data.get("subject", f"KI-Chatbot für {company_name}")
        body = email_data.get("body", content)

        logger.info("Outreach generated for %s — %d chars", company_name, len(body))

        return {
            "status": "generated",
            "subject": subject,
            "body": body,
            "recipient": contact_email,
        }
    except Exception as e:
        logger.error("Outreach LLM failed for %s: %s", company_name, e)
        # Fallback template
        unsubscribe_url = f"https://nexifyai.cloud/unsubscribe?lead={lead.get('id','')}&token={lead.get('consent_token','')}"
        legal = f"""\n\n---\nNeXifyAI · Pascal Courbois\nmail@nexifyai.cloud · nexifyai.cloud\nDatenschutz: nexifyai.cloud/datenschutz\nAbmelden: {unsubscribe_url}\n© NeXifyAI 2026"""
        body = (
            f"Hallo {company_name},\n\n"
            f"bei Betrieben in Ihrer Branche kostet die Angebotserstellung erfahrungsgemäß mehrere Stunden täglich — Zeit, die im Tagesgeschäft fehlt.\n\n"
            f"Für einen Betrieb im gleichen Segment haben wir den Angebotsprozess von täglich 5 Stunden auf unter 30 Minuten reduziert — vollständig automatisiert, ohne neue Softwarelizenzen.\n\n"
            f"Ist das ein Thema, das bei Ihnen gerade auf der Agenda steht?\n\n"
            f"Pascal Courbois\nInhaber\n\n"
            f"NeXify AI by NeXify – Chat it. Automate it.\n"
            f"Graaf van Loonstraat 1E, 5921 JA Venlo, Niederlande\n"
            f"Eenmanszaak | KvK: 90483944 (Kamer van Koophandel, Roermond)\n"
            f"BTW: NL865786276B01\n\n"
            f"E: mail@nexifyai.cloud\nW: nexifyai.cloud\n\n"
            f"Diese E-Mail wurde manuell verfasst und richtet sich ausschließlich an gewerbliche Empfänger. Keine weitere Kontaktaufnahme gewünscht? Antworten Sie kurz mit \"Abmelden\".\n"
            f"{legal}"
        )
        return {
            "status": "generated_fallback",
            "subject": f"{company_name}: Wie viel Zeit kostet Ihr Angebotsprozess aktuell?",
            "body": body,
            "recipient": contact_email,
        }
