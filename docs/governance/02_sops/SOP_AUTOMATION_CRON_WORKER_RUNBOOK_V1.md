# SOP — Automation/Cron/Worker Runbook V1

**Stand:** 2026-06-12 | **Status:** VERBINDLICH | **Version:** 1.0.0
**Owner:** Betrieb / NeXify AI

---

## 1. Zweck

Jede Automation braucht Owner, Trigger, Gate, Healthcheck, Evidence, Rollback und Endkontrolle.

## 2. Pflichtfelder pro Automation

- ID
- Name
- Owner
- Trigger (Cron/Event/Manuell)
- Policy Gate
- Executor (Skript/Agent/CLI)
- Healthcheck
- Evidence-Pfad
- Rollback-Schritte
- Risiken
- Abort Condition

## 3. Verboten

- Cron ohne Healthcheck
- Automation ohne Evidence
- Worker ohne Rollback
- Cron ohne Abort Condition bei Fehlern
- Automation die Secrets logged

## 4. Runbook-Format

```yaml
automation:
  id: A-XXX
  name: Beschreibung
  trigger: "*/5 * * * *" | event: lead.created
  gate: F|kein
  executor: pfad/zum/skript.sh
  healthcheck: pfad/zum/healthcheck.sh
  evidence: pfad/zur/evidence.md
  rollback: |
    1. Schritt
    2. Schritt
  risks: |
    - Risiko 1
  abort: Bei >3 Fehlern in Folge stoppen
```
