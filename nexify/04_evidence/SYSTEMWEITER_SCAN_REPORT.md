# Recherche 2: Systemweiter Scan aller Daten und Dateien

**Datum:** 2026-06-22 23:58 UTC
**Agent:** Systemmaster Agent
**Aufgabe:** Systemweiter Vollscan aller Daten, Dateien, Repositories, Services und Infrastruktur

---

## 1. SYSTEM-UMGEBUNG

| Attribut | Wert |
|----------|------|
| Host | Linux (7.0.0-22-generic) |
| Festplatte | 387G gesamt, 112G belegt (29%), 276G frei |
| Working Directory | /workspace |
| User | hermeswebui |
| Docker | NICHT verfügbar (Container-Modus) |
| SSH VPS | NICHT erreichbar (kein SSH-Zugang aus diesem Container) |

---

## 2. WORKSPACE-ROOT-SCAN (/workspace/)

### 2.1 Top-Level-Verzeichnisse (19 Stück)

| Verzeichnis | Typ | Beschreibung |
|-------------|-----|--------------|
| `/workspace/nexify/` | Hauptworkspace | Systemmaster-Workspace (1.2 GB) |
| `/workspace/nexifyai-platform/` | GitHub Repo | NeXify AI Platform (monorepo, 1.6 GB) |
| `/workspace/nexify-ai-platform/` | Next.js App | NeXify AI Platform Dashboard (1.2 GB) |
| `/workspace/nexifyai/` | Orchestrierung | Agentur-Zentralprojekt (312 KB) |
| `/workspace/hermes-paperclip-adapter/` | Adapter | Hermes→Paperclip Adapter (134 MB) |
| `/workspace/customers/` | Kundenprojekte | Tenant-isoliert (1.2 GB) |
| `/workspace/bookando/` | DEPRECATED | Alter Bookando-Launchpad (9.9 MB) |
| `/workspace/bookando-api/` | DEPRECATED | Alter API-Launchpad (1.5 MB) |
| `/workspace/studienkolleg-aachen/` | Kundenprojekt | Studienkolleg Aachen (191 MB) |
| `/workspace/vorratsgesellschaften/` | Projekt | Vorratsgesellschaften Landingpage (963 MB) |
| `/workspace/backups/` | Backup | Lokale Backups |
| `/workspace/configs/` | Config | Konfigurationsdateien |
| `/workspace/memory/` | Memory | Agent-Memory-Daten |
| `/workspace/reports/` | Reports | Berichte |
| `/workspace/docs-web/` | Docs | Web-Dokumentation |
| `/workspace/e2e-evidence/` | Tests | E2E-Test-Evidence |
| `/workspace/.nexify/` | Hidden | NeXify-Konfiguration |

### 2.2 Dateistatistiken (gesamter Workspace, max depth 4)

| Dateityp | Anzahl |
|----------|--------|
| Markdown (.md) | 2,225 |
| Python (.py) | 289 |
| JS/TS (.ts/.tsx/.js/.jsx) | 128 (exkl. node_modules) |
| JSON (.json) | 275 (exkl. node_modules) |

### 2.3 Konfigurations- und Infrastrukturdateien

- **Dockerfiles:** 5 (9router, bookando-api, nexifyai-platform, vorratsgesellschaften, monitoring)
- **docker-compose.yml:** 7 (bookando-api, nginx-frontend, infrastructure, monitoring, vorratsgesellschaften + backups)
- **.env Dateien:** 11 (bookando-api, bookando-de, vorratsgesellschaften, legacy-agentmemory, services/api)
- **GitHub Actions:** vorhanden (nexifyai-platform/.github/)

---

## 3. NEXIFY WORKSPACE SCAN (/workspace/nexify/)

### 3.1 Verzeichnisstruktur (53 Unterverzeichnisse)

