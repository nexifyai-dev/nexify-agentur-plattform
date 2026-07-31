# FILE: docs/architecture/WEBUI-FEATURE-PARITY-CHECKLIST-2026-07-31.md
# NIR: 31.07.2026 11:25
# UPDATED: 31.07.2026 11:25
# NAME: NeXifyAI Langlauf Agent
# TEAM: NeXifyAI Core
# WHAT: Feature-Parity-Checkliste Workspace (:4001) → Mandat-WebUI-Zentrale
# WHY: Decision 2026-07-31 — eine Surface; Cutover erst nach Preview-Smoke
# DEPENDS: DECISION-2026-07-31-WEBUI-ZENTRALE-VS-DASHBOARD, HERMES-WORKSTATION-KONSOLIDIERUNG-PLAN, Gap-Doc 2026-07-31
# DESIGN-SOT: Platform Design System v2.0 (Deep Navy) · Website = PR47 Emergent
# KATEGORIE: platform
# STATUS: SPEC / Preview-Branch — kein Prod-Cutover

## Zielbild

| Rolle | URL / Origin | Status |
|-------|--------------|--------|
| **Mandat-Zentrale** | `https://webui.nexifyai.cloud/` | IST = Hermes Agent WebUI `:8787` (Login) |
| **Feature-Shell IST** | `https://dashboard.nexifyai.cloud/` | Hermes Workspace `:4001` |
| **SOLL nach Cutover** | `webui.*` trägt Workspace-Features **nativ** | Gate: Preview-Smoke + Endabnahme |

Kein Iframe-Dauerpfad. Kein zweites Control-Dashboard. n8n abbau. NousResearch `awesome-hermes-agent` ausgeschlossen.

## Live Smoke (2026-07-31, keine Secrets)

| Check | Ergebnis |
|-------|----------|
| `dashboard.*` / `:4001` | 200 |
| `webui.*` `/login` | 200 |
| OpenDesign lokal `:3002` | 200 |
| Grafana lokal `:3000/api/health` | 200 |
| Grafana via Traefik **HTTPS** `Host grafana` | 200 |
| Grafana via Traefik **HTTP :8080** `Host grafana` | **Falschpositiv** → Portainer (`unsupported API version`) — Router nur `websecure` |
| Paperclip `:3100` | **BLOCKED** (`blocked_no_app_tree`) |
| OpenMCP Allowlist Stub | Draft PR `#100` (`config/openmcp/`) |

## Parity-Matrix (Workspace → WebUI-Zentrale)

Legende: `N` = nativ vorhanden · `P` = Path/Proxy (Übergang) · `G` = Gap · `B` = blocked · `X` = ausgeschlossen

| Feature / Modul | SOLL | IST Workspace `:4001` | IST WebUI `:8787` | Nächste Umsetzung |
|-----------------|------|------------------------|-------------------|-------------------|
| Auth / Login | N | N | N (Login) | Session-Parity Preview |
| Chat / Agent Driver | N | N | TEIL | Native Panel, kein Embed |
| Kanban / Tasks | N | N | G | Port Workspace-View → WebUI Shell |
| Auftragsfach | N | TEIL | G | Spec + API `:8901` |
| Dispatcher | N | TEIL | G | Bridge-API Evidence |
| Automation Controller | N | TEIL | G | Feature-Branch |
| Agententeams / Swarm | N | TEIL | G | Native View |
| Approval Queue | N | TEIL | G | Native View |
| Evidence Panel | N | TEIL | G | Native View |
| AgentMemory | N | P/N | P (`/agentmemory` Traefik) | Native Module (11 Views) — größter Posten |
| LightRAG | N | P | G | Native Query UI + Dual-Write (PR `#98` MERGED hooks) |
| 9Router | N | P | G | Status/Allowlist View; Keys blocked |
| OpenAPI / Backend | N | P | G | ICD via `:8901/openapi.json` |
| OpenMCP Tools | N | G | G | Phase B Stub `#100`; Runtime Preview only |
| OpenDesign | N | P (`/design`) | P | Lokal `:3002`; CF `opendesign.*` blocked |
| Monitoring Grafana | N | P (`/grafana`) | P | Native later; Traefik HTTPS OK; CF DNS pending |
| Paperclip Factory | N | B | B | **Action blocked** — kein Fake-Deploy |
| 1Backend | Adapter only | Repo idle | — | Spec-first Phase C; kein Parallel-OS |
| MetaGPT Planung | N | G | G | Planungsmodus später |
| n8n | X | X | X | Abgeschafft |
| Portainer-Dauer | X | P | P | Kein Dauer-Control-Plane |

## Traefik / Path-Hinweise (kein Cutover)

- `webui.*` PathPrefix `/grafana`, `/design`, `/agentmemory`, … = **Übergang**, nicht Endzustand.
- `grafana` Router nur `entryPoints: websecure` → Health-Checks immer HTTPS oder direkt `:3000`.
- CF named hosts `grafana` / `opendesign` / `openapi` / `openmcp`: **pending/blocked** (Token scope) — nicht hier „fixen“.

## Preview-Branch Gates (vor Cutover)

1. Feature-Branch nur (Policy: kein Live-Patch Prod-WebUI-App).
2. Parity-Zeilen Kanban + Memory + Approval = `N` auf Preview-Host.
3. Circuit-Breaker `:8912/check` allow bei Smoke.
4. Design System v2.0 Tokens — kein Graphite Premium.
5. Explizite Endabnahme vor Traefik/CF Host-Alias Cutover.

## Verify

```bash
curl -sS -o /dev/null -w '%{http_code}\n' https://dashboard.nexifyai.cloud/
curl -sS -o /dev/null -w '%{http_code}\n' https://webui.nexifyai.cloud/login
curl -sS http://127.0.0.1:4001/ -o /dev/null -w '%{http_code}\n'
curl -sS http://127.0.0.1:3002/ -o /dev/null -w '%{http_code}\n'
curl -sk --resolve grafana.nexifyai.cloud:443:127.0.0.1 https://grafana.nexifyai.cloud/api/health
unset GITHUB_TOKEN; gh pr view 100 --json isDraft,state,url
```
