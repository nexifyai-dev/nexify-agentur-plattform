# FILE: docs/architecture/OPENDESIGN-NATIVE-PANEL-PREVIEW-2026-07-31.md
# NIR: 31.07.2026 12:02
# UPDATED: 31.07.2026 12:02
# NAME: NeXifyAI Langlauf Agent
# TEAM: NeXifyAI Core
# WHAT: Preview-Spec — native OpenDesign-Panel für WebUI-Zentrale (kein Prod-Patch)
# WHY: Decision WebUI-Zentrale; OpenDesign Gap TEIL; Iframe nur Übergang
# DEPENDS: docs/live/OPENDESIGN-PACK-STATUS, config/webui/native-module-links.json, design_guidelines.json
# DESIGN-SOT: Platform Design System v2.0 — #0A0A0A, Outfit/Manrope
# KATEGORIE: platform
# STATUS: PREVIEW — apps/webui-preview/opendesign-panel only

## Ziel

Native Modul-Surface unter Mandat-Host `webui.nexifyai.cloud` für OpenDesign/html-anything — **ohne** dauerhaftes Iframe und **ohne** Live-Patch der Prod-Hermes-WebUI.

## Preview-Artefakt

| Pfad | Rolle |
|------|-------|
| `apps/webui-preview/opendesign-panel/index.html` | Statische Preview-Shell (Dark/Luxury) |
| `apps/webui-preview/opendesign-panel/README.md` | Lokal starten, Gates |
| `config/webui/native-module-links.json` | `preview_path` + ist=`preview-shell` |

## Verhalten (Preview)

1. Chrome der Workstation (Nav-Slot „OpenDesign“) — Design Tokens v2.
2. Live-Health-Probe gegen `http://127.0.0.1:3002/` (fetch, no secrets).
3. Primär-CTA: Übergang `https://html.nexifyai.cloud` (Auth) — bis Native Canvas.
4. Explizit: „Kein Prod-Deploy dieses Ordners“.

## Gates vor Prod-WebUI

1. Preview-Smoke lokal + Review-PR.
2. Feature-Parity Zeile OpenDesign → `N` auf Preview-Host.
3. Circuit-Breaker allow; Endabnahme vor Traefik Cutover.

## Nicht tun

- Kein Patch unter Prod Hermes WebUI `:8787` App-Code.
- Kein Blind-Vendor von html-anything in `apps/hermes`.
- Kein CF DNS Create ohne Token DNS-Write-Scope (IST: Zone read OK, DNS list **403**).

## Verify

```bash
python3 -m http.server 8791 --directory apps/webui-preview/opendesign-panel
curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:8791/
curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3002/
```
