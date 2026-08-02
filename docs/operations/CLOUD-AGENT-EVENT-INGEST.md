# Cloud Agent Event-Ingest + Auto Push/PR/Merge

**Stand:** 2026-08-02  
**Branch:** `cursor/no-confirmation-agent-ops-7dd5`  
**Mandat:** Alle Meldungen → Cursor; Auto-Push; Draft-PR; CI→ready→Merge; auch Laptop aus.  
**Policy:** NO_CONFIRMATION (`.cursor/rules/40-no-confirmation.mdc`) — Agents fragen nicht nach Commit/Push/PR.

## Fix-Loop (automatisch)

```
Event (GH/Linear/Slack/Sentry/Vercel/Health/…)
  → GitHub Actions event-to-cloud-agent  OR  VPS webhook :8791
  → Circuit Breaker + AgentMemory Action
  → Cursor Cloud Agent (PC-off)
  → Commit auf cursor/*
  → Hook auto-push + Draft-PR-Fallback (kein Diff-Tab)
  → Workflow agent-branch-autopilot → Draft-PR + label automerge
  → CI green → pr-auto-merge.yml: draft→ready + squash auto-merge (Fix #135)
  → mirror-to-gitlab (Sync only)
```

## Cloud vs VPS vs Lokal

| Ebene | PC aus? | Rolle |
|-------|---------|-------|
| Cursor Cloud Agents / Background Automations | ja | Code-Fix, PR |
| GitHub Actions | ja | Event-Router, Draft-PR, Auto-Merge |
| VPS Autopilot + webhook ingest | ja | Health/Slack/… → dispatch |
| Lokale IDE MCP/Hooks | nein | Auto-Push Hook, OAuth-Klicks |

## Was jetzt auto läuft (nach Merge + Secrets)

| Schritt | Mechanismus |
|---------|-------------|
| Auto-Push nach Commit | `.cursor/hooks/auto-push-agent-branch.sh` (`afterShellExecution` + `stop`) |
| Draft-PR wenn Branch gepusht | Hook-Fallback `gh pr create --draft` + `.github/workflows/agent-branch-autopilot.yml` |
| CI → ready → Merge | Label `automerge` + `.github/workflows/pr-auto-merge.yml` (Draft→ready wenn green; kein force main; `do-not-merge` blockt) |
| CI fail / PR / Issue / Review / Discussion / Dispatch → Cloud Agent | `.github/workflows/event-to-cloud-agent.yml` |
| Linear-ID auf PR | `.github/workflows/linear-pr-sync.yml` |
| VPS Alerts → Agent | `deploy/autopilot/jobs/event-ingest-to-cloud-agent.sh` + webhook stub |
| MCP Cost Gate | `.cursor/hooks/circuit-breaker-mcp.sh` |

## Gap-Matrix

| Integration | IST (PC aus) | Soll | Fix / User |
|-------------|--------------|------|------------|
| GitHub CI fail | CI only | Cloud Agent | Secret `CURSOR_API_KEY` |
| PRs / Issues / Reviews / Kommentare / Discussions | Teilabdeckung | Agent | jetzt via `event-to-cloud-agent.yml` |
| GitHub Plugin MCP | fehlt oft | Dashboard MCP | User: Settings → MCP → GitHub |
| Linear | MCP auth ok (Desktop) | Issue→Agent | Cursor Automation + webhook `/ingest/linear` |
| Slack | MCP auth ok (Desktop) | Msg→Agent | Automation + `/ingest/slack` |
| Sentry/Vercel/CF/Resend | — | Webhook→Agent | `/ingest/{source}` + Shared Secret |
| Auto-Push | Hook | Hook | aktiv (kein Diff-Tab) |
| Auto Draft-PR | Hook+Workflow | Hook+Workflow | aktiv nach Push `cursor/**` |
| Draft→ready | fehlte (#135) | pr-auto-merge | aktiv wenn automerge + checks green |
| Auto-Merge | label+checks | label+checks | Repo Allow auto-merge + Branch Protection |
| GitLab | Mirror | Sync only | unverändert |

## Secrets (Namen only)

**GitHub:** `CURSOR_API_KEY`, `AGENTMEMORY_SECRET`, `AGENTMEMORY_URL`, `LINEAR_API_KEY` (opt), `CIRCUIT_BREAKER_URL` (opt)  
**VPS** `/opt/nexifyai/config/cursor-cloud.env`: `CURSOR_API_KEY`, `EVENT_INGEST_SHARED_SECRET`, `GH_PAT`, `AGENTMEMORY_SECRET`

## User-Klicks (Cursor Cloud)

1. [cursor.com/dashboard/cloud-agents](https://cursor.com/dashboard/cloud-agents) → API Key → GitHub Secret `CURSOR_API_KEY`
2. GitHub mit Cloud Agents verknüpfen
3. Background Agents / Automations aktiv; Budget prüfen
4. Settings → MCP: Linear + Slack (auth), **GitHub Plugin** nachziehen
5. Automations-Editor: Drafts in `.cursor/automations/` öffnen (Linear/Slack/CI)
6. GitHub Repo: Allow auto-merge; required checks; Labels `automerge`, `do-not-merge`, `agent-fix`
7. VPS: `bash deploy/autopilot/install-event-ingest.sh` + Ingest-URL hinter Traefik/CF

## GitHub-Event-Abdeckung

`event-to-cloud-agent.yml` startet den Cloud Agent jetzt für:

- `issues`: `opened`, `edited`, `reopened`, `labeled`
- `issue_comment`: neue Kommentare (PR-Kommentare direkt; Issue-Slash-Commands weiter über `issues-lifecycle`)
- `pull_request`: `opened`, `edited`, `reopened`, `synchronize`, `ready_for_review`, agentische Labels
- `pull_request_review`: eingereichte/bearbeitete Reviews mit Text oder `changes_requested`
- `pull_request_review_comment`: Inline-Review-Kommentare
- `discussion`, `discussion_comment`: GitHub Discussions inkl. Antworten
- `repository_dispatch`: Alerts/Webhooks inkl. generischem `gitlab-event`
- `workflow_run`: fehlgeschlagene CI-Läufe

Guards bleiben aktiv: `human-gate`/`blocked`, Circuit Breaker, Repo-Scoped, kein Force-Push auf `main`.

## Issues Lifecycle

Siehe [`ISSUES-AUTOMATION.md`](./ISSUES-AUTOMATION.md) — Auto-Label, Triage, Stale, Human-gate.
`issues-lifecycle` kümmert sich weiter um Labels, Triage-Kommentar und Slash-Commands; eigentliche Agent-Launches laufen zentral über `event-to-cloud-agent`.

## Guards / HARD STOPs (NO_CONFIRMATION Ausnahmen)

- Kein Force-Push auf `main`/`develop`
- Draft-PR zuerst; Merge nur squash + green checks (Draft→ready automatisch)
- `do-not-merge` deaktiviert Auto-Merge
- Circuit Breaker vor Cloud-Launch / MCP
- Keine Secrets in Chat/Commits (keine erfundenen Secret-Werte)
- Kein Hermes Prod-Cutover ohne Endabnahme
- Kunden-/Regelwerk-Logik nur mit Governance-Protokoll

## Test

```bash
# Action-only ohne Key
python3 scripts/event-ingest/dispatch_cloud_agent.py \
  --repo-url https://github.com/nexifyai-dev/nexify-agentur-plattform \
  --ref main --event-name workflow_dispatch --reason smoke --run-id t1 --action-only

gh workflow run "Event → Cursor Cloud Agent" -f prompt="Smoke triage" -f source=manual
```
