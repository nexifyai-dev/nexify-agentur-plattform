---
id: DISPATCHER_ARCHITEKTUR_V1
title: Dispatcher-Architektur – Event-basiertes Dispatch-System
version: 1.0.0
status: active
created: 2026-06-10
author: System-Architektur
tags: [dispatcher, events, queue, policy-gate, rollback]
mermaid: dispatcher_flow, queue_system, rollback_flow
---

# DISPATCHER_ARCHITEKTUR_V1 – Event-basiertes Dispatch-System

## Überblick

Der Dispatcher ist das zentrale Nervensystem des Nexify-Agentensystems. Er ist **vollständig event-basiert** – es gibt keine Cron-Jobs, keine Polling-Loops und keine zyklischen Prüfungen. Jede Aktion wird durch ein Event ausgelöst, durchläuft das Queue-System und wird über das Policy Gate an das zuständige Team weitergeleitet.

---

## Architekturprinzipien

1. **Event-Driven**: Kein Cron, kein Loop – jedes Event triggert eine Kette
2. **Priorisiert**: P0 > P1 > P2 > P3 – Tasks werden nach Dringlichkeit sortiert
3. **Geschützt**: Jeder Dispatch durchläuft das Policy Gate
4. **Nachvollziehbar**: Jeder Schritt wird in agentmemory protokolliert
5. **Sicher**: Jeder Dispatch ist rollback-fähig

---

## Systemarchitektur

```
┌─────────────────────────────────────────────────────────┐
│                     Event-Quellen                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │ Chat     │  │ Agent    │  │ System   │  │ Extern  │ │
│  │ Input    │  │ Event    │  │ Event    │  │ API     │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬────┘ │
└───────┼──────────────┼──────────────┼──────────────┼──────┘
        │              │              │              │
        ▼              ▼              ▼              ▼
┌─────────────────────────────────────────────────────────┐
│                 Event Bus (NATS/RabbitMQ)                │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐ │
│  │ agent:start  │  │ task:created │  │ review:req.   │ │
│  │ agent:end    │  │ task:updated │  │ error:crit.   │ │
│  └──────────────┘  └──────────────┘  └───────────────┘ │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    Queue-System                          │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐               │
│  │ P0   │  │ P1   │  │ P2   │  │ P3   │               │
│  │Queue │  │Queue │  │Queue │  │Queue │               │
│  └──┬───┘  └──┬───┘  └──┬───┘  └──┬───┘               │
│     │         │         │         │                     │
│     └─────────┴─────────┴─────────┘                     │
│               │  Strict Priority                         │
│               ▼                                          │
│     ┌──────────────────┐                                │
│     │  Queue Manager   │                                │
│     │  (dequeue +      │                                │
│     │   routing)       │                                │
│     └────────┬─────────┘                                │
└──────────────┼───────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────┐
│                   Policy Gate                            │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐ │
│  │ Security     │  │ Permission   │  │ Compliance    │ │
│  │ Check        │  │ Check        │  │ Check         │ │
│  └──────┬───────┘  └──────┬───────┘  └───────┬───────┘ │
│         │                 │                   │         │
│         └─────────────────┴───────────────────┘         │
│                           │                              │
│                    ┌──────┴──────┐                       │
│                    │   PASS?     │                       │
│                    └──────┬──────┘                       │
└───────────────────────────┼──────────────────────────────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             │             ▼
     ┌────────────┐        │        ┌──────────┐
     │  Dispatch  │        │        │  BLOCK   │
     │  to Team   │        │        │ + Report │
     └────────────┘        │        └──────────┘
                           ▼
                  ┌──────────────────┐
                  │  Memory-Sync     │
                  │  pre/post        │
                  └──────────────────┘
```

---

## Queue-System

### Prioritätsstufen

| Stufe | Bezeichnung | Typische Tasks | Max. Verweildauer |
|-------|-------------|----------------|-------------------|
| P0 | Kritisch | Sicherheitslücken, Systemausfälle, Data-Loss | Sofort |
| P1 | Hoch | Blockierende Fehler, Kunden-Eskalationen | < 15 min |
| P2 | Mittel | Feature-Entwicklung, Optimierungen | < 2 h |
| P3 | Niedrig | Refactoring, Dokumentation, Tech-Debt | < 24 h |

### Queue-Verhalten

- **Strict Priority**: P0-Queue wird immer zuerst geleert, bevor P1 an die Reihe kommt
- **Fairness-Bound**: Nach 10 P0-Tasks wird geprüft, ob P1-Tasks verhungern (Starvation-Prevention)
- **Expiry**: Tasks, die ihre Max-Verweildauer überschreiten, werden eskaliert (→ Team 01)
- **Dead-Letter-Queue**: Tasks, die nach 3 Versuchen fehlschlagen, landen in der DLQ

### Queue-Routing

```
task:created Event ──► Queue Manager
                           │
               ┌───────────┴───────────┐
               │  Routing Key:          │
               │  task.priority.P0      │
               │  task.priority.P1      │
               │  task.priority.P2      │
               │  task.priority.P3      │
               └───────────┬───────────┘
                           │
               ┌───────────▼───────────┐
               │  Team-Routing:         │
               │  - P0 → Guard/Orchestra│
               │  - P1 → Fach-Team      │
               │  - P2 → Fach-Team      │
               │  - P3 → Backlog        │
               └────────────────────────┘
```

---

