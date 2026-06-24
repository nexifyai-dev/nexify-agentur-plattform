# Wartungshandbuch NeXify AI OS — Aktualisiert
## nach DIN 31051 / ISO 13306

**Dokumentennummer:** NX-WART-001  
**Version:** 2.0 (Aktualisiert)  
**Datum:** 2026-06-23  
**Status:** Aktualisiert — Qualitätsaudit-Q3  
**Vorgängerversion:** 1.0 (2026-06-23)  
**Nächste Überprüfung:** 2026-09-23

---

## Änderungshistorie

| Version | Datum | Autor | Änderung |
|---------|-------|-------|----------|
| 1.0 | 2026-06-23 | NeXify Systemmaster | Erstversion |
| 2.0 | 2026-06-23 | Quality Agent | Aktuelle Wartungsverfahren, Update-Verfahren, Troubleshooting-Verfahren, Performance-Integration |

---

## 1. Einführung

### 1.1 Zweck
Dieses Wartungshandbuch beschreibt die **aktuellen** Wartungsverfahren für das NeXify AI OS zur Sicherstellung der Systemverfügbarkeit und -performance.

### 1.2 Zielgruppe
- Systemadministratoren
- DevOps-Ingenieure
- Datenbankadministratoren
- Wartungstechniker
- AI-Agenten (autonome Wartung)

### 1.3 Normative Referenzen
- DIN 31051 (Grundlagen der Instandhaltung)
- ISO 13306 (Instandhaltung - Begriffe)
- ITIL 4 (Service Operations)
- ISO 25010 (Softwarequalität)

---

## 2. Wartungsarten

### 2.1 Übersicht

| Art | Beschreibung | Frequenz | Verantwortlich | Automatisierung |
|-----|--------------|----------|----------------|-----------------|
| Präventiv | Vorbeugende Wartung | Geplant | Ops | Teilweise |
| Korrektiv | Fehlerbehebung | Bei Bedarf | Ops/Dev | Manuell |
| Adaptiv | Anpassung an Änderungen | Bei Bedarf | DevOps | Manuell |
| Perfektiv | Verbesserung | Geplant | DevOps | Manuell |

### 2.2 Aktueller Wartungsplan

| Komponente | Art | Frequenz | Dauer | Fenster | Script |
|------------|-----|----------|-------|---------|--------|
| Betriebssystem | Präventiv | Monatlich | 2h | So 02:00 | `apt update && apt upgrade` |
| Docker | Präventiv | Monatlich | 1h | So 02:00 | `docker system prune` |
| MongoDB | Präventiv | Wöchentlich | 1h | So 03:00 | `mongo-maintenance.sh` |
| Redis | Präventiv | Monatlich | 30 Min | So 03:00 | `redis-cli BGREWRITEAOF` |
| Qdrant | Präventiv | Monatlich | 30 Min | So 03:00 | Qdrant Defrag API |
| Brain API | Präventiv | Wöchentlich | 15 Min | So 04:00 | Brain Sync |
| Anwendung | Adaptiv | Bei Bedarf | Variabel | So 02:00 | Git + Deploy |
| Abhängigkeiten | Präventiv | Wöchentlich | 1h | So 04:00 | `npm audit` / `pip audit` |

---

## 3. System-Wartung (Aktualisiert)

### 3.1 Betriebssystem

#### 3.1.1 Updates
```bash
# Debian/Ubuntu
sudo apt update && sudo apt upgrade -y

# Kernel-Update erfordert Reboot
sudo reboot

# Verifikation nach Reboot
uname -r
systemctl list-units --state=failed
```

#### 3.1.2 Bereinigung
```bash
# Alte Pakete entfernen
sudo apt autoremove -y
sudo apt clean

# Logs rotieren
sudo logrotate -f /etc/logrotate.conf

# Temp-Dateien löschen
sudo find /tmp -type f -atime +7 -delete

# Docker bereinigen
docker system prune -f
docker volume prune -f
```

