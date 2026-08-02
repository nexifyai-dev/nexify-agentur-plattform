#!/usr/bin/env bash
# FILE: scripts/brain-dual-write.sh
# NIR: 02.08.2026 09:00
# UPDATED: 02.08.2026 09:00
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Safe Dual-Write — Commit-Summary → AgentMemory REST + LightRAG insert
# WHY: Schließt Doc-GAP (falsch „aktiv“) mit optionalem Helper ohne Secrets im Repo
# BEST-PRACTICE: No-op ohne Env; Failures nie Git blockieren; kein Secret-Echo
# PITFALL: V-DW-01: nie AGENTMEMORY_SECRET/LIGHTRAG_API_KEY committen oder loggen
# DEPENDS: AGENTMEMORY_URL, AGENTMEMORY_SECRET, LIGHTRAG_URL, LIGHTRAG_API_KEY (alle optional)
# DOCS-REF: docs/operations/BRAIN-DUAL-WRITE.md
# SESSION: brain-docs-alignment-7dd5

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

# Kill-Switch / offline → silent success
if [[ -f /opt/nexifyai/state/autopilot/KILL_SWITCH ]]; then
  exit 0
fi

MODE="${1:-auto}" # auto | commit | text
CUSTOM_TEXT="${2:-}"

HASH="n/a"
MSG=""
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  HASH="$(git rev-parse --short HEAD 2>/dev/null || echo n/a)"
  MSG="$(git log -1 --pretty=%s 2>/dev/null || true)"
fi

if [[ "$MODE" == "commit" || "$MODE" == "auto" ]]; then
  if [[ -n "$MSG" ]] && echo "$MSG" | grep -qE '^\[autopilot\]|^Merge '; then
    exit 0
  fi
fi

if [[ "$MODE" == "text" && -n "$CUSTOM_TEXT" ]]; then
  SUMMARY="$CUSTOM_TEXT"
elif [[ -n "${NEXIFY_COMMIT_SUMMARY:-}" ]]; then
  SUMMARY="$NEXIFY_COMMIT_SUMMARY"
else
  SUMMARY="Monorepo commit ${HASH}: ${MSG:-manual dual-write}"
fi

# Strip obvious secret-looking tokens from summary (defense in depth)
SUMMARY="$(printf '%s' "$SUMMARY" | sed -E 's/(sk-|ghp_|glpat-|Bearer )[A-Za-z0-9._-]{8,}/***/g')"

AM_URL="${AGENTMEMORY_URL:-http://127.0.0.1:3111}"
AM_URL="${AM_URL%/}"
LR_URL="${LIGHTRAG_URL:-http://127.0.0.1:9622}"
LR_URL="${LR_URL%/}"

am_ok=0
lr_ok=0
am_skip=0
lr_skip=0

if [[ -z "${AGENTMEMORY_SECRET:-}" ]]; then
  am_skip=1
else
  export NEXIFY_DW_SUMMARY="$SUMMARY"
  export NEXIFY_DW_AM_URL="$AM_URL"
  if python3 - <<'PY' >/dev/null 2>&1
import json, os, urllib.request
secret = os.environ.get("AGENTMEMORY_SECRET", "")
if not secret:
    raise SystemExit(2)
summary = os.environ.get("NEXIFY_DW_SUMMARY", "")
base = os.environ.get("NEXIFY_DW_AM_URL", "http://127.0.0.1:3111").rstrip("/")
body = json.dumps({
    "content": summary,
    "type": "workflow",
    "project": "nexify-agentur-plattform",
    "concepts": ["git", "dual-write", "monorepo", "brain-alignment"],
    "files": [],
}).encode()
req = urllib.request.Request(
    f"{base}/agentmemory/remember",
    data=body,
    headers={
        "Authorization": f"Bearer {secret}",
        "Content-Type": "application/json",
    },
    method="POST",
)
with urllib.request.urlopen(req, timeout=8) as resp:
    resp.read()
PY
  then
    am_ok=1
  fi
fi

if [[ -z "${LIGHTRAG_API_KEY:-}" ]]; then
  lr_skip=1
else
  export NEXIFY_DW_SUMMARY="$SUMMARY"
  export NEXIFY_DW_LR_URL="$LR_URL"
  export NEXIFY_DW_HASH="$HASH"
  if python3 - <<'PY' >/dev/null 2>&1
import json, os, urllib.request
key = os.environ.get("LIGHTRAG_API_KEY", "")
if not key:
    raise SystemExit(2)
summary = os.environ.get("NEXIFY_DW_SUMMARY", "")
base = os.environ.get("NEXIFY_DW_LR_URL", "http://127.0.0.1:9622").rstrip("/")
hash_ = os.environ.get("NEXIFY_DW_HASH", "n/a")
payload = {
    "text": summary,
    "file_source": f"git/commit-{hash_}",
}
body = json.dumps(payload).encode()
req = urllib.request.Request(
    f"{base}/documents/text",
    data=body,
    headers={
        "X-API-Key": key,
        "Content-Type": "application/json",
    },
    method="POST",
)
with urllib.request.urlopen(req, timeout=12) as resp:
    resp.read()
PY
  then
    lr_ok=1
  fi
fi

# Human-readable status (no secrets)
echo "brain_dual_write hash=${HASH} am=${am_ok} am_skip=${am_skip} lightrag=${lr_ok} lr_skip=${lr_skip}"

# Always succeed for git hooks — dual-write is best-effort
exit 0
