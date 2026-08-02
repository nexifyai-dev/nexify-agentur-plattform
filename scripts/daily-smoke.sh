#!/usr/bin/env bash
# FILE: scripts/daily-smoke.sh
# NIR: 02.08.2026 09:05
# UPDATED: 02.08.2026 09:05
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI DevOps
# WHAT: Local/VPS daily smoke — L1 alive checks for website, AM, LightRAG, CB.
# WHY: Lead-Owner mandate — continuous health without full CI suite.
# BEST-PRACTICE: Fail-closed on core; warn-only on optional (gateway, paperclip).
# PITFALL: V-SMOKE-01: HTTP 200 alone is not L3 — print body markers when present.
# DEPENDS: curl; optional env overrides for URLs
# DOCS-REF: docs/operations/AGENTIC-AI-MODE.md
# SESSION: lead-ops-batch-7dd5

set -euo pipefail

# Timezone mandate — Europe/Berlin (docs/operations/TIMEZONE-EUROPE-BERLIN.md)
export TZ=Europe/Berlin

WWW_HEALTH="${WWW_HEALTH_URL:-https://www.nexifyai.cloud/api/health}"
AM_LIVEZ="${AM_LIVEZ_URL:-http://127.0.0.1:3111/agentmemory/livez}"
LR_HEALTH="${LR_HEALTH_URL:-http://127.0.0.1:9622/health}"
CB_STATUS="${CB_STATUS_URL:-http://127.0.0.1:8912/status}"
GW_URL="${HERMES_GATEWAY_URL:-http://127.0.0.1:8644/}"
PAPERCLIP_URL="${PAPERCLIP_URL:-http://127.0.0.1:3100/health}"
BACKEND_HEALTH="${BACKEND_HEALTH_URL:-http://127.0.0.1:8000/api/health}"

PASS=0
FAIL=0
WARN=0

check_core() {
  local name="$1" url="$2" needle="${3:-}"
  local body code
  code=$(curl -sS -m 8 -o /tmp/daily-smoke-body -w '%{http_code}' "$url" 2>/dev/null) || code="000"
  body=$(cat /tmp/daily-smoke-body 2>/dev/null || true)
  if [[ "$code" != "200" && "$code" != "204" ]]; then
    echo "FAIL  $name  http=$code  $url"
    FAIL=$((FAIL + 1))
    return
  fi
  if [[ -n "$needle" ]] && ! grep -qi "$needle" <<<"$body"; then
    echo "FAIL  $name  http=$code missing marker '$needle'"
    FAIL=$((FAIL + 1))
    return
  fi
  echo "PASS  $name  http=$code"
  PASS=$((PASS + 1))
}

check_optional() {
  local name="$1" url="$2"
  local code
  code=$(curl -sS -m 5 -o /dev/null -w '%{http_code}' "$url" 2>/dev/null) || code="000"
  if [[ "$code" == "000" || "$code" == "502" || "$code" == "503" ]]; then
    echo "WARN  $name  http=$code (optional/down)  $url"
    WARN=$((WARN + 1))
    return
  fi
  echo "PASS  $name  http=$code (optional)"
  PASS=$((PASS + 1))
}

echo "=== NeXify daily-smoke $(date -u +%Y-%m-%dT%H:%M:%SZ) ==="
check_core "www/api/health" "$WWW_HEALTH" "ok\|status\|healthy\|database"
check_core "agentmemory/livez" "$AM_LIVEZ" "ok\|healthy\|agentmemory"
check_core "lightrag/health" "$LR_HEALTH" "healthy\|ok\|status"
check_optional "circuit-breaker" "$CB_STATUS"
check_optional "backend/api/health" "$BACKEND_HEALTH"
check_optional "hermes-gateway:8644" "$GW_URL"
check_optional "paperclip:3100" "$PAPERCLIP_URL"

echo "=== summary pass=$PASS warn=$WARN fail=$FAIL ==="
if [[ "$FAIL" -gt 0 ]]; then
  exit 1
fi
exit 0
