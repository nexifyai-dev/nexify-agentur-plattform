# FILE: apps/webui-preview/hermes-wire/README.md
# NIR: 31.07.2026 12:20
# UPDATED: 31.07.2026 12:20
# NAME: NeXifyAI Langlauf Agent
# TEAM: NeXifyAI Core
# WHAT: Hermes Preview Hub — verdrahtet native Preview-Panels ohne Prod-Patch
# WHY: WebUI-Zentrale; kein Live-Patch apps/hermes/static
# KATEGORIE: platform

## Start

```bash
python3 -m http.server 8790 --directory apps/webui-preview/hermes-wire
# Hub: http://127.0.0.1:8790/
# OpenDesign panel: python3 -m http.server 8791 --directory apps/webui-preview/opendesign-panel
# AgentMemory panel: python3 -m http.server 8792 --directory apps/webui-preview/agentmemory-panel
```

Registry SoT: `config/webui/hermes-preview-module-registry.json`

## Gates

- **Kein** Deploy nach Prod Hermes `:8787` / `apps/hermes/static` ohne Preview-Smoke + Endabnahme.
- Consumer: Preview-Branch / lokale Hub-Seite liest Registry — nicht Traefik Cutover.
