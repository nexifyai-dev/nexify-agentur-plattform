#!/usr/bin/env bash
# NeXifyAI: Sync GitHub-Token von secrets.env in hermes.env (zentrale Key-Verwaltung)
# NIR: 03.08.2026
# NAME: NeXifyAI Autopilot
# TEAM: NeXifyAI Core
# WHAT: GITHUB_TOKEN aus /etc/nexifyai/secrets.env nach /etc/nexifyai/hermes.env kopieren (idempotent)
# WHY: Hermes Terminal (env_passthrough=GITHUB_TOKEN) braucht das Token in der Prozess-Umgebung; hermes.env ist die zentrale Key-Verwaltung
# DEPENDS: /etc/nexifyai/secrets.env (Quelle), root-Rechte für /etc/nexifyai/hermes.env
# USAGE: bash deploy/github/sync-github-token-to-hermes-env.sh
set -euo pipefail

SRC="/etc/nexifyai/secrets.env"
DST="/etc/nexifyai/hermes.env"

if [ ! -r "$SRC" ]; then
  echo "ERROR: Quelle fehlt: $SRC" >&2
  exit 1
fi
if [ ! -w "$DST" ] && [ ! -f "$DST" ]; then
  touch "$DST" 2>/dev/null || { echo "ERROR: $DST nicht schreibbar (root nötig)" >&2; exit 1; }
fi

# Wert nur intern halten — niemals ausgeben
VAL="$(awk -F= '/^GITHUB_TOKEN=/{print $2}' "$SRC" | head -1 | tr -d '\r\n')"
if [ -z "$VAL" ]; then
  echo "ERROR: GITHUB_TOKEN nicht in $SRC gefunden" >&2
  exit 1
fi

if [ -f "$DST" ] && grep -q '^GITHUB_TOKEN=' "$DST"; then
  # bestehende Zeile ersetzen (nur wenn sie sich unterscheidet)
  TMP="$(mktemp)"
  awk -v v="$VAL" -F= 'BEGIN{OFS="="} /^GITHUB_TOKEN=/{print "GITHUB_TOKEN", v; next} {print}' "$DST" > "$TMP"
  chmod 600 "$TMP"
  mv "$TMP" "$DST"
else
  printf '\nGITHUB_TOKEN=%s\n' "$VAL" >> "$DST"
fi
chmod 600 "$DST" 2>/dev/null || true

LEN="${#VAL}"
echo "synced: GITHUB_TOKEN in $DST (len=$LEN)"
echo "hinweis: Hermes-Dienst neu starten, damit env_passthrough greift (z. B. systemctl restart hermes oder tmux-Session neu)"
