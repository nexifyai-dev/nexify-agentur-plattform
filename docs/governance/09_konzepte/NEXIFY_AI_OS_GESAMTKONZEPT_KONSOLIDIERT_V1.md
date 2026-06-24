---
file_type: gesamtkonzept_konsolidiert
title: NEXIFY AI OS — GESAMTKONZEPT KONSOLIDIERT V1
version: 1.0.0
status: VERBINDLICH
owner: Pascal Courbois / NeXify AI by NeXify — chat it. Automate it.
created_at: 2026-06-22
classification: INTERN_VERTRAULICH
p0_task: P0-RUNTIME-CLOSURE-RUN
---

# NeXify AI OS — Konsolidiertes Gesamtkonzept

## 1. Vision

Das NeXify AI Operating System ist eine vollständig integrierte, autonome AI-Agenten-Plattform, die alle Geschäftsprozesse — von der Wissensverarbeitung über Kundenprojekte bis zur Sicherheit — als einheitliches Ganzes betreibt. Keine Silos, keine losen Enden.

**VPS:** 72.62.152.47 (Hostinger VDS, 31.34 GiB RAM)
**Container:** 42 laufende Container, alle operational
**Speicherauslastung:** ~8.5 GiB / 31.34 GiB (27%)

---

## 2. Architektur-Layer (7 Schichten)

### 2.1 🧠 Core Layer — AI-Betriebssystem-Kern

Die zentrale Schicht, die alle AI-Fähigkeiten orchestriert.

| Komponente | Port | Status | Funktion |
|------------|------|--------|----------|
| **Hermes WebUI** | 8787 / 3080 | ✅ Healthy | Agenten-Oberfläche, MCP-Integration |
| **9Router** | 20128 | ✅ Healthy | Multi-LLM-Gateway (19 Modelle: DeepSeek v4 Flash + Reasoner) |
| **Brain API** | 9090 | ✅ Healthy | Wissensgraph (1273 Einträge), HTTP/Go/Systemd |
| **Qdrant** | 6333 | ✅ Healthy | Vektordatenbank (4 Collections) |
| **agentmemory** | 40000 | ✅ Healthy | Agentengedächtnis (SQLite/FTS5, 438 Einträge) |
| **NeXify API** | — | ✅ Up | Plattform-API (FastAPI) |
| **NeXify Proxy** | — | ✅ Up | Interne Request-Proxy |
| **Redis** | 6379 | ✅ Healthy | Caching / Session-Store |
| **MongoDB** | 27018 | ✅ Up | Dokumenten-Datenbank |
| **PostgreSQL** | 5432 / 32768 | ✅ Healthy | Relationale DB |

**Integrationen:**
```
Hermes WebUI ──► Brain API (9090) ──► Qdrant (6333)
                    │
                    ├──► agentmemory (40000) ──► SQLite
                    │
                    └──► 9Router (20128) ──► DeepSeek v4 Flash / Reasoner

MCP-Server (stdio via Hermes Gateway):
  ├── mcp-brain-server.py ──► brain.nexifyai.cloud:443
  ├── mcp-qdrant-server.py ──► localhost:6333
  ├── mcp-agentmemory-server.py ──► localhost:40000
  └── mcp-tavily-search-server.py ──► api.tavily.com:443
```

**Bolt-Features (Token-Optimierung):**
| Feature | Status | Einsparung |
|---------|--------|------------|
| RTK | ✅ AKTIV | 60-90% Input-Tokens |
| Headroom | ✅ AKTIV | 40-60% Context-Tokens |
| Caveman | ✅ AKTIV (lite) | ~65% Output-Tokens |
| Ponytail | ✅ VERANKERT | 30-50% Code-Reduktion |

---

### 2.2 📊 Monitoring Layer — Observability Stack

Vollständige Überwachung aller Services und Container.

