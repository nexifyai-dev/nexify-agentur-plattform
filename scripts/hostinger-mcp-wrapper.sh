#!/usr/bin/env bash
# FILE: /opt/nexifyai/scripts/hostinger-mcp-wrapper.sh
# NIR: 02.08.2026 09:40
# NAME: NeXifyAI ComplianceEngine
# TEAM: NeXifyAI Core
# WHAT: (auto-dokumentiert)
# WHY: (auto-dokumentiert — fehlte NIR-Header)
# DEPENDS: (auto-dokumentiert)

# WHAT: Launch scoped Hostinger MCP binaries with token from chmod-600 env file.
# WHY: Keep API token out of git; Cursor mcp.json only references this wrapper.
set -euo pipefail
ENV_FILE="${HOSTINGER_ENV_FILE:-/etc/nexifyai/hostinger-api.env}"
if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source <(grep -E '^HOSTINGER_[A-Z0-9_]+=' "$ENV_FILE" || true)
  set +a
fi
if [[ -z "${HOSTINGER_API_TOKEN:-}" ]]; then
  echo "hostinger-mcp-wrapper: HOSTINGER_API_TOKEN missing (env file $ENV_FILE)" >&2
  exit 1
fi
BIN="${1:?usage: hostinger-mcp-wrapper.sh <hostinger-*-mcp>}"
shift || true
exec npx -y -p hostinger-api-mcp@latest "$BIN" "$@"
