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
    return f"""<!doctype html>
<html lang="de"><body style="margin:0;background:#0A0A0A;padding:24px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" align="center"
  style="max-width:600px;background:#111114;border:1px solid #26262b;border-radius:16px;">
<tr><td style="padding:28px 32px;font-family:Manrope,Arial,sans-serif;color:#d4d4d8;font-size:14px;line-height:1.7;">
  <div style="font-family:Outfit,Arial,sans-serif;font-size:22px;color:#fff;padding-bottom:16px;">
    Ne<span style="color:#c0c0c8;">X</span>ify <span style="color:#9ca3af;">AI</span>
  </div>
  <div style="color:#e5e5e5;">{paragraphs}</div>
  <p style="margin-top:20px;">
    <a href="{escape(booking_url)}" style="display:inline-block;background:#e8e8ec;color:#0a0a0a;
      text-decoration:none;padding:10px 18px;border-radius:999px;font-weight:600;">Rückruf buchen</a>
  </p>
  <p style="margin-top:24px;font-size:12px;color:#888;">
    B2B-Kontakt · berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO / UWG B2B) · Quelle: {src}.
    <a href="{escape(unsubscribe_url)}" style="color:#aaa;">Abmelden</a> ·
    <a href="{SITE}/datenschutz" style="color:#aaa;">Datenschutz</a>
  </p>
</td></tr></table>
</body></html>"""
