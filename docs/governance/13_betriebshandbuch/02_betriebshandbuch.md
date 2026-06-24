# Betriebshandbuch NeXify AI OS
## nach ITIL / ISO 20000

**Dokumentennummer:** NX-OPS-001  
**Version:** 1.0  
**Datum:** 2026-06-23  
**Status:** Freigegeben  

---

## 1. Einführung

### 1.1 Zweck
Dieses Betriebshandbuch beschreibt alle betrieblichen Verfahren und Prozesse für den laufenden Betrieb des NeXify AI OS.

### 1.2 Zielgruppe
- Operations-Team
- DevOps-Ingenieure
- On-Call Engineers
- Systemadministratoren

### 1.3 Normative Referenzen
- ITIL 4 (IT Service Management)
- ISO/IEC 20000-1 (IT-Service-Management)
- ISO 27001 (Informationssicherheit)

---

## 2. Tägliche Betriebsabläufe

### 2.1 Morning Checklist (09:00)

| # | Aufgabe | Verantwortlich | Dauer |
|---|---------|----------------|-------|
| 1 | System-Status prüfen | On-Call | 5 Min |
| 2 | Alerts reviewen | On-Call | 10 Min |
| 3 | Backup-Status prüfen | Ops | 5 Min |
| 4 | Performance-Metriken reviewen | Ops | 10 Min |
| 5 | Offene Tickets prüfen | Team Lead | 10 Min |
| 6 | Capacity-Planung | Ops | 5 Min |

### 2.2 Monitoring-Dashboards

| Dashboard | URL | Zweck |
|-----------|-----|-------|
| System Overview | grafana.nexify.de/d/system | Gesamtübersicht |
| Application | grafana.nexify.de/d/app | Anwendungsmetriken |
| Database | grafana.nexify.de/d/db | Datenbankperformance |
| Security | grafana.nexify.de/d/security | Sicherheitsereignisse |

### 2.3 Regelmäßige Aufgaben

| Aufgabe | Frequenz | Verantwortlich | Script |
|---------|----------|----------------|--------|
| Log-Rotation | Täglich | Automatisch | logrotate |
| Backup-Verifikation | Täglich | Ops | verify-backup.sh |
| Certificate Check | Wöchentlich | Ops | check-certs.sh |
| Dependency Update | Wöchentlich | DevOps | update-deps.sh |
| Security Scan | Wöchentlich | Security | security-scan.sh |
| Capacity Report | Monatlich | Ops | capacity-report.sh |

---

## 3. Incident Management

### 3.1 Incident-Klassifikation

| Priorität | Beschreibung | Response-Zeit | Resolution-Zeit |
|-----------|--------------|---------------|-----------------|
| P1 - Kritisch | Totalausfall, Datenverlust | 15 Minuten | 4 Stunden |
| P2 - Hoch | Service-Degradation | 30 Minuten | 8 Stunden |
| P3 - Mittel | Einzelfehler | 2 Stunden | 24 Stunden |
| P4 - Gering | Kosmetische Probleme | 8 Stunden | 72 Stunden |

### 3.2 Incident Response Prozess

```
Erkennung → Klassifikation → Eindämmung → Analyse → 
Behebung → Verifikation → Dokumentation → Review
```

### 3.3 Runbooks

#### 3.3.1 Service Restart
```bash
# Kubernetes Service Restart
kubectl rollout restart deployment/nexify-api -n nexify
kubectl rollout status deployment/nexify-api -n nexify

# Verifikation
curl -s https://api.nexify.de/health | jq .
```

#### 3.3.2 Datenbank-Wartung
```bash
# Vacuum
psql -U postgres -d nexify -c "VACUUM ANALYZE;"

# Index Rebuild
psql -U postgres -d nexify -c "REINDEX DATABASE nexify;"

# Backup
pg_basebackup -h localhost -D /backup/base -Ft -z -P
```

#### 3.3.3 Cache-Clear
```bash
# Redis Cache leeren
redis-cli FLUSHDB

# Spezifischen Key löschen
redis-cli DEL "cache:key:*"
```

