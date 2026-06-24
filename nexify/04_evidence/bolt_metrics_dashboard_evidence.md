# NeXify Monitoring Dashboard - Complete Panel Inventory

## Dashboard: NeXify Health Dashboard - Complete Monitoring
**UID:** nexify-health | **Version:** 4 | **Panels:** 22 | **Refresh:** 30s

---

## Panel-Übersicht (22 Panels)

### Row 1: Service & Feature Status (y=0-8)
| ID | Typ | Titel | Metrik |
|----|-----|-------|--------|
| 1 | stat | 🟢 Service Status (All Services) | `up{job=~"nexify-brain\|qdrant\|9router\|nexify-webui\|supabase-kong\|node-exporter\|cadvisor\|blackbox-http\|blackbox-tcp"}` |
| 9 | stat | ⚡ Bolt Feature Status | `bolt_rtk_active`, `bolt_headroom_active`, `bolt_caveman_active` |

### Row 2: Bolt Metrics (y=8-24)
| ID | Typ | Titel | Metriken |
|----|-----|-------|----------|
| 10 | timeseries | ⚡ RTK - Token Ersparnis | `rate(bolt_rtk_tokens_saved_total[5m])`, `bolt_rtk_tokens_saved_total` |
| 11 | timeseries | ⚡ Headroom - Kompressionsrate | `bolt_headroom_compression_ratio * 100` |
| 12 | stat | ⚡ Caveman Modus Status | `bolt_caveman_active` |
| 13 | gauge | ⚡ Bolt Gesamt-Effizienz | `bolt_efficiency_score` |
| 14 | timeseries | ⚡ RTK - Kosteneinsparung | `rate(bolt_rtk_cost_saved_usd[5m])` |

### Row 3: System Resources (y=24-32)
| ID | Typ | Titel | Metriken |
|----|-----|-------|----------|
| 2 | timeseries | 📊 CPU Usage | `100 - (avg by(instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)` |
| 3 | timeseries | 📊 Memory Usage | `(node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes * 100` |
| 4 | timeseries | 📊 Disk Usage | `100 - (node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"} * 100)` |

### Row 4: Brain Metrics (y=32-40) — NEU
| ID | Typ | Titel | Metriken |
|----|-----|-------|----------|
| 20 | timeseries | 🧠 Brain - API Response Time | `histogram_quantile(0.50/0.95/0.99, rate(nexify_brain_request_duration_seconds_bucket[5m]))` |
| 21 | timeseries | 🧠 Brain - Requests/s | `rate(nexify_brain_requests_total[5m])`, `rate(nexify_brain_requests_total{status=~"5.."}[5m])` |
| 22 | timeseries | 🧠 Brain - Active Connections | `nexify_brain_active_connections`, `nexify_brain_memory_entries_total` |

### Row 5: Qdrant Metrics (y=40-48) — NEU
| ID | Typ | Titel | Metriken |
|----|-----|-------|----------|
| 30 | timeseries | 🔷 Qdrant - Search Latency | `histogram_quantile(0.50/0.95/0.99, rate(qdrant_search_duration_seconds_bucket[5m]))` |
| 31 | timeseries | 🔷 Qdrant - Collections & Vectors | `qdrant_collection_vectors_total`, `qdrant_collection_points_total` |
| 32 | gauge | 🔷 Qdrant - Storage Usage | `qdrant_storage_usage_bytes / qdrant_storage_capacity_bytes * 100` |

### Row 6: MongoDB Metrics (y=48-56) — NEU
| ID | Typ | Titel | Metriken |
|----|-----|-------|----------|
| 40 | timeseries | 🍃 MongoDB - Operation Latency | `histogram_quantile(0.50/0.95/0.99, rate(mongodb_operation_duration_seconds_bucket[5m]))` |
| 41 | timeseries | 🍃 MongoDB - Operations/s | `rate(mongodb_operations_total{type="read/write/command"}[5m])` |
| 42 | timeseries | 🍃 MongoDB - Connections & Storage | `mongodb_connections_active`, `mongodb_storage_size_bytes` |

### Row 7-8: Container & Network (y=56-72)
| ID | Typ | Titel | Metriken |
|----|-----|-------|----------|
| 5 | timeseries | 📊 Network Traffic | `irate(node_network_receive_bytes_total{...}[5m])`, `irate(node_network_transmit_bytes_total{...}[5m])` |
| 6 | timeseries | 📊 Container CPU Usage | `rate(container_cpu_usage_seconds_total{name=~"nexify-.*\|9router-.*\|supabase-.*\|ragflow-.*"}[5m])` |
| 7 | timeseries | 📊 Container Memory Usage | `container_memory_usage_bytes{name=~"nexify-.*\|9router-.*\|supabase-.*\|ragflow-.*"}` |
| 8 | gauge | 📊 Probe Duration (Blackbox) | `probe_duration_seconds{job="blackbox-http"}` |

---

## Metrik-Quellen

| Quelle | Port | Exporter | Status |
|--------|------|----------|--------|
| Node Exporter | 9100 | prom/node-exporter | ✅ Aktiv |
| cAdvisor | 8080 | gcr.io/cadvisor/cadvisor | ✅ Aktiv |
| Blackbox Exporter | 9115 | prom/blackbox-exporter | ✅ Aktiv |
| Brain API | 9090 | Integrated | ⚠️ Metriken bereitstellen |
| Qdrant | 6333 | Native /metrics | ⚠️ Metriken prüfen |
| MongoDB | 9216 | percona/mongodb_exporter | 🆕 Neu konfiguriert |

---

## Deployment

```bash
# 1. Copy dashboard to Grafana provisioning
cp grafana/nexify-health_AFTER.json grafana/dashboards/nexify-health.json

# 2. Restart monitoring stack (inkl. neuem mongodb-exporter)
docker compose -f docker-compose.monitoring.yml up -d

# 3. Verify
curl -s http://localhost:9090/api/v1/targets | jq '.data.activeTargets[] | {job: .labels.job, health: .health}'
curl -s http://localhost:3001/api/health
```
