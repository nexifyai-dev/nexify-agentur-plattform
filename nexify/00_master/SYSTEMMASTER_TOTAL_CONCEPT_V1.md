# Systemmaster Total Concept V1

**Status**: VERBINDLICH | **Scope**: NEXIFY_INTERNAL | **Gültigkeit**: dauerhaft, systemweit
**Erstellt**: 2026-06-11T17:36Z (UTC) / 2026-06-11T19:36+0200 (Europe/Berlin)
**Letztes Update**: 2026-06-11T17:53Z (UTC) / 2026-06-11T19:53+0200 — Iteration 175
**Vorgänger**: Iteration 157 (SYSTEMMASTER_TOTAL_CONCEPT_157.md)
**Quellen**: Brain API (9090), Qdrant (6333), Docker (ps), systemd (timers), Workspace, Secrets, 9Router, Cloudflare, Nexify API Logs, Operating Data, Evidence, Shared State, Tool Index, Oracle

---

## 1. Systemidentität

NeXify AI — Agentic AI Operating System.
Ziel: Vollautonomer Agentur-Betrieb mit 3 Agenten (Claude Code, Goose CLI, Goose ACC).
VDS: srv1243952 | 8 Cores | 31GB RAM | 387GB Disk (24% used).
Ubuntu 7.0.0-22 | Docker: 21 Container laufend | Uptime: >28h

---

## 2. LIVE-HEALTH (2026-06-11T17:53Z)

### GRÜN (Healthy)
| Dienst | Status | Detail |
|--------|--------|--------|
| Brain API (9090) | ✅ OK | 667 Einträge, 2 Collections, 21206s uptime, 56 Kategorien |
| Qdrant (6333) | ✅ OK | v1.18.2, 4 Collections |
| 9Router (32794) | ✅ OK | v0.4.71, 14 Modelle, combo-llm Default, sticky:3 |
| Redis (6379) | ✅ OK | PONG |
| Traefik (:80/:443) | ✅ OK | 28h uptime |
| Nexify Proxy (32768) | ✅ OK | node:22, 28h uptime |
| Coolify AgentMemory | ✅ OK | 28h uptime, healthy |
| Supabase Stack (12 Container) | ✅ OK | pg17, auth, rest, realtime, storage, edge, kong, vector, analytics, studio, pg_meta, inbucket |
| Hermes WebUI (3 Instanzen) | ✅ OK | 19-28h uptime, alle healthy |
| Cloudflare Tunnel | ✅ AKTIV | brain.nexifyai.cloud (200, 57ms), agentmemory.nexifyai.cloud (404, 508ms) |
| Systemd Timer (13 nexify) | ✅ AKTIV | Alle aktiv, 5min-24h Intervalle |

---

## 2.1 KORREKTURVERMERK — 9Router-Port (2026-06-14)

> **Hinweis (additiv, keine Manipulation historischer Werte):**
>
> Der oben dokumentierte Port `32794` ist **veraltet**. Kanonisch gilt seit
> 2026-06-14 (P0-Phase 2 Block A):
>
> ```text
> 9ROUTER_HOST = 127.0.0.1
> 9ROUTER_PORT = 20128
> 9ROUTER_API_BASE = http://127.0.0.1:20128/v1
> ```
>
> Verifikation 2026-06-14: 9Router-Docker-Container `9router-6kxn-niner-router-1`
> lauscht auf `127.0.0.1:20128`. Endpoint-Test `GET /v1/models` mit
> `Authorization: Bearer <token>` → HTTP 200, 14 Modelle (inkl.
> `nexifyai-combo-llm`).
>
> Die alten `32794`-Referenzen in:
> - `/workspace/nexify/SYSTEMMASTER_TOTAL_CONCEPT_v5_*.md` (Snapshots)
> - `/workspace/nexify/07_tools_cli/9router/02_config/*.md` (teilweise Doku)
> - `/root/.nexify/agent-system/...` (historische Reports)
>
> bleiben **unverändert** (Historische Evidence wird nicht manipuliert).
> Folge-Korrekturen: siehe `10_evidence/claude_startup/PHASE2_BLOCK_A_2026-06-14.md`
> und `04_register/PFLICHTDOKUMENTE_REALPFAD_MAPPING_2026-06-14.md`.

### ROT (Kritisch) — UNVERÄNDERT
| Dienst | Status | Detail |
|--------|--------|--------|
| **Nexify API** | ❌ CRASH LOOP | MongoDB connection refused (localhost:27017). Container restartet alle 20s. |

### GELB (Verbesserungswürdig)
| Bereich | Status | Detail |
|---------|--------|--------|
| Brain Memories | ⚠️ 0 | nexifyai_memories leer (vorher 2) |
| Brain Projects | 🔴 0 | nexifyai_projects nie befüllt |
| Brain Rules | 🔴 0 | nexifyai_rules nie befüllt |

