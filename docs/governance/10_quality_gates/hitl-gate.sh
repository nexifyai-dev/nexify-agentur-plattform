#!/bin/bash
# hitl-gate.sh — Human In The Loop Gate
# ASI03 Privilege Abuse Prevention / ISO 42001 A.4 Human Oversight
# Owner: CTO | Stand: 2026-06-23
#
# Usage:
#   hitl-gate.sh request <agent> <action> [detail]
#   hitl-gate.sh approve <id>
#   hitl-gate.sh reject <id>
#   hitl-gate.sh list [pending|approved|rejected|timedout]
#   hitl-gate.sh status <id>

set -euo pipefail

BASE="/tmp/hitl-gate"
PENDING="$BASE/pending"
APPROVED="$BASE/approved"
REJECTED="$BASE/rejected"
TIMEDOUT="$BASE/timedout"
TIMEOUT_SEC=300
HOSTNAME=$(hostname)
DATE=$(date -u +%Y-%m-%dT%H:%M:%SZ)

mkdir -p "$PENDING" "$APPROVED" "$REJECTED" "$TIMEDOUT"

request() {
    local agent="$1"
    local action="$2"
    local detail="${3:-}"
    local id
    id=$(echo "$agent:$action:$DATE" | sha256sum | cut -c1-12)

    cat > "$PENDING/$id" << EOF
HITL REQUEST $id
Agent: $agent
Action: $action
Detail: $detail
Requested: $DATE
Host: $HOSTNAME
Status: PENDING
EOF

    echo "HITL:$id:PENDING"
    echo "HITL_REQUEST:$id:$agent:$action:$detail" >&2

    # Poll for approval
    local waited=0
    while [ $waited -lt $TIMEOUT_SEC ]; do
        if [ -f "$APPROVED/$id" ]; then
            cat "$APPROVED/$id"
            rm -f "$PENDING/$id"
            return 0
        fi
        if [ -f "$REJECTED/$id" ]; then
            cat "$REJECTED/$id"
            rm -f "$PENDING/$id"
            return 1
        fi
        sleep 5
        waited=$((waited + 5))
    done

    # Timeout
    mv "$PENDING/$id" "$TIMEDOUT/$id"
    sed -i 's/Status: PENDING/Status: TIMEDOUT/' "$TIMEDOUT/$id"
    echo "HITL:$id:TIMEDOUT (after ${TIMEOUT_SEC}s)"
    return 2
}

approve() {
    local id="$1"
    local approver="${2:-Pascal}"
    if [ ! -f "$PENDING/$id" ]; then
        echo "ERROR: No pending HITL request $id" >&2
        return 1
    fi
    cat > "$APPROVED/$id" << EOF
HITL APPROVED $id
Approved by: $approver
Approved at: $(date -u +%Y-%m-%dT%H:%M:%SZ)
EOF
    echo "APPROVED:$id"
}

reject() {
    local id="$1"
    local reason="${2:-No reason given}"
    local rejector="${3:-Pascal}"
    if [ ! -f "$PENDING/$id" ]; then
        echo "ERROR: No pending HITL request $id" >&2
        return 1
    fi
    cat > "$REJECTED/$id" << EOF
HITL REJECTED $id
Rejected by: $rejector
Reason: $reason
Rejected at: $(date -u +%Y-%m-%dT%H:%M:%SZ)
EOF
    echo "REJECTED:$id"
}

list() {
    local filter="${1:-all}"
    case "$filter" in
        pending)  ls -1 "$PENDING" 2>/dev/null | while read f; do head -3 "$PENDING/$f" 2>/dev/null; echo "---"; done ;;
        approved) ls -1 "$APPROVED" 2>/dev/null | while read f; do head -3 "$APPROVED/$f" 2>/dev/null; echo "---"; done ;;
        rejected) ls -1 "$REJECTED" 2>/dev/null | while read f; do head -3 "$REJECTED/$f" 2>/dev/null; echo "---"; done ;;
        timedout) ls -1 "$TIMEDOUT" 2>/dev/null | while read f; do head -3 "$TIMEDOUT/$f" 2>/dev/null; echo "---"; done ;;
        *)        echo "=== PENDING ==="; ls -1 "$PENDING" 2>/dev/null | wc -l
                  echo "=== APPROVED ==="; ls -1 "$APPROVED" 2>/dev/null | wc -l
                  echo "=== REJECTED ==="; ls -1 "$REJECTED" 2>/dev/null | wc -l
                  echo "=== TIMEDOUT ==="; ls -1 "$TIMEDOUT" 2>/dev/null | wc -l ;;
    esac
}

status() {
    local id="$1"
    for dir in pending approved rejected timedout; do
        local f
        f=$(echo "$BASE/$dir/$id" 2>/dev/null)
        if [ -f "$f" ]; then
            cat "$f"
            return 0
        fi
    done
    echo "HITL:$id:NOT_FOUND"
}

case "${1:-help}" in
    request)  request "${2:?agent}" "${3:?action}" "${4:-}" ;;
    approve)  approve "${2:?id}" "${3:-Pascal}" ;;
    reject)   reject "${2:?id}" "${3:-No reason given}" "${4:-Pascal}" ;;
    list)     list "${2:-all}" ;;
    status)   status "${2:?id}" ;;
    *)        echo "Usage: hitl-gate.sh {request|approve|reject|list|status}"
              echo "  request <agent> <action> [detail]"
              echo "  approve|reject <id> [reason]"
              echo "  list [pending|approved|rejected|timedout]"
              echo "  status <id>" ;;
esac
