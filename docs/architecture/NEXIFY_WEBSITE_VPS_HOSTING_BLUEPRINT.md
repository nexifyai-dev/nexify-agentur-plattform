# NEXIFY WEBSITE VPS HOSTING BLUEPRINT — P0-009

**Status:** V1.0 — Plan | **Version:** 1.0.0 | **Datum:** 2026-06-12
**Klassifikation:** nexify_internal

---

## 1. ÜBERSICHT

Dieses Blueprint definiert die Ziel-Architektur für das Hosting der NeXify-Website (`nexifyai.cloud`) und des Admin-Cockpits (`admin.nexifyai.cloud`) auf der bestehenden VPS-Infrastruktur.

**Prinzip:** Minimaler Aufwand, maximale Stabilität. Kein Kubernetes, kein Swarm. Docker-Compose + Nginx + Traefik.

---

## 2. ZIEL-TOPOLOGIE

```
                               ┌──────────────────┐
                               │   Cloudflare DNS  │
                               │   (A-Records)     │
                               └────────┬─────────┘
                                        │
                                        ▼
                               ┌──────────────────┐
                               │   Traefik :443   │
                               │   TLS-Terminator  │
                               │   LetsEncrypt     │
                               └──┬────┬────┬──────┘
                                  │    │    │
              ┌───────────────────┘    │    └──────────────────┐
              ▼                        ▼                       ▼
     ┌────────────────┐      ┌────────────────┐      ┌────────────────┐
     │ nexify-website  │      │ nexify-admin    │      │ nexify-api      │
     │ Nginx :80       │      │ Nginx :80       │      │ FastAPI :8001   │
     │ Static SPA      │      │ Static SPA      │      │ REST API        │
     └────────────────┘      └────────────────┘      └────────────────┘
              │                        │                       │
              └───────────┬────────────┘                       │
                          ▼                                    ▼
                 ┌──────────────────┐                  ┌────────────────┐
                 │   Supabase       │                  │   Qdrant       │
                 │   PostgreSQL     │                  │   (Brain)      │
                 └──────────────────┘                  └────────────────┘
```

---

## 3. DOCKER-STRUKTUR

### 3.1 Dockerfile.website

```dockerfile
# Multi-Stage: Build + Serve
FROM node:22-alpine AS builder
WORKDIR /app
COPY apps/web/package*.json ./
RUN npm ci
COPY apps/web/ .
RUN npm run build

FROM nginx:alpine
COPY deploy/nginx-frontend/website.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost/ || exit 1
```

### 3.2 Dockerfile.admin

```dockerfile
# Multi-Stage: Build + Serve
FROM node:22-alpine AS builder
WORKDIR /app
COPY apps/admin-chat/package*.json ./
RUN npm ci
COPY apps/admin-chat/ .
RUN npm run build

FROM nginx:alpine
COPY deploy/nginx-frontend/admin.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost/ || exit 1
```

### 3.3 Nginx-Config: website.conf

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cloud.umami.is; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://api.nexifyai.cloud https://admin.nexifyai.cloud https://cloud.umami.is; frame-ancestors 'none'; form-action 'self'" always;

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static assets with cache
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Health check
    location /health {
        return 200 "OK";
    }
}
```

### 3.4 Nginx-Config: admin.conf

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Security headers (stricter for admin)
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "same-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://api.nexifyai.cloud; frame-ancestors 'none'; form-action 'self'" always;

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static assets with cache
    location /_next/static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## 4. CI/CD-PIPELINE

### 4.1 GitHub Actions (deploy.yml — neue Version)

```yaml
name: Deploy to VPS
on:
  push:
    branches: [main]
    paths-ignore:
      - 'docs/**'
      - '**/*.md'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6

      - name: Build website image
        run: docker build -f deploy/docker/Dockerfile.website -t nexify-website:${{ github.sha }} .

      - name: Build admin image
        run: docker build -f deploy/docker/Dockerfile.admin -t nexify-admin:${{ github.sha }} .

      - name: Save and compress images
        run: |
          docker save nexify-website:${{ github.sha }} | gzip > /tmp/website.tar.gz
          docker save nexify-admin:${{ github.sha }} | gzip > /tmp/admin.tar.gz

      - name: Deploy to VPS
        env:
          SSH_KEY: ${{ secrets.VPS_SSH_KEY }}
        run: |
          scp /tmp/website.tar.gz /tmp/admin.tar.gz root@${{ secrets.VPS_HOST }}:/tmp/
          ssh root@${{ secrets.VPS_HOST }} "
            docker load < /tmp/website.tar.gz
            docker load < /tmp/admin.tar.gz
            docker tag nexify-website:${{ github.sha }} nexify-website:latest
            docker tag nexify-admin:${{ github.sha }} nexify-admin:latest
            docker compose up -d nexify-website nexify-admin
          "

      - name: Post-deploy health check
        run: |
          sleep 15
          curl -sf https://nexifyai.cloud/health || exit 1
          curl -sf https://admin.nexifyai.cloud/health || exit 1
          curl -sf https://api.nexifyai.cloud/api/health || exit 1
