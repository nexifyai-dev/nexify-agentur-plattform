# FILE: /docs/operations/LEAD-OUTREACH-AUTOMATION.md
# NIR: 02.08.2026 09:20
# UPDATED: 02.08.2026 09:20
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI DevOps
# WHAT: Hostinger+Resend split, daily cap, GDPR, enablement for lead outreach
# WHY: Cursor-Agent pattern for scraped-lead mailings without spam/Resend burn
# BEST-PRACTICE: Cold = Hostinger SMTP; transactional = Resend; ≤800/day hard cap
# PITFALL: V-OUT-01/05: Never raise cap above 800; never cold-mail via Resend
# DEPENDS: scripts/outreach/*, .github/workflows/lead-outreach-daily.yml
# DOCS-REF: docs/governance/02_sops/SOP_KUNDENSUCHE_LEAD_TO_CRM_OUTREACH_GATE_V3.md
# SESSION: lead-outreach-automation-7dd5

# Lead Outreach Automation

## Goal

Win new B2B customers: Cursor Agent + VPS cron send **slow, capped** outreach to scraped / demand-pending leads via **Hostinger** (`mail@nexifyai.cloud`). **Resend** stays for transactional website flows (contact, offers).

## Channel split

| Channel | Use | Do not use for |
|---------|-----|----------------|
| **Hostinger SMTP** (`SMTP_HOST=smtp.hostinger.com`, mailbox `mail@nexifyai.cloud`) | Cold / drip / listing outreach | Password resets, form receipts (prefer Resend) |
| **Resend** (`RESEND_API_KEY`, `RESEND_DOMAIN`) | Contact form, offers, booking confirmations | Cold outreach batches |

Backend `send_email()` still falls back SMTP→Resend for transactional paths. **Outreach scripts never call Resend.**

## Hard limits (code-enforced)

| Limit | Value | Env |
|-------|-------|-----|
| Daily send cap | **≤ 800** (`HARD_DAILY_CAP`) | `OUTREACH_DAILY_CAP` (clamped ≤800) |
| Pacing | 30–60s jitter between mails | `OUTREACH_PACE_MIN_SEC` / `OUTREACH_PACE_MAX_SEC` |
| Live send | Off unless `OUTREACH_LIVE=1` | Schedule defaults dry-run |
| Source ban | No `purchased_list` / spam lists | `source_type` gate |

## GDPR / EU

- Store **source** + **legal_basis** (default `legitimate_interest_b2b`) on every lead.
- Every mail includes **unsubscribe** link + Impressum/Datenschutz.
- `send_allowed` must be true (or `OUTREACH_REQUIRE_SEND_ALLOWED=0` for controlled tests).
- No consumer spam lists; B2B professional tone (DE templates).
- Aligns with SOP gate: promote with `--allow-send` only after policy review for a batch.

Unsubscribe API: `GET/POST https://www.nexifyai.cloud/api/outreach/unsubscribe?email=&token=`

## Firecrawl (local OSS)

| From | URL |
|------|-----|
| Host / Actions runner | `http://127.0.0.1:3003` (`FIRECRAWL_URL`) |
| Inside Firecrawl Docker network | port `3002` |

Containers: `nexify-firecrawl-api` maps `3003→3002`. Optional `FIRECRAWL_API_KEY`.

## Env names (no secrets in git)

```bash
# Hostinger cold outreach
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=mail@nexifyai.cloud          # or IMAP_USER
SMTP_PASSWORD=…                       # or IMAP_PASSWORD
SENDER_EMAIL=mail@nexifyai.cloud
REPLY_TO_EMAIL=mail@nexifyai.cloud

# Transactional (website) — not used by outreach runner
RESEND_API_KEY=…
RESEND_DOMAIN=mail.nexifyai.cloud

# Outreach controls
OUTREACH_DAILY_CAP=800
OUTREACH_PACE_MIN_SEC=30
OUTREACH_PACE_MAX_SEC=60
OUTREACH_LIVE=0                       # 1 only when ready
OUTREACH_DATA_DIR=/opt/nexifyai/repos/nexify-agentur-plattform/data/outreach
FIRECRAWL_URL=http://127.0.0.1:3003
OUTREACH_UNSUBSCRIBE_URL=https://www.nexifyai.cloud/api/outreach/unsubscribe
OUTREACH_BOOKING_URL=https://www.nexifyai.cloud/de/kontakt
```

VPS secrets file: `/etc/nexifyai/secrets.env` (loaded by the daily job).

## How to enable

1. **Secrets:** Set `IMAP_USER`/`IMAP_PASSWORD` (or `SMTP_*`) for `mail@nexifyai.cloud` in `/etc/nexifyai/secrets.env` and mirror names in GitHub Actions secrets if needed. Tracked on [#123](https://github.com/nexifyai-dev/nexify-agentur-plattform/issues/123) (human-gate).
2. **Queue leads:**
   ```bash
   python3 scripts/outreach/promote_leads.py \
     --input docs/gtm/evidence/demand-pending/ \
     --allow-send \
     --out-name demand-promoted.jsonl
   # Or copy fixtures:
   cp scripts/outreach/fixtures/sample_leads.jsonl data/outreach/queue/
   ```
3. **Dry-run:**
   ```bash
   python3 scripts/outreach/run_daily.py --dry-run --json
   ```
4. **Live once:**
   ```bash
   OUTREACH_LIVE=1 python3 scripts/outreach/run_daily.py --live --json
   # or Actions: workflow_dispatch → live=true
   ```
5. **Schedule:** `.github/workflows/lead-outreach-daily.yml` cron `30 7 * * *` on self-hosted labels `self-hosted,vps,nexifyai`.
6. **Cursor Automation:** Enable `.cursor/automations/lead-outreach-to-agent.md` in Cursor UI (agent owns failures/retries).
7. **Manual agent kick:** `gh api repos/nexifyai-dev/nexify-agentur-plattform/dispatches -f event_type=lead-outreach-run`

## Exit codes

| Code | Meaning |
|------|---------|
| 0 | OK (including dry-run / daily cap reached) |
| 1 | Soft send errors → Cloud Agent dispatch |
| 2 | HUMAN-GATE (missing SMTP) → comment on #123 |

## Blocked without credentials

If `IMAP_PASSWORD` / `SMTP_PASSWORD` is missing:

- Live runs **do not send**.
- Job exits **2** and comments on issue **#123**.
- Resend alone is **not** a substitute for cold outreach.

## Related

- SOP: `docs/governance/02_sops/SOP_KUNDENSUCHE_LEAD_TO_CRM_OUTREACH_GATE_V3.md`
- GTM: `docs/gtm/`
- Event ingest: `docs/operations/CLOUD-AGENT-EVENT-INGEST.md`
- Existing campaign endpoint (Resend-first): `POST /campaign/send` in `backend/server.py` — prefer `scripts/outreach` for drip
