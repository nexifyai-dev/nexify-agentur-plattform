# NeXify AI OS - OSS Deployment Runbook
# Schritt-für-Schritt Deployment aller OSS-Lösungen

**Erstellt:** 2026-06-23
**Agent:** OSS Agent
**Status:** ✅ Ready

---

## 1. Voraussetzungen

### 1.1 System-Anforderungen
| Ressource | Minimum | Empfohlen |
|-----------|---------|-----------|
| CPU | 4 Cores | 8 Cores |
| RAM | 8 GB | 16 GB |
| Disk | 50 GB | 100 GB SSD |
| OS | Ubuntu 22.04 LTS | Ubuntu 24.04 LTS |
| Docker | 24.x | 24.x+ |
| Docker Compose | 2.x | 2.x+ |

### 1.2 Netzwerk
- **Domains:** *.nexifyai.cloud (konfiguriert)
- **Ports:** 80, 443 (Traefik), 9090 (Prometheus), 3000 (Grafana)
- **DNS:** A-Records für alle Subdomains

### 1.3 Secrets (vorab erstellen)
```bash
# .env Datei erstellen
cat > /workspace/nexify/.env << 'EOF'
# Plausible
PLAUSIBLE_SECRET_KEY=<generieren>
PLAUSIBLE_TOTP_KEY=<generieren>

# BorgBackup
BORG_PASSPHRASE=<sicheres-passwort>

# Woodpecker CI
WOODPECKER_AGENT_SECRET=<generieren>
WOODPECKER_GITHUB_CLIENT=<github-oauth-client>
WOODPECKER_GITHUB_SECRET=<github-oauth-secret>

# Database
POSTGRES_PASSWORD=<sicheres-passwort>
MONGO_PASSWORD=<sicheres-passwort>
REDIS_PASSWORD=<sicheres-passwort>
EOF
```

---

## 2. Pre-Deployment Checks

### 2.1 Docker prüfen
```bash
docker --version
docker-compose --version
docker ps
```

### 2.2 Netzwerk erstellen
```bash
docker network create nexify-network
```

### 2.3 Verzeichnisse erstellen
```bash
mkdir -p /workspace/nexify/10_evidence/oss/config
mkdir -p /workspace/nexify/10_evidence/oss/logs
```

---

## 3. Deployment

### 3.1 Docker Compose starten
```bash
cd /workspace/nexify/10_evidence/oss

# Alle Services starten
docker-compose -f docker-compose.oss.yml up -d

# Status prüfen
docker-compose -f docker-compose.oss.yml ps

# Logs prüfen
docker-compose -f docker-compose.oss.yml logs -f
```

### 3.2 Einzeln deployen (falls Probleme)
```bash
# Infrastructure
docker-compose -f docker-compose.oss.yml up -d cockroachdb

# Monitoring
docker-compose -f docker-compose.oss.yml up -d uptime-kuma

# Security
docker-compose -f docker-compose.oss.yml up -d crowdsec

# Logging
docker-compose -f docker-compose.oss.yml up -d promtail

# Backup
docker-compose -f docker-compose.oss.yml up -d borg

# CI/CD
docker-compose -f docker-compose.oss.yml up -d woodpecker woodpecker-agent

# Analytics
docker-compose -f docker-compose.oss.yml up -d plausible matomo

# AI
docker-compose -f docker-compose.oss.yml up -d ollama

# Web
docker-compose -f docker-compose.oss.yml up -d caddy

# Container Runtime
docker-compose -f docker-compose.oss.yml up -d podman
```

---

## 4. Post-Deployment Verification

### 4.1 Container Status
```bash
# Alle Container prüfen
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Erwartete Container (32):
# - postgres, mongodb, redis, qdrant (L1)
# - trivy, fail2ban, crowdsec (L2)
# - prometheus, grafana, alertmanager, uptime-kuma (L3)
# - elk, loki, promtail (L4)
# - restic, borg (L5)
# - woodpecker, woodpecker-agent (L6)
# - traefik, caddy, plausible, matomo, ollama, podman, cockroachdb (L7)
```

### 4.2 Service Health Checks
```bash
# Uptime Kuma
curl -I https://status.nexifyai.cloud

# Plausible
curl -I https://analytics.nexifyai.cloud

# Matomo
curl -I https://matomo.nexifyai.cloud

# Woodpecker CI
curl -I https://ci.nexifyai.cloud

# CockroachDB
curl -I https://db.nexifyai.cloud

# Ollama
curl http://localhost:11434/api/tags

# Caddy
curl -I https://web.nexifyai.cloud
```

### 4.3 Monitoring Verification
```bash
# Prometheus Targets
curl -s http://localhost:9090/api/v1/targets | jq '.data.activeTargets | length'

# Grafana Health
curl -s http://localhost:3000/api/health

# Loki Ready
curl -s http://localhost:3100/ready
```

