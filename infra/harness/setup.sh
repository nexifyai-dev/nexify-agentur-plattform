#!/usr/bin/env bash
# FILE: infra/harness/setup.sh
# NIR: 26.07.2026 16:00
# UPDATED: 26.07.2026 16:00
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI DevOps
# WHAT: Harness Open Source — Einmalige Einrichtung und Initialisierung auf dem VPS
# WHY: Automatisiert die Erst-Konfiguration: Secrets schreiben, Container starten,
#      Admin-Account verifizieren, Traefik-Route einbinden.
# BEST-PRACTICE: Idempotent ausführbar — mehrfaches Starten schadet nicht.
#               --dry-run zeigt nur, was getan würde.
# PITFALL: V-01: HARNESS_DB_PASSWORD und HARNESS_ADMIN_PASSWORD müssen vor
#          dem ersten Start gesetzt sein — danach nicht mehr änderbar ohne DB-Dump.
# PITFALL: V-02: Docker-Socket-Mount erfordert, dass der Harness-Container als root
#          läuft oder in der docker-Gruppe ist.
# DEPENDS: docker, docker compose, curl, /etc/nexifyai/secrets.env
# DOCS-REF: docs/architecture/HARNESS-INTEGRATION.md

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SECRETS_FILE="/etc/nexifyai/secrets.env"
DRY_RUN=false

# ── Argumente ─────────────────────────────────────────────────────────────────
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=true ;;
    --apply)   DRY_RUN=false ;;
    *) echo "Unbekanntes Argument: $arg"; exit 1 ;;
  esac
done

log()  { echo "[harness-setup] $*"; }
warn() { echo "[harness-setup] WARN: $*" >&2; }
run()  { if $DRY_RUN; then echo "[DRY-RUN] $*"; else "$@"; fi; }

# ── 1. Voraussetzungen prüfen ─────────────────────────────────────────────────
log "=== Harness Open Source — Setup ==="
$DRY_RUN && log "(Dry-Run-Modus — keine Änderungen werden vorgenommen)"

command -v docker  >/dev/null || { warn "Docker nicht gefunden"; exit 1; }
command -v curl    >/dev/null || { warn "curl nicht gefunden"; exit 1; }

# ── 2. Secrets prüfen/anlegen ─────────────────────────────────────────────────
log "Prüfe Harness-Secrets in $SECRETS_FILE ..."

declare -A REQUIRED_SECRETS=(
  [HARNESS_DB_PASSWORD]="changeme_harness_db_BITTE_AENDERN"
  [HARNESS_ADMIN_PASSWORD]="changeme_harness_admin_BITTE_AENDERN"
  [HARNESS_ADMIN_EMAIL]="admin@nexifyai.cloud"
  [HARNESS_URL_BASE]="https://harness.nexifyai.cloud"
  [HARNESS_URL_GIT]="https://harness.nexifyai.cloud"
  [HARNESS_DB_NAME]="harnessdb"
  [HARNESS_DB_USER]="harness"
)

if [ -f "$SECRETS_FILE" ]; then
  for key in "${!REQUIRED_SECRETS[@]}"; do
    if ! grep -q "^${key}=" "$SECRETS_FILE" 2>/dev/null; then
      log "Füge $key mit Standardwert ein (bitte anpassen!)"
      run bash -c "echo '${key}=${REQUIRED_SECRETS[$key]}' >> $SECRETS_FILE"
    else
      log "$key — bereits vorhanden ✓"
    fi
  done
else
  warn "$SECRETS_FILE nicht gefunden — erstelle Datei mit Platzhaltern"
  run bash -c "touch $SECRETS_FILE && chmod 600 $SECRETS_FILE"
  for key in "${!REQUIRED_SECRETS[@]}"; do
    run bash -c "echo '${key}=${REQUIRED_SECRETS[$key]}' >> $SECRETS_FILE"
  done
fi

