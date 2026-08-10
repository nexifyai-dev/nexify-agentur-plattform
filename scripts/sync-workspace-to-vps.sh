#!/bin/bash
# Sync workspace content from VPS to local repo
# Usage: ./scripts/sync-workspace-to-vps.sh [push|pull]

set -euo pipefail

VPS_HOST="srv1243952.hstgr.cloud"
VPS_USER="root"
VPS_WORKSPACE="/workspace/nexify"
REPO_NEXIFY="nexify"

# Directories that live on VPS and sync VPS → Repo (manual pull)
VPS_SOURCE_DIRS=(
  "00_master"
  "01_agenten_seele"
  "02_governance"
  "02_regelwerke"
  "03_checklisten"
  "03_security"
  "04_normen"
  "04_register"
  "05_skills"
  "06_optimization"
  "07_architecture"
)

# Directories that should NEVER be synced
# "workspace" — VPS runtime outputs

MODE="${1:-pull}"

case "$MODE" in
  pull)
    echo ">>> Pulling VPS workspace → local repo"
    for dir in "${VPS_SOURCE_DIRS[@]}"; do
      echo "  Syncing $dir..."
      rsync -az --delete \
        "${VPS_USER}@${VPS_HOST}:${VPS_WORKSPACE}/${dir}/" \
        "${REPO_NEXIFY}/${dir}/"
    done
    echo ">>> Done. Review changes with: git diff --stat nexify/"
    ;;

  push)
    echo ">>> Pushing local repo → VPS workspace"
    for dir in "${VPS_SOURCE_DIRS[@]}"; do
      echo "  Syncing $dir..."
      rsync -az --delete \
        "${REPO_NEXIFY}/${dir}/" \
        "${VPS_USER}@${VPS_HOST}:${VPS_WORKSPACE}/${dir}/"
    done
    echo ">>> Done."
    ;;

  *)
    echo "Usage: $0 [push|pull]"
    echo "  push — local repo → VPS workspace"
    echo "  pull — VPS workspace → local repo"
    exit 1
    ;;
esac