#### 3.3.4 Log-Analyse
```bash
# Fehler in Logs suchen
grep -i "error" /var/log/nexify/*.log | tail -100

# Elasticsearch Query
curl -X GET "localhost:9200/nexify-logs/_search" -H 'Content-Type: application/json' -d '{
  "query": {
    "bool": {
      "must": [
        { "match": { "level": "ERROR" } },
        { "range": { "@timestamp": { "gte": "now-1h" } } }
      ]
    }
  }
}'
```

---

## 4. Deployment-Verfahren

### 4.1 Standard-Deployment

```bash
# 1. Image bauen
docker build -t nexify/api:latest .
docker push nexify/api:latest

# 2. Deployment
kubectl apply -f k8s/deployment.yaml

# 3. Rollout überwachen
kubectl rollout status deployment/nexify-api -n nexify

# 4. Verifikation
curl -s https://api.nexify.de/health
```

### 4.2 Rollback-Verfahren

```bash
# Rollback zum vorherigen Release
kubectl rollout undo deployment/nexify-api -n nexify

# Spezifisches Revision
kubectl rollout undo deployment/nexify-api -n nexify --to-revision=2

# Status prüfen
kubectl rollout status deployment/nexify-api -n nexify
```

### 4.3 Blue-Green Deployment
1. Green-Environment bereitstellen
2. Tests auf Green durchführen
3. Traffic umschalten (DNS/Load Balancer)
4. Blue-Environment überwachen
5. Blue nach stabilisierung abbauen

---

## 5. Backup und Recovery

### 5.1 Backup-Übersicht

| Komponente | Methode | Frequenz | Retention |
|------------|---------|----------|-----------|
| PostgreSQL | pg_basebackup + WAL | Stündlich | 30 Tage |
| Redis | RDB + AOF | Alle 15 Min | 7 Tage |
| Files | rsync | Täglich | 90 Tage |
| Config | Git | Bei Änderung | Unbegrenzt |

### 5.2 Recovery-Verfahren

#### Datenbank-Recovery
```bash
# Point-in-Time Recovery
pg_basebackup -h backup-server -D /recovery/base -Ft -z

# WAL-Logs anwenden
restore_command = 'cp /archive/%f %p'
recovery_target_time = '2026-06-23 10:00:00'
```

---

## 6. Sicherheitsbetrieb

### 6.1 Regelmäßige Sicherheitsaufgaben

| Aufgabe | Frequenz | Verantwortlich |
|---------|----------|----------------|
| Security Patches | Wöchentlich | DevOps |
| Access Review | Monatlich | Security |
| Penetration Test | Quartalsweise | Extern |
| Vulnerability Scan | Wöchentlich | Security |

### 6.2 Security Incident Response
1. **Detection**: IDS/IPS, Log-Analyse
2. **Containment**: Betroffene Systeme isolieren
3. **Eradication**: Bedrohung entfernen
4. **Recovery**: Systeme wiederherstellen
5. **Lessons Learned**: Review und Verbesserung

---

## 7. Capacity Management

### 7.1 Monitoring-Metriken

| Metrik | Alert-Schwelle | Aktion |
|--------|----------------|--------|
| CPU | > 85% | Scale Up |
| Memory | > 90% | Scale Up |
| Disk | > 80% | Cleanup/Expand |
| Network | > 70% | Review |

### 7.2 Auto-Scaling
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: nexify-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: nexify-api
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

---

## 8. Wartungsfenster

### 8.1 Geplante Wartung

| Tag | Zeit | Dauer | Zweck |
|-----|------|-------|-------|
| Sonntag | 02:00-06:00 | 4h | System-Updates |
| 1. Samstag im Monat | 02:00-06:00 | 4h | DB-Wartung |

### 8.2 Wartungsprozess
1. Vorankündigung (48h vorher)
2. Maintenance Mode aktivieren
3. Wartung durchführen
4. Verifikation
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

| Level | Kontakt | Erreichbarkeit |
|-------|---------|----------------|
| L1 | On-Call Engineer | 24/7 |
| L2 | Team Lead | Werktags 8-20 Uhr |
| L3 | Engineering Manager | Bei Eskalation |
| L4 | CTO | Kritische Incidents |

---

**Erstellt von:** NeXify Systemmaster Agent  
**Genehmigt von:** NeXify AI OS  
**Nächste Überprüfung:** 2026-09-23
