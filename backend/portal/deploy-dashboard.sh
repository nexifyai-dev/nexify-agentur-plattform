#!/bin/bash
# NeXifyAI Dashboard Build & Deploy Script
# Builds the Vue dashboard and deploys to portal static directory
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
HTTP=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8880/dashboard/ 2>/dev/null || echo "000")
if [ "$HTTP" = "200" ]; then
    echo "✓ Dashboard serves correctly (HTTP $HTTP)"
else
    echo "✗ Dashboard returned HTTP $HTTP — portal may be down"
fi

# Also update root index.html so / serves the same dashboard
ROOT_STATIC="/opt/nexifyai/portal/static"
cp "$PORTAL_STATIC/index.html" "$ROOT_STATIC/index.html"
echo "✓ Synced root index.html"

echo "=== Deploy complete ==="
echo "Verify at: https://admin.nexifyai.cloud/dashboard/"
echo "Local:     http://localhost:8880/dashboard/"