### BLAU (Deaktiviert/Geplant)
| Bereich | Status | Detail |
|---------|--------|--------|
| Goose ACC | 🔵 ON-DEMAND | Konfiguriert, kein Daemon |
| You.com Provider | 🔵 UNREGISTERED | Key vorhanden, nicht in 9Router DB |
| Hostinger MCP | 🔵 UNGENUTZT | 139 Tools, nicht genutzt |
| PlanetScale MCP | 🔵 FAILED | Plugin-Ladefehler |
| AgentMemory MCP | 🔵 GETESTET | Nicht in settings.json |

---

## 3. NEXIFY API CRASH — ROOT CAUSE (UNVERÄNDERT)

```
pymongo.errors.ServerSelectionTimeoutError: localhost:27017: Connection refused
```

- **Ursache**: Kein MongoDB-Container. Port 27017 frei.
- **Fix-Optionen**:
  A. MongoDB starten: `docker run -d --name mongo-nexify mongo:7`
  B. Supabase-PostgreSQL als ALT verwenden
  C. MongoDB aus API-Code entfernen
- **Empfehlung**: Option A — minimal, sofort, kein Code-Change

---

## 4. BRAIN & KNOWLEDGE

| Collection | Brain API | Qdrant | Status |
|------------|-----------|--------|--------|
| nexifyai_brain | 667 (△ +3) | 4441 | ✅ OK |
| nexifyai_memories | 0 (▽ -2) | 2 | ❌ Leer |
| nexifyai_projects | — | 0 | ❌ Nie befüllt |
| nexifyai_rules | — | 0 | ❌ Nie befüllt |

**Top-Kategorien (56 total)**:
process:145 | governance:124 | autopilot-execution:58 | security:50
evidence:47 | quality:34 | operating-data:25 | rule:25
architecture:19 | brain:17 | memory:16 | oracle-rule:15

**Offene Lücken**:
- L-01: nexifyai_memories = 0
- L-02: nexifyai_projects = 0
- L-03: nexifyai_rules = 0 (403 Regeln kanonisiert, nicht vektorisiert)
- L-04: 2 Brain-Sync-Files pending (seit Iteration 157)

---

## 5. AGENT SYSTEM

| Agent | Rolle | Status |
|-------|-------|--------|
| Claude Code 2.1.167 | Primary Bulk Executor | ✅ AKTIV |
| Goose CLI 1.37.0 | System-CLI/MCP/Runtime | ✅ INSTALLIERT |
| Goose ACC | Orchestrator | 🔵 ON-DEMAND |

**AgentMemory**: coolify-agentmemory-1 (28h). Secret fehlt (401). MCP standalone getestet.

**Shared State**: 3285 bytes, 3 Agenten, zuletzt 17:36Z. Meta-Prompt SHA verified.

**Handoff**: Outbox leer. Keine Agent-Kommunikation.

---

## 6. WORKSPACE (25 DIRS, ~195 FILES)

| Dir | Files | Status |
|-----|-------|--------|
| 01_agenten_seele | 1 | ✅ |
| 02_auftraege | 2 | ✅ |
| 03_regelwerke | 25 | ✅ |
| 04_projects | 2 | ✅ |
| 05_skills | 3 | ✅ |
| 06_mcp | 7 | ✅ |
| 07_security_secrets | 10 | ✅ |
| 07_tools_cli | 12 | ✅ |
| 08_kanban_tasks | 1 | ✅ |
| 09_dispatcher | 18 | ✅ |
| 10_evidence | 50 | ✅ |
| 11_brain_sync | 2 | ⚠️ Pending |
| 12_agentmemory | 8 | ✅ |
| **16_din_iso** | **0** | **🔴 LEER** |
| 18_logs_monitoring | 1 | ✅ |
| 20_pruefverfahren | 1 | ✅ |
| **27_audits** | **0** | **🔴 LEER** |
| **28_feedbackschleifen** | **0** | **🔴 LEER** |
| **29_self_optimization** | **0** | **🔴 LEER** |
| 30_operating_data | 25 | ✅ |
| 31_oracle | 13 | ✅ |
| 99_archiv | 2 | ✅ |

4 leere Dirs seit Iteration 157 unverändert.

---

## 7. GOVERNANCE

- 25 Regelwerke (18 MD + 7 JSON)
- 403 kanonisierte Regeln (8 Kategorien)
- 13 Systemd Timer
- Oracle: 8 Architectural Documents
- Promptmaster: 12 Prompts, 8 geschützte Kategorien

---

## 8. SICHERHEIT

- 15 Secrets in /root/.nexify/secrets/ (mode 600/700)
- 4 9Router API Keys
- Secret Rotation: WAITING_FOR_APPROVAL (seit 157)
- AgentMemory Secret: FEHLT
- PII-Patch branch: unvalidiert

---

