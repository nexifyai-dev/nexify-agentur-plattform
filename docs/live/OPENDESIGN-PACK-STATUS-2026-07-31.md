# FILE: docs/live/OPENDESIGN-PACK-STATUS-2026-07-31.md
# NIR: 31.07.2026 11:33
# UPDATED: 31.07.2026 11:33
# NAME: NeXifyAI Langlauf Agent
# TEAM: NeXifyAI Core
# WHAT: OpenDesign / html-anything Pack-Status vs Monorepo + WebUI
# WHY: Gap OpenDesign TEIL — lokal live, CF/Traefik public fehlend; kein Blind-Vendor
# DEPENDS: GITHUB-ORG-MONOREPO-DRIFT, OPENMCP-1BACKEND-ICD-DELTA, Traefik main-routers
# KATEGORIE: platform

## Inventar

| Ebene | IST 2026-07-31 | Status |
|-------|----------------|--------|
| Runtime lokal | `html-anything` `127.0.0.1:3002` → Title „HTML Anything — the agentic HTML editor“ **200** | OK |
| Traefik Service | `html-anything` → `http://127.0.0.1:3002` | OK |
| Traefik Host `html.nexifyai.cloud` | Router `websecure` + auth-forward | Live-Smoke **404** (Tunnel/DNS/Auth) |
| Traefik Path `admin.*/html` | vorhanden | Live-Smoke **404** |
| CF `opendesign.*` | DNS MISSING | **blocked** |
| Monorepo `apps/` | kein vendored OpenDesign-Tree | OK (Klasse C migrate-pending) |
| GH Org `open-design` / `html-anything` | Klasse C — Spec→Monorepo, kein Drift-Fork | pending Spec |

## Mapping zum WebUI-Mandat

| Pfad | Rolle |
|------|-------|
| `webui.*` native Design-View | SOLL Endzustand |
| Workspace `/design` / Traefik Path | Übergang nur |
| Eigenes `opendesign.*` Public | optional nach CF; nicht Cutover-Blocker für WebUI-Parity |

## Pack-Entscheidung

1. **Kein** Vendor des Upstream-Trees in `apps/` ohne Spec-Import-Plan.
2. Runtime bleibt VPS `html-anything` `:3002` bis Native View + Auth in Preview-Branch.
3. Monorepo hält nur Pointer/Status (dieses Doc) + spätere Adapter-Route.

## Nächste Acts

1. Traefik/Tunnel why `html.*` 404 (DNS vs auth-forward) — Ops sense.
2. Feature-Parity Zeile OpenDesign: `P` → Spec Native Panel.
3. CF hostname erst nach Token-Scope.

## Verify

```bash
curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3002/
curl -sk -o /dev/null -w '%{http_code}\n' --resolve html.nexifyai.cloud:443:127.0.0.1 https://html.nexifyai.cloud/
```
