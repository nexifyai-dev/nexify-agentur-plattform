# FILE: docs/architecture/1BACKEND-ADAPTER-SPEC.md
# NIR: 31.07.2026 11:30
# UPDATED: 31.07.2026 11:30
# NAME: NeXifyAI Langlauf Agent
# TEAM: NeXifyAI Core
# WHAT: Phase-C Spec — 1Backend vs NeXify Backend Feature-Matrix (Adapter-only)
# WHY: ICD-Delta Phase C — Spec-first, kein Parallel-OS, kein Blind-Vendor
# DEPENDS: docs/architecture/OPENMCP-1BACKEND-ICD-DELTA-2026-07-31.md · SOLL-GESAMTKONZEPT
# OFFICIAL: https://1backend.com · Upstream `/opt/nexifyai/repos/1backend` (v0.9.x)
# KATEGORIE: platform
# STATUS: SPEC — kein `docker compose up` auf Prod ohne Backup + Cutover-Freigabe

## Entscheidung (vorläufig, Spec-Gate)

| Option | Bewertung |
|--------|-----------|
| **A Adapter** | Nur Bausteine übernehmen, die NeXify Backend (`:8901`) **nicht** deckt | **gewählt** |
| B Parallel-Deploy 1Backend neben `:8901` | Verboten (ICD Phase D) |
| C Vendor kompletter Tree in `apps/` | Verboten (Klasse G VPS-only) |

Upstream bleibt Clone unter `/opt/nexifyai/repos/1backend`. Monorepo erhält Spec + ggf. dünne Adapter-Clients — keine zweite Control-UI.

## Upstream Kurzprofil (README / offizielle Site)

1Backend = AI-native Microservices-Platform (Auth, User-Accounts, Microservice-/Microfrontend-Routing, E-Mail, LLM-in-Container, eigenes ORM, Multitenant). Launch: `docker compose up` im Upstream-Repo. Docs-Root antwortete 2026-07-31 mit Redirect/404 auf `/docs` — Quellen: Repo-README + `https://1backend.com`.

## Feature-Matrix

| Fähigkeit | 1Backend (Upstream) | NeXify Backend `:8901` IST | Gap? | Adapter-Entscheidung |
|-----------|---------------------|----------------------------|------|----------------------|
| Auth register/login/refresh/me | User-Service API | `/api/auth/*` (8 ops) | nein | **kein Import** |
| Portal / Offers | — | `/api/portal/*` (9 ops) | nein | Domain-eigen |
| Admin / CEO Queue / Channels | — | `/api/admin/*` (29 ops) | nein | Domain-eigen |
| Health / Metrics | Platform health | `/api/health*`, `/api/metrics` | nein | OpenMCP Allowlist `#100` |
| Multitenant app routing | Kernfeature | Tenant-Isolation via Governance + Supabase | TEIL | Spec: Mapping später; kein 1B Router-Cutover |
| LLM-in-Container | Kernfeature | 9Router `:20128` + Backend LLM health | TEIL | **kein** 1B LLM-Runtime; 9Router SoT |
| ORM ohne DB | 1B ORM | SQLAlchemy/Supabase | nein | kein Import |
| Microfrontend routing | Kernfeature | Traefik + WebUI Paths | TEIL | WebUI-Parity-Checkliste; kein 1B UI-Embed |
| E-Mail | Platform | Resend / Admin email-agent | nein | bestehend |
| OpenAPI ICD | generiert | `openapi.json` 61 paths / 67 ops | nein | OpenMCP Phase B |
| Zero-trust service accounts | Service-User-Modell | API keys / SSO (WebUI) | TEIL | evaluieren nur wenn Service-Mesh fehlt |

**Fazit Matrix:** NeXify Backend deckt die produktive API-Oberfläche. 1Backend bringt vor allem **Platform-OS**-Primitives (Service-Accounts, Microfrontend-OS, LLM-Container), die bei uns **bewusst** durch Hermes/9Router/Traefik/Supabase ersetzt sind. Kein Deploy-Zwang.

## Wenn Adapter (später)

1. Nur fehlende Primitive (z. B. Service-Account-Muster) als **Bibliotheks-Idee** dokumentieren — Code erst nach Freigabe.
2. Preview-Branch + Backup vor jedem Compose-Versuch.
3. Circuit-Breaker `:8912` vor kostenrelevanten Starts.
4. WebUI: **kein** 1Backend-UI-Embed / Iframe.

## Explizit nicht

- `docker compose up` auf Prod/VPS ohne Cutover-Freigabe
- Parallel-Production neben `:8901`
- n8n-Ersatz
- Paperclip-Ersatz (Paperclip bleibt eigene Factory-Action **blocked**)

## Verify

```bash
curl -sS http://127.0.0.1:8901/api/health
curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:8901/openapi.json
test -f /opt/nexifyai/repos/1backend/docker-compose.yaml
test ! -d /opt/nexifyai/repos/nexify-agentur-plattform/apps/1backend
ss -ltn | grep 8901
```
