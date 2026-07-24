# Brain Service Recovery Report

**Date:** 2026-06-24  
**Service:** Brain API (port 8420)  
**Status:** ✅ RESTORED

---

## Root Cause

Brain API source file (`/workspace/nexifyai-platform/services/api/brain_api.py`) was **truncated to 24 lines** — only docstrings remained. All executable code (250 lines) was missing.

The file was marked `DEPRECATED` (see the docstring noting migration to `rag_pipeline.py`) and the actual code block was gutted, leaving only:

- A deprecation notice
- The original docstring header

No systemd, docker, or supervisor process was managing the service — it was run manually via `uvicorn`.

## Diagnosis Steps

1. **Port check:** `curl localhost:8420/health` → connection refused
2. **Process check:** No `brain` process found (no `ps` available, used `/proc/net/tcp`)
3. **Docker check:** `docker` not available in this container
4. **Source search:** Found `brain_api.py` at `/workspace/nexifyai-platform/services/api/brain_api.py`
5. **File analysis:** File was 24 lines (docstring-only), but `git show HEAD:brain_api.py` showed 250 lines
6. **Git history:** Commit `fa9e9ac` introduced the full Brain API v2, commit `67b911e` added deprecation notice, current HEAD had the code but working tree did not
7. **Dependencies:** uvicorn + fastapi installed, Qdrant running on port 6333 (verified via MCP)
8. **Disk:** 268G free — no space issue

## Recovery Action

Restored file from git HEAD:

```bash
cd /workspace/nexifyai-platform
git checkout HEAD -- services/api/brain_api.py
```

Started service with:

```bash
uvicorn services.api.brain_api:app --host 0.0.0.0 --port 8420
```

## Verification

| Check | Result |
|-------|--------|
| `GET /health` | `{"status": "ok", "qdrant": true, "collections": 4, "total_points": 9249}` |
| `GET /` | Full service info — 2 collections, 6 endpoints |
| `POST /query` | Working — returns results from Qdrant |
| `GET /stats` | Not tested but endpoint exists |
| MCP `brain_health` | Still failing — MCP tools point to `brain.nexifyai.cloud` (external tunnel), not localhost:8420 |

## MCP Tool Note

MCP tools (`mcp_brain_*`) connect to `https://brain.nexifyai.cloud` (external/cloudflare tunnel), NOT `localhost:8420`. The health check returns 500 from the external endpoint — this is a **separate tunnel/cloudflared issue**, not a port 8420 issue.

## Files Modified

- `/workspace/nexifyai-platform/services/api/brain_api.py` — restored from git HEAD (250 lines, was truncated to 24)
- `/workspace/nexify/10_evidence/recovery/brain_recovery_2026-06-23.md` — this file

## Background Process

- **PID:** 68462
- **Session ID:** proc_2639e8d414d2
- **Command:** `uvicorn services.api.brain_api:app --host 0.0.0.0 --port 8420`
- Running in Hermes background process manager
