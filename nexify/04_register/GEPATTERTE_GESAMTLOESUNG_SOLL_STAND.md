---
ralph_loop_file: true
file_type: agentic_ai_plan
title: NeXify AI OS — Gepatterte Gesamtlösung (SOLL-Stand)
version: 1.0.0
date: 2026-06-22
status: VERBINDLICH
priority: P0
owner: NeXify CEO (nexify-ceo)
execution_mode: agentic_ai_orchestration
---

# NeXify AI OS — Gepatterte Gesamtlösung

> **Prinzip:** Jede Komponente wird als eigenständiges, ausfallsicheres Pattern definiert.
> Keine Abhängigkeiten ohne Fallback. Keine Single-Points-of-Failure.

---

## 0. Gesamtarchitektur (SOLL)

```
┌─────────────────────────────────────────────────────────────────┐
│                    NEXIFY AI OS — SOLL-ARCHITEKTUR              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │  MONITORING   │    │   BACKUP     │    │   ALERTING   │      │
│  │  Prometheus   │    │   restic     │    │   Alertmgr   │      │
│  │  + Grafana    │    │   + Timer    │    │   + PagerDuty│      │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘      │
│         │                   │                   │               │
│  ┌──────▼───────────────────▼───────────────────▼───────┐      │
│  │                 OPERATOR SHELL (Hermes WebUI)         │      │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐│      │
│  │  │  Aufgaben │ │  Kanban  │ │  Skills  │ │  Profile ││      │
│  │  │  (I01)   │ │  (I02)   │ │  (I03)   │ │  (I05)   ││      │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘│      │
│  └──────────────────────┬───────────────────────────────┘      │
│                         │                                       │
│  ┌──────────────────────▼───────────────────────────────┐      │
│  │                 MEMORY & KNOWLEDGE                    │      │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐│      │
│  │  │  Brain   │ │  Qdrant  │ │  Agent   │ │  RAGFlow ││      │
│  │  │  :9090   │ │  :6333   │ │  Memory  │ │  (opt.)  ││      │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘│      │
│  └──────────────────────┬───────────────────────────────┘      │
│                         │                                       │
│  ┌──────────────────────▼───────────────────────────────┐      │
│  │                 9ROUTER (KI-ROUTER)                   │      │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐│      │
│  │  │  DeepSeek │ │  Baseten │ │  Vercel  │ │  Combo   ││      │
│  │  │  (6 Mod.)│ │  (11 Mod.)│ │  (1 Mod.)│ │  LLM    ││      │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘│      │
│  └──────────────────────┬───────────────────────────────┘      │
│                         │                                       │
│  ┌──────────────────────▼───────────────────────────────┐      │
│  │                 PAPERCLIP / KI-FABRIK                 │      │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐│      │
│  │  │  CEO     │ │  Worker  │ │  Adapter │ │  Queue   ││      │
│  │  │  Agent   │ │  Agents  │ │  v1.0    │ │  (Redis) ││      │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘│      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. Pattern: MONITORING (P0 — Tag 1-2)

### 1.1 SOLL-Zustand

| Komponente | Tool | Port | Metrik | Alert |
|------------|------|------|--------|-------|
| **Prometheus** | Docker | 9090 | Alle Scrape-Targets | Disk > 80%, CPU > 90% |
| **node_exporter** | systemd | 9100 | CPU, RAM, Disk, Net | Host-Metriken |
| **Grafana** | Docker | 3000 | Dashboards | Visuelle Alerts |
| **Alertmanager** | Docker | 9093 | Alert-Routing | PagerDuty/Slack |
| **blackbox_exporter** | Docker | 9115 | HTTP-Health | Service-Down |
| **9Router-Exporter** | Skript | 9180 | LLM-Latenz, Error | combo-llm down |

### 1.2 Implementierung (Pattern)

```bash
# Pattern: docker-compose.monitoring.yml
# Alle Monitoring-Services in EINER Datei
# Keine externen Dependencies
# Backup der docker-compose.yml vor jeder Änderung

