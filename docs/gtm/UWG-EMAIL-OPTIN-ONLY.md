# FILE: /docs/gtm/UWG-EMAIL-OPTIN-ONLY.md
# NIR: 02.08.2026 11:05
# UPDATED: 04.08.2026 09:45
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI GTM
# WHAT: Hard rule — DE email acquisition only with explicit opt-in (§7 UWG)
# WHY: Cold email without consent is illegal in Germany even for B2B
# BEST-PRACTICE: consent=true + allowed source; default dry-run; no bought lists
# PITFALL: V-CAC-01: Never treat legitimate_interest as email-send basis in DE
# PITFALL: V-UWG-02: --live alone never sends; requires --allow-opt-in-send AND consent=true
# DEPENDS: EMAIL-NURTURE-OPTIN.md, RESEARCH-FREE-CAC-2026.md, ZERO-COST-ACQUISITION-PLAYBOOK.md, scripts/gtm/*, scripts/leads/*, scripts/outreach/*
# DOCS-REF: https://www.ihk-muenchen.de/ratgeber/recht/werbung-fairer-wettbewerb/marketing-per-email-telefon-brief-etc/
# SESSION: uwg-cold-email-pause-7dd5

# UWG §7 — E-Mail nur mit Opt-in (DE)

## Regel (verbindlich)

1. **Keine Cold-E-Mail** an Adressen ohne **ausdrückliche Einwilligung** (`consent=true`).
2. Gilt **auch B2B** (§7 UWG) — „legitimate interest" / `legal_basis=legitimate_interest_b2b*` ist **kein** Send-Gate für E-Mail.
3. Scripts mit `--send` / `OUTREACH_LIVE=1` dürfen nur Opt-in-Quellen bedienen (oder Self-Test `@nexifyai.*`).
4. Default immer **Dry-Run**. Kein Massenversand. Keine gekauften Listen.
5. **Seeds ≠ Consent.** Öffentliche Impressum-/Kontakt-Mails in `data/leads/seeds/` sind Discovery-Material, keine Send-Freigabe.
6. **`--live` allein reicht nicht.** `run_daily.py --live` sendet **nicht** — zusätzlich `--allow-opt-in-send` erforderlich (§7 UWG Double-Gate).
7. **`smtp_hostinger.send_hostinger()` verweigert** ohne `consent_verified=True` (wirft `UWGConsentError`) — Defense-in-Depth-Guard.

## Incident (2026-08-02)

5 Hostinger B2B cold-E-Mails versendet ohne `consent=true` (Domains: tech media / Verband / startup press).
**Status: Pause aktiv.** Kein weiterer Cold-SMTP bis Legal/Ops freigeben.
Bevorzugte Kanäle bis dahin: LinkedIn, GBP, Warm-Intros, Website-Formulare (Opt-in).

## Erlaubte Mail-Pfade

| Pfad | Gate |
|------|------|
| `scripts/gtm/icp_competitor_outreach.py --send` | `consent=true` + `source` ∈ ALLOWED_SOURCES + `OUTREACH_LIVE=1` |
| `scripts/gtm/discover_and_optin_mail.py --send` | `consent=true` + `source` ∈ ALLOWED_SOURCES |
| `scripts/leads/run_pipeline.py mail --send` | `consent=true` **oder** Self-Test-Domain `@nexifyai.cloud` / `.nl` / `.de` |
| `scripts/outreach/run_daily.py --live --allow-opt-in-send` | `consent=true` + `send_allowed=true` je Lead (CI workflow **forced dry-run**) |
| Website transactional (Kontakt/Angebot/Checkliste) | Formular-Opt-in / Vertragsbeziehung |

## Verboten

- Scraped Impressum-Mails ohne Opt-in
- ICP-/Demand-/Zero-Cost-Cold-Drip ohne `consent=true`
- `allow` / `send_allowed=true` ohne Consent als Live-Freigabe
- `legal_basis=legitimate_interest_b2b*` als alleinige Send-Freigabe
- Live-Send aus `.github/workflows/lead-outreach-daily.yml` (bis Consent-Queue existiert)
- `run_daily.py --live` ohne `--allow-opt-in-send` (wird blockiert: `uwg_opt_in_required`)
- Direktaufruf `smtp_hostinger.send_hostinger()` ohne `consent_verified=True`
- Re-Aktivierung Hostinger Cold-Drip via cron/`repository_dispatch` ohne Legal/Ops-Freigabe

