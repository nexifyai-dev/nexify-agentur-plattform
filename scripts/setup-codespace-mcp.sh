#!/usr/bin/env bash
# FILE: /scripts/setup-codespace-mcp.sh
# WHAT: Bootstrapt MCP-Konfigurationen fuer Cursor Agent / Cloud Agent im Codespace.
# WHY: Einheitliche, lokale Einrichtung fuer agentmemory + context7 + gitlab-oss.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CURSOR_CONFIG="$ROOT_DIR/.cursor/mcp.json"
CURSOR_EXAMPLE="$ROOT_DIR/.cursor/mcp.json.example"
LOCAL_ENV_FILE="$ROOT_DIR/.env.mcp.codespace"

printf "# MCP Bootstrap (Codespace)\n"
printf "Root: %s\n\n" "$ROOT_DIR"

if [[ ! -f "$CURSOR_CONFIG" ]]; then
  cp "$CURSOR_EXAMPLE" "$CURSOR_CONFIG"
  printf "[ok] Erstellt: %s\n" "$CURSOR_CONFIG"
else
  printf "[ok] Bereits vorhanden: %s\n" "$CURSOR_CONFIG"
fi

if [[ ! -f "$LOCAL_ENV_FILE" ]]; then
  cat > "$LOCAL_ENV_FILE" <<'EOF'
# Lokale MCP-Variablen fuer Codespace (niemals committen)
AGENTMEMORY_URL=http://127.0.0.1:3111
AGENTMEMORY_SECRET=
AGENTMEMORY_TOOLS=all
AGENTMEMORY_INJECT_CONTEXT=true

GITLAB_API_URL=https://gitlab.nexifyai.cloud/api/v4
GITLAB_PERSONAL_ACCESS_TOKEN=
GITLAB_READ_ONLY_MODE=false
EOF
  printf "[ok] Vorlage erstellt: %s\n" "$LOCAL_ENV_FILE"
else
  printf "[ok] Bereits vorhanden: %s\n" "$LOCAL_ENV_FILE"
fi

printf "\nNaechste Schritte:\n"
printf "1) Werte in %s setzen (AGENTMEMORY_SECRET, GITLAB_PERSONAL_ACCESS_TOKEN).\n" "$LOCAL_ENV_FILE"
printf "2) In der Shell laden: set -a; source %s; set +a\n" "$LOCAL_ENV_FILE"
printf "3) Health-Check starten: bash scripts/mcp-health-codespace.sh\n"
printf "4) Cursor neu starten, damit MCP-Server neu geladen werden.\n"