services:
  prometheus:
    image: prom/prometheus:latest
    ports: ["9090:9090"]
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    restart: unless-stopped

  grafana:
    image: grafana/grafana:latest
    ports: ["3000:3000"]
    volumes:
      - grafana_data:/var/lib/grafana
    restart: unless-stopped

  alertmanager:
    image: prom/alertmanager:latest
    ports: ["9093:9093"]
    restart: unless-stopped

  blackbox:
    image: prom/blackbox-exporter:latest
    ports: ["9115:9115"]
    restart: unless-stopped
```

### 1.3 Scrape-Config (prometheus.yml)

```yaml
global:
  scrape_interval: 30s
  evaluation_interval: 30s

scrape_configs:
  - job_name: 'node'
    static_configs:
      - targets: ['host.docker.internal:9100']

  - job_name: 'brain'
    metrics_path: /health
    static_configs:
      - targets: ['host.docker.internal:9090']

  - job_name: '9router'
    metrics_path: /v1/health
    static_configs:
      - targets: ['host.docker.internal:20128']

  - job_name: 'blackbox-http'
    metrics_path: /probe
    params:
      module: [http_2xx]
    static_configs:
      - targets:
        - https://brain.nexifyai.cloud
        - https://agentmemory.nexifyai.cloud
        - https://ai-router.nexifyai.cloud
```

### 1.4 Grafana-Dashboard (JSON)

```json
{
  "dashboard": {
    "title": "NeXify AI OS — Health",
    "panels": [
      {"title": "Brain API", "type": "stat", "targets": [{"expr": "probe_success{job='blackbox-http',target='brain'}"}]},
      {"title": "9Router", "type": "stat", "targets": [{"expr": "probe_success{job='blackbox-http',target='9router'}"}]},
      {"title": "CPU", "type": "gauge", "targets": [{"expr": "100 - (avg(rate(node_cpu_seconds_total{mode='idle'}[5m])) * 100)"}]},
      {"title": "RAM", "type": "gauge", "targets": [{"expr": "(1 - node_memory_MemAvailable_bytes/node_memory_MemTotal_bytes) * 100"}]},
      {"title": "Disk", "type": "gauge", "targets": [{"expr": "(1 - node_filesystem_avail_bytes{mountpoint='/'} / node_filesystem_size_bytes{mountpoint='/'}) * 100"}]}
    ]
  }
}
```

---

## 2. Pattern: BACKUP (P0 — Tag 1-2)

### 2.1 SOLL-Zustand

| Datenquelle | Intervall | Tool | Ziel | Aufbewahrung |
|-------------|-----------|------|------|--------------|
| Brain JSON-Dump | Täglich 03:00 | restic | /backup/brain | 30 Tage |
| Qdrant Snapshot | Täglich 03:15 | restic | /backup/qdrant | 30 Tage |
| agentmemory SQLite | Täglich 03:30 | restic | /backup/agentmemory | 30 Tage |
| PostgreSQL | Täglich 03:45 | pg_dump + restic | /backup/postgres | 30 Tage |
| 9Router DB | Täglich 04:00 | restic | /backup/9router | 30 Tage |
| Hermes-Skills | Wöchentlich | restic | /backup/hermes | 90 Tage |
| /workspace/nexify | Täglich 04:30 | git push + restic | /backup/workspace | 30 Tage |
| Offsite (R2/S3) | Täglich 05:00 | restic | rclone | 90 Tage |

### 2.2 Implementierung (Pattern)

```bash
#!/bin/bash
# /opt/nexify/backup/backup.sh
# Pattern: Vollständiges Backup-Skript

set -euo pipefail

BACKUP_ROOT="/opt/nexify/backup/data"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG="/opt/nexify/backup/logs/backup_${TIMESTAMP}.log"

log() { echo "[$(date +%H:%M:%S)] $1" | tee -a "$LOG"; }

# 1. Brain Dump
log "Starting Brain backup..."
curl -s http://localhost:9090/api/export > "${BACKUP_ROOT}/brain_${TIMESTAMP}.json"
log "Brain backup: $(du -h ${BACKUP_ROOT}/brain_${TIMESTAMP}.json | cut -f1)"

