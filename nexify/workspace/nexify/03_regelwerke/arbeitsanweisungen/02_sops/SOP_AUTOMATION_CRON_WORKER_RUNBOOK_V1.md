# SOP — Automation, Cron, Scheduler und Worker Runbook V1

## Grundsatz

Cron ist kein autonomes System. Cron ist nur ein Trigger. Jede Automation braucht Task-Kontext, Policy Gate, Owner, Evidence, Healthcheck, Retry-Logik, Rollback und Endkontrolle.

## Automation-Typen

```text
SCHEDULED_CHECK = regelmäßige Prüfung
EVENT_TRIGGERED = Webhook/Hook/Event
WORKER_JOB = dauerhafter Worker
WATCHDOG = Health-/Recovery-Trigger
SLEEP_SAFE_AUTOPILOT = risikoarme Nachtarbeit
USER_CHAT_DRIVER = interne USER-Message-Fortsetzung
```

## Pflichtfelder je Automation

```text
automation_id:
name:
owner_agent:
trigger_type:
schedule:
timezone:
input_sources:
allowed_actions:
forbidden_actions:
policy_level:
required_context:
brain_required:
agentmemory_required:
logs_path:
evidence_path:
healthcheck:
retry_policy:
failure_status:
rollback:
manual_approval_needed_for:
next_review:
```

## Verbote

- keine freie Endlosschleife;
- keine öffentliche Auto-Chat-Route;
- keine Secrets im Cron;
- keine produktiven Writes ohne Gate;
- keine silent failures;
- keine Automationen ohne Evidence.

## Mindest-Healthcheck

Jede Automation muss mindestens prüfen:

- Prozess läuft;
- letzter erfolgreicher Lauf;
- letzter Fehler;
- Output erzeugt;
- keine Secret-Leaks;
- Kanban/Evidence aktualisiert;
- bei Fehler: Recovery oder `REVIEW_REQUIRED`.