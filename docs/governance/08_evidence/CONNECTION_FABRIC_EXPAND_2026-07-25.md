# Evidence — Connection Fabric Expand 2026-07-25

**Linear:** NEX-12  
**Branch:** `cursor/connection-fabric-vpn-9368`

## Done

- WireGuard on VPS (UDP/443, AppArmor complain) — installed in prior session
- MCP inventory via Cursor: Cloudflare, Vercel, Linear, Supabase, Neon, Resend, Sentry
- Linear issue NEX-12 created (P0 SSH recovery)
- Docs: `CONNECTION_FABRIC_V1.md`, VPN README, recovery script, register JSON

## Blocked

- Agent SSH still `Connection reset by peer` on :22/:2222 — needs Hostinger console recovery script
- Cloudflare SSH publish requires Dashboard (token tunnel; local config.yml inactive)
- Github / Gitlab / Slack MCP not usable (error / needsAuth)

## Probe (HTTPS via Tunnel)

webui 200 · ai-router 307 · agentmemory 200 · dashboard 200 · gitlab 302
