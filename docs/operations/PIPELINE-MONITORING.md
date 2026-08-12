# Pipeline Monitoring & Operations — NeXifyAI

> **Stand:** 2026-08-04 11:00 CEST  
> **Verantwortlich:** Hermes Agent (webui.nexifyai.cloud)  
> **Repo:** nexify-agentur-plattform (GitHub → GitLab Mirror)

---

## 1. Workflow-Übersicht (21 Workflows)

### 1.1 Critical-Path (P0 — muss immer laufen)

| Workflow | Trigger | Jobs | Abhängig von |
|---|---|---|---|
| `ci.yml` | push main, PR main | backend, website, hermes, secret-scan, agentic-governance | — |
| `pr-auto-merge.yml` | labeled, synchronize, workflow_run(CI), check_suite | enable-automerge | Ruleset/Branch Protection |
| `mirror-to-gitlab.yml` | push main, workflow_dispatch | mirror | VPS_GITLAB_* Secrets |
| `deploy-vps.yml` | push main → Host-Timer sync (Website) | deploy-vps.yml | VPS_* Secrets |
| `quality-smoke.yml` | schedule 05:30 UTC, PR, workflow_dispatch | public-smoke, website-critical-e2e | SMOKE_* vars |

### 1.2 Automation (P1 — Agent-Betrieb)

| Workflow | Trigger | Funktion |
|---|---|---|
| `agent-branch-autopilot.yml` | push cursor/\*\*, feature/\*\*, bugfix/\*\*, fix/\*\* | Draft-PR + automerge-Label |
| `issues-lifecycle.yml` | issues (labeled, closed) | Stale-Close, Triage |
| `linear-pr-sync.yml` | pull_request (opened, closed) | Linear ↔ GitHub Sync |
| `event-to-cloud-agent.yml` | issues, PR, review, discussion, repo_dispatch | Cursor Cloud Agent (braucht CURSOR_API_KEY) |

### 1.3 Quality Gates (P1)

| Workflow | Trigger | Funktion |
|---|---|---|
| `quality-audit.yml` | schedule daily | Full Quality Audit |
| `quality-design-audit.yml` | schedule daily | Design System Audit |
| `design-system-guard.yml` | pull_request (globals.css) | Design-Token-Guard |
| `codeql.yml` | push main, schedule weekly | CodeQL Security Scan |
| `secret-scan.yml` | (via ci.yml job) | TruffleHog Secret Scan |

### 1.4 Deployment (P1)

| Workflow | Trigger | Funktion |
|---|---|---|
| `deploy-vps.yml` | push main | VPS Deploy (Website, self-hosted runner/SSH) |
| `vps-worker.yml` | schedule, workflow_dispatch | VPS Worker Jobs |

### 1.5 GTM/Operations (P2)

| Workflow | Trigger | Funktion |
|---|---|---|
| `lead-outreach-daily.yml` | schedule | Lead Outreach (DRY-RUN-ONLY) |
| `daily-smoke.yml` | schedule daily | Daily Smoke Tests |
| `customer-isolation.yml` | push | Customer Isolation Checks |
| `build.yml` | push, PR | Build Validation |
| `test.yml` | push, PR | Test Runner |

---

## 2. Secrets & Environment

### 2.1 Required GitHub Secrets

| Secret | Verwendung | Status |
|---|---|---|
| `VPS_GITLAB_URL` | mirror-to-gitlab.yml | ✅ gesetzt |
| `VPS_GITLAB_USERNAME` | mirror-to-gitlab.yml | ✅ gesetzt |
| `VPS_GITLAB_TOKEN` | mirror-to-gitlab.yml | ✅ gesetzt |
| `CURSOR_API_KEY` | event-to-cloud-agent.yml | ⚠️ fehlt (human-gate) |
| `AGENTMEMORY_SECRET` | event-to-cloud-agent.yml | ⚠️ fehlt |
| `CIRCUIT_BREAKER_URL` | event-to-cloud-agent.yml | ⚠️ fehlt |

### 2.2 Required Env

| Variable | Verwendung |
|---|---|
| `SMOKE_BASE_URL` | quality-smoke.yml |
| `SMOKE_AI_ROUTER_URL` | quality-smoke.yml |
| `SMOKE_AGENTMEMORY_URL` | quality-smoke.yml |
| `SMOKE_API_HEALTH_URL` | quality-smoke.yml |

---

## 3. Hermes Webhook-Trigger

### 3.1 Gateway-Endpunkte

```
Gateway:     http://127.0.0.1:8644 (VPS intern)
Public:      https://webui.nexifyai.cloud (Cloudflare Tunnel)
Webhook:     /webhooks/github-comment
```

### 3.2 GitHub Webhook Configuration

**URL:** `https://webui.nexifyai.cloud/webhooks/github-comment`  
**Content-Type:** `application/json`  
**Secret:** (aus Hermes webhook_subscriptions.json)  
**Events:**
- ✅ Pull requests
- ✅ Issues
- ✅ Issue comments
- ✅ Push
- ✅ Pull request reviews
- ✅ Status
- ✅ Check runs
- ✅ Workflow runs

### 3.3 Hermes Webhook Subscriptions