# 2. Qdrant Snapshot
log "Starting Qdrant backup..."
curl -s -X POST http://localhost:6333/collections/brain/snapshot > "${BACKUP_ROOT}/qdrant_${TIMESTAMP}.json"
log "Qdrant snapshot triggered"

# 3. agentmemory
log "Starting agentmemory backup..."
cp /opt/agentmemory/data/agentmemory.db "${BACKUP_ROOT}/agentmemory_${TIMESTAMP}.db"
log "agentmemory backup: $(du -h ${BACKUP_ROOT}/agentmemory_${TIMESTAMP}.db | cut -f1)"

# 4. PostgreSQL (Supabase)
log "Starting PostgreSQL backup..."
PGPASSWORD=$(cat /root/.nexify/secrets/supabase_password) pg_dump -h localhost -p 5432 -U postgres > "${BACKUP_ROOT}/postgres_${TIMESTAMP}.sql"
log "PostgreSQL backup: $(du -h ${BACKUP_ROOT}/postgres_${TIMESTAMP}.sql | cut -f1)"

# 5. 9Router DB
log "Starting 9Router backup..."
cp /opt/9router/data/db/data.sqlite "${BACKUP_ROOT}/9router_${TIMESTAMP}.sqlite"
log "9Router backup: $(du -h ${BACKUP_ROOT}/9router_${TIMESTAMP}.sqlite | cut -f1)"

# 6. Cleanup (keep last 30 days)
find "${BACKUP_ROOT}" -mtime +30 -delete
log "Cleanup complete"

log "Backup finished successfully"
```

### 2.3 systemd-Timer

```ini
# /etc/systemd/system/nexify-backup.timer
[Unit]
Description=NeXify AI OS Daily Backup

[Timer]
OnCalendar=*-*-* 03:00:00
Persistent=true

[Install]
WantedBy=timers.target
```

---

## 3. Pattern: OPERATOR SHELL UI-REPAIR (P1 — Tag 3-4)

### 3.1 SOLL-Zustand

| Issue | Symptom | Root Cause | Fix-Pattern |
|-------|---------|------------|-------------|
| **I01** | Aufgaben: Internal Server Error | API-Endpoint fehlt/defekt | Backend-Check + API-Fix |
| **I02** | Kanban: "No Kanban data" | Kanban-DB nicht initialisiert | DB-Init + Resttext-Replace |
| **I03** | Skills: Detailansicht leer | Selection Handler defekt | UI-State-Check + Handler-Fix |
| **I05** | Profile: Detailansicht leer | Selection Handler defekt | UI-State-Check + Handler-Fix |
| **I06** | Stats: LLM Wiki unavailable | Wiki-Path nicht konfiguriert | Config-Set + Restart |
| **I08** | Workspaces: Keine Trennung | Workspace-Config fehlt | Workspace-Definition |

### 3.2 Implementierung (Pattern)

```bash
# Pattern: UI-Repair-Checkliste

# 1. I01 — Aufgaben API prüfen
curl -s http://localhost:8787/api/tasks | head -20
# Erwartung: JSON-Array oder Empty-Array
# Fehler: 500 → Backend-Logs prüfen

# 2. I02 — Kanban-DB initialisieren
curl -s http://localhost:8787/api/kanban/boards | head -20
# Erwartung: Board-Liste
# Fehler: "No Kanban data" → DB-Init

# 3. I03/I05 — Skills/Profile API prüfen
curl -s http://localhost:8787/api/skills | head -20
curl -s http://localhost:8787/api/profiles | head -20
# Erwartung: JSON-Liste
# Fehler: Empty → Selection Handler prüfen

