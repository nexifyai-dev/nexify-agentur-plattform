#!/usr/bin/env bash
# FILE: /scripts/gtm/run-daily.sh
# NIR: 02.08.2026 10:50
# UPDATED: 02.08.2026 11:00
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI GTM
# WHAT: Daily GTM outreach wrapper — dry-run default; UWG opt-in gate for live
# WHY: Prevent accidental cold email (§7 UWG); --live alone must not send
# BEST-PRACTICE: Dry-run unless --live AND --allow-opt-in-send
# PITFALL: UWG-01: Cold B2B email without express consent is illegal in DE
# DEPENDS: scripts/outreach/run_daily.py, /etc/nexifyai/mail-nexifyai.env
# DOCS-REF: docs/operations/LEAD-OUTREACH-AUTOMATION.md
# SESSION: uwg-cold-email-pause-7dd5
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"
SECRETS_FILE="${SECRETS_FILE:-/etc/nexifyai/mail-nexifyai.env}"
MODE="dry-run"
ALLOW_OPT_IN=0
for arg in "$@"; do
  case "$arg" in
    --live) MODE="live";;
    --dry-run) MODE="dry-run";;
    --allow-opt-in-send) ALLOW_OPT_IN=1;;
  esac
done
[[ -f "$SECRETS_FILE" ]] && set -a && source "$SECRETS_FILE" && set +a
[[ -f /etc/nexifyai/secrets.env ]] && set -a && source /etc/nexifyai/secrets.env && set +a
export OUTREACH_BOOKING_URL="${OUTREACH_BOOKING_URL:-https://www.nexifyai.cloud/rueckruf}"
export OUTREACH_DAILY_CAP="${OUTREACH_DAILY_CAP:-15}"

echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
echo "§7 UWG: E-Mail-Werbung ohne ausdrückliche Einwilligung ist in DE"
echo "auch B2B UNZULÄSSIG. Cold live-send ist gestoppt. Live nur mit"
echo "--allow-opt-in-send und consent=true (+consent_recorded_at) je Lead."
echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"

echo "[gtm] mode=$MODE allow_opt_in=$ALLOW_OPT_IN cap=$OUTREACH_DAILY_CAP"
if [[ "$MODE" == "live" && "$ALLOW_OPT_IN" == "1" ]]; then
  exec python3 scripts/outreach/run_daily.py --live --allow-opt-in-send --json --secrets-file "$SECRETS_FILE"
fi
if [[ "$MODE" == "live" ]]; then
  echo "[gtm] REFUSING live without --allow-opt-in-send — forcing dry-run (UWG)." >&2
fi
exec python3 scripts/outreach/run_daily.py --dry-run --json --secrets-file "$SECRETS_FILE"
