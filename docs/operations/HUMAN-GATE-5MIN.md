# Human Gate — 5 Minuten (Laptop-off Closing)

**NIR:** 02.08.2026 09:05  
**UPDATED:** 02.08.2026 09:05  
**WHAT:** Einzige menschliche One-Time-Klicks für echte 100%-Laptop-off-Autonomie.  
**WHY:** Secrets, OAuth und UI-Toggles können Agents nicht setzen — alles andere ist im Repo automatisiert.  
**PITFALL:** Keine Secret-**Werte** hier oder in Issues/Chat. Nur Namen + Klickpfade.  
**Issue:** [#123](https://github.com/nexifyai-dev/nexify-agentur-plattform/issues/123) · Registry: [`GITHUB-ACTIONS-SECRET-REGISTRY.md`](./GITHUB-ACTIONS-SECRET-REGISTRY.md)

> Reality check: True 100% laptop-off **requires** these human steps once. After that, Autopilot → PR → Ready → Automerge → Mirror läuft ohne Desktop.  
> Runtime-TZ: **Europe/Berlin** — SoT [`TIMEZONE-EUROPE-BERLIN.md`](./TIMEZONE-EUROPE-BERLIN.md).

---

## Timer (~5 min)

| # | Aktion | Wo | Fertig wenn |
|---|--------|-----|-------------|
| 1 | Actions-Secrets setzen | GitHub → Repo → **Settings → Secrets and variables → Actions → New repository secret** | Alle Namen aus Registry existieren (Werte nur im Secret-Store) |
| 2 | VPS Self-Hosted Runner | VPS Shell + GitHub → **Settings → Actions → Runners → New self-hosted runner** | ≥1 Runner online mit Labels `self-hosted`, `vps`, `nexifyai` |
| 3 | Cursor Cloud API Key | [cursor.com/dashboard/cloud-agents](https://cursor.com/dashboard/cloud-agents) → API Key erzeugen → als GitHub Secret `CURSOR_API_KEY` | Secret gesetzt; Workflow „Event → Cursor Cloud Agent“ dry-run ok |
| 4 | GitHub MCP OAuth | Cursor → **Settings → MCP** → GitHub Plugin install/auth | MCP `plugin-github-github` / GitHub ready (nicht `needsAuth`) |
| 5 | Cursor Automations UI | Cursor → **Automations** → Drafts aus `.cursor/automations/` öffnen → Trigger/Channel wählen → **Enable** | 3 Automations aktiv (nicht nur Draft-Markdown) |

Optional parallel (nicht im 5-Min-Kern, aber gleiche Session): Linear + Slack MCP auth, Vercel Project Env laut [`VERCEL-ENV.md`](./VERCEL-ENV.md).

---

## 1) GitHub Actions Secrets (Namen only)

Pfad: `https://github.com/nexifyai-dev/nexify-agentur-plattform/settings/secrets/actions`

### Pflicht für Laptop-off Event→Agent + Deploy

| Secret name | Quelle (wo erzeugen) | Genutzt von |
|-------------|----------------------|-------------|
| `CURSOR_API_KEY` | Cursor Dashboard → Cloud Agents → API Key | `event-to-cloud-agent.yml` |
| `AGENTMEMORY_SECRET` | VPS `/etc/nexifyai/` bzw. AgentMemory Bearer | Event-Ingest + AM Actions |
| `AGENTMEMORY_URL` | z. B. `https://agentmemory.nexifyai.cloud` oder intern | Event-Ingest |
| `VERCEL_TOKEN` | Vercel → Account → Tokens | `deploy-vercel.yml` |
| `VERCEL_ORG_ID` | Vercel Project Settings → General | `deploy-vercel.yml` |
| `VERCEL_PROJECT_ID` | Vercel Project Settings → General | `deploy-vercel.yml` |

### Stark empfohlen

| Secret name | Quelle | Genutzt von |
|-------------|--------|-------------|
| `LINEAR_API_KEY` | Linear → Settings → API | `linear-pr-sync.yml` |
| `CIRCUIT_BREAKER_URL` | z. B. `http://127.0.0.1:8912` (nur self-hosted) oder public CB | Event-Ingest Gate |
| `VPS_GITLAB_TOKEN` | GitLab OSS → PAT | `mirror-to-gitlab.yml` |
| `VPS_GITLAB_URL` | `https://gitlab.nexifyai.cloud` | Mirror |
| `VPS_GITLAB_USERNAME` | GitLab user (meist `root`/`mirror`) | Mirror |

### Nur wenn kein Self-Hosted Runner (SSH-Fallback)

| Secret name | Zweck |
|-------------|--------|
| `VPS_HOST` | Deploy SSH Host |
| `VPS_USER` | Deploy SSH User |
| `VPS_PORT` | Deploy SSH Port |
| `DEPLOY_KEY_VPS` | Private Key für Deploy |

Legacy-Alias: `VERCEL_ACCESS_TOKEN` wird von Deploy-Workflow akzeptiert, wenn `VERCEL_TOKEN` fehlt — **nicht beide nötig**.

Vollständige Matrix: [`GITHUB-ACTIONS-SECRET-REGISTRY.md`](./GITHUB-ACTIONS-SECRET-REGISTRY.md).

---

## 2) VPS Self-Hosted Runner (~90 s)

1. GitHub → **Settings → Actions → Runners → New self-hosted runner** → Linux x64.  
2. Auf dem VPS die angezeigten `download` + `./config.sh` Befehle ausführen (Token nur in Shell, nie committen).  
3. Labels setzen: `self-hosted`, `vps`, `nexifyai` (wie in `deploy-vps.yml` / `vps-worker.yml`).  
4. Service installieren: `sudo ./svc.sh install && sudo ./svc.sh start`.  
5. Verify: Runners-Seite zeigt **Idle/Online**.

Ohne Runner: Daily Smoke läuft trotzdem auf `ubuntu-latest` (hosted curl). VPS-Deploy/Worker bleiben geblockt → Issue #123.

---

## 3) Cursor Cloud Agents

1. Öffne [cursor.com/dashboard/cloud-agents](https://cursor.com/dashboard/cloud-agents).  
2. GitHub-Repo `nexifyai-dev/nexify-agentur-plattform` verknüpfen.  
3. API Key erzeugen → GitHub Secret `CURSOR_API_KEY`.  
4. Budget/Spend Limit prüfen (Circuit Breaker deckt MCP, nicht Cursors Abrechnung).  
5. Smoke:  
   `gh workflow run "Event → Cursor Cloud Agent" -f prompt="Smoke triage" -f source=manual`

---

## 4) GitHub MCP Plugin (Cursor)

1. Cursor → **Settings → Features → MCP** (oder Plugins).  
2. **GitHub** Plugin installieren / OAuth freigeben (Browser-Popup).  
3. Repo-Zugriff auf `nexifyai-dev/nexify-agentur-plattform` erlauben.  
4. Fertig wenn MCP-Status nicht `needsAuth` ist.

Lokal kanonisch bleibt `.cursor/mcp.json.example` (agentmemory `TOOLS=all`, context7, lightrag, gitlab-oss) — **kein Duplikat-GitHub-Server** im Example; Plugin ist UI-seitig.

---

## 5) Cursor Automations — Draft → Enable

Repo-Drafts (Felder kopierfertig):

| Datei | Automation-Name in UI |
|-------|------------------------|
| `.cursor/automations/ci-failed-to-agent.md` | GitHub CI Failed → Fix Agent |
| `.cursor/automations/linear-issue-to-agent.md` | Linear Issue → Fix Agent |
| `.cursor/automations/slack-alert-to-agent.md` | Slack Alert → Agent |

Schritte je Draft:

1. Cursor → **Automations** → **New** / Draft öffnen.  
2. Name + Description aus der Markdown-Tabelle übernehmen.  
3. Trigger wählen (Checks failed / Linear Issue created / Slack channel).  
4. Repo = `nexifyai-dev/nexify-agentur-plattform`.  
5. Instructions aus der Datei einfügen.  
6. **Enable** / Publish (nicht als Draft belassen).

Hinweis: GitHub Actions `event-to-cloud-agent.yml` deckt denselben CI-Pfad API-seitig ab — Automations sind die Cursor-native Variante (Dedupe ok).

---

## 6) Einzeiler VPS (nach Secrets — Agent kann das)

```bash
# Event-Ingest Job installieren (kein Secret inline)
bash /opt/nexifyai/repos/nexify-agentur-plattform/deploy/autopilot/install-event-ingest.sh

# Dual-Write Git-Hook aktivieren
bash /opt/nexifyai/repos/nexify-agentur-plattform/scripts/install-dual-write-hook.sh

# Agent Hooks (post-merge / pre-push deviation)
bash /opt/nexifyai/repos/nexify-agentur-plattform/scripts/install-agent-hooks.sh

# Paperclip-Revive bleibt AUS (#150) — verify:
systemctl is-enabled nexifyai-autopilot-revive-check.timer || true
grep -A2 'paperclip-redis-revive' /opt/nexifyai/config/autopilot/jobs.yaml | head -5
```

---

## 7) Was danach ohne Mensch läuft

| Pfad | Mechanismus |
|------|-------------|
| Commit → Push | `.cursor/hooks/auto-push-agent-branch.sh` |
| Push `cursor/**` → Draft-PR + `automerge` | `agent-branch-autopilot.yml` |
| Draft → Ready → Squash-Merge | `pr-auto-merge.yml` (+ #146 wenn gemerged) |
| CI fail / Issue `agent-fix` → Cloud Agent | `event-to-cloud-agent.yml` |
| Daily public/API smoke | `daily-smoke.yml` (`ubuntu-latest`, kein Runner nötig) |
| Status-Dashboard Refresh | Job in `daily-smoke.yml` schreibt Artifact + Summary |
| Mirror GitHub → GitLab | `mirror-to-gitlab.yml` |
| Issues lifecycle | `issues-lifecycle.yml` (#152) |

Hard stops bleiben: Hermes Prod-Cutover, Force-Push `main`, Secret-Werte in Docs.

---

## Acceptance (Human Gate done)

- [ ] Alle Pflicht-Secret-**Namen** in Actions vorhanden  
- [ ] ≥1 Self-Hosted Runner online **oder** bewusst nur hosted-Smoke akzeptiert  
- [ ] `CURSOR_API_KEY` + Cloud-Repo-Link  
- [ ] GitHub MCP OAuth grün  
- [ ] 3 Automations **Enabled** (nicht Draft-only)  
- [ ] Issue #123 schließen wenn Secrets+Runner ok  

**Nach Gate:** Automation ≈ **95–98%** Laptop-off (Rest = Cutover-Freigabe / Produktentscheidungen wie Paperclip).
