# Utilization Gaps — Reactivate Existing Stack (2026-08-02)

**NIR:** 02.08.2026 08:56  
**UPDATED:** 02.08.2026 09:00  
**WHAT:** Ops truth after Nutzungs-Audit (~48% utilization) — runtime reactivation, no new products.  
**WHY:** Close known DOWN gaps and stop wasted autopilot cycles against empty trees.  
**Issues:** [#150](https://github.com/nexifyai-dev/nexify-agentur-plattform/issues/150) Paperclip · [#151](https://github.com/nexifyai-dev/nexify-agentur-plattform/issues/151) Utilization gaps  
**Do NOT:** Hermes WebUI cutover / kill dashboard `:4001` without Endabnahme parity · invent secrets · n8n · force push.

## Health curls (post-fix)

| Endpoint | Result |
|----------|--------|
| `curl -sS http://127.0.0.1:8644/health` | **200** `{"status":"ok","platform":"webhook"}` |
| `curl -sS -o /dev/null -w '%{http_code}' http://127.0.0.1:8644/` | 404 (expected; no root handler) |
| `curl -sS http://127.0.0.1:3100/` | **down** (connection refused) |
| `curl -sS http://127.0.0.1:3111/agentmemory/livez` | UP (bootstrap) |
| Hermes WebUI `:8787` / Workspace `:4001` | UP (untouched) |

## 1. Hermes Gateway `:8644`

### Diagnosis
- Unit `hermes-gateway.service` **enabled** but crash-looping: `Failed to load environment files` + `Failed to spawn 'start' task` (`Result: resources`).
- Drop-in `env-file.conf` pointed at **missing** `/opt/nexifyai/.env` (legacy removed; siblings `.env.legacy-not-used-2026-07-31`, `.env.local` remain).
- Python venv `/usr/local/lib/hermes-agent/venv/bin/python` **OK**.
- Intended env path already exists: `/etc/nexifyai/hermes.env`.

### Fix applied (VPS, not Traefik/WebUI cutover)
```bash
# backup then retarget EnvironmentFile
cp -a /etc/systemd/system/hermes-gateway.service.d/env-file.conf \
      /etc/systemd/system/hermes-gateway.service.d/env-file.conf.bak.20260802
printf '%s\n' '[Service]' 'EnvironmentFile=/etc/nexifyai/hermes.env' \
  > /etc/systemd/system/hermes-gateway.service.d/env-file.conf
systemctl stop hermes-gateway.service
systemctl reset-failed hermes-gateway.service
systemctl daemon-reload
systemctl start hermes-gateway.service
# verify
curl -sS http://127.0.0.1:8644/health
```

### Residual notes
- WhatsApp adapter warns: enabled but unpaired (`creds.json` missing) — expected; not a cutover task.
- Telegram still attempting connect (logs).

## 2. Paperclip `:3100`

- Confirmed **absent**: `apps/paperclip/README.md` = Planned stub only.
- Autopilot state: `blocked_no_app_tree`, `fail=1`, timer every 10m.
- **Stopped burn:**
  - `systemctl disable --now nexifyai-autopilot-revive-check.timer`
  - `/opt/nexifyai/config/autopilot/jobs.yaml` job `paperclip-redis-revive` → `enabled: false` (backup `.bak.20260802`)
- Gate entry `paperclip-redis-revive` under `gates:` remains (policy gate, not a runner).

## 3. Hermes Cron (evidence, no spam-create)

- HTTP probes `/cron`, `/api/cron/jobs`, … → **404** (no public cron REST on gateway).
- CLI works while gateway running:
  - `hermes cron status` → Gateway running, ticker OK
  - `hermes cron list` → **1** job: `whatsapp-support` (`4b19751e5920`), schedule every 1m
- That job **errors every tick**: unpinned model drift `ds/deepseek-v4-pro` → `solar-pro3` (spend guard). **Do not auto-create** new jobs until pin decision:
  ```text
  hermes cron edit …   # or cronjob action=update job_id=4b19751e5920 provider=<p> model=<m>
  ```

### Proposed health jobs (docs only — create only after explicit pin + approval)

1. **gateway-health** — every 5m — `curl -sf http://127.0.0.1:8644/health` (local deliver, no LLM).
2. **brain-health** — every 15m — curl 9Router `:20128` + AgentMemory livez + LightRAG `:9622` (local, no LLM).

Prefer systemd timers / existing autopilot `health` job over Hermes LLM cron for pure probes.

## 4. AgentMemory / LightRAG

- Utilization crystal already in AM (`mem_msbg4lat_*`, ~48%).
- Frontier hygiene: marked clearly obsolete **completed** actions → `done` (DB restore, inbox cycle, CF false-alarm). Further batch paused by Circuit Breaker (`memory_action_update` rate).
- LightRAG insert of this reactivate summary: retry when CB allows; text also mirrored in this doc + issues #150/#151.

## 5. Human blockers

| Blocker | Owner |
|---------|--------|
| Pin or pause `whatsapp-support` cron (model drift) | Human / Hermes ops |
| Paperclip product decision (implement vs keep stub) | Product |
| Spaether `:8900`, CF DNS grafana/opendesign | Ops / CF token |
| Cloud Agent secrets / Cursor Automations | Human gate (#123, #126, #127) |
| Hermes production cutover | **HARD STOP** until Endabnahme |
| Orchestrator PR merges | Peer `10f75d28` (this track owns runtime + docs truth only) |

## Coordination

- Branch: `cursor/utilization-reactivate-7dd5`
- Orchestrator overlap: avoid conflicting GitHub PR merges; runtime host fixes are VPS-local (systemd/jobs.yaml under `/opt/nexifyai`).
