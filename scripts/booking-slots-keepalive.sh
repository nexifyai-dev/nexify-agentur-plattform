#!/usr/bin/env bash
# FILE: scripts/booking-slots-keepalive.sh
# NIR: 02.08.2026 09:20
# UPDATED: 02.08.2026 09:20
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Architecture
# WHAT: If public booking slots empty → seed via admin API (env credentials)
# WHY: Marketing went live with [] slots — conversion path dead
# BEST-PRACTICE: Never print secrets; source /etc/nexifyai/secrets.env if present
# PITFALL: V-BOOK-01: dry-run when ADMIN_* missing (exit 0 + clear WARN)
# DEPENDS: scripts/seed_booking_slots.py, ADMIN_EMAIL, ADMIN_PASSWORD, BACKEND_URL
# DOCS-REF: docs/operations/BOOKING-SLOTS-SEED.md
# SESSION: gesamziel-correction-7dd5

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
API="${BOOKING_API_URL:-https://api.nexifyai.cloud}"
MIN_SLOTS="${BOOKING_MIN_SLOTS:-5}"

# Load secrets without echoing
if [[ -f /etc/nexifyai/secrets.env ]]; then
  set -a
  # shellcheck disable=SC1091
  source /etc/nexifyai/secrets.env
  set +a
fi

export BACKEND_URL="${BACKEND_URL:-$API}"

CODE="$(curl -sS -o /tmp/nexify-book-slots.json -w '%{http_code}' --max-time 15 \
  "$API/api/booking/slots" 2>/dev/null || echo 000)"
N="$(python3 - <<'PY' 2>/dev/null || echo 0
import json
try:
    with open("/tmp/nexify-book-slots.json") as f:
        d = json.load(f)
    print(len(d) if isinstance(d, list) else 0)
except Exception:
    print(0)
PY
)"

echo "booking_slots_check HTTP=$CODE count=$N min=$MIN_SLOTS"

if [[ "$CODE" =~ ^2 ]] && [[ "$N" -ge "$MIN_SLOTS" ]]; then
  echo "OK enough slots"
  exit 0
fi

if [[ -z "${ADMIN_EMAIL:-}" || -z "${ADMIN_PASSWORD:-}" ]]; then
  echo "WARN slots low/empty but ADMIN_EMAIL/ADMIN_PASSWORD unset — cannot auto-seed"
  exit 0
fi

echo "SEED applying via seed_booking_slots.py"
python3 "$ROOT/scripts/seed_booking_slots.py" --apply --days 10 --per-day 3
exit $?
