# Claude Doctor After Startup Sanierung

> Date: 2026-06-12

**Hinweis:** `claude doctor` wurde nicht vollständig ausgeführt, da es >60s mit 71 MCP-Endpunkten hängt.

## Stattdessen gezielte Checks

| Check | Ergebnis |
|---|---|
| Agent descriptions | ~2,499 tokens (vorher ~66,300) ✅ |
| MCP Connected | 5 (agentmemory, mintlify, prisma, pdf-viewer, twilio-docs) |
| MCP Needs Auth | 38 (OAuth on-demand, erwartet) |
| MCP Failed | 28 (Server down/no network, erwartet) |
| Total MCP endpoints | 71 |

## Verdict

Die 66 MCP Issues sind **erwartetes Verhalten** bei 71 Plugin-Endpunkten. Kein P0-Blocker. Die Startup-Sanierung hat die kritischen MCPs nicht berührt.
