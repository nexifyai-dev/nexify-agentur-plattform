# FILE: deploy/harness/cloudflare-tunnel.md
# NIR: 26.07.2026 16:00
# UPDATED: 26.07.2026 16:00
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI DevOps
# WHAT: Cloudflare Tunnel Konfigurationspatch für Harness Open Source
# WHY: Ergänzt cloudflared Tunnel-Config um harness.nexifyai.cloud → localhost:3101
# BEST-PRACTICE: Tunnel-Route nach Traefik leiten (Traefik macht TLS), nicht direkt zum Container.
# PITFALL: V-01: Harness SSH (Port 3022) kann nicht über Cloudflare Tunnel geroutet werden
#          → SSH direkt am Host gebunden (kein Tunnel nötig bei öffentlicher IP).
# DEPENDS: cloudflared.service aktiv, Tunnel-UUID in /etc/cloudflared/config.yml
# DOCS-REF: docs/architecture/HARNESS-INTEGRATION.md

# Cloudflare Tunnel — Konfigurationspatch für Harness

## Ausgangslage

Der bestehende `cloudflared`-Tunnel verbindet folgende Domains (korrigiert
gegen `memory/VPS_INFRA.md:54-55` — die ursprüngliche Version dieser Tabelle
nannte fälschlich `nexifyai.cloud` als Hermes-Ziel, das ist laut
`deploy/website-routes.yml` bzw. `memory/VPS_INFRA.md:21` die Website
[Vercel, nicht auf dem VPS]; außerdem widersprach der 9Router-Port dem in
`memory/VPS_INFRA.md:55` dokumentierten Wert — bitte vor Anwendung dieses
Patches gegen den tatsächlichen Tunnel-Ingress verifizieren):

| Domain | Ziel | Port |
|--------|------|------|
| webui.nexifyai.cloud / work.nexifyai.cloud | Hermes WebUI | 8787 |
| ai-router.nexifyai.cloud | 9Router | 20128 (laut memory/VPS_INFRA.md:55 — abweichend von einer früheren Version dieser Tabelle, die 32794 nannte; bitte verifizieren) |
| agentmemory.nexifyai.cloud | AgentMemory | 3111 |
| brain.nexifyai.cloud | Brain | 9090 |
| hermes-dash.nexifyai.cloud | **fehlt bisher** | siehe deploy/hermes-webui-cloudflare-ingress.md |

## Patch: harness.nexifyai.cloud hinzufügen

In `/etc/cloudflared/config.yml` (oder äquivalente Tunnel-Config) den folgenden Eintrag ergänzen:

```yaml
ingress:
  # ... bestehende Einträge ...

  # Harness Open Source — Git-Hosting & CI/CD
  - hostname: harness.nexifyai.cloud
    service: http://localhost:3101
    originRequest:
      noTLSVerify: false
      connectTimeout: 30s
      # Harness braucht lange Timeouts für Git-Push/Pull-Operationen
      proxyConnectHeader:
        X-Forwarded-Proto: ["https"]

  # Catch-all — immer am Ende
  - service: http_status:404
```

## Cloudflare Dashboard (alternative Methode)

1. Zero Trust → Networks → Tunnels → Tunnel auswählen
2. **Public Hostname** → **Add a public hostname**
3. Subdomain: `harness`, Domain: `nexifyai.cloud`
4. Service Type: `HTTP`, URL: `localhost:3101`
5. **Additional application settings** → HTTP Settings:
   - HTTP Host Header: `harness.nexifyai.cloud`

## SSH-Zugang (Gitness SSH)

SSH (Port 3022) ist direkt am Host gebunden und benötigt keinen Cloudflare Tunnel.
Nutzer können direkt per SSH klonen:

```bash
git clone ssh://git@<VPS-IP>:3022/<username>/<repo>.git
# oder mit SSH-Config:
# Host harness-nexify
#   HostName <VPS-IP>
#   Port 3022
#   User git
```

## DNS (Cloudflare)

| Typ | Name | Ziel | Proxy |
|-----|------|------|-------|
| CNAME | harness | <tunnel-id>.cfargotunnel.com | ✅ Proxied |
| A | harness | <VPS-IP> | ❌ DNS Only (für SSH-Fallback) |

## Apply

```bash
# Tunnel-Config neu laden (kein Neustart nötig):
sudo systemctl reload cloudflared

# Oder vollständiger Neustart:
sudo systemctl restart cloudflared

# Verifikation:
curl -sI https://harness.nexifyai.cloud/api/v1/system/health
```
