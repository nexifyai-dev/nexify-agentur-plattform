#!/bin/bash
# health-check.sh — NeXifyAI Service Health Monitor
# NIR: 28.07.2026 13:54
# NAME: NeXifyAI ComplianceEngine
# TEAM: NeXifyAI Core
# WHAT: (auto-dokumentiert)
# WHY: (auto-dokumentiert — fehlte NIR-Header)
# DEPENDS: (auto-dokumentiert)

# Prüft alle 13 Services, speichert Fehler in AgentMemory
# Aufruf: via systemd timer alle 15min

# bestpraxis-system-wide-hermes-env-source (since 2026-07-31)
if [ -f /etc/nexifyai/hermes.env ]; then
  set -a
  . /etc/nexifyai/hermes.env
  set +a
fi

ENDPOINTS=(
  "9Router:20128:v1/models"
  "AgentMemory:3113:health"
  "LightRAG:9622:health"
  "WebUI:8787:"
  "Dashboard:4001:api/health"
  "MCP-Proxy:8650:"
  "Website:8880:api/health"
  "GitLab:8922:"
  "Supabase:8000:rest/v1/"
  "Hermes-Gateway:8642:health"
)

FAILS=0
REPORT=""

for ep in "${ENDPOINTS[@]}"; do
  IFS=':' read -r name port path <<< "$ep"
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "http://127.0.0.1:$port/$path" 2>/dev/null || true)
  code=$(printf '%s' "$code" | tr -cd '0-9' | tail -c 3)  # 000000→000 (curl-Fehler + Fallback-Doppelung)

  # Retry bei Timeout/5xx: 1 weiterer Versuch nach 2s, unterdrückt False-Positives bei Lastspitzen
  if [ "$code" = "000" ] || [ "$code" -ge 500 ]; then
    sleep 2
    code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 8 "http://127.0.0.1:$port/$path" 2>/dev/null || true)
    code=$(printf '%s' "$code" | tr -cd '0-9' | tail -c 3)
  fi

  if [ "$code" = "000" ] || [ "$code" -ge 500 ]; then
    REPORT="${REPORT}FAIL $name:$port → $code\n"
    curl -s -X POST http://127.0.0.1:3113/memories \
      -H "Content-Type: application/json" \
      -d "{\"content\":\"Health FAIL: $name:$port → $code\",\"type\":\"fact\",\"project\":\"nexifyai\"}" > /dev/null 2>&1 &
    ((FAILS++))
  else
    REPORT="${REPORT}OK   $name:$port → $code\n"
  fi
done

echo -e "$REPORT"
echo "Health: $FAILS/${#ENDPOINTS[@]} failures"

# healthchecks.io Uptime (externes Monitoring, GDOK §5.2) — seit 2026-08-05
# Aktiv nur wenn HEALTHCHECKS_URL gesetzt (Key in /etc/nexifyai/hermes.env).
# Erfolg → PING, Ausfall → PING/fail (healthchecks.io meldet DOWN).
if [ -n "$HEALTHCHECKS_URL" ]; then
  if [ "$FAILS" -gt 0 ]; then
    curl -fsS -m 10 --retry 5 "${HEALTHCHECKS_URL%/}/fail" > /dev/null 2>&1
    echo "healthchecks.io: reported FAIL ($FAILS failures)"
  else
    curl -fsS -m 10 --retry 5 "${HEALTHCHECKS_URL%/}" > /dev/null 2>&1
    echo "healthchecks.io: reported OK"
  fi
fi

exit $FAILS
