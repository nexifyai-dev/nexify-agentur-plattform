# FILE: /opt/nexifyai/docs/live/GESAMTSYSTEM-INTEGRATION-GAP-2026-07-31.md
# NIR: 31.07.2026 10:45
# UPDATED: 31.07.2026 11:15
# NAME: NeXifyAI Langlauf Agent
# TEAM: NeXifyAI Core
# WHAT: IST vs SOLL Gap-Matrix Gesamtsystem-Integration (keine Secrets)
# WHY: Mandat platform — eine Workstation-Zentrale; Gaps → Fix oder Action
# DEPENDS: SOLL-GESAMTKONZEPT, CURSOR-TECHNISCHE-ZENTRALE, AGENT-TOOLING-PRODUCTION-READY
# DESIGN-SOT: Platform = Design System v2.0 · Website = PR47 Emergent
# KATEGORIE: platform

## Kurzfazit

Kern-Runtime (AgentMemory, LightRAG, 9Router, Hermes Workspace/WebUI, GitLab) ist **live**.
Voll-Integration in **eine** WebUI-Zentrale ist **nicht** erreicht: parallele Surfaces, Paperclip down,
OpenMCP/1Backend nur Repo/Teil-API, Monitoring lokal OK aber CF-Hostname-Drift, Monorepo-MCP LightRAG in PR#98.

**Arbeitsplatz-SoT (Mandat):** `https://webui.nexifyai.cloud/`  
**IST-Shell (Workspace):** `https://dashboard.nexifyai.cloud/` → `127.0.0.1:4001` (hermes-workspace)  
**IST-Hermes-WebUI:** `https://webui.nexifyai.cloud/` → `:8787` (Login 302)  
→ Decision-Pointer: `/opt/nexifyai/docs/decisions/DECISION-2026-07-31-WEBUI-ZENTRALE-VS-DASHBOARD.md`

## Live Health (2026-07-31 11:15, keine Secrets)

| Endpoint | Ergebnis |
|----------|----------|
| AgentMemory `127.0.0.1:3111/agentmemory/livez` | ok (Bearer) |
| AgentMemory Viewer `:3113` / Tunnel | 200 |
| LightRAG `:9622/health` | healthy; `/query` via `X-API-Key` OK |
| 9Router `:20128/api/health` | ok |
| Hermes Gateway `:8644/health` | ok |
| Hermes Workspace `:4001` / dashboard.* | 200 |
| Hermes WebUI `:8787` / webui.* | 302 login |
| Backend FastAPI `:8901/api/health` | ok (OpenAPI 61 paths); `/health` 404 |
| OpenDesign html-anything `:3002` | 200 lokal |
| Grafana `:3000/api/health` | 200 lokal |
| Paperclip `:3100` | DOWN — `blocked_no_app_tree` (apps/paperclip = README Planned) |
| Redis `:6379` | up (revive policy) |
| grafana/opendesign/openapi/openmcp public DNS | unresolved / classic DNS MISSING |
| Circuit Breaker `:8912/check` | allow true |

## Gap-Matrix IST vs SOLL

