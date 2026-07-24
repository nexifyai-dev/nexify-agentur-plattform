# Workflow Runtime — Langlauf-Evidence 2026-06-20

## Runtime Status (Ende Zyklus)

### 23/23 Module aktiv

| # | Modul | PF-004 | Gegründet | 
|---|-------|--------|-----------|
| 1 | persistent-workflow-state | State | ✅ |
| 2 | workflow-reasoning | Decision | ✅ |
| 3 | mcp-workflow-adapter | Bridge | ✅ |
| 4 | live-topology | View | ✅ |
| 5 | capability-state | Teams | ✅ |
| 6 | planner-daemon | Trigger | ✅ |
| 7 | priority-runtime | Queue | ✅ |
| 8 | planner-events | Events | ✅ |
| 9 | execution-dispatcher | Dispatch | ✅ |
| 10-14 | delivery/recovery/gov/drift/org | Events | ✅ |
| 15 | org-state-graph | State | ✅ |
| 16 | runtime-watcher | Health | ✅ |
| 17 | taskgraph-runtime | Graph | ✅ |
| 18 | planner-memory | Memory | ✅ |
| 19 | pr-generator | PR | ✅ |
| **20** | **trigger-executor** | **Executor** | ✅ **NEU** |
| **21** | **context-loader** | **Stufe 3** | ✅ **NEU** |
| **22** | **policy-gate** | **Stufe 4** | ✅ **NEU** |
| **23** | **evidence-writer** | **Stufe 6** | ✅ **NEU** |

### Health Cron (separater Daemon)
- `workflow_health_cron.py --daemon` läuft, alle 300s
- Schreibt Health-Snapshots nach `/workspace/nexify/10_evidence/workflow/`

### Rollback (PF-004 Stufe 10)
- Pre-Dispatch Snapshots in `services/runtime/state/rollback/`
- Automatisch vor jedem Dispatch

### Dispatch Chain (E2E verifiziert)
```
planner.task
  → execution-dispatcher._on_task
  → Context Loader (Brain-Query) ← NEU
  → Rollback Snapshot ← NEU
  → Policy Gate (Security/Circuit/Rate/Perm) ← NEU
  → trigger.execute (Event)
  → trigger-executor (Brain API oder Stub)
  → trigger.completed/failed (Event)
  → Evidence Writer (JSON) ← NEU
```

## Offene Blockaden
1. agentmemory (40000) — DOWN (Docker fehlt)
2. Redis (6379) — DOWN (kein root)
3. MongoDB — DOWN (kein root)
4. API Server (8001) — DOWN (MongoDB)
5. X-Brain-Token — unbekannt (403 Rules ungeladen)
6. Tavily Key — nicht in env (Trigger Stubs bleiben Stubs)
7. PF-004 Stufe 7-9: agentmemory Sync, Review Hook, Context Loader vollständig

## Nächste Optimierungen
1. Context Loader Enhanced — auch auf `generate-report`/`competitor-monitor` anwenden
2. Qdrant HNSW-Index aktiviert sich bei 10k Punkten (aktuell 8769)
3. Trigger Executor Deep-Research — Brain API Query aktiv, andere Stubs
4. Kanban-Update in `/workspace/nexify/08_kanban_tasks/`

## Skills aktualisiert
- `workflow-orchestration` — existiert, enthält Runtime-Runbook
