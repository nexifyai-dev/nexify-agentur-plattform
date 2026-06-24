# NeXify AI — Automationen und Cronregister V1

**Stand:** 2026-06-12 | **Status:** VERBINDLICH | **Version:** 1.0.0
**Owner:** Betrieb / NeXify AI
**Klassifikation:** nexify_internal

---

## 1. Zweck

Zentrales Register aller aktiven und geplanten Automationen und Cron-Jobs.

## 2. Automations-Register

| ID | Automation | Trigger | Aktion | Status | Gate |
|----|-----------|---------|--------|--------|------|
| A-001 | Brain Sync | Cron stündlich | Brain-Queue verarbeiten | 🟡 CRON_READY | F |
| A-002 | Brain Healthcheck | Cron 5min | Brain Health prüfen + Alert | 🟢 AKTIV | — |
| A-003 | Live-State-Snapshot | Cron 30min | Host-Snapshot erstellen | 🟡 CRON_READY | F |
| A-004 | Handoff-Aufräumung | Cron stündlich | Alte Handoffs archivieren | 🟡 CRON_READY | F |
| A-005 | Secret-Ablauf-Prüfung | Cron täglich | Secret-TTL prüfen | 🟡 CRON_READY | F |
| A-006 | Evidence-Prüfung | Cron 4h | Evidence-Vollständigkeit | 🟡 CRON_READY | F |
| A-007 | Feedback-Loop | Cron täglich | Feedback-Metriken sammeln | 🟡 CRON_READY | F |
| A-008 | Chat Continuation | Event | Chat nach Unterbrechung fortsetzen | 🟢 AKTIV | — |
| A-009 | Lead-Qualifizierung | Event | Neue Leads automatisch qualifizieren | 🟡 GEKANNT | F |
| A-010 | Angebots-Follow-up | Event | Angebotserinnerungen automatisch | 🟡 GEKANNT | F |
| A-011 | Brain → agentmemory | Cron 4h | Knowledge aus Brain syncen | 🟡 GEKANNT | F |
| A-012 | Monitoring Report | Cron 24h | Täglicher Betriebsreport | 🟡 GEKANNT | F |
| A-BACKUP-001 | Backup-Automatisierung | Cron 02:00 | Workspace+Brain+Qdrant+Config Backup | 🟢 AKTIV | — |
| A-MON-001 | Health Monitor | Cron */5 | Service Health + Metrics | 🟢 AKTIV | — |
| A-SEC-001 | Security Scan | Cron 03:00 | Secret-Leak+Port+Docker+F2B | 🟢 AKTIV | — |
| A-DEP-001 | Deployment Automation | Event | Pre/Post-Deploy Checks | 🟢 AKTIV | — |
| A-MASTER-001 | Master Controller | Manuell | Zentraler Automation-Controller | 🟢 AKTIV | — |

## 3. Cron-Architektur

- Cron-Skripte in: `/workspace/nexify/11_brain_sync/`
- Systemd-Timer: 13 aktive Timer
- Aktivierung: Erst nach F-Freigabe

## 4. Automations-Engine-Pipeline

```
Trigger → Validator → Context Loader → Policy Gate → 
Executor → Evidence Writer → Brain/agentmemory Sync → 
Review Hook → Retry/Recovery → Abort Condition
```

## 5. Gate

Keine Cron-Aktivierung ohne F-Freigabe. Keine Automation ohne Evidence-Pfad.
