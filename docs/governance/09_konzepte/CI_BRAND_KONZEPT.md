# NeXify AI OS - CI-Brand Konzept
# Einheitliches Design für alle OSS-Integrationen

**Erstellt:** 2026-06-23
**Agent:** OSS Agent
**Status:** ✅ Definiert

---

## 1. NeXify CI-Brand Identität

### 1.1 Farbschema
| Farbe | Hex-Code | Verwendung |
|-------|----------|------------|
| NeXify Blau (Primary) | `#0066FF` | Header, Buttons, Links |
| NeXify Cyan (Accent) | `#00CCFF` | Highlights, Akzente |
| NeXify Weiß | `#FFFFFF` | Hintergrund, Text |
| NeXify Dunkel | `#0A0E27` | Dark Mode, Footer |
| NeXify Grau | `#F5F7FA` | Sekundäre Hintergründe |

### 1.2 Typografie
| Element | Schrift | Größe |
|---------|---------|-------|
| H1 | Inter Bold | 32px |
| H2 | Inter SemiBold | 24px |
| H3 | Inter Medium | 20px |
| Body | Inter Regular | 16px |
| Small | Inter Regular | 14px |

### 1.3 Logo-Verwendung
- **Header:** NeXify Logo (200x50px)
- **Favicon:** NeXify Icon (32x32px)
- **Email:** NeXify Logo (300x75px)
- **Login:** NeXify Logo zentriert (400x100px)

---

## 2. Domain-Struktur

### 2.1 Subdomain-Mapping
| Service | Domain | Zweck |
|---------|--------|-------|
| Analytics (Plausible) | analytics.nexifyai.cloud | Web-Analytics |
| Analytics (Matomo) | matomo.nexifyai.cloud | Erweiterte Analytics |
| Status | status.nexifyai.cloud | Uptime-Monitoring |
| CI/CD | ci.nexifyai.cloud | Woodpecker CI |
| Database | db.nexifyai.cloud | CockroachDB Admin |
| AI | ai.nexifyai.cloud | Ollama LLM |
| Web | web.nexifyai.cloud | Caddy Webserver |
| Brain | brain.nexifyai.cloud | NeXify Brain API |
| AgentMemory | agentmemory.nexifyai.cloud | Agent Memory |

### 2.2 SSL/TLS
- **Alle Domains:** Let's Encrypt (automatisch via Traefik)
- **Mindest-TLS-Version:** 1.2
- **HSTS:** Enabled (max-age=31536000)

---

## 3. Service-Branding

### 3.1 Grafana
```json
{
  "branding": {
    "logo": "/public/img/nexify-logo.svg",
    "loginLogo": "/public/img/nexify-login.png",
    "favicon": "/public/img/nexify-favicon.ico",
    "primaryColor": "#0066FF",
    "accentColor": "#00CCFF"
  }
}
```

### 3.2 Uptime Kuma
- **Logo Upload:** NeXify Logo (200x50px)
- **Status Page Theme:** NeXify Blue
- **Custom CSS:** Anpassung an NeXify Design
- **Footer:** "Powered by NeXify AI"

### 3.3 Plausible Analytics
- **Logo:** NeXify Logo
- **Custom Domain:** analytics.nexifyai.cloud
- **Theme:** Light/Dark Mode

### 3.4 Matomo
- **Logo Upload:** NeXify Logo
- **Custom Theme:** NeXify Blue
- **Email-Benachrichtigungen:** NeXify Branding

### 3.5 Woodpecker CI
- **Logo:** NeXify Logo
- **Custom Domain:** ci.nexifyai.cloud
- **Theme:** NeXify Blue

### 3.6 CockroachDB
- **Admin UI:** db.nexifyai.cloud
- **Custom Branding:** NeXify Logo

### 3.7 Ollama
- **Web UI:** ai.nexifyai.cloud
- **Custom Theme:** NeXify Blue

### 3.8 Caddy
- **Default Page:** NeXify Landing Page
- **Error Pages:** NeXify Branding

---

## 4. Benachrichtigungen & Emails

### 4.1 Email-Template
```html
<div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: #0066FF; padding: 20px; text-align: center;">
    <img src="https://nexifyai.cloud/logo.png" alt="NeXify" height="40">
  </div>
  <div style="padding: 20px; background: #FFFFFF;">
    <h2 style="color: #0A0E27;">{{ subject }}</h2>
    <p style="color: #333;">{{ body }}</p>
  </div>
  <div style="background: #F5F7FA; padding: 15px; text-align: center; font-size: 12px; color: #666;">
    © 2026 NeXify AI — Powered by Open Source
  </div>
</div>
```

