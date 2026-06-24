# NeXify Trivy Daily Scan — Evidence Report
**Date:** 2026-06-22
**First Automated Scan:** 23:24 UTC+2

## Cron-Job Definition
**File:** `/etc/cron.d/trivy-daily-scan` (on VPS 72.62.152.47)
**Schedule:** Daily at 03:00 UTC (`0 3 * * *`)

## Scan Script
**File:** `/opt/nexify/security/trivy-scan.sh` (on VPS)
**Features:**
- Filesystem vulnerability scan (`/opt/nexify/`)
- Docker image scan (all local images)
- JSON report generation
- Summary with CRITICAL/HIGH counts
- Logs to `/var/log/trivy/`

## First Automated Scan Results (2026-06-22)

### Filesystem Scan
- **Result:** Clean — no vulnerabilities, secrets, or misconfigurations detected in `/opt/nexify/`

### Docker Image Scan Summary

| Image | CRITICAL | HIGH |
|-------|----------|------|
| hermes-webui-nexify:kanban-bridge | 9 | 50 |
| nexify-webui-nexify-webui:latest | 32 | 279 |
| nexify-api:patched | 6 | 74 |
| infiniflow/ragflow:latest | 6 | 48 |
| bookando-api:local | 2 | 25 |
| mongo:7 | 1 | 79 |
| postgres:16-alpine | 1 | 14 |
| nginx:alpine | 0 | 1 |
| ghcr.io/decolua/9router:latest | 0 | 1 |
| prom/prometheus:latest | 0 | 6 |
| vorratsgesellschaften-sofort-kaufen-landingpage-web:latest | 2 | 21 |
| vsk-app:latest | 0 | 1 |
| prom/alertmanager:latest | 0 | 0 |

### Total Findings
- **CRITICAL:** 59
- **HIGH:** 599

### Top Priority Images (need patching)
1. **nexify-webui-nexify-webui:latest** — 32 CRITICAL, 279 HIGH (Debian 12-based, many outdated packages)
2. **hermes-webui-nexify:kanban-bridge-20260621** — 9 CRITICAL, 50 HIGH
3. **nexify-api:patched** — 6 CRITICAL, 74 HIGH
4. **infiniflow/ragflow:latest** — 6 CRITICAL, 48 HIGH (Ubuntu 24.04)

### Reports Location (on VPS)
- `/opt/nexify/security/reports/trivy-fs-2026-06-22.json`
- `/opt/nexify/security/reports/trivy-img-2026-06-22-*.json` (14 files)
- `/var/log/trivy/trivy-scan-2026-06-22.log`
