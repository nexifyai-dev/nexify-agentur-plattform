# Issues Automation — End-to-End Lifecycle

**Stand:** 2026-08-02  
**Branch:** `cursor/automate-issues-lifecycle-7dd5`  
**Workflows:** `.github/workflows/issues-lifecycle.yml` + `event-to-cloud-agent.yml`  
**Script:** `scripts/issues/lifecycle_triage.py`

## Loop

```
Issue opened / edited / labeled /comment (/triage|/agent-fix)
  → issues-lifecycle: keyword auto-label
  → triage checklist comment (einmal, Marker)
  → wenn agent-fix | P0  UND  nicht human-gate|blocked:
        → repository_dispatch agent-fix
        → event-to-cloud-agent → Cursor Cloud Agent (PC-off)
  → Agent: Branch cursor/* → Draft-PR mit Fixes #N
  → CI green → (optional) automerge
  → Merge auf Default-Branch: GitHub schließt Issue via Fixes/Closes/Resolves #N
  → Stale: 14d inaktiv → label stale; +7d → close
       Exempt: P0, blocked, human-gate
```

## Auto-Labels (Keywords)

| Signal im Title/Body | Label |
|----------------------|-------|
| bug / regression / crash | `bug` |
| docs / documentation / readme | `documentation`, `docs` |
| `[ops]` / ops | `ops` |
| `P0` | `P0` |
| security / cve / dependabot / codeql | `security` |
| `[agent-task]` / cursor cloud | `agent-task`, `agent-fix` |
| secrets missing / human-gate / Hermes cutover | `human-gate`, `blocked` |

## Human-gate Schutz

- Template **Ops / Human-gate** setzt `human-gate` + `blocked` (+ oft `P0`).
- **Kein** Cloud-Agent-Launch (`issues-lifecycle` + `event-to-cloud-agent` skippen).
- **Kein** Stale-Close (`actions/stale` exempt: `P0,blocked,human-gate`).
- Beispiele: #123 (Actions secrets), Hermes Prod-Cutover — nur Mensch.

## Cloud-Agent Launch

| Bedingung | Verhalten |
|-----------|-----------|
| Label `agent-fix` oder `P0`, kein human-gate | `repository_dispatch` → Cloud Agent |
| `CURSOR_API_KEY` fehlt | Kommentar mit Verweis auf #123; kein Launch |
| Kommentar `/agent-fix` | Label setzen + Dispatch versuchen |
| Kommentar `/triage` | Labels neu anwenden |

Siehe auch: [`CLOUD-AGENT-EVENT-INGEST.md`](./CLOUD-AGENT-EVENT-INGEST.md).

## PR schließt Issue (native)

GitHub schließt Issues automatisch, wenn ein PR in den **Default-Branch** merged wird und die Beschreibung/Commit enthält:

- `Fixes #N` / `Closes #N` / `Resolves #N`

Kein Extra-Workflow nötig. Agent-PRs sollen `#N` so referenzieren.

## Stale Hygiene

| | Issues | PRs |
|--|--------|-----|
| Stale nach | 14 Tage | aus (`-1`) |
| Close nach | +7 Tage | aus |
| Exempt | `P0`, `blocked`, `human-gate` | — |

Cron: täglich 06:30 UTC (`issues-lifecycle` schedule job).

## One-shot Label-Backfill

```bash
gh workflow run "Issues Lifecycle" -f backfill_labels=true
```

Nur Issues **ohne** Labels (max 30). Keine Spam-Kommentare auf historische Issues.

## Templates

`.github/ISSUE_TEMPLATE/`: `bug.yml`, `ops-human-gate.yml`, `agent-task.yml`.

## Guards

- Keine Secret-Werte in Issues/Kommentaren/Logs
- Kein Force-Push auf `main`
- Kein Hermes Prod-Cutover ohne Endabnahme
- `automerge` auf PRs nur nach grünen Checks (siehe #135)
