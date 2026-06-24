# Claude Code — Model Routing Stability Policy

> Stand: 2026-06-12
> Version: 1.0

## Problem

Subagent-Calls von Claude Code (via Agent-Tool) erhalten manchmal malformed
HTTP-200-Responses, wenn Caveman "full" aktiv ist und SSE-Streaming verwendet wird.

## Routing-Regeln

| Modell | Claude-Code-Execution | Planung/Analyse | Review |
|---|---|---|---|
| ds/deepseek-v4-flash | ✅ Default | ✅ Geeignet | ✅ Geeignet |
| ds/deepseek-reasoner | ⚠️ Nur wenn stabil | ✅ Primär | ✅ Geeignet |
| nexifyai-combo-llm | ⚠️ Nur nach Test | ✅ Geeignet | ✅ Primär |
| ds/deepseek-v4-pro | ❌ Nicht als Standard | ❌ Nur wenn nötig | ❌ Nur wenn nötig |

## Stabilitätsregeln

1. **Caveman muss OFF sein** für Claude-Code-API-Pfade.
2. **Non-streaming als Fallback**: Subagent-Calls sollten non-streaming bevorzugen.
3. **Modell-Fallback-Kette**: flash → reasoner → combo → pro (bei Fehler).
4. **Kein hartes Default-Modell** ohne Kompatibilitätstest.
5. **Bei malformed HTTP 200**: Request-ID, Body-Länge, Content-Type erfassen,
   Fallback-Modell testen, nicht als DONE melden.

## Aktueller Status

| Modell | Stable für Claude Code | Getestet |
|---|---|---|
| ds/deepseek-v4-flash | ✅ Ja | Non-stream + Stream getestet |
| ds/deepseek-reasoner | ⚠️ Mit Caveman-Einschränkung | Non-stream OK |
| nexifyai-combo-llm | ⚠️ Nicht ausreichend getestet | — |
