#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
# NIR: 24.07.2026 13:59
# NAME: NeXifyAI ComplianceEngine
# TEAM: NeXifyAI Core
# WHAT: (auto-dokumentiert)
# WHY: (auto-dokumentiert — fehlte NIR-Header)
# DEPENDS: (auto-dokumentiert)

# Kern-Regelkreis Drift-Erkennung
# VOLLBETRIEB §3.1: Soll-Ist-Abgleich im festen Takt
# 
# Prüft alle 5 Glieder des Regelkreises:
#   Oracle → Paperclip → Hermes → agentmemory → Oracle
#
# Exit: 0 = kein Drift, 1 = Drift erkannt
# Timer: nexifyai-kern-regelkreis.timer (alle 10 Min)
# ═══════════════════════════════════════════════════════════════

# bestpraxis-system-wide-hermes-env-source (since 2026-07-31)
if [ -f /etc/nexifyai/hermes.env ]; then
  set -a
  . /etc/nexifyai/hermes.env
  set +a
fi

set -euo pipefail

# Secrets aus kanonischer Quelle — keine hartcodierten Credentials
set -a; source /etc/nexifyai/secrets.env; set +a

LOG="/var/log/nexifyai/kern-regelkreis-drift.log"
DRIFT_COUNT=0
TIMESTAMP=$(date -u '+%Y-%m-%d %H:%M:%S')

mkdir -p "$(dirname "$LOG")"

echo "[$TIMESTAMP] ═══════════ Kern-Regelkreis Drift-Check ═══════════" >> "$LOG"

check_component() {
  local name="$1"
  local test_cmd="$2"
  local expected="$3"
  local result
  
  result=$(eval "$test_cmd" 2>/dev/null) || true
  if [ -z "$result" ]; then
    echo "[$TIMESTAMP] ❌ $name — DRIFT (no result, expected: $expected)" >> "$LOG"
    DRIFT_COUNT=$((DRIFT_COUNT+1))
    return 0
  fi
  if [ "$result" = "$expected" ]; then
    echo "[$TIMESTAMP] ✅ $name — OK" >> "$LOG"
    return 0
  fi
  echo "[$TIMESTAMP] ❌ $name — DRIFT (got: '$result', expected: '$expected')" >> "$LOG"
  DRIFT_COUNT=$((DRIFT_COUNT+1))
  return 0
}

# ── Glied 1: ORACLE (Supabase) ──────────────────────────────
echo "[$TIMESTAMP] ─── Glied 1: Oracle (Supabase-DB) ───" >> "$LOG"
check_component "oracle_tasks" \
  "docker exec supabase-db sh -c 'PGPASSWORD=\"$POSTGRES_PASSWORD\" psql -U postgres -d postgres -t -c \"SELECT count(*) FROM oracle_tasks;\"' 2>/dev/null | tr -d ' ' | grep -c '[1-9][0-9]*'" \
  "1"

# ── Glied 2: PAPERCLIP ─────────────────────────────────────
echo "[$TIMESTAMP] ─── Glied 2: Paperclip ───" >> "$LOG"
check_component "paperclip_health" \
# DEAD_REF: "curl -s http://localhost:3100/api/health 2>/dev/null | grep -c '\"status\":\"ok\"'" \  # Paperclip entfernt 18.07.2026
  "1"

# ── Glied 3: HERMES ────────────────────────────────────────
echo "[$TIMESTAMP] ─── Glied 3: Hermes ───" >> "$LOG"
check_component "hermes_service" \
  "systemctl is-active hermes-gateway 2>/dev/null" \
  "active"

# ── Glied 4: AGENTMEMORY ───────────────────────────────────
echo "[$TIMESTAMP] ─── Glied 4: agentmemory ───" >> "$LOG"
# Use HTTP status code for agentmemory health (JSON response too large for grep)
check_component "agentmemory_health" \
  "curl -s -o /dev/null -w '%{http_code}' http://localhost:3113/health 2>/dev/null" \
  "200"

check_component "agentmemory_circuit" \
  "curl -s http://localhost:3113/health 2>/dev/null | grep -o '\"state\":\"[^\"]*\"' | grep -c 'closed'" \
  "1"

