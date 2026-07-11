#!/bin/bash
# NeXify AI — agentmemory-Vollintegration (Audit + Fix + E2E-Beweis)
#
# Ausführen AUF DEM VPS (z. B. Hostinger-Web-Terminal):
#   bash infra/scripts/agentmemory-vollintegration.sh            # Audit (read-only)
#   bash infra/scripts/agentmemory-vollintegration.sh --apply    # Audit + Fixes + E2E
#
# Verdrahtet den agentmemory-Dienst (TCP :3113, REST :40000) über den Unified-MCP
# (:9200, Tools agentmemory_search/agentmemory_save) in ALLE Agenten-Consumer:
#   Hermes global + alle Profile · Paperclip-Container (HERMES_HOME=/paperclip/.hermes)
#   Goose · Claude Code · MimoCode
# und erbringt den E2E-Beweis (save → smart_search → Reconnect) gemäß der
# Beweispflicht-Regel (Bauvorschrift 3.1, fortsetzungs-prompt-optimiert.md).
#
# Idempotent. Audit-only per Default; ändert NUR mit --apply. Jede Änderung wird
# vorher nach /root/config-backups/<ts>-agentmemory/ gesichert. Druckt keine Secrets.
set -uo pipefail

APPLY=0; [ "${1:-}" = "--apply" ] && APPLY=1
TS=$(date +%Y%m%d-%H%M%S)
REPORT_DIR=/root/nexifyai-reports
REPORT="$REPORT_DIR/agentmemory-vollintegration-$TS.md"
BACKUP_DIR=/root/config-backups/$TS-agentmemory
mkdir -p "$REPORT_DIR"

PASS=0; FAIL=0; FIXED=0
say()  { echo -e "$*" | tee -a "$REPORT"; }
ok()   { PASS=$((PASS+1)); say "✅ $*"; }
bad()  { FAIL=$((FAIL+1)); say "❌ $*"; }
fixed(){ FIXED=$((FIXED+1)); say "🔧 FIXED: $*"; }
backup(){ mkdir -p "$BACKUP_DIR"; cp -a "$1" "$BACKUP_DIR/" 2>/dev/null; }

say "# agentmemory-Vollintegration — $TS (apply=$APPLY)"
say ""

# ─────────────────────────────────────────────────────────────────────────────
say "## Phase 0 — Dienst-Gesundheit"
systemctl is-active --quiet agentmemory.service \
  && ok "agentmemory.service aktiv" \
  || bad "agentmemory.service NICHT aktiv (systemctl status agentmemory.service)"

timeout 3 bash -c 'cat < /dev/null > /dev/tcp/127.0.0.1/3113' 2>/dev/null \
  && ok "TCP :3113 erreichbar" || bad "TCP :3113 nicht erreichbar"

curl -sf --max-time 5 http://127.0.0.1:40000/health >/dev/null \
  && ok "REST :40000/health OK" || bad "REST :40000/health FEHLT"

# Härtung aus Session-Fix 06.07. (cgroup-Throttling-Bug): Dropin + Watchdog
if systemctl cat agentmemory.service 2>/dev/null | grep -q "MemoryMax"; then
  ok "Memory-Dropin (memory-fix.conf) vorhanden"
else
  bad "Memory-Dropin fehlt — Risiko: D-State-Hänger bei MemoryHigh-Throttling"
  if [ $APPLY = 1 ]; then
    mkdir -p /etc/systemd/system/agentmemory.service.d
    printf '[Service]\nMemoryHigh=infinity\nMemoryMax=3G\n' \
      > /etc/systemd/system/agentmemory.service.d/memory-fix.conf
    systemctl daemon-reload && fixed "memory-fix.conf angelegt + daemon-reload"
  fi
fi
systemctl is-active --quiet agentmemory-watchdog.timer \
  && ok "agentmemory-watchdog.timer aktiv" \
  || bad "agentmemory-watchdog.timer NICHT aktiv (systemctl enable --now agentmemory-watchdog.timer)"

