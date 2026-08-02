# FILE: /scripts/outreach/templates_de.py
# NIR: 02.08.2026 09:20
# UPDATED: 02.08.2026 09:20
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: DE B2B outreach templates — NeXify AI brand, unsubscribe footer
# WHY: Professional tone, GDPR opt-out link, no spam-list language
# BEST-PRACTICE: Short, specific, one CTA; brand first
# PITFALL: V-OUT-02: Always include unsubscribe + legal entity
# DEPENDS: docs/gtm/OFFER_SNIPPETS_de.md
# DOCS-REF: docs/operations/LEAD-OUTREACH-AUTOMATION.md
# SESSION: lead-outreach-automation-7dd5

from __future__ import annotations

from html import escape
from typing import Any


def build_subject(lead: dict[str, Any]) -> str:
    company = (lead.get("company") or lead.get("name") or "Ihr Unternehmen").strip()
    service = (lead.get("service_slug") or "digital").replace("-", " ")
    return f"{company}: kurze Frage zu {service} (NeXify AI)"


def build_text_body(
    lead: dict[str, Any],
    *,
    booking_url: str,
    unsubscribe_url: str,
) -> str:
    company = (lead.get("company") or lead.get("name") or "Ihr Team").strip()
    contact = (lead.get("contact_name") or "").strip()
    greeting = f"Guten Tag {contact}," if contact else f"Guten Tag {company},"
    reason = (lead.get("contact_reason") or lead.get("enrichment_summary") or "").strip()
    reason_line = (
        f"Anlass: {reason[:220]}\n\n" if reason else ""
    )
    service = lead.get("service_slug") or "digitale Projekte"
    return (
        f"{greeting}\n\n"
        f"ich bin Pascal Courbois von NeXify AI (Venlo, NL / DACH). "
        f"Wir unterstützen B2B-Unternehmen bei {service} — "
        f"AI-gestützt, persönlich verantwortet, Tagessatz 449 € netto.\n\n"
        f"{reason_line}"
        f"Passt ein kurzer Austausch (15 Min), ob wir einen konkreten Nutzen "
        f"für Sie liefern können?\n"
        f"→ {booking_url}\n\n"
        f"Falls kein Interesse: einfach kurz ablehnen oder den Abmelde-Link nutzen — "
        f"wir melden uns dann nicht erneut.\n\n"
        f"Mit freundlichen Grüßen\n"
        f"Pascal Courbois\n"
        f"NeXify AI by NeXify — chat it. Automate it.\n"
        f"mail@nexifyai.cloud · https://www.nexifyai.cloud\n"
        f"Graaf van Loonstraat 1E · 5921 JA Venlo · NL · KvK 90483944\n\n"
        f"Abmelden: {unsubscribe_url}\n"
        f"Datenschutz: https://www.nexifyai.cloud/de/datenschutz\n"
    )


def build_html_body(
    lead: dict[str, Any],
    *,
    booking_url: str,
    unsubscribe_url: str,
) -> str:
    text = build_text_body(
        lead, booking_url=booking_url, unsubscribe_url=unsubscribe_url
    )
    # Preserve line breaks; escape HTML
    paragraphs = "".join(
        f"<p style='margin:0 0 12px;white-space:pre-wrap'>{escape(p)}</p>"
        if p
        else "<br/>"
        for p in text.split("\n")
    )
    return f"""<!doctype html>
<html lang="de"><body style="margin:0;background:#0A0A0A;padding:24px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" align="center"
  style="max-width:600px;background:#111114;border:1px solid #26262b;border-radius:16px;">
<tr><td style="padding:28px 32px;font-family:Manrope,Arial,sans-serif;color:#d4d4d8;font-size:14px;line-height:1.7;">
  <div style="font-family:Outfit,Arial,sans-serif;font-size:22px;color:#fff;padding-bottom:16px;">
    Ne<span style="color:#c0c0c8;">X</span>ify <span style="color:#9ca3af;">AI</span>
  </div>
  <div style="color:#e5e5e5;">{paragraphs}</div>
  <p style="margin-top:24px;font-size:12px;color:#888;">
    B2B-Kontakt · Rechtsgrundlage: berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO) /
    vergleichbare NL-Regelungen · Quelle: {escape(str(lead.get('source') or lead.get('source_url') or 'öffentlich'))}.
    <a href="{escape(unsubscribe_url)}" style="color:#aaa;">Abmelden</a> ·
    <a href="https://www.nexifyai.cloud/de/datenschutz" style="color:#aaa;">Datenschutz</a>
  </p>
</td></tr></table>
</body></html>"""
