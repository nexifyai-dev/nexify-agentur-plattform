# FILE: apps/webui-preview/lightrag-panel/README.md
# NIR: 02.08.2026 09:20
# UPDATED: 02.08.2026 09:20
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Preview — native LightRAG panel gegen Origin :9622 (same-origin Proxy)
# WHY: Parität zu AgentMemory-Panel (#141); kein Iframe, kein Hermes Cutover
# DOCS-REF: Issue #141 · design_guidelines.json

## Start

```bash
python3 apps/webui-preview/lightrag-panel/serve.py
# → http://127.0.0.1:8793/
```

Optional: `LIGHTRAG_URL`, `LR_PANEL_PORT`. API-Key nur in Browser sessionStorage.

## Views

Health · Query · Documents · Pipeline · Graph Labels · Insert Text

## Hard stop

Kein Kill von Dashboard `:4001`, kein Traefik-Swap ohne Endabnahme.
