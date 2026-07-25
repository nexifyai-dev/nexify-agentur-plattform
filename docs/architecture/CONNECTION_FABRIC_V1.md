# FILE: /docs/architecture/CONNECTION_FABRIC_V1.md
# NIR: 25.07.2026 08:10
# UPDATED: 25.07.2026 08:10
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Verbindungs-Fabric VPS ↔ Agent ↔ PC ↔ MCP-Cloud-Dienste.
# WHY: Hotspot blockiert TCP/22; SSH-Socket-Zwischenfall; MCP-Kanäle ausbauen.
# BEST-PRACTICE: Mehrere unabhängige Pfade (SSH, WG, CF Tunnel, MCP).
# PITFALL: V-CONN-01: Token-Tunnel ≠ lokale config.yml; V-SSH-01 Socket-Override.
# DEPENDS: Hostinger KVM, Cloudflare Tunnel, WireGuard, Cursor MCP
# DOCS-REF: deploy/vpn/README.md · Linear NEX-12
# SESSION: bc-d485860d-ad48-4c90-9109-ca221d3b9368

# Connection Fabric V1 — NeXify

## Status 2026-07-25

| Kanal | Status | Hinweis |
|-------|--------|---------|
| SSH `root@72.62.152.47:22` | 🔴 **DOWN** | TCP open, KEX reset — Recovery: `deploy/ssh/VPS_SSH_SOCKET_RECOVERY.sh` |
| SSH `:2222` | 🟡 unstable | Config vorhanden; Socket-Override hat Handshake zerstört |
| WireGuard UDP/443 | 🟢 installed | `wg0` `10.66.66.0/24` — Client `/root/vpn-clients/pcour-windows.conf` |
| Cloudflare HTTP Tunnel | 🟢 | Token-Service `cloudflared.service` — webui/ai-router/agentmemory/… |
| Cloudflare SSH publish | ⬜ TODO | Dashboard: Published App `ssh.nexifyai.cloud` → `ssh://localhost:22` |
| Cursor MCP (Cloud) | 🟢 partial | siehe Register unten |

Linear P0: [NEX-12](https://linear.app/nexifyai/issue/NEX-12/p0-vps-ssh-kex-reset-wireguard-up-restore-sshsocket)

## Pfad-Priorität (Agent / Admin)

```
1. WireGuard → ssh root@10.66.66.1          # nach Client-Import
2. Direct SSH :22 (wenn Carrier erlaubt)
3. Cloudflare Tunnel SSH hostname          # nach Publish (Hotspot/443-only)
4. Hostinger Browser Console               # Break-glass
```

## Live HTTPS (Cloudflare Tunnel) — Probe 2026-07-25

| Host | HTTP |
|------|------|
| webui.nexifyai.cloud | 200 |
| ai-router.nexifyai.cloud | 307 |
| agentmemory.nexifyai.cloud | 200 |
| dashboard.nexifyai.cloud | 200 |
| gitlab.nexifyai.cloud | 302 |

Hinweis: Laufender Tunnel ist **token-basiert** (`/etc/cloudflared/token`).  
Lokale Datei `/root/.cloudflared/config.yml` steuert diesen Prozess **nicht**.  
SSH-Publish daher im **Cloudflare Dashboard → Tunnels → Routes → Published application**.

## MCP Inventory (Cursor Cloud Agent)

| MCP | Status | Nutzen |
|-----|--------|--------|
| Cloudflare-bindings / docs / builds / observability | ready | Workers, Docs, Logs |
| Vercel | ready | Team Agentur — website, bookando-*, lv-ai, relays |
| Linear | ready | NEX-12 u. a. |
| Supabase | ready | opencarbox, bookando-api, NeXify Agentur-Webseite |
| Neon | ready | lv-ai, NeXifyAI-by-NeXify-automate-it |
| Resend | ready | Domain `nexifyai.cloud` verified |
| Sentry | ready | org `nexify-ai-by-nexify-chat-it-au` (de) |
| Clerk | ready | SDK snippets |
| Github | error | discovery failed |
| Gitlab | needsAuth | Auth fehlt |
| Greptile / Slack | error | discovery failed |

Cloudflare Workers gesehen: `nexifyai-login-redirect`, `cloudflare-relay`.

## Ausbau-Backlog (nach SSH-Recovery)

1. Paste Recovery-Script → Agent-SSH wieder grün
2. Hostinger Firewall **UDP 443**
3. PC WireGuard import → `ssh nexify-vps` via `10.66.66.1`
4. CF Dashboard: publish `ssh.nexifyai.cloud` → `ssh://localhost:22`
5. Separater Agent-SSH-Key (nicht PC-Key wiederverwenden)
6. Github/Gitlab/Slack MCP Auth reparieren
7. SHARED_AGENT_STATE `connection_fabric` aktuell halten
