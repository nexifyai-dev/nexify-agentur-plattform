# Cron Recovery — 2026-06-23/24

## Root Cause
- **Gateway (cron scheduler) daemon not running** — `hermes gateway` process was dead.
- Scheduler (`hermes gateway run`) hadn't been started since system boot or previous crash.
- Without gateway running, cron ticker never fires → all jobs stalled at last_run=never or Jun 20.

## Secondary Issues Found & Fixed

### 1. CEO cron file (`nexify-ceo`) — malformed/old format
- File had **old flat dict schema** (not `{jobs: [...]}` format expected by newer CLI).
- Contained `age` sub-object nested inside `rage-sync` key — structured wrong.
- **Fix**: Replaced with proper `{jobs: [...]}` array format containing 2 jobs:
  - `rage-sync` (every 4h)
  - `rate-limit-monitor` (every 15min)

### 2. Merge conflict in Hermes CLI (`hermes_constants.py`)
- Line 390: `>>>>>>> 3c75e11571 (fix(browser): ...)` leftover from git merge.
- Broke `hermes cron list/status` for all non-ceo profiles (SyntaxError).
- **Fix**: Removed the conflict artifact line.

### 3. Script paths in CEO cron — wrong
- `rage-sync` pointed to script without absolute path (relative only).
- `rate-limit-monitor` had no script path at all.
- **Fix**: Set absolute paths:
  - `rage-sync` → `/workspace/nexifyai/ops/ragflow_sync_pipeline.py`
  - `rate-limit-monitor` → `/workspace/nexify/10_evidence/bin/rate-limit-monitor.sh`

### 4. agentur-admin cron file — root-owned
- `/home/hermeswebui/.hermes/profiles/agentur-admin/cron/jobs.json` owned by `root:root` (uid 0, mode 600).
- Cannot read or write without sudo (not available).
- **Blocked**: Requires root/sysadmin intervention to chown back to hermeswebui.

### 5. network-engineer — duplicate brain-agentmemory-sync
- Two jobs with same `name` + `script`: `77c122e5f387` and `f3c4be11dc08`.
- **Fix**: Removed duplicate (kept first one with proper workdir).

### 6. Stale timestamps — all profiles
- All `next_run_at` and `updated_at` stuck on Jun 20.
- **Fix**: Updated to 2026-06-24T07:24 UTC.

## Current State (verified)

| Profile | Jobs | Status |
|---------|------|--------|
| nexify-ceo | 2 | ✅ Gateway running, ticker active |
| automation-agent | 3 | ✅ Gateway running, ticker active |
| ceo | 5 | ✅ Gateway running, ticker active |
| expert-design | 4 | ✅ Gateway running, ticker active |
| mcp-agent | 1 | ✅ Gateway running, ticker active |
| network-engineer | 5 | ✅ Gateway running, ticker active (deduped) |
| agentur-admin | ? | ❌ Root-owned file, blocked |
| expert-dev | 0 | ⚠️ No cron directory exists |
| **Total active** | **20** | |

**Gateway**: Running PID 69837 (manual, not system service)

## Actions Taken
1. ✅ Restored CEO cron with valid JSON format
2. ✅ Fixed hermes_constants.py merge conflict (5 other profiles were broken)
3. ✅ Fixed absolute script paths in CEO cron jobs
4. ✅ Removed duplicate brain-agentmemory-sync from network-engineer
5. ✅ Updated all stale timestamps to current time
6. ✅ Started gateway daemon (background process)
7. ✅ Backed up all modified cron files (*.bak)
8. ✅ Documented agentur-admin root-owned blocker

## Remaining Issues
1. **agentur-admin** cron file root-owned — needs `sudo chown hermeswebui:hermeswebui` to recover
2. **No systemd service** — gateway runs as manual background process; won't survive container restart
3. **expert-dev** profile has no cron directory at all — create if needed
4. **CEO script paths** tested against actual filesystem, may need further adjustment if scripts have missing deps
