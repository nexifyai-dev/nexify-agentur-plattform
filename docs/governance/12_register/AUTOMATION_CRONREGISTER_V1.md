# NeXify AI — Automationen und Cronregister V1

**Stand:** 2026-07-26 | **Status:** VERBINDLICH | **Version:** 1.2.0
**Owner:** Betrieb / NeXify AI
**Klassifikation:** nexify_internal

---

## 1. Zweck

Diese Datei ist die menschlich lesbare Übersicht über den aktuellen Automationsbestand.

**Kanonische Detailquelle:** `docs/governance/12_register/automation-control-register-v1.json`
**Soll-Betriebsmodell:** `docs/governance/12_register/AUTOMATION_OPERATING_MODEL_V1.md`

---

## 2. Konsolidierte Baseline

| Bereich | Aktive / bekannte Automationen |
|---|---|
| GitHub Actions | `test`, `build`, `deploy-vps`, `deploy-vercel`, `gitlab-sync`, `mirror-to-gitlab`, `secret-scan`, `design-system-guard`, **`vps-worker`** |
| Self-Hosted Runner | **`nexify-github-runner`** (VPS) — Docker-Container, HTTPS-Polling zu GitHub |
| GitLab CI | Redundanzpfad für lint/test/build/deploy |
| Lokale Hooks | `pre-commit`-Pipeline + dokumentierte `pre-push` Boundary-Gates |
| Runtime | `resend-inbound` Webhook, E-Mail-Worker-Polling, `schedule_task`, VPS-Healthcheck |
| Governance | Cron-/Runbook-/Evidence-Planung und Audit-Zyklen |

---

## 2a. GitHub Self-Hosted Runner — VPS Worker Cron-Plan

> **Architektur-Dok:** `docs/architecture/GITHUB-RUNNER-VPS.md`  
> **Workflow:** `.github/workflows/vps-worker.yml`  
> **Automation-Register:** `AUTO-RUNNER-001`, `AUTO-RUNNER-002`, `AUTO-RUNNER-003`

| Job | Cron | Zweck | Timeout |
|-----|------|-------|---------|
| `quick-ping` | `0 * * * *` (stündlich) | 6 kritische Dienste pingen | 5 min |
| `full-health` | `0 6 * * *` (täglich 06:00) | Vollsystem-Health + Evidence | 15 min |
| `hermes-sync` | `0 6 * * *` (täglich 06:00) | AgentMemory + SharedState sync | 10 min |
| `runner-renew` | `0 6 * * *` (täglich 06:00) | Runner-Container-Health + ggf. Restart | 5 min |
| `cleanup` | `0 7 * * 1` (montags 07:00) | Docker Prune + Log-Rotation | 20 min |
| `lightrag-reindex` | `0 7 * * 1` (montags 07:00) | Governance-Docs → LightRAG indexieren | 30 min |
| `governance-audit` | `0 7 * * 1` (montags 07:00) | §2/§11 Vollprüfung + Evidence | 10 min |

**Manuell ausführen:**
```bash
# Via gh CLI (auf beliebigem Rechner mit PAT)
gh workflow run vps-worker.yml --field job=quick-ping
gh workflow run vps-worker.yml --field job=full-health
gh workflow run vps-worker.yml --field job=governance-audit
```

---

## 3. Trigger-Klassen

| Klasse | Beispiele | Mindestanforderungen |
|---|---|---|
| Git | push, pull_request | Secret-/Boundary-Gates, CI-Checks |
| Manuell | workflow_dispatch, Recovery | dokumentierte Freigabe, Evidence |
| Zeit | schedule / Cron | Owner, SLA, Healthcheck, Rollback |
| Event | Webhook, Mail, Statuswechsel | Validierung, Deduplizierung, Audit-Log |
| Lokal | pre-commit, pre-push | harte Hook-Gates vor Remote-Write |

---

## 4. Gate-Grundsätze

- Keine Automation ohne Registereintrag
- Keine Cron-Aktivierung ohne Owner, Healthcheck, Evidence und Abort Condition
- Kein externer Write ohne Gate, Rollback und Auditierbarkeit
- Kein produktiver Blind-Retry

---

## 5. Betriebsformel

```text
Trigger -> Validator -> Gate -> Executor -> Healthcheck -> Evidence -> Recovery/Abort
```

Die vollständigen Regeln, Flows und Rollen stehen im Operating Model.
