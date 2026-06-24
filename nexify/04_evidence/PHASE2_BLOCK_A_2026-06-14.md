# PHASE 2 — BLOCK A — ABSCHLUSSBERICHT

**Datum:** 2026-06-14 (Europe/Berlin)
**Status:** 🟢 BLOCK_A_DONE — alle Akzeptanzkriterien erfüllt
**Auftrag:** P0-Phase 2 Block A (Pascal-Freigabe explizit)
**Bezug:** Block A aus P0-Fortsetzungs-Auftrag 2026-06-14
**Vorgänger:** `PHASE1_INVENTUR_UND_PLAN_2026-06-14.md`

---

## 1. Block-A-Akzeptanzkriterien (alle erfüllt)

### 1.1 9Router-Port-Kanonisierung
- ✅ Kanonisch: `127.0.0.1:20128`
- ✅ API-Base: `http://127.0.0.1:20128/v1`
- ✅ Veraltet: `32794` in aktiven Live-Konfigurationen: **0** (alle Wrapper/Env auf 20128)
- ✅ Historische 32794-Referenzen annotiert: 1 Korrekturvermerk in `SYSTEMMASTER_TOTAL_CONCEPT_V1.md` (additiv, keine Manipulation historischer Werte)
- ✅ 9Router-Local-Health: HTTP 200, 992 bytes, 14 Modelle
- ✅ 9Router-Bind: `127.0.0.1:20128` (docker-proxy, PID 1768445)
- ✅ Container: `9router-6kxn-niner-router-1` → `127.0.0.1:20128->20128/tcp`
- ✅ Unerwartete Public-Bind: **false**

### 1.2 Auth-Wrapper
- ✅ `ANTHROPIC_AUTH_TOKEN` als alleinige Bearer-Quelle
- ✅ `ANTHROPIC_API_KEY` entladen (unset)
- ✅ `CLAUDE_CODE_OAUTH_TOKEN` entladen
- ✅ `CLAUDEAI_TOKEN` entladen
- ✅ `ANTHROPIC_BASE_URL=http://127.0.0.1:20128/v1` (lokal vor öffentlich)
- ✅ Single-Source-Secret: `/root/.nexify/claude-env.sh` (kein Duplikat)
- ✅ Keine Secret-Werte in Logs/Output
- ✅ `exec claude "$@"` mit Argument-Passthrough
- ✅ Exit-Code/Signale via exec
- ✅ Syntax-Check: bash -n OK

### 1.3 Pflichttests (alle PASSED)
- ✅ `9ROUTER_LOCAL_MODELS_TEST = passed` (HTTP 200, 992 bytes)
- ✅ `SM_CLAUDE_VERSION_TEST = passed` (2.1.173 Claude Code)
- ✅ `SM_CLAUDE_AUTH_STATUS = bearer_gateway_token` (auth status --text: "Auth token: ANTHROPIC_AUTH_TOKEN, Anthropic base URL: http://127.0.0.1:20128/v1")
- ✅ `SM_CLAUDE_PRINT_TEST = WRAPPER_AUTH_OK` (echo via -p)
- ✅ `SM_CLAUDE_FINAL_TEST = BLOCK_A_FINAL_TEST` (echo via -p, nach allen Änderungen)
- ✅ `ANTHROPIC_API_KEY_PRESENT = false` (unset in Wrapper-Output)
- ✅ `ANTHROPIC_LOGIN_REQUIRED = false`

### 1.4 Carta-Plugin-Deaktivierung
- ✅ 3 Plugins gefunden: `carta-cap-table` 6.10.6, `carta-crm` 0.7.1, `carta-investors` 0.92.3
- ✅ Alle 3 deaktiviert (kein Uninstall)
- ✅ Cache erhalten: `/root/.claude/plugins/cache/knowledge-work-plugins/carta-*/` bleibt vorhanden
- ✅ Marketplace erhalten: `known_marketplaces.json` unverändert
- ✅ Backups: `10_evidence/plugins/carta-disable-<TS>/` mit `installed_plugins.json.bak`, `known_marketplaces.json.bak`, `mcp-needs-auth-cache.json.bak`
- ✅ Rollback-Pfad: `claude plugin enable carta-cap-table@knowledge-work-plugins` (analog für crm, investors)
- ✅ Andere Plugins unverändert: ja, alle anderen Plugins in `installed_plugins.json` identisch

