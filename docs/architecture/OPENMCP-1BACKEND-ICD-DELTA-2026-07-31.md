# FILE: docs/architecture/OPENMCP-1BACKEND-ICD-DELTA-2026-07-31.md
# NIR: 31.07.2026 11:10
# UPDATED: 31.07.2026 11:10
# NAME: NeXifyAI Langlauf Agent
# TEAM: NeXifyAI Core
# WHAT: ICD-Delta / Spec-Import-Plan OpenMCP + 1Backend (VPS-Inventar, kein Blind-Vendoring)
# WHY: SOLL Gesamtsystem — Gaps → Spec/Pointer; Code nur bei klarem Import-Pfad
# DEPENDS: SOLL-GESAMTKONZEPT, GESAMTSYSTEM-INTEGRATION-GAP, CONNECTION_FABRIC
# OFFICIAL-DOCS: https://1backend.com/docs · OpenMCP README (getdatanaut/openmcp)
# KATEGORIE: platform

## Inventar VPS (2026-07-31, Evidence)

| Komponente | Pfad | Upstream | Runtime IST | Port |
|------------|------|----------|-------------|------|
| **OpenMCP** | `/opt/nexifyai/repos/openmcp` | `github.com/getdatanaut/openmcp` | Repo only (Yarn/Nx Monorepo: `packages/{cli,server,openapi,…}`) | — kein Listener |
| **1Backend** | `/opt/nexifyai/repos/1backend` | `github.com/1backend/1backend` (v0.9.x) | Repo only (`docker-compose.yaml` idle) | — nicht gestartet |
| **NeXify Backend** | Monorepo `backend/` + Live | eigen | **LIVE** FastAPI | `127.0.0.1:8901` (`/api/health` ok, OpenAPI 61 paths; `/health` = 404) |
| **OpenDesign** | html-anything | lokal | LIVE Next | `127.0.0.1:3002` 200 |

## Mapping SOLL → IST

| SOLL-Begriff | Rolle im Gesamtsystem | IST-Deckung | Gap |
|--------------|----------------------|-------------|-----|
| OpenAPI | ICD / Clients / MCP-Futter | `:8901/openapi.json` | Health-Alias `/health`; optional Client-Gen |
| OpenMCP | OpenAPI→MCP Workflow für Agents/WebUI-Tools | Repo vorhanden, **kein Prod-Dienst** | Spec: generate MCP from live OpenAPI; Cursor MCP lean bleibt AM+Context7+LightRAG(+gitlab-oss) |
| 1Backend | AI-native Microservices-Platform (Auth/Routing/ORM) | Upstream idle; **NeXify Backend deckt API** | Spec: Feature-Matrix 1Backend vs `backend/` — nur fehlende Bausteine übernehmen, kein Parallel-OS |
| OpenDesign | Design-Editor nativ in WebUI | `:3002` lokal; kein `opendesign.*` CF | Traefik/WebUI-Path oder Tunnel-Hostname |
| Paperclip Factory | Skills `:3100` | DOWN `blocked_no_app_tree` | siehe Gap-Doc — Stub README ≠ Factory |

## Spec-Import-Plan (ohne Blind-Code)

### Phase A — Pointer (diese Lieferung)

1. Dieses ICD-Delta + Gap-Matrix-Update.
2. Klasse **G VPS-only** in Drift-Doc: OpenMCP/1Backend bleiben **externe Upstream-Clones**, nicht vendored.
3. Action `pending`: OpenMCP Runtime Spec (OpenAPI-URL = `http://127.0.0.1:8901/openapi.json`).

### Phase B — OpenMCP (klar, niedriges Risiko)

1. Offizielle CLI: `npx -y openmcp install <openapi> --client cursor` (Docs: packages/cli README).
2. Ziel-Artefakt im Monorepo: `config/openmcp/nexify-backend.openmcp.json` (nur operationId-Allowlist, keine Secrets).
3. Laufzeit: stdio/SSE **dev/preview**; Produktion erst nach Smoke + Circuit-Breaker.
4. WebUI: Tools erscheinen über Agent/MCP — **kein Iframe**, kein zweites Dashboard.

### Phase C — 1Backend (hoch, Spec-first)

1. Feature-Matrix: Auth, Multitenant-Routing, LLM-Container, ORM vs bestehende Supabase/FastAPI.
2. Entscheidung: **Adapter** (1Backend nur wo NeXify Backend fehlt) vs **kein Deploy**.
3. Kein `docker compose up` auf Prod ohne Backup + Freigabe-Grenze Cutover.
4. Wenn Adapter: `docs/architecture/1BACKEND-ADAPTER-SPEC.md` + Preview-Branch — erst dann Code.

### Phase D — Explizit nicht

- Vendor kompletter Upstream-Trees in `apps/`.
- Parallel-Production von 1Backend neben `:8901`.
- n8n-Ersatz über OpenMCP (n8n abgeschafft).

## WebUI-Zentrale Bedarf

| Surface | Bedarf OpenMCP/1Backend |
|---------|-------------------------|
| `webui.nexifyai.cloud` | MCP-Tools aus OpenAPI (Phase B); kein 1Backend-UI-Embed |
| `dashboard.nexifyai.cloud` | Legacy Workspace — keine neue Abhängigkeit |
| Monitoring/Grafana | unabhängig (Traefik/CF) |

## Verify

```bash
curl -sS http://127.0.0.1:8901/api/health
curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:8901/openapi.json
test -d /opt/nexifyai/repos/openmcp/packages/cli
test -f /opt/nexifyai/repos/1backend/docker-compose.yaml
ss -ltn | grep 8901
```
