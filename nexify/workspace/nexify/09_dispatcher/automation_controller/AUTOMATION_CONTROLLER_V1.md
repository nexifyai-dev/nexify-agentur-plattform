---
id: AUTOMATION_CONTROLLER_V1
title: Automation Controller – Zustandsmaschine & Event-Hooks
version: 1.0.0
status: active
created: 2026-06-10
author: System-Architektur
tags: [automation, state-machine, events, safety, circuit-breaker]
mermaid: state_machine, event_hooks, circuit_breaker
---

# AUTOMATION_CONTROLLER_V1 – Zustandsmaschine & Event-Hooks

## Überblick

Der Automation Controller ist das Herzstück des Dispatchers (Team 03). Er steuert den Lebenszyklus jedes Tasks als **endliche Zustandsmaschine**, reagiert auf **Event-Hooks** und setzt **Safety-Limits** durch, um das System vor Fehlverhalten zu schützen.

---

## Zustandsmaschine

Jeder Task durchläuft die folgende Zustandsmaschine:

```
                    ┌──────────────────────────────────────┐
                    │                                      │
                    ▼                                      │
              ┌──────────┐                                 │
     ┌───────►│   IDLE   │◄──── (Neustart / Re-Queue)      │
     │        └────┬─────┘                                 │
     │             │ task:created / dispatch                │
     │             ▼                                        │
     │        ┌──────────┐                                 │
     │        │PROCESSING│◄──── (Wiederaufnahme)            │
     │        └────┬─────┘                                 │
     │             │                                        │
     │     ┌───────┼───────────┐                            │
     │     │       │           │                            │
     │     ▼       ▼           ▼                            │
     │ ┌──────┐ ┌──────┐ ┌────────┐                        │
     │ │ERROR │ │REVIEW│ │ BLOCKED│                        │
     │ └──┬───┘ └──────┘ └───┬────┘                        │
     │    │        │          │                             │
     │    │  ┌─────┘          │                             │
     │    │  │      ┌─────────┘                             │
     │    ▼  ▼      ▼                                      │
     │  ┌──────────┐                                       │
     │  │ COMPLETE │                                       │
     │  └──────────┘                                       │
     │        │                                             │
     └────────┘ (wenn neue Version / Re-Dispatch)
```

### Zustandsdefinitionen

| Zustand | Beschreibung | Exit-Bedingung |
|---------|--------------|----------------|
| `IDLE` | Task wurde erstellt, aber noch nicht gestartet | Dispatch-Event |
| `PROCESSING` | Task wird aktiv bearbeitet | Fertigstellung, Fehler oder Review-Bedarf |
| `REVIEW` | Task wartet auf Qualitätsprüfung (Team 12) | Review-Pass oder Review-Fail |
| `COMPLETE` | Task erfolgreich abgeschlossen | Keine (Endzustand) |
| `BLOCKED` | Task kann nicht fortgesetzt werden (externes Hindernis) | Unblock-Event |
| `ERROR` | Task ist aufgrund eines Fehlers fehlgeschlagen | Max-Retries erreicht oder manueller Reset |

### Zustandsübergänge

| Von | Nach | Bedingung | Aktion |
|-----|------|-----------|--------|
| IDLE | PROCESSING | Dispatch-Event empfangen | Task sperren, Agent starten |
| PROCESSING | REVIEW | Task fertig, Review benötigt | Review-Event auslösen |
| PROCESSING | COMPLETE | Task fertig, kein Review nötig | Evidence archivieren |
| PROCESSING | ERROR | Unbehandelter Fehler | Error-Event auslösen, Retry-Zähler |
| PROCESSING | BLOCKED | Externe Abhängigkeit fehlt | Block-Event auslösen |
| REVIEW | COMPLETE | QR bestanden | Evidence signieren, abschließen |
| REVIEW | PROCESSING | QR nicht bestanden, Überarbeitung | Task zurück an Team |
| BLOCKED | PROCESSING | Blockierung aufgehoben | Task fortsetzen |
| ERROR | IDLE | Retry beschlossen | Task neu einreihen |
| ERROR | BLOCKED | Max-Retries erreicht | Eskalation an Team 01 |

---

## Event-Hooks

Der Automation Controller reagiert auf folgende Events und führt definierte Aktionen aus.

### Hook-Tabelle

| Event | Hook-Aktion | Priorität | Timeout |
|-------|-------------|-----------|---------|
| `agent:start` | Task auf PROCESSING setzen, Timer starten | Hoch | 5s |
| `agent:end` | Ergebnis prüfen, nächsten Zustand bestimmen | Hoch | 10s |
| `task:created` | Task in Queue einreihen, IDLE setzen | Mittel | 5s |
| `task:updated` | Status prüfen, ggf. Zustand wechseln | Mittel | 5s |
| `review:required` | Task auf REVIEW setzen, Team 12 benachrichtigen | Hoch | 5s |
| `review:passed` | Task auf COMPLETE setzen, Evidence archivieren | Hoch | 5s |
| `review:failed` | Task auf PROCESSING setzen, Retry-Zähler erhöhen | Hoch | 5s |
| `error:critical` | Task auf ERROR setzen, Circuit-Breaker öffnen, Alarm | Kritisch | 2s |
| `error:recoverable` | Task auf ERROR setzen, automatischen Retry starten | Mittel | 5s |
| `error:resolved` | Task auf PROCESSING setzen, Circuit-Breaker schließen | Mittel | 5s |
| `rollback:initiated` | Task-Snapshot wiederherstellen | Hoch | 10s |
| `rollback:completed` | Task auf IDLE setzen, Neustart erlauben | Hoch | 5s |

