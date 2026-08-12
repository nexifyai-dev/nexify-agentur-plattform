# FILE: docs/operations/PRODUCTION-READINESS-BOARD.md
# NIR: 02.08.2026 09:25
# UPDATED: 02.08.2026 09:25
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI DevOps
# WHAT: Living green/yellow/red production-readiness board with exact human actions
# WHY: Cursor-owned gaps closed; remaining blockers are human gates (#123) or Endabnahme
# BEST-PRACTICE: URLs + evidence; no secret values; update after each merge wave
# PITFALL: Do not mark Hermes cutover green without Endabnahme
# DEPENDS: HUMAN-GATE-5MIN.md · STATUS-DASHBOARD.md · Issue #123
# DOCS-REF: CHARTA.md · Issue #141
# SESSION: production-readiness-close-7dd5

# Production Readiness Board — NeXify AI

**Stand:** 2026-08-02 ~09:25 CEST  
**Owner:** Cursor lead ops (confirmation-free for Cursor-owned work)  
**Human checklist:** [`HUMAN-GATE-5MIN.md`](./HUMAN-GATE-5MIN.md) · Issue [#123](https://github.com/nexifyai-dev/nexify-agentur-plattform/issues/123)

Legend: 🟢 green · 🟡 yellow (degraded/pending CI) · 🔴 red (blocked human/Endabnahme)

---

## A. Edge & Runtime Health

| Item | Status | Evidence / URL | Notes |
|------|--------|----------------|-------|
| Website health | 🟢 | https://www.nexifyai.cloud/api/health | `{"status":"ok"}` |
| Backend API health | 🟢 | https://api.nexifyai.cloud/api/health | `db: supabase` |
| AgentMemory public | 🟢 | https://agentmemory.nexifyai.cloud | live |
| AgentMemory local REST | 🟢 | http://127.0.0.1:3111/agentmemory/livez | ok |
| Hermes Gateway | 🟢 | http://127.0.0.1:8644/health | `platform: webhook` |
| 9Router public | 🟢 | https://ai-router.nexifyai.cloud/api/health | ok |
| LightRAG local | 🟢 | http://127.0.0.1:9622/health | healthy |
| Paperclip revive | 🟢 | `jobs.yaml` `paperclip-redis-revive.enabled: false` | stays off |
| WhatsApp error-loop | 🟢 | timers/services **disabled** | re-enable only with paired session + pinned model |
| Grafana / Prometheus / Open* public | 🟡 | tunnel/DNS | SOLL WARN — non-blocking for website/API |

---

## B. Product Flows

| Item | Status | Evidence | Notes |
|------|--------|----------|-------|
| Booking slots (#124) | 🟢 | `GET /api/booking/slots` → **21** free slots | Seeded via admin API; script in PR #154 |
| Auth `/api/auth/me` (#117) | 🟢 | login → me returns admin JSON | Live smoke 2026-08-02 |
| `/konto` + `/admin` pages | 🟢 | HTTP 200 after login cookie | |
| Offers schema website↔backend | 🟡 | planner/chat send SoT fields; route strips extras in PR | Merge readiness PR |
| SEO noindex portals / OG | 🟡 | PR #160 automerge | Waiting required CI |
| Next security bump | 🟡 | PR #143 automerge | Waiting required CI |

---

## C. Automation / CI

| Item | Status | URL / Path | Notes |
|------|--------|------------|-------|
| Open PR merge queue | 🟡 | https://github.com/nexifyai-dev/nexify-agentur-plattform/pulls | Automerge labeled; waiting 7 required checks |
| CI skip≠success (Deploy) | 🟢 | merged #147 | Honest fail without secrets — OK |
| Issues lifecycle | 🟢 | merged #152 | label→agent→close→stale on main |
| Draft→ready→automerge | 🟡 | PR #157 / related | Conflicts resolved on draft loop; needs green CI on main |
| Daily smoke hosted | 🟢 | merged #156 (+ #158 follow-up) | hosted smoke path on main |
| Dependabot | 🟡 | `.github/dependabot.yml` (this PR) | Labels include `automerge` |
| Self-hosted runner | 🔴 | Issue #123 | **0 runners** — human |
| Actions secrets | 🔴 | Issue #123 · `GITHUB-ACTIONS-SECRET-REGISTRY.md` | Human fill names only |
| Cursor Automations UI | 🔴 | HUMAN-GATE step 5 | Human enable drafts |
| MCP OAuth (GitHub plugin) | 🔴 | HUMAN-GATE step 4 | Human click |

---

## D. Brain Alignment

| Item | Status | Notes |
|------|--------|-------|
| Dual-write hook | 🟢 | `scripts/install-dual-write-hook.sh` · local `dual_write_ready=1` |
| LightRAG SoT seed | 🟢 | Origin `:9622` + `X-API-Key`; design/CHARTA present (409=already); Hermes BLEIBEN decision seeded |
| MCP example `TOOLS=all` | 🟢 | `.cursor/mcp.json.example` |
| Lesson “LR removed” superseded | 🟢 | Lesson saved: LightRAG **required** dual-write companion |

---

## E. Workstation (no cutover)

| Item | Status | Notes |
|------|--------|-------|
| AgentMemory panel preview | 🟢 | `apps/webui-preview/agentmemory-panel` · :8792 |
| LightRAG panel preview | 🟢 | `apps/webui-preview/lightrag-panel` · :8793 |
| 9Router panel preview | 🟢 | `apps/webui-preview/ninerouter-panel` · :8794 |
| Dual-dashboard parity checklist | 🟢 | Comment on [#141](https://github.com/nexifyai-dev/nexify-agentur-plattform/issues/141) |
| Kill dashboard :4001 / Traefik swap | 🔴 | **HARD STOP** — Endabnahme only |

---

## Exact human actions (remaining red)

1. **#123 secrets** — set repository Actions secrets (names in registry; **never paste values in chat/issues**).  
2. **#123 runner** — register Linux self-hosted runner with labels `self-hosted`, `vps`, `nexifyai`.  
3. **Cursor Cloud API key** → secret `CURSOR_API_KEY`.  
4. **GitHub MCP OAuth** in Cursor Settings → MCP.  
5. **Cursor Automations** — open drafts under `.cursor/automations/` → Enable.  
6. After 1–2: re-run Daily Smoke workflow + Event→Cloud Agent dry-run; comment evidence on #123.

Optional same session: Linear/Slack MCP auth.

---

## Merge queue snapshot (Cursor-owned)

Track: https://github.com/nexifyai-dev/nexify-agentur-plattform/pulls?q=is%3Aopen+is%3Apr+label%3Aautomerge

Recently merged: #144 develop triggers · #145 AM panel · #147 CI signal integrity · #117 auth/me · …

---

## Update protocol

After human gates clear or merge wave lands: refresh this board + `STATUS-DASHBOARD.md` + `memory_save` with URLs.
