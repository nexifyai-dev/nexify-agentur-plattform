# Betriebshandbuch NeXify AI OS — Aktualisiert
## nach ITIL / ISO 20000

**Dokumentennummer:** NX-OPS-001  
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
| 2.0 | 2026-06-23 | Quality Agent | Aktuelle Betriebsverfahren, Monitoring-Update, Backup-Update, Performance-Integration |

---

## 1. Einführung

### 1.1 Zweck
Dieses Betriebshandbuch beschreibt die **aktuellen** betrieblichen Verfahren und Prozesse für den laufenden Betrieb des NeXify AI OS.

### 1.2 Zielgruppe
- Operations-Team
- DevOps-Ingenieure
- On-Call Engineers
- Systemadministratoren
- AI-Agenten (autonome Operation)

### 1.3 Normative Referenzen
- ITIL 4 (IT Service Management)
- ISO/IEC 20000-1 (IT-Service-Management)
- ISO 27001 (Informationssicherheit)
- DIN EN ISO 9001:2015 (Qualitätsmanagementsysteme)

---

## 2. Aktuelle Betriebsverfahren

### 2.1 Morning Checklist (09:00)

| # | Aufgabe | Verantwortlich | Dauer | Befehl |
|---|---------|----------------|-------|--------|
| 1 | System-Status prüfen | On-Call | 5 Min | `docker ps --format "table {{.Names}}\t{{.Status}}"` |
| 2 | Brain API prüfen | On-Call | 2 Min | `curl -s http://127.0.0.1:9090/health` |
| 3 | Qdrant prüfen | On-Call | 2 Min | `curl -s http://127.0.0.1:6333/healthz` |
| 4 | Alerts reviewen | On-Call | 10 Min | Grafana Alertmanager UI |
| 5 | Backup-Status prüfen | Ops | 5 Min | `/workspace/nexify/07_tools_cli/autopilot/` |
| 6 | Performance-Metriken reviewen | Ops | 10 Min | Prometheus/Grafana Dashboards |
| 7 | Offene Tickets prüfen | Team Lead | 10 Min | `/workspace/nexify/08_kanban_tasks/` |
| 8 | Capacity-Planung | Ops | 5 Min | Kapazitätsberechnung NX-CAPA-001 |

### 2.2 Tägliche Betriebsabläufe

#### 2.2.1 Service-Gesundheit
```bash
# Alle Container prüfen
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Systemd-Services prüfen
systemctl status nexify-brain.service
systemctl status nexify-headroom.service

# Disk-Usage prüfen
df -h | grep -E "^/dev/"

# Memory prüfen
free -h
```

#### 2.2.2 Agenten-Betrieb
```bash
# Aktive Agenten prüfen
ls -la ~/.hermes/profiles/

# Brain-Einträge prüfen
curl -s http://127.0.0.1:9090/api/stats | jq .

# Qdrant Collections prüfen
curl -s http://127.0.0.1:6333/collections | jq .
```

### 2.3 Monitoring-Dashboards (Aktuell)

| Dashboard | URL | Zweck | Refresh |
|-----------|-----|-------|---------|
| System Overview | grafana.nexify.de/d/system | Gesamtübersicht | 30s |
| Application | grafana.nexify.de/d/app | Anwendungsmetriken | 15s |
| Database | grafana.nexify.de/d/db | MongoDB/Redis/Qdrant | 30s |
| Security | grafana.nexify.de/d/security | Sicherheitsereignisse | 60s |
| Capacity | grafana.nexify.de/d/capacity | Ressourcenauslastung | 60s |
| AI Agents | grafana.nexify.de/d/agents | Agent-Performance | 15s |

### 2.4 Regelmäßige Aufgaben

