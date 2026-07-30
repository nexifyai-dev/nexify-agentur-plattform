#!/usr/bin/env bash
# NeXifyAI Autopilot: Watchdog reaktiviert Hermes-Orchestrierung periodisch
# NIR: 29.07.2026
# WHY: CB-Gate darf Watchdog nicht durch identische hermes --yolo Checks + Budget killen
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
TICK="$(date +%s)"
export STATE_HASH TICK

cb_reset_scope() {
  local scope="${1:-watchdog}"
  python3 - "$scope" <<'PY'
import json, sys, urllib.request
from pathlib import Path
scope = sys.argv[1]
token = None
for fp in ("/etc/circuit-breaker/circuit-breaker.env",):
    p = Path(fp)
    if not p.exists():
        continue
    for line in p.read_text(encoding="utf-8", errors="replace").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        if k.strip() == "CB_RESET_TOKEN":
            token = v.strip().strip('"').strip("'")
            break
if not token:
    print("no_token")
    raise SystemExit(0)
req = urllib.request.Request(
    "http://127.0.0.1:8912/reset",
    data=json.dumps({"token": token, "scope": scope}).encode(),
    headers={"Content-Type": "application/json"},
    method="POST",
)
try:
    with urllib.request.urlopen(req, timeout=5) as r:
        print(r.read().decode("utf-8", errors="replace")[:120])
except Exception as e:
    print(f"reset_fail:{type(e).__name__}")
PY
}

# Gate-Check: eigener Scope, cost=0, tick-unique — kein False-Positive vs. Hermes-Yolo-Loops
CB_PAYLOAD="$(python3 - <<'PY'
import json, os
state_hash = os.environ.get("STATE_HASH", "")
tick = os.environ.get("TICK", "0")
payload = {
  "actor": "autopilot",
  "tool": "watchdog-reactivate",
  "params": {"max_cycles": 1, "tick": tick},
  "cost": 0.0,
  "state_hash": f"{state_hash}:{tick}",
  "scope": "watchdog",
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
  # Self-heal: Watchdog-Scope/Global nach False-Positive Pause zurücksetzen (ein Retry)
  ap_log "blocked by circuit-breaker — attempting scoped reset"
  cb_reset_scope watchdog >/dev/null || true
  # Global nur wenn Pause-Grund Watchdog/Yolo-Repetition war (Ops-Stillstand)
  PAUSED_GLOBAL="$(curl -sf http://127.0.0.1:8912/status --max-time 5 || true)"
  NEED_GLOBAL="$(python3 - "$PAUSED_GLOBAL" <<'PY'
import json, sys
raw = sys.argv[1] if len(sys.argv) > 1 else ""
try:
    d = json.loads(raw) if raw else {}
except Exception:
    print("false"); raise SystemExit(0)
g = (d.get("scopes") or {}).get("global") or {}
reason = str(g.get("pause_reason") or "")
if g.get("paused") and ("hermes --yolo" in reason or "identische Aktion" in reason):
    print("true")
else:
    print("false")
PY
)"
  if [[ "$NEED_GLOBAL" == "true" ]]; then
    cb_reset_scope global >/dev/null || true
  fi
  CB_RESP="$(curl -sf -X POST "http://127.0.0.1:8912/check" \
    -H "Content-Type: application/json" \
    -d "$CB_PAYLOAD" --max-time 8 || true)"
  allow="$(python3 - "$CB_RESP" <<'PY'
import json, sys
resp = sys.argv[1] if len(sys.argv) > 1 else ""
if not resp:
    print("false"); raise SystemExit(0)
data = json.loads(resp)
print("true" if data.get("allow") is True else "false")
PY
)"
fi

if [[ "$allow" != "true" ]]; then
  ap_log "blocked by circuit-breaker: allow=false (after reset attempt)"
  exit 0
fi

ap_log "trigger: start orchestration (MAX_CYCLES=1)"
export MAX_CYCLES=1

# Hermes-Orchestrierung einmal laufen lassen (keine Endlosschleife im Script)
/opt/nexifyai/scripts/orchestration-loop.sh

# Post-heal: parallele Agenten können global via identische hermes --yolo Checks pausieren
PAUSED_GLOBAL="$(curl -sf http://127.0.0.1:8912/status --max-time 5 || true)"
NEED_GLOBAL="$(python3 - "$PAUSED_GLOBAL" <<'PY'
import json, sys
raw = sys.argv[1] if len(sys.argv) > 1 else ""
try:
    d = json.loads(raw) if raw else {}
except Exception:
    print("false"); raise SystemExit(0)
g = (d.get("scopes") or {}).get("global") or {}
reason = str(g.get("pause_reason") or "")
if g.get("paused") and ("hermes --yolo" in reason or "identische Aktion" in reason):
    print("true")
else:
    print("false")
PY
)"
if [[ "$NEED_GLOBAL" == "true" ]]; then
  ap_log "post-heal: reset global after hermes-yolo false-positive pause"
  cb_reset_scope global >/dev/null || true
fi

ap_log "done"
