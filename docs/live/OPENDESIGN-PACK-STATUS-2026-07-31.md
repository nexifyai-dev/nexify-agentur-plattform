# FILE: docs/live/OPENDESIGN-PACK-STATUS-2026-07-31.md
# NIR: 31.07.2026 11:33
# UPDATED: 31.07.2026 11:50
# NAME: NeXifyAI Langlauf Agent
# TEAM: NeXifyAI Core
# WHAT: OpenDesign / html-anything Pack-Status vs Monorepo + WebUI
# WHY: Gap OpenDesign TEIL — lokal live, CF/Traefik public fehlend; kein Blind-Vendor
# DEPENDS: GITHUB-ORG-MONOREPO-DRIFT, OPENMCP-1BACKEND-ICD-DELTA, Traefik main-routers
# KATEGORIE: platform

## Inventar

| Ebene | IST 2026-07-31 11:37 | Status |
|-------|------------------------|--------|
| Runtime lokal | `html-anything` `127.0.0.1:3002` → HTML Anything **200** | OK |
| Traefik Service | `html-anything` → `http://127.0.0.1:3002` | OK |
| Traefik Host `html.nexifyai.cloud` | **FIX:** `tls: {}` → `certResolver: letsencrypt`; auth-forward deferred bis Smoke | HTTPS `--resolve` **200** |
| Traefik Path `admin.*/html` | **302** Auth-Redirect nach MW-Fix (`8881/verify`) | OK-TEIL |
| CF `opendesign.*` / public `html.*` DNS | MISSING | **blocked** |
| Backup | `/opt/nexifyai/backups/gesamtsystem-fix-20260731-113655/` | OK |
| Monorepo `apps/` | kein vendored OpenDesign-Tree | OK (Klasse C) |

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

1. Auth auf Subdomain `html.*` wieder aktivieren (aktuell deferred); Login-Smoke.
2. Feature-Parity: OpenDesign native Panel in WebUI-Preview (kein Iframe-Dauer).
3. CF hostname `html`/`opendesign` erst nach Token-Scope.

## Verify

```bash
curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3002/
curl -sk -o /dev/null -w '%{http_code}\n' --resolve html.nexifyai.cloud:443:127.0.0.1 https://html.nexifyai.cloud/
```
