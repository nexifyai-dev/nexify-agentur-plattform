#!/usr/bin/env bash
# FILE: /deploy/cursor/install-commands.sh
# NIR: 25.07.2026 09:17
# UPDATED: 25.07.2026 09:17
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: One-shot Installer für ~/.cursor/commands (Linux/macOS/Git-Bash)
# WHY: Ein selbstausführbarer Shell-Befehl für den User
# BEST-PRACTICE: curl -fsSL <raw> | bash
# PITFALL: BRANCH ggf. auf main umstellen nach Merge
# DEPENDS: curl, Schreibrecht auf ~/.cursor/commands
# DOCS-REF: deploy/cursor/README.md
# SESSION: cursor/nexifyai-commands-9368

set -euo pipefail

SOURCE="${1:-github}"   # github | vps | repo
BRANCH="${BRANCH:-cursor/nexifyai-commands-9368}"
VPS_HOST="${VPS_HOST:-10.66.66.1}"
TARGET="${TARGET:-$HOME/.cursor/commands}"

NAMES=(
  nexifyai-commands
  gitlab-oss-mcp
  nine-router
  vpn-ssh
  governance-f32
  pr-flow
  mcp-health
  vps-ops
)

mkdir -p "$TARGET"

case "$SOURCE" in
  github)
    BASE="https://raw.githubusercontent.com/nexifyai-dev/nexify-agentur-plattform/${BRANCH}/.cursor/commands"
    for n in "${NAMES[@]}"; do
      echo "GET $BASE/$n.md"
      curl -fsSL "$BASE/$n.md" -o "$TARGET/$n.md"
    done
    ;;
  vps)
    echo "SCP root@${VPS_HOST}:/root/nexify-cursor-commands/*.md -> $TARGET"
    scp "root@${VPS_HOST}:/root/nexify-cursor-commands/"*.md "$TARGET/"
    ;;
  repo)
    ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
    cp -f "$ROOT/.cursor/commands/"*.md "$TARGET/"
    ;;
  *)
    echo "Usage: $0 [github|vps|repo]" >&2
    exit 2
    ;;
esac

echo
echo "OK -> $TARGET"
for f in "$TARGET"/*.md; do
  b="$(basename "$f" .md)"
  echo "  /$b"
done
echo
echo "Next: Cursor -> Open Folder -> Chat / -> /nexifyai-commands"
