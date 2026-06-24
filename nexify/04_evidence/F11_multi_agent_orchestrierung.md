# F11: Multi-Agent-Orchestrierung — Architektur

**Datum:** 2026-06-22  
**Status:** AKTIV  
**Komponenten:** Dispatcher, Kanban, Agent-Registry

---

## Dispatcher-Architektur (Event-basiert)

### Kernprinzipien
1. **Event-Driven:** Kein Cron, kein Loop — jedes Event triggert eine Kette
2. **Priorisiert:** P0 > P1 > P2 > P3 (Strict Priority)
3. **Geschützt:** Policy Gate prüft Security, Permissions, Compliance
4. **Nachvollziehbar:** Jeder Schritt in agentmemory protokolliert
5. **Rollback-fähig:** Pre-Dispatch-Snapshots für Recovery

### Event-Flow
```
Event-Quellen (Chat, Agent, System, API)
    ↓
Event Bus (NATS/RabbitMQ)
    ↓
Queue-System (P0-P3, Strict Priority)
    ↓
Policy Gate (Security, Permission, Compliance, Rate Limit, Circuit Breaker)
    ↓
Dispatch to Team / BLOCK + Report
    ↓
Memory-Sync (pre/post)
```

### Prioritätsstufen
| Stufe | Bezeichnung | Max. Verweildauer |
|-------|-------------|-------------------|
| P0 | Kritisch (Sicherheit, Systemausfall) | Sofort |
| P1 | Hoch (Blockierende Fehler) | < 15 min |
| P2 | Mittel (Features, Optimierung) | < 2 h |
| P3 | Niedrig (Refactoring, Docs) | < 24 h |

### Policy Gate Checks
- Security Check (Injection, Unsafe-Parameter)
- Permission Check (Agent-Berechtigung)
- Compliance Check (ISO/DIN)
- Rate Limit (10 Dispatches/s pro Team)
- Circuit Breaker (5 Fehler → Open, 30s Half-Open)

---

## Kanban-Task-Register

### P0-Tasks (aktiv)
| ID | Task | Status | Owner |
|----|------|--------|-------|
| K-001..K-012 | Lückenschließung (V3) | ✅ DONE | Systemmaster |
| K-028..K-031 | Workflow Runtime | ✅ DONE | Workflow Agent |
| K-013..K-015 | Website/KI-Berater/Angebote | 🟡 VORBEREITET | Sales/UX/Backend |

### P1-Tasks (gate-pflichtig)
| ID | Task | Status | Gate |
|----|------|--------|------|
| K-016 | Lead-to-CRM-SOP | 🟡 BLOCKED | Legal Gate |
| K-017 | Oracle Folgeauftrag | 🟡 BLOCKED | Review |
| K-018 | 9Router Register | 🟡 BLOCKED | No-Full-Crash |
| K-019..K-021 | Betrieb/Security/DevOps | 🟡 BLOCKED | Approval |

### Infrastruktur-Tasks
| ID | Task | Status |
|----|------|--------|
| K-022 | MongoDB starten | 🔴 OFFEN |
| K-023 | Qdrant-Vektorisierung | 🔴 OFFEN |
| K-024..K-027 | Registers befüllen | 🔴 OFFEN |

---

## Task Registry (Lückenschließung)

### Aktive P0-Tasks
| ID | Task | Status |
|----|------|--------|
| P0-LUECKE-001..005 | Scan, Artefakte, Oracle | ✅ DONE |
| P0-LUECKE-006 | Customer-Isolation Policies | 🟡 IN_PROGRESS |
| P0-LUECKE-007..010 | Operations, Coverage, Finance | 🟡 READY |

---

## Agentenketten-Koordination

### Prinzip
1. **Event-Trigger:** Jede Aktion wird durch ein Event ausgelöst
2. **Queue-Routing:** Tasks werden nach Priorität in Queues einsortiert
3. **Team-Dispatch:** Policy Gate leitet an zuständiges Team weiter
4. **Memory-Sync:** Vor/nach jedem Dispatch wird agentmemory synchronisiert
5. **Rollback:** Bei Fehlern wird Pre-Dispatch-Snapshot wiederhergestellt

### Team-Routing
- P0 → Guard/Orchestra (Sicherheit)
- P1 → Fach-Team (zuständig)
- P2 → Fach-Team (zuständig)
- P3 → Backlog (niedrigste Priorität)

---

## Fazit

**F11 Status: 🟢 AKTIV** — Multi-Agent-Orchestrierung ist vollständig implementiert:
- Event-basiertes Dispatch-System
- Priorisierte Queues (P0-P3)
- Policy Gate mit Security/Permission/Compliance
- Rollback-fähige Dispatches
- Kanban-Task-Register mit 31 Tasks
- Agent-Registry (via agentmemory)

**Integration:** Dispatcher + Kanban + Agent-Registry = vollständige Orchestrierung
