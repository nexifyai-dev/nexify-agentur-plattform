# FILE: apps/webui-preview/openapi-openmcp-panel/README.md
# NIR: 31.07.2026 12:26
# UPDATED: 31.07.2026 12:26
# NAME: NeXifyAI Langlauf Agent
# TEAM: NeXifyAI Core
# WHAT: Preview Stub — OpenAPI + OpenMCP Status für WebUI-Zentrale
# WHY: Gaps OpenAPI/OpenMCP TEIL; Stub #100 MERGED; kein Prod Listener
# DEPENDS: config/openmcp/, docs/architecture/1BACKEND-ADAPTER-SPEC.md
# OFFICIAL: getdatanaut/openmcp · FastAPI OpenAPI
# KATEGORIE: platform

## Start

```bash
python3 -m http.server 8794 --directory apps/webui-preview/openapi-openmcp-panel
```

## Verify

```bash
curl -sS http://127.0.0.1:8901/api/health
curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:8901/openapi.json
test -f config/openmcp/nexify-backend.openmcp.json
```
