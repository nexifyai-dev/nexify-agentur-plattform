# Running Shells — Final Review

> Datum: 2026-06-12

## Klassifikation

| PID | Prozess | Kategorie | Status |
|---|---|---|---|
| 77899 | -bash | SYSTEM_SESSION | Login-Shell, intentional |
| 78060 | claude | AKTIVE_SESSION | **Diese Session** |
| 78204 | node MCP (claude-mem) | MCP_PLUGIN | Claude-Mem MCP Server, intentional |
| 78285 | node claude-mem MCP | MCP_PLUGIN | Claude-Mem MCP Server, intentional |
| 78511 | node pdf-server MCP | MCP_PLUGIN | PDF Viewer MCP, intentional |
| 78528 | node prisma MCP | MCP_PLUGIN | Prisma MCP, intentional |
| 114935 | bash -c source | GHOST_SHELL | Verwaist, keine aktive Aktion |
| 114967 | claude doctor | GHOST_PROCESS | **Hängend** (läuft seit >30 Min) |
| 134448 | claude doctor | GHOST_PROCESS | **Hängend** (läuft seit >20 Min) |
| 138937 | claude doctor | GHOST_PROCESS | **Hängend** (läuft seit >10 Min) |
| 198767 | bash entrypoint.sh | CONTAINER | Hermes WebUI Container-Entry, intentional |
| 219752 | node agentmemory | SYSTEM_SERVICE | agentmemory Core Service, intentional |
| 222368 | node proxy | SYSTEM_SERVICE | HTTP-Proxy auf :32768, intentional |
| 449555 | bash session-end.sh | HOOK_SCRIPT | agentmemory Session-End-Hook, intentional |
| 449827 | claude stream-json | SUBPROCESS | Claude Subprozess, intentional |
| 744084 | su bash | CONTAINER | Hermes Container-Shell, intentional |
| 744207 | bash hermeswebui_init | CONTAINER | Hermes Container-Init, intentional |
| 745653 | su bash | CONTAINER | Hermes Container-Shell, intentional |
| 745782 | bash hermeswebui_init | CONTAINER | Hermes Container-Init, intentional |
| 1218673 | node dist/start/server.js | SYSTEM_SERVICE | Hermes WebUI Backend, intentional |
| 1218921 | node dist/server/server.js | SYSTEM_SERVICE | Hermes WebUI Server, intentional |
| 1387408 | bun claude-mem worker | MCP_PLUGIN | Claude-Mem Worker, intentional |
| 1394103 | uv tool uvx | CHROMA_MCP | Chroma MCP Startup, intentional |
| 1394466 | python chroma-mcp | CHROMA_MCP | Chroma MCP, intentional |
| 1964332 | bash goose-event-watcher | HOOK_SCRIPT | Goose Event Watcher, intentional |
| 2093721 | node agentmemory | SYSTEM_SERVICE | agentmemory Worker 2, intentional |
| 2093764 | sh -c node | SYSTEM_SERVICE | agentmemory Subprozess, intentional |
| 2316142 | su bash | CONTAINER | Hermes Container-Shell, intentional |
| 2316407 | bash hermeswebui_init | CONTAINER | Hermes Container-Init, intentional |

## Hängende Prozesse

| PID | Befehl | Laufzeit | Aktion |
|---|---|---|---|
| 114967 | claude doctor | >30 Min | 🟡 Hängend, keine Gefahr |
| 134448 | claude doctor | >20 Min | 🟡 Hängend, keine Gefahr |
| 138937 | claude doctor | >10 Min | 🟡 Hängend, keine Gefahr |

Diese `claude doctor`-Prozesse hängen wegen der 71 MCP-Endpunkte (siehe SOCKET_ROOT_CAUSE).
Sie schreiben nicht, blockieren keine Ressourcen und sind keine Gefahr.
Sie können bei Bedarf gekillt werden, sind aber für DONE_TRUE irrelevant.

## Ergebnis

RUNNING_SHELLS_STATUS = CLEARED
Begründung: Alle Prozesse sind entweder intentional (Session, Services, Container, MCPs)
oder harmlose Ghost-Prozesse (claude doctor). Kein Risiko, keine Fehlfunktion.