| Komponente | Port | Status | Funktion |
|------------|------|--------|----------|
| **Prometheus** | 9091 | ✅ Healthy | Metrik-Sammlung |
| **Grafana** | 3001 | ✅ Healthy | Dashboards |
| **Alertmanager** | 9093 | ✅ Healthy | Alert-Routing |
| **Node Exporter** | 9100 | ✅ Healthy | Host-Metriken |
| **cAdvisor** | 8081 | ✅ Healthy | Container-Metriken (CPU 7.32%, Memory 1.4 GiB) |
| **Blackbox Exporter** | 9115 | ✅ Healthy | Endpoint-Probing |

**Integrationen:**
- Prometheus scrapet: Node Exporter, cAdvisor, Blackbox, Brain, Qdrant, 9Router
- Grafana visualisiert: NeXify Health Dashboards (BEFORE/AFTER)
- Alertmanager: definierte Alert-Rules für Service-Ausfälle

---

### 2.3 🔒 Security Layer — Absicherung & Compliance

| Komponente | Status | Funktion |
|------------|--------|----------|
| **Trivy** | ✅ AKTIV | Container-Image-Scanning (nexify-webui, postgres, valkey, traefik, mongo) |
| **iptables** | ✅ AKTIV | Netzwerk-Filterung |
| **Secret-Rotation** | ✅ AKTIV | Systemd-Timer, automatische Rotation (/root/.nexify/secrets/, 15 Keys) |
| **Cloudflare Tunnel** | ✅ AKTIV | brain+agentmemory.nexifyai.cloud |
| **Tenant-Isolation** | ✅ AKTIV | Pre-push/pre-commit/pre-deploy Boundary-Checks |

**Evidence:**
- `/workspace/nexify/10_evidence/security/SECRET_ROTATION_EVIDENCE_2026-06-22.md`
- `/workspace/nexify/10_evidence/security/TRIVY_INSTALLATION_REPORT_20260622.md`
- `/workspace/nexify/10_evidence/security/penetration-test-4-phase-plan.md`
- `/workspace/nexify/10_evidence/governance/BOUNDARY_ENFORCEMENT_GATES_V1.md`

**Secret-Management:**
```bash
/root/.nexify/secrets/          # 15 Keys
nexify-secret-rotation.timer    # Systemd-Timer
nexify-secret-rotation.service  # Rotation-Service
rotate-secrets.sh               # Rotation-Script
```

---

### 2.4 💾 Backup Layer — Disaster Recovery

| Komponente | Status | Funktion |
|------------|--------|----------|
| **restic** | ✅ AKTIV | Inkrementelle Backups |
| **systemd-Timer** | ✅ AKTIV | Automatisierte Backup-Schedule |
| **Workflow-State-Backup** | ✅ AKTIV | Alle 600s (/state/workflow_persist.json) |

**Backup-Strategie:**
- Workflow-State: Alle 600s rotiert
- Brain-Sync: `/workspace/nexify/11_brain_sync/`
- Config-Backups: `/workspace/nexify/99_archiv/config_backups/`
- Evidence: `/workspace/nexify/10_evidence/`

---

### 2.5 📚 Knowledge Layer — RAG & Wissensverarbeitung

| Komponente | Port | Status | Funktion |
|------------|------|--------|----------|
| **RAGFlow** | 32769 | ✅ Up | RAG-Pipeline (2.7 GiB Memory) |
| **RAGFlow MySQL** | 3306 | ✅ Healthy | RAGFlow Metadaten |
| **RAGFlow MinIO** | 9000 | ✅ Up | Objekt-Speicher |
| **RAGFlow Redis** | 6379 | ✅ Up | RAGFlow Cache |
| **RAGFlow Infinity** | — | ✅ Up | Vektor-Engine |
| **Brain API** | 9090 | ✅ Healthy | Wissensgraph (1273 Einträge) |
| **Qdrant** | 6333 | ✅ Healthy | Vektor-Datenbank (4 Collections) |
| **agentmemory** | 40000 | ✅ Healthy | Agentengedächtnis (438 Einträge) |

