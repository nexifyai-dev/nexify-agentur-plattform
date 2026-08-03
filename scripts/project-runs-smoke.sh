#!/usr/bin/env bash
# FILE: scripts/project-runs-smoke.sh
# NIR: 02.08.2026 09:20
# UPDATED: 02.08.2026 09:20
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Architecture
# WHAT: Pflicht-Smoke „Projekt läuft“ — Produkt-Critical-Path (nicht Repo-Hygiene)
# WHY: Agents mergen Automationen als Done; dieses Script ist der ehrliche Gate
# BEST-PRACTICE: L1 HTTP + L2 Marker + L3 Minimal-Funktional (slots>0, contact/planner)
# PITFALL: V-SMOKE-01: /health auf CB/9Router ist oft 404 — korrekte Pfade nutzen
# DEPENDS: curl, python3; optional PROJECT_RUNS_STRICT=1 fails on WARN
# DOCS-REF: docs/operations/GESAMTZIEL-CORRECTION-2026-08-02.md
# SESSION: gesamziel-correction-7dd5

set -euo pipefail

WWW="${PROJECT_RUNS_WWW:-https://www.nexifyai.cloud}"
API="${PROJECT_RUNS_API:-https://api.nexifyai.cloud}"
AM="${PROJECT_RUNS_AM:-http://127.0.0.1:3111/agentmemory/livez}"
GW="${PROJECT_RUNS_GW:-http://127.0.0.1:8644/health}"
LR="${PROJECT_RUNS_LR:-http://127.0.0.1:9622/health}"
ROUTER="${PROJECT_RUNS_ROUTER:-http://127.0.0.1:20128/v1/models}"
CB="${PROJECT_RUNS_CB:-http://127.0.0.1:8912/check}"

PASS=0
FAIL=0
WARN=0
RESULTS=()

probe() {
  local name="$1" url="$2" required="${3:-1}" marker="${4:-}"
  local code body
  code="$(curl -sS -o /tmp/nexify-prs-body.txt -w '%{http_code}' --max-time 15 -L "$url" 2>/dev/null || echo "000")"
  body="$(head -c 600 /tmp/nexify-prs-body.txt 2>/dev/null || true)"
  if [[ "$code" =~ ^2 ]]; then
    if [[ -n "$marker" ]] && ! echo "$body" | grep -qi "$marker"; then
      WARN=$((WARN + 1))
      RESULTS+=("WARN|$name|$code|marker_missing")
      echo "WARN  $name  HTTP $code  marker '$marker' missing"
      return
    fi
    PASS=$((PASS + 1))
    RESULTS+=("PASS|$name|$code")
    echo "PASS  $name  HTTP $code"
  elif [[ "$required" == "0" ]]; then
    WARN=$((WARN + 1))
    RESULTS+=("WARN|$name|$code")
    echo "WARN  $name  HTTP $code"
  else
    FAIL=$((FAIL + 1))
    RESULTS+=("FAIL|$name|$code")
    echo "FAIL  $name  HTTP $code  $url"
  fi
}

echo "=== NeXify project-runs smoke ==="
echo "utc=$(date -u +%Y-%m-%dT%H:%M:%SZ)"

# --- Public product path ---
probe "WWW_HEALTH" "$WWW/api/health" 1 "status"
probe "API_HEALTH" "$API/api/health" 1 "status"
probe "API_HEALTH_FULL" "$API/api/health/full" 1 "status"
probe "WWW_DE" "$WWW/de" 1
probe "WWW_CHAT" "$WWW/chat" 0
probe "WWW_BUCHEN" "$WWW/de/buchen" 0

# Booking: must have free future slots
SLOT_CODE="$(curl -sS -o /tmp/nexify-prs-slots.json -w '%{http_code}' --max-time 15 "$API/api/booking/slots" 2>/dev/null || echo "000")"
SLOT_N="$(python3 - <<'PY' 2>/dev/null || echo 0
import json
try:
    with open("/tmp/nexify-prs-slots.json") as f:
        d = json.load(f)
    print(len(d) if isinstance(d, list) else 0)
except Exception:
    print(0)
