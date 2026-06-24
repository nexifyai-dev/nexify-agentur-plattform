# P0-RUNTIME-CLOSURE-RUN: Container & Service Documentation

**Generated:** 2026-06-22
**VPS:** 72.62.152.47
**Host Memory:** 31.34 GiB

---

## Summary

| Metric | Value |
|--------|-------|
| **Total Containers** | 42 |
| **All Running** | ✅ Yes (all Up) |
| **Healthy** | 16 containers explicitly healthy |
| **Total Memory Usage** | ~8.5 GiB / 31.34 GiB (27%) |
| **Highest CPU** | cadvisor (7.32%), analytics (6.55%) |
| **Highest Memory** | ragflow (2.7 GiB), hermes-webui (1.5 GiB), cadvisor (1.4 GiB) |

---

## Container List (Complete)

### 🔵 CORE — NeXify Platform

| Container | Image | Status | Ports | CPU | Memory |
|-----------|-------|--------|-------|-----|--------|
| nexify-webui | nexify-webui-nexify-webui | Up 13h (healthy) | 0.0.0.0:3080→8080 | 0.19% | 591.9 MiB |
| nexify-api | nexify-api:patched | Up 15h | — | 0.76% | 299.6 MiB |
| nexify-proxy | node:22-alpine | Up 15h | — | 0.00% | 11.91 MiB |
| hermes-webui-nexify-hermes-webui-1 | hermes-webui-nexify-hermes-webui | Up 11h (healthy) | — | 1.25% | 1.513 GiB |
| 9router-6kxn-niner-router-1 | ghcr.io/decolua/9router:latest | Up 28m | 127.0.0.1:20128→20128 | 0.04% | 77.11 MiB |
| nexify-redis | redis:7-alpine | Up 15h | 127.0.0.1:6379→6379 | 0.43% | 3.39 MiB |
| nexify-qdrant | qdrant/qdrant:latest | Up 15h | 127.0.0.1:6333→6333 | 0.17% | 49.89 MiB |
| nexify-mongodb | mongo:7 | Up 15h | 127.0.0.1:27018→27017 | 0.49% | 73.75 MiB |

### 🟢 MONITORING — Prometheus Stack

| Container | Image | Status | Ports | CPU | Memory |
|-----------|-------|--------|-------|-----|--------|
| nexify-prometheus | prom/prometheus:latest | Up 9h | 0.0.0.0:9091→9090 | 0.80% | 289.3 MiB |
| nexify-grafana | grafana/grafana:latest | Up 37m | 0.0.0.0:3001→3000 | 0.92% | 211.9 MiB |
| nexify-alertmanager | prom/alertmanager:latest | Up ~1h | 0.0.0.0:9093→9093 | 0.16% | 20.49 MiB |
| nexify-node-exporter | prom/node-exporter:latest | Up 9h | 0.0.0.0:9100→9100 | 0.00% | 9.75 MiB |
| nexify-cadvisor | gcr.io/cadvisor/cadvisor:latest | Up 9h (healthy) | 0.0.0.0:8081→8080 | 7.32% | 1.405 GiB |
| nexify-blackbox-exporter | prom/blackbox-exporter:latest | Up 9h | 0.0.0.0:9115→9115 | 0.17% | 23 MiB |

### 🟡 KNOWLEDGE — RAGFlow Stack

| Container | Image | Status | Ports | CPU | Memory |
|-----------|-------|--------|-------|-----|--------|
| ragflow-xszg-ragflow-1 | infiniflow/ragflow:latest | Up 15h | 0.0.0.0:32769→80 | 0.61% | 2.705 GiB |
| ragflow-xszg-mysql-1 | mysql:8.0 | Up 15h (healthy) | 3306 | 0.98% | 381.3 MiB |
| ragflow-xszg-minio-1 | minio/minio:latest | Up 15h | 9000 | 0.00% | 77.05 MiB |
| ragflow-xszg-redis-1 | valkey/valkey:8 | Up 15h | 6379 | 0.31% | 3.96 MiB |
| ragflow-xszg-infinity-1 | infiniflow/infinity:v0.7.0 | Up 15h | — | 0.02% | 56.46 MiB |

### 🟠 INFRASTRUCTURE — Supabase

| Container | Image | Status | Ports | CPU | Memory |
|-----------|-------|--------|-------|-----|--------|
| supabase_kong_root | supabase/kong:2.8.1 | Up 10h (healthy) | 0.0.0.0:54321→8000 | 0.01% | 103.9 MiB |
| supabase_db_root | supabase/postgres:17.6.1.132 | Up 10h (healthy) | 0.0.0.0:54322→5432 | 0.37% | 150 MiB |
| supabase_studio_root | supabase/studio | Up 10h (healthy) | 0.0.0.0:54323→3000 | 0.00% | 204.1 MiB |
| supabase_auth_root | supabase/gotrue:v2.189.0 | Up 10h (healthy) | 9999 | 0.00% | 8.94 MiB |
| supabase_rest_root | supabase/postgrest:v14.12 | Up 10h | 3000 | 0.10% | 20.03 MiB |
| supabase_realtime_root | supabase/realtime:v2.102.1 | Up 10h (healthy) | 4000 | 0.27% | 207.5 MiB |
| supabase_storage_root | supabase/storage-api:v1.60.2 | Up 10h (healthy) | 5000 | 0.00% | 155.8 MiB |
| supabase_inbucket_root | supabase/mailpit:v1.22.3 | Up 10h (healthy) | 0.0.0.0:54324→8025 | 2.96% | 8.36 MiB |
| supabase_edge_runtime_root | supabase/edge-runtime:v1.74.0 | Up 10h | 8081 | 0.02% | 30.25 MiB |
| supabase_pg_meta_root | supabase/postgres-meta:v0.96.6 | Up 10h (healthy) | 8080 | 0.66% | 86.53 MiB |
| supabase_analytics_root | supabase/logflare:1.42.0 | Up 10h (healthy) | 0.0.0.0:54327→4000 | 6.55% | 541 MiB |
| supabase_vector_root | supabase/vector:0.53.0-alpine | Up 10h (healthy) | — | 0.09% | 44.94 MiB |

