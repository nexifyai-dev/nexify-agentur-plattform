#!/bin/sh
set -e
TRAEFIK_DIR=/docker/traefik-vsrs/dynamic
cd /opt/nexifyai-cloud
git stash || true
git pull origin main
docker compose build website
docker compose down website
docker compose up -d website
sleep 10
curl -sf http://127.0.0.1:3000/api/health && echo "healthy"
cp deploy/website-routes.yml "$TRAEFIK_DIR/nexifyai-website.yml"
echo "done"
