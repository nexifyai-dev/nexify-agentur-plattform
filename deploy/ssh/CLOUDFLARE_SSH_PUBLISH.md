# Cloudflare Tunnel — publish SSH (Dashboard)

Live VPS tunnel is **token-managed** (`cloudflared.service` + `/etc/cloudflared/token`).
Editing `/root/.cloudflared/config.yml` does **not** change the live tunnel.

## Steps

1. [Cloudflare Dashboard → Tunnels](https://dash.cloudflare.com/?to=/:account/tunnels)
2. Open the active NeXify tunnel
3. **Routes** → **Add route** → **Published application**
4. Subdomain: `ssh` · Domain: `nexifyai.cloud`
5. Service URL: `ssh://localhost:22`
6. Save

## Client (Windows, after cloudflared install)

```
ssh -o ProxyCommand="cloudflared access ssh --hostname %h" root@ssh.nexifyai.cloud
```

Prefer WireGuard (`ssh nexify-vps` → `10.66.66.1`) for daily admin.
This path is the Hotspot/TCP-443-only fallback.
