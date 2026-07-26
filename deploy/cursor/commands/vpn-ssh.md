# /vpn-ssh

WireGuard-VPN und SSH zum Hostinger-VPS (NeXify) einrichten, prüfen, dokumentieren.

## Goal

Zuverlässiger Admin-Zugang: VPN `10.66.66.0/24` (UDP/443) + SSH Key-only, ohne Passwort-Auth.

## Common Files / Depends

- `docs/architecture/CONNECTION_FABRIC_V1.md` (falls vorhanden)
- `deploy/vpn/` / Windows SSH-Beispielconfigs
- VPS: `/etc/wireguard/wg0.conf`, `nexify-vpn-status`
- Keys: lokal `~/.ssh/nexify_vps_pc_ed25519`; VPS agent key unter `/etc/nexify/ssh/`
- Host: `10.66.66.1` (VPN) oder Public IP nur wenn nötig

## Suggested Sequence

1. Status: `ping 10.66.66.1` / `nexify-vpn-status` / `wg show`.
2. Windows: WireGuard-Autostart + SSH `Host nexify-vps` → `10.66.66.1`.
3. SSH: Key-Auth; `PasswordAuthentication no` belassen.
4. AppArmor: `wg`/`wg-quick` ggf. complain-mode (Ubuntu).
5. Reboot nur nach **expliziter Freigabe** (`/governance-f32`).
6. Docs/Evidence aktualisieren — keine Private Keys committen.

## Pitfalls

- Carrier blockiert oft TCP/22; VPN UDP/443 ist der stabile Weg.
- `ssh.socket` Overrides können SSH killen — vorsichtig patchen.
- Keys/Configs mit Secrets nicht ins Repo.
