# P1-2: Kill-Switch systemd-Unit + Auto-Start + Rate-Limit-Cron

**Date:** 2026-06-23  
**Status:** ✅ Implemented  
**Owner:** CTO  

## Deliverables

### 1. systemd User Unit: `hermes-kill-switch.service`

**File:** `~/.config/systemd/user/hermes-kill-switch.service`

```ini
[Unit]
Description=Hermes Kill-Switch Watcher — Emergency Stop for Agent Processes
Documentation=https://nexify.nousresearch.com/docs/kill-switch
After=network.target

[Service]
Type=simple
ExecStart=%h/bin/kill-switch enable
ExecStop=%h/bin/kill-switch disable
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=default.target
```

**Note:** Container has no systemd (busybox). Unit file created for real Linux hosts. On container, startup is handled via `.profile` hook (see below).

### 2. Rate-Limit-Monitor Script

**File:** `~/bin/rate-limit-monitor`

- Checks `/tmp/rate-limits/<profile>_rate` for API call count
- Soft limit 50, hard limit 100 per 15-min window
- Calls `kill-switch stop` if rate ≥ 100
- Logs to `/tmp/kill-switch/log`

### 3. Auto-Start Mechanism

**File:** `~/.config/systemd/user/kill-switch-startup.sh`

Runs at login via `.profile`:
- Starts kill-switch watcher
- Launches background loop: rate-limit-monitor every 15 min

### 4. Container Integration

**Modified:** `~/.profile` — calls `kill-switch-startup.sh` on login shell

## Verification

```
$ kill-switch enable
$ kill-switch status
=== KILL-SWITCH STATUS ===
  State: ENABLED (Watcher PID 37584)

$ rate-limit-monitor nexify-ceo 50
RATE 0 — within limits (soft=50 hard=100)

$ kill-switch disable
KILL-SWITCH DISABLED
```

## Files Created/Modified

| File | Action |
|------|--------|
| `~/.config/systemd/user/hermes-kill-switch.service` | created |
| `~/.config/systemd/user/kill-switch-startup.sh` | created |
| `~/bin/rate-limit-monitor` | created |
| `~/.profile` | modified (auto-start hook) |
| `/tmp/rate-limits/nexify-ceo_rate` | created (rate counter) |

## Files Referenced (pre-existing)

| File | Description |
|------|-------------|
| `~/bin/kill-switch` | kill-switch script (existing) |
| `/tmp/kill-switch/` | runtime state dir |

## Dependencies

- `~/bin/kill-switch` (pre-existing, unchanged)
- `bash` (system)

## Governance

- ASI03 Privilege Abuse / ISO 42001 A.4 Human Oversight
- Audit log: `/tmp/kill-switch/log`
