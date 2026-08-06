# FILE: /scripts/leads/templates_ai_begleiter.py
# NIR: 02.08.2026 10:40
# UPDATED: 02.08.2026 10:50
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI GTM
# WHAT: DE mail template — AI-Begleiter / 449€ vs IT-Tagessatz + booking CTA
# WHY: Clear offer without misleading claims; unsubscribe + identity always
# BEST-PRACTICE: One CTA (Rückruf); thank-you path for inbound
# PITFALL: V-LEAD-04: No fake metrics / fake reviews
# DEPENDS: —
# DOCS-REF: docs/gtm/ZERO-COST-ACQUISITION-PLAYBOOK.md
# SESSION: zero-cost-leads-mailing-7dd5

from __future__ import annotations

from html import escape
from typing import Any

BOOKING_DEFAULT = "https://www.nexifyai.cloud/rueckruf"
CHECKLISTE_DEFAULT = "https://www.nexifyai.cloud/checkliste"
SITE = "https://www.nexifyai.cloud"


def build_subject(lead: dict[str, Any]) -> str:
    company = (lead.get("company") or "Ihr Unternehmen").strip()
    return f"{company}: AI-Begleiter statt teurem IT-Tag? (NeXify AI)"


def build_text_body(
    lead: dict[str, Any],
    *,
    booking_url: str = BOOKING_DEFAULT,
    unsubscribe_url: str,
    checkliste_url: str = CHECKLISTE_DEFAULT,
) -> str:
    company = (lead.get("company") or "Ihr Team").strip()
    contact = (lead.get("contact_name") or "").strip()
    greeting = f"Guten Tag {contact}," if contact else f"Guten Tag {company},"
    reason = (lead.get("contact_reason") or "").strip()
    reason_line = f"Kurz der Anlass: {reason[:220]}\n\n" if reason else ""
    return (
        f"{greeting}\n\n"
        f"ich bin Pascal Courbois von NeXify AI (Venlo / DACH).\n\n"
        f"{reason_line}"
        f"Viele KMU und Agenturen zahlen für klassische IT-/Agentur-Tage weit über "
        f"800–1.200 € — und bekommen trotzdem lange Wartezeiten. "
        f"Unser Angebot: ein persönlicher AI-Begleiter für Website, Automatisierung "
        f"und KI-Agenten zum Tagessatz 449 € netto — AI-gestützt, von mir verantwortet. "
        f"Keine Fake-Versprechen, keine Massen-Bots.\n\n"
        f"Passt ein kurzer Rückruf (15 Min), ob das für Sie Sinn ergibt?\n"
        f"→ {booking_url}\n\n"
        f"Gratis-Checkliste (Website/KI-Projekt): {checkliste_url}\n"
        f"Mehr: {SITE}\n\n"
        f"Kein Interesse? Kurz ablehnen oder Abmelde-Link — dann ist Ruhe.\n\n"
        f"Mit freundlichen Grüßen\n"
        f"Pascal Courbois\n"
        f"NeXify AI by NeXify — chat it. Automate it.\n"
        f"mail@nexifyai.cloud · {SITE}\n"
        f"Graaf van Loonstraat 1E · 5921 JA Venlo · NL · KvK 90483944\n\n"
        f"Abmelden: {unsubscribe_url}\n"
        f"Datenschutz: {SITE}/datenschutz\n"
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
    booking_url: str = BOOKING_DEFAULT,
    unsubscribe_url: str,
    checkliste_url: str = CHECKLISTE_DEFAULT,
) -> str:
    text = build_text_body(
        lead,
        booking_url=booking_url,
        unsubscribe_url=unsubscribe_url,
        checkliste_url=checkliste_url,
    )
    paragraphs = "".join(
        f"<p style='margin:0 0 12px;white-space:pre-wrap'>{escape(p)}</p>" if p else "<br/>"
        for p in text.split("\n")
    )
    src = escape(str(lead.get("source_url") or lead.get("source") or "öffentlich"))
    body = f"""<tr><td style="padding:28px 32px 8px;font-family:Manrope,Arial,sans-serif;">
  <div style="color:#d4d4d8;font-size:14px;line-height:1.7;">{paragraphs}</div>
  <p style="margin-top:20px;">
    <a href="{escape(booking_url)}" style="display:inline-block;background:#C8FF00;color:#0a0a0a;
      text-decoration:none;padding:13px 26px;border-radius:999px;font-weight:700;">Rückruf buchen</a>
  </p>
</td></tr>
<tr><td style="padding:14px 32px 26px;font-family:Manrope,Arial,sans-serif;">
  <p style="margin:0;font-size:12px;color:#888;">
    B2B-Kontakt · Opt-in / bestehende Anfrage · Quelle: {src}.
    <a href="{escape(unsubscribe_url)}" style="color:#aaa;">Abmelden</a> ·
    <a href="{SITE}/datenschutz" style="color:#aaa;">Datenschutz</a>
  </p>
</td></tr>"""
    return mail_shell("Chat it. Automate it.", body)
