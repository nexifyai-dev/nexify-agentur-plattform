# FILE: /docs/gtm/UWG-EMAIL-OPTIN-ONLY.md
# NIR: 02.08.2026 11:00
# UPDATED: 02.08.2026 11:00
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI GTM
# WHAT: Hard rule — DE email acquisition only with explicit opt-in (§7 UWG)
# WHY: Cold email without consent is illegal in Germany even for B2B
# BEST-PRACTICE: consent=true + allowed source; default dry-run; no bought lists
# PITFALL: V-CAC-01: Never treat legitimate_interest as email-send basis in DE
# DEPENDS: EMAIL-NURTURE-OPTIN.md, RESEARCH-FREE-CAC-2026.md, scripts/gtm/discover_and_optin_mail.py
# DOCS-REF: https://www.ihk-muenchen.de/ratgeber/recht/werbung-fairer-wettbewerb/marketing-per-email-telefon-brief-etc/
# SESSION: uwg-optin-followup-7dd5

# UWG §7 — E-Mail nur mit Opt-in (DE)

## Regel (verbindlich)

1. **Keine Cold-E-Mail** an Adressen ohne **ausdrückliche Einwilligung** (`consent=true`).
2. Gilt **auch B2B** (§7 UWG) — „legitimate interest“ ist **kein** Send-Gate für E-Mail.
3. Scripts mit `--send` / `OUTREACH_LIVE=1` dürfen nur Opt-in-Quellen bedienen.
4. Default immer **Dry-Run**. Kein Massenversand. Keine gekauften Listen.

## Erlaubte Mail-Pfade

| Pfad | Gate |
|------|------|
| `scripts/gtm/discover_and_optin_mail.py --send` | `consent=true` + `source` ∈ ALLOWED_SOURCES |
| Website transactional (Kontakt/Angebot) | Formular-Opt-in / Vertragsbeziehung |

## Verboten

- Scraped Impressum-Mails ohne Opt-in
- ICP-/Demand-Cold-Drip ohne `consent=true`
- `legal_basis=legitimate_interest_b2b` als alleinige Send-Freigabe

## Human / Agent Ops

- Drafts (LinkedIn, GBP, PR, Communities) OK — Owner postet.
- Telefon / LinkedIn InMail: Human-Gate, nicht Agent-Massen-SMTP.
- Siehe Research: `RESEARCH-FREE-CAC-2026.md` §1 + §4.
