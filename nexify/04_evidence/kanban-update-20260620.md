# Workflow Runtime — Kanban Update 2026-06-20

## Neuer Status

### Workflow Runtime (NEU)
- **20/20 Module aktiv** seit 13:06 UTC
- **Workflow State persistiert** in `workflow_persist.json` (Rotation bei 100)
- **Execution Dispatcher** repariert (5 hardcoded Pfade, Trigger-Fallback)
- **Trigger Executor** läuft (6 Task-Typen, lokaler Fallback)
- **E2E Dispatch Chain** verifiziert ✅

### Services
| System | Status | Änderung |
|--------|--------|----------|
| Brain API (9090) | ✅ UP | 833 Einträge, 97 Kategorien |
| Qdrant (6333) | ✅ UP | 4 Collections, 8.769 Vektoren |
| Workflow Runtime | ✅ UP | Daemon PID 697 |
| Redis (6379) | ❌ DOWN | Docker/root blocked |
| Agentmemory (40000) | ❌ DOWN | Docker fehlt |
| API Server (8001) | ❌ DOWN | MongoDB fehlt |

### Task-Status

| ID | Task | Status | Owner | Stand |
|----|------|--------|-------|-------|
| K-001 to K-012 | P0 Dokumentation | ✅ DONE | Systemmaster | Unverändert |
| K-013 | Website/Portal-Blueprint | 🟡 VORBEREITET | Sales/UX | Unverändert |
| K-014 | KI-Berater-SOP + API-Katalog | 🟡 VORBEREITET | Backend | Unverändert |
| K-015 | Angebots-SOP + Sales Blueprint | 🟡 VORBEREITET | Sales | Unverändert |
| K-022 | MongoDB starten (API Fix) | 🔴 OFFEN | Betrieb | **Status: Kein root für apt/docker** |
| K-023 | Qdrant vektorisieren | 🟡 TEILWEISE | Brain | **8.769 Vektoren vorhanden, `nexifyai_rules` leer** |
| K-024 to K-027 | Directories befüllen | 🔴 OFFEN | Governance | Unverändert |

### Neue Artefakte
- `services/runtime/start_workflow_runtime.py` — Runtime-Launcher (20 Module)
- `services/runtime/trigger_executor.py` — Trigger.dev Fallback (6 Tasks)
- `services/runtime/execution_dispatcher.py` — Fix Dispatch-Pfade
- `services/runtime/workflow_health.py` — Health Dashboard
- `services/runtime/prepare_qdrant_rules_loader.py` — Rules-Import (403 Rules)
- `/tmp/qdrant_rules_batch.json` — Qdrant-Rules-Export
- `skills/devops/workflow-orchestration/` — Runbook-Skill
- `nexify/10_evidence/workflow/` — Evidence (2 Health Snapshots + MD)

### Nächste Schritte (vorgeschlagen)
1. MongoDB starten für API Server (benötigt Docker/root)
2. Agentmemory starten (benötigt Docker oder apt-Install)
3. X-Brain-Token für /store Endpoint finden → Rules in Qdrant laden
4. Trigger Executor Tasks mit Web-Search erweitern (Tavily Key)
5. Qdrant indexing_threshold bei 10k auto-index