| Bereich | Verzeichnisse | Inhalt |
|---------|---------------|--------|
| Master | 00_master | Systemkonzept-Master |
| Agenten | 01_agenten_seele, 29_agent_seele | Agentenpersönlichkeit |
| Dokumentation | 01_docs_first, 01_ist_soll | Doku + IST/SOLL |
| Aufträge | 02_auftraege, 05_auftraege | Auftragsverwaltung |
| Governance | 02_governance, 02_sops, 04_sops | SOPs + Governance |
| Regelwerke | 03_regelwerke, 03_lasten_pflichten | 31 Regelwerke (4,274 Zeilen total) |
| Checklisten | 03_checklisten | Prüflisten |
| Register | 04_register | 25+ Registerdateien |
| Projekte | 04_projects | Projektübersicht |
| Skills | 05_skills | 4 Skills (data-engineer, goose, nexify-knowledge-data-engineer, template) |
| MCP | 06_mcp | MCP-Kapabilitäten |
| Tools/CLI | 07_tools_cli | 17 Tools (9router, 9remote, autopilot, caveman, chatgpt_mcp, claude_code, cloudflare_dns, compression, crush, goose, hermes, kilo, noninteractive, openai_codex, openai_tunnel_client, rtk, supermemory) |
| UI/CI | 07_ui_ci | UI + CI/CD |
| Kanban | 08_kanban_tasks | Task-Registry |
| Dispatcher | 09_dispatcher | 9 Subsysteme (automation_controller, chat_operator, connection_recovery, goose_auto_chat + scripts) |
| Evidence | 10_evidence | 47 Unterverzeichnisse, 209 MD-Dateien |
| Brain Sync | 11_brain_sync | Brain-Synchronisation |
| Agentmemory | 12_agentmemory | Agent-Memory |
| Architektur | 14_architektur | Architekturdoku |
| API | 15_api | API-Doku |
| Betrieb | 16_betrieb, 16_din_iso | Operations + DIN/ISO |
| Security | 17_security | Sicherheit |
| Design | 18_designsystem, 18_logs_monitoring | Design System + Monitoring |
| Sales | 19_sales_crm_offer | CRM + Angebote |
| Prüfungen | 20_pruefverfahren | Prüfverfahren |
| Website | 20_website_portal | Landingpage (nexifyai-agency-website) |
| Tests | 22_tests_qr | QR-Tests |
| Automation | 24_automation_cron | Cron-Automation |
| Audits | 27_audits | Audits |
| Feedback | 28_feedbackschleifen | Feedbackloops |
| Opt. Daten | 30_operating_data | 60+ Betriebsdateien, Blueprints, Register, Orchestrierung |
| Oracle | 31_oracle | Kanonisierte Regeln |
| Archiv | 99_archiv | Archiv |
| Integration | 99_integration | Integrationsdaten |
| AI-OS | ai-os | 7 AI-OS-Policy-Dokumente |
| Kanban | kanban | Kanban-Daten |
| Ops | ops | Operations |
| Security | security | Sicherheitsdaten |

### 3.2 Evidence-Unterverzeichnisse (47 Stück)

9router, agentmemory, architektur, auto_chat_context, auto_chat_today, autopilot, backup, bolt, brain, change_safety, chatgpt_mcp, claude_startup, code_review, compression, connection_loss, design, goose_auto_chat, governance, integration, kanban, kunden, landingpage, langfristig, live_verification, mcp, memory, monitoring, normen, operator-shell, oracle_canonicalization, p0-mandate, pending_search, plugins, pre_task, project_sources, promptmaster, proxy, real_progress, runtime, runtime-network-20260621, security, skills, supermemory, system, systemmaster, workflow

### 3.3 Operative Daten (/workspace/nexify/30_operating_data/)

**Master-Register (JSON + MD):**
- NEXIFY_TOTAL_SYSTEM_CONCEPT_MASTER
- NEXIFY_SYSTEM_BLUEPRINT_MASTER
- NEXIFY_DATA_SOURCE_AND_STORAGE_MAP
- NEXIFY_DEPENDENCY_AND_FLOW_MAP
- NEXIFY_GAP_CLOSURE_MASTER_REGISTER
- NEXIFY_COMPLEXITY_REDUCTION_REGISTER
- NEXIFY_CUSTOMER_PROJECT_BOUNDARY_REGISTER
- NEXIFY_COST_VALUE_MARGIN_REGISTER
- NEXIFY_RESEARCH_CACHE_REGISTER
- NEXIFY_SOURCE_COVERAGE_GAP_REPORT
- NEXIFY_SOURCE_REPO_PLUGIN_CLI_MASTER_REGISTER
- NEXIFY_SYSTEMWIDE_REQUIREMENTS_EXTRACTION_MASTER
- NEXIFY_APPLICATION_SCRIPT_TOOL_INVENTORY
- DOCKER_CONTAINER_CONSOLIDATION_PLAN
- VPS_RUNTIME_INVENTORY
- BRAIN_SECRET_RESTORATION_PLAN

**Orchestrierung:** 7 Task-Result-Dateien, Audit-Log, Events-Log, Triggers-Log
**Runs:** website-production-cutover (evidence-index, heartbeat, run-state)
**Backups:** agentmemory DB-Backup (2026-06-20)