| Komponente | SOLL | IST 2026-07-31 | Status | Nächste Aktion |
|------------|------|----------------|--------|----------------|
| **WebUI-Zentrale** | Eine Surface; Dashboard-Funktionen nativ | webui=:8787 + dashboard=:4001 parallel | GAP | Decision Doc + Konsolidierungsplan Preview-Branch |
| **Dashboard→WebUI native** | Keine Doppel-Dashboards/Iframes Dauer | Workspace hat Kanban/MCP/Terminal nativ; Grafana oft Traefik-Path | TEIL | Native Views Spec → Feature-Branch |
| **AgentMemory** | Pflicht Brain + MCP TOOLS=all + Inject | REST+Viewer OK; Session-MCP catalog teils missing | TEIL | Cursor Session MCP reconnect Action |
| **LightRAG** | Native Module + Dual-Write | healthy; Query X-API-Key verifiziert | TEIL | Ingest Gap-Doc; Dual-Write Hook (PR#98) |
| **9Router** | Allowlist + Cascades | `/api/health` ok; Poolside Key fehlt | TEIL | Action blocked Keys |
| **1Backend** | Neuintegration / Backend | VPS-Repo idle; **NeXify Backend :8901** deckt API | TEIL | ICD-Delta Monorepo; kein Blind-Vendor |
| **OpenAPI** | ICD/Clients | `:8901/openapi.json` 61 paths live | OK-TEIL | `/health` Alias **blocked** bis Ruff/MyPy cleanup (37 Ruff + MyPy pre-existing) |
| **OpenMCP** | OpenAPI→MCP Workflow | Repo `/opt/nexifyai/repos/openmcp`, kein Prod-Dienst | GAP | Spec Phase B: `openmcp.json` Allowlist |
| **OpenDesign** | Native Design-Editor | html-anything `:3002` lokal; kein CF `opendesign.*` | TEIL | Tunnel public hostname / WebUI-Route |
| **Monitoring** | Grafana+Prom in System | Docker up; Traefik `:3000` FIX | TEIL | CF: grafana Host via tunnel wildcard Traefik; classic DNS MISSING |
| **Paperclip** | Factory `:3100` | README-Stub; Gate sense-only; Redis OK | **BLOCKED** | Action blocked — echte Factory-Tree/Image nötig |
| **GitLab OSS** | Mirror + CI | `:8922` OK; CI WARN ohne deploy:vps | TEIL | soll-deviation WARN |
| **GitHub** | SoT + PR | #98 draft gap-fixes; #90 draft CI; #97 **MERGED** Venlo | OK | — |
| **Codespace pancake** | — | = Monorepo Branch PR#90 (kein Drift-Fork) | OK | Pointer-Doc; nach Merge Codespace stoppen |
| **Monorepo Hooks** | Dual-Write AM+LightRAG | in PR#98 | FIX-PR | Merge #98 |
| **MCP Cursor lean** | AM+Context7+LightRAG (+gitlab-oss) | mcp.json(+example) in PR#98 | FIX-PR | Session reconnect |
| **n8n** | Abbau | `n8n_integration: false` | OK | — |

## Codespace (NEU 11:10)

`ubiquitous-space-pancake-q7r5qvj444wxc46pg.github.dev` → Repo `nexifyai-dev/nexify-agentur-plattform` · Branch `copilot/fix-github-actions-build-backend-image` · PR **#90 draft**.  
Detail: Monorepo `docs/live/CODESPACE-UBIQUITOUS-SPACE-PANCAKE-2026-07-31.md`.

## Sofort-Fixes (Session-Status)

1. Traefik `grafana` Backend `:3030` → `:3000` — **done** (Backup `backups/gesamtsystem-fix-*`)
2. Monorepo `.cursor/mcp.json` + example LightRAG — **PR#98 draft**
3. Autopilot Job `gesamtsystem-integration-gap` — **PR#98 / VPS**
4. Backend `/health` Alias — **deferred** (Ruff 37 errors / MyPy pre-existing auf `backend/server.py`)
5. AgentMemory saves (≥3) + Action Paperclip — **done** 11:07
6. LightRAG `/query` verify — **done** (X-API-Key)
7. PR#98 → draft — **done**; PR#90 → draft — **done**; SEO #97 — **MERGED**
8. OpenMCP/1Backend ICD-Delta — **Monorepo Doc**
9. CF DNS grafana/opendesign — **pending** (Token: Zone read OK; named records MISSING; DNS list/write 403)

## Remaining Blockers (Actions)

| ID | Titel | Status |
|----|-------|--------|
| GSC | Property www.nexifyai.cloud verifizieren | pending (SEO, Ops) |
| POOLSIDE_API_KEY | Env fehlt | blocked |
| Paperclip revive | no app tree / Factory absent (README Planned ≠ :3100) | **blocked** |
| CF DNS grafana/opendesign/openapi | Classic DNS MISSING; token scope list=403; Tunnel remote ohne grafana-Hostname (nur `*.`→:8080) | pending |
| Cursor Session MCP | user-agentmemory/lightrag nicht in Session catalog | pending |
| OpenMCP Runtime | Repo only — Spec Phase B | pending |
| Backend `/health` | nach Ruff/MyPy cleanup | pending |
| WebUI Cutover | Policy Preview-Smoke | blocked bis Smoke |
| 1Backend Deploy | Spec-first, kein Parallel-OS | pending |

## GitHub Org Einbeziehung

Inventar via `unset GITHUB_TOKEN; gh repo list nexifyai-dev --limit 200`.

| Klasse | Repos (Auswahl) | Handlung |
|--------|-----------------|----------|
| A Feature-SoT | `nexify-agentur-plattform` | einzige Feature-PRs |
| B Runtime-Fork | `agentmemory`, `LightRAG`, `9router`, `hermes-agent`, `hermes-webui*` | read-only außer Hotfix→Backport |
| C Migrate-pending | `open-design`, `html-anything`, `nexify-portal`, `nexifyai-cockpit`, `paperclip*` | Spec→Monorepo |
| D Archive-candidate | Legacy Website/Workstation Duplikate | Archive+Pointer |
| E Never | `root-9router-runtime-snapshot` | isoliert |
| F Customer | `bookando-*`, `studienkolleg-*`, `lv-ai`, … | Isolation |
| G VPS-only | `1backend`, `openmcp` (kein GH Org) | ICD-Delta; Import nur Adapter |

Detail: Monorepo `docs/live/GITHUB-ORG-MONOREPO-DRIFT-2026-07-31.md` · `docs/architecture/OPENMCP-1BACKEND-ICD-DELTA-2026-07-31.md` · Plan `docs/architecture/MONOREPO-KONSOLIDIERUNG-PLAN.md`

## Evidence-Pfade

- Dieses Doc
- `/opt/nexifyai/docs/decisions/DECISION-2026-07-31-WEBUI-ZENTRALE-VS-DASHBOARD.md`
- Backup: `/opt/nexifyai/backups/gesamtsystem-fix-*`
- Traefik: `/opt/nexifyai/traefik/dynamic/main-routers.yml`
- Autopilot: `/opt/nexifyai/config/autopilot/jobs.yaml` · state `paperclip-redis-revive.json`
- Active tunnel SoT: Cloudflare API ingress (local `/etc/cloudflared/config.yml` draft/token-drift)
- Monorepo Branch: `cursor/gesamtsystem-integration-gap-7dd5` · PR#98
- Codespace Doc: Monorepo `docs/live/CODESPACE-UBIQUITOUS-SPACE-PANCAKE-2026-07-31.md`
- SOLL: `/opt/nexifyai/docs/architecture/SOLL-GESAMTKONZEPT.md`

## Verify (Smoke)

```bash
curl -sS http://127.0.0.1:3000/api/health
curl -sS -H "Host: grafana.nexifyai.cloud" http://127.0.0.1:8080/api/health
curl -sS http://127.0.0.1:20128/api/health
curl -sS http://127.0.0.1:9622/health
curl -sS -H "Authorization: Bearer $AGENTMEMORY_SECRET" http://127.0.0.1:3111/agentmemory/livez
curl -sS http://127.0.0.1:8901/api/health
bash /opt/nexifyai/scripts/autopilot/jobs/gesamtsystem-integration-gap.sh
unset GITHUB_TOKEN; gh pr view 98 --json isDraft,state,url; gh pr view 90 --json isDraft,state,url; gh pr view 97 --json state
```
