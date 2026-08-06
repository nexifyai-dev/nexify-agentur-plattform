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


MAIL_LOGO_BLOCK = (
    '<div style="display:flex;align-items:center;gap:12px;">'
    '<img src="https://www.nexifyai.cloud/logo-mark.png" alt="NeXify" width="34" height="34" '
    'style="display:block;width:34px;height:34px;border:0;border-radius:8px;">'
    '<div style="font-family:Outfit,Arial,sans-serif;font-size:24px;color:#ffffff;letter-spacing:1px;">'
    'Ne<span style="color:#C8FF00;font-weight:700;">X</span>ify <span style="color:#9E9E9E;font-weight:300;">AI</span>'
    "</div></div>"
)
MAIL_FOOTER_HTML = (
    "NeXify AI by NeXify – chat it. Automate it. · Pascal Courbois<br/>"
    "Graaf van Loonstraat 1E · 5921 JA Venlo · NL · KvK 90483944 · BTW NL865786276B01<br/>"
    "mail@nexifyai.cloud · +31 6 133 188 56"
)


def mail_shell(label: str, body_html: str) -> str:
    """Kanonisches Mail-Design (Vorgabe 2026-08-06): dunkle Karte, CI-Logo, Impressum."""
    return f"""<!doctype html><html><body style="margin:0;padding:0;background:#0a0a0a;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:32px 12px;"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#111114;border:1px solid #26262b;border-radius:16px;overflow:hidden;">
<tr><td style="padding:32px 32px 20px;border-bottom:1px solid #26262b;">
  {MAIL_LOGO_BLOCK}
  <div style="font-family:Manrope,Arial,sans-serif;font-size:11px;color:#71717a;letter-spacing:3px;text-transform:uppercase;padding-top:6px;">{label}</div>
</td></tr>
{body_html}
<tr><td style="padding:20px 32px;border-top:1px solid #26262b;font-family:Manrope,Arial,sans-serif;color:#52525b;font-size:11px;line-height:1.7;">
{MAIL_FOOTER_HTML}
</td></tr>
</table></td></tr></table></body></html>"""


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
    body = f"""<tr><td style="padding:28px 32px 8px;font-family:Manrope,Arial,sans-serif;">
  <div style="color:#d4d4d8;font-size:14px;line-height:1.7;">{paragraphs}</div>
</td></tr>
<tr><td style="padding:14px 32px 26px;font-family:Manrope,Arial,sans-serif;">
  <p style="margin:0;font-size:12px;color:#888;">
    B2B-Kontakt · Rechtsgrundlage: berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO) /
    vergleichbare NL-Regelungen · Quelle: {escape(str(lead.get('source') or lead.get('source_url') or 'öffentlich'))}.
    <a href="{escape(unsubscribe_url)}" style="color:#aaa;">Abmelden</a> ·
    <a href="https://www.nexifyai.cloud/de/datenschutz" style="color:#aaa;">Datenschutz</a>
  </p>
</td></tr>"""
    return mail_shell("Chat it. Automate it.", body)
