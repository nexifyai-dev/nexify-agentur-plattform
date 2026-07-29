# NeXify AI — Automation Operating Model V1

**Stand:** 2026-07-26 | **Status:** VERBINDLICH | **Version:** 1.0.0
**Owner:** Betrieb / DevOps / Governance
**Klassifikation:** nexify_internal

---

## 1. Zweck

Dieses Dokument definiert das einheitliche Betriebsmodell für Automationen, Trigger, Hooks, Cron-Jobs, Worker und Governance-Gates im Repository `nexify-agentur-plattform`.

Es ergänzt das bestehende SOP-Runbook, konsolidiert den Ist-Stand und setzt die Soll-Architektur für Betrieb, Auditierbarkeit und sichere Erweiterung neuer Automationen.

**Kanonische Registerquelle:** `docs/governance/12_register/automation-control-register-v1.json`

---

## 2. Scope — 5 Ebenen

| Ebene | Zweck | Primäre Artefakte |
|---|---|---|
| Dev-Workflow | Lokale Schutzgates vor Commit/Push | `.pre-commit-config.yaml`, dokumentierte pre-push Boundary-Checks |
| CI/CD | Build-, Test-, Scan-, Deploy- und Mirror-Automationen | `.github/workflows/*.yml`, `.gitlab-ci.yml` |
| Runtime-Worker | Laufende Poller, Task-Scheduler, Healthchecks | `backend/email_agent.py`, `backend/agent.py`, `infra/scripts/health-check.sh` |
| Integrationen/Webhooks | Externe oder interne Events und deren Verarbeitung | `backend/server.py`, GitHub/GitLab/Vercel/VPS-Deploy-Flows |
| Governance/Audit | Nachweis, Register, Runbooks, Review-Zyklen, Eskalationen | `docs/governance/**`, Evidence, Register, SOPs |

---

## 3. Konsolidierter Ist-Stand

### 3.1 Primäre GitHub-Actions-Pfade

- `test.yml` — Lint, Unit-Tests, Security-Checks, Docker-Build-Validierung
- `build.yml` — Docker Image Build + GHCR Push
- `deploy-vps.yml` — SSH-Deploy auf VPS mit Post-Deploy-Prüfung
- `deploy-vercel.yml` — Vercel-Production-Deploy für `apps/website`
- `mirror-to-gitlab.yml` — vollständiges Git-Mirror nach VPS GitLab; Fehler sind blockierend
- `secret-scan.yml` — Gitleaks-basierter Secret-Scan
- `design-system-guard.yml` — Integritäts-Gate für `apps/website/app/globals.css`

### 3.2 Redundanz- und Backup-Pfad

- `.gitlab-ci.yml` bildet einen zweiten CI/CD-Pfad für Lint, Test, Build und manuelles Deploy.

### 3.3 Lokale Schutzgates

- `.pre-commit-config.yaml` setzt Format-, YAML/JSON-, Ruff-, Mypy-, Markdown- und Gitleaks-Gates.
- Dokumentierte pre-push Boundary-Gates schützen Tenant-Isolation und Secret-Trennung.

### 3.4 Runtime-Trigger

- Inbound-E-Mail-Webhook: `POST /api/webhooks/resend-inbound`
- E-Mail-Worker-Polling: `backend/email_agent.py`
- Agentische Folgeaufgaben: `schedule_task` in `backend/agent.py`
- Betriebs-Healthcheck: `infra/scripts/health-check.sh`

---

## 4. Trigger- und Hook-Matrix (Soll)

### 4.1 Git-Trigger nach Branchklasse

| Branchklasse | Trigger | Erlaubte Automationen | Harte Gates |
|---|---|---|---|
| `feature/*` | `push`, PR auf `develop`/`main` | Tests, Lint, Security, Build-Validierung | Secret-Scan, Boundary-Gates, CI-Test-Gates |
| `develop` | `push`, PR | Tests, Build, GitLab-Sync | Secret-Scan, Build-Gates, Drift-/Deploy-Readiness |
| `main` | `push` | Tests, Builds, Production-Deploy, Mirror, Governance-Crons | Production-Approval-Regeln, Healthchecks, Evidence, Rollback |

### 4.2 Manuelle Trigger

Manuelle Trigger sind nur zulässig für:

- Recovery / Re-Deploy
- Security-Backfills
- Governance-Backfills
- Evidence-Neuerstellung
- Notfall-Failover

Kein manueller Trigger darf einen automatischen Production-Write ohne Gate, Healthcheck und Rollback-Pfad ausführen.

### 4.3 Zeittrigger

