# Cloud Agent Event-Ingest — PC-aus Architektur

**Stand:** 2026-08-02  
**Branch:** `cursor/cloud-agent-event-ingest-7dd5`  
**Mandat:** Alle Meldungen → Cursor; Agent fix’t autonom auch wenn Laptop aus.

## Architektur (Soll)

```
                    ┌─────────────────────────────────────────┐
  Quellen           │              Ingest Plane                 │
  GitHub CI/Issues ─┤                                           │
  GitLab CI ────────┤  GitHub Actions (event-to-cloud-agent)    │
  Linear/Slack ─────┤         │                                 │
  Sentry/Vercel ────┤         ▼                                 │
  CF/Health/Resend ─┤  repository_dispatch / workflow_run       │
  Website errors ───┤         │                                 │
                    │         ▼                                 │
                    │  scripts/event-ingest/dispatch_cloud_agent │
                    │    1) Circuit Breaker (wenn erreichbar)    │
                    │    2) AgentMemory Action pending           │
                    │    3) Cursor Cloud Agents API create       │
                    └───────────┬─────────────────────────────┘
                                │
              ┌─────────────────┼─────────────────┐
              ▼                 ▼                 ▼
     Cursor Cloud Agent   VPS Autopilot     Local IDE (optional)
     (VM, PC-off)         webhook :8791     MCP + Hooks
              │           + jobs.yaml tick        │
              └─────────────┬─────────────────────┘
                            ▼
              Branch → PR → CI → label automerge → Merge
              GitLab = Mirror only (kein Doppel-Steuer)
```

## Cloud vs VPS vs Lokal

| Ebene | Rolle bei „PC aus“ | Was läuft |
|-------|-------------------|-----------|
| **Cursor Cloud Agents / Background Automations** | Primärer Fix-Loop | Code klonen, Branch/PR, MCP (dashboard) |
| **GitHub Actions** | Event-Router | CI-Fail, Issues, `repository_dispatch` → Launch |
| **VPS Autopilot** | Fallback + lokale Alerts | Health/systemd → Action + optional Cloud Launch; Webhook-Receiver |
| **Lokale IDE MCP** | Nur wenn Desktop an | Linear/Slack OAuth-Klicks, interaktive Auth — **nicht** der 24/7-Pfad |

## Gap-Matrix (IST → SOLL → Fix)

| Integration | Trigger heute (PC aus?) | Soll | Fix / PR / User-Klick |
|-------------|-------------------------|------|------------------------|
| GitHub CI fail | CI läuft; **kein** Agent-Launch | Cloud Agent Fix-PR | Workflow `event-to-cloud-agent.yml` + Secret `CURSOR_API_KEY` |
| GitHub Issues/PR labels | Issues existieren | Label `agent-fix` → Agent | gleicher Workflow; Labels anlegen |
| GitHub Plugin MCP | **fehlt** in Session | Dashboard MCP für Automations | User: Cursor Settings → MCP → GitHub verbinden |
| GitLab CI | Mirror + Deploy | Fail → `repository_dispatch` | VPS webhook stub + `GH_PAT`; GitLab job notify |
| Linear | MCP oft `needsAuth`; keine Cloud-Trigger | Issue created → Agent | Cursor Automation (Linear) **und** Linear webhook → VPS `/ingest/linear` |
| Slack | MCP fehlt / auth | Channel/Command → Agent | Cursor Automation Slack-Trigger; Slack app webhook → `/ingest/slack` |
| Sentry | MCP needsAuth | Issue → Agent | Sentry webhook → `/ingest/sentry` + Cursor Sentry Automation |
| Vercel deploy fail | Deploy-Workflow only | Fail → Agent | Vercel webhook → `/ingest/vercel` |
| Cloudflare | Plugin needsAuth | Alert → Agent | CF notification webhook → `/ingest/cloudflare` |
| Resend bounces | Backend inbound mail | Bounce → Action/Agent | Resend webhook → `/ingest/resend` |
| Health/systemd | Autopilot health | Fail → Cloud Agent | Job `event-ingest-to-cloud-agent` + `CURSOR_API_KEY` auf VPS |
| AgentMemory | ready lokal | Actions pending persist | immer; Cloud braucht Secret oder VPS dual-write |
| Auto-Merge | fehlte | Label `automerge` + green | Workflow `pr-auto-merge.yml` + Repo „Allow auto-merge“ + Branch Protection |
| GitLab Mirror | `mirror-to-gitlab.yml` | Sync only | unverändert — **keine** Doppelsteuerung |

## Was in diesem PR gebaut wurde

| Artefakt | Zweck |
|----------|-------|
| `.github/workflows/event-to-cloud-agent.yml` | CI/Issues/PR-Labels/`repository_dispatch` → Cloud Agent |
| `.github/workflows/pr-auto-merge.yml` | Label `automerge` → Squash auto-merge (Guards) |
| `.github/workflows/linear-pr-sync.yml` | `NEX-123` → PR-Kommentar (idempotent) |
| `scripts/event-ingest/dispatch_cloud_agent.py` | Circuit + Action + Cloud API |
| `scripts/event-ingest/webhook_receiver_stub.py` | VPS Ingest `127.0.0.1:8791` |
| `deploy/autopilot/jobs/event-ingest-to-cloud-agent.sh` | Autopilot-Tick |
| `deploy/autopilot/install-event-ingest.sh` | VPS install |
| `.cursor/hooks.json` + `circuit-breaker-mcp.sh` | MCP Gate |
| `.cursor/automations/*.md` | Drafts für Cursor Automations UI |
| `tools/cursor_agents/` | bestehender REST-Client (genutzt) |