#### 3.1.3 Festplatten-Management
```bash
# Auslastung prüfen
df -h

# Inodes prüfen
df -i

# Große Dateien finden
find / -type f -size +100M 2>/dev/null | head -20

# Logs archivieren
tar -czf /archive/logs-$(date +%Y%m%d).tar.gz /var/log/
```

### 3.2 Docker

#### 3.2.1 Container-Wartung
```bash
# Alle Container prüfen
docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Image}}"

# Container-Ressourcen prüfen
docker stats --no-stream

# Ungenutzte Images bereinigen
docker image prune -a --filter "until=168h"

# Ungenutzte Volumes bereinigen
docker volume prune -f

# Netzwerk bereinigen
docker network prune -f
```

#### 3.2.2 Docker-Updates
```bash
# Docker Engine aktualisieren
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io

# Docker Compose aktualisieren
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 3.3 Systemd Services

#### 3.3.1 Brain API Service
```bash
# Status prüfen
systemctl status nexify-brain.service

# Logs prüfen
journalctl -u nexify-brain.service -f

# Service restarten
sudo systemctl restart nexify-brain.service

# Service aktivieren
sudo systemctl enable nexify-brain.service
```

#### 3.3.2 Headroom Service
```bash
# Status prüfen
systemctl status nexify-headroom.service

# Logs prüfen
journalctl -u nexify-headroom.service --since "1 hour ago"
```

---

## 4. Datenbank-Wartung (Aktualisiert)

### 4.1 MongoDB

#### 4.1.1 Regelmäßige Wartung
```bash
# Server Status
mongosh --eval "db.serverStatus()"

# Replikation Status (wenn ReplicaSet)
mongosh --eval "rs.status()"

# Datenbank-Statistiken
mongosh --eval "db.stats()"

# Collection-Statistiken
mongosh --eval "db.getCollectionNames().forEach(function(c) { print(c + ': ' + db[c].countDocuments({}) + ' docs'); })"
```

#### 4.1.2 Performance-Checks
```bash
# Langsame Queries (Profiling)
mongosh --eval "db.setProfilingLevel(1, { slowms: 100 })"
mongosh --eval "db.system.profile.find().sort({ts:-1}).limit(10)"

# Index-Nutzung prüfen
mongosh --eval "db.collection.aggregate([{$indexStats:{}}])"

# Aktuelle Operationen
mongosh --eval "db.currentOp()"
```

#### 4.1.3 Speicherplatz-Management
```bash
# Collection-Größen prüfen
mongosh --eval "db.getCollectionNames().forEach(function(c) { 
  var stats = db[c].stats(); 
  print(c + ': ' + (stats.size / 1024 / 1024).toFixed(2) + ' MB'); 
})"

# Compact (wenn nötig)
mongosh --eval "db.runCommand({compact: 'collection_name'})"

# Repair (wenn nötig)
mongosh --eval "db.repairDatabase()"
```

#### 4.1.4 Backup
```bash
# Backup erstellen
mongodump --out /backup/mongo/nexify-$(date +%Y%m%d)

# Backup verifizieren
ls -la /backup/mongo/nexify-$(date +%Y%m%d)/

# Restore testen
mongorestore --db nexify_test /backup/mongo/nexify-$(date +%Y%m%d)/nexify/
```

### 4.2 Redis

#### 4.2.1 Wartung
```bash
# Memory-Usage prüfen
redis-cli INFO memory

# Keys analysieren
redis-cli --bigkeys

# AOF Rewrite
redis-cli BGREWRITEAOF

# RDB Snapshot
redis-cli BGSAVE
```

#### 4.2.2 Performance
```bash
# Slow Log prüfen
redis-cli SLOWLOG GET 10

# Latenz messen
redis-cli --latency-history

# Clients prüfen
redis-cli CLIENT LIST
```

### 4.3 Qdrant

#### 4.3.1 Wartung
```bash
# Health Check
curl -s http://127.0.0.1:6333/healthz

# Collections auflisten
curl -s http://127.0.0.1:6333/collections | jq .

# Collection-Details
curl -s http://127.0.0.1:6333/collections/{collection_name} | jq .

