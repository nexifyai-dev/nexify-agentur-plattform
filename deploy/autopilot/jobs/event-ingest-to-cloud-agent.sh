#!/usr/bin/env bash
# FILE: deploy/autopilot/jobs/event-ingest-to-cloud-agent.sh
# NIR: 02.08.2026 08:30
# UPDATED: 02.08.2026 08:30
# WHAT: Autopilot — pending AgentMemory Actions / health fails → Cloud Agent.
# WHY: VPS bleibt Runtime wenn Laptop aus; Cursor Cloud führt Code-Fixes aus.
# DEPENDS: CURSOR_API_KEY, AGENTMEMORY_SECRET; Repo scripts/event-ingest/
# DOCS-REF: docs/operations/CLOUD-AGENT-EVENT-INGEST.md
set -euo pipefail

# Prefer installed SoT path; fall back to repo checkout on VPS
REPO="${NEXIFY_REPO:-/opt/nexifyai/repos/nexify-agentur-plattform}"
AP_COMMON="/opt/nexifyai/scripts/autopilot/common.sh"
if [[ -f "$AP_COMMON" ]]; then
  # shellcheck disable=SC1091
  source "$AP_COMMON"
  export AP_JOB="event-ingest-to-cloud-agent"
  ap_require_not_killed
else
  ap_log() { echo "[event-ingest-to-cloud-agent] $*"; }
fi

set +u
[[ -f /opt/nexifyai/.agentmemory-mcp.env ]] && set -a && # shellcheck disable=SC1091
  source /opt/nexifyai/.agentmemory-mcp.env 2>/dev/null || true
set +a
[[ -f /opt/nexifyai/config/cursor-cloud.env ]] && set -a && # shellcheck disable=SC1091
  source /opt/nexifyai/config/cursor-cloud.env 2>/dev/null || true
set +a
set -u

DISPATCH="$REPO/scripts/event-ingest/dispatch_cloud_agent.py"
if [[ ! -f "$DISPATCH" ]]; then
  ap_log "missing dispatch script at $DISPATCH"
  exit 0
fi

# Drain pending actions tagged event-ingest / agent-fix (best-effort list)
AM_URL="${AGENTMEMORY_URL:-http://127.0.0.1:3111}"
TOKEN="${AGENTMEMORY_SECRET:-${AGENTMEMORY_TOKEN:-}}"
STATE_DIR="${AP_STATE_DIR:-/opt/nexifyai/state/autopilot}"
mkdir -p "$STATE_DIR"

export EVENT_INGEST_STATE_DIR="${STATE_DIR}/event-ingest-dedupe"
export CIRCUIT_BREAKER_URL="${CIRCUIT_BREAKER_URL:-http://127.0.0.1:8912}"

if [[ -z "${CURSOR_API_KEY:-}" ]]; then
  ap_log "CURSOR_API_KEY missing — queue-only mode"
  export CLIENT_PAYLOAD='{"prompt":"Autopilot tick: process pending AgentMemory Actions tagged event-ingest/agent-fix. Fix in repo with PR.","dedupe_key":"autopilot-tick-action-only","auto_pr":true}'
  python3 "$DISPATCH" \
    --repo-url "https://github.com/nexifyai-dev/nexify-agentur-plattform" \
    --ref main \
    --event-name repository_dispatch \
    --reason "autopilot:action-only" \
    --run-id "autopilot-$(date +%s)" \
    --action-only || true
  exit 0
fi

# Health-fail escalate: if last health state is fail, launch once per hour key
HEALTH_STATE="${STATE_DIR}/health.json"
PROMPT="Autopilot event-ingest tick $(date -Is). Process pending AgentMemory Actions with tags event-ingest|agent-fix|critical. Prefer code fixes via branch+PR. No Hermes cutover."
if [[ -f "$HEALTH_STATE" ]] && grep -qi 'fail\|critical\|down' "$HEALTH_STATE" 2>/dev/null; then
  PROMPT="HEALTH ALERT from VPS Autopilot. State file indicates failure. Diagnose services, open fix PR if repo-related, else document Action. $(date -Is)"
fi

export CLIENT_PAYLOAD
CLIENT_PAYLOAD="$(python3 -c 'import json,os,sys; print(json.dumps({"prompt":sys.argv[1],"dedupe_key":"autopilot-'+$(date +%Y%m%d%H)+'","auto_pr":True}))' "$PROMPT")"
export DISPATCH_TYPE=health-alert

python3 "$DISPATCH" \
  --repo-url "https://github.com/nexifyai-dev/nexify-agentur-plattform" \
  --ref main \
  --event-name repository_dispatch \
  --reason "autopilot:event-ingest" \
  --run-id "autopilot-$(date +%Y%m%d%H%M)" || ap_log "dispatch soft-fail"

ap_memory_hook "event-ingest-to-cloud-agent tick completed" 2>/dev/null || true
