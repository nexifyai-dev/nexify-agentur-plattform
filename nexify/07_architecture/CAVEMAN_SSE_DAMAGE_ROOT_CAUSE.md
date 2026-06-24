# Caveman SSE Damage — Root Cause

> Stand: 2026-06-12

## Zwei verschiedene Caveman

### 1. Caveman (Claude Code Skill) — unproblematisch

- GitHub: `github.com/JuliusBrussee/caveman`
- System-Prompt-Ebene → ändert **wie Claude Code antwortet**
- Levels: `lite`, `full`, `ultra`, `wenyan`
- Reduziert Output-Tokens um ~75%
- API-Response-Format bleibt intakt
- **Nicht Ursache des Fehlers**

### 2. 9Router Caveman (Middleware) — verursacht den Fehler

- 9Router-interne Output-Transformation
- Sichtbar in Logs: `[CAVEMAN] full | openai`
- Transformiert **jede API-Response** (auch SSE-Streams)
- OpenAI-Format-Translation kombiniert mit Caveman-Kompression
- **Beschädigt SSE-Stream-Frames** → malformed HTTP 200

## Fehlerkette

```
Claude Code Subagent → POST /v1/messages (stream=true)
    → 9Router empfängt Request
    → Forward an DeepSeek
    → 9Router transformiert Response (claude → openai Format)
    → [CAVEMAN] full | openai komprimiert Output
    → SSE-Stream-Frames werden beschädigt
    → Claude Code Client empfängt HTTP 200 mit kaputten Frames
    → "API Error: empty or malformed response (HTTP 200)"
```

## Lösung

**9Router-seitig:** Caveman-Transformation für Claude-Code-API-Pfade deaktivieren.
Caveman (Claude-Skill) kann weiterhin sicher auf Prompt-Ebene genutzt werden.

## Status

CAUSE = 9ROUTER_CAVEMAN_MIDDLEWARE_SSE_DAMAGE
CLAUDE_CODE_CAVEMAN_SKILL = safe (prompt level)
9ROUTER_CAVEMAN = unsafe for SSE streams
