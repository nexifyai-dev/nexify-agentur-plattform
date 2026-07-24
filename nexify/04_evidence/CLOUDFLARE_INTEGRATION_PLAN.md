# Cloudflare Integration Plan — NeXify AI OS

**Status:** PLAN  
**Datum:** 2026-06-23  
**Autor:** Infrastructure Agent

---

## 1. Architektur-Übersicht

```
┌─────────────────────────────────────────────────────────────┐
│                    Cloudflare Edge Network                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Workers  │  │   Pages  │  │    R2    │  │    KV    │  │
│  │ API-GW   │  │ Landing  │  │ Backups  │  │  Config  │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  │
│       │              │              │              │        │
│       └──────────────┴──────────────┴──────────────┘        │
│                          │                                  │
│                    Cloudflare Tunnel                         │
│                          │                                  │
└──────────────────────────┼──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    NeXify AI OS (On-Premise)                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Brain   │  │  Qdrant  │  │ 9Router  │  │  Docker  │  │
│  │ :9090    │  │  :6333   │  │  LLM     │  │ Services │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Phase 1: Foundation (Woche 1)

### 2.1 Cloudflare Tunnel Setup
```bash
# Bestehende Tunnel erweitern
# brain+agentmemory.nexifyai.cloud → erweitern um API

cloudflared tunnel route dns nexifyai-tunnel api.nexifyai.cloud
cloudflared tunnel route dns nexifyai-tunnel app.nexifyai.cloud
```

### 2.2 Workers API-Gateway
```typescript
// /workspace/nexify/07_tools_cli/cloudflare/workers/api-gateway/src/index.ts

interface Env {
  BRAIN_URL: string;
  KV_CONFIG: KVNamespace;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    // Route: /api/brain/* → Brain API Proxy
    if (url.pathname.startsWith('/api/brain')) {
      return proxyToBrain(request, env.BRAIN_URL);
    }
    
    // Route: /api/config/* → KV Config
    if (url.pathname.startsWith('/api/config')) {
      return handleConfig(request, env.KV_CONFIG);
    }
    
    // Route: /api/* → Default API
    return handleAPI(request, env);
  }
};

async function proxyToBrain(request: Request, brainUrl: string): Promise<Response> {
  const url = new URL(request.url);
  const targetUrl = `${brainUrl}${url.pathname.replace('/api/brain', '')}`;
  
  return fetch(targetUrl, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  });
}
```

### 2.3 wrangler.toml
```toml
# /workspace/nexify/07_tools_cli/cloudflare/workers/api-gateway/wrangler.toml

name = "nexify-api-gateway"
main = "src/index.ts"
compatibility_date = "2026-06-23"

[vars]
BRAIN_URL = "http://127.0.0.1:9090"

[[kv_namespaces]]
binding = "KV_CONFIG"
id = "YOUR_KV_NAMESPACE_ID"

[[routes]]
pattern = "api.nexifyai.cloud/*"
zone_name = "nexifyai.cloud"
```

---

## 3. Phase 2: Storage & Database (Woche 2)

### 3.1 R2 Backup System
```typescript
// /workspace/nexify/07_tools_cli/cloudflare/workers/backup/src/index.ts

interface Env {
  BACKUP_BUCKET: R2Bucket;
  BACKUP_SECRET: string;
}

export default {
  async scheduled(event: ScheduledEvent, env: Env): Promise<void> {
    // Tägliches Backup um 02:00 UTC
    await performBackup(env.BACKUP_BUCKET);
  },
  
  async fetch(request: Request, env: Env): Promise<Response> {
    // Backup-Endpunkte für manuelle Trigger
    if (request.method === 'POST' && request.url.includes('/backup/trigger')) {
      await performBackup(env.BACKUP_BUCKET);
      return new Response('Backup triggered');
    }
    
    // Restore-Endpunkt
    if (request.method === 'GET' && request.url.includes('/backup/restore')) {
      return await restoreBackup(request, env.BACKUP_BUCKET);
    }
    
    return new Response('Not found', { status: 404 });
  }
};

async function performBackup(bucket: R2Bucket): Promise<void> {
  const timestamp = new Date().toISOString();
  
  // Brain-Daten
  const brainData = await fetch('http://127.0.0.1:9090/backup').then(r => r.arrayBuffer());
  await bucket.put(`brain/${timestamp}.tar.gz`, brainData);
  
  // Config-Daten
  const configData = await fetch('http://127.0.0.1:9090/config/export').then(r => r.arrayBuffer());
  await bucket.put(`config/${timestamp}.json`, configData);
  
  // Qdrant-Daten
  const qdrantData = await fetch('http://127.0.0.1:6333/snapshots').then(r => r.arrayBuffer());
  await bucket.put(`qdrant/${timestamp}.tar.gz`, qdrantData);
}
```

### 3.2 KV Configuration System
```typescript
// /workspace/nexify/07_tools_cli/cloudflare/workers/config/src/index.ts

interface Env {
  CONFIG_KV: KVNamespace;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const key = url.pathname.replace('/config/', '');
    