# Cluster-Status
curl -s http://127.0.0.1:6333/cluster | jq .
```

#### 4.3.2 Performance
```bash
# Collection-Optimierung (Defrag)
curl -X POST http://127.0.0.1:6333/collections/{collection_name}/index -H 'Content-Type: application/json' -d '{"field_name": "vector", "field_schema": "float"}'

# Snapshot erstellen
curl -X POST http://127.0.0.1:6333/collections/{collection_name}/snapshots
```

#### 4.3.3 Backup
```bash
# Snapshot erstellen
curl -X POST http://127.0.0.1:6333/collections/{collection_name}/snapshots

# Snapshot herunterladen
curl -O http://127.0.0.1:6333/collections/{collection_name}/snapshots/{snapshot_name}
```

---

## 5. Anwendungs-Wartung (Aktualisiert)

### 5.1 Abhängigkeiten

#### 5.1.1 Node.js Packages
```bash
# Veraltete Packages prüfen
npm outdated

# Sicherheitslücken prüfen
npm audit

# Updates durchführen
npm update

# Major Updates (vorsichtig)
npm install package@latest
```

#### 5.1.2 Python Packages
```bash
# Veraltete Packages prüfen
pip list --outdated

# Sicherheitslücken prüfen
pip audit

# Updates durchführen
pip install --upgrade package-name
```

#### 5.1.3 Container Images
```bash
# Images aktualisieren
docker pull nexify/api:latest

# Images bereinigen
docker image prune -a --filter "until=168h"

# Image-Größen prüfen
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"
```

### 5.2 Konfigurations-Management
```bash
# Config validieren
python -m nexify.config.validate

# Config backup
cp /etc/nexify/config.yaml /backup/config-$(date +%Y%m%d).yaml

# Git-basiertes Config-Management
cd /workspace/nexify
git status
git diff
```

### 5.3 Skills-System Wartung
```bash
# Skills auflisten
ls -la ~/.hermes/skills/