# Sicherheits-Warnung bei Default-Passwörtern
if grep -q "changeme_harness" "$SECRETS_FILE" 2>/dev/null; then
  warn "⚠️  ACHTUNG: Standard-Passwörter gefunden!"
  warn "   Bitte HARNESS_DB_PASSWORD und HARNESS_ADMIN_PASSWORD in $SECRETS_FILE setzen."
fi

# ── 3. Traefik-Route einbinden ────────────────────────────────────────────────
TRAEFIK_CONF_DIR="/etc/traefik/dynamic"
ROUTE_SRC="$REPO_ROOT/deploy/harness/traefik-routes.yml"
ROUTE_DST="$TRAEFIK_CONF_DIR/harness.yml"

if [ -d "$TRAEFIK_CONF_DIR" ]; then
  log "Verlinke Traefik-Routen-Datei nach $ROUTE_DST ..."
  run ln -sf "$ROUTE_SRC" "$ROUTE_DST"
  log "Traefik-Route aktiviert ✓"
else
  warn "Traefik-Konfig-Verzeichnis $TRAEFIK_CONF_DIR nicht gefunden."
  warn "Bitte $ROUTE_SRC manuell in den Traefik-File-Provider-Pfad kopieren."
fi

# ── 4. Docker Volumes anlegen (idempotent) ────────────────────────────────────
log "Erstelle Docker-Volumes ..."
run docker volume create nexify-harness-data  2>/dev/null || true
run docker volume create nexify-harness-pgdata 2>/dev/null || true

# ── 5. Container starten ──────────────────────────────────────────────────────
log "Starte Harness-Container ..."
cd "$REPO_ROOT"
run docker compose up -d harness-db
log "Warte auf harness-db Health (max. 60s) ..."
if ! $DRY_RUN; then
  for i in $(seq 1 12); do
    STATUS=$(docker inspect --format '{{.State.Health.Status}}' nexify-harness-db 2>/dev/null || echo "unknown")
    [ "$STATUS" = "healthy" ] && break
    echo "  ($i/12) Status: $STATUS — warte 5s ..."
    sleep 5
  done
  STATUS=$(docker inspect --format '{{.State.Health.Status}}' nexify-harness-db 2>/dev/null || echo "unknown")
  if [ "$STATUS" != "healthy" ]; then
    warn "harness-db nicht healthy nach 60s. Logs:"
    docker logs nexify-harness-db --tail 20
    exit 1
  fi
fi

run docker compose up -d harness

log "Warte auf Harness Web UI (max. 120s) ..."
if ! $DRY_RUN; then
  for i in $(seq 1 24); do
    if curl -sf http://127.0.0.1:3101/api/v1/system/health >/dev/null 2>&1; then
      log "Harness Web UI erreichbar ✓"
      break
    fi
    echo "  ($i/24) Harness startet noch — warte 5s ..."
    sleep 5
  done
fi

# ── 6. Status-Ausgabe ─────────────────────────────────────────────────────────
log ""
log "=== Harness Setup abgeschlossen ==="
log "  Web UI (lokal):   http://127.0.0.1:3101"
log "  Web UI (extern):  https://harness.nexifyai.cloud"
log "  SSH Git:          ssh://git@<VPS-IP>:3022/<user>/<repo>.git"
log "  Admin-Email:      $(grep 'HARNESS_ADMIN_EMAIL' $SECRETS_FILE 2>/dev/null | cut -d= -f2 || echo 'siehe secrets.env')"
log ""
log "Nächste Schritte:"
log "  1. Browser: https://harness.nexifyai.cloud → Admin-Account anlegen"
log "  2. Cloudflare Tunnel-Config patchen (deploy/harness/cloudflare-tunnel.md)"
log "  3. Erstes Repo anlegen und .harness/pipeline.yml einchecken"
log "  4. Repo-Mirror von GitHub einrichten (Settings → Webhooks)"
log ""
if grep -q "changeme" "$SECRETS_FILE" 2>/dev/null; then
  warn "⚠️  Bitte Standard-Passwörter in $SECRETS_FILE vor Production-Nutzung ändern!"
fi