| Aufgabe | Frequenz | Verantwortlich | Script/Automatisierung |
|---------|----------|----------------|------------------------|
| Log-Rotation | Täglich | Automatisch | logrotate |
| Backup-Verifikation | Täglich | Ops | `verify-backup.sh` |
| Brain-Sync prüfen | Täglich | Automatisch | Brain API Health |
| Certificate Check | Wöchentlich | Ops | `check-certs.sh` |
| Dependency Update | Wöchentlich | DevOps | `update-deps.sh` |
| Security Scan (Trivy) | Wöchentlich | Security | `trivy-daily-scan-setup` |
| Capacity Report | Monatlich | Ops | `capacity-report.sh` |
| MongoDB Maintenance | Monatlich | DBA | `mongo-maintenance.sh` |
| Qdrant Defrag | Monatlich | DBA | `qdrant-defrag.sh` |

---

## 3. Incident Management

### 3.1 Incident-Klassifikation

| Priorität | Beschreibung | Response-Zeit | Resolution-Zeit | Beispiel |
|-----------|--------------|---------------|-----------------|----------|
| P1 - Kritisch | Totalausfall, Datenverlust | 15 Minuten | 4 Stunden | Brain API down, MongoDB Crash |
| P2 - Hoch | Service-Degradation | 30 Minuten | 8 Stunden | Hohe Latenz, Qdrant langsam |
| P3 - Mittel | Einzelfehler | 2 Stunden | 24 Stunden | Einzelner Agent defekt |
| P4 - Gering | Kosmetische Probleme | 8 Stunden | 72 Stunden | UI-Glitches |

### 3.2 Incident Response Prozess

```
Erkennung → Klassifikation → Eindämmung → Analyse → 
Behebung → Verifikation → Dokumentation → Review
```

### 3.3 Runbooks (Aktualisiert)

#### 3.3.1 Brain API Restart
```bash
# Brain API Status prüfen
systemctl status nexify-brain.service

# Brain API restarten
sudo systemctl restart nexify-brain.service

# Verifikation
curl -s http://127.0.0.1:9090/health | jq .
sleep 5
curl -s http://127.0.0.1:9090/api/stats | jq .entries
```

#### 3.3.2 Qdrant Restart
```bash
# Qdrant Status prüfen
docker ps | grep qdrant

# Qdrant restarten
docker restart qdrant

# Verifikation
curl -s http://127.0.0.1:6333/healthz
curl -s http://127.0.0.1:6333/collections | jq .
```

#### 3.3.3 MongoDB Wartung
```bash
# MongoDB Status
mongosh --eval "db.serverStatus()"

# Replication Status
mongosh --eval "rs.status()"

# Compact (wenn nötig)
mongosh --eval "db.runCommand({compact: 'collection_name'})"
```

#### 3.3.4 Redis Cache
```bash
# Memory-Usage prüfen
redis-cli INFO memory

# Cache leeren (nur wenn nötig)
redis-cli FLUSHDB

# Slow Log prüfen
redis-cli SLOWLOG GET 10
```

#### 3.3.5 Docker Container Management
```bash
# Alle Container prüfen
docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Image}}"

# Container-Logs prüfen
docker logs --tail 100 <container_name>

# Container neustarten
docker restart <container_name>

# Ungenutzte Ressourcen bereinigen
docker system prune -f
```

---

## 4. Deployment-Verfahren

### 4.1 Standard-Deployment

```bash
# 1. Image bauen (oder pullen)
docker build -t nexify/api:latest .
docker push nexify/api:latest

# 2. Container aktualisieren
docker pull nexify/api:latest
docker stop nexify-api
docker rm nexify-api
docker run -d --name nexify-api -p 8000:8000 nexify/api:latest

# 3. Verifikation
curl -s http://localhost:8000/health
```

### 4.2 Rollback-Verfahren

```bash
# Vorheriges Image wiederherstellen
docker pull nexify/api:previous
docker stop nexify-api
docker rm nexify-api
docker run -d --name nexify-api -p 8000:8000 nexify/api:previous

# Verifikation
curl -s http://localhost:8000/health
```

### 4.3 GitOps-Deployment
```bash
# Änderung in Git committen
git add .
git commit -m "fix: description"
git push origin main

# Autopilot-Trigger abwarten
cat /workspace/nexify/07_tools_cli/autopilot/execution-log.md
```

---