# Skills-Definitionen prüfen
cat ~/.hermes/skills/*/skill.json

# Skills-Cache leeren
rm -rf ~/.hermes/.cache/skills/
```

---

## 6. Update-Verfahren (Neu)

### 6.1 System-Updates

#### 6.1.1 Minor Updates (Patch)
```bash
# 1. Backup erstellen
mongodump --out /backup/mongo/pre-update-$(date +%Y%m%d)

# 2. Image aktualisieren
docker pull nexify/api:latest

# 3. Container aktualisieren
docker stop nexify-api
docker rm nexify-api
docker run -d --name nexify-api ...

# 4. Verifikation
curl -s http://localhost:8000/health

# 5. Rollback bei Problemen
docker run -d --name nexify-api nexify/api:previous
```

#### 6.1.2 Major Updates
```bash
# 1. Vollständiges Backup
mongodump --out /backup/mongo/pre-major-update-$(date +%Y%m%d)
redis-cli BGSAVE
curl -X POST http://127.0.0.1:6333/collections/{name}/snapshots

# 2. Staging-Environment testen
docker-compose -f docker-compose.staging.yml up -d

# 3. Tests durchführen
npm test
python -m pytest

# 4. Production deployen
docker-compose -f docker-compose.prod.yml up -d

# 5. Verifikation
curl -s http://localhost:8000/health
```

### 6.2 Datenbank-Updates

#### 6.2.1 MongoDB Update
```bash
# 1. Backup
mongodump --out /backup/mongo/pre-update-$(date +%Y%m%d)

# 2. Feature Compatibility prüfen
mongosh --eval "db.adminCommand({getParameter: 1, featureCompatibilityVersion: 1})"

# 3. Binary aktualisieren
sudo systemctl stop mongod
# Binary ersetzen
sudo systemctl start mongod

# 4. Feature Compatibility aktualisieren
mongosh --eval "db.adminCommand({setFeatureCompatibilityVersion: '7.0'})"

# 5. Verifikation
mongosh --eval "db.serverStatus().version"
```

#### 6.2.2 Redis Update
```bash
# 1. RDB Snapshot
redis-cli BGSAVE

# 2. AOF Backup
cp /var/lib/redis/appendonly.aof /backup/redis/

# 3. Redis aktualisieren
sudo systemctl stop redis
# Binary ersetzen
sudo systemctl start redis

# 4. Verifikation
redis-cli INFO server | grep redis_version
```

---

## 7. Monitoring-Wartung (Aktualisiert)

### 7.1 Prometheus
```bash
# Daten kompaktieren
curl -X POST http://localhost:9090/api/v1/admin/tsdb/clean_tombstones

# Storage prüfen
du -sh /var/lib/prometheus/

# Rules reload
curl -X POST http://localhost:9090/-/reload

# Targets prüfen
curl -s http://localhost:9090/api/v1/targets | jq '.data.activeTargets[] | {job: .labels.job, health: .health}'
```

### 7.2 Grafana
```bash
# Dashboard-Liste
curl -s http://localhost:3000/api/search | jq .

# Datenquellen prüfen
curl -s http://localhost:3000/api/datasources | jq .
```

### 7.3 Alertmanager
```bash
# Aktive Alerts prüfen
curl -s http://localhost:9093/api/v2/alerts | jq .

# Silences prüfen
curl -s http://localhost:9093/api/v2/silences | jq .
```

---

## 8. Zertifikats-Management

### 8.1 SSL/TLS Zertifikate

```bash
# Zertifikate prüfen
openssl x509 -in /etc/ssl/nexify.crt -noout -dates

# Let's Encrypt erneuern
certbot renew --dry-run
certbot renew

# Cloudflare Tunnel-Zertifikat prüfen
cloudflared tunnel info <tunnel-name>
```

### 8.2 API Keys Rotation
```bash
# Neuen Key generieren
openssl rand -hex 32

# Key in Vault speichern
# (HashiCorp Vault oder sichere Ablage)

# Services neu deployen
docker restart nexify-api
```

---

## 9. Troubleshooting-Verfahren (Neu)

### 9.1 Brain API Probleme

#### Symptom: Brain API nicht erreichbar
```bash
# 1. Service-Status prüfen
systemctl status nexify-brain.service

# 2. Logs prüfen
journalctl -u nexify-brain.service --since "10 minutes ago"

# 3. Port prüfen
ss -tlnp | grep 9090

# 4. Service restarten
sudo systemctl restart nexify-brain.service

# 5. Verifikation
curl -s http://127.0.0.1:9090/health
```

#### Symptom: Brain API langsam
```bash
# 1. Einträge prüfen
curl -s http://127.0.0.1:9090/api/stats | jq .entries

# 2. Memory prüfen
ps aux | grep brain

# 3. Logs prüfen auf Timeouts
journalctl -u nexify-brain.service | grep -i "timeout\|slow"
```

### 9.2 Qdrant Probleme

#### Symptom: Qdrant nicht erreichbar
```bash
# 1. Container-Status prüfen
docker ps | grep qdrant

# 2. Logs prüfen
docker logs --tail 50 qdrant

# 3. Port prüfen
ss -tlnp | grep 6333

# 4. Container restarten
docker restart qdrant

# 5. Verifikation
curl -s http://127.0.0.1:6333/healthz
```

#### Symptom: Qdrant Queries langsam
```bash
# 1. Collection-Größe prüfen
curl -s http://127.0.0.1:6333/collections/{name} | jq .result.points_count

# 2. Index prüfen
curl -s http://127.0.0.1:6333/collections/{name}/index | jq .

# 3. Defrag durchführen
curl -X POST http://127.0.0.1:6333/collections/{name}/index
```

### 9.3 MongoDB Probleme

#### Symptom: MongoDB nicht erreichbar
```bash
# 1. Service-Status prüfen
systemctl status mongod

# 2. Logs prüfen
journalctl -u mongod --since "10 minutes ago"

# 3. Port prüfen
ss -tlnp | grep 27017

# 4. Reparatur (wenn nötig)
mongod --repair

# 5. Service starten
sudo systemctl start mongod
```

#### Symptom: MongoDB langsam
```bash
# 1. Aktuelle Operationen prüfen
mongosh --eval "db.currentOp()"

# 2. Locks prüfen
mongosh --eval "db.serverStatus().locks"

# 3. Profiling aktivieren
mongosh --eval "db.setProfilingLevel(1, { slowms: 100 })"

# 4. Langsame Queries prüfen
mongosh --eval "db.system.profile.find().sort({ts:-1}).limit(10)"
```

### 9.4 Redis Probleme

#### Symptom: Redis nicht erreichbar
```bash
# 1. Service-Status prüfen
systemctl status redis

# 2. Logs prüfen
journalctl -u redis --since "10 minutes ago"

# 3. Port prüfen
ss -tlnp | grep 6379

# 4. Service starten
sudo systemctl start redis
```

#### Symptom: Redis Memory voll
```bash
# 1. Memory prüfen
redis-cli INFO memory

# 2. Keys prüfen
redis-cli DBSIZE

# 3. Eviction Policy prüfen
redis-cli CONFIG GET maxmemory-policy

# 4. Max Memory erhöhen (wenn möglich)
redis-cli CONFIG SET maxmemory 8gb
```

### 9.5 Docker Probleme

#### Symptom: Container startet nicht
```bash
# 1. Container-Status prüfen
docker ps -a | grep <container>

# 2. Logs prüfen
docker logs --tail 100 <container>

# 3. Ressourcen prüfen
docker stats --no-stream

# 4. Image prüfen
docker inspect <container> | jq .[0].State

# 5. Container neu erstellen
docker rm <container>
docker run -d --name <container> ...
```

#### Symptom: Disk voll
```bash
# 1. Docker-Ressourcen prüfen
docker system df

# 2. Ungenutzte Ressourcen bereinigen
docker system prune -a -f

# 3. Volumes bereinigen
docker volume prune -f

# 4. Images bereinigen
docker image prune -a --filter "until=168h"
```

### 9.6 Performance-Probleme

#### Symptom: Hohe Response Time
```bash
# 1. Metriken prüfen
curl -s http://localhost:9090/api/v1/query?query=http_request_duration_seconds

# 2. CPU/Memory prüfen
top -bn1 | head -20
free -h

# 3. Disk I/O prüfen
iostat -x 1 3

# 4. Network prüfen
ss -s

# 5. Logs prüfen auf Errors
grep -i "error\|timeout" /var/log/nexify/*.log | tail -50
```

---

## 10. Checklisten (Aktualisiert)

### 10.1 Tägliche Checks
- [ ] System-Status: Alle Container laufen
- [ ] Brain API: Erreichbar und antwortet
- [ ] Qdrant: Erreichbar und Collections OK
- [ ] MongoDB: Erreichbar und Replikation OK
- [ ] Redis: Erreichbar und Memory OK
- [ ] Monitoring: Keine kritischen Alerts
- [ ] Backups: Erfolgreich abgeschlossen
- [ ] Logs: Keine ungewöhnlichen Fehler
- [ ] Performance: Innerhalb der SLAs (P95 < 200ms)

### 10.2 Wöchentliche Checks
- [ ] Security Patches: Aktuell
- [ ] Trivy Scan: Durchgeführt
- [ ] Zertifikate: Gültig
- [ ] Speicherplatz: Ausreichend
- [ ] Logs bereinigt
- [ ] Dependencies: Aktuell (npm audit, pip audit)
- [ ] Brain-Sync: Vollständig
- [ ] Qdrant-Index: Optimal

### 10.3 Monatliche Checks
- [ ] OS Updates: Installiert
- [ ] Docker: Aktualisiert
- [ ] MongoDB: Gewartet (Compact, Index)
- [ ] Redis: Gewartet (AOF Rewrite)
- [ ] Qdrant: Defragmentiert
- [ ] Backup-Restore: Getestet
- [ ] Security Scan: Durchgeführt
- [ ] Capacity Report: Erstellt
- [ ] ISO 27001 Status: Review
- [ ] Performance-Tests: Durchgeführt

---

**Erstellt von:** NeXify Quality Agent  
**Genehmigt von:** NeXify AI OS  
**Nächste Überprüfung:** 2026-09-23