### Hook-Konfiguration

```yaml
event_hooks:
  timeout_default: 5s
  retry_on_timeout: true
  max_hook_retries: 3
  hooks:
    agent:end:
      timeout: 10s
      retry: true
      on_failure: escalate_to_orchestra
    error:critical:
      timeout: 2s
      retry: false
      on_failure: trigger_circuit_breaker
      alarm: true
      notify_teams: [01, 10]
```

---

## Safety-Limits

### Timeout

Jeder Task hat ein konfigurierbares Timeout. Überschreitet die Bearbeitungszeit das Timeout, wird der Task automatisch auf ERROR gesetzt.

| Task-Typ | Default-Timeout | Max-Timeout |
|----------|----------------|-------------|
| P0 (Kritisch) | 5 min | 15 min |
| P1 (Hoch) | 15 min | 30 min |
| P2 (Mittel) | 60 min | 120 min |
| P3 (Niedrig) | 240 min | 480 min |

### Max-Retries

Ein Task kann maximal **3 Mal** wiederholt werden. Nach dem 3. Fehlversuch wird der Task auf BLOCKED gesetzt und an Team 01 eskaliert.

```
Retry-Strategie:
  - 1. Retry: sofort
  - 2. Retry: nach 30s (exponential backoff)
  - 3. Retry: nach 5 min (exponential backoff)
  - Nach 3. Retry: BLOCKED + Eskalation
```

### Circuit-Breaker

Der Circuit-Breaker schützt das System vor kaskadierenden Fehlern.

```
Zustände:
  ┌─────────┐      ┌──────────┐      ┌────────┐
  │ CLOSED  │─────►│   OPEN   │─────►│HALF-OPEN│
  │ (normal)│      │ (failed) │      │ (test) │
  └─────────┘      └──────────┘      └────────┘
       ▲                                  │
       └──────────────────────────────────┘
            (wenn Test erfolgreich)

Schwellwerte:
  - OPEN wenn: 5 aufeinanderfolgende Fehler in 60s
  - HALF-OPEN nach: 30s automatisch
  - CLOSED wenn: Test-Request erfolgreich
  - OPEN bleibt wenn: Test-Request fehlschlägt
```

### Per-Team Limits

```yaml
safety_limits:
  per_team:
    max_concurrent_tasks: 5       # Max 5 Tasks gleichzeitig pro Team
    max_queue_depth: 50           # Max 50 Tasks in der Queue pro Team
    rate_limit: 10/s              # Max 10 Requests pro Sekunde pro Team
  global:
    max_concurrent_tasks: 20      # Max 20 Tasks gleichzeitig gesamt
    circuit_breaker_enabled: true
    auto_recovery: true
```

---

## Integration mit Loop Guard

Der Automation Controller arbeitet mit dem **Loop Guard** zusammen, um Endlosschleifen zu verhindern.

### Loop-Erkennung

```yaml
loop_guard:
  detection:
    - same_task_cycle: true       # Task darf nicht im Kreis gehen
    - max_cycles: 3               # Max 3 Zyklen (PROCESSING → REVIEW → PROCESSING)
    - time_window: 60s            # Innerhalb von 60s
  action:
    - on_detect: freeze_task      # Task einfrieren
    - notify: team_01             # Team 01 informieren
    - log: loop_detected          # In agentmemory loggen
```

### Loop-Prävention

- Jeder Task trägt einen **Cycle-Count** (Anzahl der PROCESSING-Durchläufe)
- Bei Cycle-Count > 3 wird der Task automatisch auf BLOCKED gesetzt
- Nur Team 01 kann einen gefrorenen Task manuell entsperren

---

## Integration mit Policy Gate

Vor jedem Zustandsübergang wird das Policy Gate konsultiert.

```yaml
policy_gate_integration:
  check_on_transitions:           # Übergänge, die geprüft werden
    - IDLE → PROCESSING           # Darf der Task gestartet werden?
    - PROCESSING → REVIEW          # Ist der Task review-fähig?
    - REVIEW → COMPLETE           # Darf der Task abgeschlossen werden?
    - ERROR → IDLE                # Darf der Task neu gestartet werden?
  bypass_for_teams:               # Teams, die das Gate umgehen dürfen
    - team_01                     # Nur Orchestrierung
    - team_10                     # Nur Security (im Notfall)
```

---

## Beispiel: Task-Durchlauf mit allen Sicherheitsmechanismen

```
1. task:created Event
2. Queue Manager priorisiert (P0 → sofort)
3. Policy Gate: Security + Permission + Rate Limit → PASS
4. IDLE → PROCESSING (Timer startet: 5 min)
5. Agent arbeitet...
6. ❌ Fehler → ERROR (1. Retry: sofort)
7. PROCESSING...
8. ❌ Fehler → ERROR (2. Retry: 30s)
9. PROCESSING...
10. ✅ Fertig → REVIEW
11. Team 12 prüft...
12. ✅ review:passed → COMPLETE
13. Evidence archiviert, agentmemory gesynct
```

---

## Version History

| Version | Datum | Änderung |
|---------|-------|----------|
| 1.0.0   | 2026-06-10 | Initiale Automation Controller-Definition |
