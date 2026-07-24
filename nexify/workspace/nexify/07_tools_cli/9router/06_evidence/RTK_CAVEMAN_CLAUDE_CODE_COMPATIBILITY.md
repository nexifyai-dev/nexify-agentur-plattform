# RTK/Caveman — Claude Code Compatibility

> Stand: 2026-06-12

## Test: Caveman full + SSE-Stream = ❌ INCOMPATIBLE

Caveman "full" komprimiert API-Responses aggressiv. Bei SSE-Streaming-Responses
(Text/Event-Stream) werden die Frames dabei beschädigt, sodass Claude Code
den Stream nicht parsen kann.

## Test: Caveman full + Non-Stream = ✅ COMPATIBLE

Non-streaming JSON-Responses werden von Caveman nicht beschädigt.

## Test: RTK

RTK wurde nicht isoliert getestet, da es derzeit nicht aktiv ist.

## Empfehlung

| Komponente | Claude-Code-Pfad | Andere Pfade |
|---|---|---|
| Caveman | OFF | moderate (optional) |
| RTK | ON (Tool-Outputs) | ON (Tool-Outputs) |

Caveman darf für Claude-Code-API-Calls nicht auf "full" gesetzt sein.
Caveman "full" ist nur für nicht-parsekritische Outputs geeignet.

## Qualitätsmatrix

| Szenario | Caveman OFF | Caveman moderate | Caveman full |
|---|---|---|---|
| SSE-Stream (Claude Code) | ✅ | ⚠️ Risiko | ❌ Defekt |
| JSON non-stream | ✅ | ✅ | ✅ |
| Tool-Output (git/grep) | ✅ | ✅ | ⚠️ Details riskiert |
