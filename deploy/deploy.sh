#!/bin/sh
set -e
TRAEFIK_DIR=/docker/traefik-vsrs/dynamic
cd /opt/nexifyai-cloud
git stash || true
git pull origin main
docker compose build website
docker compose up -d website
# Health-Gate: curl muss eigenständig scheitern können, damit `set -e` greift.
# (Vorher: `curl ... && echo "healthy"` — bei Fehlschlag lief das Skript wegen der
# &&-Kette weiter und aktualisierte Traefik trotz kaputter Website.)
echo "Warte auf Website-Health..."
for i in 1 2 3 4 5 6 7 8 9 10; do
  if curl -sf http://127.0.0.1:3000/api/health >/dev/null; then
    echo "healthy"
    break
  fi
  if [ "$i" = "10" ]; then
    echo "FEHLER: Website wurde nicht healthy — Deploy abgebrochen, Traefik-Route NICHT aktualisiert." >&2
    exit 1
  fi
  sleep 3
done
install -D deploy/website-routes.yml "$TRAEFIK_DIR/nexifyai-website.yml"
echo "done"