# ── Glied 5: FACH-LICHE E2E-PRÜFUNG ───────────────────────
echo "[$TIMESTAMP] ─── Glied 5: Fachlicher Durchlauf (E2E) ───" >> "$LOG"
# Prüfe ob Paperclip Issues verwalten kann (fachlicher Durchlauf Oracle→Paperclip→Hermes)
check_component "paperclip_issues_api" \
# DEAD_REF: "curl -s http://localhost:3100/api/companies/de2f5b6f-a8d9-4937-8de2-2e46452fc004/issues 2>/dev/null | grep -c 'issueNumber'" \  # Paperclip entfernt 18.07.2026
  "1"
check_component "paperclip_agents_api" \
# DEAD_REF: "curl -s http://localhost:3100/api/companies/de2f5b6f-a8d9-4937-8de2-2e46452fc004/agents 2>/dev/null | grep -c 'status' | head -1" \  # Paperclip entfernt 18.07.2026
  "1"
check_component "oracle_agents_db" \
  "PGPASSWORD='${SUPABASE_DB_PASSWORD}' psql -h '${SUPABASE_DB_HOST}' -p '${SUPABASE_DB_PORT}' -U '${SUPABASE_DB_USER}' -d '${SUPABASE_DB_NAME}' -t -c 'SELECT count(*) FROM oracle_agents WHERE status='\''active'\'';' 2>/dev/null | tr -d ' ' | grep -c '[1-9][0-9]*'" \
  "1"

# ── Glied 6: 9ROUTER (LLM-Gateway) + Selbstheilung ─────────
echo "[$TIMESTAMP] ─── Glied 6: 9Router (LLM-Gateway) ───" >> "$LOG"
router_status=$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:20128/ 2>/dev/null || true)
case "$router_status" in
  200|307|302) echo "[$TIMESTAMP] ✅ 9router_health — OK (HTTP $router_status)" >> "$LOG" ;;
  *)
    echo "[$TIMESTAMP] ❌ 9router_health — DRIFT (HTTP $router_status) → Selbstheilung: restart" >> "$LOG"
    # Selbstheilung (§3.1): fehlender/downer Container → Image-Tag sicherstellen + Neustart
    docker image inspect nexify-9router:latest >/dev/null 2>&1 && docker tag nexify-9router:latest decolua/9router:latest 2>/dev/null || true
    docker compose -f /opt/nexifyai/repos/9router/docker-compose.yml up -d --no-deps 9router >> "$LOG" 2>&1 || true
    sleep 6
    router_status2=$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:20128/ 2>/dev/null || true)
    case "$router_status2" in
      200|307|302) echo "[$TIMESTAMP] 🔧 9router_health — SELBSTGEHEILT (HTTP $router_status2 nach Restart)" >> "$LOG" ;;
      *) echo "[$TIMESTAMP] 🚨 9router_health — HEILUNG FEHLGESCHLAGEN (HTTP $router_status2) — Eskalation nötig" >> "$LOG"; DRIFT_COUNT=$((DRIFT_COUNT+1)) ;;
    esac
    ;;
esac

# ── Selbstheilung ───────────────────────────────────────────
echo "[$TIMESTAMP] ─── Selbstheilung ───" >> "$LOG"
# Oneshot service — check timer state + recent success via log
check_component "healthcheck_timer" \
  "systemctl is-active nexifyai-healthcheck.timer 2>/dev/null" \
  "active"
check_component "healthcheck_recent" \
  "tail -10 /var/log/nexifyai-health.log 2>/dev/null | grep 'completed' | tail -1 | grep -c 'completed'" \
  "1"
check_component "governance_timer" \
  "systemctl is-active nexifyai-governance.timer 2>/dev/null" \
  "active"

echo "[$TIMESTAMP] ═══════════ Ergebnis: $DRIFT_COUNT Drifts ═══════════" >> "$LOG"

# Ausgabe
if [ "$DRIFT_COUNT" -eq 0 ]; then
  echo "[$TIMESTAMP] ✅ KEIN DRIFT — Alle Glieder des Kern-Regelkreises funktionsfähig (inkl. 9Router)" >> "$LOG"
  exit 0
else
  echo "[$TIMESTAMP] ⚠️ DRIFT: $DRIFT_COUNT Abweichungen erkannt" >> "$LOG"
  exit 1
fi
