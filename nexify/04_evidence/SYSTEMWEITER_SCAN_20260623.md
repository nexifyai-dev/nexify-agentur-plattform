# Systemweiter Scan — NeXify AI OS
**Datum:** 2026-06-23 00:01 UTC  
**Agent:** Systemmaster Agent  
**Status:** ✅ VOLLSTÄNDIG

---

## 1. Gesamtübersicht

| Metrik | Wert |
|--------|------|
| **Gesamtgröße /workspace/** | **6.4 GB** |
| **Gesamtanzahl Verzeichnisse** | 17 Top-Level-Ordner |
| **Scan-Bereiche** | 4 (Workspace, Platform, Adapter, VPS) |

---

## 2. Workspace Scan — /workspace/nexify/

### 2.1 Struktur
- **Größe:** 1.2 GB
- **Dateien:** 37.270
- **Hauptverzeichnisse:** 52 (nummernbasiertes Layer-System 00–99 + Sonderverzeichnisse)

### 2.2 Top-Verzeichnisse nach Dateianzahl
| Verzeichnis | Dateien | Beschreibung |
|-------------|---------|--------------|
| 20_website_portal/ | 25.058 | Website/Portal (nexifyai-agency-website) |
| 10_evidence/ | 10.036 | Evidence-Sammlung (48 Unterverzeichnisse) |
| 07_tools_cli/ | 1.681 | Tools & CLI (9router, autopilot, hermes, etc.) |
| 99_archiv/ | 112 | Archiv (Legacy, Reports) |
| 30_operating_data/ | 60 | Operating Data, Orchestration |
| 03_regelwerke/ | 59 | Regelwerke (403 canonicalized entries) |
| 04_register/ | 26 | Register |
| 09_dispatcher/ | 24 | Dispatcher & Automation |
| 08_kanban_tasks/ | 22 | Kanban & Task Registry |
| 31_oracle/ | 14 | Oracle Canonical Rules |

### 2.3 Dateitypen (Top 10)
| Typ | Anzahl |
|-----|--------|
| .js | 13.304 |
| .json | 10.930 |
| .map | 5.054 |
| .ts | 3.378 |
| .md | 1.901 |
| .cjs | 251 |
| .rsc | 195 |
| .mjs | 190 |
| .cts | 149 |
| .yml | 138 |

### 2.4 Kernverzeichnisse
- **00_master/** — Master-Konzepte
- **01_agenten_seele/** — Agenten-Identität
- **02_auftraege/** — Aufträge
- **03_regelwerke/** — 403 Regeln + Arbeitsanweisungen
- **04_register/** — Register + Live-Verification
- **05_skills/** — Skills (data-engineer, goose, nexify-knowledge)
- **06_mcp/** — MCP Control Gateway
- **07_tools_cli/** — 9router, autopilot, claude_code, hermes, kilo, rtk
- **09_dispatcher/** — Automation Controller, Chat Operator, Connection Recovery
- **10_evidence/** — 48 Evidence-Kategorien
- **11_brain_sync/** — Brain Sync + Pending
- **12_agentmemory/** — Agent Memory
- **30_operating_data/** — Blueprints, Orchestration Runs
- **31_oracle/** — Canonical Rules (403 Einträge)
- **99_archiv/** — Legacy, Config-Backups

---

## 3. Platform Scan — /workspace/nexifyai-platform/

### 3.1 Struktur
- **Größe:** 1.6 GB
- **Dateien (ohne node_modules/.git):** 17.208
- **Git-Branch:** fix/claude-code-autonomous-systemmaster-integration
- **Repository:** https://github.com/NeXify-AI-by-NeXify-Chat-it-Automat-it/nexifyai-platform

### 3.2 Services & Apps
| Service | Typ |
|---------|-----|
| services/api/ | Backend API |
| services/automations/ | Automationen |
| services/governance-legacy/ | Legacy Governance |
| services/ops/ | Operations |
| services/project-manager-api/ | Project Manager API |
| services/runtime/ | Runtime |
| services/systemmaster/ | Systemmaster |
| services/temporal/ | Temporal Workflows |
| services/trigger/ | Trigger Service |
| apps/web/ | Web App |
| apps/admin-chat/ | Admin Chat |
| apps/design-tokens/ | Design Tokens |

### 3.3 Packages
| Package | Beschreibung |
|---------|-------------|
| packages/ai-farbrik/ | AI Fabrik |
| packages/analytics/ | Analytics |
| packages/config/ | Config (api-standards, legal, finops, platform, tenants) |
| packages/events/ | Event Taxonomy |
| packages/lib/ | Shared Library |
| packages/services/ | Services Package |
| packages/telemetry/ | Telemetry |
| packages/ui/ | UI Components (tokens, constraints) |
| packages/workflows/ | Workflows |

### 3.4 Infrastructure
- **docker/** — Grafana Dashboards (system-health, brain-analytics, security-overview, customer-overview)
- **deploy/** — nginx-frontend, systemd
- **infrastructure/** — docker, monitoring, ops, supabase, traefik, vercel
- **supabase/** — Migrations, Snippets

### 3.5 Dateitypen (Top 10, ohne node_modules)
| Typ | Anzahl |
|-----|--------|
| .json | 15.745 |
| .py | 626 |
| .md | 324 |
| .js | 104 |
| .jsx | 70 |
| .yml | 45 |
| .ts | 31 |
| .sql | 31 |
| .css | 30 |
| .tsx | 25 |

### 3.6 CI/CD (GitHub Actions)
27 Workflows: ci, deploy, security, test, e2e-test, quality, release, ai-review, a11y-test, boundary-enforcement, design-review, perf-test, openapi-lint, sbom, dependency-review, auto-rebase, branch-cleanup, stale, automation, uptime-check, all-badges, security-secrets, security-container, security-dependencies, issue-triage, issue-triage

### 3.7 Docs
28 Dokumentationsverzeichnisse: architecture (ADRs), audits, governance, integration, policies, security, project-manager, runtime, supabase, system, templates

---

## 4. Adapter Scan — /workspace/hermes-paperclip-adapter/

### 4.1 Struktur
- **Größe:** 134 MB (inkl. node_modules)
- **Dateien (ohne node_modules/.git):** 85
- **Sprache:** TypeScript
- **Build:** npm (Vite)

### 4.2 Source-Dateien
| Datei | Beschreibung |
|-------|-------------|
| src/index.ts | Root: type, label, models |
| src/server/execute.ts | Core Execution (Hermes CLI spawn) |
| src/server/test.ts | Environment Checks |
| src/server/skills.ts | Skills |
| src/server/post-process.ts | Post-Processing |
| src/server/detect-model.ts | Model Detection |
| src/ui/parse-stdout.ts | Stdout → TranscriptEntry |
| src/ui/build-config.ts | UI Form → AdapterConfig |
| src/cli/format-event.ts | Terminal Output |
| src/shared/constants.ts | Shared Constants |

### 4.3 Tests
5 Test-Dateien: detect-model, parse-stdout, execute, post-process, build-config

---

## 5. Weitere Workspace-Verzeichnisse

| Verzeichnis | Dateien | Größe | Beschreibung |
|-------------|---------|-------|-------------|
| customers/ | 118.915 | 1.2 GB | Kundendaten |
| nexify-ai-platform/ | 59.572 | 1.2 GB | Platform-Kopie/Legacy |
| vorratsgesellschaften/ | 25.675 | 963 MB | Vorratsgesellschaften |
| studienkolleg-aachen/ | 491 | 191 MB | Kundenprojekt |
| bookando/ | 368 | 9.9 MB | Kundenprojekt |
| bookando-api/ | 160 | 1.5 MB | Kundenprojekt API |
| memory/ | 5 | 376 KB | Memory |
| configs/ | 8 | 36 KB | Configs |
| nexifyai/ | 35 | 312 KB | NeXify AI |
| e2e-evidence/ | 13 | 56 KB | E2E Evidence |
| backups/ | 4 | 28 KB | Backups |
| docs-web/ | 0 | 0 | Leer |
| reports/ | 0 | 0 | Leer |
| AutoGPT-Self-Healing/ | 0 | 0 | Leer |

---

## 6. Gesamtstatistik

| Metrik | Wert |
|--------|------|
| **Gesamtgröße /workspace/** | **6.4 GB** |
| **nexify/** | 37.270 Dateien, 1.2 GB |
| **nexifyai-platform/** | 17.208 Dateien, 1.6 GB (excl. node_modules) |
| **hermes-paperclip-adapter/** | 85 Dateien, 134 MB |
| **customers/** | 118.915 Dateien, 1.2 GB |
| **nexify-ai-platform/** | 59.572 Dateien, 1.2 GB |
| **vorratsgesellschaften/** | 25.675 Dateien, 963 MB |
| **studienkolleg-aachen/** | 491 Dateien, 191 MB |
| **bookando + bookando-api/** | 528 Dateien, 11.4 MB |
| **Sonstige** | 47 Dateien, 856 KB |

---

## 7. NeXify AI OS — Systemlayer

| Layer | Komponenten |
|-------|-------------|
| **L0 — Master** | 00_master, CLAUDE.md, SYSTEMMASTER_TOTAL_CONCEPT |
| **L1 — Governance** | 01_agenten_seele, 02_governance, 03_regelwerke (403 Regeln) |
| **L2 — Operations** | 04_register, 05_skills, 06_mcp, 07_tools_cli |
| **L3 — Execution** | 08_kanban_tasks, 09_dispatcher, 09_ausfuehrungsauftraege |
| **L4 — Evidence** | 10_evidence (48 Kategorien, 10.036 Dateien) |
| **L5 — Knowledge** | 11_brain_sync, 12_agentmemory, 30_operating_data, 31_oracle |
| **L6 — Archive** | 99_archiv, 99_integration |

---

## 8. Technologie-Stack (identifiziert)

- **Runtime:** Node.js, Python, TypeScript, Docker
- **KI:** 9Router (deepseek-v4-flash + deepseek-reasoner), Hermes Agent
- **Wissen:** Brain API (port 9090), Qdrant (port 6333)
- **Infra:** Hostinger VDS, Cloudflare Tunnel, Vercel
- **Database:** Supabase (PostgreSQL), SQLite
- **CI/CD:** GitHub Actions (27 Workflows)
- **Monitoring:** Grafana Dashboards
- **Adapter:** Hermes Paperclip Adapter (TypeScript)

---

## 9. VPS-Status

> ⚠️ VPS-Scan konnte nicht durchgeführt werden — SSH-Zugang nicht aus diesem Container verfügbar.

---

**Evidence-Pfad:** `/workspace/nexify/10_evidence/scan/SYSTEMWEITER_SCAN_20260623.md`  
**Erstellt von:** Systemmaster Agent  
**Zeitstempel:** 2026-06-23T00:01:00Z
