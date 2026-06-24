# NeXify Confirmation Prompt Inventory

**Status:** INITIAL / AKTIV
**Datum (Berlin):** 2026-06-11 14:15 +0200

## Scope

Alle bekannten interaktiven Bestätigungsquellen im NeXify-System.
Jeder Eintrag enthält Tool, Prompt-Art, aktuelles Verhalten und Noninteractive-Lösung.

## Inventory

### Claude Code

| ID | Prompt | Trigger | Current | Noninteractive | Status |
|---|---|---|---|---|---|
| CC-001 | "Do you want to proceed?" | Bash execution | Blocks terminal | `--permission-mode auto` + allowedTools | ✅ FIXED |
| CC-002 | "Trust this workspace?" | First workspace access | One-time | `settings.trusted` | ✅ FIXED | 
| CC-003 | File write confirmation | Edit/Write tools | silent | auto-accepted by tool | ✅ N/A |
| CC-004 | MCP server trust | First MCP connection | One-time | `mcpServers` config | ✅ FIXED |

### Git

| ID | Prompt | Trigger | Current | Noninteractive | Status |
|---|---|---|---|---|---|
| GIT-001 | "Author identity unknown" | First commit | Blocks | `GIT_AUTHOR_NAME/EMAIL` | ✅ FIXED |
| GIT-002 | "Push to remote?" | git push | Blocks | `--permission-mode` gate | ⚠️ GATED |
| GIT-003 | "Merge conflict?" | git merge | Blocks | N/A — manual | ⚠️ GATED |

### npm/npx

| ID | Prompt | Trigger | Current | Noninteractive | Status |
|---|---|---|---|---|---|
| NPM-001 | "Proceed to install?" | npx package | Blocks | `NPM_CONFIG_YES=true` | ✅ FIXED |

### apt

| ID | Prompt | Trigger | Current | Noninteractive | Status |
|---|---|---|---|---|---|
| APT-001 | "Do you want to continue?" | apt install | Blocks | `DEBIAN_FRONTEND=noninteractive -y` | ✅ FIXED |

### docker

| ID | Prompt | Trigger | Current | Noninteractive | Status |
|---|---|---|---|---|---|
| DKR-001 | "Continue? (y/n)" | docker system prune | Blocks | `--force` safe only | ⚠️ GATED |
| DKR-002 | "Remove container?" | docker rm | Blocks | `--force` safe only | ⚠️ GATED |

