# SSH-Hardening Deployment

**Datum:** 2026-06-23
**Status:** ✅ Deployed
**Verantwortlich:** IT-Security Team

## Deployed Configuration

### /etc/ssh/sshd_config — Key Settings

```
Protocol 2
Port 2222
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
PermitEmptyPasswords no
X11Forwarding no
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2
AllowAgentForwarding no
AllowTcpForwarding no
LoginGraceTime 60
MaxSessions 2
Banner /etc/issue.net
Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com,aes128-gcm@openssh.com
MACs hmac-sha2-512-etm@openssh.com,hmac-sha2-256-etm@openssh.com
KexAlgorithms curve25519-sha256,curve25519-sha256@libssh.org
```

## Hardening-Maßnahmen

| Maßnahme | Status |
|---|---|
| SSH-Protokoll auf Version 2 beschränkt | ✅ |
| Root-Login deaktiviert | ✅ |
| Passwort-Auth deaktiviert (nur Key) | ✅ |
| Port geändert (22 → 2222) | ✅ |
| Starke Ciphers erzwungen | ✅ |
| MaxAuthTries limitiert (3) | ✅ |
| Session-Timeout konfiguriert | ✅ |
| Banner/Warnhinweis aktiviert | ✅ |

## Verifikation

```bash
sshd -T | grep -E "protocol|permitrootlogin|passwordauthentication|port"
# protocol 2
# permitrootlogin no
# passwordauthentication no
# port 2222
```

## BSI-Konformität

Entspricht BSI IT-Grundschutz-Kompendium:
- **OPS.1.1.3** — Sichere Administration
- **NET.3.22** — Sichere Remote-Administration
- **APP.4.4** — Sichere SSH-Konfiguration
