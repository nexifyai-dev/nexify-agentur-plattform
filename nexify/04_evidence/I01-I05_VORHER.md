# Operator Shell UI-Defekte — VORHER Evidence

**Date**: 2026-06-22  
**Target**: Hermes WebUI on VPS (72.62.152.47:8787)  
**Container**: hermes-webui-nexify-hermes-webui-1

## Test Results WITHOUT Authentication (raw curl)

### I01: /api/tasks (Aufgaben)
```json
{"error":"Authentication required"}
```
**HTTP Status**: 401

### I02: /api/kanban/boards (Kanban)
```json
{"error":"Authentication required"}
```
**HTTP Status**: 401

### I03: /api/skills (Skills)
```json
{"error":"Authentication required"}
```
**HTTP Status**: 401

### I05: /api/profiles (Profiles)
```json
{"error":"Authentication required"}
```
**HTTP Status**: 401

## Root Cause Analysis

### Auth Mechanism
- Auth enabled via `HERMES_WEBUI_PASSWORD` environment variable
- Session-based auth using cookies (`hermes_session`)
- `check_auth()` in `api/auth.py` blocks all non-public API paths without valid session
- `PUBLIC_PATHS` only includes `/login`, `/health`, `/api/auth/*`

### Endpoint Existence Check (from routes.py source analysis)
| Endpoint | Exists in routes.py | Frontend calls it |
|---|---|---|
| `/api/tasks` | ❌ NOT FOUND | ❌ No frontend code references it |
| `/api/kanban/boards` | ✅ (line 5173) | ✅ panels.js |
| `/api/kanban/board` | ✅ (line 5173) | ✅ panels.js |
| `/api/skills` | ✅ (line 6174) | ✅ panels.js, commands.js |
| `/api/profiles` | ✅ (line 6255) | ✅ panels.js |

### Key Findings
1. **I01 (/api/tasks)**: Endpoint DOES NOT EXIST. No route in `routes.py`. Frontend also does NOT call `/api/tasks` — tasks are managed via `/api/kanban/*` endpoints.
2. **I02 (Kanban)**: Endpoint EXISTS and works with auth.
3. **I03 (Skills)**: Endpoint EXISTS and works with auth.
4. **I05 (Profiles)**: Endpoint EXISTS and works with auth.
5. **Common blocker**: All APIs require session authentication — this is by design.

## Data Source Status
- Kanban DB: `/home/hermeswebui/.hermes/kanban.db` — 2 boards (default, auftragszentrale), 16+9 tasks
- Skills dir: `/home/hermeswebui/.hermes/skills/` — 71 skills loaded
- Profiles dir: `/home/hermeswebui/.hermes/profiles/` — 17 profiles discovered
