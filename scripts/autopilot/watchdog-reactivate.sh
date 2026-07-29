#!/usr/bin/env bash
# NeXifyAI Autopilot: Watchdog reaktiviert Hermes-Orchestrierung periodisch
# NIR: 29.07.2026
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck disable=SC1091
source "${SCRIPT_DIR}/common.sh"

export AP_JOB="watchdog-reactivate"
ap_require_not_killed

LOCKFILE="/tmp/nexifyai-watchdog-reactivate.lock"
exec 9>"$LOCKFILE"
flock -n 9 || { ap_log "SKIP: overlap lock active"; exit 0; }

STATE_FILE="/root/.nexify/loop/state.json"
STATE_HASH="$(sha256sum "$STATE_FILE" 2>/dev/null | awk '{print $1}' || echo "nohash")"
export STATE_HASH

# Circuit Breaker: kostenrelevant (LLM/Tool-Aufrufe durch Hermes) vorher prüfen
CB_PAYLOAD="$(python3 - <<'PY'
import json, os, hashlib
state_hash = os.environ.get("STATE_HASH","")
payload = {
  "actor": "cursor",
  "tool": "hermes --yolo",
  "params": {"max_cycles": 1},
  "cost": 1.0,
  "state_hash": state_hash
}
print(json.dumps(payload))
PY
)"

CB_RESP="$(curl -sf -X POST "http://127.0.0.1:8912/check" \
  -H "Content-Type: application/json" \
  -d "$CB_PAYLOAD" --max-time 8 || true)"

allow="$(python3 - "$CB_RESP" <<'PY'
import json, sys
resp = sys.argv[1] if len(sys.argv) > 1 else ""
if not resp:
    print("false")
    raise SystemExit(0)
data = json.loads(resp)
print("true" if data.get("allow") is True else "false")
PY
)"

if [[ "$allow" != "true" ]]; then
  ap_log "blocked by circuit-breaker: allow=false"
  exit 0
fi

ap_log "trigger: start orchestration (MAX_CYCLES=1)"
export MAX_CYCLES=1

# Hermes-Orchestrierung einmal laufen lassen (keine Endlosschleife im Script)
/opt/nexifyai/scripts/orchestration-loop.sh

ap_log "done"