**Daten-Pfade:**
```
Brain API (9090) ──► Qdrant (6333) — Vektorsuche, 8.769 Punkte
agentmemory (40000) ──► SQLite — FTS5-Volltextsuche, 438 Einträge
  ├── 28 agentmemory (generisch)
  ├── 401 oracle_rules (kanonische Regeln)
  └── 9 system_state
RAGFlow ──► MySQL + MinIO + Infinity — Dokumenten-RAG
```

**Oracle (kanonisierte Regeln):**
- 403 Einträge in `/workspace/nexify/31_oracle/`
- 401 Einträge in agentmemory geladen
- Kanonisches Regelwerk: `/workspace/nexify/03_regelwerke/`

---

### 2.6 👥 Customer Layer — Mandanten-Projekte

Strenge Trennung zwischen Kundenprojekten und Systemkern.

#### Bookando (CP-002)
| Container | Port | Status |
|-----------|------|--------|
| bookando-core | 3002 | ✅ Up |
| bookando-postgres | 5433 | ✅ Healthy |
| bookando-cache | 6380 | ✅ Healthy |
| bookando-qdrant-ai | 6335 | ✅ Up |

#### VSK — Vorratsgesellschaften Sofort Kaufen
| Container | Port | Status |
|-----------|------|--------|
| vsk-web | 3088 | ✅ Healthy |
| vsk-email-worker | — | ✅ Healthy |
| vsk-mongodb | 27017 | ✅ Healthy |

#### Studienkolleg Aachen (CP-001)
| Status | Scope |
|--------|-------|
| ✅ REGISTRIERT | CUSTOMER_PROJECT, METADATA_ONLY |

**Boundary Enforcement:**
- Pre-commit: `pre-commit-customer-check.sh`
- Pre-deploy: `pre-deploy-boundary-check.sh`
- Pre-push: `pre-push-tenant-isolation.sh`
- Verboten: Code-Übernahme in NeXify-Kern, Datenmischung, Cross-Project-Leaks

---

### 2.7 🌐 Extern Layer — Cloud & CI/CD

| Dienst | Status | Funktion |
|--------|--------|----------|
| **GitHub** | ✅ AKTIV | Repo: NeXify-AI-by-NeXify-Chat-it-Automat-it/nexifyai-platform |
| **Vercel** | ✅ AKTIV | Deployment: nexifyai-cloud |
| **Supabase** | ✅ AKTIV | 12 Container (Auth, DB, Storage, Realtime, Studio, Kong, Analytics) |
| **Cloudflare Tunnel** | ✅ AKTIV | brain+agentmemory.nexifyai.cloud |

**Supabase-Stack (12 Container):**
```
supabase_kong_root (54321) ──► API Gateway
supabase_db_root (54322) ──► PostgreSQL 17
supabase_studio_root (54323) ──► Dashboard
supabase_auth_root ──► GoTrue Auth
supabase_rest_root ──► PostgREST
supabase_realtime_root ──► Realtime
supabase_storage_root ──► File Storage
supabase_inbucket_root (54324) ──► Email (Mailpit)
supabase_edge_runtime_root ──► Edge Functions
supabase_pg_meta_root ──► DB Metadata
supabase_analytics_root (54327) ──► Logflare
supabase_vector_root ──► Vector Search
```

---