    if (request.method === 'GET') {
      const value = await env.CONFIG_KV.get(key);
      return new Response(value || 'Not found', { status: value ? 200 : 404 });
    }
    
    if (request.method === 'PUT') {
      const value = await request.text();
      await env.CONFIG_KV.put(key, value);
      return new Response('OK');
    }
    
    if (request.method === 'DELETE') {
      await env.CONFIG_KV.delete(key);
      return new Response('Deleted');
    }
    
    return new Response('Method not allowed', { status: 405 });
  }
};
```

### 3.3 D1 Datenbank Schema
```sql
-- /workspace/nexify/07_tools_cli/cloudflare/d1/schema/001_core.sql

-- Users & Auth
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  role TEXT DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tasks & Kanban
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  assigned_to TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (assigned_to) REFERENCES users(id)
);

-- Evidence
CREATE TABLE IF NOT EXISTS evidence (
  id TEXT PRIMARY KEY,
  task_id TEXT,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  file_path TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks(id)
);

-- System Metrics
CREATE TABLE IF NOT EXISTS metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  metric_name TEXT NOT NULL,
  metric_value REAL NOT NULL,
  tags TEXT, -- JSON
  recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Config Store
CREATE TABLE IF NOT EXISTS config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  encrypted BOOLEAN DEFAULT FALSE,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 4. Phase 3: Messaging & AI (Woche 3)

### 4.1 Queue System
```typescript
// /workspace/nexify/07_tools_cli/cloudflare/workers/messaging/src/index.ts

interface Env {
  TASK_QUEUE: Queue;
  EVENT_QUEUE: Queue;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const body = await request.json();
    
    if (request.url.includes('/queue/task')) {
      await env.TASK_QUEUE.send(body);
      return new Response('Task queued');
    }
    
    if (request.url.includes('/queue/event')) {
      await env.EVENT_QUEUE.send(body);
      return new Response('Event queued');
    }
    
    return new Response('Not found', { status: 404 });
  },
  
  async queue(batch: MessageBatch, env: Env): Promise<void> {
    for (const message of batch.messages) {
      try {
        await processMessage(message.body);
        message.ack();
      } catch (error) {
        message.retry();
      }
    }
  }
};

async function processMessage(body: any): Promise<void> {
  // Brain API aufrufen
  await fetch('http://127.0.0.1:9090/process', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}
```

### 4.2 Workers AI Integration
```typescript
// /workspace/nexify/07_tools_cli/cloudflare/workers/ai/src/index.ts

interface Env {
  AI: Ai;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { text, task } = await request.json();
    
    let result;
    
    switch (task) {
      case 'classify':
        result = await env.AI.run('@cf/huggingface/distilbert-sst-2-int8', {
          text: text,
        });
        break;
        
      case 'embed':
        result = await env.AI.run('@cf/baai/bge-base-en-v1.5', {
          text: text,
        });
        break;
        
      case 'summarize':
        result = await env.AI.run('@cf/facebook/bart-large-cnn', {
          input_text: text,
        });
        break;
        
      case 'translate':
        result = await env.AI.run('@cf/meta/m2m100-1.2b', {
          text: text,
          source_lang: 'de',
          target_lang: 'en',
        });
        break;
        
      default:
        return new Response('Unknown task', { status: 400 });
    }
    
    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
```

---

## 5. Phase 4: Monitoring & Analytics (Woche 4)

### 5.1 Analytics Engine
```typescript
// /workspace/nexify/07_tools_cli/cloudflare/workers/monitoring/src/index.ts

interface Env {
  ANALYTICS: AnalyticsEngineDataset;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const start = Date.now();
    
    // Request verarbeiten
    const response = await handleRequest(request);
    
    // Metriken aufzeichnen
    env.ANALYTICS.writeDataPoint({
      blobs: [
        request.url,
        request.method,
        response.status.toString(),
      ],
      doubles: [
        Date.now() - start, // Response Time
        1, // Request Count
      ],
    });
    
    return response;
  },
  
  async scheduled(event: ScheduledEvent, env: Env): Promise<void> {
    // System-Health-Metriken sammeln
    const health = await checkSystemHealth();
    
    env.ANALYTICS.writeDataPoint({
      blobs: ['system-health'],
      doubles: [
        health.cpu,
        health.memory,
        health.disk,
      ],
    });
  }
};

async function checkSystemHealth() {
  const brainHealth = await fetch('http://127.0.0.1:9090/health').then(r => r.json());
  const qdrantHealth = await fetch('http://127.0.0.1:6333/health').then(r => r.json());
  
  return {
    cpu: brainHealth.cpu || 0,
    memory: brainHealth.memory || 0,
    disk: brainHealth.disk || 0,
  };
}
```

---

## 6. Deployment Pipeline