## Code-Kontrollen (Stand 04.08.2026)

| Kontrolle | Datei | Verhalten |
|-----------|-------|-----------|
| `--live` allein blockiert | `runner.py` | `blocked=uwg_opt_in_required` |
| `--allow-opt-in-send` erforderlich | `config.py` / `run_daily.py` | `effective_live=False` ohne Flag |
| `consent=true` je Lead | `store.validate_for_send()` | gibt `missing_consent` zurück |
| SMTP-Guard | `smtp_hostinger.send_hostinger()` | `UWGConsentError` wenn `consent_verified=False` |
| CI Workflow | `lead-outreach-daily.yml` | `OUTREACH_LIVE=0` hardcoded, kein `OUTREACH_ALLOW_OPT_IN_SEND` |
| Seeds Default | `discover_leads.py` / `promote_leads.py` | `consent=False`, `send_allowed=False` |

## Ops

```bash
# Dry-run (default) — preview ohne Consent OK
python3 scripts/leads/run_pipeline.py mail --limit 8

# Consent nur nach echtem Opt-in (Formular), nie aus Seeds
python3 scripts/leads/run_pipeline.py consent --email optin@kunde.example --source-type checkliste

# Self-test (eigene Domain) OK
python3 scripts/leads/run_pipeline.py mail --send --limit 1   # nur @nexifyai.*

# GTM opt-in path (#234)
python3 scripts/gtm/discover_and_optin_mail.py --dry-run

# Competitor-angle path (#241) — OUTREACH_LIVE=1 + consent required
python3 scripts/gtm/icp_competitor_outreach.py --mail-list leads.json --dry-run

# Daily workflow: immer --dry-run (CI erzwingt OUTREACH_LIVE=0)
python3 scripts/outreach/run_daily.py --dry-run --json

# Live (nur nach Legal/Ops-Freigabe + verifiziertem Opt-in):
# python3 scripts/outreach/run_daily.py --live --allow-opt-in-send --json
```

## Human / Agent Ops

- **Cold SMTP pausiert** bis Legal/Ops explizit freigeben.
- Bevorzugte Akquise-Kanäle: LinkedIn, GBP, Warm-Intros, Website-Formulare.
- Drafts (LinkedIn, GBP, PR, Communities) OK — Owner postet.
- Telefon / LinkedIn InMail: Human-Gate, nicht Agent-Massen-SMTP.
- Siehe Research: `RESEARCH-FREE-CAC-2026.md` §1 + §4 · Playbook: `ZERO-COST-ACQUISITION-PLAYBOOK.md`.


# UWG §7 — E-Mail nur mit Opt-in (DE)

## Regel (verbindlich)

1. **Keine Cold-E-Mail** an Adressen ohne **ausdrückliche Einwilligung** (`consent=true`).
2. Gilt **auch B2B** (§7 UWG) — „legitimate interest“ / `legal_basis=legitimate_interest_b2b*` ist **kein** Send-Gate für E-Mail.
3. Scripts mit `--send` / `OUTREACH_LIVE=1` dürfen nur Opt-in-Quellen bedienen (oder Self-Test `@nexifyai.*`).
4. Default immer **Dry-Run**. Kein Massenversand. Keine gekauften Listen.
5. **Seeds ≠ Consent.** Öffentliche Impressum-/Kontakt-Mails in `data/leads/seeds/` sind Discovery-Material, keine Send-Freigabe.
6. **`--live` allein reicht nicht.** `run_daily.py --live` sendet **nicht** — zusätzlich `--allow-opt-in-send` erforderlich (§7 UWG Double-Gate).
7. **`smtp_hostinger.send_hostinger()` verweigert** ohne `consent_verified=True` (wirft `UWGConsentError`) — Defense-in-Depth-Guard.

## Incident (2026-08-02)

5 Hostinger B2B cold-E-Mails versendet ohne `consent=true` (Domains: tech media / Verband / startup press).
**Status: Pause aktiv.** Kein weiterer Cold-SMTP bis Legal/Ops freigeben.
Bevorzugte Kanäle bis dahin: LinkedIn, GBP, Warm-Intros, Website-Formulare (Opt-in).