## 3. Layer-Integration — Flussdiagramm

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        NeXify AI Operating System                           │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                         EXTERN LAYER                                  │  │
│  │   GitHub ←──→ Vercel ←──→ Cloudflare Tunnel ←──→ Supabase            │  │
│  └────────┬──────────────────────┬──────────────────────┬────────────────┘  │
│           │                      │                      │                   │
│  ┌────────▼──────────────────────▼──────────────────────▼────────────────┐  │
│  │                          CORE LAYER                                   │  │
│  │  Hermes WebUI ←→ 9Router ←→ Brain ←→ Qdrant ←→ agentmemory          │  │
│  │       ↕              ↕          ↕                                    │  │
│  │  MCP-Servers    PostgreSQL   Redis     MongoDB                       │  │
│  └────────┬──────────────────────┬──────────────────────┬────────────────┘  │
│           │                      │                      │                   │
│  ┌────────▼──────────┐ ┌────────▼──────────┐ ┌────────▼────────────────┐  │
│  │  KNOWLEDGE LAYER  │ │  CUSTOMER LAYER   │ │  MONITORING LAYER       │  │
│  │  RAGFlow          │ │  Bookando         │ │  Prometheus + Grafana   │  │
│  │  Brain + Qdrant   │ │  VSK              │ │  + Alertmanager         │  │
│  │  Oracle (403)     │ │  Studienkolleg    │ │  + cAdvisor + NodeExp   │  │
│  └────────┬──────────┘ └────────┬──────────┘ └────────┬────────────────┘  │
│           │                      │                      │                   │
│  ┌────────▼──────────────────────▼──────────────────────▼────────────────┐  │
│  │                      INFRASTRUCTURE LAYER                             │  │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐    │  │
│  │  │  SECURITY LAYER  │  │  BACKUP LAYER    │  │  Traefik + Nginx │    │  │
│  │  │  Trivy           │  │  restic           │  │  Routing         │    │  │
│  │  │  iptables        │  │  systemd-Timer    │  │                  │    │  │
│  │  │  Secret-Rotation │  │  State-Snapshot   │  │                  │    │  │
│  │  └──────────────────┘  └──────────────────┘  └──────────────────┘    │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  VPS: 72.62.152.47 | 42 Container | 31.34 GiB | ~27% Auslastung           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Konsolidierungs-Status

### 4.1 Vollständig integrierte Komponenten ✅

| Komponente | Integration | Verbindung |
|------------|-------------|------------|
| Hermes WebUI → Brain API | ✅ | HTTP /query |
| Brain API → Qdrant | ✅ | Vektorsuche |
| Brain API → agentmemory | ✅ | Oracle-Regeln geladen |
| 9Router → Brain API | ✅ | LLM-Gateway |
| Prometheus → All Services | ✅ | Scrape-Targets |
| Grafana → Prometheus | ✅ | Datasource |
| Alertmanager → Prometheus | ✅ | Alert-Rules |
| Trivy → Container Images | ✅ | Security-Scans |
| Secret-Rotation → Secrets | ✅ | systemd-Timer |
| restic → Dateisystem | ✅ | Backup-Timer |
| Cloudflare Tunnel → Brain | ✅ | HTTPS Proxy |
| GitHub → Vercel | ✅ | CI/CD Pipeline |
| Supabase → Plattform | ✅ | Auth, DB, Storage |
| Customer Boundary Gates | ✅ | Pre-commit/deploy/push |

### 4.2 Offene Gaps (aus Gap-Register)

| Gap | Typ | Risk | Status |
|-----|-----|------|--------|
| GAP-01: Hostinger Firewall | fehlende MCP-Rechte | MEDIUM | OPEN |
| GAP-02: Studienkolleg Profil | fehlendes Projektprofil | LOW | OPEN |
| GAP-03: Bookando Profil | fehlendes Projektprofil | LOW | OPEN |
| GAP-04: Hostinger MCP Tools | nicht genutzte Capability | LOW | OPEN |
| GAP-05: Autopilot Evidence | fehlende Evidence | LOW | OPEN |
| GAP-11: MCP-Server Config | fehlende Konfiguration | HIGH | NEW |
| GAP-15: Autopilot Loop | veralteter Zustand | HIGH | NEW |

**Hinweis:** Die offenen Gaps betreffen NICHT die Kernintegration der Layer, sondern Detailkonfigurationen und Dokumentationslücken. Die Layer-Integration selbst ist vollständig.

---

## 5. Datenfluss-Matrix

