# FILE: /docs/gtm/WEEKLY-ACQUISITION-PLAYBOOK.md
# NIR: 02.08.2026 10:55
# UPDATED: 02.08.2026 10:55
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI GTM
# WHAT: Wöchentlich discover → mail → follow-up → delight
# WHY: Ops-Cadence Neukunden P0
# BEST-PRACTICE: Dry-run default; Live nur OUTREACH_LIVE=1
# PITFALL: V-GTM-WK-01: Kein Massenmail
# DEPENDS: scripts/outreach/*, scripts/gtm/run-daily.sh
# DOCS-REF: docs/operations/LEAD-OUTREACH-AUTOMATION.md
# SESSION: zero-cost-leads-mailing-7dd5

# Weekly Acquisition Playbook

Mo Discover · Di Promote · Mi Mail (5–15) · Do Follow-up/Partner · Fr Delight + LinkedIn

```bash
set -a; . /etc/nexifyai/mail-nexifyai.env; . /etc/nexifyai/secrets.env; set +a
python3 scripts/outreach/discover_leads.py --seed scripts/outreach/fixtures/seed_websites.txt --limit 20
python3 scripts/outreach/run_daily.py --dry-run --json --secrets-file /etc/nexifyai/mail-nexifyai.env
OUTREACH_DAILY_CAP=15 bash scripts/gtm/run-daily.sh --live
```
