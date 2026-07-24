# SSH Hardening Evidence — Task 3
**Date:** 2026-06-23 00:08 CEST  
**VPS:** 72.62.152.47 (srv1243952)  
**Agent:** Security Agent (NeXify AI OS)

## Changes Applied

### /etc/ssh/sshd_config
| Setting | Before | After |
|---------|--------|-------|
| PermitRootLogin | yes | **no** |
| PasswordAuthentication | yes (via 50-cloud-init.conf) | **no** |
| PubkeyAuthentication | commented (default yes) | **yes** (explicit) |
| MaxAuthTries | commented (default 6) | **3** |
| LoginGraceTime | commented (default 2m) | **60** |

### /etc/ssh/sshd_config.d/50-cloud-init.conf
| Setting | Before | After |
|---------|--------|-------|
| PasswordAuthentication | yes | **no** |

## Safety Measures
- ✅ ubuntu user verified with SSH key access + sudo NOPASSWD
- ✅ hermes-nexify@container SSH key added to ubuntu's authorized_keys
- ✅ sshd config validated with `sshd -t` before restart
- ✅ Backup: /etc/ssh/sshd_config.bak on VPS
- ✅ Local SSH config updated to use ubuntu user instead of root

## Login Tests
- ✅ Root login: DENIED (Permission denied publickey)
- ✅ Ubuntu login: SUCCESS with sudo to root

## Evidence Files
- `sshd_config_BEFORE.txt` — full config before changes
- `sshd_config_AFTER.txt` — full config after changes
- `ssh_settings_BEFORE.txt` — relevant settings before
- `ssh_settings_AFTER.txt` — relevant settings after
- `sshd_status.txt` — systemd status
- `ssh_login_test.txt` — login test results
- `ssh_hardening_summary.md` — this file

## Local SSH Config Update
Updated `~/.ssh/config` Host vps to use User ubuntu instead of User root.