# 4. I06 — LLM Wiki konfigurieren
hermes config set skills.config.wiki.path /opt/nexify/wiki --profile agentur-admin
```

---

## 4. Pattern: 9ROUTER HÄRTUNG (P1 — Tag 3-4)

### 4.1 SOLL-Zustand

| Aspekt | SOLL | IST | Gap |
|--------|------|-----|-----|
| **Modelle** | 19 (aktuell) + dynamisch | ✅ 19 aktiv | — |
| **Combo-LLM** | DS-V4-Flash + DS-Reasoner | ✅ Round-Robin | — |
| **Caveman** | full | ✅ full | — |
| **RTK** | aktiv | ✅ aktiv | — |
| **Headroom** | localhost:8787 | ✅ Hermes Gateway | — |
| **Backup** | Täglich | ❌ Kein Backup | 🔴 |
| **Monitoring** | Prometheus-Exporter | ❌ Nicht existent | 🔴 |
| **Staging** | Separat | ❌ Nicht existent | 🔴 |
| **Health-Check** | /v1/health | ❌ Kein Endpoint | 🟡 |

### 4.2 Implementierung (Pattern)

```bash
# Pattern: 9Router-Health-Check-Skript

#!/bin/bash
# /opt/nexify/monitoring/check-9router.sh

set -euo pipefail

API_KEY=$(cat /root/.nexify/secrets/9router_api_key)
BASE_URL="http://localhost:20128/v1"

# 1. Models-Endpoint
MODELS=$(curl -s "${BASE_URL}/models" -H "Authorization: Bearer ${API_KEY}" | jq '.data | length')
if [ "$MODELS" -lt 10 ]; then
    echo "CRITICAL: Only ${MODELS} models available (expected 19+)"
    exit 2
fi