## 5. Backup und Recovery (Aktualisiert)

### 5.1 Backup-Übersicht (Aktuell)

| Komponente | Methode | Frequenz | Retention | Ort |
|------------|---------|----------|-----------|-----|
| MongoDB | mongodump | Täglich | 30 Tage | /backup/mongo/ |
| Redis | RDB + AOF | Alle 15 Min | 7 Tage | /backup/redis/ |
| Qdrant | Snapshot | Wöchentlich | 30 Tage | /backup/qdrant/ |
| Files | rsync | Täglich | 90 Tage | /backup/files/ |
| Config | Git | Bei Änderung | Unbegrenzt | Git-Repository |
| Brain | Export | Wöchentlich | 90 Tage | /backup/brain/ |

### 5.2 Backup-Kapazität (aus Berechnungen)

```
Aktuell:
  - Täglich: 5 GB
  - Wöchentlich: 50 GB
  - Monatlich: 200 GB
  - Gesamt: 1 TB

Prognose (12 Monate):
  - Täglich: 15 GB
  - Wöchentlich: 150 GB
  - Monatlich: 600 GB
  - Gesamt: 3 TB
```

### 5.3 Recovery-Verfahren

#### MongoDB Recovery
```bash
# Backup auflisten
ls -la /backup/mongo/

# Restore
mongorestore --db nexify /backup/mongo/nexify-$(date +%Y%m%d)/

# Verifikation
mongosh --eval "db.stats()"
```

#### Qdrant Recovery
```bash
# Snapshot wiederherstellen
curl -X POST http://127.0.0.1:6333/collections/{collection}/snapshots/{snapshot}/restore

# Verifikation
curl -s http://127.0.0.1:6333/collections | jq .
```

---

## 6. Sicherheitsbetrieb (Aktualisiert)

### 6.1 Regelmäßige Sicherheitsaufgaben

| Aufgabe | Frequenz | Verantwortlich | Status |
|---------|----------|----------------|--------|
| Security Patches | Wöchentlich | DevOps | ✅ Aktiv |
| Trivy Scan | Wöchentlich | Security | ✅ Automatisiert |
| Access Review | Monatlich | Security | ✅ Geplant |
| Penetration Test | Quartalsweise | Extern | ⚠️ Q3 2026 |
| SSH Hardening | Bei Bedarf | Ops | ✅ Implementiert |
| Fail2ban | Permanent | Automatisch | ✅ Aktiv |
| MongoDB Update | Monatlich | DBA | ✅ Aktuell (v7) |

### 6.2 Sicherheitskennzahlen (aus Berechnungen)

| Metrik | Aktuell | Ziel | Status |
|--------|---------|------|--------|
| ISO 27001 Controls | 93/114 (81,5%) | 100% | ⚠️ In Arbeit |
| Pen-Test Kritisch | 0 | 0 | ✅ OK |
| Pen-Test Hoch | 2 | 0 | ⚠️ In Behebung |
| Restrisiko DDoS | 3,6 (Niedrig) | < 5 | ✅ OK |
| Restrisiko Injection | 1,0 (Minimal) | < 2 | ✅ OK |

### 6.3 Security Incident Response
1. **Detection**: Trivy, Fail2ban, IDS/IPS, Log-Analyse
2. **Containment**: Betroffene Systeme isolieren
3. **Eradication**: Bedrohung entfernen
4. **Recovery**: Systeme wiederherstellen
5. **Lessons Learned**: Review und Verbesserung

---

## 7. Capacity Management (Aktualisiert)

### 7.1 Aktuelle Ressourcenauslastung

| Ressource | Aktuell | Maximum | Auslastung | Status |
|-----------|---------|---------|------------|--------|
| CPU | 8 Cores | 32 Cores | 25% | ✅ OK |
| Memory | 16 GB | 64 GB | 25% | ✅ OK |
| SSD (Hot) | 500 GB | 2 TB | 25% | ✅ OK |
| Bandwidth | 500 Mbps | 10 Gbps | 5% | ✅ OK |
| Brain Entries | 472 | Unbegrenzt | - | ✅ OK |
| Qdrant Collections | 4 | Unbegrenzt | - | ✅ OK |

