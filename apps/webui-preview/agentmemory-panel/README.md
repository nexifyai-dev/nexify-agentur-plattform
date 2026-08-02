# FILE: apps/webui-preview/agentmemory-panel/README.md
# NIR: 31.07.2026 12:20
# UPDATED: 02.08.2026 10:10
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Core
# WHAT: Preview — native AgentMemory Views gegen echte REST :3111 (same-origin Proxy)
# WHY: Größter Parity-Posten (11 Views); kein Prod Hermes Patch; CORS-sicher via serve.py
# OFFICIAL: https://agent-memory.dev/ · https://agentmemory.mintlify.app/reference/api-search
# DECISION: GitHub #141 — Hermes WebUI bleiben · Native-Panels Härten
# KATEGORIE: platform

## Start (empfohlen)

```bash
python3 apps/webui-preview/agentmemory-panel/serve.py
# → http://127.0.0.1:8792/
# Proxy: /agentmemory/* → http://127.0.0.1:3111 (AGENTMEMORY_URL override)
```

Fallback ohne Proxy (CORS kann scheitern):

```bash
python3 -m http.server 8792 --directory apps/webui-preview/agentmemory-panel
```

## Official Endpoints (gegengeprüft)

| Surface | Port | Rolle |
|---------|------|-------|
| REST | `3111` `/agentmemory/*` | livez, remember, smart-search, sessions, memories, lessons, frontier, audit, export, graph/stats |
| Viewer | `3113` | Ship-with Viewer (Übergang, kein Iframe-Dauerziel) |

Panel Views rufen REST über den Proxy — nicht nur Stub-Text.

Secrets: nie im Repo. Browser-Probe nutzt optional `sessionStorage` Key `AM_BEARER` (lokal).

## Continuous Learning (Hinweis)

Hermes-/Agent-Profile sollen nach Tasks `POST /agentmemory/remember` und
`POST /agentmemory/lessons` nutzen (Bearer nur aus Env). Lessons erscheinen in
dieser Preview-Oberfläche. Protokoll: `docs/operations/CONTINUOUS-LEARNING.md`.
**Kein** Prod-Static-Patch von Hermes ohne Endabnahme.

## Gates

- Registry: `config/webui/hermes-preview-module-registry.json` → `prod_patch_allowed: false`
- Kein Mount in Prod WebUI ohne Preview-Smoke + Endabnahme
- Kein Traefik / Live-Dash Touch in Preview-PRs