## Erlaubte Mail-Pfade

| Pfad | Gate |
|------|------|
| `scripts/gtm/icp_competitor_outreach.py --send` | `consent=true` + `source` ∈ ALLOWED_SOURCES + `OUTREACH_LIVE=1` |
| `scripts/gtm/discover_and_optin_mail.py --send` | `consent=true` + `source` ∈ ALLOWED_SOURCES |
| `scripts/leads/run_pipeline.py mail --send` | `consent=true` **oder** Self-Test-Domain `@nexifyai.cloud` / `.nl` / `.de` |
| `scripts/outreach/run_daily.py --live --allow-opt-in-send` | `consent=true` + `send_allowed=true` je Lead (CI workflow **forced dry-run**) |
| Website transactional (Kontakt/Angebot/Checkliste) | Formular-Opt-in / Vertragsbeziehung |

## Verboten

- Scraped Impressum-Mails ohne Opt-in
- ICP-/Demand-/Zero-Cost-Cold-Drip ohne `consent=true`
- `allow` / `send_allowed=true` ohne Consent als Live-Freigabe
- `legal_basis=legitimate_interest_b2b*` als alleinige Send-Freigabe
- Live-Send aus `.github/workflows/lead-outreach-daily.yml` (bis Consent-Queue existiert)
- `run_daily.py --live` ohne `--allow-opt-in-send` (wird blockiert: `uwg_opt_in_required`)
- Direktaufruf `smtp_hostinger.send_hostinger()` ohne `consent_verified=True`
- Re-Aktivierung Hostinger Cold-Drip via cron/`repository_dispatch` ohne Legal/Ops-Freigabe

## Code-Kontrollen (Stand 04.08.2026)

| Kontrolle | Datei | Verhalten |
|-----------|-------|-----------|
| `--live` allein blockiert | `runner.py` | `blocked=uwg_opt_in_required` |
| `--allow-opt-in-send` erforderlich | `config.py` / `run_daily.py` | `effective_live=False` ohne Flag |
| `consent=true` je Lead | `store.validate_for_send()` | gibt `missing_consent` zurück |
| SMTP-Guard | `smtp_hostinger.send_hostinger()` | `UWGConsentError` wenn `consent_verified=False` |
| CI Workflow | `lead-outreach-daily.yml` | `OUTREACH_LIVE=0` hardcoded, kein `OUTREACH_ALLOW_OPT_IN_SEND` |
| Seeds Default | `discover_leads.py` / `promote_leads.py` | `consent=False`, `send_allowed=False` |

## Ops

```bash
# Dry-run (default) — preview ohne Consent OK
python3 scripts/leads/run_pipeline.py mail --limit 8

# Consent nur nach echtem Opt-in (Formular), nie aus Seeds
python3 scripts/leads/run_pipeline.py consent --email optin@kunde.example --source-type checkliste

# Self-test (eigene Domain) OK
python3 scripts/leads/run_pipeline.py mail --send --limit 1   # nur @nexifyai.*

# GTM opt-in path (#234)
python3 scripts/gtm/discover_and_optin_mail.py --dry-run

# Competitor-angle path (#241) — OUTREACH_LIVE=1 + consent required
python3 scripts/gtm/icp_competitor_outreach.py --mail-list leads.json --dry-run

# Daily workflow: immer --dry-run (CI erzwingt OUTREACH_LIVE=0)
python3 scripts/outreach/run_daily.py --dry-run --json

# Live (nur nach Legal/Ops-Freigabe + verifiziertem Opt-in):
# python3 scripts/outreach/run_daily.py --live --allow-opt-in-send --json
```

## Human / Agent Ops

- **Cold SMTP pausiert** bis Legal/Ops explizit freigeben.
- Bevorzugte Akquise-Kanäle: LinkedIn, GBP, Warm-Intros, Website-Formulare.
- Drafts (LinkedIn, GBP, PR, Communities) OK — Owner postet.
- Telefon / LinkedIn InMail: Human-Gate, nicht Agent-Massen-SMTP.
- Siehe Research: `RESEARCH-FREE-CAC-2026.md` §1 + §4 · Playbook: `ZERO-COST-ACQUISITION-PLAYBOOK.md`.
