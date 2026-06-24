# NeXify Workflow Runtime — Evidence-Index
## Stand: 2026-06-20 14:10 UTC

### Evidence-Verzeichnis
Pfad: `/workspace/nexify/10_evidence/workflow/`

### 1. Health Snapshots (6 Dateien)
| Datei | Zeit | Inhalt |
|-------|------|--------|
| `workflow-health-20260620-133102.json` | 13:31 | Erster Health-Check (brain, qdrant, daemon) |
| `workflow-health-20260620-133111.json` | 13:31 | Fix: /proc daemon check |
| `workflow-health-20260620-135845.json` | 13:58 | Nach PF-004 Pipeline-Integration |
| `workflow-health-20260620-135934.json` | 13:59 | Health Cron Cycle 1 |
| `workflow-health-20260620-140346.json` | 14:03 | Health Cron Cycle 2 |
| `workflow-health-20260620-140846.json` | 14:08 | Health Cron Cycle 3 |

### 2. Implementierungs-Evidence (4 Dateien)
| Datei | Beschreibung |
|-------|-------------|
| `workflow-runtime-evidence-20260620.md` | Runtime-Aktivierung (20→22 Module) |
| `pf004-pipeline-implementierung-20260620.md` | PF-004: ContextLoader, PolicyGate, EvidenceWriter |
| `langlauf-evidence-20260620.md` | Langlauf-Mode: Backup, Health Cron, Skills |
| `system-audit-20260620.md` | System-Audit: Schulden, Lücken, Fixes |

### 3. Kanban-Updates (1 Datei)
| Datei | Beschreibung |
|-------|-------------|
| `kanban-update-20260620.md` | K-028 bis K-031: Runtime-Tasks DONE |

### 4. Run-Evidences (3 Dateien)
Pfad: `/workspace/nexify/10_evidence/workflow/runs/`
- Automatisch von Evidence Writer erstellt bei trigger.completed/failed

### Evidence-Policy
- Health Snapshots: alle 300s via `workflow_health_cron.py`
- Task Runs: automatisch via `evidence_writer.py` (EventBus)
- Workflow State Backup: alle 600s via `workflow_backup.py`
- Manual: evidence-pflichtige Änderungen via Write

### Coverage
| Bereich | Evidence | Status |
|---------|----------|--------|
| Runtime Health | 6 Snapshots (300s Interval) | 🟢 |
| PF-004 Pipeline | 4 Dokumente | 🟢 |
| System Audit | 1 Dokument (25 Schulden-Punkte) | 🟢 |
| Kanban | 1 Update (K-028 bis K-031) | 🟢 |
| Trigger Tasks | Automatisch pro Run | 🟢 |
| Workflow State | Backup alle 600s | 🟢 |
