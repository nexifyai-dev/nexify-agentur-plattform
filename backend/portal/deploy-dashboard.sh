#!/bin/bash
# NeXifyAI Dashboard Build & Deploy Script
# Builds the Vue dashboard and deploys to portal static directory
# WARNUNG (2026-08-10): Rebuild überschreibt /opt/nexifyai/portal/static/dashboard/
# und kann die Mobile-Overrides (@media-Fixes, 390px) zurücksetzen, wenn die
# Vue-Quelle (/opt/nexifyai/repos/dashboard-vue) nicht denselben Stand hat.
# Vor Ausführung: Quelle vs. deployed Stand abgleichen (diff), sonst Fix-Verlust.
set -e

DASHBOARD_DIR="/opt/nexifyai/repos/dashboard-vue"
PORTAL_STATIC="/opt/nexifyai/portal/static/dashboard"

echo "=== NeXifyAI Dashboard Deploy ==="
echo "Building from: $DASHBOARD_DIR"
echo "Deploying to:  $PORTAL_STATIC"

cd "$DASHBOARD_DIR"

# Clean build
echo "--- Cleaning ---"
rm -rf dist dist-ssr node_modules/.vite

# Build
echo "--- Building ---"
pnpm run build 2>&1 || {
    echo "BUILD FAILED — check dashboard-vue repo"
    exit 1
}

# Verify build output
echo "--- Verifying build ---"
MAIN_JS=$(grep -oP 'src="/dashboard/assets/\K[^"]+' dist/index.html | head -1)
if [ -z "$MAIN_JS" ] || [ ! -f "dist/assets/$MAIN_JS" ]; then
    echo "BUILD VERIFICATION FAILED: main JS asset '$MAIN_JS' not found in dist/assets/"
    exit 1
fi
echo "Main bundle: $MAIN_JS ($(du -h dist/assets/$MAIN_JS | cut -f1))"

# Deploy — atomic: build in temp location, then swap
echo "--- Deploying ---"
rm -rf "$PORTAL_STATIC.new"
cp -r dist "$PORTAL_STATIC.new"
rm -rf "$PORTAL_STATIC"
mv "$PORTAL_STATIC.new" "$PORTAL_STATIC"

# Verify deployment
echo "--- Verifying deployment ---"
# HACK: Portal bindet auf PORT aus hermes.env (4001) — 8880 nur Unit-Default.
# Last-Write-Wins: Drop-In EnvironmentFile hermes.env ueberschreibt Environment=PORT.
# Siehe Run 174 Root-Cause. Beide Kandidaten-Ports probieren, erster 200 gewinnt.
HTTP="000"
for p in 4001 8880; do
    code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:${p}/dashboard/" 2>/dev/null || echo "000")
    if [ "$code" = "200" ]; then HTTP="$code"; PORT_ACTIVE="$p"; break; fi
done
if [ "$HTTP" = "200" ]; then
    echo "✓ Dashboard serves correctly (HTTP $HTTP)"
else
    echo "✗ Dashboard returned HTTP $HTTP — portal may be down"
fi

# Do NOT overwrite root index.html — it is the Command Center (portal hub).
# The dashboard lives at /dashboard/ only.
echo "✓ Dashboard deployed at /dashboard/ (root index.html preserved as Command Center)"

# Deploy Traefik dynamic config
echo "--- Deploying Traefik dynamic config ---"
# HACK: Traefik file-provider laedt Verzeichnis /opt/nexifyai/traefik/dynamic/
# (main-routers.yml), NICHT /opt/nexifyai/traefik/dynamic.yml (Run-174-Befund).
cp /opt/nexifyai/portal/traefik/dynamic.yml /opt/nexifyai/traefik/dynamic/main-routers.yml
echo "✓ Traefik dynamic config deployed (dynamic/main-routers.yml)"

echo "=== Deploy complete ==="
echo "Verify at: https://admin.nexifyai.cloud/dashboard/"
echo "Local:     http://localhost:8880/dashboard/"
