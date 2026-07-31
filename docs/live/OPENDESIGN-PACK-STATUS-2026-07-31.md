# FILE: docs/live/OPENDESIGN-PACK-STATUS-2026-07-31.md
# NIR: 31.07.2026 11:33
# UPDATED: 31.07.2026 11:56
# NAME: NeXifyAI Langlauf Agent
# TEAM: NeXifyAI Core
# WHAT: OpenDesign / html-anything Pack-Status vs Monorepo + WebUI
# WHY: Gap OpenDesign TEIL — lokal live, CF DNS blocked; Auth on html.* restored
# DEPENDS: GITHUB-ORG-MONOREPO-DRIFT, OPENMCP-1BACKEND-ICD-DELTA, Traefik main-routers
# KATEGORIE: platform

## Inventar

| Ebene | IST 2026-07-31 11:56 | Status |
|-------|----------------------|--------|
| Runtime lokal | `html-anything` `127.0.0.1:3002` → HTML Anything **200** | OK |
| Traefik Service | `html-anything` → `http://127.0.0.1:3002` | OK |
| Traefik Host `html.nexifyai.cloud` | TLS certResolver + **`auth-forward` restored** | HTTPS → **302** → Admin Login |
| Traefik Path `admin.*/html` | **302** Auth (`8881/verify`) | OK-TEIL |
| CF `opendesign.*` / public `html.*` DNS | nslookup No answer | **blocked** |
| Backup Auth-Restore | `/opt/nexifyai/backups/gesamtsystem-fix-20260731-115439-html-auth/` | OK |
| Monorepo `apps/` | kein vendored OpenDesign-Tree | OK (Klasse C) |

## Mapping zum WebUI-Mandat

| Pfad | Rolle |
|------|-------|
| `webui.*` native Design-View | SOLL Endzustand |
| Workspace `/design` / Traefik Path | Übergang nur |
| Eigenes `opendesign.*` Public | optional nach CF; nicht Cutover-Blocker |

## Pack-Entscheidung

1. **Kein** Vendor des Upstream-Trees in `apps/` ohne Spec-Import-Plan.
2. Runtime bleibt VPS `html-anything` `:3002` bis Native View in Preview-Branch.
3. Monorepo hält Pointer/Status + WebUI `native-module-links.json`.

## Nächste Acts

1. Feature-Parity: OpenDesign native Panel in WebUI-Preview (kein Iframe-Dauer).
2. CF hostname `html`/`opendesign` erst nach Token-Scope.
3. Login-E2E mit Session-Cookie (nicht nur 302 Location).

## Verify

```bash
curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3002/
curl -sk -D- -o /dev/null --resolve html.nexifyai.cloud:443:127.0.0.1 https://html.nexifyai.cloud/ | head -15
# expect 302 Location .../auth/login
```
