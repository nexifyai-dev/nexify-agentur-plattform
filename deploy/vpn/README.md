# FILE: /deploy/vpn/README.md
# NIR: 25.07.2026 08:10
# UPDATED: 25.07.2026 08:10
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: WireGuard Admin-VPN + Client-Onboarding (ohne Secrets im Repo).
# WHY: Hotspot/Carrier blockiert TCP/22; UDP/443 WireGuard ist Bypass.
# BEST-PRACTICE: Keys nur auf VPS unter /etc/wireguard + /root/vpn-clients/.
# PITFALL: V-VPN-01: AppArmor wg-quick auf Ubuntu 26 braucht complain-mode.
# DEPENDS: Hostinger Firewall UDP/443; VPS wg-quick@wg0; SSH-Key PC
# DOCS-REF: docs/architecture/CONNECTION_FABRIC_V1.md
# SESSION: bc-d485860d-ad48-4c90-9109-ca221d3b9368

# NeXify Admin VPN (WireGuard)

| Feld | Wert |
|------|------|
| Server | `72.62.152.47` |
| Listen | **UDP/443** (`wg0`) |
| VPN-Netz | `10.66.66.0/24` |
| Server-IP | `10.66.66.1` |
| Client (pcour) | `10.66.66.2` |
| Client-Config auf VPS | `/root/vpn-clients/pcour-windows.conf` |
| Linear | [NEX-12](https://linear.app/nexifyai/issue/NEX-12/p0-vps-ssh-kex-reset-wireguard-up-restore-sshsocket) |

## Hostinger Firewall (Pflicht)

| Action | Proto | Port | Source |
|--------|-------|------|--------|
| accept | TCP | 22 | any |
| accept | TCP | 80 | any |
| accept | TCP | 443 | any |
| accept | **UDP** | **443** | any |
| accept | TCP | 2222 | any (optional) |

TCP 443 = Traefik/HTTPS · UDP 443 = WireGuard (kein Konflikt).

## Windows Client

1. [WireGuard for Windows](https://www.wireguard.com/install/) installieren
2. Nach SSH-Recovery Config holen:
   ```bash
   cat /root/vpn-clients/pcour-windows.conf
   ```
   Oder Template `wireguard-client.example.conf` mit echten Keys vom VPS füllen.
3. Tunnel aktivieren → SSH:
   ```powershell
   ssh -i $env:USERPROFILE\.ssh\nexify_vps_pc_ed25519 root@10.66.66.1
   ```

## VPS Wartung

```bash
systemctl status wg-quick@wg0
wg show
aa-status | grep wg   # expect complain mode for wg / wg-quick
```

## Nächster Ausbau

1. Cloudflare Tunnel Published App: `ssh.nexifyai.cloud` → `ssh://localhost:22` (Hotspot ohne UDP)
2. Zweiter Peer für Cursor Cloud Agent (separater Key, nicht PC-Key teilen)
3. Optional Tailscale als Fallback (DERP über HTTPS)
