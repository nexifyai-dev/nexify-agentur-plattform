# FILE: /scripts/gtm/icp_mail_templates.py
# NIR: 02.08.2026 11:00
# UPDATED: 02.08.2026 11:00
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI GTM
# WHAT: Machine-readable DE ICP mail bodies
# WHY: Same copy as docs for send script
# BEST-PRACTICE: Placeholders {firma} {anrede}; STOP footer
# PITFALL: V-MAIL-02: No private data beyond Impressum
# DEPENDS: icp_segments.py
# DOCS-REF: docs/gtm/ICP-MAIL-TEMPLATES-DE.md
# SESSION: icp-demand-competitor-copy-7dd5

from __future__ import annotations

TEMPLATES: dict[str, dict[str, str]] = {
    "handwerk": {
        "subject": "{firma}: weniger Admin, mehr Handwerk?",
        "body": (
            "Guten Tag {anrede},\n\n"
            "viele Betriebe verlieren Stunden an Angebot, Termin und Nachfassung — "
            "nicht an der eigentlichen Arbeit.\n\n"
            "NeXify AI automatisiert genau diese Büro-Schleifen "
            "(Anfrage → Termin → Angebot → Reminder), AI-beschleunigt und persönlich "
            "verantwortet — Tagessatz 449 € netto statt klassischer IT-Sätze oft "
            "1.000–1.500 €.\n\n"
            "Kurz ansehen: https://www.nexifyai.cloud/branchen/handwerk\n"
            "15 Min Termin: https://www.nexifyai.cloud/rueckruf?utm_campaign=icp_handwerk\n\n"
            "Mit freundlichen Grüßen\n"
            "Pascal Courbois · NeXify AI · Venlo (NL) / DACH\n"
            "KvK 90483944 · Abmelden: STOP an mail@nexifyai.cloud\n"
        ),
    },
    "steuerberater": {
        "subject": "{firma}: Belege sortieren oder beraten?",
        "body": (
            "Guten Tag {anrede},\n\n"
            "in Kanzleien frisst Routine (Belege, Status, Standardfragen) die Kapazität "
            "für echte Beratung.\n\n"
            "Wir bauen Automation und Mandanten-Flows mit menschlicher Freigabe — "
            "nachvollziehbar in GitHub/GitLab, Tagessatz 449 € netto.\n\n"
            "Branche: https://www.nexifyai.cloud/branchen/steuerberater\n"
            "Termin: https://www.nexifyai.cloud/rueckruf?utm_campaign=icp_steuerberater\n\n"
            "Mit freundlichen Grüßen\n"
            "Pascal Courbois · NeXify AI\n"
            "Abmelden: STOP an mail@nexifyai.cloud\n"
        ),
    },
    "agenturen": {
        "subject": "{firma}: KI verkaufen — Delivery ohne 1.000-€-Tag?",
        "body": (
            "Guten Tag {anrede},\n\n"
            "Kunden fragen KI-Automation, interne Kapazität fehlt oft. Klassische IT "
            "frisst die Marge.\n\n"
            "NeXify AI liefert Overflow / White-Label-fähig zum festen Tagessatz "
            "449 € netto — Sie bleiben Kundengesicht.\n\n"
            "Details: https://www.nexifyai.cloud/branchen/agenturen\n"
            "Partner/Call: https://www.nexifyai.cloud/rueckruf?utm_campaign=icp_agenturen\n\n"
            "Mit freundlichen Grüßen\n"
            "Pascal Courbois · NeXify AI\n"
            "Abmelden: STOP an mail@nexifyai.cloud\n"
        ),
    },
}


def render(slug: str, *, firma: str, anrede: str = "Team") -> tuple[str, str]:
    tpl = TEMPLATES[slug]
    ctx = {"firma": firma or "Ihr Unternehmen", "anrede": anrede or "Team"}
    return tpl["subject"].format(**ctx), tpl["body"].format(**ctx)
