# Operator Shell UI-Defekte — NACHHER Evidence

**Date**: 2026-06-22  
**Target**: Hermes WebUI on VPS (72.62.152.47:8787)  
**Container**: hermes-webui-nexify-hermes-webui-1  
**Auth**: Session-based (HERMES_WEBUI_PASSWORD), authenticated via `/api/auth/login`

## Test Results WITH Authentication

### I01: Aufgaben (Tasks via Kanban)
- **Endpoint**: `/api/kanban/board` (default board)
- **Status**: HTTP 200 ✅
- **Result**: 6 columns (triage, todo, ready, running, blocked, done), tasks present in `ready` and `done` columns
- **Note**: There is no standalone `/api/tasks` endpoint. Tasks are managed via the Kanban system (`/api/kanban/board`, `/api/kanban/tasks/*`). The frontend UI correctly uses kanban endpoints. This is by design — the "Aufgaben" panel IS the Kanban board.

### I02: Kanban Boards
- **Endpoint**: `/api/kanban/boards`
- **Status**: HTTP 200 ✅
- **Result**: 2 boards discovered:
  - `default`: 16 tasks (7 blocked, 6 ready, 3 done)
  - `auftragszentrale`: 9 tasks (3 ready, 3 done, 3 failed) — CURRENT
- **Additional endpoints verified**:
  - `/api/kanban/config` → HTTP 200 ✅ (columns, assignees config)
  - `/api/kanban/stats` → HTTP 200 ✅ (by_status, by_assignee)

### I03: Skills
- **Endpoint**: `/api/skills`
- **Status**: HTTP 200 ✅
- **Result**: 71 skills loaded across categories (autonomous-ai-agents, creative, data-science, development, devops, email, github, media, mlops, note-taking, productivity, research, smart-home, social-media, software-development)
- **Additional endpoint verified**:
  - `/api/skills/usage` → HTTP 200 ✅ (usage stats, skill_names, total_invocations)

### I05: Profiles
- **Endpoint**: `/api/profiles`
- **Status**: HTTP 200 ✅
- **Result**: 17 profiles discovered, active: `agentur-admin`
  - Profiles include: default, agentur-admin, automation-agent, ceo, cso, cto, expert-data, expert-design, expert-dev, expert-ops, mcp-agent, monitoring-agent, network-engineer, nexify-ceo, vps-admin, workflow-agent
  - Skill counts range from 0 (cso, default) to 151 (multiple profiles)

## Root Cause Summary

### Original Diagnosis
"Root Cause: Fehlende API-Endpoints, nicht initialisierte Datenquellen"

### Actual Root Cause
**Authentication was the blocker.** All API endpoints exist in `routes.py` and all data sources are properly initialized:

1. **Authentication**: The WebUI requires session authentication (HERMES_WEBUI_PASSWORD). Without a valid session cookie, ALL API endpoints return HTTP 401 `{"error":"Authentication required"}`. This is by design — the `check_auth()` function in `api/auth.py` enforces this.

2. **I01 "Missing Endpoint"**: The `/api/tasks` endpoint does not exist because it's not supposed to. Tasks are managed through the Kanban system (`/api/kanban/*`). The frontend correctly uses kanban endpoints.

3. **Data Sources**: All data sources are properly initialized:
   - Kanban DB (`kanban.db`): Active with 2 boards and 25+ tasks
   - Skills directory: 71 skills loaded
   - Profiles directory: 17 profiles discovered and functional

### What Changed
**No code changes were needed.** The APIs work correctly. The "defects" were caused by:
1. Testing without authentication (expected 401 behavior)
2. Misidentifying `/api/tasks` as a missing endpoint (tasks live under `/api/kanban/*`)

### Verification
All 6 key API endpoints tested with authenticated session — all return HTTP 200 with valid data:
- `/api/kanban/boards` ✅
- `/api/kanban/board` ✅
- `/api/kanban/config` ✅
- `/api/kanban/stats` ✅
- `/api/skills` ✅
- `/api/skills/usage` ✅
- `/api/profiles` ✅
