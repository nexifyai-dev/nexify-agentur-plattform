# 9Router MITM Proxy — Setup

## Status ✅ LIVE
Stand: 2026-06-22 00:17 UTC

## Architektur

```
Antigravity IDE → DNS (cloudcode-pa.googleapis.com → 127.0.0.1)
                                       ↓
                                  Port 443
                                       ↓
                            iptables REDIRECT 443→8443
                                       ↓
                          9Router MITM Proxy (:8443)
                           - TLS Termination (MITM CA)
                           - Model-Mapping (aliases.json)
                           - Format-Translation (Antigravity/Copilot)
                                       ↓
                          9Router API (localhost:20128)
                           - Provider-Config
                           - Modell-Routing
                                       ↓
                             Modell (DeepSeek V4 Flash, ...)
```

## Komponenten

| Komponente | Host | Port | Status |
|------------|------|------|--------|
| 9Router | localhost | 20128 (Docker) | ✅ running |
| MITM Proxy | VPS (srv1243952) | 8443 | ✅ systemd active |
| iptables | VPS | 443→8443 REDIRECT | ✅ persistent |
| DNS | /etc/hosts | Antigravity/Copilot/Cursor → 127.0.0.1 | ✅ |
| Root CA | /root/.9router/mitm/rootCA.crt | Gültig bis 2036 | ✅ |

## Client-Setup (pro Rechner)

### 1. Root CA installieren

Die Root CA muss auf **jedem Client-Rechner** installiert werden, der Antigravity/Copilot über den MITM nutzen will.

#### macOS:
```bash
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain \
  /pfad/zu/MITM_ROOT_CA.crt
```

#### Linux (Ubuntu/Debian):
```bash
sudo cp MITM_ROOT_CA.crt /usr/local/share/ca-certificates/nexify-mitm.crt
sudo update-ca-certificates
```

#### Windows:
```powershell
Import-Certificate -FilePath "MITM_ROOT_CA.crt" -CertStoreLocation Cert:\LocalMachine\Root
```

### 2. DNS automatisch nutzen

DNS-Umleitung geschieht automatisch via /etc/hosts auf dem VPS. Für **lokale Client-Rechner** muss ebenfalls DNS gesetzt werden, wenn die IDE auf dem Client und nicht auf dem VPS läuft.

Füge in `/etc/hosts` des Clients:
```
<VPS_IP> daily-cloudcode-pa.googleapis.com
<VPS_IP> cloudcode-pa.googleapis.com
<VPS_IP> api.individual.githubcopilot.com
<VPS_IP> api2.cursor.sh
```

Oder verwende den MITM-Client-Proxy-Modus (Port 8443 → `https://api.individual.githubcopilot.com` via HTTP-Proxy).

## Getestete Szenarien

| Szenario | Format | Modell (angefragt) | Modell (geroutet) | Status |
|----------|--------|-------------------|-------------------|--------|
| Antigravity Gemini | `:generateContent` | `gemini-3.5-flash-low` | `nexifyai-combo-llm` (DeepSeek V4 Flash) | ✅ Streaming |
| GitHub Copilot | `/chat/completions` | `gpt-4o` | `nexifyai-combo-llm` (DeepSeek V4 Flash) | ✅ Non-Streaming |

## Model-Mapping (aliases.json)

`/root/.9router/mitm/aliases.json`:

```json
{
  "antigravity": {
    "gemini-3.5-flash-low": "nexifyai-combo-llm",
    "gemini-3-flash-agent": "nexifyai-combo-llm",
    "gemini-3.5-flash-extra-low": "nexifyai-combo-llm",
    "gemini-pro-agent": "nexifyai-combo-llm",
    "gemini-3.1-pro-low": "nexifyai-combo-llm",
    "claude-opus-4-6-thinking": "nexifyai-combo-llm",
    "claude-sonnet-4-6": "nexifyai-combo-llm",
    "gpt-oss-120b-medium": "nexifyai-combo-llm"
  },
  "copilot": {
    "gpt-5.4": "nexifyai-combo-llm",
    "gpt-5.4-mini": "nexifyai-combo-llm",
    "gpt-4o": "nexifyai-combo-llm",
    "claude-sonnet-4": "nexifyai-combo-llm"
  }
}
```

## Service-Management

```bash
# Status prüfen
systemctl status 9router-mitm.service

# Logs
journalctl -u 9router-mitm.service -f

# Restart
systemctl restart 9router-mitm.service

# Stop
systemctl stop 9router-mitm.service
```

## Troubleshooting

**Problem:** 401 Missing API key
→ ROUTER_API_KEY in systemd-Unit prüfen/setzen

**Problem:** Port 443 blockiert
→ iptables-Regel prüfen: `iptables -t nat -L OUTPUT -n -v | grep 443`

**Problem:** Zertifikatsfehler im Client
→ Root CA muss auf dem Client installiert sein

## Dateien

| Pfad | Zweck |
|------|-------|
| `/opt/9router-mitm/` | MITM-Proxy Quellcode |
| `/root/.9router/mitm/rootCA.key` | Root CA Private Key |
| `/root/.9router/mitm/rootCA.crt` | Root CA Zertifikat |
| `/root/.9router/mitm/aliases.json` | Model-Mapping |
| `/etc/systemd/system/9router-mitm.service` | Systemd Service |
| `/etc/iptables/rules.v4` | Persistente iptables-Regeln |
