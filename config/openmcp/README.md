# FILE: config/openmcp/README.md
# NIR: 31.07.2026 11:20
# UPDATED: 31.07.2026 11:56
# NAME: NeXifyAI Langlauf Agent
# TEAM: NeXifyAI Core
# WHAT: OpenMCP Phase-B Allowlist-Stub für NeXify Backend OpenAPI → MCP
# WHY: ICD-Delta Phase B — Spec-first, keine Secrets, kein Prod-Listener
# DEPENDS: docs/architecture/OPENMCP-1BACKEND-ICD-DELTA-2026-07-31.md
# OFFICIAL: github.com/getdatanaut/openmcp (packages/cli README)
# KATEGORIE: platform

## Zweck

Stub-Artefakt laut ICD Phase B:

- Datei: `nexify-backend.openmcp.json`
- Quelle: Live-OpenAPI `http://127.0.0.1:8901/openapi.json`
- Inhalt: **nur** `operationId`-Allowlist (read-only Health/Metrics)
- **Keine** Secrets, API-Keys oder Bearer-Tokens in dieser Datei

Upstream bleibt VPS-Clone `/opt/nexifyai/repos/openmcp` (Klasse G VPS-only) — kein Blind-Vendoring in `apps/`.

## Format (offiziell)

`openmcp.json` mappt OpenAPI-Server + Tool-Allowlist per `operationId`. Leere `tools: []` würde **alle** Ops exposen — hier bewusst eng (4 Ops).

## Dev / Preview (stdio)

Voraussetzung: Backend live auf `:8901`.

```bash
curl -sS http://127.0.0.1:8901/api/health
curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:8901/openapi.json

# PITFALL: openmcp bin shebang `env node --no-warnings` fails on some hosts.
# Bypass:
node --no-warnings path/to/node_modules/openmcp/bin/index.js run \
  --config config/openmcp/nexify-backend.openmcp.json
```

**Preview-Evidence 2026-07-31 11:56:** Allowlist 4/4 Ops live `:8901` **200**; `openmcp --help` OK via `node --no-warnings`; `openmcp run --config …` startet stdio (Timeout-Kill, kein Prod-Bind). Kein Cursor-Client-Install committed.

Optional Client-Install (schreibt lokale MCP-Client-Config — **nicht** committen):

```bash
npx -y openmcp install http://127.0.0.1:8901/openapi.json --client cursor
# danach Allowlist in der generierten openmcp.json auf die Tools unten begrenzen
```

Cursor-Lean-MCP bleibt AgentMemory + Context7 + LightRAG (+ gitlab-oss). OpenMCP ist **optionaler** Backend-Tool-Pfad — kein zweites Dashboard, kein Iframe.

## Allowlist (IST 2026-07-31)

| operationId | Methode | Pfad |
|-------------|---------|------|
| `health_api_health_get` | GET | `/api/health` |
| `health_llm_api_health_llm_get` | GET | `/api/health/llm` |
| `health_full_api_health_full_get` | GET | `/api/health/full` |
| `metrics_api_metrics_get` | GET | `/api/metrics` |

Admin-/Auth-/Write-Ops absichtlich **nicht** in der Stub-Allowlist.

## Produktion

Erst nach Smoke + Circuit-Breaker (`:8912`). Kein Prod-SSE/stdio-Cutover in diesem PR.

## Verify

```bash
python3 - <<'PY'
import json,urllib.request
stub=json.load(open('config/openmcp/nexify-backend.openmcp.json'))
tools=stub['servers']['nexify-backend']['tools']
oa=json.load(urllib.request.urlopen('http://127.0.0.1:8901/openapi.json'))
ops={s['operationId'] for p in oa['paths'].values() for s in p.values() if isinstance(s,dict) and 'operationId' in s}
print(all(t in ops for t in tools), tools)
PY
```
