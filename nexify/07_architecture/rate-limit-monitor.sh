#!/bin/bash
# rate-limit-monitor — Überwacht Tool-Nutzung pro Agent/Turn
# ASI03 Privilege Abuse Prevention / ISO 42001 A.4
# Owner: CTO | Stand: 2026-06-23
# Cron: Viertelstündlich
# Usage: rate-limit-monitor [profile] [limit]

set -euo pipefail
export PATH="$HOME/bin:/usr/local/bin:/usr/bin:/bin"

PROFILE="${1:-nexify-ceo}"
LIMIT=${2:-50}  # Default max tool calls per turn
BASE_DIR="/tmp/rate-limit"
HERMES_LOG="$HOME/.hermes/profiles/$PROFILE/logs"
ALARM_FILE="/tmp/rate-limit-alarm"
DATE=$(date -u +%Y-%m-%dT%H:%M:%SZ)

mkdir -p "$BASE_DIR"

# Find recent tool call count (from Hermes log or session DB)
RECENT_CALLS=$(find "$HERMES_LOG" -name "*.log" -newermt '-5 minutes' 2>/dev/null | xargs grep -c "tool_call\|tool_use\|mcp_" 2>/dev/null | awk -F: '{s+=$NF}END{print s}' || echo 0)

echo "$DATE profile=$PROFILE calls=$RECENT_CALLS limit=$LIMIT" >> "$BASE_DIR/log"

if [ "$RECENT_CALLS" -gt "$LIMIT" ]; then
    echo "RATE_LIMIT_EXCEEDED:profile=$PROFILE calls=$RECENT_CALLS limit=$LIMIT" > "$ALARM_FILE"
    logger -t rate-limit-monitor "ALERT: $PROFILE exceeded $LIMIT tool calls (actual: $RECENT_CALLS)"
    
    # Wenn P0-Grenze überschritten (100+), Kill-Switch auslösen
    if [ "$RECENT_CALLS" -gt 100 ]; then
        logger -t rate-limit-monitor "CRITICAL: Auto-kill triggered for $PROFILE"
        ~/bin/kill-switch stop 2>/dev/null || echo "kill-switch not available"
    fi
    
    echo "ALERT: $PROFILE: $RECENT_CALLS calls in 5min (limit: $LIMIT)"
else
    echo "OK: $PROFILE: $RECENT_CALLS calls in 5min (limit: $LIMIT)"
    rm -f "$ALARM_FILE" 2>/dev/null || true
fi
