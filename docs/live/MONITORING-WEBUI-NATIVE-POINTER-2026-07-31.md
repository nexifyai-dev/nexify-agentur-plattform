# FILE: docs/live/MONITORING-WEBUI-NATIVE-POINTER-2026-07-31.md
# NIR: 31.07.2026 11:33
# UPDATED: 31.07.2026 11:50
# NAME: NeXifyAI Langlauf Agent
# TEAM: NeXifyAI Core
# WHAT: Monitoring→WebUI Pointer — Grafana native-Pfad, Smoke, CF-Gap
# WHY: Gap-Matrix Monitoring TEIL; falsche :8080-Smokes korrigieren; kein Prod-Cutover
# DEPENDS: Traefik main-routers, Decision WebUI-Zentrale, Parity-Checkliste
# KATEGORIE: platform

## IST (verifiziert 2026-07-31 11:33)

| Check | Ergebnis |
|-------|----------|
| Docker `nexify-grafana` `127.0.0.1:3000` | `/api/health` **200** (Grafana 13.1.1) |
| Traefik **HTTPS** `Host: grafana.nexifyai.cloud` → `:443` | `/api/health` **200** |
| Traefik HTTP `:80` Host grafana | **301** → HTTPS |
| `127.0.0.1:8080` Host grafana | **NICHT Traefik** — `nexify-cadvisor` (cAdvisor). Alte Gap-Smokes = Falschpositiv |
| Public DNS `grafana.nexifyai.cloud` | **MISSING** (classic DNS / CF write 403) |
| Traefik Path `admin.*` + `/grafana` | Router vorhanden; Live-Smoke 2026-07-31 teils **404** (Auth/Path) — Übergangspfad |

## SOLL → WebUI-Zentrale

1. **Übergang:** Traefik Path unter Workspace/WebUI (`/grafana`) oder Subdomain — **kein Iframe-Dauer**.
2. **Native:** Monitoring-View in Hermes/WebUI-Shell (Design v2) liest Prom/Grafana API oder eingebettete Panel-URLs nach Auth.
3. **CF:** named hostname `grafana` erst nach Token-Scope; bis dahin nur lokal + Tunnel-Wildcard über Traefik.

## Autopilot

- Health-Job deckt Grafana-Container über Docker-Whitelist (`nexify-grafana`).
- Kein Auto-Heal für CF DNS (write blocked).
- Smoke-Skript Gap-Job: **immer** `curl -sk --resolve grafana.nexifyai.cloud:443:127.0.0.1 https://grafana.nexifyai.cloud/api/health` — **nie** `:8080`.


## WebUI-Zentrale Link-Map

Canonical: `config/webui/native-module-links.json` → module `monitoring-grafana`.
Übergang: Traefik HTTPS `grafana.*` (200 verified). Native Panel = Preview-Branch nach Parity Kanban/Memory.

## Ops-Fix 11:50

`routes.yml` `auth-forward` (`8644/auth` 404) schattierte `main-routers` (`8881/verify`); admin catch-all disabled. `admin.*/grafana` → **302** Auth (erwartet). Backup: `/opt/nexifyai/backups/gesamtsystem-fix-*-authmw`.

## Nächste Acts

| Prio | Act | Gate |
|------|-----|------|
| 1 | Gap-Smoke Scripts / Docs auf HTTPS-Resolve umstellen | done (dieses Doc) |
| 2 | CF DNS `grafana` wenn Token write OK | blocked 403 |
| 3 | Native Monitoring Panel Spec in Preview-Branch | nach Parity Kanban/Memory |

## Verify

```bash
curl -sS http://127.0.0.1:3000/api/health
curl -sk --resolve grafana.nexifyai.cloud:443:127.0.0.1 https://grafana.nexifyai.cloud/api/health
# Negativkontrolle: :8080 ist cAdvisor, nicht Grafana
curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:8080/api/health
```
