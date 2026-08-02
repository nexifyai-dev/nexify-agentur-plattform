# FILE: /opt/nexifyai/scripts/orchestration-loop.sh
# NIR: 24.07.2026 12:10
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Core
# WHAT: §12 Auto-Work Orchestrierung — liest next_action, ruft hermes --yolo, MAX_CYCLES=50
# WHY: Prompt bleibt leer weil niemand next_action ausliest, §12 Circuit Breaker
# DEPENDS: hermes CLI, jq, /root/.nexify/loop/state.json

#!/usr/bin/env bash
# NeXifyAI Auto-Work Orchestration — liest next_action, ruft Hermes, §12-Schutz
set -euo pipefail

# Timezone mandate — Europe/Berlin (docs/operations/TIMEZONE-EUROPE-BERLIN.md)
export TZ=Europe/Berlin
STATE_FILE="/root/.nexify/loop/state.json"

# Kill-Switch respektieren (Autopilot/OPS)
KILL_SWITCH_PATH="/opt/nexifyai/state/autopilot/KILL_SWITCH"
if [[ -f "$KILL_SWITCH_PATH" ]]; then
  echo "§12 SKIP: Kill-Switch active ($KILL_SWITCH_PATH)"
  exit 0
fi

# Watchdog-sicher: erlaubter Override für kurze Runs
MAX_CYCLES="${MAX_CYCLES:-50}"
CYCLE=0
while [ "$CYCLE" -lt "$MAX_CYCLES" ]; do
  CYCLE=$((CYCLE + 1))
  hermes --yolo
  # Kompatibilität: manche Zustände verwenden `next` statt `next_action`
  NEXT=$(jq -r '.next_action // .next // empty' "$STATE_FILE")
  if [ -z "$NEXT" ]; then
    echo "Kein next_action – Ende, manueller Check nötig."
    break
  fi
  echo "[$CYCLE/$MAX_CYCLES] Nächster Task automatisch geladen: $NEXT"
done
[ "$CYCLE" -ge "$MAX_CYCLES" ] && echo "§12 ausgelöst: Iterationsgrenze erreicht, gestoppt statt endlos."
