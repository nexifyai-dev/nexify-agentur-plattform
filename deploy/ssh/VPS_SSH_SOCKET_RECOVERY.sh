#!/usr/bin/env bash
# FILE: /deploy/ssh/VPS_SSH_SOCKET_RECOVERY.sh
# NIR: 25.07.2026 08:10
# UPDATED: 25.07.2026 08:10
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Hostinger-Konsole Paste — repariert ssh.socket nach Port-2222-Override.
# WHY: kex_exchange_identification reset nach fehlerhaftem ListenStream-Override.
# BEST-PRACTICE: Nur Port 22 via Default-Socket; Alt-Port erst nach stabiler Baseline.
# PITFALL: V-SSH-01: ssh.socket.d Override nicht halb-leer lassen.
# DEPENDS: Hostinger Browser Console als root
# DOCS-REF: docs/architecture/CONNECTION_FABRIC_V1.md · Linear NEX-12
# SESSION: bc-d485860d-ad48-4c90-9109-ca221d3b9368
#
# Usage: paste entire script into Hostinger VPS browser console.

set -euo pipefail

echo "==> Remove broken ssh.socket override"
rm -f /etc/systemd/system/ssh.socket.d/override.conf
rmdir /etc/systemd/system/ssh.socket.d 2>/dev/null || true

echo "==> Reload + restart SSH"
systemctl daemon-reload
systemctl restart ssh.socket
systemctl restart ssh
sshd -t

echo "==> Listeners"
ss -tlnp | grep -E ':22|:2222' || true

echo "==> WireGuard"
systemctl is-active wg-quick@wg0 || true
wg show || true
ss -ulnp | grep ':443' || true

echo "==> Ensure PC pubkey present"
mkdir -p /root/.ssh
chmod 700 /root/.ssh
PUB='ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIDwC494y9895x5SOydMcOOw7Jp3fq63MPPqJM2Ewrp/E nexify-pc@20260725@nexify-vps'
grep -q 'nexify-pc@20260725' /root/.ssh/authorized_keys 2>/dev/null || echo "$PUB" >> /root/.ssh/authorized_keys
chmod 600 /root/.ssh/authorized_keys

echo "==> AppArmor wg complain (Ubuntu 26)"
if command -v aa-complain >/dev/null; then
  aa-complain /etc/apparmor.d/wg-quick 2>/dev/null || true
  aa-complain /etc/apparmor.d/wg 2>/dev/null || true
fi

echo "DONE — from PC/agent: ssh -i <key> root@72.62.152.47"
echo "VPN: import /root/vpn-clients/pcour-windows.conf then ssh root@10.66.66.1"
