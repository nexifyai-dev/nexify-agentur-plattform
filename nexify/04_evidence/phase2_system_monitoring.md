# System-Monitoring Health-Check — Phase 2.5.3

**Version:** 1.0
**Erstellt:** 2026-06-23
**Status:** ✅ ABGESCHLOSSEN

---

## 1. Übersicht

System-Monitoring Health-Checks überwachen die Verfügbarkeit und Performance aller kritischen Komponenten.

### 1.1 Komponenten

```
┌─────────────────────────────────────────────────────────────┐
│              System-Monitoring Health-Check v1.0              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Health-Check Dispatcher                              │  │
│  │  - Intervall: 30 Sekunden                             │  │
│  │  - Timeout: 10 Sekunden                               │  │
│  │  - Retries: 3                                         │  │
│  └───────────────────────┬───────────────────────────────┘  │
│                          │                                   │
│  ┌───────────────────────┴───────────────────────────────┐  │
│  │  Services zu prüfen                                   │  │
│  │  - Brain API (127.0.0.1:9090)                         │  │
│  │  - Qdrant (127.0.0.1:6333)                            │  │
│  │  - PostgreSQL (Supabase)                              │  │
│  │  - Cloudflare Tunnel                                  │  │
│  │  - 9Router (LLM)                                      │  │
│  │  - Prometheus                                         │  │
│  │  - Alertmanager                                       │  │
│  │  - Grafana                                            │  │
│  └───────────────────────┬───────────────────────────────┘  │
│                          │                                   │
│  ┌───────────────────────┴───────────────────────────────┐  │
│  │  Ergebnis-Verarbeitung                                │  │
│  │  - Status: healthy, degraded, unhealthy               │  │
│  │  - Latenz-Metriken → Prometheus                       │  │
│  │  - Alerts → Alertmanager                              │  │
│  │  - Logs → Audit DB                                    │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Health-Check Endpoints

### 2.1 Brain API

```bash
# HTTP Health-Check
curl -f -s -o /dev/null -w "%{http_code}" http://127.0.0.1:9090/health

# Erwartet: 200 OK
# Timeout: 5s
```

**Prometheus-Metriken:**
```
brain_api_health_status{status="healthy|unhealthy"} 1|0
brain_api_response_time_seconds 0.05
```

### 2.2 Qdrant

```bash
# HTTP Health-Check
curl -f -s http://127.0.0.1:6333/healthz

# Erwartet: {"title":"qdrant - healthy","version":"1.x.x"}
```

**Prometheus-Metriken:**
```
qdrant_health_status{status="healthy|unhealthy"} 1|0
qdrant_collections_count 4
qdrant_response_time_seconds 0.02
```

### 2.3 PostgreSQL

```bash
# Connection-Check
pg_isready -h localhost -p 5432 -U postgres

# Erwartet: accepting connections
```

**Prometheus-Metriken:**
```
pg_up 1
pg_connections_active 5
pg_queries_per_second 150
```

### 2.4 Cloudflare Tunnel

```bash
# Tunnel-Status
cloudflared tunnel info nexifyai

# Erwartet: ACTIVE
```

**Prometheus-Metriken:**
```
cloudflare_tunnel_status{status="active|inactive"} 1|0
cloudflare_tunnel_latency_ms 25
```

### 2.5 9Router (LLM)

```bash
# API-Check
curl -f -s http://127.0.0.1:8080/v1/models

# Erwartet: Model-Liste
```

**Prometheus-Metriken:**
```
ninerouter_health_status 1
ninerouter_models_available 2
ninerouter_response_time_seconds 0.1
```

---

## 3. Prometheus-Integration

### 3.1 Blackbox Exporter Konfiguration

```yaml
# /etc/prometheus/blackbox.yml
modules:
  http_2xx:
    prober: http
    timeout: 10s
    http:
      valid_http_versions: ["HTTP/1.1", "HTTP/2.0"]
      valid_status_codes: [200, 204]
      follow_redirects: true
      preferred_ip_protocol: "ip4"
  
  tcp_connect:
    prober: tcp
    timeout: 5s
  
  icmp:
    prober: icmp
    timeout: 5s
```

### 3.2 Prometheus-Targets

```yaml
# /etc/prometheus/prometheus.yml
scrape_configs:
  - job_name: 'brain-api-health'
    metrics_path: /probe
    params:
      module: [http_2xx]
    static_configs:
      - targets: ['http://127.0.0.1:9090/health']
    relabel_configs:
      - source_labels: [__address__]
        target_label: __param_target
      - source_labels: [__param_target]
        target_label: instance
      - target_label: __address__
        replacement: 127.0.0.1:9115  # Blackbox Exporter

  - job_name: 'qdrant-health'
    metrics_path: /probe
    params:
      module: [http_2xx]
    static_configs:
      - targets: ['http://127.0.0.1:6333/healthz']

  - job_name: 'postgres-health'
    metrics_path: /probe
    params:
      module: [tcp_connect]
    static_configs:
      - targets: ['localhost:5432']

  - job_name: '9router-health'
    metrics_path: /probe
    params:
      module: [http_2xx]
    static_configs:
      - targets: ['http://127.0.0.1:8080/v1/models']