---

## 4. NEXIFYAI-PLATFORM SCAN (/workspace/nexifyai-platform/)

### 4.1 Repository-Info

| Attribut | Wert |
|----------|------|
| Remote | https://github.com/NeXify-AI-by-NeXify-Chat-it-Automat-it/nexifyai-platform.git |
| Branch | main (+ 2 remote feature branches) |
| Letzter Commit | `a3e2427` — feat: Traefik Config für nexifyai.cloud |
| PRs | #118 (Systemmaster Integration), #117 (Governance V1+V3 Sync) |

### 4.2 Verzeichnisstruktur

| Verzeichnis | Inhalt |
|-------------|--------|
| apps/ | Anwendungen |
| deploy/ | Deployment (nginx-frontend, docker-compose) |
| docker/ | Docker-Konfiguration |
| docs/ | 30 Dokumentations-Unterverzeichnisse |
| e2e/ | End-to-End-Tests |
| frontend/ | Frontend-Code |
| infrastructure/ | Docker (Dockerfile.api, docker-compose.yml), Monitoring |
| knowledge/ | Wissensdatenbank |
| ops/ | Operations |
| packages/ | Shared Packages |
| scripts/ | Build-Scripts |
| services/ | Backend-Services (API mit .env.example) |
| supabase/ | Supabase-Konfiguration |
| tests/ | Test-Suiten |
| worker/ | Worker-Prozesse |
| _archive/ | Archiv |

### 4.3 CI/CD & Security

- `.github/` — GitHub Actions Workflows
- `.semgrep/` + `.semgrepignore` — Semgrep Security-Scanner
- `.gitleaks.toml` — GitLeaks Secret-Scanner
- `.trivyignore` — Trivy Container-Scanner
- `.pre-commit-config.yaml` — Pre-Commit Hooks
- `.spectral.yaml` — API-Linting
- `knip.json` — Dead-Code-Erkennung
- `lighthouserc.js` — Performance-Auditing
- `pyproject.toml` — Python-Projekt-Config
- `biome.json` — JS/TS-Linting
- `eslint.config.mjs` — ESLint

---

## 5. NEXIFY-AI-PLATFORM (Next.js Dashboard) SCAN

### 5.1 Pfad: /workspace/nexify-ai-platform/

| Verzeichnis | Inhalt |
|-------------|--------|
| src/app/ | Next.js App Router (dashboard, auth, login, register, workspace, api) |
| src/components/ | React-Komponenten (landing, ui, views) |
| src/components/views/ | MemoryView, ProfileView, SecurityView, MonitoringView |
| src/automation/ | core, memory, orchestrator, prompts, services, skills-repository |
| src/lib/ | Utilities + Supabase-Client |
| config/ | Konfiguration |
| docs/ | Dokumentation |
| .next/ | Next.js Build-Output |

---

## 6. NEXIFYAI ORCHESTRIERUNG (/workspace/nexifyai/)

### 6.1 Verzeichnisstruktur

| Verzeichnis | Inhalt |
|-------------|--------|
| .agents/ | Agent-Konfigurationen |
| claude-config/ | Claude-Code-Konfiguration |
| fabrik/ | Fabrik-Definitionen |
| ops/ | Operations (health-check.sh, sync-brain.sh) |
| projects/ | Projekt-Registry (bookando, template) |
| scripts/ | Utility-Scripts |

---

## 7. HERMES PAPERCLIP ADAPTER SCAN (/workspace/hermes-paperclip-adapter/)

### 7.1 Repository-Info

| Attribut | Wert |
|----------|------|
| Remote | https://github.com/NousResearch/hermes-paperclip-adapter.git |
| Version | 0.2.1 |
| Letzte Commits | Auth-Header-Fix, PAPERCLIP_API_KEY Injection, Config-Fix, Timeout-Config |

### 7.2 Source-Dateien (13 TypeScript-Dateien)

| Datei | Zweck |
|-------|-------|
| src/index.ts | Root: type, label, models, agentConfigurationDoc |
| src/server/execute.ts | Core Execution (spawn hermes CLI) |
| src/server/test.ts | Environment-Checks (CLI, Python, API Keys) |
| src/server/detect-model.ts | Modellerkennung |
| src/server/post-process.ts | Nachverarbeitung |
| src/server/skills.ts | Skill-Integration |
| src/ui/parse-stdout.ts | Hermes stdout → TranscriptEntry[] |
| src/ui/build-config.ts | UI form → adapterConfig |
| src/cli/format-event.ts | Terminal-Output-Formatierung |
| src/shared/constants.ts | Shared Constants |

