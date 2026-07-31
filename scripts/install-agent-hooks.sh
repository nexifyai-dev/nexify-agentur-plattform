#!/usr/bin/env bash
# FILE: /scripts/install-agent-hooks.sh
# WHAT: Installiert lokale Git-Hooks fuer proaktive Integrationssicherheit.
# WHY: Langlauf- und Deviation-Checks sollen auch bei Git-Ereignissen automatisch greifen.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
HOOK_DIR="$ROOT/.git/hooks"
STRICT_PRE_PUSH="${STRICT_PRE_PUSH:-0}"

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

chmod +x "$HOOK_DIR/post-merge" "$HOOK_DIR/post-checkout" "$HOOK_DIR/pre-push"

echo "hooks_installed=$HOOK_DIR"
echo "strict_pre_push=$STRICT_PRE_PUSH"