### 7.2 Monitoring-Metriken (Alert-Schwellen)

| Metrik | Alert-Schwelle | Aktion |
|--------|----------------|--------|
| CPU | > 85% | Scale Up |
| Memory | > 90% | Scale Up |
| Disk | > 80% | Cleanup/Expand |
| Network | > 70% | Review |
| Brain API Response | > 500ms | Investigation |
| Qdrant Query Time | > 100ms | Investigation |

### 7.3 Auto-Scaling Konfiguration

```yaml
# Aktuelle HPA Configuration
minReplicas: 3
maxReplicas: 10
targetCPUUtilization: 70%
targetMemoryUtilization: 80%

# In 12 Monaten
minReplicas: 5
maxReplicas: 25
```

---

## 8. Wartungsfenster

### 8.1 Geplante Wartung

| Tag | Zeit | Dauer | Zweck |
|-----|------|-------|-------|
| Sonntag | 02:00-06:00 | 4h | System-Updates |
| 1. Samstag im Monat | 02:00-06:00 | 4h | DB-Wartung (MongoDB, Redis, Qdrant) |
| Quartalsweise | Geplant | 8h | Security Audit & Penetrationstest |

### 8.2 Wartungsprozess
1. Vorankündigung (48h vorher)
2. Maintenance Mode aktivieren
3. Wartung durchführen
4. Verifikation (Health Checks)
5. Maintenance Mode deaktivieren
6. Entwarnung

---

## 9. Kontakte und Eskalation

### 9.1 On-Call Rotation

| Woche | Primary | Secondary |
|-------|---------|-----------|
| KW 26 | Engineer A | Engineer B |
| KW 27 | Engineer B | Engineer C |
| KW 28 | Engineer C | Engineer A |

### 9.2 Eskalationspfad

| Level | Kontakt | Erreichbarkeit | Mittel |
|-------|---------|----------------|--------|
| L1 | On-Call Engineer | 24/7 | Slack, Phone |
| L2 | Team Lead | Werktags 8-20 Uhr | Slack, Email |
| L3 | Engineering Manager | Bei Eskalation | Phone |
| L4 | CTO | Kritische Incidents | Phone |

### 9.3 Automatische Eskalation
- P1-Incidents: Automatische Benachrichtigung an L1 + L2
- P2-Incidents: Automatische Benachrichtigung an L1
- Alertmanager → Slack Webhook (konfiguriert)

---

## 10. Operative Checklisten

### 10.1 Tägliche Checks
- [ ] System-Status: Alle Container laufen (`docker ps`)
- [ ] Brain API: Erreichbar (`curl http://127.0.0.1:9090/health`)
- [ ] Qdrant: Erreichbar (`curl http://127.0.0.1:6333/healthz`)
- [ ] Monitoring: Keine kritischen Alerts
- [ ] Backups: Erfolgreich abgeschlossen
- [ ] Logs: Keine ungewöhnlichen Fehler
- [ ] Performance: Innerhalb der SLAs

### 10.2 Wöchentliche Checks
- [ ] Security Patches: Aktuell
- [ ] Trivy Scan: Durchgeführt
- [ ] Zertifikate: Gültig
- [ ] Speicherplatz: Ausreichend
- [ ] Logs bereinigt
- [ ] Dependencies: Aktuell
- [ ] Brain-Sync: Vollständig

### 10.3 Monatliche Checks
- [ ] OS Updates: Installiert
- [ ] MongoDB: Gewartet (Compact, Index)
- [ ] Redis: Gewartet
- [ ] Qdrant: Defragmentiert
- [ ] Backup-Restore: Getestet
- [ ] Security Scan: Durchgeführt
- [ ] Capacity Report: Erstellt
- [ ] ISO 27001 Status: Review

---

**Erstellt von:** NeXify Quality Agent  
**Genehmigt von:** NeXify AI OS  
**Nächste Überprüfung:** 2026-09-23
