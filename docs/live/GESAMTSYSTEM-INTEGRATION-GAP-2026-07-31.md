# FILE: docs/live/GESAMTSYSTEM-INTEGRATION-GAP-2026-07-31.md
# NIR: 31.07.2026 10:45
# UPDATED: 31.07.2026 11:56
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
OpenMCP Stub **`#100` MERGED** (Preview next), 1Backend Adapter-Spec, Monitoring HTTPS OK aber CF-DNS Drift.
Monorepo MCP LightRAG + Dual-Write Hooks: **`#98` MERGED**. OfferCatalog **`#99` MERGED** (live verified).

**Arbeitsplatz-SoT (Mandat):** `https://webui.nexifyai.cloud/`  
**IST-Shell (Workspace):** `https://dashboard.nexifyai.cloud/` → `127.0.0.1:4001` (hermes-workspace)  
**IST-Hermes-WebUI:** `https://webui.nexifyai.cloud/` → `:8787` (Login 302)  
→ Decision: `docs/decisions/DECISION-2026-07-31-WEBUI-ZENTRALE-VS-DASHBOARD.md`  
→ Parity: `docs/architecture/WEBUI-FEATURE-PARITY-CHECKLIST-2026-07-31.md`  
→ Monitoring: `docs/live/MONITORING-WEBUI-NATIVE-POINTER-2026-07-31.md` · OpenDesign: `docs/live/OPENDESIGN-PACK-STATUS-2026-07-31.md`

## Live Health (2026-07-31 11:34, keine Secrets)

| Endpoint | Ergebnis |
|----------|----------|
| AgentMemory `127.0.0.1:3111/agentmemory/livez` | ok |
| AgentMemory Viewer `:3113` / Tunnel | 200 |
| LightRAG `:9622/health` | healthy |
| 9Router `:20128/api/health` | ok |
| Hermes Gateway `:8644/health` | ok (prior) |
| Hermes Workspace `:4001` / dashboard.* | 200 |
| Hermes WebUI `:8787` / webui.* | 302 login; `/login` 200 |
| Backend FastAPI `:8901/api/health` | ok; OpenAPI **67** ops; `/health` 404 |
| OpenDesign html-anything `:3002` | 200 lokal; `html.*` **302 Auth** (restored); `admin/html` **302** |
| Grafana `:3000/api/health` | 200; Traefik HTTPS Host grafana → **200** |
| `127.0.0.1:8080` | **cAdvisor** — nicht Grafana/Traefik (Smoke-Korrektur) |
| Paperclip `:3100` | DOWN — `blocked_no_app_tree` (sense-only Doc) |
| Redis `:6379` | up (revive policy) |
| grafana/opendesign/openapi/openmcp public DNS | unresolved / classic DNS MISSING |
| GitHub→GitLab Mirror | success für `#98`/`#99`/`#100` |
| Circuit Breaker `:8912/check` | allow true (prior) |

## Gap-Matrix IST vs SOLL

| Komponente | SOLL | IST 2026-07-31 | Status | Nächste Aktion |
|------------|------|----------------|--------|----------------|
| **WebUI-Zentrale** | Eine Surface; Dashboard-Funktionen nativ | webui=:8787 + dashboard=:4001 parallel | GAP | Parity-Checkliste + Preview-Branch Smoke |
| **Dashboard→WebUI native** | Keine Doppel-Dashboards/Iframes Dauer | Workspace nativ; Grafana/Design oft Path | TEIL | Native Views laut Parity-Matrix |
| **AgentMemory** | Pflicht Brain + MCP TOOLS=all + Inject | REST+Viewer OK; Session-MCP catalog teils missing | TEIL | Cursor Session MCP reconnect Action |
| **LightRAG** | Native Module + Dual-Write | healthy; Dual-Write Hooks **#98 MERGED** | TEIL | Ingest Gap-Doc; Native UI |
| **9Router** | Allowlist + Cascades | `/api/health` ok; Poolside Key fehlt | TEIL | Action blocked Keys |
| **1Backend** | Neuintegration / Backend | VPS-Repo idle; NeXify Backend `:8901` deckt API | TEIL | `docs/architecture/1BACKEND-ADAPTER-SPEC.md` — Adapter-only |
| **OpenAPI** | ICD/Clients | `:8901/openapi.json` live (**67** ops); `/health` 404 | OK-TEIL | `/health` Alias **blocked** bis Ruff/MyPy cleanup |
| **OpenDesign** | Native Design-Editor | `:3002` OK; `html.*` **auth+TLS** Login-Smoke 302 | TEIL | Native Panel; CF DNS blocked |
| **OpenMCP** | OpenAPI→MCP Workflow | Stub `#100`; Preview CLI help+allowlist verify 11:56 | TEIL | stdio run OK (timeout); kein Prod |
| **Monitoring** | Grafana+Prom in System | Docker + Traefik HTTPS OK; CF DNS MISSING | TEIL | `docs/live/MONITORING-WEBUI-NATIVE-POINTER-2026-07-31.md` |
| **Paperclip** | Factory `:3100` | README-Stub; Autopilot sense-only | **BLOCKED** | `docs/live/PAPERCLIP-AUTOPILOT-SENSE-ONLY-2026-07-31.md` |
| **GitLab OSS** | Mirror + CI | Mirror OK; `deploy:vps` Manual-Gate | TEIL | `docs/live/GITLAB-GITHUB-MIRROR-HEALTH-2026-07-31.md` |
| **GitHub** | SoT + PR | `#90`/`#99`–`#103` MERGED; `#105` docs auth/OpenMCP | OK | — |
| **Codespace pancake** | — | Branch war PR `#90` (**MERGED**) | OK | Codespace stoppen |
| **Monorepo Hooks** | Dual-Write AM+LightRAG | **#98 MERGED** | OK | Session reconnect MCP |
| **MCP Cursor lean** | AM+Context7+LightRAG (+gitlab-oss) | example in `#98` | TEIL | Session reconnect |
| **n8n** | Abbau | `n8n_integration: false` | OK | — |