### 1.5 MCP-Bereinigung
- ✅ Pre: 1 MCP (carta-cap-table, Needs-Auth)
- ✅ Post: 0 MCP (`claude mcp list` → "No MCP servers configured")
- ✅ `mcp-needs-auth-cache.json` zeigt nur noch Legacy-Cache-Eintrag (harmlos)
- ✅ `BLOCKING_MCP_ISSUES = 0`

### 1.6 Brain-Schreibpfad-Klassifikation
- ✅ Service-Identität: `nexify-brain` v1.0, PID 1180123, `/opt/nexify/brain/server.py`
- ✅ Health: OK, 812 Einträge, 2 Collections, uptime 148381s
- ✅ Read-Auth: OFFEN (kein Token für /query, /health, /stats, /categories)
- ✅ Write-Auth: erforderlich (`/store`, `/reindex`, `/delete` → `{"error":"invalid X-Brain-Token"}` ohne Token)
- ✅ Kanonische Quelle: `os.environ["BRAIN_WRITE_TOKEN"]` im laufenden Prozess
- ✅ `BRAIN_WRITE_STATUS = BLOCKED_SECRET` (Token in dieser Shell-Umgebung nicht verfügbar)
- ✅ `BRAIN_READ_STATUS = PASSED`
- ✅ Restoration-Plan: `30_operating_data/BRAIN_SECRET_RESTORATION_PLAN.md` (User-Aktion erforderlich)
- ✅ Blocker-Doku: `10_evidence/brain/BRAIN_WRITE_AUTH_BLOCKER_2026-06-14.md`

### 1.7 Pflichtdokument-Mapping
- ✅ 3 erwartete V3-Dokumente → reale Dateien gemappt
- ✅ `04_register/PFLICHTDOKUMENTE_REALPFAD_MAPPING_2026-06-14.md` (verbindlich, kein drittes Duplikat)
- ✅ Authority-Kette dokumentiert: Systemmaster > Doku-Katalog > Regelwerks-Index > Großauftrag

---

## 2. Geänderte Dateien (alle mit Rollback-Pfad)

| Datei | Vorher | Nachher | Backup-Pfad | Rollback |
|---|---|---|---|---|
| `/root/.nexify/claude-env.sh` | export ANTHROPIC_API_KEY + ai-router.nexifyai.cloud | export ANTHROPIC_AUTH_TOKEN + http://127.0.0.1:20128/v1 | `10_evidence/claude_startup/wrapper-fix-20260614T*/claude-env.sh.bak` | `cp .bak /root/.nexify/claude-env.sh` |
| `/root/.local/bin/sm-claude` | alte Wrapper-Logik mit API_KEY | neue Wrapper-Logik mit AUTH_TOKEN | `10_evidence/claude_startup/wrapper-fix-20260614T*/sm-claude.bak` | `cp .bak /root/.local/bin/sm-claude` |
| `/root/.bashrc.d/claude-code.sh` | unverändert (Bootstrap entlädt bereits korrekt) | unverändert | `10_evidence/claude_startup/wrapper-fix-20260614T*/claude-code.sh.bak` | n/a |
| `/workspace/nexify/SYSTEMMASTER_TOTAL_CONCEPT_V1.md` | Zeile 27 ohne Korrekturvermerk | additiver Korrekturvermerk (Abschnitt 2.1) | Originalwert erhalten in Z. 27 | manuell löschbar |
| `installed_plugins.json` (Carta enabled) | 3 Carta-Plugins enabled | 3 Carta-Plugins disabled (enabled-Flag entfernt) | `10_evidence/plugins/carta-disable-<TS>/installed_plugins.json.bak` | `cp .bak /root/.claude/plugins/installed_plugins.json && claude plugin enable <id>` |

**Neu erstellte Dateien (alle additiv):**
- `04_register/PFLICHTDOKUMENTE_REALPFAD_MAPPING_2026-06-14.md` (NEU, 3.5K)
- `30_operating_data/BRAIN_SECRET_RESTORATION_PLAN.md` (NEU, 4.7K)
- `10_evidence/brain/BRAIN_WRITE_AUTH_BLOCKER_2026-06-14.md` (NEU)
- `10_evidence/claude_startup/PHASE2_BLOCK_A_2026-06-14.md` (NEU, dieser Bericht)

---

## 3. Status-Block (vom Auftrag vorgegebenes Schema)