Konfiguration in `/root/.hermes/webhook_subscriptions.json` (Hot-Reload, kein Neustart):

```json
{
  "subscriptions": [
    {
      "id": "github-pr-automation",
      "source": "github",
      "event": "pull_request",
      "actions": ["opened", "reopened", "labeled", "synchronize", "ready_for_review"],
      "handler": "pr-auto-triage"
    },
    {
      "id": "github-issue-automation", 
      "source": "github",
      "event": "issues",
      "actions": ["opened", "labeled"],
      "handler": "issue-auto-triage"
    },
    {
      "id": "github-ci-monitor",
      "source": "github",
      "event": "workflow_run",
      "handler": "ci-health-monitor"
    },
    {
      "id": "github-push-mirror",
      "source": "github", 
      "event": "push",
      "handler": "gitlab-mirror-trigger"
    }
  ]
}
```

---

## 4. Monitoring-Health-Checks

### 4.1 Daily Automated (quality-smoke.yml)

```
05:30 UTC täglich:
  ✅ www.nexifyai.cloud (HTTP 200, critical-path)
  ✅ ai-router.nexifyai.cloud/api/health (9Router)
  ✅ agentmemory.nexifyai.cloud (AgentMemory)
  ✅ api.nexifyai.cloud/api/health (Backend)
  ⏸️  :3111/:8644/:9622 (VPS-local — nur mit Self-Hosted Runner)
```

### 4.2 Manual Health Commands

```bash
# GitHub Actions Status
gh run list --repo nexifyai-dev/nexify-agentur-plattform --limit 10

# GitLab Mirror Status
gh workflow run mirror-to-vps-gitlab.yml --repo nexifyai-dev/nexify-agentur-plattform

# Hermes Webhook Status
curl -s https://webui.nexifyai.cloud/webhooks/health
```

### 4.3 Alarm-Schwellen

| Metrik | Schwelle | Aktion |
|---|---|---|
| CI-Fehlerrate | >20% in 1h | #ci-incident Issue + Cloud Agent |
| Mirror-Latenz | >30min nach push | manueller workflow_dispatch |
| PR-Merge-Backlog | >10 open mit automerge | Branch-Protection-Check |
| Webhook-Health | 3xx/4xx/5xx | Gateway-Neustart |
| Website-Deploy-Fail | 2+ konsekutiv | Build-Logs prüfen (Host /var/log/nexifyai/website-sync.log) |

---

## 5. Known Issues & Mitigations

### 5.1 Draft-PR-Merge-Blockade

**Symptom:** PR mit `automerge`-Label + grünen Checks bleibt ewig offen.  
**Root-Cause:** Draft-Status + `pr-auto-merge.yml` kann Draft nicht ready machen wenn Required-Checks fehlen.  
**Fix:** Ruleset korrekt konfigurieren → Workflow ruft `gh pr ready` + `gh pr merge --auto`.

### 5.2 GitLab Mirror 502

**Symptom:** GitLab API antwortet mit 502.  
**Root-Cause:** GitLab CE auf VPS instabil/überlastet.  
**Mitigation:** Mirror läuft asynchron (GitHub → VPS Push), nicht kritisch für Website.

### 5.3 Self-Hosted Runner fehlt

**Symptom:** `lead-outreach-daily.yml`, `vps-worker.yml` bleiben queued.  
**Aktion:** Root-Systemd-Runner installieren: `./deploy/github/install-self-hosted-runner.sh`.

### 5.4 CURSOR_API_KEY fehlt

**Symptom:** `event-to-cloud-agent.yml` skipt alle Events (Dry-Skip).  
**Aktion:** API-Key in GitHub Secrets setzen (human-gate, #127).

---

## 6. Recovery-Runbooks

### 6.1 Pipeline komplett blockiert

```bash
# 1. Branch Protection prüfen
# https://github.com/nexifyai-dev/nexify-agentur-plattform/settings/branches

# 2. Letzten erfolgreichen CI-Run finden
gh run list --repo nexifyai-dev/nexify-agentur-plattform --workflow=ci.yml --status=success --limit 1

# 3. Manuell Mirror anstoßen
gh workflow run mirror-to-vps-gitlab.yml --repo nexifyai-dev/nexify-agentur-plattform

# 4. Quality Smoke manuell
gh workflow run quality-smoke.yml --repo nexifyai-dev/nexify-agentur-plattform
```

### 6.2 Hermes Webhook ausgefallen

```bash
# Gateway-Health prüfen
curl -sf https://webui.nexifyai.cloud/health

# Webhook-Subscriptions prüfen
cat /root/.hermes/webhook_subscriptions.json | jq '.subscriptions[] | {id, event, handler}'

# Gateway neustarten
systemctl restart hermes-gateway
```

---

## 7. Changelog

| Datum | Änderung |
|---|---|
| 2026-08-04 | Initiale Pipeline-Monitoring-Dokumentation. 21 Workflows katalogisiert. Webhook-Konfiguration dokumentiert. Recovery-Runbooks erstellt. |
| 2026-08-04 | #288 (GitHub Token Sync) gemerged. #302 (3D npm), #304 (Lime), #303 (Header/Footer/Layout) auf main deployed. |
