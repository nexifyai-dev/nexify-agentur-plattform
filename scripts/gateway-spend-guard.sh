#!/usr/bin/env bash
# FILE: scripts/gateway-spend-guard.sh
# NIR: 02.08.2026 09:20
# UPDATED: 02.08.2026 09:20
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Architecture
# WHAT: Keep Hermes Gateway up + Circuit-Breaker spend probe (no secret echo)
# WHY: Gateway war DOWN trotz enabled unit; Agents müssen Spend-Gate vor Kostenaktionen
# BEST-PRACTICE: restart only if health fails; CB cost=0 for this guard itself
# PITFALL: V-GW-01: never force Hermes prod cutover; only process liveness
# DEPENDS: systemctl hermes-gateway; curl :8644/health; :8912/check
# DOCS-REF: docs/operations/GESAMTZIEL-CORRECTION-2026-08-02.md
# SESSION: gesamziel-correction-7dd5

set -euo pipefail

if [[ -f /opt/nexifyai/state/autopilot/KILL_SWITCH ]]; then
  echo "SKIP kill_switch"
  exit 0
fi

GW_URL="${GATEWAY_HEALTH_URL:-http://127.0.0.1:8644/health}"
CB_URL="${CIRCUIT_BREAKER_URL:-http://127.0.0.1:8912/check}"
UNIT="${HERMES_GATEWAY_UNIT:-hermes-gateway.service}"

# Spend / budget gate (cost=0 for the guard probe)
CB_RESP="$(curl -sS -X POST "$CB_URL" -H 'content-type: application/json' \
  -d "{\"actor\":\"gateway-spend-guard\",\"tool\":\"liveness\",\"params\":{},\"cost\":0,\"state_hash\":\"$(date +%s)\"}" \
  --max-time 8 2>/dev/null || echo '{}')"
ALLOW="$(python3 -c 'import json,sys; d=json.loads(sys.argv[1] or "{}"); print("1" if d.get("allow", True) else "0")' "$CB_RESP" 2>/dev/null || echo 1)"
if [[ "$ALLOW" != "1" ]]; then
  echo "BLOCKED circuit_breaker allow=false — skip restart actions"
  echo "$CB_RESP" | head -c 200
  exit 0
fi

CODE="$(curl -sS -o /tmp/nexify-gw-health.txt -w '%{http_code}' --max-time 8 "$GW_URL" 2>/dev/null || echo 000)"
if [[ "$CODE" =~ ^2 ]]; then
  echo "OK gateway HTTP $CODE"
  exit 0
fi

echo "WARN gateway HTTP $CODE — attempting systemctl restart $UNIT"
if systemctl is-enabled --quiet "$UNIT" 2>/dev/null; then
  systemctl restart "$UNIT" || true
  sleep 3
  CODE2="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 8 "$GW_URL" 2>/dev/null || echo 000)"
  echo "AFTER_RESTART HTTP $CODE2"
  [[ "$CODE2" =~ ^2 ]] || exit 1
else
  echo "WARN unit $UNIT not enabled — not starting (no cutover)"
  exit 1
fi
exit 0