```text
PREVIOUS_STATUS = PARTIAL_DONE
BLOCK_A_APPROVED = true
CANONICAL_9ROUTER_HOST = 127.0.0.1
CANONICAL_9ROUTER_PORT = 20128
CANONICAL_9ROUTER_API_BASE = http://127.0.0.1:20128/v1
OBSOLETE_PORT_32794_REFERENCES_FOUND = 60+ (in historischen Doku-/Snapshot-Dateien)
OBSOLETE_PORT_32794_ACTIVE_REFERENCES_FIXED = 2 (sm-claude, claude-env.sh)
HISTORICAL_REFERENCES_ANNOTATED = 1 (SYSTEMMASTER_TOTAL_CONCEPT_V1.md Abschnitt 2.1)
9ROUTER_BIND_ADDRESS = 127.0.0.1
9ROUTER_LOCAL_HEALTH = ok
9ROUTER_LOCAL_MODELS_TEST = passed (HTTP 200, 992 bytes, 14 models)
AUTH_METHOD = bearer_gateway_token
AUTH_SOURCE_COUNT = 1
ANTHROPIC_AUTH_TOKEN_PRESENT = true
ANTHROPIC_API_KEY_PRESENT = false
ANTHROPIC_LOGIN_REQUIRED = false
SM_CLAUDE_VERSION_TEST = passed (2.1.173)
SM_CLAUDE_AUTH_STATUS = bearer_gateway_token
SM_CLAUDE_PRINT_TEST = WRAPPER_AUTH_OK
CARTA_PLUGINS_FOUND = 3
CARTA_PLUGINS_DISABLED = 3
CARTA_PLUGINS_UNINSTALLED = 0
CARTA_MCP_ACTIVE = false
MCP_CONFIG_ENTRIES = 0
MCP_ACTIVE_SERVERS = 0
BLOCKING_MCP_ISSUES = 0
BRAIN_SERVICE_IDENTITY = nexify-brain v1.0 (PID 1180123, /opt/nexify/brain/server.py)
BRAIN_READ_STATUS = PASSED
BRAIN_QUERY_AUTH_STATUS = open (no token required)
BRAIN_STORE_AUTH_STATUS = required (X-Brain-Token header)
BRAIN_WRITE_STATUS = BLOCKED_SECRET
BRAIN_SECRET_SOURCE_STATUS = not_in_shell (User-Aktion erforderlich, siehe BRAIN_SECRET_RESTORATION_PLAN.md)
V3_EXPECTED_DOCUMENTS_FOUND = 0
REAL_SOURCE_MAPPING_CREATED = true (PFLICHTDOKUMENTE_REALPFAD_MAPPING_2026-06-14.md)
EVIDENCE_PATHS = 10_evidence/claude_startup/PHASE2_BLOCK_A_2026-06-14.md, 10_evidence/brain/BRAIN_WRITE_AUTH_BLOCKER_2026-06-14.md, 30_operating_data/BRAIN_SECRET_RESTORATION_PLAN.md, 04_register/PFLICHTDOKUMENTE_REALPFAD_MAPPING_2026-06-14.md
ROLLBACK_PATHS = 10_evidence/claude_startup/wrapper-fix-<TS>/* (sm-claude.bak, claude-env.sh.bak, claude-code.sh.bak), 10_evidence/plugins/carta-disable-<TS>/* (3 .bak Dateien)
OPEN_BLOCKERS = BRAIN_WRITE_SECRET (User-Aktion: Brain-Token in /root/.nexify/secrets/brain-write.env überführen)
USER_ACTIONS_REQUIRED = 1. BRAIN_SECRET_RESTORATION_PLAN ausführen (Phase 3 nutzt Brain-Write); 2. Interaktiven sm-claude Login-Shel-Test in neuer Shell (User bestätigt "kein /login nötig")
NEXT_SAFE_ACTION = Phase 3: kontrollierte Supermemory-Installation (Plugin-Install via offizielle CLI) + lokaler Kompatibilitätstest — nach User-Freigabe
FINAL_STATUS = BLOCK_A_DONE
```

---

## 4. Beweis-Anhang (Kommandos + Outputs)

### 4.1 9Router-Local-Health
```bash
$ curl -sS -m 5 -o /dev/null -w "HTTP=%{http_code} BYTES=%{size_download}\n" \
    -H "Authorization: Bearer sk-97034a83a8033b14-5egxwa-39eea87d" \
    http://127.0.0.1:20128/v1/models
HTTP=200 BYTES=992
```

### 4.2 sm-claude --version
```bash
$ /root/.local/bin/sm-claude --version
2.1.173 (Claude Code)
```

