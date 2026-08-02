# FILE: docs/architecture/AGENTMEMORY-NATIVE-VIEW-STUB-2026-07-31.md
# NIR: 31.07.2026 12:20
# UPDATED: 31.07.2026 12:20
# NAME: NeXifyAI Langlauf Agent
# TEAM: NeXifyAI Core
# WHAT: Spec/Stub — native AgentMemory Views in WebUI-Zentrale (Preview)
# WHY: Parity größter Posten (11 Views); Official Viewer :3113 + REST :3111
# OFFICIAL: https://agent-memory.dev/ · mintlify api-search smart-search
# DEPENDS: AGENTMEMORY-VOLLINTEGRATION, WEBUI-FEATURE-PARITY-CHECKLIST, hermes-preview-module-registry
# KATEGORIE: platform
# STATUS: PREVIEW Stub — apps/webui-preview/agentmemory-panel

## Official Gegenprüfung (2026-07-31)

| Quelle | Befund |
|--------|--------|
| agent-memory.dev | REST `/agentmemory/*`, Viewer `:3113`, MCP twin |
| mintlify api-search | `POST /agentmemory/smart-search` hybrid BM25+vector+graph |
| Live VPS | `livez` 200 · Viewer 200 |

## 11 Native Views (Stub-Nav)

Overview · Live Stream · Sessions · Memory Browser · Smart Search · Knowledge Graph · Lessons · Actions · Sentinels · Health · Audit/Export

## Preview Entry

- Panel: `apps/webui-preview/agentmemory-panel/` (:8792)
- Hermes Wire: `apps/webui-preview/hermes-wire/` (:8790)
- Registry: `config/webui/hermes-preview-module-registry.json`

## Nicht tun

- Kein Prod-Patch `apps/hermes/static`
- Keine Secrets in HTML/JS Repo
- Kein Blind-Iframe als Dauerlösung (Viewer nur Übergang)

## Verify

```bash
python3 -m http.server 8792 --directory apps/webui-preview/agentmemory-panel
curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:8792/
curl -sS -H "Authorization: Bearer $AGENTMEMORY_SECRET" http://127.0.0.1:3111/agentmemory/livez
```