| Kategorie | Soll-Zweck |
|---|---|
| Betrieb | tägliche Health-Checks, Drift-Prüfungen, Queue-/Task-Cleanup |
| Security | Secret-, Dependency-, Backup-/Restore- und Drift-Prüfungen |
| Governance | wöchentliches Monitoring und Nachweisprüfung |
| Datenpflege | Evidence-Sync, Status-Abgleich, Register-Prüfung |
| Reports | KPI-, Audit- und Alarm-Reports |

### 4.4 Event-Trigger

| Eventtyp | Soll-Verhalten |
|---|---|
| Webhook | Validieren → deduplizieren → verarbeiten → Folgeaufgaben planen → auditieren |
| Ticket-/Lead-/Offer-Status | Nur mit eindeutigem Datenkontext, Statusübergang prüfen, Folgeaktionen protokollieren |
| Mail-Inbound | Sprache/Kategorie klassifizieren, Ticket/Lead erzeugen, Antwort planen, Audit-Log schreiben |
| Deploy-/Mirror-Events | Post-Checks, Evidence, Eskalation oder Rollback |

### 4.5 Lokale Hooks

| Hook | Rolle | Mindestgates |
|---|---|---|
| pre-commit | Frühes Blockieren von Secrets, Syntax- und Formatfehlern | Gitleaks, YAML/JSON, Ruff/Mypy, Merge-Konflikt-Check |
| pre-push | Boundary- und Tenant-Schutz vor Remote-Write | Tenant-Isolation, Secret-Trennung, Kundenprojekt-Grenzen |

---

## 5. End-to-End-Betriebsabläufe

### 5.1 Delivery-Flow

`Commit -> Hook-Gates -> PR/CI -> Build -> Deploy -> Post-Deploy-Health -> Evidence`

Pflicht:

- Kein Merge ohne grüne Kern-Gates oder dokumentierte Ausnahme
- Kein Deploy ohne Healthcheck und sichtbaren Rollback-Pfad
- Jeder produktive Lauf erzeugt oder referenziert Evidence

### 5.2 Runtime-Flow

`Event/Webhook -> Validierung -> Deduplizierung -> Verarbeitung -> Folgeaktion -> Audit-Log`

Pflicht:

- Idempotente Verarbeitung
- Kein externer Write ohne dokumentiertes Gate
- Folgeaufgaben mit eindeutigen IDs, Zeiten und Instruktionen

### 5.3 Failover-Flow

`GitHub Primärpfad gestört -> GitLab Backup-Pipeline bewerten -> manuelle Umschaltung nach Kriterien -> Evidence`

Umschaltkriterien:

- GitHub Actions dauerhaft nicht verfügbar oder blockiert
- kritische Production-Wiederherstellung erfordert Backup-Pfad
- Security-/Compliance-Risiko durch Ausfall des Primärpfads

### 5.4 Sync-Flow

`GitHub Source of Truth -> GitLab Mirror -> optionaler Pipeline-Trigger -> tolerante Fehlerbehandlung`

Pflicht:

- Mirror-Fehler blockieren nicht automatisch GitHub-Merges
- Fehler müssen sichtbar protokolliert werden
- Wiederanlauf erfolgt kontrolliert, nicht blind wiederholt

---

## 6. Verbindliche Regelwerke

### 6.1 Idempotenz

- Jeder Webhook- und Event-Flow braucht einen Deduplizierungs-Schlüssel oder eine fachliche Wiedererkennung.
- Bereits verarbeitete Events dürfen keine doppelten Writes, Antworten oder Deploys erzeugen.

### 6.2 Concurrency

- Deployments werden serialisiert.
- Stale Builds/Testläufe dürfen zugunsten neuerer Commits abgebrochen werden.
- Runtime-Worker brauchen Locking oder Statusprüfung gegen parallele Ausführung.

### 6.3 Retry- und Backoff-Policy

| Triggerklasse | Policy |
|---|---|
| Webhook/API | max. 3 Versuche, exponentieller Backoff, danach Eskalation |
| Polling/Worker | zyklischer Wiederanlauf mit Fehlerzähler und Health-Signal |
| Build/CI | keine Endlosschleifen; erneuter Lauf nur durch neuen Trigger oder manuellen Recovery-Run |
| Deploy | kein automatischer Dauerversuch; nach Fehlschlag Diagnose, Rollback oder Freigabe |

### 6.4 Abort Conditions

Eine Automation muss abbrechen, wenn mindestens einer der folgenden Fälle eintritt:

- Security-Hit / Secret-Fund
- fehlschlagender Pflicht-Healthcheck
- fehlender kritischer Input oder fehlende Freigabe
- mehrfache Fehler in Folge ohne Recovery
- Verletzung von Tenant-, Boundary- oder Policy-Gates

### 6.5 Freigaberegeln

