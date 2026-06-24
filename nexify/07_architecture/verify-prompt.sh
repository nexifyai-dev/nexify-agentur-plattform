#!/bin/bash
# verify-prompt.sh — System-Prompt-Integritätscheck
# ASI01 Goal Hijack Prevention
# Owner: CTO | Stand: 2026-06-23
# Usage: verify-prompt.sh <prompt-file> [sha256-file]

set -euo pipefail

PROMPT_FILE="${1:-/workspace/nexify/memory/AGENTEN_SEELE_NEXIFY_CEO_RALPH_LOOP.md}"
SHA_FILE="${2:-${PROMPT_FILE}.sha256}"
ALARM_FILE="/tmp/prompt-tamper-alert"
LOG_TAG="prompt-integrity"

log() {
    logger -t "$LOG_TAG" "$1"
    echo "$1" >&2
}

# Prüfe: Prompt-Datei existiert
if [ ! -f "$PROMPT_FILE" ]; then
    log "CRITICAL: Prompt file $PROMPT_FILE not found"
    echo "FILE_NOT_FOUND:$PROMPT_FILE" > "$ALARM_FILE"
    exit 2
fi

# Prüfe: SHA256-Datei existiert
if [ ! -f "$SHA_FILE" ]; then
    log "CRITICAL: SHA256 file $SHA_FILE not found. Prompt=$PROMPT_FILE"
    echo "SHA_FILE_MISSING:$SHA_FILE" > "$ALARM_FILE"
    exit 2
fi

# Verifiziere SHA256
if sha256sum -c "$SHA_FILE" >/dev/null 2>&1; then
    log "OK: Prompt integrität bestätigt ($PROMPT_FILE)"
    rm -f "$ALARM_FILE"
    exit 0
else
    CURRENT=$(sha256sum "$PROMPT_FILE" | cut -d' ' -f1)
    EXPECTED=$(cut -d' ' -f1 "$SHA_FILE")
    log "ALERT: PROMPT TAMPER DETECTED! Expected=$EXPECTED Got=$CURRENT File=$PROMPT_FILE"
    echo "TAMPER_DETECTED:expected=$EXPECTED got=$CURRENT file=$PROMPT_FILE" > "$ALARM_FILE"
    exit 1
fi