## Policy Gate

Jeder Dispatch durchläuft **vor** der Weiterleitung das Policy Gate.

### Prüfungen

| Prüfung | Beschreibung | Bei Fail |
|---------|--------------|----------|
| Security Check | Prüft auf Injection, Unsafe-Parameter | BLOCK + Report an Team 10 |
| Permission Check | Prüft, ob der aufrufende Agent berechtigt ist | BLOCK + Report an Team 01 |
| Compliance Check | Prüft Einhaltung von ISO/DIN-Richtlinien | BLOCK + Report an Team 10 |
| Rate Limit | Prüft, ob das Ziel-Team überlastet ist | DELAY + Re-Queue |
| Circuit Breaker | Prüft, ob das Ziel-Team im Closed-State ist | BLOCK + Alarm an Team 03 |

### Konfiguration

```yaml
policy_gate:
  strict_mode: true              # Bei Fail immer blocken
  rate_limit_per_team: 10/s      # Max 10 Dispatches pro Sekunde pro Team
  circuit_breaker:
    failure_threshold: 5         # 5 Fehler → Open
    half_open_after: 30s         # Nach 30s testen
  escalation_on_block: true      # Bei Block an Team 01 melden
```

---

## Memory-Sync (agentmemory)

Vor und nach jedem Dispatch wird der agentmemory synchronisiert.

### Pre-Dispatch (Snapshot)

```yaml
memory_sync:
  pre_dispatch:
    - snapshot: current_context   # Aktuellen Kontext sichern
    - snapshot: task_state        # Task-Status sichern
    - verify: integrity           # Checksumme des Snapshots
  post_dispatch:
    - update: task_state          # Task-Status aktualisieren
    - update: team_context        # Team-Kontext aktualisieren
    - verify: consistency         # Prüfen, ob Snapshot und neuer State konsistent
    - archive: evidence           # Evidence archivieren
```

---

## Rollback-Fähigkeit

Jeder Dispatch ist vollständig rollback-fähig. Der Rollback-Mechanismus basiert auf den Pre-Dispatch-Snapshots.

### Rollback-Trigger

- **Manuell**: Team 01 oder Team 03 löst Rollback aus
- **Automatisch**: Bei Circuit-Breaker-Öffnung oder Critical-Fehler
- **Automatisch**: Bei Policy-Gate-Fail nach erfolgreichem Partial-Dispatch

### Rollback-Prozess

```
1. ROLLBACK_INIT               # Rollback wird gestartet
   │
2. IDENTIFY_SCOPE              # Welche Änderungen betroffen?
   │
3. RESTORE_SNAPSHOT            # Pre-Dispatch-Zustand wiederherstellen
   │
4. VERIFY_INTEGRITY            # Prüfen, ob Snapshot vollständig
   │
5. NOTIFY_STAKEHOLDERS         # Team 01 + betroffene Teams informieren
   │
6. DOCUMENT_ROLLBACK           # Rollback in agentmemory protokollieren
   │
7. COMPLETE                    # Dispatch als "rolled_back" markieren
```

### Rollback-Garantien

- **Snapshots** bleiben 7 Tage lang erhalten
- **Rollback ist idempotent**:
  - Einmal zurückgesetzte Tasks können nicht doppelt zurückgesetzt werden
  - Jeder Rollback hat eine eindeutige Rollback-ID
- **Teil-Rollbacks** möglich:
  - Nur fehlgeschlagene Teile eines Multi-Step-Dispatches zurücksetzen
- **Rollback-Log** in agentmemory für Audit-Zwecke

---

## Event-Typen

| Event | Quelle | Beschreibung |
|-------|--------|--------------|
| `agent:start` | Orchestrator | Ein Agent wurde gestartet |
| `agent:end` | Orchestrator | Ein Agent hat seine Arbeit beendet |
| `task:created` | Intake / System | Ein neuer Task wurde erstellt |
| `task:updated` | Dispatcher | Ein Task wurde aktualisiert |
| `review:required` | Dispatcher / Team | Ein Review wurde angefordert |
| `review:passed` | QR-Team | Review bestanden |
| `review:failed` | QR-Team | Review nicht bestanden |
| `error:critical` | Jedes Team | Ein kritischer Fehler ist aufgetreten |
| `error:recoverable` | Jedes Team | Ein behebbarer Fehler ist aufgetreten |
| `rollback:initiated` | Dispatcher | Ein Rollback wurde gestartet |
| `rollback:completed` | Dispatcher | Ein Rollback wurde abgeschlossen |

---

## Event-Flow-Beispiel (Task-Erstellung)

```
1. User sendet Nachricht ──► Chat Operator
2. Chat Operator ──► agent:start Event
3. agent:start ──► Queue Manager (P1, da User-Anfrage)
4. Queue Manager ──► Policy Gate
5. Policy Gate PASS ──► Dispatch an Team 02 (Intake)
6. Team 02 erstellt User Story ──► task:created Event
7. task:created ──► Queue Manager (P2, da Feature)
8. Queue Manager ──► Policy Gate
9. Policy Gate PASS ──► Dispatch an Team 04 (Kanban)
10. Team 04 priorisiert ──► task:updated Event
... Kaskade bis zum Review durch Team 12
```

---

## Version History

| Version | Datum | Änderung |
|---------|-------|----------|
| 1.0.0   | 2026-06-10 | Initiale Dispatcher-Architektur |
