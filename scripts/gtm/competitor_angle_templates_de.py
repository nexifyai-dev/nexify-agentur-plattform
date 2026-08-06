# FILE: /scripts/gtm/competitor_angle_templates_de.py
# NIR: 02.08.2026 10:50
# UPDATED: 02.08.2026 10:50
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI GTM
# WHAT: DE B2B outreach templates — pain→audit→pilot→retainer (competitor-proven angles)
# WHY: Strongest rivals win with productized funnel language; rewrite NeXify voice
# BEST-PRACTICE: One CTA; unsubscribe; no fake claims; ICP slug selects angle
# PITFALL: V-OUT-COMP-01: Never name/disparage competitor brands in cold mail
# DEPENDS: docs/gtm/STRONGEST-COMPETITORS-2026.md
# DOCS-REF: docs/gtm/STEAL-LIKE-AN-ARTIST-WEEKLY.md
# SESSION: strongest-competitors-tactics-7dd5

from __future__ import annotations

from html import escape
from typing import Any

ICP_ANGLES: dict[str, dict[str, str]] = {
    "handwerk": {
        "pain": "Anfragen und Nachfass kosten oft mehr Zeit als die eigentliche Arbeit auf der Baustelle.",
        "outcome": "ein klarer digitaler Aufnahme-Pfad und — wenn es passt — ein Pilot-Slice",
    },
    "steuerberater": {
        "pain": "Mandanten-Onboarding und wiederkehrende Nachfass schlucken Kapazität, die in Beratung stecken sollte.",
        "outcome": "strukturierte digitale Einstiege und einen priorisierten Automations-Pilot",
    },
    "ecommerce": {
        "pain": "Support, Statusfragen und Shop-Reibung skalieren oft schneller als das Team.",
        "outcome": "einen messbaren Pilot (Prozess oder Shop-Slice) zum Festtag-Paket",
    },
    "immobilien": {
        "pain": "Portal-Leads und Terminierung bleiben liegen, wenn niemand den Flow trägt.",
        "outcome": "schnellere Lead-Strecke und ein schriftliches Audit vor dem Build",
    },
    "agenturen": {
        "pain": "Kunden wollen KI/Automation, aber Kapazität und Tagessätze der klassischen IT passen nicht.",
        "outcome": "White-Label-Delivery zum Tagessatz 449 € — Sie bleiben Kundenface",
    },
    "default": {
        "pain": "Wiederkehrende Digital- und Prozessarbeit frisst Marge, ohne dass ein Enterprise-Projekt nötig wäre.",
        "outcome": "Audit (1 Tag) oder Pilot (5 Tage) — transparent × 449 € netto",
    },
}


def _angle(lead: dict[str, Any]) -> dict[str, str]:
    icp = (lead.get("icp") or lead.get("branche") or lead.get("segment") or "default").strip().lower()
    return ICP_ANGLES.get(icp, ICP_ANGLES["default"])


def build_subject(lead: dict[str, Any]) -> str:
    company = (lead.get("company") or lead.get("name") or "Ihr Unternehmen").strip()
    return f"{company}: Audit statt Folien? (NeXify AI, 449 €/Tag)"


def build_text_body(
    lead: dict[str, Any],
    *,
    booking_url: str,
    unsubscribe_url: str,
    audit_url: str = "https://www.nexifyai.cloud/audit",
) -> str:
    company = (lead.get("company") or lead.get("name") or "Ihr Team").strip()
    contact = (lead.get("contact_name") or "").strip()
    greeting = f"Guten Tag {contact}," if contact else f"Guten Tag {company},"
    ang = _angle(lead)
    reason = (lead.get("contact_reason") or lead.get("enrichment_summary") or "").strip()
    reason_line = f"Kontext: {reason[:200]}\n\n" if reason else ""

    return (
        f"{greeting}\n\n"
        f"ich bin Pascal Courbois (NeXify AI, Venlo / DACH). "
        f"{ang['pain']}\n\n"
        f"{reason_line}"
        f"Statt endloser kostenloser Sales-Calls arbeiten wir mit einem klaren Pfad: "
        f"kurzer Fit-Call → optional 1-Tages-Audit (449 € netto, schriftliches Deliverable) "
        f"→ Pilot-Paket 5 Tage (2.245 €) → bei Nutzen Retainer.\n\n"
        f"Passt ein 15-Minuten-Austausch, ob {ang['outcome']} für Sie Sinn ergibt?\n"
        f"→ Termin: {booking_url}\n"
        f"→ Audit-Info: {audit_url}\n\n"
        f"Falls kein Interesse: kurz ablehnen oder Abmelde-Link — dann melden wir uns nicht erneut.\n\n"
        f"Mit freundlichen Grüßen\n"
        f"Pascal Courbois\n"
        f"NeXify AI by NeXify — chat it. Automate it.\n"
        f"mail@nexifyai.cloud · https://www.nexifyai.cloud\n"
        f"Graaf van Loonstraat 1E · 5921 JA Venlo · NL · KvK 90483944\n\n"
        f"Abmelden: {unsubscribe_url}\n"
        f"Datenschutz: https://www.nexifyai.cloud/datenschutz\n"
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
    audit_url: str = "https://www.nexifyai.cloud/audit",
) -> str:
    text = build_text_body(
        lead,
        booking_url=booking_url,
        unsubscribe_url=unsubscribe_url,
        audit_url=audit_url,
    )
    paragraphs = "".join(
        f"<p style='margin:0 0 12px;white-space:pre-wrap'>{escape(p)}</p>" if p else "<br/>"
        for p in text.split("\n")
    )
    body = f"""<tr><td style="padding:28px 32px 8px;font-family:Manrope,Arial,sans-serif;">
  <div style="color:#d4d4d8;font-size:14px;line-height:1.7;">{paragraphs}</div>
</td></tr>
<tr><td style="padding:14px 32px 26px;font-family:Manrope,Arial,sans-serif;">
  <p style="margin:0;font-size:12px;color:#888;">
    B2B · berechtigtes Interesse / vergleichbare NL-Regelungen ·
    Quelle: {escape(str(lead.get('source') or lead.get('source_url') or 'öffentlich'))}.
    <a href="{escape(unsubscribe_url)}" style="color:#aaa;">Abmelden</a>
  </p>
</td></tr>"""
    return mail_shell("Chat it. Automate it.", body)