### 6.1 GitHub Actions
```yaml
# /workspace/nexify/.github/workflows/cloudflare-deploy.yml

name: Deploy to Cloudflare

on:
  push:
    branches: [main]
    paths:
      - '07_tools_cli/cloudflare/**'

jobs:
  deploy-workers:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install Wrangler
        run: npm install -g wrangler
      
      - name: Deploy API Gateway
        working-directory: 07_tools_cli/cloudflare/workers/api-gateway
        run: wrangler deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CF_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CF_ACCOUNT_ID }}
      
      - name: Deploy Backup Worker
        working-directory: 07_tools_cli/cloudflare/workers/backup
        run: wrangler deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CF_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CF_ACCOUNT_ID }}
      
      - name: Deploy Config Worker
        working-directory: 07_tools_cli/cloudflare/workers/config
        run: wrangler deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CF_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CF_ACCOUNT_ID }}
  
  deploy-pages:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy Landingpage
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CF_API_TOKEN }}
          accountId: ${{ secrets.CF_ACCOUNT_ID }}
          command: pages deploy 07_tools_cli/cloudflare/pages/public --project-name=nexify-landing
```

### 6.2 Manual Deploy Script
```bash
#!/bin/bash
# /workspace/nexify/07_tools_cli/cloudflare/deploy.sh

set -e

echo "🚀 Deploying NeXify to Cloudflare..."

# Workers deployieren
echo "📦 Deploying Workers..."
cd 07_tools_cli/cloudflare/workers/api-gateway && wrangler deploy
cd ../backup && wrangler deploy
cd ../config && wrangler deploy
cd ../messaging && wrangler deploy
cd ../ai && wrangler deploy
cd ../monitoring && wrangler deploy

# Pages deployieren
echo "📄 Deploying Pages..."
cd ../../pages && wrangler pages deploy public --project-name=nexify-landing

# D1 Migrations
echo "🗄️ Running D1 Migrations..."
cd ../d1 && wrangler d1 migrations apply nexify-db

echo "✅ Deployment complete!"
```

---

## 7. Sicherheit

### 7.1 Secrets Management
```bash
# Cloudflare Secrets setzen
wrangler secret put BRAIN_API_KEY
wrangler secret put QDRANT_API_KEY
wrangler secret put BACKUP_SECRET
```

### 7.2 CORS Policy
```typescript
// In allen Workern
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://nexifyai.cloud',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
```

### 7.3 Rate Limiting
```typescript
// In API-Gateway Worker
const RATE_LIMIT = {
  window: 60, // 1 minute
  maxRequests: 100,
};

async function checkRateLimit(request: Request, env: Env): Promise<boolean> {
  const ip = request.headers.get('CF-Connecting-IP');
  const key = `rate:${ip}`;
  
  const current = await env.KV_CONFIG.get(key);
  const count = current ? parseInt(current) : 0;
  
  if (count >= RATE_LIMIT.maxRequests) {
    return false;
  }
  
  await env.KV_CONFIG.put(key, (count + 1).toString(), {
    expirationTtl: RATE_LIMIT.window,
  });
  
  return true;
}
```

---

## 8. Monitoring & Alerting

### 8.1 Health Check Endpoint
```typescript
// /api/health
async function healthCheck(env: Env): Promise<Response> {
  const checks = {
    brain: await checkBrain(),
    qdrant: await checkQdrant(),
    cloudflare: {
      workers: true,
      kv: true,
      r2: true,
      d1: true,
    },
  };
  
  const healthy = Object.values(checks).every(c => c.healthy);
  
  return new Response(JSON.stringify(checks), {
    status: healthy ? 200 : 503,
    headers: { 'Content-Type': 'application/json' },
  });
}
```

### 8.2 Alert Rules
```yaml
# Cloudflare Alerts (via Dashboard)
alerts:
  - name: "High Error Rate"
    condition: "error_rate > 5%"
    channel: "email"
    
  - name: "Worker Timeout"
    condition: "cpu_time > 8ms"
    channel: "slack"
    
  - name: "KV Storage Full"
    condition: "kv_storage > 900MB"
    channel: "email"
```

---

## 9. Zusammenfassung

### Phase 1 (Woche 1): Foundation
- [ ] Cloudflare Tunnel erweitern
- [ ] API-Gateway Worker deployen
- [ ] KV Namespace erstellen
- [ ] DNS konfigurieren

### Phase 2 (Woche 2): Storage
- [ ] R2 Buckets erstellen
- [ ] Backup Worker deployen
- [ ] Config Worker deployen
- [ ] D1 Datenbank erstellen

### Phase 3 (Woche 3): Messaging & AI
- [ ] Queues erstellen
- [ ] Messaging Worker deployen
- [ ] AI Worker deployen
- [ ] Integration testen

### Phase 4 (Woche 4): Monitoring
- [ ] Analytics Engine konfigurieren
- [ ] Monitoring Worker deployen
- [ ] Alerts einrichten
- [ ] Dashboard erstellen

### Erfolgskriterien:
- ✅ API-Gateway erreichbar über api.nexifyai.cloud
- ✅ Landingpage erreichbar über app.nexifyai.cloud
- ✅ Backups laufen automatisch in R2
- ✅ Config in KV gespeichert
- ✅ Tasks in D1 persistiert
- ✅ Messaging über Queues
- ✅ AI-Inference über Workers AI
- ✅ Monitoring über Analytics Engine

---

**NEXT:** CI-Brand Konzept
