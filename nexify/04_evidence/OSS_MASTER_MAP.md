# NeXify AI OS - OSS Master Map
# Vollständige Übersicht aller OSS-Lösungen nach Layer

**Erstellt:** 2026-06-23
**Agent:** OSS Agent
**Status:** ✅ Aktuell

---

## Architektur-Übersicht (7 Layer)

```
┌─────────────────────────────────────────────────────────────────┐
│ L7 - APPLICATIONS                                               │
│  Traefik | Caddy | Plausible | Matomo | Ollama | Podman         │
├─────────────────────────────────────────────────────────────────┤
│ L6 - CI/CD                                                      │
│  GitHub Actions | Woodpecker CI                                 │
├─────────────────────────────────────────────────────────────────┤
│ L5 - BACKUP & RECOVERY                                          │
│  restic | BorgBackup                                            │
├─────────────────────────────────────────────────────────────────┤
│ L4 - LOGGING                                                    │
│  ELK Stack | Loki | Promtail                                    │
├─────────────────────────────────────────────────────────────────┤
│ L3 - MONITORING & OBSERVABILITY                                 │
│  Prometheus | Grafana | Alertmanager | Uptime Kuma               │
├─────────────────────────────────────────────────────────────────┤
│ L2 - SECURITY                                                   │
│  Trivy | Fail2Ban | CrowdSec | ClamAV                           │
├─────────────────────────────────────────────────────────────────┤
│ L1 - INFRASTRUCTURE & DATA                                      │
│  PostgreSQL | MongoDB | Redis | Qdrant | CockroachDB            │
│  Docker | Docker Compose                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## L1 - Infrastructure & Data

### Datenbanken
| Lösung | Lizenz | Zweck | Port | Status |
|--------|--------|-------|------|--------|
| PostgreSQL 16 | MIT | Relationale DB (Primary) | 5432 | ✅ Aktiv |
| MongoDB 7 | SSPL | Document Store | 27017 | ✅ Aktiv |
| Redis 7 | BSD-3 | Cache, Session, Pub/Sub | 6379 | ✅ Aktiv |
| Qdrant 1.x | Apache-2.0 | Vektor-DB für KI | 6333 | ✅ Aktiv |
| CockroachDB | BSL | Verteilte SQL-DB | 26257 | 🆕 Neu |

### Container-Runtime
| Lösung | Lizenz | Zweck | Status |
|--------|--------|-------|--------|
| Docker 24.x | Apache-2.0 | Container-Runtime | ✅ Aktiv |
| Docker Compose 2.x | Apache-2.0 | Multi-Container | ✅ Aktiv |
| Podman | Apache-2.0 | Rootless Runtime | 🆕 Neu |

---

## L2 - Security

| Lösung | Lizenz | Zweck | Status |
|--------|--------|-------|--------|
| Trivy | Apache-2.0 | Container/Dependency Scanning | ✅ Aktiv |
| Fail2Ban | GPL-2.0 | Brute-Force-Schutz (IP-Banning) | ✅ Aktiv |
| CrowdSec | MIT | Collaborative IPS (Community Blocklists) | 🆕 Neu |
| ClamAV | GPL-2.0 | Malware-Scanning (Dateien) | ✅ Bereit |

### CrowdSec Integration Details
- **Collections:** crowdsecurity/nginx, crowdsecurity/traefik
- **Blocklists:** Community-basiert, automatische Updates
- **Bouncers:** nginx, traefik, firewall
- **Fallback zu Fail2Ban:** Dual-Layer Schutz

---

## L3 - Monitoring & Observability

| Lösung | Lizenz | Zweck | URL | Status |
|--------|--------|-------|-----|--------|
| Prometheus 2.x | Apache-2.0 | Metriken-Sammlung | :9090 | ✅ Aktiv |
| Grafana 10.x | AGPL-3.0 | Dashboards | :3000 | ✅ Aktiv |
| Alertmanager | Apache-2.0 | Alert-Routing | :9093 | ✅ Aktiv |
| Uptime Kuma | MIT | Uptime-Monitoring | status.nexifyai.cloud | 🆕 Neu |

### Prometheus Targets
- Alle Container (cAdvisor)
- Node Exporter (Host-Metriken)
- PostgreSQL Exporter
- Redis Exporter
- MongoDB Exporter
- Nginx/Traefik Exporter

### Grafana Dashboards
- System Overview (CPU, RAM, Disk, Network)
- Database Performance (PG, Mongo, Redis)
- Container Health
- Application Metrics
- Uptime Kuma Status

---

## L4 - Logging

| Lösung | Lizenz | Zweck | Status |
|--------|--------|-------|--------|
| ELK Stack 8.x | Elastic-2.0 | Zentralisiertes Logging | ✅ Aktiv |
| Loki 2.x | AGPL-3.0 | Log-Aggregation | ✅ Aktiv |
| Promtail | Apache-2.0 | Log-Shipper für Loki | 🆕 Neu |

### Log-Pipeline
```
Container → Promtail → Loki → Grafana
   ↓