# Unified-MCP (:9200) — trägt die agentmemory-Tools für alle Agenten
curl -sf --max-time 5 http://127.0.0.1:9200/health >/dev/null 2>&1 \
  || curl -s --max-time 5 http://127.0.0.1:9200/ >/dev/null 2>&1 \
  && ok "Unified-MCP :9200 erreichbar" || bad "Unified-MCP :9200 nicht erreichbar"

MCP_SRC=$(grep -rl "agentmemory_save" /opt/nexify/mcp-servers/ /root/mcp-sse-unified.py 2>/dev/null | head -1)
if [ -n "${MCP_SRC:-}" ]; then
  ok "agentmemory_save-Tool im Unified-MCP: $MCP_SRC"
  grep -q "smart_search" "$MCP_SRC" \
    && ok "agentmemory_search nutzt smart_search-Route (Fix Teil 4 aktiv)" \
    || bad "agentmemory_search nutzt NICHT smart_search — alter 'offline'-Bug wieder da?"
else
  bad "Kein Unified-MCP-Quellcode mit agentmemory_save gefunden"
fi

# ─────────────────────────────────────────────────────────────────────────────
say ""
say "## Phase 1 — Consumer-Verdrahtung (MCP in jeder Agenten-Config)"

# 1a. Hermes global + alle Profile
for CFG in /root/.hermes/config.yaml /root/.hermes/profiles/*/config.yaml; do
  [ -f "$CFG" ] || continue
  python3 -c "import yaml,sys; yaml.safe_load(open('$CFG'))" 2>/dev/null \
    || { bad "$CFG: UNGÜLTIGES YAML (Zeilennummern-Korruption? vgl. Session-Fix Teil 2)"; continue; }
  if grep -qE "nexify.?unified|:9200" "$CFG"; then
    ok "$CFG: unified-MCP eingebunden"
  else
    bad "$CFG: unified-MCP FEHLT"
    if [ $APPLY = 1 ]; then
      backup "$CFG"
      python3 - "$CFG" <<'PY'
import sys, yaml
p = sys.argv[1]
d = yaml.safe_load(open(p)) or {}
srv = d.setdefault("mcp_servers", {})
if not any("9200" in str(v) for v in srv.values()):
    srv["nexify-unified"] = {"type": "sse", "url": "http://127.0.0.1:9200/sse"}
    yaml.safe_dump(d, open(p, "w"), allow_unicode=True, sort_keys=False)
    print("patched")
PY
      fixed "$CFG: nexify-unified (sse :9200) ergänzt"
    fi
  fi
done

# 1b. Paperclip-Container (eigener HERMES_HOME!)
if docker ps --format '{{.Names}}' | grep -q '^paperclip-nexify$'; then
  if docker exec paperclip-nexify sh -c 'grep -qE "nexify.?unified|172.25.0.1:9200" /paperclip/.hermes/config.yaml' 2>/dev/null; then
    ok "Paperclip-Container: unified-MCP eingebunden (Host-Gateway)"
  else
    bad "Paperclip-Container: unified-MCP FEHLT in /paperclip/.hermes/config.yaml"
    [ $APPLY = 1 ] && say "   ↳ manuell: im Container 172.25.0.1:9200 als sse-MCP ergänzen (Gateway-IP prüfen: docker network inspect)"
  fi
else
  bad "Container paperclip-nexify läuft nicht"
fi

# 1c. Goose — Config + Recipes (Platzhalter aus Masterplan-Paket 02 scharf schalten)
GOOSE_CFG=$(ls /root/.config/goose/config.yaml 2>/dev/null | head -1)
if [ -n "${GOOSE_CFG:-}" ]; then
  grep -qE "nexify_unified|:9200" "$GOOSE_CFG" \
    && ok "Goose: nexify_unified-Extension eingebunden" \
    || bad "Goose: nexify_unified-Extension fehlt in $GOOSE_CFG"
  for R in /root/.config/goose/recipes/*.yaml; do
    [ -f "$R" ] || continue
    if grep -qiE "agentenmemory|agentmemory" "$R" && grep -qE "PLATZHALTER|placeholder|TODO" "$R"; then
      bad "$R: Agentenmemory-Endpunkt noch Platzhalter"
      if [ $APPLY = 1 ]; then
        backup "$R"
        sed -i -E 's#(url:[[:space:]]*)(PLATZHALTER|<[^>]*placeholder[^>]*>|TODO[^[:space:]]*)#\1http://127.0.0.1:9200/sse#I' "$R"
        fixed "$R: Endpunkt → http://127.0.0.1:9200/sse (goose recipe validate ausführen!)"
      fi
    fi
  done
fi

# 1d. Claude Code + MimoCode
grep -qE "nexify-unified|:9200" /root/.claude.json 2>/dev/null \
  && ok "Claude Code: nexify-unified MCP registriert" \
  || bad "Claude Code: nexify-unified fehlt in /root/.claude.json"
grep -qE "nexify|:9200" /root/.config/mimocode/mimocode.jsonc 2>/dev/null \
  && ok "MimoCode: MCP registriert" \
  || bad "MimoCode: MCP-Eintrag fehlt"

# 1e. MEMORY-PROTOKOLL in SOULs/AGENTS.md
say ""
say "### MEMORY-PROTOKOLL-Abdeckung (Pflichtblock in jeder Agenten-Seele)"
MISS=0
for F in /root/.hermes/profiles/*/SOUL.md \
         /var/lib/docker/volumes/paperclip-data/_data/instances/default/companies/*/agents/*/instructions/AGENTS.md; do
  [ -f "$F" ] || continue
  grep -q "MEMORY-PROTOKOLL" "$F" || { MISS=$((MISS+1)); say "   ❌ fehlt: $F"; }
