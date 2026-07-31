# FILE: docs/live/CF-DNS-SCOPE-BLOCKED-2026-07-31.md
# NIR: 31.07.2026 12:03
# UPDATED: 31.07.2026 12:03
# NAME: NeXifyAI Langlauf Agent
# TEAM: NeXifyAI Core
# WHAT: Cloudflare DNS Scope Evidence — grafana/html/opendesign (keine Secrets)
# WHY: Gap CF DNS; Token vorhanden aber DNS-API 403 → blocked belassen
# KATEGORIE: platform

## Probe 2026-07-31 12:03

| Check | Ergebnis |
|-------|----------|
| Env `CLOUDFLARE_API_TOKEN` | SET (Wert nicht geloggt) |
| `GET /user/tokens/verify` | **401** Invalid API Token |
| `GET /zones?name=nexifyai.cloud` | **success** (Zone active) |
| `GET /zones/{id}/dns_records?name=grafana.nexifyai.cloud` | **403** Authentication error |
| gleiche List für html/opendesign/openapi/openmcp | **403** |
| Public nslookup grafana/html | No answer (prior) |

## Entscheidung

Kein DNS-Create/Update in dieser Iteration. Status bleibt **blocked** bis Token mit Zone-DNS-Read/Write-Scope.

## Nächste Acts

1. Token rotieren/Scopes: Zone DNS Read (+ Write wenn Create).
2. Dann CNAME/Tunnel-Records für `grafana` / `html` / `opendesign` laut Tunnel-Ingress.