## 9. MCP & CAPABILITIES

- 48 Capabilities, 154 Frequency-Matrix, 171 Permission-Matrix
- Ungenutzt: Hostinger (139 Tools), AgentMemory MCP
- Failed: planetscale, ralph-wiggum

---

## 10. 9ROUTER (14 Modelle)

nexifyai-combo-llm (deepseek-reasoner + v4-flash, sticky:3)
NScale: Llama-3.3-70B, Qwen2.5-Coder-32B
OpenRouter-free: nemotron, kimi, nex-n2, qwen3-coder
DeepSeek: v4-pro, v4-flash, chat, reasoner

---

## 11. LÜCKEN-MATRIX

### KRITISCH
| ID | Lücke | Seit |
|----|-------|------|
| C-01 | Nexify API Crash Loop (MongoDB) | 157+ |
| C-02 | nexifyai_rules = 0 (403 Regeln) | 157+ |
| C-03 | nexifyai_memories = 0 | 157+ (△ verschlechtert) |
| C-04 | Brain-Sync-Pending unverarbeitet | 157+ |

### HOCH
| ID | Lücke | Seit |
|----|-------|------|
| H-01 | nexifyai_projects = 0 | 157+ |
| H-02 | 16_din_iso, 27_audits, 29_self_optimization leer | 157+ |
| H-05 | AgentMemory Secret fehlt | 157+ |
| H-06 | Secret Rotation pending | 157+ |
| H-07 | You.com nicht in 9Router DB | 157+ |

### MITTEL
| ID | Lücke | Seit |
|----|-------|------|
| M-01 | AgentMemory MCP nicht integriert | 157+ |
| M-02 | Handoff Outbox leer | 157+ |
| M-03 | Goose ACC kein Daemon | 157+ |
| M-05 | Failed Plugins | 157+ |

---

## 12. METRIKEN-VERGLEICH

| Metrik | Iteration 157 | Iteration 175 | Trend |
|--------|---------------|---------------|-------|
| Brain Einträge | 664 | 667 | ▲ +3 |
| Memories | 2 | 0 | ▼ -2 |
| Rules/Projects vec | 0 | 0 | ➡️ |
| API Crash | ❌ | ❌ | ➡️ |
| Leere Dirs | 4 | 4 | ➡️ |
| Pending Sync | 2 | 2 | ➡️ |

---

## 13. NÄCHSTE SCHRITTE

### Phase 1a — API stabilisieren (SOFORT)
1. MongoDB starten: `docker run -d --name mongo-nexify --restart=unless-stopped -p 27017:27017 mongo:7`
2. Nexify API prüfen

### Phase 1b — Brain Sync (10 min)
3. 2 pending Files persistieren
4. Brain Bestand prüfen

### Phase 2 — Knowledge (Heute, 30 min)
5. 25 Regelwerke in nexifyai_rules vektorisieren
6. Projekte in nexifyai_profiles vektorisieren
7. Memory füllen (50+ Observations)

### Phase 3 — Resilience (Diese Woche)
8. AgentMemory Secret setzen
9. AgentMemory MCP in settings.json integrieren
10. You.com in 9Router DB eintragen
11. Secret Rotation durchführen

### Phase 4 — Compliance
12. Erstes Audit in 27_audits/
13. ISO-Normen in 16_din_iso/
14. Feedback-/Optimization initialisieren

### Phase 5 — Langfristig
15. Goose ACC Daemon aktivieren
16. PII-Patch validieren
17. Failed Plugins reparieren

---

## 14. ARCHITEKTUR-KERN

```
External Provider → 9Router (SPOF, 4-stufig)
  ↓
┌─────────┐ ┌────────┐ ┌────────┐
│Claude   │ │Goose   │ │Goose   │
│Code     │ │CLI     │ │ACC     │
└────┬────┘ └────┬───┘ └────┬───┘
     └────┬──────┘──────────┘
          ↓
┌──────────┐ ┌──────────┐
│Brain API │ │AgentMem  │
│(Qdrant)  │ │(iii-eng) │
└──────────┘ └──────────┘
```

**SPOFs**: 9Router (gemildert), AgentMemory SQLite (ungemildert), Dispatcher (DLQ), Cloudflare DNS (kein Backup)

---

## 15. CUSTOMER BOUNDARIES

- Studienkolleg Aachen: CUSTOMER — VERBOTEN
- Affilientportal/Bookando: CUSTOMER — VERBOTEN

---

## 16. AUTOPILOT PRIORITIES

1. MongoDB starten → API fix — P0
2. Brain Sync — P1
3. Rules vektorisieren — P1
4. AgentMemory Secret + MCP — P2
5. You.com Provider — P2
6. Secret Rotation — P3
7. Audit/Compliance — P3

---

*Erstellt 2026-06-11. Nächstes Update: bei Systemänderung oder nächster Iteration.*
