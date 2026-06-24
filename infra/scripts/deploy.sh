#!/bin/bash
# NeXify AI — VPS Deploy Script
# Run: bash infra/scripts/deploy.sh
# Requires: docker compose, git, root SSH
# Target: VPS 72.62.152.47, bestehender Traefik (traefik-vsrs)
set -euo pipefail

REPO_DIR="/opt/nexifyai-cloud"
BRANCH="${1:-main}"
TRAEFIK_DYNAMIC="/docker/traefik-vsrs/dynamic"

echo "=== NeXify AI Deploy ==="
echo "Repo: $REPO_DIR"
echo "Branch: $BRANCH"
echo ""

# 0. Sicherung der alten Dynamic-Config
if [ -f "$TRAEFIK_DYNAMIC/nexifyai-cloud-root.yml" ]; then
  echo "[0/6] Backup alte Website-Route..."
  cp "$TRAEFIK_DYNAMIC/nexifyai-cloud-root.yml" "$TRAEFIK_DYNAMIC/nexifyai-cloud-root.yml.bak.$(date +%s)"
fi

# 1. Pull latest
echo "[1/6] Pulling latest from origin/$BRANCH..."
cd "$REPO_DIR"
git fetch origin "$BRANCH"
git checkout "$BRANCH"
git pull origin "$BRANCH"

# 2. Build containers
echo "[2/6] Building containers..."
docker compose build --parallel

# 3. Stop old containers (nur monorepo, nicht andere VPS-Dienste)
echo "[3/6] Stopping old monorepo containers..."
docker compose down --timeout 30 2>/dev/null || true

# 4. Start new containers
echo "[4/6] Starting new containers..."
docker compose up -d --remove-orphans

# 5. Traefik-Dynamic-Config linken
echo "[5/6] Linking Traefik dynamic config..."
cp deploy/traefik/dynamic-monorepo.yml "$TRAEFIK_DYNAMIC/nexifyai-monorepo.yml"
echo "  → $TRAEFIK_DYNAMIC/nexifyai-monorepo.yml (auto-reload by Traefik watch)"

# 6. Health check
echo "[6/6] Running health checks..."
sleep 15
bash infra/scripts/health-check.sh

echo ""
echo "=== Deploy complete ==="
echo "Routes:"
echo "  nexifyai.cloud        → Website  (127.0.0.1:3000)"
echo "  webui.nexifyai.cloud  → Hermes   (127.0.0.1:8787)"
echo "  app.nexifyai.cloud    → Paperclip(127.0.0.1:3100)"