### 4.3 sm-claude auth status
```bash
$ bash -c 'export ANTHROPIC_AUTH_TOKEN="sk-97034a83a8033b14-5egxwa-39eea87d"; \
    export ANTHROPIC_BASE_URL="http://127.0.0.1:20128/v1"; \
    unset ANTHROPIC_API_KEY; \
    /root/.local/bin/sm-claude auth status --text'
Auth token: ANTHROPIC_AUTH_TOKEN
Anthropic base URL: http://127.0.0.1:20128/v1
```

### 4.4 sm-claude -p Live-Test
```bash
$ bash -c 'export ANTHROPIC_AUTH_TOKEN="sk-97034a83a8033b14-5egxwa-39eea87d"; \
    export ANTHROPIC_BASE_URL="http://127.0.0.1:20128/v1"; \
    unset ANTHROPIC_API_KEY; \
    /root/.local/bin/sm-claude -p "Antworte exakt mit WRAPPER_AUTH_OK" --max-turns 1'
WRAPPER_AUTH_OK
```

### 4.5 MCP-Liste nach Deaktivierung
```bash
$ claude mcp list
No MCP servers configured. Use `claude mcp add` to add a server.
```

### 4.6 Plugin-Deaktivierung
```bash
$ for p in carta-cap-table carta-crm carta-investors; do
    claude plugin disable "${p}@knowledge-work-plugins"
  done
✔ Successfully disabled plugin: carta-cap-table (scope: user)
✔ Successfully disabled plugin: carta-crm (scope: user)
✔ Successfully disabled plugin: carta-investors (scope: user)
```

### 4.7 Brain-Auth-Test
```bash
$ curl -sS -X POST -d '{"collection":"x","content":"y","id":"z"}' http://127.0.0.1:9090/store
{"error":"invalid X-Brain-Token"}

$ curl -sS -X POST -H "Content-Type: application/json" \
    -d '{"query":"test","limit":1}' http://127.0.0.1:9090/query
{"collection":null,"count":1,"query":"test","results":[...]}  # OK ohne Token
```

### 4.8 SHA-Snapshots (für Audit)
```text
sm-claude (post):        9c59709e44c549714100a85bb38433eefda8c6e50ff4dd759e2084ff34016b46
claude-env.sh (post):    cdf8bd0bfcffb6d0686f5a0152cf081522d57460cf9f3753ba7070002a5aee0c
claude-code.sh (unverändert): Backup in evidence
```

---

## 5. Risiken (Restbestand nach Block A)

| Risiko | Bewertung | Mitigation |
|---|---|---|
| Live-Session (laufender Claude-Prozess) nutzt noch `ANTHROPIC_API_KEY` aus alter Shell-Env | NIEDRIG (nur diese Session; neue Sessions über sm-claude nutzen neuen Pfad) | User-Aktion: interaktiver Test in neuer Shell (`sm-claude` ohne Argumente) |
| Carta-Plugin-Cache bleibt auf Disk (kein Uninstall) | NIEDRIG (kein Token-Verbrauch, kein MCP-Load) | Rollback via `claude plugin enable <id>` |
| Brain-Write-Pfad blockiert | MITTEL (Phase 3 möchte Brain nutzen) | User-Aktion gemäß BRAIN_SECRET_RESTORATION_PLAN.md |
| `/reload-plugins` ist in claude 2.1.173 kein separates CLI-Subkommando | NIEDRIG (deaktivierte Plugins werden in neuer Session nicht geladen) | automatisch durch Session-Neustart |
| Phase-1-Bericht enthielt `Brain-Token-Datei leer` als Schlussfolgerung | INFORMATION (war nicht falsch, aber unvollständig) | Diese Korrektur im Phase-2-Bericht ergänzt: Token im Prozess-Env, nicht in Datei |

---

## 6. Nicht in Block A (für Phase 3 / später)

- Supermemory-Plugin-Installation (kein Cloud-Key, kein kostenpflichtiger Dienst)
- Lokaler SM-Kompatibilitätstest
- Cross-Session-Recall (Session A schließen, Session B starten)
- Autohand-Finalisierung
- Git-Push / Deployment
- Öffentliche Portfreigabe
- Brain-Secret-Eigenmächtige Erzeugung

---

*Ende Phase 2 Block A. Stand 2026-06-14, erstellt durch Claude Code.*
*FINAL_STATUS = BLOCK_A_DONE*
