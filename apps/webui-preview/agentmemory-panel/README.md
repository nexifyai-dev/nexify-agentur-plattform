# FILE: apps/webui-preview/agentmemory-panel/README.md
# NIR: 31.07.2026 12:20
# UPDATED: 31.07.2026 12:20
# NAME: NeXifyAI Langlauf Agent
# TEAM: NeXifyAI Core
# WHAT: Preview Stub — native AgentMemory Views für WebUI-Zentrale
# WHY: Größter Parity-Posten (11 Views); kein Prod Hermes Patch; Official REST :3111 / Viewer :3113
# OFFICIAL: https://agent-memory.dev/ · https://agentmemory.mintlify.app/reference/api-search
# KATEGORIE: platform

## Start

```bash
python3 -m http.server 8792 --directory apps/webui-preview/agentmemory-panel
# → http://127.0.0.1:8792/
```

## Official Endpoints (gegengeprüft)

| Surface | Port | Rolle |
|---------|------|-------|
| REST | `3111` `/agentmemory/*` | livez, remember, smart-search |
| Viewer | `3113` | Ship-with Viewer (Session/Memory/Graph/Health) |

Secrets: nie im Repo. Browser-Probe nutzt optional `sessionStorage` Key (lokal).

## Gates

Kein Mount in Prod WebUI ohne Preview-Smoke + Endabnahme.