PY
)"
if [[ "$SLOT_CODE" =~ ^2 ]] && [[ "$SLOT_N" -gt 0 ]]; then
  PASS=$((PASS + 1))
  RESULTS+=("PASS|BOOKING_SLOTS|$SLOT_CODE|n=$SLOT_N")
  echo "PASS  BOOKING_SLOTS  HTTP $SLOT_CODE  count=$SLOT_N"
else
  FAIL=$((FAIL + 1))
  RESULTS+=("FAIL|BOOKING_SLOTS|$SLOT_CODE|n=$SLOT_N")
  echo "FAIL  BOOKING_SLOTS  HTTP $SLOT_CODE  count=$SLOT_N  (seed via scripts/seed_booking_slots.py)"
fi

# Contact + planner (functional)
CONTACT_CODE="$(curl -sS -o /tmp/nexify-prs-contact.json -w '%{http_code}' --max-time 15 \
  -X POST "$WWW/api/contact" -H 'content-type: application/json' \
  -d '{"name":"smoke","email":"smoke@nexifyai.cloud","message":"project-runs-smoke"}' 2>/dev/null || echo "000")"
if [[ "$CONTACT_CODE" =~ ^2 ]] && grep -qi 'lead\|ok\|status' /tmp/nexify-prs-contact.json 2>/dev/null; then
  PASS=$((PASS + 1))
  RESULTS+=("PASS|CONTACT|$CONTACT_CODE")
  echo "PASS  CONTACT  HTTP $CONTACT_CODE"
else
  FAIL=$((FAIL + 1))
  RESULTS+=("FAIL|CONTACT|$CONTACT_CODE")
  echo "FAIL  CONTACT  HTTP $CONTACT_CODE"
fi

PLAN_CODE="$(curl -sS -o /tmp/nexify-prs-plan.json -w '%{http_code}' --max-time 15 \
  -X POST "$WWW/api/planner/plan" -H 'content-type: application/json' \
  -d '{"locale":"de","goal":"Smoke"}' 2>/dev/null || echo "000")"
if [[ "$PLAN_CODE" =~ ^2 ]]; then
  PASS=$((PASS + 1))
  RESULTS+=("PASS|PLANNER|$PLAN_CODE")
  echo "PASS  PLANNER  HTTP $PLAN_CODE"
else
  FAIL=$((FAIL + 1))
  RESULTS+=("FAIL|PLANNER|$PLAN_CODE")
  echo "FAIL  PLANNER  HTTP $PLAN_CODE"
fi

# --- Local runtime (VPS) ---
probe "AGENTMEMORY" "$AM" 1
probe "HERMES_GATEWAY" "$GW" 1
probe "LIGHTRAG" "$LR" 1
probe "NINEROUTER_MODELS" "$ROUTER" 0 "object"

CB_CODE="$(curl -sS -o /tmp/nexify-prs-cb.json -w '%{http_code}' --max-time 8 \
  -X POST "$CB" -H 'content-type: application/json' \
  -d '{"actor":"project-runs-smoke","tool":"smoke","params":{},"cost":0,"state_hash":"smoke"}' 2>/dev/null || echo "000")"
if [[ "$CB_CODE" =~ ^2 ]] && grep -qi 'allow' /tmp/nexify-prs-cb.json 2>/dev/null; then
  PASS=$((PASS + 1))
  RESULTS+=("PASS|CIRCUIT_BREAKER|$CB_CODE")
  echo "PASS  CIRCUIT_BREAKER  HTTP $CB_CODE"
else
  WARN=$((WARN + 1))
  RESULTS+=("WARN|CIRCUIT_BREAKER|$CB_CODE")
  echo "WARN  CIRCUIT_BREAKER  HTTP $CB_CODE"
fi

OUT="${PROJECT_RUNS_RESULTS_FILE:-/tmp/nexify-project-runs-smoke.tsv}"
printf '%s\n' "${RESULTS[@]}" > "$OUT"
echo "results_file=$OUT"
echo "PASS=$PASS WARN=$WARN FAIL=$FAIL"

if [[ "$FAIL" -gt 0 ]]; then
  exit 1
fi
if [[ "${PROJECT_RUNS_STRICT:-0}" == "1" ]] && [[ "$WARN" -gt 0 ]]; then
  exit 1
fi
exit 0
