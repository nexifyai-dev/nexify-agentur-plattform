# FILE: /deploy/ssh/README.md
# NIR: 25.07.2026 01:45
# UPDATED: 25.07.2026 01:45
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Inventory of SSH public keys used for VPS / cloud-agent access.
# WHY: Public keys are safe to version; private keys stay in secrets only.
# BEST-PRACTICE: Store only `.pub` files in git; install via Hostinger console while SSH is blocked.
# PITFALL: V-01: Never commit private keys (`*.pem`, `*.key`, OpenSSH private key blobs).
# DEPENDS: VPS `72.62.152.47` / `srv1243952.hstgr.cloud`, user `root` or `ubuntu`
# DOCS-REF: /memory/VPS_INFRA.md
# SESSION: bc-d485860d-ad48-4c90-9109-ca221d3b9368

## Keys

| File | Comment | Fingerprint (SHA256) | Purpose |
|------|---------|----------------------|---------|
| `cursor-cloud-agent-nexify-vps.pub` | `cursor-cloud-agent-nexify-vps` | `SHA256:neGig+3ebWoBuJx4un1BlXPTz2WZHE89/pg6dni+hn8` | Cursor Cloud Agent → NeXify VPS |

## Install on VPS (while C-07 blocks remote SSH)

The repo script is **not** on the VPS unless you cloned the repo. Prefer this Hostinger console paste (as `root`):

```bash
install -d -m 700 /root/.ssh
PUB='ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIAwSGLR7qw3CM21KlW0ZtFOt6l2LgAAefnrYLN3y+2+K cursor-cloud-agent-nexify-vps'
grep -qxF "$PUB" /root/.ssh/authorized_keys 2>/dev/null || echo "$PUB" >> /root/.ssh/authorized_keys
chmod 600 /root/.ssh/authorized_keys
grep cursor-cloud-agent-nexify-vps /root/.ssh/authorized_keys
```

If the repo is already checked out on the VPS:

```bash
cd /path/to/nexify-agentur-plattform
bash scripts/install-cursor-cloud-agent-ssh-key.sh
```

No reboot required for `authorized_keys` (kernel “Neustart erforderlich” is unrelated).

## Agent-side private key

The matching **private** key must be available only as a secret (Cursor environment / GitHub Actions), never in git:

- Suggested secret name: `VPS_SSH_KEY` or `CURSOR_CLOUD_AGENT_VPS_SSH_KEY`
- Agent path after inject: `~/.ssh/cursor-cloud-agent-nexify-vps` (mode `600`)

## Current host key (ED25519)

```
72.62.152.47 ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAID75SWQrbHF24KPgphTDczVnUJU4fvlDAqF6rkONl+gv
```
