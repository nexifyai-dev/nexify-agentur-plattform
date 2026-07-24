# 9Router Caveman Safe Mode — Compatibility Test

> Stand: 2026-06-12

## Änderung

In 9Router-DB (`settings` table):
- `cavemanEnabled`: true → **false**
- `cavemanLevel`: "full" → **"off"**
- `outboundProxyEnabled`: true → **false** (leer, kein Proxy)

## Ergebnis

| Test | Vor Safe Mode | Nach Safe Mode |
|---|---|---|
| GET /v1/models | ✅ 200, 639 B | ✅ 200, 9 Models |
| POST /v1/messages stream=true | ❌ malformed HTTP 200 (Caveman full) | ✅ **Sauberer SSE-Stream** |
| 9Router Logs: [CAVEMAN] | 🔴 `[CAVEMAN] full \| openai` | ✅ **Kein Caveman-Log** |
| 9Router Logs: Auth | ✅ | ✅ |
| 9Router Logs: FORMAT | ✅ claude → openai | ✅ |
| 9Router Logs: STREAM | ✅ complete | ✅ 1462ms, complete |
| Response Body | Variabel, beschädigt | ✅ 5841 B, parsebar |

## Fazit

✅ **Caveman-Safe-Mode erfolgreich.** SSE-Stream läuft sauber.
RTK bleibt aktiv (Tool-Output-Kompression, unproblematisch).
