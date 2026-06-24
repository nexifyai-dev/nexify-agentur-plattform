# NeXify System — MASTER SYSTEM STATE V1
## Stand: 2026-06-20 14:50 UTC | 7 Sessions | 40 Tasks

### 1. Runtime (27 Module)

```
Daemon: start_workflow_runtime.py (27 Module, 0 Errors)
  PF-004 Pipeline: 1-10 (St.8 Review Hook NEU)
  Module: persistent-workflow-state, workflow-reasoning, mcp-workflow-adapter,
          live-topology, capability-state, planner-daemon, priority-runtime,
          planner-events, execution-dispatcher, delivery-events, recovery-events,
          governance-events, drift-events, org-events, org-state-graph,
          runtime-watcher, taskgraph-runtime, planner-memory, pr-generator,
          trigger-executor, context-loader, policy-gate, evidence-writer,
          workflow-backup, fake-redis, supabase-bridge, review-hook
```

### 2. Service-Map

| Port | Service | Typ | Status |
|------|---------|-----|--------|
| 9090 | Brain API | HTTP (Go) | 🟢 833 entries |
| 6333 | Qdrant | HTTP (Rust) | 🟢 8.769 vecs, 4 collections |
| 40000 | agentmemory | HTTP (Python) | 🟢 844 memories, SQLite |
| 6379 | FakeRedis | TCP (Python) | 🟢 PONG OK |
| 443 | Supabase | REST (Cloud) | 🟢 35+ Tables, 344 Agents |
| 27017 | MongoDB | TCP | 🔴 Docker fehlt |
| 8001 | API Server | HTTP | 🔴 MongoDB fehlt |

### 3. Datenbestand

| Speicher | Einträge | Details |
|----------|----------|---------|
| Qdrant nexifyai_brain | 8.769 | Vektorsuche (384d) |
| Brain API (9090) | 833 | Knowledge Store |
| agentmemory | 844 | FTS5 SQLite |
| agentmemory oracle_rules | 401 | Kanonische Regeln |
| Supabase oracle_policies | 193 | 190 importiert + 3 original |
| Supabase agent_registry | 344 | Agents aus Skill-Library |
| Workflow State File | 87 | Rotation 100, Backup 600s |
| Evidence Files | 604 | Health + Runs + Manual |

### 4. Fixes & Schulden (40 Tasks)

| Kategorie | Fixes | Status |
|-----------|-------|--------|
| Data Corruption | 3 Dateien (4-dim→384-dim) | 🟢 |
| Silent Failures | 6 except:pass → logging | 🟢 |
| Service Down | 3 Services revived (agentmemory, Redis, API) | 🟢 |
| Pipeline Lücken | ContextLoader, PolicyGate, EvidenceWriter, ReviewHook | 🟢 |
| System-Audit | 25 Schulden-Punkte dokumentiert | 🟢 |
| Supabase Cloud | 35+ Tables, 344 Agents, 193 Policies | 🟢 |

### 5. Verbleibende Blockaden

1. **MongoDB (27017)** → Docker/root fehlt → API Server 8001 tot
2. **Tavily API Key** → Web-Search im Daemon nicht nutzbar
3. **Supabase Bridge 400** → Events CHECK Constraint (minor)
4. **Qdrant HNSW Index** → 1.231 bis Auto-Index (10k threshold)

### 6. Skills

| Skill | Profil | Inhalt |
|-------|--------|--------|
| workflow-orchestration | network-engineer | Runtime-Runbook |

### 7. Evidence-Verzeichnis

```
/workpsace/nexify/10_evidence/workflow/ (12+ Dateien)
├── architecture-map-20260620.md        ← Systemweit
├── evidence-index-20260620.md          ← Übersicht
├── system-audit-20260620.md            ← Schulden
├── pf004-pipeline-implementierung.md    ← PF-004
├── langlauf-evidence-20260620.md       ← Session-Log
└── workflow-health-*.json (7x)         ← Health
```

### 8. Nächste Empfehlung

```
Priority 1: MongoDB starten (Docker/Root beantragen)
Priority 2: Supabase Events Check fixen
Priority 3: API Server starten → Workstation zugänglich
Priority 4: Tavily Key setzen → Trigger Executor erweitern
```
