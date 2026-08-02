#!/usr/bin/env bash
# FILE: scripts/daily-smoke-hosted.sh
# NIR: 02.08.2026 09:05
# UPDATED: 02.08.2026 09:05
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI DevOps
# WHAT: Hosted (ubuntu-latest) curl smoke — distinct from VPS scripts/daily-smoke.sh (lead #156) (no self-hosted runner required).
# WHY: Laptop-off health signal when VPS runner is missing (#123).
# BEST-PRACTICE: Public/edge endpoints only; never print secrets; soft-fail optional probes.
# PITFALL: V-SM-01: Do not require :8644/:3111 from ubuntu-latest — those are VPS-local.
# DEPENDS: curl; optional SMOKE_* URL overrides (names in SECRET registry as variables)
# DOCS-REF: docs/operations/HUMAN-GATE-5MIN.md
# SESSION: full-auto-config-close-7dd5

set -euo pipefail

# Timezone mandate — Europe/Berlin (docs/operations/TIMEZONE-EUROPE-BERLIN.md)
export TZ=Europe/Berlin

SITE_HEALTH="${SMOKE_BASE_URL:-https://www.nexifyai.cloud}/api/health"
# Some setups expose health on apex
SITE_HEALTH_ALT="${SMOKE_SITE_HEALTH_URL:-https://nexifyai.cloud/api/health}"
AI_ROUTER="${SMOKE_AI_ROUTER_URL:-https://ai-router.nexifyai.cloud/api/health}"
AM_PUBLIC="${SMOKE_AGENTMEMORY_URL:-https://agentmemory.nexifyai.cloud}"
API_HEALTH="${SMOKE_API_HEALTH_URL:-}"

PASS=0
FAIL=0
WARN=0
RESULTS=()

probe() {
  local name="$1" url="$2" required="${3:-1}"
  local code body
  code="$(curl -sS -o /tmp/nexify-smoke-body.txt -w '%{http_code}' --max-time 15 "$url" 2>/dev/null || echo "000")"
  body="$(head -c 200 /tmp/nexify-smoke-body.txt 2>/dev/null || true)"
  if [[ "$code" =~ ^2 ]]; then
    PASS=$((PASS + 1))
    RESULTS+=("PASS|$name|$code|$url")
    echo "PASS  $name  HTTP $code  $url"
  elif [[ "$required" == "0" ]]; then
    WARN=$((WARN + 1))
    RESULTS+=("WARN|$name|$code|$url")
    echo "WARN  $name  HTTP $code  $url"
  else
    FAIL=$((FAIL + 1))
    RESULTS+=("FAIL|$name|$code|$url")
    echo "FAIL  $name  HTTP $code  $url"
  fi
  # keep body out of logs beyond short snippet for debugging status only
  if [[ "$code" =~ ^2 ]] && echo "$body" | grep -qi 'status'; then
    echo "      body_snip=$(echo "$body" | tr '\n' ' ' | head -c 120)"
  fi
}

echo "=== NeXify daily smoke (hosted) ==="
echo "utc=$(date -u +%Y-%m-%dT%H:%M:%SZ)"

probe "SITE_HEALTH" "$SITE_HEALTH" 1
# alt is soft — either www or apex may be SoT
probe "SITE_HEALTH_ALT" "$SITE_HEALTH_ALT" 0
probe "AI_ROUTER_HEALTH" "$AI_ROUTER" 1
# AgentMemory public may be CF-tunneled; soft if 000/5xx until DNS fixed
probe "AGENTMEMORY_PUBLIC" "$AM_PUBLIC" 0
if [[ -n "$API_HEALTH" ]]; then
  probe "API_HEALTH" "$API_HEALTH" 0
fi

# Write machine-readable summary for dashboard refresh / GHA
OUT="${SMOKE_RESULTS_FILE:-/tmp/nexify-daily-smoke.tsv}"
printf '%s\n' "${RESULTS[@]}" > "$OUT"
echo "results_file=$OUT"
echo "PASS=$PASS WARN=$WARN FAIL=$FAIL"

if [[ "$FAIL" -gt 0 ]]; then
  exit 1
fi
exit 0