### 🟣 INFRASTRUCTURE — Other

| Container | Image | Status | Ports | CPU | Memory |
|-----------|-------|--------|-------|-----|--------|
| traefik-vsrs-traefik-1 | traefik:latest | Up 15h | — | 0.05% | 23.12 MiB |
| postgresql-tu3y-postgresql-1 | postgres:17 | Up 15h | 0.0.0.0:32768→5432 | 0.00% | 17.75 MiB |
| nexify-preview | nginx:alpine | Up 15h | 0.0.0.0:3020→80 | 0.00% | 8.71 MiB |

### 🔴 CUSTOMER: Bookando

| Container | Image | Status | Ports | CPU | Memory |
|-----------|-------|--------|-------|-----|--------|
| bookando-core | bookando-api:local | Up 15h | 0.0.0.0:3002→8000 | 0.16% | 49.7 MiB |
| bookando-postgres | postgres:16-alpine | Up 15h (healthy) | 0.0.0.0:5433→5432 | 0.01% | 18.49 MiB |
| bookando-cache | redis:7-alpine | Up 15h (healthy) | 0.0.0.0:6380→6379 | 0.45% | 3.90 MiB |
| bookando-qdrant-ai | qdrant/qdrant:latest | Up 15h | 0.0.0.0:6335→6333, 6336→6334 | 0.16% | 43.59 MiB |

### 🔴 CUSTOMER: VSK (Vorratsgesellschaften Sofort Kaufen)

| Container | Image | Status | Ports | CPU | Memory |
|-----------|-------|--------|-------|-----|--------|
| vsk-web | vsk-landingpage-web | Up 15h (healthy) | 127.0.0.1:3088→3000 | 0.00% | 52.02 MiB |
| vsk-email-worker | vsk-app:latest | Up 15h (healthy) | 3000 | 0.13% | 31.85 MiB |
| vsk-mongodb | mongo:7 | Up 15h (healthy) | 127.0.0.1:27017→27017 | 0.57% | 89.93 MiB |

### ⚪ UTILITY

| Container | Image | Status | Ports | CPU | Memory |
|-----------|-------|--------|-------|-----|--------|
| paperclip-krv8-paperclip-1 | ghcr.io/hostinger/hvps-paperclip:latest | Up 15h | 0.0.0.0:49916→3100 | 0.02% | 251.1 MiB |

---

## Extern Services (not on VPS)

| Service | Status | Notes |
|---------|--------|-------|
| GitHub | Active | Repository: NeXify-AI-by-NeXify-Chat-it-Automat-it/nexifyai-platform |
| Vercel | Active | Deployment platform |
| Cloudflare Tunnel | Active | brain+agentmemory.nexifyai.cloud |

---

## Health Status Summary

### Containers with explicit health checks (healthy):
✅ supabase_studio_root, supabase_pg_meta_root, supabase_storage_root, supabase_realtime_root, supabase_inbucket_root, supabase_auth_root, supabase_kong_root, supabase_vector_root, supabase_analytics_root, supabase_db_root, nexify-cadvisor, nexify-webui, hermes-webui, ragflow-xszg-mysql-1, bookando-postgres, bookando-cache, vsk-web, vsk-email-worker, vsk-mongodb

### Containers without explicit health checks (running, status OK):
ℹ️ All other containers show "Up" status with no health issues

---

## Resource Usage Hotspots

| Concern | Container | CPU | Memory | Action |
|---------|-----------|-----|--------|--------|
| ⚠️ High CPU | nexify-cadvisor | 7.32% | 1.4 GiB | Monitor — expected for container metrics |
| ⚠️ High CPU | supabase_analytics_root | 6.55% | 541 MiB | Monitor — log processing load |
| ⚠️ High Memory | ragflow-xszg-ragflow-1 | 0.61% | 2.7 GiB | Expected for RAG/AI workload |
| ⚠️ High Memory | hermes-webui | 1.25% | 1.5 GiB | Expected for WebUI with AI backend |

---

## Key Port Mappings (External Access)

| Port | Service |
|------|---------|
| 3001 | Grafana |
| 3002 | Bookando API |
| 3020 | NeXify Preview (nginx) |
| 3080 | NeXify WebUI |
| 54321 | Supabase Kong (API Gateway) |
| 54322 | Supabase PostgreSQL |
| 54323 | Supabase Studio |
| 54324 | Supabase Inbucket (Email) |
| 54327 | Supabase Analytics |
| 8081 | cAdvisor |
| 9091 | Prometheus |
| 9093 | Alertmanager |
| 9100 | Node Exporter |
| 9115 | Blackbox Exporter |
| 32768 | PostgreSQL (TU3Y) |
| 32769 | RAGFlow |

---

## Conclusion

All 42 containers are running and operational. No containers in restart loops or failed state. System resource usage is healthy at ~27% memory utilization. The monitoring stack, knowledge stack, Supabase infrastructure, and customer projects (Bookando, VSK) are all operational.
