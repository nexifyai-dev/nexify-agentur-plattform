#!/usr/bin/env bash
# FILE: scripts/install-dual-write-hook.sh
# NIR: 02.08.2026 09:05
# UPDATED: 02.08.2026 09:05
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI DevOps
# WHAT: One-liner installer for AgentMemory+LightRAG post-commit dual-write.
# WHY: Hook exists in .githooks/ but is easy to miss without core.hooksPath.
# BEST-PRACTICE: Prefer core.hooksPath=.githooks; fallback copy into .git/hooks.
# PITFALL: Never inline secrets; requires AGENTMEMORY_SECRET in env for AM write.
# DEPENDS: .githooks/post-commit-dual-write; optional /opt/nexifyai/scripts/sync-to-lightrag.py
# DOCS-REF: docs/operations/HUMAN-GATE-5MIN.md
# SESSION: full-auto-config-close-7dd5

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
echo "note=Set AGENTMEMORY_SECRET in environment for AM remember; LightRAG uses sync-to-lightrag.py if present"