done
[ $MISS = 0 ] && ok "MEMORY-PROTOKOLL in allen gefundenen SOULs/AGENTS.md" \
             || bad "$MISS Datei(en) ohne MEMORY-PROTOKOLL-Block"

# ─────────────────────────────────────────────────────────────────────────────
say ""
say "## Phase 2 — E2E-Beweis (nur mit --apply; schreibt einen Testeintrag)"
if [ $APPLY = 1 ]; then
  KEY="e2e-proof-$TS"
  W=$(curl -sf --max-time 10 -X POST http://127.0.0.1:40000/agentmemory/save \
      -H 'Content-Type: application/json' \
      -d "{\"key\":\"$KEY\",\"content\":\"agentmemory-vollintegration E2E $TS\",\"category\":\"selftest\"}" 2>&1)
  if [ $? -eq 0 ]; then
    ok "WRITE über REST :40000 OK (key=$KEY)"
    R=$(curl -sf --max-time 10 -X POST http://127.0.0.1:40000/agentmemory/smart_search \
        -H 'Content-Type: application/json' -d "{\"query\":\"$KEY\"}" 2>&1)
    echo "$R" | grep -q "$KEY" \
      && ok "READ-BACK über smart_search OK — Beweis erbracht" \
      || bad "READ-BACK fand key nicht (Indexierungs-Delay? erneut prüfen: curl smart_search '$KEY')"
  else
    bad "WRITE fehlgeschlagen — Routen prüfen: curl http://127.0.0.1:40000/ (API-Doku des Dienstes)"
  fi
  # Reconnect-Test (Bauvorschrift 3.1): Dienst neu starten, Erreichbarkeit binnen 30s
  say "→ Reconnect-Test: restart agentmemory.service"
  systemctl restart agentmemory.service
  RECOVERED=0
  for i in $(seq 1 30); do
    curl -sf --max-time 2 http://127.0.0.1:40000/health >/dev/null && { RECOVERED=$i; break; }
    sleep 1
  done
  [ $RECOVERED -gt 0 ] && ok "Reconnect nach Restart in ${RECOVERED}s" \
                       || bad "Dienst nach Restart >30s nicht wieder healthy"
else
  say "(übersprungen — Audit-Modus. Mit --apply ausführen für Beweis.)"
fi

# ─────────────────────────────────────────────────────────────────────────────
say ""
say "## Ergebnis: $PASS OK · $FAIL offen · $FIXED gefixt"
say "Report: $REPORT"
[ -d "$BACKUP_DIR" ] && say "Backups: $BACKUP_DIR"
[ $FAIL = 0 ] && exit 0 || exit 1