```

---

## 5. ENV-VAR-MANAGEMENT

### 5.1 Notwendige Variablen

| Variable | Quelle | Wert (Beispiel) |
|---|---|---|
| `REACT_APP_BACKEND_URL` | Website Build | `https://api.nexifyai.cloud` |
| `REACT_APP_SUPABASE_URL` | Website Build | `http://supabase_kong:8000` |
| `REACT_APP_SUPABASE_ANON_KEY` | Website Build | `<aus Supabase-Konfig>` |
| `REACT_APP_RECAPTCHA_KEY` | Website Build | `<von Google>` |

### 5.2 Build-Strategie

Vite injected `process.env.REACT_APP_*` zur Build-Zeit via `vite.config.js`.  
Daher muss **pro Umgebung einmalig gebuild** werden.

**Empfehlung:** Build auf GitHub Actions mit Umgebungs-Variablen als Secrets.

---

## 6. MONITORING

| Metrik | Tool | Quelle |
|---|---|---|
| HTTP-Status | Traefik-Logs | `docker logs traefik` |
| Container-Health | Docker Healthcheck | `docker ps` |
| Uptime | Cloudflare | Dashboard |
| Performance | Lighthouse CI | GitHub Actions |
| Analytics | Umami (optional) | Separater Docker-Container |

---

## 7. SICHERHEIT

- **TLS**: Traefik LetsEncrypt (bereits aktiv)
- **HSTS**: via Cloudflare (bereits aktiv)
- **CSP**: via Nginx-Config (neu)
- **CORS**: via API-Backend (bereits aktiv)
- **Rate-Limiting**: via Cloudflare WAF
- **Container-Isolation**: Jeder Service eigener Container
- **Keine Secrets im Build**: Env-Vars nur zur Build-Zeit via GitHub Secrets

---

## 8. KOSTENVERGLEICH

| Aspekt | Vercel (Pro) | VPS (lokal) |
|---|---|---|
| Hosting | ~$20-50/Monat | 0 (bereits bezahlt) |
| Build-Minuten | Inkludiert, begrenzt | Unbegrenzt |
| Bandbreite | 1TB/Monat | Unbegrenzt |
| Edge-Functions | 1000h/Monat | Nicht nötig (API auf VPS) |
| Analytics | Inkludiert | Ersatz via Umami |
| SSL | Automatisch | Traefik LetsEncrypt |

**Ersparnis:** ~$20-50/Monat, plus Unabhängigkeit von Vercel-SLA.

---

## 9. CHECKLISTE VOR DNS-SWITCH

- [ ] `Dockerfile.website` erstellt und getestet
- [ ] `Dockerfile.admin` erstellt und getestet
- [ ] `website.conf` erstellt (SPA fallback, CSP, Cache)
- [ ] `admin.conf` erstellt (SPA fallback, CSP, Cache)
- [ ] Env-Vars dokumentiert in `.env.vps`
- [ ] Vercel-Dependencies aus Code entfernt
- [ ] Staging-Build läuft fehlerfrei
- [ ] Playwright-Tests gegen Staging bestanden
- [ ] Lighthouse ≥ 90 auf Staging
- [ ] Traefik-Router-Datei vorbereitet
- [ ] Rollback-Plan ausgedruckt/verfügbar

---

## 10. ÄNDERUNGSHISTORIE

| Datum | Version | Änderung |
|---|---|---|
| 2026-06-12 | 1.0.0 | Initial — VPS-Hosting-Blueprint für Website + Admin |

---

*Erstellt 2026-06-12 für P0-009. Gültig bis Migration abgeschlossen oder Architektur geändert.*
