# FILE: apps/webui-preview/opendesign-panel/README.md
# NIR: 31.07.2026 12:02
# UPDATED: 31.07.2026 12:02
# NAME: NeXifyAI Langlauf Agent
# TEAM: NeXifyAI Core
# WHAT: Lokal startbare Preview-Shell für native OpenDesign-Panel
# WHY: WebUI-Zentrale Preview — kein Prod Hermes Live-Patch
# KATEGORIE: platform

## Start (Preview only)

```bash
cd apps/webui-preview/opendesign-panel
python3 -m http.server 8791
# → http://127.0.0.1:8791/
```

Voraussetzung Runtime: `html-anything` auf `127.0.0.1:3002` (optional für Health-Badge).

## Gates

- Nicht in Prod-Traefik/Hermes-Image einbinden ohne Preview-Smoke + Endabnahme.
- Design: `#0A0A0A`, Outfit/Manrope, `data-testid` auf Interaktionen.
