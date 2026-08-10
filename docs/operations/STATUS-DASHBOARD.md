# Ops Status Dashboard (auto-refreshed)

**NIR:** 02.08.2026 09:05  
**UPDATED:** 2026-08-10 06:41:55 UTC
**WHAT:** Single ops glance — automation %, human gate, smoke, sibling PRs.  
**WHY:** Laptop-off needs a living status doc, not chat archaeology.  
**Refresh:** `.github/workflows/daily-smoke.yml` + `scripts/refresh-status-dashboard.sh`  
**Human Gate:** [`HUMAN-GATE-5MIN.md`](./HUMAN-GATE-5MIN.md)  
**Timezone:** Europe/Berlin — [`TIMEZONE-EUROPE-BERLIN.md`](./TIMEZONE-EUROPE-BERLIN.md)

> Placeholder rows below are replaced by the refresh script on schedule / workflow_dispatch. Agents may also run the script locally on the VPS.

## Automation score

| Metric | Before (2026-08-02 audit) | After this closeout |
|--------|---------------------------|---------------------|
| Repo automation (workflows/hooks/docs/config) | ~58% | ~92% |
| Laptop-off (requires human one-time) | ~40% | ~92% **after** Human Gate |
| True 100% | blocked by secrets/OAuth/runner/UI toggles | Human Gate only |

## Human Gate

| Item | Status |
|------|--------|
| Actions secrets (#123) | ⏳ human |
| VPS runner | ⏳ human |
| Cursor Cloud API + GitHub link | ⏳ human |
| GitHub MCP OAuth | ⏳ human |
| Automations Enable (3 drafts) | ⏳ human |

## Hosted daily smoke (ubuntu-latest)

| Probe | Last result | Checked at (UTC) |
|-------|-------------|------------------|
| `SITE_HEALTH` | **PASS** HTTP 200 | 2026-08-10T06:41:55Z |
| `AI_ROUTER_HEALTH` | **PASS** HTTP 200 | 2026-08-10T06:41:55Z |
| `AGENTMEMORY_PUBLIC` | **PASS** HTTP 200 | 2026-08-10T06:41:55Z |

## Sibling automation PRs (do not duplicate)

| PR | Topic | Owner track |
|----|-------|-------------|
| #146 | Draft→Ready automerge | peer |
| #147 | CI signal integrity | peer |
| #148 | Dependabot + control-plane doc | peer |
| #152 | Issues lifecycle | peer |
| this | HUMAN-GATE + smoke + config completeness | `cursor/full-auto-config-close-7dd5` |

## Stack reactivation (runtime, not cutover)

See [`UTILIZATION-GAPS-2026-08-02.md`](./UTILIZATION-GAPS-2026-08-02.md): Gateway `:8644` up; `whatsapp-support` cron intentionally **paused** until model pin; Paperclip revive **disabled**; Hermes WebUI cutover = HARD STOP; remaining utilization gaps deprioritized off the critical product path.

## Quick commands

```bash
unset GITHUB_TOKEN
bash scripts/daily-smoke-hosted.sh
bash scripts/refresh-status-dashboard.sh
bash deploy/autopilot/install-event-ingest.sh
bash scripts/install-dual-write-hook.sh
```
