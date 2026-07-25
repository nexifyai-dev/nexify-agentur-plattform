# FILE: /deploy/ssh/VPS-HOSTINGER.md
# NIR: 25.07.2026 01:50
# UPDATED: 25.07.2026 01:50
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Canonical Hostinger VPS identity for NeXify production host.
# WHY: Single source for hostname, IP, plan, and SSH target used by agents/CI.
# BEST-PRACTICE: Keep panel facts here; runtime inventory stays in docs/architecture.
# PITFALL: V-03: Do not store API tokens or private keys in this file.
# DEPENDS: Hostinger KVM 8 VM-ID 1243952
# DOCS-REF: /memory/VPS_INFRA.md, /deploy/ssh/README.md
# SESSION: bc-d485860d-ad48-4c90-9109-ca221d3b9368

## Panel snapshot (2026-07-25)

| Field | Value |
|-------|-------|
| Location | Germany – Frankfurt |
| OS | Ubuntu 26.04 |
| Hostname | `srv1243952.hstgr.cloud` |
| SSH user | `root` |
| IPv4 | `72.62.152.47` |
| Plan | KVM 8 |
| CPU | 8 cores |
| RAM | 32 GB |
| Disk | 400 GB |
| Bandwidth | 32 TB |
| Backup | Weekly |
| Plan expiry | 2026-07-27 |
| Auto-renewal | Enabled |

## Connectivity check (agent, 2026-07-25)

- TCP `:22` — open
- Banner — `SSH-2.0-OpenSSH_10.2p1 Ubuntu-2ubuntu3.5`
- Host key (ED25519) — `AAAAC3NzaC1lZDI1NTE5AAAAID75SWQrbHF24KPgphTDczVnUJU4fvlDAqF6rkONl+gv`
- Auth without agent private key — `Permission denied (publickey,password)`

## Unlock path

1. Hostinger console (as `root`) — paste (repo script is not in `/root` by default):

```bash
install -d -m 700 /root/.ssh
PUB='ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIAwSGLR7qw3CM21KlW0ZtFOt6l2LgAAefnrYLN3y+2+K cursor-cloud-agent-nexify-vps'
grep -qxF "$PUB" /root/.ssh/authorized_keys 2>/dev/null || echo "$PUB" >> /root/.ssh/authorized_keys
chmod 600 /root/.ssh/authorized_keys
grep cursor-cloud-agent-nexify-vps /root/.ssh/authorized_keys
```

2. Inject private key secret into Cursor/GitHub (`VPS_SSH_KEY`)
3. Connect: `ssh -i ~/.ssh/cursor-cloud-agent-nexify-vps root@72.62.152.47`
