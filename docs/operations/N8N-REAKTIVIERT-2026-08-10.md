# n8n Reaktiviert — CI-Theme & Logo (2026-08-10)

**NIR:** 10.08.2026
**NAME:** NeXifyAI Agent
**TEAM:** NeXifyAI Core
**WHAT:** Widerruf der n8n-Abschaffung (Pascal 2026-08-09/10), Reaktivierung als aktiver Dienst, CI-Branding angewendet.
**WHY:** Pascal hat die Abschaffungs-Entscheidung widerrufen. n8n läuft wieder produktiv mit NeXify-Design.
**DEPENDS:** Docker, Image `nexify-n8n:2.33.7-ci`, `/opt/nexifyai/n8n/`

## Status (verifiziert 10.08.2026)

| Prüfpunkt | Ergebnis |
|---|---|
| Container `nexify-n8n` | **Up**, Image `nexify-n8n:2.33.7-ci` |
| Port 5678 | HTTP **200** (`GET /`) |
| Titel | `NeXify AI — Workflow Automation` |
| Locale | `defaultLocale: de` (UI deutsch) |
| CI-Theme | `/static/custom.css` → **200**, 67 Token-Treffer (#0A0A0A, #C8FF00, rgba-Surfaces) |
| Logo | N-Marke als SVG-Data-URI (zwei Rechtecke + Diagonale, Gradient #d4d4d8→#fafafa, Lime-Punkt #C8FF00, **kein Hexagon**) |
| Fonts | Outfit (Headings) + Manrope (Body) in custom.css |

## Aufbau (pfadfest, Neustart-sicher)

- Image: `/opt/nexifyai/n8n/image/Dockerfile` — patcht editor-ui dist (index.html, favicon.ico, static/custom.css) → Theme überlebt Container-Neustarts
- Daten: `/opt/nexifyai/n8n/data` → `/home/node/.n8n` (sqlite)
- Start: `docker start nexify-n8n` (bzw. Compose, siehe Container-Labels)

## CI-Tokens (design_guidelines.json)

bg `#0A0A0A` · surface `rgba(255,255,255,0.03)` · border `rgba(255,255,255,0.08)`
Akzent `#C8FF00` · Verlauf 120deg `#C8FF00→#e9ff8a` · Text `#FFF/#A1A1AA/#71717a`
Headings Outfit · Body Manrope · Radius 20px

## Offen / Blockiert

- **AGENTS.md-Widerruf nicht eingetragen** — Write an protected agent-instruction file ohne Consent geblockt. Zeilen 38–39 sagen weiterhin „n8n abgeschafft". Nachholen mit Freigabe: Eintrag ersetzen durch „n8n widerrufen 2026-08-09/10, aktiver Dienst, siehe diese Datei".
- Browser-E2E (Camoufox/CDP) nicht möglich gewesen (CDP-WebSocket 404); CSS-Theme-Verifikation erfolgte über serviertes HTTP (custom.css 200 + Tokens + index.html-Referenz).
