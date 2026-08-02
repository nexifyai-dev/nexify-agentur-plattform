#!/usr/bin/env bash
# FILE: scripts/install-dual-write-hook.sh
# NIR: 02.08.2026 09:05
# UPDATED: 02.08.2026 10:10
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI DevOps
# WHAT: One-liner installer for AgentMemory+LightRAG post-commit dual-write.
# WHY: Hook exists in .githooks/ but is easy to miss without core.hooksPath.
# BEST-PRACTICE: Prefer core.hooksPath=.githooks; fallback copy into .git/hooks.
# PITFALL: Never inline secrets; requires AGENTMEMORY_SECRET in env for AM write.
# DEPENDS: .githooks/post-commit-dual-write; optional LIGHTRAG_URL + LIGHTRAG_API_KEY
# DOCS-REF: docs/operations/CONTINUOUS-LEARNING.md · docs/operations/HUMAN-GATE-5MIN.md
# SESSION: continuous-learning-7dd5

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$ROOT/.githooks/post-commit-dual-write"

if [[ ! -f "$SRC" ]]; then
  echo "missing=$SRC" >&2
  exit 1
fi

chmod +x "$SRC"

# Preferred: point git at tracked hooks dir (preserves dual-write + future hooks)
if git -C "$ROOT" rev-parse --git-dir >/dev/null 2>&1; then
  git -C "$ROOT" config core.hooksPath .githooks
  echo "core.hooksPath=.githooks"
fi

# Also chain into classic post-commit if someone resets hooksPath later
HOOK_DIR="$ROOT/.git/hooks"
if [[ -d "$HOOK_DIR" ]]; then
  DST="$HOOK_DIR/post-commit"
  if [[ -f "$DST" ]] && ! grep -q 'post-commit-dual-write' "$DST" 2>/dev/null; then
    {
      echo ""
      echo "# dual-write chain (full-auto-config-close)"
      echo "bash \"$SRC\" || true"
    } >> "$DST"
    chmod +x "$DST"
    echo "chained=$DST"
  elif [[ ! -f "$DST" ]]; then
    install -m 0755 "$SRC" "$DST"
    echo "installed=$DST"
  else
    echo "already_chained_or_present=$DST"
  fi
fi

echo "dual_write_ready=1"
echo "note=Set AGENTMEMORY_SECRET for AM remember; LIGHTRAG_URL (+ LIGHTRAG_API_KEY) for index; see CONTINUOUS-LEARNING.md"
