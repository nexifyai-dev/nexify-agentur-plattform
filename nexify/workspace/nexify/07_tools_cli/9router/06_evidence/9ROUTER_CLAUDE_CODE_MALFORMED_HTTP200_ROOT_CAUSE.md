# 9Router/Claude Code — Malformed HTTP 200 Root Cause

> Stand: 2026-06-12
> Status: IDENTIFIED

## Ursache

Der `API Error: API returned an empty or malformed response (HTTP 200)` wird verursacht durch:

1. **Claude Code sendet Subagent-Calls an 9Router**
2. **9Router hat `CAVEMAN full | openai` aktiv**
3. **Caveman "full" komprimiert SSE-Stream-Frames** aggressiv
4. **Claude Code Client erhält HTTP 200 mit kaputten/nicht parsebaren SSE-Frames**
5. **Client kann Stream nicht verarbeiten → "malformed response"**

## Beweis

| Test | Streaming | Caveman | Body | JSON-Valid |
|---|---|---|---|---|
| GET /v1/models | — | — | 639 B | ✅ YES |
| POST chat stream=false | Nein | full | 470 B | ✅ YES |
| POST messages stream=false | Nein | full | 308 B | ✅ YES |
| POST messages (default) | Ja | full | 4307 B | ❌ SSE-Stream |
| POST chat (default) | Ja | full | 680 B | ❌ SSE-Stream |
| POST reasoner (default) | Ja | full | 716 B | ❌ SSE-Stream |

9Router-Logs zeigen: `[CAVEMAN] full | openai` bei jedem Request.

## Lösung

**Primär:** Caveman für Claude Code API Calls deaktivieren.
Caveman "full" ist nicht kompatibel mit SSE-Streaming-Responses, die Claude Code intern parsen muss.

**Sekundär:** Wenn Caveman für nicht-Claude-Code-Pfade gewünscht ist:
- Caveman auf `moderate` reduzieren
- Oder Caveman pro Route/API-Key/Modell differenzieren

## Status

CAUSE = CAVEMAN_FULL_SSE_STREAM_DAMAGE
FIX = Deactivate Caveman for Claude Code paths
PRIORITY = P0