### 4.2 Webhook-Format
```json
{
  "channel": "#nexify-alerts",
  "username": "NeXify AI",
  "icon_url": "https://nexifyai.cloud/favicon.ico",
  "attachments": [{
    "color": "#0066FF",
    "title": "{{ alert_title }}",
    "text": "{{ alert_message }}",
    "footer": "NeXify AI Monitoring",
    "ts": {{ timestamp }}
  }]
}
```

---

## 5. Dashboard-Design

### 5.1 Grafana Theme
```json
{
  "theme": {
    "name": "NeXify Dark",
    "colors": {
      "primary": "#0066FF",
      "secondary": "#00CCFF",
      "background": "#0A0E27",
      "surface": "#141832",
      "text": "#FFFFFF",
      "textSecondary": "#A0AEC0"
    }
  }
}
```

### 5.2 Standard-Dashboards
1. **System Overview** - CPU, RAM, Disk, Network
2. **Database Health** - PG, Mongo, Redis, Qdrant, CockroachDB
3. **Container Status** - Alle 32 Container
4. **Security Events** - CrowdSec, Fail2Ban, Trivy
5. **CI/CD Pipelines** - Woodpecker, GitHub Actions
6. **Analytics** - Plausible, Matomo Stats
7. **AI/ML** - Ollama, 9Router, Qdrant

---

## 6. API-Branding

### 6.1 API Response Header
```
X-Powered-By: NeXify AI
X-NeXify-Version: 1.0
X-Request-ID: {{ uuid }}
```

### 6.2 API Error Response
```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Something went wrong",
    "request_id": "req_abc123",
    "support": "support@nexifyai.cloud"
  }
}
```

### 6.3 API Documentation
- **URL:** api.nexifyai.cloud/docs
- **Theme:** NeXify Blue
- **Logo:** NeXify Logo

---

## 7. Security Branding

### 7.1 Login Page
```html
<div class="login-container">
  <div class="login-header">
    <img src="/logo.svg" alt="NeXify AI" class="login-logo">
    <h1>NeXify AI OS</h1>
    <p>Secure Access Portal</p>
  </div>
  <form class="login-form">
    <!-- Login Fields -->
  </form>
  <div class="login-footer">
    <p>Powered by Open Source</p>
  </div>
</div>
```

### 7.2 Error Pages
- **404:** NeXify Branding + "Page not found"
- **500:** NeXify Branding + "Service unavailable"
- **403:** NeXify Branding + "Access denied"

---

## 8. Monitoring-Integration

### 8.1 Prometheus Labels
```yaml
global:
  external_labels:
    environment: production
    team: nexify-ai
    project: nexifyai-platform
```

### 8.2 Alertmanager Templates
```yaml
templates:
  - '/etc/alertmanager/templates/nexify-*.tmpl'

route:
  group_by: ['alertname', 'cluster', 'service']
  receiver: 'nexify-webhook'

receivers:
  - name: 'nexify-webhook'
    webhook_configs:
      - url: 'https://hooks.nexifyai.cloud/alerts'
        send_resolved: true
```

---

## 9. Implementierungs-Checkliste

### 9.1 Sofort (Tag 1)
- [ ] NeXify Logo in Grafana hochladen
- [ ] NeXify Logo in Uptime Kuma hochladen
- [ ] Custom CSS für Uptime Kuma
- [ ] Grafana Theme konfigurieren

### 9.2 Kurzfristig (Woche 1)
- [ ] Alle Subdomains unter *.nexifyai.cloud konfigurieren
- [ ] SSL/TLS für alle Services
- [ ] NeXify Logo in Plausible
- [ ] NeXify Logo in Matomo
- [ ] NeXify Logo in Woodpecker

### 9.3 Mittelfristig (Monat 1)
- [ ] Custom Email-Templates
- [ ] Webhook-Branding
- [ ] API Response Header
- [ ] Error Pages
- [ ] Login Pages

### 9.4 Langfristig (Quartal 1)
- [ ] Custom Grafana Dashboards
- [ ] Automated Reports mit NeXify Branding
- [ ] Customer-Facing Status Pages
- [ ] API Documentation Portal

---

## 10. Assets-Checkliste

| Asset | Format | Größe | Status |
|-------|--------|-------|--------|
| Logo (Header) | SVG | 200x50 | ✅ Bereit |
| Logo (Login) | PNG | 400x100 | ✅ Bereit |
| Favicon | ICO | 32x32 | ✅ Bereit |
| Email Logo | PNG | 300x75 | ✅ Bereit |
| Social Media | PNG | 1200x630 | ✅ Bereit |
| Dark Mode Logo | SVG | 200x50 | ✅ Bereit |
| Icon | SVG | 64x64 | ✅ Bereit |

---

**Stand:** 2026-06-23
**Agent:** OSS Agent
**Status:** ✅ Vollständig definiert
