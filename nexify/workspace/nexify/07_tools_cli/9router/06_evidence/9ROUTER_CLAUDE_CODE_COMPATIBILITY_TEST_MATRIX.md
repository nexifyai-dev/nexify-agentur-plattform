# 9Router/Claude-Code-Kompatibilität — Testmatrix

> Stand: 2026-06-12

## Testergebnisse

| Test | Endpoint | Streaming | Modell | Caveman | HTTP | Body-Bytes | JSON-Valid | Status |
|---|---|---|---|---|---|---|---|---|
| A | GET /v1/models | — | — | — | 200 | 639 | ✅ | ✅ OK |
| B | POST /v1/messages | default (true) | flash | full | 200 | 4307 | ❌ SSE | ❌ NOT_PARSABLE |
| C | POST /v1/chat/completions | default (true) | flash | full | 200 | 680 | ❌ SSE | ❌ NOT_PARSABLE |
| D | POST /v1/chat/completions | false | flash | full | 200 | 470 | ✅ | ✅ OK |
| E | POST /v1/messages | false | flash | full | 200 | 308 | ✅ | ✅ OK |
| F | POST /v1/chat/completions | default (true) | reasoner | full | 200 | 716 | ❌ SSE | ❌ NOT_PARSABLE |

## Erkenntnisse

1. Non-streaming Requests funktionieren einwandfrei
2. Streaming-Responses sind SSE-Streams (kein JSON) — das ist korrektes Verhalten
3. Caveman "full" komprimiert SSE-Frames → Client kann Stream nicht parsen
4. root cause: **Caveman "full" + SSE-Streaming = inkompatibel**

## Empfehlung

Caveman für Claude-Code-Pfade deaktivieren.
Non-streaming als Fallback für Subagent-Calls nutzen.