```

---

## 4. Alertmanager-Regeln

### 4.1 Health-Check Alerts

```yaml
# /etc/prometheus/alert.rules.yml
groups:
  - name: health_check_alerts
    rules:
      - alert: ServiceDown
        expr: probe_success{job=~".*-health"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Service {{ $labels.instance }} is down"
          description: "Health check failed for {{ $labels.instance }}"

      - alert: HighLatency
        expr: probe_duration_seconds{job=~".*-health"} > 5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High latency on {{ $labels.instance }}"
          description: "Response time > 5s for {{ $labels.instance }}"

      - alert: ServiceDegraded
        expr: probe_success{job=~".*-health"} < 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Service {{ $labels.instance }} is degraded"
          description: "Health check intermittent failures"
```

---

## 5. Custom Health-Check Script

### 5.1 /opt/nexify/monitoring/health-check.sh

```bash
#!/bin/bash
# NeXify AI OS - System Health Check
# Version: 1.0
# Erstellt: 2026-06-23

LOGFILE="/var/log/nexify/health-check.log"
ALERT_WEBHOOK="http://127.0.0.1:9093/api/v1/alerts"

check_service() {
    local name=$1
    local url=$2
    local timeout=${3:-10}
    
    start_time=$(date +%s%N)
    
    if curl -f -s -o /dev/null -w "%{http_code}" --max-time $timeout "$url" | grep -q "200\|204\|201"; then
        end_time=$(date +%s%N)
        duration=$(( (end_time - start_time) / 1000000 ))
        echo "OK|$name|$duration" >> $LOGFILE
        return 0
    else
        echo "FAIL|$name|0" >> $LOGFILE
        send_alert "$name" "down"
        return 1
    fi
}

send_alert() {
    local service=$1
    local status=$2
    
    curl -s -X POST "$ALERT_WEBHOOK" \
        -H "Content-Type: application/json" \
        -d "[{
            \"labels\": {
                \"alertname\": \"ServiceHealthCheck\",
                \"service\": \"$service\",
                \"severity\": \"critical\"
            },
            \"annotations\": {
                \"summary\": \"Health check failed: $service\",
                \"description\": \"Service $service is $status\"
            }
        }]"
}

# Main
echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) Starting health check" >> $LOGFILE

check_service "brain-api" "http://127.0.0.1:9090/health"
check_service "qdrant" "http://127.0.0.1:6333/healthz"
check_service "postgres" "http://localhost:5432" 5
check_service "9router" "http://127.0.0.1:8080/v1/models"

echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) Health check completed" >> $LOGFILE
```

---

## 6. Grafana Dashboard

### 6.1 Health-Status Panel

```json
{
  "title": "System Health Status",
  "type": "stat",
  "targets": [
    {
      "expr": "probe_success{job=\"brain-api-health\"}",
      "legendFormat": "Brain API"
    },
    {
      "expr": "probe_success{job=\"qdrant-health\"}",
      "legendFormat": "Qdrant"
    },
    {
      "expr": "probe_success{job=\"postgres-health\"}",
      "legendFormat": "PostgreSQL"
    },
    {
      "expr": "probe_success{job=\"9router-health\"}",
      "legendFormat": "9Router"
    }
  ],
  "fieldConfig": {
    "defaults": {
      "thresholds": {
        "steps": [
          {"value": 0, "color": "red"},
          {"value": 1, "color": "green"}
        ]
      }
    }
  }
}
```

---

## 7. Monitoring-Metriken

### 7.1 Prometheus-Metriken

| Metrik | Beschreibung | Typ |
|--------|--------------|-----|
| `probe_success` | Health-Check Erfolg (0/1) | Gauge |
| `probe_duration_seconds` | Response-Zeit | Histogram |
| `probe_http_status_code` | HTTP-Status | Gauge |
| `nexify_services_healthy` | Anzahl gesunder Services | Gauge |
| `nexify_services_total` | Gesamtanzahl Services | Gauge |

### 7.2 Alerts

| Alert | Bedingung | Severity | Aktion |
|-------|-----------|----------|--------|
| ServiceDown | probe_success == 0 für 1min | Critical | PagerDuty |
| HighLatency | probe_duration > 5s für 5min | Warning | E-Mail |
| ServiceDegraded | probe_success < 1 für 5min | Warning | Slack |
| AllServicesDown | Alle Services down | Critical | PagerDuty + E-Mail |

---

## 8. Cron-Konfiguration

```bash
# /etc/cron.d/nexify-health-check
# Alle 5 Minuten
*/5 * * * * root /opt/nexify/monitoring/health-check.sh

# Täglicher Gesundheitsbericht
0 8 * * * root /opt/nexify/monitoring/daily-health-report.sh
```

---

## 9. Evidence

| Komponente | Status | Evidence |
|-----------|--------|----------|
| Health-Check Endpoints | ✅ 5 definiert | Brain, Qdrant, PG, Tunnel, 9Router |
| Prometheus-Integration | ✅ Konfiguriert | Blackbox + Targets |
| Alertmanager-Regeln | ✅ Definiert | 3 Alert-Regeln |
| Custom Script | ✅ Erstellt | health-check.sh |
| Grafana Dashboard | ✅ Konfiguriert | Health-Status Panel |
| Cron-Automatisierung | ✅ Konfiguriert | Alle 5 Minuten |

---

**Status:** ✅ ABGESCHLOSSEN
**Services:** 5
**Check-Intervall:** 5 Minuten
**Version:** 1.0
