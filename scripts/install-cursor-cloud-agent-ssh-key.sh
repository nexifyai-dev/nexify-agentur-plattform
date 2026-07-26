#!/usr/bin/env bash
# FILE: /scripts/install-cursor-cloud-agent-ssh-key.sh
# NIR: 25.07.2026 01:45
# UPDATED: 25.07.2026 01:45
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Idempotently append the Cursor cloud-agent Ed25519 pubkey to authorized_keys.
# WHY: Restores agent SSH access without duplicating the key on re-runs.
# BEST-PRACTICE: Run from Hostinger console while remote SSH (C-07) is blocked.
# PITFALL: V-02: Do not overwrite authorized_keys — append + grep guard only.
# DEPENDS: deploy/ssh/cursor-cloud-agent-nexify-vps.pub; target user HOME/.ssh
# DOCS-REF: /deploy/ssh/README.md
# SESSION: bc-d485860d-ad48-4c90-9109-ca221d3b9368

set -euo pipefail

TARGET_USER="${1:-root}"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PUBKEY_FILE="${REPO_ROOT}/deploy/ssh/cursor-cloud-agent-nexify-vps.pub"

if [[ ! -f "${PUBKEY_FILE}" ]]; then
  echo "ERROR: missing pubkey: ${PUBKEY_FILE}" >&2
  exit 1
fi

PUBKEY="$(tr -d '\r\n' < "${PUBKEY_FILE}")"
if [[ ! "${PUBKEY}" =~ ^ssh-ed25519[[:space:]] ]]; then
  echo "ERROR: unexpected key type in ${PUBKEY_FILE}" >&2
  exit 1
fi

if [[ "${TARGET_USER}" == "root" ]]; then
  HOME_DIR="/root"
else
  HOME_DIR="$(getent passwd "${TARGET_USER}" | cut -d: -f6)"
fi

if [[ -z "${HOME_DIR}" || ! -d "${HOME_DIR}" ]]; then
  echo "ERROR: cannot resolve home for user ${TARGET_USER}" >&2
  exit 1
fi

SSH_DIR="${HOME_DIR}/.ssh"
AUTH_KEYS="${SSH_DIR}/authorized_keys"

install -d -m 700 -o "${TARGET_USER}" -g "${TARGET_USER}" "${SSH_DIR}"
touch "${AUTH_KEYS}"
chmod 600 "${AUTH_KEYS}"
chown "${TARGET_USER}:${TARGET_USER}" "${AUTH_KEYS}"

if grep -qxF "${PUBKEY}" "${AUTH_KEYS}"; then
  echo "OK: key already present for ${TARGET_USER} (${AUTH_KEYS})"
  ssh-keygen -lf "${PUBKEY_FILE}"
  exit 0
fi

printf '%s\n' "${PUBKEY}" >> "${AUTH_KEYS}"
echo "OK: installed cursor-cloud-agent-nexify-vps for ${TARGET_USER}"
ssh-keygen -lf "${PUBKEY_FILE}"
