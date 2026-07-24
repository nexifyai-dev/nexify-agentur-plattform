# Workflow Runtime — PF-004 Pipeline Implementierung
## Evidence 2026-06-20

### Was wurde umgesetzt

#### 1. Policy Gate (PF-004 Stufe 4) — NEU
**Modul:** `services/runtime/policy_gate.py`
- 4 Checks: Security (Suspicious-Patterns), Circuit Breaker (5 Failures → OPEN → 30s Half-Open), Rate Limit (10/30s pro Target), Permission (implicit PASS für interne Events)
- Subscribe auf `trigger.completed`/`trigger.failed` für Circuit-Breaker-Status
- Publisht `policy.pass` oder `policy.block` Events

**Integriert in:** `execution_dispatcher.py` — vor dispatch wird policy_gate.check() aufgerufen
**Getestet:** Normaler Task → PASS ✅ | Suspicious Payload (rm -rf/DROP TABLE) → BLOCK ✅

#### 2. Evidence Writer (PF-004 Stufe 6) — NEU
**Modul:** `services/runtime/evidence_writer.py`
- Subscribe auf `trigger.completed`/`trigger.failed`
- Schreibt strukturierte Evidence JSON in `/workspace/nexify/10_evidence/workflow/runs/`
- Enthält: evidence_id, timestamp, task_id, run_id, status, details, policy-gate-reference

#### 3. Execution Dispatcher — ERWEITERT
**Modul:** `services/runtime/planner_runtime/execution_dispatcher.py`
- Policy Gate Check vor jedem Dispatch
- Zusätzlicher Listener für `planner.task` (vorher nur `org.team_assembled`)
- Trigger Executor Fallback für unbekannte/nicht-existente Script-Targets
- Script-Pfade korrigiert (hardcoded → `/workspace/`)

### PF-004 Pipeline (IST-Stand nach Implementierung)
```
Trigger (planner.task)
  → Validator (execution_dispatcher._on_task)
  → Policy Gate (policy_gate.check) ← NEU
  → Executor (trigger.execute / trigger_executor)
  → Evidence Writer (evidence_writer) ← NEU
  → Brain/agentmemory Sync (fehlt: agentmemory DOWN)
  → Retry/Recovery (trigger_executor: try/except)
  → Abort Condition (policy_gate: circuit breaker)
```

### Runtime Modul-Liste (22/22 aktiv)

| # | Modul | PF-004 Schritt | Status |
|---|-------|---------------|--------|
| 1 | persistent-workflow-state | State Tracking | ✅ |
| 2 | workflow-reasoning | Decision Support | ✅ |
| 3 | mcp-workflow-adapter | MCP Bridge | ✅ |
| 4 | live-topology | System View | ✅ |
| 5 | capability-state | Team Mapping | ✅ |
| 6 | planner-daemon | Plan Cycle (Trigger) | ✅ |
| 7 | priority-runtime | Priority Queue | ✅ |
| 8 | planner-events | Event Driver | ✅ |
| 9 | execution-dispatcher | Dispatch (Validator + Policy) | ✅ |
| 10 | delivery-events | Delivery Events | ✅ |
| 11 | recovery-events | Recovery Events | ✅ |
| 12 | governance-events | Governance Events | ✅ |
| 13 | drift-events | Drift Events | ✅ |
| 14 | org-events | Org Events | ✅ |
| 15 | org-state-graph | Org State | ✅ |
| 16 | runtime-watcher | Runtime Health | ✅ |
| 17 | taskgraph-runtime | Task Graph | ✅ |
| 18 | planner-memory | Memory Sync | ✅ |
| 19 | pr-generator | PR Generation | ✅ |
| 20 | trigger-executor | Executor (PF-004 Stufe 5) | ✅ |
| 21 | policy-gate | Policy Gate (PF-004 Stufe 4) | ✅ NEU |
| 22 | evidence-writer | Evidence Writer (PF-004 Stufe 6) | ✅ NEU |

### Nächste Schritte (PF-004 Lücken)
1. **Context Loader (Stufe 3)** — Brain-Query vor Dispatch
2. **agentmemory Sync (Stufe 7)** — benötigt agentmemory UP
3. **Review Hook (Stufe 8)** — PR-Review-Trigger
4. **Rollback (global)** — Snapshot/Restore-Mechanismus