| Kategorie | Automatisch | Manuell |
|---|---|---|
| Tests/Lint/Build | ja | nur bei Recovery |
| Secret-Scans / Guard-Runs | ja | Backfill erlaubt |
| Production-Deploy | ja auf definierten Pfaden mit Gates | Re-Deploy, Failover, Recovery |
| Externe Security-/Daten-Änderung | nein ohne Gate | ja nach Freigabe |

### 6.6 Tenant- und Secret-Policy

- Tenant-Isolation ist vor jedem Remote-Write zu prüfen.
- Secrets dürfen nie in Logs, Artefakten, Evidence oder Source-Dateien auftauchen.
- Hook- und CI-Gates sind harte Sperren, keine bloßen Warnungen.

---

## 7. Cron-Job-Plan (vorausschauend)

Der bestehende Wochen-Trigger in `test.yml` bleibt erhalten.

| ID | Automation | Rhythmus | Owner | SLA | Alarmkanal | Rollback / Runbook |
|---|---|---|---|---|---|---|
| CRON-GOV-001 | Governance-Monitoring | Mo 06:00 | Governance | P2 / 24h | GitHub Actions + Audit-Review | `test.yml`, Governance-Audit |
| CRON-OPS-001 | Daily Health Review | täglich 06:00 | DevOps | P1 / same day | CI-Alert / Betrieb | `infra/scripts/health-check.sh` |
| CRON-SEC-001 | Secret & Dependency Review | täglich | Security / DevOps | P1 / same day | Security-Alert | Secret- und Dependency-Runbook |
| CRON-EVD-001 | Evidence Sync Check | täglich | Governance | P2 / 24h | Audit-Board | Evidence-Runbook |
| CRON-RUN-001 | Stale Task Cleanup | täglich | Runtime Owner | P2 / 24h | Runtime-Alert | Task-/Queue-Recovery |
| CRON-BKP-001 | Backup/Restore Verification | wöchentlich | Betrieb | P1 / 24h | Incident + Audit | Backup/DR-Runbook |

Jeder neue Cron-Job benötigt vor Aktivierung:

1. Registereintrag
2. Owner + SLA
3. Healthcheck
4. Rollback
5. Evidence-Pfad
6. dokumentierten Alarmweg

---

## 8. Observability, Alarmierung, Nachweis

### 8.1 Mindest-KPIs

- Erfolgsquote pro Automation
- Laufzeit / Dauer
- Retry-Anzahl
- Fehlertyp / Fehlerklasse
- MTTR / Recovery-Zeit
- letzter erfolgreicher Lauf

### 8.2 Alert-Stufen

| Stufe | Bedeutung | Aktion |
|---|---|---|
| kritisch | Production, Security, Datenverlust-Risiko | sofortige Eskalation |
| warnung | Degradierung, wiederholte Worker-/Sync-Fehler | zeitnahe Bearbeitung |
| info | geplanter Lauf, Backfill, Erfolgsmeldung | Nachweis / Trend |

### 8.3 Evidence-Standard

Jede Automation referenziert mindestens:

- Register-ID
- Start-/Endzeit
- Ergebnisstatus
- betroffene Systeme
- Link oder Pfad zur Evidence
- Rollback-/Recovery-Hinweis bei Fehlern

---

## 9. Governance-Operationalisierung

### 9.1 Automations-Board

Das Automations-Board verantwortet:

- Change-Freigabe
- Risiko-Klassifizierung
- Review geplanter Cron-/Webhook-/Deploy-Änderungen
- Abschaltung veralteter oder doppelter Trigger

### 9.2 Grundregeln

- Keine neue Automation ohne Runbook, Testnachweis und Rollback-Fähigkeit
- Ein Trigger hat genau einen klaren Verantwortungsbereich
- Duplizierte oder widersprüchliche Trigger werden konsolidiert oder stillgelegt

### 9.3 Review-Zyklus

| Rhythmus | Inhalt |
|---|---|
| täglich | kritische Fehlschläge und Betriebszustand |
| wöchentlich | Cron-/Evidence-/Drift-Review |
| monatlich | Risiko-, Audit- und Trigger-Konsolidierung |

---

## 10. Umsetzungsreihenfolge

| Phase | Ziel |
|---|---|
| A | zentrales Register, Trigger-Matrix, Owner/SLA finalisieren |
| B | kritische Gates härten (Secrets, Deploy, Idempotenz, Abort) |
| C | Cron-Katalog erweitern und Alarmierung vereinheitlichen |
| D | Failover-/Recovery-Drills und Governance-Audits etablieren |

Dieses Dokument ist die Soll-Führung für künftige Erweiterungen; der aktuelle Umsetzungsstand pro Automation steht im zentralen Register.
