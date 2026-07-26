# Evidence — Connection Fabric Takeover 2026-07-25

## Verified live
- WireGuard peer pcour: handshake + transfer OK (endpoint CGNAT)
- SSH :22/:2222 OK; agent + PC keys in authorized_keys
- sshd: PasswordAuthentication no (`50-nexify-admin.conf`)
- Agent key: `/etc/nexify/ssh/cursor_cloud_agent_ed25519` (fingerprint SHA256:XEGs9hld…)
- Helper: `nexify-vpn-status`

## Not done (needs Freigabe / Dashboard)
- VPS reboot (`/var/run/reboot-required`) — **not executed**
- Cloudflare published SSH `ssh.nexifyai.cloud` — token tunnel → Dashboard only

## Repo
- `deploy/ssh/windows-ssh-config.example`
- `deploy/ssh/CLOUDFLARE_SSH_PUBLISH.md`
- Register + SHARED_AGENT_STATE → operational
