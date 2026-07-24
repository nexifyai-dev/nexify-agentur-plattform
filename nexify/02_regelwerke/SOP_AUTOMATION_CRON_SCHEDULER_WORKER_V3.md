# SOP — Automationen, Cron Jobs, Scheduler und Worker

## Grundsatz
Automation ist kontrollierter Betrieb, kein freier Loop.

## Pflichtfelder je Automation
Automation-ID, Name, Zweck, Owner, Trigger, Schedule, Input, Output, Systeme, Policy Level, erlaubte Aktionen, verbotene Aktionen, Retry, Timeout, Monitoring, Evidence, Brain Sync, agentmemory Sync, Rollback, Abort Conditions.

## Cron-Regeln
Cron ist erlaubt für Auftragsfach-Prüfung, Healthchecks, Reports, Drift Checks, Backups, Queue-Recovery und Aging Checks. Cron ist nicht ausreichend für echte Chat-Fortsetzung, autonome Projektsteuerung oder produktive externe Writes ohne Gate.

## Event-Regeln
Bevorzugt eventgetrieben: agent:end, task:completed, approval:granted, deploy:finished, lead:qualified, offer:approved, mail:sent, incident:detected.
