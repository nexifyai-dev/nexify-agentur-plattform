#!/usr/bin/env bash
# FILE: /scripts/copilot-autonomous.sh
# WHAT: GitHub Copilot CLI ohne Ja/Nein-Prompts (Voll-Autonomie).
# WHY: NeXifyAI Agentic AI Mode — Outcomes only, kein interaktives Gate.
# BEST-PRACTICE: --yolo + --no-ask-user; Repo-Settings in .github/copilot/settings.json
# PITFALL: Org-Policy permissions.disableBypassPermissionsMode blockiert --yolo
# DOCS-REF: deploy/copilot/README.md
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if ! command -v copilot >/dev/null 2>&1; then
  echo "❌ copilot CLI nicht installiert. Siehe deploy/copilot/README.md" >&2
  exit 127
fi

# Repo settings (.github/copilot/settings.json) set askUser:false automatically.
# --yolo = allow-all-tools/paths/urls for this session (no per-tool prompts).
# --no-ask-user = keine Rückfragen bei Unklarheit (decide & act).
exec copilot --yolo --no-ask-user "$@"
