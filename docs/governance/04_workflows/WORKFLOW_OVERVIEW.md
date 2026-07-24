# 04_workflows — Dispatcher, Automation, Health-Workflows

> Referenziert aus GOVERNANCE.md. Workflows sind auf dem VPS deployed.
> Dieses Verzeichnis dokumentiert die Soll-Konfiguration.

## Workflow-Verzeichnis

| Workflow | Typ | Ort | Status |
|----------|-----|-----|--------|
| `nexify-tunnel-watchdog` | systemd timer (60s) | `/usr/local/bin/nexify-tunnel-watchdog.sh` | ✅ VPS |
| `nexify-ceo-worker` | systemd timer (10min) | `/usr/local/bin/nexify-ceo-worker.sh` | ✅ VPS |
| `agentmemory-watchdog` | systemd timer (5min) | VPS systemd | ✅ VPS |
| `nexify-mcp-brain` | systemd service | `/opt/nexify/mcp-servers/` | ✅ VPS |
| `nexify-mcp-memory` | systemd service | `/opt/nexify/mcp-servers/` | ✅ VPS |
| `nexify-mcp-qdrant` | systemd service | `/opt/nexify/mcp-servers/` | ✅ VPS |
| `hermes-gateway` | systemd service | `/etc/systemd/system/hermes-gateway.service` | ✅ VPS |
| `cloudflared-main` | systemd service | `/etc/systemd/system/cloudflared-main.service` | ✅ VPS |
| `mirror-to-gitlab` | GitHub Actions | `.github/workflows/mirror-to-gitlab.yml` | ⚠️ Secrets fehlen |
| `ci` | GitHub Actions | `.github/workflows/ci.yml` | ✅ |
| `deploy-vps` | GitHub Actions | `.github/workflows/deploy-vps.yml` | ⚠️ SSH-Key blockiert |
| `secret-scan` | GitHub Actions | `.github/workflows/secret-scan.yml` | ✅ |

## Cron-Referenzen

Siehe: `12_register/AUTOMATION_CRONREGISTER_V1.md` (auf VPS)

## Tunnel-Konflikt-Prävention

⚠️ KRITISCH: Nur EIN cloudflared-Service darf aktiv sein (cloudflared-main).
Legacy cloudflared.service ist gemaskt. Watchdog prüft alle 60s.

## Recovery-Prozedur

```bash
# Nach VPS-Reboot: Dienste in Reihenfolge starten
systemctl start cloudflared-main.service
sleep 5
systemctl start docker
systemctl start hermes-gateway.service
systemctl start nexify-mcp-brain.service nexify-mcp-memory.service nexify-mcp-qdrant.service
systemctl start agentmemory.service
systemctl start nexify-tunnel-watchdog.timer nexify-ceo-worker.timer
```
