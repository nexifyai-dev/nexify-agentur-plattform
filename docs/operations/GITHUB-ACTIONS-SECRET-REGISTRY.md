# GitHub Actions — Secret Name Registry

**NIR:** 02.08.2026 09:05  
**UPDATED:** 02.08.2026 09:05  
**WHAT:** Kanonische Liste aller Secret-/Variable-**Namen** für dieses Repo.  
**WHY:** Agents und Humans brauchen eine SoT ohne Werte.  
**PITFALL:** Niemals Werte committen oder in Issues pasten.  
**Human Gate:** [`HUMAN-GATE-5MIN.md`](./HUMAN-GATE-5MIN.md) · Issue [#123](https://github.com/nexifyai-dev/nexify-agentur-plattform/issues/123)

## Repository secrets (Settings → Secrets and variables → Actions)

| Name | Required | Workflows / consumers | Notes |
|------|----------|----------------------|-------|
| `CURSOR_API_KEY` | P0 laptop-off | `event-to-cloud-agent.yml` | Cursor Cloud Agents API |
| `AGENTMEMORY_SECRET` | P0 | `event-to-cloud-agent.yml`, dual-write hook | Bearer, never log |
| `AGENTMEMORY_URL` | P0 | `event-to-cloud-agent.yml` | Public or tunnel URL for hosted runners |
| `VERCEL_TOKEN` | P0 website deploy | `deploy-vercel.yml` | Preferred name |
| `VERCEL_ACCESS_TOKEN` | alias | `deploy-vercel.yml` | Legacy alias; either/or with `VERCEL_TOKEN` |
| `VERCEL_ORG_ID` | P0 | `deploy-vercel.yml` | Also accepted as repo **variable** |
| `VERCEL_PROJECT_ID` | P0 | `deploy-vercel.yml` | Also accepted as repo **variable** |
| `LINEAR_API_KEY` | recommended | `linear-pr-sync.yml` | Skip sync if unset |
| `CIRCUIT_BREAKER_URL` | optional | `event-to-cloud-agent.yml` | Default soft-allow if missing |
| `VPS_GITLAB_TOKEN` | P1 mirror | `mirror-to-gitlab.yml` | GitLab OSS PAT |
| `VPS_GITLAB_URL` | P1 mirror | `mirror-to-gitlab.yml` | e.g. `https://gitlab.nexifyai.cloud` |
| `VPS_GITLAB_USERNAME` | P1 mirror | `mirror-to-gitlab.yml` | Mirror push user |
| `VPS_HOST` | SSH fallback only | `deploy-vps.yml` | Prefer self-hosted runner |
| `VPS_USER` | SSH fallback | `deploy-vps.yml` | |
| `VPS_PORT` | SSH fallback | `deploy-vps.yml` | |
| `DEPLOY_KEY_VPS` | SSH fallback | `deploy-vps.yml` | Private key PEM |

## Repository variables (non-secret)

| Name | Used for |
|------|----------|
| `VERCEL_TOKEN` | Discouraged — prefer secret |
| `VERCEL_ORG_ID` | OK as variable |
| `VERCEL_PROJECT_ID` | OK as variable |
| `SMOKE_BASE_URL` | Optional override for daily smoke (default production site) |
| `SMOKE_API_HEALTH_URL` | Optional backend health URL for hosted smoke |

## Built-in (do not create)

| Name | Notes |
|------|-------|
| `GITHUB_TOKEN` | Provided by Actions; agents must `unset GITHUB_TOKEN` locally when using `gh` with user creds |

## VPS env files (not GitHub Secrets)

| Path | Names (examples) |
|------|------------------|
| `/etc/nexifyai/hermes.env` | Hermes gateway (retargeted 2026-08-02) |
| `/opt/nexifyai/config/cursor-cloud.env` | `CURSOR_API_KEY`, `EVENT_INGEST_SHARED_SECRET`, `GH_PAT`, `AGENTMEMORY_SECRET` |
| `/etc/nexifyai/secrets.env` | Self-hosted runner job env |
| Local Cursor `.cursor/mcp.json` | `${AGENTMEMORY_SECRET}`, `${GITLAB_PERSONAL_ACCESS_TOKEN}` — from env, never commit |

## Circuit Breaker

| Name | Default |
|------|---------|
| `CIRCUIT_BREAKER_URL` | `http://127.0.0.1:8912` (hook + local) |
| Endpoint | `POST /check` JSON `{actor,tool,params,cost,state_hash}` |

Cursor hook: `.cursor/hooks/circuit-breaker-mcp.sh` (soft-allow if unreachable).

## Verification (no values printed)

```bash
# Names only — exit 0 if API lists them (values never shown)
unset GITHUB_TOKEN
gh secret list -R nexifyai-dev/nexify-agentur-plattform
gh variable list -R nexifyai-dev/nexify-agentur-plattform
gh api repos/nexifyai-dev/nexify-agentur-plattform/actions/runners --jq '.runners[]|{name,status,labels:[.labels[].name]}'
```