### 4.4 Security Verification
```bash
# CrowdSec Status
docker exec crowdsec cscli decisions list
docker exec crowdsec cscli metrics

# Fail2Ban Status
docker exec fail2ban fail2ban-client status

# Trivy Scan
docker exec trivy trivy image --severity HIGH,CRITICAL alpine:latest
```

---

## 5. CI-Brand Konfiguration

### 5.1 Grafana Branding
```bash
# Logo hochladen
docker cp /workspace/nexify/assets/nexify-logo.svg grafana:/usr/share/grafana/public/img/

# Theme konfigurieren
curl -X POST http://admin:admin@localhost:3000/api/user/preferences \
  -H "Content-Type: application/json" \
  -d '{"theme":"dark","homeDashboardId":0,"timezone":"UTC"}'
```

### 5.2 Uptime Kuma Branding
```bash
# Status Page erstellen
# → https://status.nexifyai.cloud/settings
# → Logo hochladen
# → Custom CSS: NeXify Blue Theme
```

### 5.3 Plausible Branding
```bash
# → https://analytics.nexifyai.cloud/settings
# → Logo hochladen
# → Custom Domain konfiguriert
```

---

## 6. Troubleshooting

### 6.1 Container startet nicht
```bash
# Logs prüfen
docker-compose -f docker-compose.oss.yml logs <service>

# Container neustarten
docker-compose -f docker-compose.oss.yml restart <service>

# Volume berechtigungen prüfen
ls -la /var/lib/docker/volumes/
```

### 6.2 SSL-Probleme
```bash
# Traefik Logs
docker logs traefik 2>&1 | grep -i "acme\|certificate"

# Let's Encrypt Rate Limits prüfen
# → https://crt.sh/?q=nexifyai.cloud
```

### 6.3 Netzwerk-Probleme
```bash
# Netzwerk prüfen
docker network inspect nexify-network

# DNS prüfen
nslookup analytics.nexifyai.cloud
nslookup status.nexifyai.cloud
```

### 6.4 Performance-Probleme
```bash
# Ressourcen prüfen
docker stats --no-stream

# Disk Usage
docker system df

# Logs bereinigen
docker system prune -f
```

---

## 7. Backup & Restore

### 7.1 Backup erstellen
```bash
# BorgBackup
docker exec borg borg create /mnt/borg-repository::$(date +%Y%m%d) /source

# Restic
docker exec restic restic backup /data
```

### 7.2 Restore
```bash
# BorgBackup
docker exec borg borg extract /mnt/borg-repository::20260623

# Restic
docker exec restic restic restore latest --target /data
```

---

## 8. Update-Strategie

### 8.1 Einzelnes Update
```bash
# Image pullen
docker pull plausible/analytics:latest

# Container neu erstellen
docker-compose -f docker-compose.oss.yml up -d plausible
```

### 8.2 Alle Updates
```bash
# Alle Images pullen
docker-compose -f docker-compose.oss.yml pull

# Alle Container neu erstellen
docker-compose -f docker-compose.oss.yml up -d
```

### 8.3 Rollback
```bash
# Backup wiederherstellen
docker exec borg borg extract /mnt/borg-repository::$(date -d yesterday +%Y%m%d)

# Container neu starten
docker-compose -f docker-compose.oss.yml up -d
```

---

## 9. Monitoring Alerts

### 9.1 Standard Alerts
```yaml
groups:
  - name: nexify-oss
    rules:
      - alert: ContainerDown
        expr: up == 0
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Container {{ $labels.instance }} is down"

      - alert: HighCPU
        expr: 100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage on {{ $labels.instance }}"

      - alert: HighMemory
        expr: (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes * 100 > 85
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage on {{ $labels.instance }}"

      - alert: DiskSpaceLow
        expr: (node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"}) * 100 < 15
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Low disk space on {{ $labels.instance }}"
```

---

## 10. Dokumentation

### 10.1 Service README
Jeder Service hat eine README.md mit:
- Zweck
- Konfiguration
- Ports
- Dependencies
- Troubleshooting

### 10.2 Runbooks
- Backup/Restore Procedures
- Update Procedures
- Rollback Procedures
- Incident Response

---

## 11. Checkliste

### Pre-Deployment
- [ ] Docker installiert
- [ ] Netzwerk erstellt
- [ ] Secrets konfiguriert
- [ ] DNS konfiguriert
- [ ] Ports offen

### Deployment
- [ ] Docker Compose gestartet
- [ ] Alle Container laufen
- [ ] SSL funktioniert

### Post-Deployment
- [ ] Health Checks bestanden
- [ ] Monitoring aktiv
- [ ] Logging aktiv
- [ ] Backup konfiguriert
- [ ] CI-Brand angewendet

### Monitoring
- [ ] Prometheus Targets konfiguriert
- [ ] Grafana Dashboards erstellt
- [ ] Alertmanager konfiguriert
- [ ] Uptime Kuma Status Pages

---

**Stand:** 2026-06-23
**Agent:** OSS Agent
**Status:** ✅ Ready for Deployment
