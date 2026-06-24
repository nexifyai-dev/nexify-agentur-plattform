# SOCKET CONNECTION CLOSED — Root Cause Analysis

> Date: 2026-06-12
> Classification: SOCKET_CAUSE_LONG_RUNNING_SHELL

## Finding

The "socket connection closed unexpectedly" error occurred during the Clauf Code session due to a background `claude doctor` process (PID 134448) that was still running when the main session tried to make API calls.

## Cause

`claude doctor` performs MCP health checks on all connected plugins. With 71 MCP endpoints (38 Needs Auth, 28 Failed), the doctor process takes >60 seconds to complete. During this time, the MCP transport connection is occupied, leading to premature socket closure when the session makes concurrent requests.

## Affected

- claude doctor (PID 134448) — started but never completed
- claude doctor (PID 114967) — same session, duplicate
- Task output file `/tmp/claude-0/-root/4acb62fa-cb5e-4ea6-9a69-5ea8bc42a259/tasks/bns1h3t5k.output`

## Resolution

Not a code defect. Use targeted MCP checks (`claude mcp list | grep`) instead of full `claude doctor` when MCP health is being investigated. The doctor command is slow due to 71 plugin connections.

## Recurrence Prevention

- Avoid `claude doctor` for routine checks. Use targeted grep on `claude mcp list`.
- If doctor is needed: run with `timeout 30` or in background only.
- Added to Startup Sanierung Evidence.
