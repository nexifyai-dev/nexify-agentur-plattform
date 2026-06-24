#!/bin/bash
# kill-switch — Emergency Stop für alle Hermes-Agenten
# ASI03 Privilege Abuse / ISO 42001 A.4 Human Oversight
# Owner: CTO | Stand: 2026-06-23
#
# Usage:
#   kill-switch enable        — Aktiviere Kill-Switch (lege Wächter an)
#   kill-switch disable       — Deaktiviere Kill-Switch
#   kill-switch stop          — NOTSTOP: alle Agenten sofort beenden
#   kill-switch status        — Zeige aktuellen Status
#   kill-switch log           — Zeige letzte 20 Ereignisse
#   kill-switch reset         — Reset nach Notstop (entferne stop-Flag)

set -euo pipefail
export PATH="$HOME/bin:/usr/local/bin:/usr/bin:/bin"

SWITCH_DIR="/tmp/kill-switch"
STOP_FLAG="$SWITCH_DIR/stop"
DISABLE_FLAG="$SWITCH_DIR/disabled"
WATCH_PID_FILE="$SWITCH_DIR/watcher.pid"
LOG_FILE="$SWITCH_DIR/log"
HERMES_PIDS_FILE="$SWITCH_DIR/hermes-pids"
HERMES_HOME="/home/hermeswebui"
HERMES_BIN=$(which hermes 2>/dev/null || echo "$HOME/.local/bin/hermes")

mkdir -p "$SWITCH_DIR"

log() {
    local ts
    ts=$(date -u +%Y-%m-%dT%H:%M:%SZ)
    echo "$ts $*" >> "$LOG_FILE"
    echo "$ts $*"
}

enable_watcher() {
    if [ -f "$WATCH_PID_FILE" ] && kill -0 "$(cat "$WATCH_PID_FILE")" 2>/dev/null; then
        log "WATCHER already running (PID $(cat "$WATCH_PID_FILE"))"
        return 0
    fi

    # Start watcher in background
    (
        while true; do
            if [ -f "$STOP_FLAG" ]; then
                log "KILL-SWITCH TRIGGERED — stopping all agents"

                # Kill all Hermes agent processes
                if [ -f "$HERMES_PIDS_FILE" ]; then
                    while read -r pid; do
                        kill "$pid" 2>/dev/null && log "Killed Hermes PID $pid" || true
                    done < "$HERMES_PIDS_FILE"
                fi

                # Kill any running hermes processes
                for pid in $(pgrep -f "hermes" 2>/dev/null || true); do
                    kill "$pid" 2>/dev/null && log "Killed hermes process PID $pid" || true
                done

                log "KILL-SWITCH done. Run 'kill-switch reset' to re-enable."
                exit 0
            fi
            sleep 1
        done
    ) &
    WATCH_PID=$!
    echo "$WATCH_PID" > "$WATCH_PID_FILE"
    log "WATCHER started (PID $WATCH_PID)"
}

enable() {
    rm -f "$DISABLE_FLAG"
    enable_watcher
    log "KILL-SWITCH ENABLED"
    echo "KILL-SWITCH ENABLED — Watcher PID $(cat "$WATCH_PID_FILE")"
}

disable() {
    touch "$DISABLE_FLAG"
    if [ -f "$WATCH_PID_FILE" ]; then
        kill "$(cat "$WATCH_PID_FILE")" 2>/dev/null || true
        rm -f "$WATCH_PID_FILE"
    fi
    rm -f "$STOP_FLAG"
    log "KILL-SWITCH DISABLED"
    echo "KILL-SWITCH DISABLED"
}

stop() {
    if [ -f "$DISABLE_FLAG" ]; then
        log "KILL-SWITCH is disabled — enable first"
        echo "ERROR: Kill-Switch is disabled. Run 'kill-switch enable' first."
        exit 1
    fi

    log "STOP requested by $(whoami 2>/dev/null || echo 'unknown')"

    # Save current Hermes PIDs
    pgrep -f "hermes" 2>/dev/null > "$HERMES_PIDS_FILE" || true
    log "Found $(wc -l < "$HERMES_PIDS_FILE") Hermes processes to kill"

    # Trigger stop
    date -u +%s > "$STOP_FLAG"
    echo "STOP TRIGGERED — all agents will be killed within 2 seconds"
}

status() {
    echo "=== KILL-SWITCH STATUS ==="
    if [ -f "$DISABLE_FLAG" ]; then
        echo "  State: DISABLED"
    elif [ -f "$STOP_FLAG" ]; then
        echo "  State: STOPPED (triggered at $(cat "$STOP_FLAG" 2>/dev/null))"
    elif [ -f "$WATCH_PID_FILE" ] && kill -0 "$(cat "$WATCH_PID_FILE")" 2>/dev/null; then
        echo "  State: ENABLED (Watcher PID $(cat "$WATCH_PID_FILE"))"
    else
        echo "  State: NOT RUNNING (run kill-switch enable)"
    fi
    echo "  Log entries: $(wc -l < "$LOG_FILE" 2>/dev/null || echo 0)"
    echo "  Recent:"
    tail -5 "$LOG_FILE" 2>/dev/null || echo "  (no log)"
}

reset_ks() {
    if [ ! -f "$STOP_FLAG" ]; then
        echo "No stop flag — nothing to reset"
        return 0
    fi
    rm -f "$STOP_FLAG" "$HERMES_PIDS_FILE"
    enable_watcher
    log "KILL-SWITCH RESET"
    echo "KILL-SWITCH RESET — Watcher restarted"
}

log_action() {
    tail -20 "$LOG_FILE" 2>/dev/null || echo "No log entries"
}

case "${1:-help}" in
    enable)  enable ;;
    disable) disable ;;
    stop)    stop ;;
    status)  status ;;
    reset)   reset_ks ;;
    log)     log_action ;;
    *)
        echo "Kill-Switch — Emergency Stop für Hermes-Agenten"
        echo ""
        echo "Usage: kill-switch {enable|disable|stop|status|reset|log}"
        echo ""
        echo "  enable   — Starte Kill-Switch-Wächter (daemon)"
        echo "  disable  — Deaktiviere Kill-Switch komplett"
        echo "  stop     — NOTSTOP: alle Agenten sofort killen"
        echo "  status   — Zeige Status"
        echo "  reset    — Reset nach Notstop"
        echo "  log      — Letzte 20 Ereignisse"
        ;;
esac