### 7.3 Build & Config

- `package.json` — npm-Projekt
- `tsconfig.json` — TypeScript-Konfiguration
- `vitest.config.ts` — Test-Konfiguration
- `eslint.config.js` — Linting
- `paperclip.json` — Paperclip-Adapter-Konfiguration
- `dist/` — Kompilierter Output vorhanden
- `node_modules/` — Dependencies installiert

---

## 8. KUNDENPROJEKTE SCAN (/workspace/customers/)

### 8.1 Struktur

```
customers/
└── fixdigital/
    └── bookando/
        ├── bookando-api/     # Python/FastAPI Backend
        ├── bookando-de/      # Next.js Frontend
        └── project-control/  # Projektsteuerung + Workflows
```

### 8.2 Bookando Backend (bookando-api/)

- **Stack:** Python, FastAPI, Supabase, Docker
- **Deploy:** Vercel (Projekt bookando-de-riw8)
- **API:** https://bookando-de-riw8.vercel.app
- **Key Files:** requirements.txt, pyproject.toml, docker-compose.yml, Dockerfile
- **Env:** .env, .env.local, .env.example, system_connections.env
- **Tests:** tests/, backend_test.py, .coverage

### 8.3 Bookando Frontend (bookando-de/)

- **Stack:** Next.js, Tailwind CSS
- **Deploy:** Vercel (Projekt bookando-de)
- **Domain:** https://bookando.de
- **Key Files:** package.json, tailwind.config.js, PFLICHTENHEFT.md
- **Env:** .env, .env.example, .env.production

### 8.4 Project Control

- AGENT_LOOP_CHARTER.md — Verbindlicher Agenten-Loop
- VERCEL_PRODUCTION_TRUTH_MATRIX.md — Live-Stand-Matrix
- BESTANDSAUFNAHME_2026-06-19.md — Bestandsaufnahme
- VERCEL_CANONICAL_TARGETS.yaml — Deployment-Targets
- agent-assignments.json — Agent-Zuweisungen
- SCHEMA.md — Schema-Definition
- Incident-Reports: 4 Stück (ECC Merge, Backend PR1, Frontend-Backend Connectivity, Incident Resolution)
- Workflows: 5 Recovery-Workflows mit State-JSONs und Lock-Dateien

---

## 9. WEITERE PROJEKTE

### 9.1 Studienkolleg Aachen (/workspace/studienkolleg-aachen/)

- **Typ:** Kundenprojekt
- **Größe:** 191 MB
- **Struktur:** api/, backend/, docs/, frontend/, memory/, repo-analysis/, scripts/
- **Git:** .git vorhanden
- **Special:** .hermes/ (Hermes-Konfiguration), .emergent/ (Emergent-Konfiguration)

### 9.2 Vorratsgesellschaften (/workspace/vorratsgesellschaften/)

- **Typ:** Eigenprojekt (Landingpage)
- **Größe:** 963 MB
- **Struktur:** artifacts/, backups/, vorratsgesellschaften-sofort-kaufen-landingpage/
- **Stack:** Next.js, Docker, Tailwind CSS
- **Env:** .env, .env.example, Dockerfile, docker-compose.yml
- **Backups:** 2 Backup-Snapshots (2026-06-16)

### 9.3 Bookando (DEPRECATED) (/workspace/bookando/)

- **Status:** DEPRECATED seit 2026-06-18
- **Nachfolger:** /workspace/customers/fixdigital/bookando/
- **Enthält:** .vercel/, handover/

### 9.4 Bookando API (DEPRECATED) (/workspace/bookando-api/)

- **Status:** DEPRECATED
- **Nachfolger:** /workspace/customers/fixdigital/bookando/bookando-api/

---

## 10. SERVICES & INFRASTRUKTUR

### 10.1 Lokale Services (erreichbar)

| Service | URL | Status |
|---------|-----|--------|
| Brain API | http://127.0.0.1:9090 | ✅ HTTP 200 |
| Qdrant | http://127.0.0.1:6333 | ✅ HTTP 200 |
| Hermes WebUI | https://work.nexifyai.cloud | ✅ HTTP 302 (Redirect → Login) |

### 10.2 Remote Services (nicht testbar aus Container)

| Service | Status |
|---------|--------|
| Docker | ❌ Nicht verfügbar (Container-Modus) |
| SSH VPS | ❌ Nicht erreichbar |
| Cloudflare Tunnel | Nicht testbar |

### 10.3 Externe Repositories (GitHub)