# 2. Combo-LLM-Test
RESPONSE=$(curl -s -X POST "${BASE_URL}/chat/completions" \
  -H "Authorization: Bearer ${API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"model": "nexifyai-combo-llm", "messages": [{"role": "user", "content": "ping"}], "max_tokens": 5}' \
  | jq -r '.choices[0].message.content // "ERROR"')

if [ "$RESPONSE" = "ERROR" ] || [ -z "$RESPONSE" ]; then
    echo "CRITICAL: combo-llm not responding"
    exit 2
fi

echo "OK: ${MODELS} models, combo-llm responding"
exit 0
```

---

## 5. Pattern: PAPERCLIP RUNTIME (P2 — Tag 5-7)

### 5.1 SOLL-Zustand

| Komponente | SOLL | IST | Gap |
|------------|------|-----|-----|
| **Container** | Laufend, produktiv | ❌ Created/0 | 🔴 |
| **CEO-Agent** | Stable | ❌ Crashed nach 1s | 🔴 |
| **9Router-Connect** | LLM über 9Router | ❌ Kein Connect | 🔴 |
| **Adapter v1.0** | npm publiziert | ⚠️ v0.3.0 | 🟡 |
| **Tests** | 40+ Tests, 80% Coverage | ❌ 0 Tests | 🔴 |
| **CI/CD** | GitHub Actions | ❌ Nicht existent | 🔴 |

### 5.2 Root Cause (CEO-Agent Crash)

```
CEO-Agent crashed nach 1s:
→ Kein LLM-Connect (fehlende 9Router-Konfiguration)
→ Paperclip-Umgebung hat keine API_KEY
→ Kein BASE_URL gesetzt
→ Container-Netzwerk isoliert (kein Zugriff auf Host-Dienste)
```

### 5.3 Implementierung (Pattern)

```bash
# Pattern: Paperclip-9Router-Integration

# 1. API-Key injizieren
docker exec -e NEXIFY_API_KEY=$(cat /root/.nexify/secrets/9router_api_key) \
  -e NEXIFY_BASE_URL=http://host.docker.internal:20128/v1 \
  paperclip-krv8 ...

# 2. Docker-Netzwerk verbinden
docker network connect 9router-6kxn_default paperclip-krv8

# 3. Health-Check
docker exec paperclip-krv8 curl -s \
  -H "Authorization: Bearer ${NEXIFY_API_KEY}" \
  "${NEXIFY_BASE_URL}/models" | jq '.data | length'
```

---

## 6. Pattern: MEMORY FORMAT-DRIFT (P2 — Tag 5)

### 6.1 SOLL-Zustand

| Aspekt | SOLL | IST | Gap |
|--------|------|-----|-----|
| **MEMORY.md** | Hermes-kompatibel | ❌ Format-Drift | 🔴 |
| **Brain Write** | Funktioniert | ❌ Key fehlt | 🔴 |
| **agentmemory Write** | Funktioniert | ⚠️ Unklar | 🟡 |

### 6.2 Implementierung (Pattern)

```bash
# Pattern: MEMORY.md Migration

# 1. Aktuelles Format analysieren
head -50 /workspace/nexify/memory/BENUTZERPROFIL_*.md

# 2. Hermes-kompatibles Format
# Erwartet: YAML-Frontmatter + Markdown-Body
# Beispiel:
---
ralph_loop_file: true
file_type: memory_profile
memory_area: benutzerprofil
---
# Content hier

# 3. Migration
python3 /opt/nexify/tools/migrate_memory.py \
  --input /workspace/nexify/memory/ \
  --output /home/hermeswebui/.hermes/profiles/nexify-ceo/memories/ \
  --format hermes-compatible
```

---

## 7. Pattern: SECURITY (P0 — Tag 1)

### 7.1 SOLL-Zustand

| Aspekt | SOLL | IST | Gap |
|--------|------|-----|-----|
| **Supabase Ports** | 127.0.0.1 | ❌ 0.0.0.0 | 🔴 Kritisch |
| **Secrets** | /root/.nexify/secrets/ | ✅ Vorhanden | — |
| **Auth** | Bearer-Header | ✅ OK | — |
| **Kundentrennung** | Strikt | ✅ OK | — |

### 7.2 Implementierung (Pattern)

```bash
# Pattern: Supabase-Port-Bindung

# 1. Docker-Compose anpassen
# In docker-compose.yml:
services:
  supabase-db:
    ports:
      - "127.0.0.1:5432:5432"  # NUR localhost

# 2. Firewall-Regel (zusätzlich)
ufw deny 5432/tcp
ufw allow from 127.0.0.1 to any port 5432

# 3. Verifikation
ss -tlnp | grep 5432
# Erwartung: 127.0.0.1:5432, NICHT 0.0.0.0:5432
```

---

## 8. Implementierungsreihenfolge (Gepattert)

### Woche 1: Betriebsgrundlagen (P0)

| Tag | Pattern | Aufwand | Outcome |
|-----|---------|---------|---------|
| **Mo** | SECURITY (Supabase-Ports) | 1h | Sicherheitslücke geschlossen |
| **Mo** | BACKUP (restic + Timer) | 4h | Backup-Basis |
| **Di** | MONITORING (Docker-Compose) | 6h | Prometheus + Grafana |
| **Mi** | MONITORING (Scrape-Configs) | 4h | Metrik-Sammlung |
| **Mi** | MONITORING (Grafana-Dashboards) | 4h | Sichtbarkeit |
| **Do** | MONITORING (Alerting) | 4h | Alert-Regeln |
| **Do** | BACKUP (Offsite-R2) | 2h | Disaster Recovery |
| **Fr** | 9ROUTER (Health-Check) | 2h | LLM-Monitoring |
| **Fr** | OPERATOR SHELL (I01+I02) | 4h | Kernfunktionen |

### Woche 2: Qualität & Stabilisierung (P1)

| Tag | Pattern | Aufwand | Outcome |
|-----|---------|---------|---------|
| **Mo** | PAPERCLIP (9Router-Connect) | 4h | LLM-Connectivity |
| **Di** | PAPERCLIP (Adapter-Tests) | 6h | Test-Basis |
| **Mi** | MEMORY (Format-Drift) | 2h | Memory-Tool funktioniert |
| **Do** | OPERATOR SHELL (I03-I06) | 4h | UI vollständig |
| **Fr** | PAPERCLIP (CI/CD) | 4h | Automatisierte Qualität |

### Woche 3-4: Erweiterung (P2)

| Pattern | Aufwand | Outcome |
|---------|---------|---------|
| PAPERCLIP (E2E-Tests) | 4h | Production-ready |
| PAPERCLIP (npm-publish) | 2h | Verfügbar |
| 9ROUTER (Staging) | 4h | Sicheres Testen |
| BACKUP (Restore-Test) | 2h | Restore verifiziert |

---

## 9. Risikomatrix (gepattert)

| Risiko | Pattern | Mitigation | Ausfallzeit |
|--------|---------|------------|-------------|
| **Brain-Down** | MONITORING | Alert + Auto-Restart | < 5 Min |
| **9Router-Down** | MONITORING + 9ROUTER | Alert + Fallback-Chain | < 2 Min |
| **Backup-Fail** | BACKUP | Alert + manueller Trigger | < 1 Tag |
| **Disk-Voll** | MONITORING | Alert + Auto-Cleanup | < 10 Min |
| **Paperclip-Crash** | PAPERCLIP | Auto-Restart + Alert | < 5 Min |
| **Supabase-Breach** | SECURITY | Firewall + Port-Bindung | 0 (präventiv) |

---

## 10. Definition of Done (gepattert)

### Monitoring ✅
- [ ] Prometheus sammelt Metriken von allen Services
- [ ] Grafana-Dashboard zeigt Health, CPU, RAM, Disk
- [ ] Alerting konfiguriert (Brain down, Disk > 80%)
- [ ] 9Router-Metriken sichtbar

### Backup ✅
- [ ] Tägliche Backups aller kritischen Daten
- [ ] Offsite-Backup (R2/S3) konfiguriert
- [ ] Restore-Test erfolgreich
- [ ] systemd-Timer aktiv

### Operator Shell ✅
- [ ] I01 (Aufgaben) gelöst
- [ ] I02 (Kanban) gelöst
- [ ] I03 (Skills) gelöst
- [ ] I05 (Profile) gelöst
- [ ] I06 (Stats) gelöst

### 9Router ✅
- [ ] Health-Check-Endpoint existiert
- [ ] Monitoring in Prometheus
- [ ] Backup automatisiert
- [ ] Staging-Umgebung existiert

### Paperclip ✅
- [ ] Container läuft produktiv
- [ ] 9Router-Connect funktioniert
- [ ] Adapter v1.0 mit 40+ Tests
- [ ] CI/CD Pipeline grün

### Security ✅
- [ ] Supabase Ports auf 127.0.0.1
- [ ] Firewall-Regeln dokumentiert
- [ ] Secrets auditiert

---

## 11. Gepatterte Abhängigkeiten

```
SECURITY (P0) ──┐
                 ├── BACKUP (P0) ──┐
                 │                 ├── MONITORING (P0)
                 │                 │
                 │                 ├── 9ROUTER (P1)
                 │                 │
                 │                 ├── OPERATOR SHELL (P1)
                 │                 │
                 │                 ├── MEMORY (P1)
                 │                 │
                 │                 └── PAPERCLIP (P2)
                 │
                 └── Alle Patterns sind unabhängig deploybar
                     Keine harten Abhängigkeiten
                     Jedes Pattern hat eigenes Rollback
```

---

## 12. Anhang: Analysierte Quellen

| # | Quelle | Relevanz |
|---|--------|----------|
| 1 | SOLL/IST-Vergleich Gesamtbericht | Gesamtübersicht |
| 2 | 9ROUTER_TARGET_STATE_V1.md | 9Router-SOLL |
| 3 | 9ROUTER_TARGET_STATE_NEXIFYAI_COMBO_LLM.md | Combo-LLM-Schutz |
| 4 | KANBAN_TASK_REGISTER_V3.md | Task-Status |
| 5 | SOLL-PLANUNG.md (Adapter) | Adapter-SOLL |
| 6 | 9Router-DB (SQLite) | Live-Konfiguration |
| 7 | MASTER_PLAN.md | Systeminventar |
| 8 | SERVICE_REGISTRY.md | Service-Katalog |
| 9 | OPERATOR_SHELL_ISSUES.md | UI-Defekte |
| 10 | MONITORING_AND_BACKUP.md | Status quo |

---

*Erstellt: 2026-06-22 | Owner: NeXify CEO | Nächster Review: 2026-06-29*
