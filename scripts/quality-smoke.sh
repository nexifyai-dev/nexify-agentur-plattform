#!/usr/bin/env bash
# FILE: scripts/quality-smoke.sh
# NIR: 02.08.2026 09:15
# UPDATED: 04.08.2026 09:35
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Quality
# WHAT: L1/L2 curl smoke for public edge + optional localhost runtime probes.
# WHY: Absolute health signal on PR/schedule without requiring VPS self-hosted runners.
# BEST-PRACTICE: Public URLs required on ubuntu-latest; localhost only when QUALITY_SMOKE_LOCAL=1 or port open.
#                Authenticated tunnel/public URL overrides activate L1 probes on hosted runners too.
# PITFALL: V-QG-01: Never fail CI for missing :3111/:8644/:9622 on hosted runners — SKIP with clear note.
#          V-QG-02: Non-empty QUALITY_SMOKE_*_URL overrides always probe (tunnel/public endpoint path).
# DEPENDS: curl; optional SMOKE_* / QUALITY_SMOKE_* URL overrides
# DOCS-REF: docs/operations/QUALITY-GATES.md
# SESSION: quality-gates-absolute-7dd5

set -euo pipefail

SITE_HEALTH="${SMOKE_BASE_URL:-https://www.nexifyai.cloud}/api/health"
SITE_HEALTH_ALT="${SMOKE_SITE_HEALTH_URL:-https://nexifyai.cloud/api/health}"
AI_ROUTER="${SMOKE_AI_ROUTER_URL:-https://ai-router.nexifyai.cloud/api/health}"
AM_PUBLIC="${SMOKE_AGENTMEMORY_URL:-https://agentmemory.nexifyai.cloud}"
API_HEALTH="${SMOKE_API_HEALTH_URL:-https://api.nexifyai.cloud/api/health}"

AM_LOCAL="${QUALITY_SMOKE_AM_URL:-http://127.0.0.1:3111/agentmemory/livez}"
GW_LOCAL="${QUALITY_SMOKE_GATEWAY_URL:-http://127.0.0.1:8644/health}"
LR_LOCAL="${QUALITY_SMOKE_LIGHTRAG_URL:-http://127.0.0.1:9622/health}"

# Returns true when the probe should run: LOCAL flag set, port open, or a custom (non-default) URL override provided.
should_probe_local() {
  local default_url="$1" actual_url="$2" host="$3" port="$4"
  [[ "${QUALITY_SMOKE_LOCAL:-0}" == "1" ]] && return 0
  port_open "$host" "$port" && return 0
  # Non-empty override that differs from the default → authenticated tunnel or public endpoint
  [[ -n "$actual_url" && "$actual_url" != "$default_url" ]] && return 0
  return 1
}

PASS=0
FAIL=0
WARN=0
SKIP=0
RESULTS=()

port_open() {
  local host="$1" port="$2"
  # bash /dev/tcp — no secrets, fail closed
  timeout 1 bash -c "echo >/dev/tcp/${host}/${port}" 2>/dev/null
}

probe() {
  local name="$1" url="$2" required="${3:-1}" expect_marker="${4:-}"
  local code body
  code="$(curl -sS -o /tmp/nexify-qg-body.txt -w '%{http_code}' --max-time 15 -L "$url" 2>/dev/null || echo "000")"
  body="$(head -c 400 /tmp/nexify-qg-body.txt 2>/dev/null || true)"
  # Never echo secrets — body only status-ish snippets
  if [[ "$code" =~ ^2 ]]; then
    if [[ -n "$expect_marker" ]] && ! echo "$body" | grep -qi "$expect_marker"; then
      WARN=$((WARN + 1))
      RESULTS+=("WARN|$name|$code|marker_missing|$url")
      echo "WARN  $name  HTTP $code  marker '$expect_marker' missing  $url"
      return
    fi
    PASS=$((PASS + 1))
    RESULTS+=("PASS|$name|$code|$url")
    echo "PASS  $name  HTTP $code  $url"
    if echo "$body" | grep -qi 'status'; then
      echo "      body_snip=$(echo "$body" | tr '\n' ' ' | head -c 120)"
    fi
  elif [[ "$required" == "0" ]]; then
    WARN=$((WARN + 1))
    RESULTS+=("WARN|$name|$code|$url")
    echo "WARN  $name  HTTP $code  $url"
  else
    FAIL=$((FAIL + 1))
    RESULTS+=("FAIL|$name|$code|$url")
    echo "FAIL  $name  HTTP $code  $url"
  fi
}

skip_local() {
  local name="$1" reason="$2"
  SKIP=$((SKIP + 1))
  RESULTS+=("SKIP|$name|000|$reason")
  echo "SKIP  $name  — $reason"
}

echo "=== NeXify quality smoke ==="
echo "utc=$(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo "runner_hint=${RUNNER_OS:-local} QUALITY_SMOKE_LOCAL=${QUALITY_SMOKE_LOCAL:-0}"

# --- Public / edge (ubuntu-latest safe) ---
probe "SITE_HEALTH" "$SITE_HEALTH" 1 "status"
probe "SITE_HEALTH_ALT" "$SITE_HEALTH_ALT" 0 "status"
probe "API_HEALTH" "$API_HEALTH" 0 "status"
probe "AI_ROUTER_HEALTH" "$AI_ROUTER" 0
probe "AGENTMEMORY_PUBLIC" "$AM_PUBLIC" 0

# --- Localhost runtime (VPS / Remote-SSH only) ---
if should_probe_local "http://127.0.0.1:3111/agentmemory/livez" "$AM_LOCAL" 127.0.0.1 3111; then
  probe "AGENTMEMORY_LOCAL" "$AM_LOCAL" 0
else
  skip_local "AGENTMEMORY_LOCAL" "hosted runners: no localhost :3111 (set QUALITY_SMOKE_LOCAL=1 on VPS or provide QUALITY_SMOKE_AM_URL)"
fi

if should_probe_local "http://127.0.0.1:8644/health" "$GW_LOCAL" 127.0.0.1 8644; then
  probe "HERMES_GATEWAY_LOCAL" "$GW_LOCAL" 0
else
  skip_local "HERMES_GATEWAY_LOCAL" "hosted runners: no localhost :8644 (set QUALITY_SMOKE_LOCAL=1 on VPS or provide QUALITY_SMOKE_GATEWAY_URL)"
fi

if should_probe_local "http://127.0.0.1:9622/health" "$LR_LOCAL" 127.0.0.1 9622; then
  probe "LIGHTRAG_LOCAL" "$LR_LOCAL" 0
else
  skip_local "LIGHTRAG_LOCAL" "hosted runners: no localhost :9622 (set QUALITY_SMOKE_LOCAL=1 on VPS or provide QUALITY_SMOKE_LIGHTRAG_URL)"
fi

OUT="${QUALITY_SMOKE_RESULTS_FILE:-${SMOKE_RESULTS_FILE:-/tmp/nexify-quality-smoke.tsv}}"
printf '%s\n' "${RESULTS[@]}" > "$OUT"
echo "results_file=$OUT"
echo "PASS=$PASS WARN=$WARN SKIP=$SKIP FAIL=$FAIL"

if [[ "$FAIL" -gt 0 ]]; then
  exit 1
fi
exit 0