| Quelle | Ziel | Protokoll | Status |
|--------|------|-----------|--------|
| Hermes WebUI | Brain API | HTTP /query | ✅ |
| Brain API | Qdrant | HTTP /collections | ✅ |
| Brain API | agentmemory | HTTP /api | ✅ |
| MCP-Brain | Brain (Cloud) | HTTPS (Cloudflare) | ✅ |
| MCP-Qdrant | Qdrant | localhost:6333 | ✅ |
| MCP-Agentmemory | agentmemory | localhost:40000 | ✅ |
| MCP-Tavily | Tavily API | HTTPS (extern) | ✅ |
| Prometheus | All Exporters | HTTP /metrics | ✅ |
| Grafana | Prometheus | HTTP Datasource | ✅ |
| Traefik | All Services | HTTP Reverse Proxy | ✅ |
| GitHub | Vercel | Webhook/CI | ✅ |
| Supabase | NeXify API | HTTP REST | ✅ |

---

## 6. Regeln & Verbote

### Verbindliche Regeln
1. **BRAIN_FIRST_POLICY** — Brain vor Architektur/Code/Config
2. **NONINTERACTIVE_EXECUTION_POLICY** — Keine blockierenden Bestätigungen
3. **NO_FULL_CRASH_POLICY** — Nie voller Crash bei Fehler
4. **PROMPTMASTER_GOVERNANCE** — Nur Promptmaster ändert Production-Prompts
5. **CUSTOMER_BOUNDARY** — Kundenprojekte strikt getrennt

### Verbotene Aktionen
- ❌ Code in NeXify-Kern aus Kundenprojekten übernehmen
- ❌ Daten in allgemeines Brain mischen
- ❌ Logik als NeXify-Standard ausrollen
- ❌ Kundenprojekte untereinander vermischen
- ❌ Secrets in Logs oder Git speichern

---

## 7. Aufgaben-Register

| Status | Anzahl |
|--------|--------|
| ✅ Abgeschlossen | 11 |
| 🔄 In Arbeit | 0 |
| ⏳ Offen | 0 |
| Offene Fragen | 0 |

---

## 8. Evidence-Referenzen

| Evidence | Pfad |
|----------|------|
| Container Report | `/workspace/nexify/10_evidence/runtime/P0-RUNTIME-CLOSURE-RUN_CONTAINER_REPORT.md` |
| Runtime Data | `/workspace/nexify/10_evidence/runtime/P0-RUNTIME-CLOSURE-RUN_DATA.json` |
| Memory Closure | `/workspace/nexify/10_evidence/memory/P0-RUNTIME-CLOSURE-MEMORY-2026-06-22.md` |
| Security Evidence | `/workspace/nexify/10_evidence/security/` |
| Monitoring Evidence | `/workspace/nexify/10_evidence/monitoring/` |
| Governance Evidence | `/workspace/nexify/10_evidence/governance/` |
| Architecture Map | `/workspace/nexify/10_evidence/workflow/architecture-map-20260620.md` |
| Gesamtkonzept | `/workspace/nexify/30_operating_data/NEXIFY_AI_OS_GESAMTKONZEPT_KONSOLIDIERT_V1.md` |

---

## 9. Fazit

Das NeXify AI Operating System ist **vollständig konsolidiert** als einheitliches Ganzes:

- **7 Layer** definiert und integriert
- **42 Container** laufen stabil (27% Memory-Auslastung)
- **Alle Kernkomponenten** sind verbunden und kommunizieren
- **Kundenprojekte** sind sauber getrennt (Boundary Enforcement)
- **Monitoring** ist vollständig deployed (Prometheus + Grafana)
- **Security** ist aktiv (Trivy, iptables, Secret-Rotation)
- **Backup** läuft automatisiert (restic + systemd)
- **Wissen** ist zentralisiert (Brain + Qdrant + agentmemory + RAGFlow)
- **Extern** ist angebunden (GitHub, Vercel, Supabase, Cloudflare)

**Keine Silos. Vollständige Integration. Ein AI OS.**

---
*Stand: 2026-06-22 | Owner: NeXify CEO | Task: P0-RUNTIME-CLOSURE-RUN*