| Repository | URL | Status |
|------------|-----|--------|
| nexifyai-platform | https://github.com/NeXify-AI-by-NeXify-Chat-it-Automat-it/nexifyai-platform.git | ✅ Lokal vorhanden |
| hermes-paperclip-adapter | https://github.com/NousResearch/hermes-paperclip-adapter.git | ✅ Lokal vorhanden |
| nexify-agentur-plattform | https://github.com/nexifyai-dev/nexify-agentur-plattform.git | ❓ Nicht lokal gescannt |
| bookando-api | nexifyai-dev/bookando-api | ✅ In customers/ |
| bookando-de | nexifyai-dev/bookando-de | ✅ In customers/ |

---

## 11. AI-OS POLICY DOKUMENTE (/workspace/nexify/ai-os/)

| Datei | Inhalt |
|-------|--------|
| NEXIFY_AI_OS_MEMORY_AND_KNOWLEDGE_POLICY.md | Memory- und Wissensrichtlinien |
| NEXIFY_AI_OS_MONITORING_AND_BACKUP.md | Monitoring + Backup-Strategie |
| NEXIFY_AI_OS_OPERATOR_SHELL_ISSUES.md | Operator-Shell-Probleme |
| NEXIFY_AI_OS_PAPERCLIP_AI_TEAM_RUNTIME_MAPPING.md | Paperclip AI Team-Mapping |
| NEXIFY_AI_OS_PAPERCLIP_ANALYSIS.md | Paperclip-Analyse |
| NEXIFY_AI_OS_RAGFLOW_ANALYSIS.md | RAGFlow-Analyse |
| NEXIFY_AI_OS_SERVICE_REGISTRY.md | Service-Registry |

---

## 12. MCP-SERVERS (Python, im Workspace)

| Server | Datei |
|--------|-------|
| Brain MCP | mcp-brain-server.py |
| Agentmemory MCP | mcp-agentmemory-server.py |
| Qdrant MCP | mcp-qdrant-server.py |
| Tavily Search MCP | mcp-tavily-search-server.py |
| Agentmemory REST | agentmemory-rest-server.py |
| Agentmemory API | agentmemory_api_server.py |
| Agentmemory Server | agentmemory_server.py |
| Brain Sync | brain-sync.py |

---

## 13. ZUSAMMENFASSUNG

### Statistiken

| Metrik | Wert |
|--------|------|
| Top-Level-Verzeichnisse | 19 |
| Nexify-Unterverzeichnisse | 53 |
| Evidence-Unterverzeichnisse | 47 |
| Tools/CLI-Unterverzeichnisse | 17 |
| Regelwerke | 31 (4,274 Zeilen) |
| MD-Dateien (gesamt) | 2,225 |
| Python-Dateien | 289 |
| JS/TS-Dateien | 128 |
| JSON-Dateien | 275 |
| Evidence MD-Dateien | 209 |
| Master-Register | 16 JSON+MD Paare |
| MCP-Server | 8 Python-Server |
| Dockerfiles | 5 |
| docker-compose.yml | 7 |
| .env Dateien | 11 |
| Git-Repositories | 5+ |
| GitHub-Remotes | 2 verifiziert |
| Lokale Services | 3 (Brain, Qdrant, WebUI) |
| Gesamt-Datenträger | ~7.5 GB |

### Erreichbare Ziele

✅ Workspace-Scan: VOLLSTÄNDIG
✅ Platform-Scan: VOLLSTÄNDIG (nexifyai-platform + nexify-ai-platform)
✅ Adapter-Scan: VOLLSTÄNDIG (hermes-paperclip-adapter)
✅ GitHub-Scan: 2/3 Repositories verifiziert (nexifyai-platform, hermes-paperclip-adapter)
✅ Hermes-WebUI-Scan: HTTP 302 (aktiv, erreichbar)
✅ Alle Daten strukturiert: JETZT

### Eingeschränkte Ziele

⚠️ VPS-Scan: SSH nicht erreichbar aus Container
⚠️ Docker-Scan: Docker nicht verfügbar im Container-Modus
⚠️ GitHub Repo 3 (nexify-agentur-plattform): Nicht lokal vorhanden

---

## 14. EVIDENCE-DATEIEN

| Datei | Pfad |
|-------|------|
| Dieser Report | /workspace/nexify/10_evidence/scan/SYSTEMWEITER_SCAN_REPORT.md |
| Zusammenfassung | /workspace/nexify/10_evidence/scan/SYSTEMWEITER_SCAN_ZUSAMMENFASSUNG.md |