## Codespace

`ubiquitous-space-pancake-q7r5qvj444wxc46pg.github.dev` → Repo `nexifyai-dev/nexify-agentur-plattform` · Branch `copilot/fix-github-actions-build-backend-image` · PR **`#90`**.  
Detail: `docs/live/CODESPACE-UBIQUITOUS-SPACE-PANCAKE-2026-07-31.md`.

## Sofort-Fixes (Session-Status)

1. Traefik `grafana` Backend `:3030` → `:3000` — **done**
2. Monorepo `.cursor/mcp.json` + LightRAG — **`#98` MERGED**
3. Autopilot Job `gesamtsystem-integration-gap` — **#98 / VPS**
4. Backend `/health` Alias — **deferred** (Ruff/MyPy pre-existing)
5. AgentMemory saves + Action Paperclip — **done**
6. LightRAG `/query` verify — **done**
7. SEO Venlo `#97` — **MERGED**; OfferCatalog `#99` — **MERGED**; live `/leistungen` OfferCatalog+Service+449 **verified**
8. OpenMCP ICD + Allowlist Stub **`#100` MERGED**; 1Backend Adapter-Spec — **diese Lieferung**
9. CF DNS grafana/opendesign — **pending** (write 403)
10. WebUI Feature-Parity-Checkliste — Draft `#101`
11. GitLab `deploy:vps` Manual-Gate Job — **diese Lieferung** (soll-deviation WARN)
12. Monitoring/OpenDesign/Paperclip/Mirror Pointer-Docs + Decision Monorepo-Spiegel — **diese Lieferung**
13. Live-verify `#99` `/leistungen` OfferCatalog LD + `#100` OpenAPI operationIds — **done**
14. OpenDesign `html.*` TLS Fix — **done**; native-module-links — **#101 MERGED**; `admin.*` Auth-MW collision Fix — **done** (302 login, not 404)
15. `html.*` auth-forward restore + Login-Smoke — **done** (302→Admin Login); CF DNS grafana/html — **blocked** (No answer); Paperclip — **blocked_no_app_tree**; OpenMCP preview CLI — **done** (help+allowlist; shebang bypass)

## Remaining Blockers (Actions)

| ID | Titel | Status |
|----|-------|--------|
| GSC | Property www.nexifyai.cloud verifizieren | pending (SEO, Ops) |
| POOLSIDE_API_KEY | Env fehlt | blocked |
| Paperclip revive | no app tree / Factory absent | **blocked** |
| CF DNS grafana/opendesign/openapi/html | Classic DNS No answer; write scope absent | **blocked** |
| OpenMCP Runtime | Preview CLI help+allowlist+stdio start 11:56 | pending client wiring |
| Backend `/health` | nach Ruff/MyPy cleanup | pending |
| WebUI Cutover | Policy Preview-Smoke | blocked bis Smoke |
| 1Backend Deploy | Adapter-Spec done; kein Parallel-OS | pending (no deploy) |
| GitLab deploy:vps | Manual-Gate Job in `.gitlab-ci.yml` | pending verify after merge |

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

Detail: `docs/live/GITHUB-ORG-MONOREPO-DRIFT-2026-07-31.md` · `docs/architecture/OPENMCP-1BACKEND-ICD-DELTA-2026-07-31.md` · `docs/architecture/MONOREPO-KONSOLIDIERUNG-PLAN.md`

## Evidence-Pfade

- Dieses Doc · Parity-Checkliste · `docs/decisions/DECISION-2026-07-31-WEBUI-ZENTRALE-VS-DASHBOARD.md`
- `docs/live/MONITORING-WEBUI-NATIVE-POINTER-2026-07-31.md`
- `docs/live/OPENDESIGN-PACK-STATUS-2026-07-31.md`
- `docs/live/PAPERCLIP-AUTOPILOT-SENSE-ONLY-2026-07-31.md`
- `docs/live/GITLAB-GITHUB-MIRROR-HEALTH-2026-07-31.md`
- `docs/architecture/1BACKEND-ADAPTER-SPEC.md`
- Backup: `/opt/nexifyai/backups/gesamtsystem-fix-*`
- Traefik: `/opt/nexifyai/traefik/dynamic/main-routers.yml`
- Autopilot: `/opt/nexifyai/config/autopilot/jobs.yaml`
- OpenMCP stub: `config/openmcp/` (`#100`)
- SOLL: `/opt/nexifyai/docs/architecture/SOLL-GESAMTKONZEPT.md`

## Verify (Smoke)

```bash
curl -sS http://127.0.0.1:3000/api/health
curl -sk --resolve grafana.nexifyai.cloud:443:127.0.0.1 https://grafana.nexifyai.cloud/api/health
curl -sS http://127.0.0.1:20128/api/health
curl -sS http://127.0.0.1:9622/health
curl -sS http://127.0.0.1:8901/api/health
curl -sS https://www.nexifyai.cloud/leistungen | grep -o OfferCatalog | head -1
unset GITHUB_TOKEN
gh pr view 99 --json state,mergedAt
gh pr view 100 --json state,mergedAt
gh pr view 101 --json isDraft,state,url
gh pr view 90 --json isDraft,state,url
gh run list --workflow=mirror-to-gitlab.yml --limit 3
```
