# NeXify Monitoring Stack — Deployment & Verification Guide
**Phase:** 5 — Go-Live
**Datum:** 2026-06-23

---

## 1. Komponenten-Übersicht

| Komponente | Port | Beschreibung | Status |
|------------|------|-------------|--------|
| Prometheus | 9090 | Metrics Collection & Alerting Rules | ✅ KONFIGURIERT |
| Grafana | 3001 | Visualization & Dashboards | ✅ KONFIGURIERT |
| Alertmanager | 9093 | Alert Routing & Benachrichtigung | ✅ KONFIGURIERT |
| Node Exporter | 9100 | System-Metriken (CPU, RAM, Disk, Network) | ✅ KONFIGURIERT |
| cAdvisor | 8081 | Container-Metriken | ✅ KONFIGURIERT |
| Blackbox Exporter | 9115 | Endpoint/URL-Monitoring | ✅ KONFIGURIERT |
| MongoDB Exporter | 9216 | MongoDB-Metriken | ✅ KONFIGURIERT |

---

## 2. Dateistruktur

```
/workspace/nexify/10_evidence/monitoring/
├── docker-compose.monitoring.yml    # Docker Compose für gesamten Stack
├── prometheus.yml                   # Prometheus Konfiguration
├── alert_rules.yml                  # Alert-Regeln (5 Gruppen, 13 Regeln)
├── alertmanager.yml                 # Alertmanager Konfiguration (4 Receiver)
├── blackbox.yml                     # Blackbox Exporter Konfiguration
├── grafana/
│   ├── provisioning/
│   │   ├── datasources/
│   │   │   └── datasource.yml       # Prometheus + Alertmanager als Datenquellen
│   │   └── dashboards/
│   │       └── dashboard.yml        # Dashboard-Provisioning
│   └── dashboards/
│       ├── operations-dashboard.json # Operations Dashboard (12 Panels)
│       └── security-dashboard.json   # Security Dashboard (4 Panels)
└── MONITORING_DEPLOYMENT_GUIDE.md   # Diese Datei
```

---

## 3. Alert-Regeln Übersicht

### System Alerts (4 Regeln)
- **HighCPUUsage** — CPU > 80% für 5 min → Warning
- **HighMemoryUsage** — RAM > 85% für 5 min → Warning
- **HighDiskUsage** — Disk < 10% frei → Critical
- **SystemDown** — Service nicht erreichbar für 1 min → Critical

### Application Alerts (4 Regeln)
- **HighAPIResponseTime** — p95 > 500ms für 5 min → Warning
- **HighErrorRate** — Error Rate > 5% für 5 min → Critical
- **BrainAPIUnhealthy** — Brain API Health Check fehlgeschlagen → Critical
- **QdrantUnhealthy** — Qdrant Health Check fehlgeschlagen → Critical

### Database Alerts (2 Regeln)
- **MongoDBDown** — MongoDB nicht erreichbar → Critical
- **HighMongoDBConnections** — > 100 aktive Verbindungen → Warning

### Security Alerts (2 Regeln)
- **HighFailedLogins** — > 10 fehlgeschlagene Logins/min → Warning
- **SSLCertExpiringSoon** — Zertifikat läuft in < 30 Tagen ab → Warning

### Business Alerts (1 Regel)
- **LowUptime** — Verfügbarkeit < 99.9% (SLA-Verletzung) → Critical

---

## 4. Alertmanager Receiver

| Receiver | Empfänger | Benachrichtigung | Trigger |
|----------|-----------|------------------|---------|
| nexify-team | team@nexifyai.com | Email + Webhook | Warnings |
| nexify-critical | critical@nexifyai.com | Email + Webhook + PagerDuty | Critical Alerts |
| nexify-security | security@nexifyai.com | Email + Webhook | Security Alerts |
| nexify-database | database@nexifyai.com | Email + Webhook | Database Alerts |

---

## 5. Grafana Dashboards

### Operations Dashboard (12 Panels)
1. System Status — Online-Services (Stat)
2. CPU Usage — Gauge mit Thresholds
3. Memory Usage — Gauge mit Thresholds
4. Disk Usage — Gauge mit Thresholds
5. API Response Time — p50/p95/p99 (Timeseries)
6. Error Rate — Fehlerrate in % (Timeseries)
7. Brain API Health — UP/DOWN Status
8. MongoDB Status — UP/DOWN Status
9. Active Alerts — Anzahl aktiver Alerts
10. Network Traffic — RX/TX Bytes/s
11. Uptime (24h) — Verfügbarkeit %

### Security Dashboard (4 Panels)
1. Security Events — Login Attempts/s
2. SSL Certificate Expiry — Tage bis Ablauf
3. Endpoint Availability — Tabelle aller Endpoints
4. Firewall Activity — Connection Drops & SYN Floods

---

## 6. Deployment-Schritte

### 6.1 Monitoring Stack starten
```bash
cd /workspace/nexify/10_evidence/monitoring
docker-compose -f docker-compose.monitoring.yml up -d
```

### 6.2 Verifikation
```bash
# Prometheus Targets prüfen
curl http://localhost:9090/api/v1/targets

# Grafana prüfen
curl http://localhost:3001/api/health

# Alertmanager prüfen
curl http://localhost:9093/api/v1/status

# Alle Container prüfen
docker ps --filter "name=nexify-"
```

### 6.3 Test-Alert senden
```bash
curl -X POST http://localhost:9093/api/v1/alerts \
  -H "Content-Type: application/json" \
  -d '[{"labels":{"alertname":"TestAlert","severity":"warning"},"annotations":{"summary":"Test Alert"}}]'
```

---

## 7. Credentials

| Service | User | Passwort | URL |
|---------|------|----------|-----|
| Grafana | admin | NeXify_M0nit0r_2024! | http://72.62.152.47:3001 |
| Prometheus | - | - | http://72.62.152.47:9090 |
| Alertmanager | - | - | http://72.62.152.47:9093 |

> ⚠️ **HINWEIS:** Grafana-Passwort muss beim ersten Login geändert werden!

---

## 8. Inhibit Rules

- **Critical inhibits Warning** — Wenn ein Critical Alert für dieselbe Instanz feuert, wird der Warning-Alert unterdrückt
- **SystemDown inhibits alle** — Wenn ein System als DOWN markiert ist, werden alle anderen Alerts für diese Instanz unterdrückt

---

**Erstellt von:** Quality Agent
**Am:** 2026-06-23
