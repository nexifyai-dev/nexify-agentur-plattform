# NeXify Cloudflare Workers

## Übersicht

Diese Workers bilden das API-Gateway und die Backend-Services für NeXify AI OS auf Cloudflare.

## Workers

### 1. API Gateway (`api-gateway/`)
- Proxy für Brain API (127.0.0.1:9090)
- Rate Limiting
- CORS Handling
- Request Logging

### 2. Backup (`backup/`)
- Automatische Backups in R2
- Backup-Trigger via API
- Restore-Endpunkt

### 3. Config (`config/`)
- KV-basierte Konfiguration
- Feature Flags
- Secrets Management

### 4. Messaging (`messaging/`)
- Queue-basierte Nachrichten
- Task Queue
- Event Queue

### 5. AI (`ai/`)
- Workers AI Integration
- Text Classification
- Text Embedding
- Summarization

### 6. Monitoring (`monitoring/`)
- Analytics Engine
- System Health Metrics
- Performance Tracking

## Deployment

```bash
# Wrangler installieren
npm install -g wrangler

# Login
wrangler login

# Worker deployen
cd api-gateway
wrangler deploy

# Alle Workers deployen
./deploy.sh
```

## Environment Variables

| Variable | Beschreibung |
|----------|--------------|
| BRAIN_URL | Brain API URL (http://127.0.0.1:9090) |
| QDRANT_URL | Qdrant URL (http://127.0.0.1:6333) |
| BACKUP_SECRET | Backup-Verschlüsselung |

## Secrets

```bash
# Secrets setzen
wrangler secret put BRAIN_API_KEY
wrangler secret put QDRANT_API_KEY
wrangler secret put BACKUP_SECRET
```