## Secrets / Env (nur Namen)

### GitHub Actions Secrets
- `CURSOR_API_KEY` — Cloud Agents (Pflicht für Launch)
- `AGENTMEMORY_SECRET` — Action-Persistenz (optional, empfohlen)
- `AGENTMEMORY_URL` — z. B. `https://agentmemory.nexifyai.cloud/agentmemory` (optional)
- `CIRCUIT_BREAKER_URL` — meist leer auf GH runners (soft-allow)
- `LINEAR_API_KEY` — optional für Linear GraphQL (Sync-Workflow)

### VPS (`/opt/nexifyai/config/cursor-cloud.env`, nicht committen)
- `CURSOR_API_KEY`
- `EVENT_INGEST_SHARED_SECRET`
- `GH_PAT` oder `GITHUB_TOKEN` (repo `dispatches` scope)
- `AGENTMEMORY_SECRET`
- `CIRCUIT_BREAKER_URL=http://127.0.0.1:8912`

### Repo Variables (optional)
- `LINEAR_TEAM_KEY` = `NEX`

## User-Klicks (Checkliste)

1. **Cursor Dashboard → Cloud Agents**  
   - API Key erzeugen → GitHub Secret `CURSOR_API_KEY`  
   - GitHub-Account für Cloud Agents verknüpfen  
   - Background Agents / Automations aktiv  
   - Compute/Budget prüfen

2. **Cursor Settings → MCP / Integrations**  
   - **Linear** authentifizieren (OAuth)  
   - **Slack** verbinden  
   - **GitHub Plugin** installieren/auth (fehlt noch)  
   - Sentry / Vercel / Cloudflare bei Bedarf  
   - Self-hosted bleibt `gitlab-oss` in `.cursor/mcp.json` (nicht built-in Gitlab)

3. **Cursor Automations** (Agents Window) — Drafts unter `.cursor/automations/`  
   - Linear Issue created → Cloud Agent Fix  
   - Slack channel message → Agent/Status  
   - Git CI failed → Agent (zusätzlich zu Actions-Workflow)  
   Kanäle/Repos im Editor finalisieren

4. **GitHub Repo Settings**  
   - General → **Allow auto-merge**  
   - Rulesets/Branch protection: required checks (`website`, `backend`, …)  
   - Labels anlegen: `automerge`, `auto-merge`, `do-not-merge`, `agent-fix`, `cursor-fix`  
   - Optional: webhook zu VPS Ingest (zusätzlich zu native Automations)

5. **VPS**  
   ```bash
   bash deploy/autopilot/install-event-ingest.sh
   # Env-Datei mit CURSOR_API_KEY + EVENT_INGEST_SHARED_SECRET
   # Traefik/CF: https://ingest.nexifyai.cloud → 127.0.0.1:8791
   python3 scripts/event-ingest/webhook_receiver_stub.py  # oder systemd unit
   ```

6. **Externe Webhooks** auf `https://<ingest-host>/ingest/{slack|linear|sentry|vercel|health|gitlab|cloudflare|resend|website}`  
   Header: `X-Nexify-Ingest-Secret: $EVENT_INGEST_SHARED_SECRET`

## Was danach automatisch vs. manuell

| Automatisch (nach Secrets + Klicks) | Manuell bleibt |
|-------------------------------------|----------------|
| CI fail → Cloud Agent (wenn Key gesetzt) | OAuth MCP (Linear/Slack/GitHub) einmalig |
| Label `agent-fix` → Agent | Automations-Kanäle im Editor wählen |
| Label `automerge` + green → Merge | Production Hermes Cutover (Freigabe) |
| Webhook → `repository_dispatch` → Agent | Force-Merge / Policy-Ausnahmen |
| Autopilot Tick → Action/Agent | Budget-Erhöhung Circuit Breaker |
| Linear-ID Kommentar auf PR | Erste Traefik/CF Route für Ingest |
| GitLab Mirror nach main-Merge | — |

## Manueller Test

```bash
# Dry: nur Action (ohne Key)
CURSOR_API_KEY= python3 scripts/event-ingest/dispatch_cloud_agent.py \
  --repo-url https://github.com/nexifyai-dev/nexify-agentur-plattform \
  --ref main --event-name workflow_dispatch --reason test --run-id local-test

# GitHub Dispatch (mit gh)
gh workflow run "Event → Cursor Cloud Agent" -f prompt="Smoke: open noop docs PR if safe" -f source=manual
```

## Nicht-Ziele

- Hermes Prod-Cutover  
- Blind auto-merge ohne Checks  
- Secrets in Chat/Repo  
- GitLab als zweite Steuerungs-SoT
