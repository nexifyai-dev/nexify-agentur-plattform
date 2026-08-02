# FILE: /docs/gtm/EMAIL-NURTURE-OPTIN.md
# NIR: 02.08.2026 10:50
# UPDATED: 02.08.2026 10:50
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI GTM
# WHAT: Opt-in email nurture sequence (checkliste / contact) — UWG-safe
# WHY: Convert inbound without illegal cold mail
# BEST-PRACTICE: Explicit consent source; unsubscribe; honest stub if PDF missing
# PITFALL: V-CAC-01: Never use this against non-opt-in addresses
# DEPENDS: scripts/gtm/discover_and_optin_mail.py, RESEND or SMTP env
# DOCS-REF: docs/gtm/RESEARCH-FREE-CAC-2026.md
# SESSION: research-free-cac-full-7dd5

# Opt-in Nurture (5 Mails)

**Nur** Adressen mit `consent=true` und `source` ∈ {checkliste, kontakt, planner, partner, botschafter, sprechstunde}.

> **§7 UWG:** Cold-E-Mail ohne Einwilligung ist in DE **auch B2B** unzulässig. Siehe [UWG-EMAIL-OPTIN-ONLY.md](UWG-EMAIL-OPTIN-ONLY.md).

| # | Tag | Betreff | Ziel |
|---|-----|---------|------|
| 1 | 0 | Ihre Checkliste / nächster Schritt | Asset + Soft CTA Sprechstunde |
| 2 | 2 | 449 € Tagessatz — was drin ist | /vergleich |
| 3 | 5 | Drei Engpässe, die AI wirklich löst | Use-Cases, kein Hype |
| 4 | 9 | Office Hours — 20 Minuten Klarheit | /sprechstunde |
| 5 | 14 | Noch Fragen? Rückruf oder Pause | /rueckruf + Unsubscribe |

Jede Mail: Absender Pascal / NeXify AI · Link Datenschutz · Abmeldehinweis.

Skript: `python3 scripts/gtm/discover_and_optin_mail.py --dry-run`