Docker Logs → Promtail → Loki → Grafana
   ↓
System Logs → Promtail → Loki → Grafana
```

### Promtail Scraping Targets
- /var/log/syslog (System)
- /var/lib/docker/containers/* (Docker)
- /var/log/nginx/*.log (Nginx)
- /var/log/traefik/*.log (Traefik)
- /var/log/postgresql/*.log (PostgreSQL)
- /var/log/mongodb/*.log (MongoDB)
- /var/log/redis/*.log (Redis)
- /var/log/crowdsec/*.log (CrowdSec)

---

## L5 - Backup & Recovery

| Lösung | Lizenz | Zweck | Status |
|--------|--------|-------|--------|
| restic | BSD-2-Clause | Inkrementelle Backups | ✅ Aktiv |
| BorgBackup | BSD-3-Clause | Deduplizierende Backups | 🆕 Neu |

### Backup-Strategie
| Komponente | Tool | Frequenz | Retention |
|------------|------|----------|-----------|
| PostgreSQL | restic | Täglich | 7d, 4w, 12m |
| MongoDB | restic | Täglich | 7d, 4w, 12m |
| Redis | restic | Täglich | 7d, 4w, 12m |
| Docker Volumes | BorgBackup | Täglich | 7d, 4w, 12m |
| Configs | BorgBackup | Täglich | 7d, 4w, 12m |
| Qdrant | restic | Täglich | 7d, 4w, 12m |

### Verschlüsselung
- restic: AES-256
- BorgBackup: AES-256

---

## L6 - CI/CD

| Lösung | Lizenz | Zweck | URL | Status |
|--------|--------|-------|-----|--------|
| GitHub Actions | - | Cloud CI/CD | github.com | ✅ Aktiv |
| Woodpecker CI | Apache-2.0 | Self-hosted CI/CD | ci.nexifyai.cloud | 🆕 Neu |

### Woodpecker CI Features
- GitHub OAuth Integration
- YAML-Pipeline-Definition
- Docker-basierte Builds
- Parallel Execution
- Webhook-Integration
- NeXify CI-Brand

---

## L7 - Applications

### Web & Reverse Proxy
| Lösung | Lizenz | Zweck | URL | Status |
|--------|--------|-------|-----|--------|
| Traefik 3.x | MIT | Reverse Proxy, LB | :80/:443 | ✅ Aktiv |
| Caddy | Apache-2.0 | Automatisches HTTPS | web.nexifyai.cloud | 🆕 Neu |

### Analytics
| Lösung | Lizenz | Zweck | URL | Status |
|--------|--------|-------|-----|--------|
| Plausible | AGPL-3.0 | DSGVO-Web-Analytics | analytics.nexifyai.cloud | 🆕 Neu |
| Matomo | GPL-3.0 | Erweiterte Analytics | matomo.nexifyai.cloud | 🆕 Neu |

### AI/ML
| Lösung | Lizenz | Zweck | URL | Status |
|--------|--------|-------|-----|--------|
| 9Router | Proprietary | KI-Modell-Routing | :8080 | ✅ Aktiv |
| Ollama | MIT | Lokale LLM-Inference | ai.nexifyai.cloud | 🆕 Neu |
| Qdrant | Apache-2.0 | Vektor-DB | :6333 | ✅ Aktiv |

---

## Gesamtstatistik

| Layer | Aktiv | Neu | Gesamt |
|-------|-------|-----|--------|
| L1 - Infrastructure | 8 | 1 | 9 |
| L2 - Security | 3 | 1 | 4 |
| L3 - Monitoring | 3 | 1 | 4 |
| L4 - Logging | 2 | 1 | 3 |
| L5 - Backup | 1 | 1 | 2 |
| L6 - CI/CD | 1 | 1 | 2 |
| L7 - Applications | 4 | 4 | 8 |
| **Gesamt** | **22** | **10** | **32** |

---

## Lizenz-Übersicht

| Lizenz | Anzahl | Kommerziell OK |
|--------|--------|----------------|
| MIT | 8 | ✅ |
| Apache-2.0 | 7 | ✅ |
| BSD-2/3-Clause | 3 | ✅ |
| AGPL-3.0 | 2 | ✅ (mit Bedingungen) |
| GPL-2.0/3.0 | 2 | ✅ (Copyleft) |
| BSL | 1 | ✅ (mit Bedingungen) |
| Elastic-2.0 | 1 | ✅ |
| SSPL | 1 | ⚠️ (nicht als Service) |

**Alle Lizenzen erlauben die interne Nutzung im NeXify AI OS.**

---

**Stand:** 2026-06-23
**Agent:** OSS Agent
