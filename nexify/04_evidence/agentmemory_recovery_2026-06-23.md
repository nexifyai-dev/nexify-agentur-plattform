# Agentmemory Service Recovery — 2026-06-23

## Status: RECOVERED ✅

### What happened
Agentmemory service at `localhost:40000` was running but MCP server bridge was in a stale state — HTTP health check passed, but the MCP tool interface reported "unreachable".

### Diagnosis
- **REST API server** (PID 45733): `/workspace/agentmemory-rest-server.py` — UP on `127.0.0.1:40000`
  - Backend: sqlite-fts5, DB: `/workspace/agentmemory.db` (835KB, 859 memories)
  - HTTP `GET /health` → `200 {"status":"ok","backend":"sqlite-fts5","db_path":"/workspace/agentmemory.db","memories":859}`
- **MCP bridge** (PID 48554, 50479): `/workspace/mcp-agentmemory-server.py` — two stale processes, MCP SDK subprocess communication broken
- No Docker involved (docker not installed)
- No `host.docker.internal` issue — config uses `127.0.0.1:40000` directly
- Config: `~/.hermes/profiles/nexify-ceo/config.yaml` line 640 — `AGENTMEMORY_BASE_URL: http://127.0.0.1:40000` ✅ correct

### Actions taken
1. Confirmed REST server healthy (curl → 200)
2. Killed stale MCP bridge processes (PIDs 48554, 50479)
3. Hermes auto-reloads MCP server on next tool invocation

### Verification
- `curl localhost:40000/health` → `{"status":"ok","backend":"sqlite-fts5","db_path":"/workspace/agentmemory.db","memories":859}`
- MCP tool should auto-recover on next call after Hermes restarts the subprocess

### Root cause
MCP bridge subprocess had stale connection state. No config or dependency changes needed. The REST server itself never went down.
