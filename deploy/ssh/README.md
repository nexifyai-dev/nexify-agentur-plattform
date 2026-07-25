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

Run via Hostinger VPS console / recovery shell:

```bash
bash scripts/install-cursor-cloud-agent-ssh-key.sh
# or manually:
install -d -m 700 /root/.ssh
grep -qxF "$(cat deploy/ssh/cursor-cloud-agent-nexify-vps.pub)" /root/.ssh/authorized_keys \
  || cat deploy/ssh/cursor-cloud-agent-nexify-vps.pub >> /root/.ssh/authorized_keys
chmod 600 /root/.ssh/authorized_keys
```

## Agent-side private key

The matching **private** key must be available only as a secret (Cursor environment / GitHub Actions), never in git:

- Suggested secret name: `VPS_SSH_KEY` or `CURSOR_CLOUD_AGENT_VPS_SSH_KEY`
- Agent path after inject: `~/.ssh/cursor-cloud-agent-nexify-vps` (mode `600`)

## Current host key (ED25519)

```
72.62.152.47 ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAID75SWQrbHF24KPgphTDczVnUJU4fvlDAqF6rkONl+gv
```
