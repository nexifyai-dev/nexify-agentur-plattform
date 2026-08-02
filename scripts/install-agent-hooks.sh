#!/usr/bin/env bash
# FILE: /scripts/install-agent-hooks.sh
# NIR: 02.08.2026 09:00
# WHAT: Installiert lokale Git-Hooks inkl. optional Dual-Write
# WHY: Langlauf-/Deviation-Checks + Brain Dual-Write ohne Secrets inline
# DOCS-REF: docs/operations/BRAIN-DUAL-WRITE.md
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STRICT_PRE_PUSH="${STRICT_PRE_PUSH:-0}"
USE_TRACKED_HOOKS="${USE_TRACKED_HOOKS:-1}"

cd "$ROOT"

# Prefer tracked .githooks (includes post-commit-dual-write)
if [[ "$USE_TRACKED_HOOKS" == "1" && -d "$ROOT/.githooks" ]]; then
  git config core.hooksPath .githooks
  chmod +x "$ROOT/.githooks/"* 2>/dev/null || true
  # Ensure dual-write helper is executable
  chmod +x "$ROOT/scripts/brain-dual-write.sh" 2>/dev/null || true
  echo "hooks_path=.githooks (tracked; dual-write optional via Env)"
  echo "dual_write_docs=docs/operations/BRAIN-DUAL-WRITE.md"
  echo "strict_pre_push=$STRICT_PRE_PUSH"
  # Still install pre-push deviation into .githooks if missing
  if [[ ! -f "$ROOT/.githooks/pre-push" ]]; then
    cat > "$ROOT/.githooks/pre-push" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"
python3 scripts/soll-deviation-scan.py >/dev/null 2>&1 || {
  if [[ "${STRICT_PRE_PUSH:-0}" == "1" ]]; then
    echo "pre_push_blocked=deviation_scan_failed"
    exit 1
  fi
  echo "pre_push_warn=deviation_scan_failed_but_not_blocking"
}
EOF
    chmod +x "$ROOT/.githooks/pre-push"
  fi
  exit 0
fi

# Fallback: classic .git/hooks (non-worktree / when .githooks absent)
HOOK_DIR="$ROOT/.git/hooks"
if [[ ! -d "$HOOK_DIR" ]]; then
  echo "missing_git_hooks_dir=$HOOK_DIR"
  exit 1
fi

mkdir -p "$HOOK_DIR"

cat > "$HOOK_DIR/post-merge" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"
bash scripts/ensure-gitlab-remote.sh >/dev/null 2>&1 || true
python3 scripts/soll-deviation-scan.py >/dev/null 2>&1 || true
EOF

cat > "$HOOK_DIR/post-checkout" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"
bash scripts/ensure-gitlab-remote.sh >/dev/null 2>&1 || true
EOF

cat > "$HOOK_DIR/pre-push" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"

python3 scripts/soll-deviation-scan.py >/dev/null 2>&1 || {
  if [[ "${STRICT_PRE_PUSH:-0}" == "1" ]]; then
    echo "pre_push_blocked=deviation_scan_failed"
    exit 1
  fi
  echo "pre_push_warn=deviation_scan_failed_but_not_blocking"
}
EOF

# Optional Dual-Write post-commit (No-op ohne Env)
cat > "$HOOK_DIR/post-commit" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"
if [[ -f scripts/brain-dual-write.sh ]]; then
  bash scripts/brain-dual-write.sh commit >/dev/null 2>&1 || true
fi
EOF

chmod +x "$HOOK_DIR/post-merge" "$HOOK_DIR/post-checkout" "$HOOK_DIR/pre-push" "$HOOK_DIR/post-commit"
chmod +x "$ROOT/scripts/brain-dual-write.sh" 2>/dev/null || true

# Dual-write AgentMemory + LightRAG (idempotent)
if [[ -x "$ROOT/scripts/install-dual-write-hook.sh" ]]; then
  bash "$ROOT/scripts/install-dual-write-hook.sh" || true
fi

echo "hooks_installed=$HOOK_DIR"
echo "dual_write=post-commit→scripts/brain-dual-write.sh (Env-gated)"
echo "strict_pre_push=$STRICT_PRE_PUSH"
