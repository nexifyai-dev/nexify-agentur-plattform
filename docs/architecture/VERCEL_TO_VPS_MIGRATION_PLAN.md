# VERCEL TO VPS MIGRATION PLAN — P0-009

**Status:** V1.0 — Plan | **Version:** 1.0.0 | **Datum:** 2026-06-12
**Klassifikation:** nexify_internal

---

## 1. ZIEL

Die NeXify-Website (`nexifyai.cloud`) und das Admin-Cockpit (`admin.nexifyai.cloud`) werden von Vercel auf die lokale VPS-Infrastruktur migriert.

**Grund:** Volle Kontrolle über Build, Deployment, Routing, Infrastruktur und Kosten. Keine Abhängigkeit von Vercels Plattform-SLA oder Preismodell.

**Nicht-Ziel:** Hermes WebUI / NeXify Workstation — läuft bereits auf VPS via Docker.

---

## 2. IST-ZUSTAND

### 2.1 Routen-Inventar

| Domain | Aktuell | Server | Bemerkung |
|---|---|---|---|
| `nexifyai.cloud` | Vercel / Hermes (501) | Hermes WebUI :8787 | Traefik routed auf Hermes, Website-Kopie auf Vercel |
| `www.nexifyai.cloud` | Cloudflare 522 | — | Nicht erreichbar |
| `admin.nexifyai.cloud` | Vercel (522) | VPS Backend | API lebt auf VPS, Admin-Frontend auf Vercel |
| `api.nexifyai.cloud` | VPS (FastAPI) | nexify-api | Läuft bereits auf VPS |
| `agentmemory.nexifyai.cloud` | VPS (agentmemory) | :3111 | Läuft auf VPS |
| `brain.nexifyai.cloud` | VPS (Brain) | :9090 | Läuft auf VPS |
| `nexifyautomate.com` | Unbekannt (522) | — | Nicht erreichbar |

### 2.2 Build- und Deploy-Dependencies

| App | Build-Tool | Output | Env-Vars |
|---|---|---|---|
| Web (Landing) | Vite + React 19 | `build/` | `REACT_APP_BACKEND_URL`, `REACT_APP_SUPABASE_URL`, `REACT_APP_SUPABASE_ANON_KEY`, `REACT_APP_RECAPTCHA_KEY` |
| Admin-Chat (Next.js) | Next.js 14 | `.next/` | Gleiche Env-Vars + API-Keys |
| Services/API | FastAPI + Uvicorn | Python direkt | `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `OPENAI_API_KEY`, etc. |

### 2.3 API-Integrationen

- **Supabase** — Auth, DB. Läuft lokal via Docker (Port 54322) + Cloud. Env-Vars.
- **Brain (Qdrant)** — Lokal via Docker (Port 6333). Env-Var `QDRANT_URL`.
- **Redis** — Lokal via Docker (Port 6379).
- **9Router** — Lokal via Docker (Port 32794/20128). Env-Vars für API-Key.
- **Vercel Analytics / Speed Insights** — Nur im Web-Frontend. Beim VPS-Wechsel ersatzlos streichbar.

### 2.4 GitHub-Workflows

- `deploy.yml` — Triggers Vercel deploy on push to `main`
- `test.yml` — CI-Tests
- `security-*.yml` — Sicherheits-Scans
- CI/CD muss auf VPS-Docker-Build umgestellt werden

---

## 3. ZIEL-ARCHITEKTUR

### 3.1 Übersicht

```
Internet (Cloudflare)
       │
       ▼
   Traefik (Port 443/80)
       │
       ├── nexifyai.cloud          → static Nginx (Website-Build)
       ├── www.nexifyai.cloud      → static Nginx (Website-Build)
       ├── admin.nexifyai.cloud    → static Nginx (Admin-Build)
       ├── api.nexifyai.cloud      → nexify-api (Python FastAPI)
       ├── brain.nexifyai.cloud    → Brain-API (Python)
       ├── agentmemory.nexifyai.cloud → agentmemory
       └── work.nexifyai.cloud     → Hermes WebUI (Workstation)
```

### 3.2 Komponenten

| Komponente | Typ | Port | Docker | Bemerkung |
|---|---|---|---|---|
| **Website** | Statischer Build (Vite) | — | Nginx-Container | `apps/web/build/` in Image |
| **Admin-Chat** | Statischer Build (Next.js) | — | Nginx-Container | `apps/admin-chat/build/` in Image |
| **API** | Python FastAPI | :8001 | existiert (`nexify-api`) | Bereits auf VPS |
| **nginx-frontend** | Reverse Proxy + Static | :80/:443 | existiert (`nexify-proxy`) | Erweitert um Website/Admin |
| **Traefik** | TLS-Terminator + Router | :443 | existiert | Routen hinzufügen |

### 3.3 Docker-Compose (Erweiterung)

```yaml
# Neue Services in bestehendem Docker-Compose
services:
  nexify-website:
    build:
      context: /root/nexifyai-platform
      dockerfile: deploy/docker/Dockerfile.website
    expose:
      - "80"
    networks:
      - default

  nexify-admin:
    build:
      context: /root/nexifyai-platform
      dockerfile: deploy/docker/Dockerfile.admin
    expose:
      - "80"
    networks:
      - default
```

### 3.4 Traefik-Routing (Erweiterung)

```yaml
# /docker/traefik-vsrs/dynamic/nexifyai-website.yml
http:
  routers:
    nexifyai-website:
      rule: Host(`nexifyai.cloud`) || Host(`www.nexifyai.cloud`)
      entryPoints:
        - websecure
      tls:
        certResolver: letsencrypt
      service: nexify-website-svc
  services:
    nexify-website-svc:
      loadBalancer:
        servers:
          - url: http://nexify-website:80

    nexify-admin-svc:
      loadBalancer:
        servers:
          - url: http://nexify-admin:80
```

---

## 4. MIGRATIONS-SCHRITTE

### Phase 1 — Vorbereitung (Offline)

1. **Build-Dockerfiles erstellen**
   - `deploy/docker/Dockerfile.website` — Multi-Stage: Node-Build + Nginx-Serve
   - `deploy/docker/Dockerfile.admin` — Multi-Stage: Node-Build + Nginx-Serve
   - Basis: `nginx:alpine`, Kopie des Build-Outputs nach `/usr/share/nginx/html`

2. **Nginx-Config erstellen**
   - `deploy/nginx-frontend/website.conf` — SPA-Routing (fallback to index.html)
   - `deploy/nginx-frontend/admin.conf` — SPA-Routing + API-Proxy

3. **Env-Vars prüfen**
   - Liste aller `REACT_APP_*` Variablen aus `apps/web/` extrahieren
   - Lokale Supabase-URL (`http://supabase_kong:8000`) statt Remote
   - Backend-URL auf `https://api.nexifyai.cloud` setzen
   - Datei: `.env.vps` (nicht committen)

4. **Vercel-Dependencies entfernen**
   - `@vercel/analytics` und `@vercel/speed-insights` aus `package.json` entfernen
   - Analytics-Komponenten aus `App.jsx` entfernen
   - `vercel.json` für lokalen Build irrelevant

### Phase 2 — Staging (paralleler Betrieb)

5. **Staging-Subdomain einrichten**
   - `stage.nexifyai.cloud` → Traefik → `nexify-website:80` (Staging-Container)
   - Build via GitHub Actions → SSH-Copy + Container-Restart

6. **Docker-Build testen**
   ```bash
   cd /root/nexifyai-platform
   docker build -f deploy/docker/Dockerfile.website -t nexify-website:stage .
   docker run -d --name nexify-website-stage -p 127.0.0.1:8080:80 nexify-website:stage
   curl http://127.0.0.1:8080  # Soll 200 liefern
   ```

7. **Playwright-Tests gegen Staging**
   - Alle Routen der Landing-Page testen
   - Admin-Login-Flow testen
   - API-Calls über Proxy testen

8. **Health-Checks**
   - `lighthouse`-Score messen (Vergleich Vercel vs. VPS)
   - HTTP-Status-Codes prüfen (kein 404 auf SPA-Routen)
   - CSP-Header prüfen

### Phase 3 — DNS-Switch (Cutover)

9. **Cloudflare-DNS aktualisieren**
   - `nexifyai.cloud` A-Record auf VPS-IP setzen (bisher: CNAME auf Vercel)
   - TTL auf 60s für schnellen Switch
   - `www.nexifyai.cloud` A-Record auf VPS-IP
   - `admin.nexifyai.cloud` A-Record auf VPS-IP

10. **Traefik-Router aktivieren**
    - `nexifyai-website.yml` in `/docker/traefik-vsrs/dynamic/` ablegen
    - Traefik-Konfiguration neu laden (`docker compose exec traefik kill -HUP 1`)
    - Prüfen: `https://nexifyai.cloud` → 200

11. **DNS-Propagation prüfen**
    ```bash
    while true; do
      dig +short nexifyai.cloud @8.8.8.8
      sleep 30
    done
    ```
    Warten bis VPS-IP erscheint.

### Phase 4 — Validierung

12. **Playwright-Tests gegen Produktion**
    - Landing-Page: Alle Sektionen sichtbar
    - Admin-Cockpit: Login funktionsfähig
    - Booking: Formular abschickbar
    - Blog: Artikelliste + Detail
    - API: Health-Endpoint antwortet

13. **Lighthouse-Audit**
    - Performance ≥ 90
    - Accessibility ≥ 90
    - Best Practices ≥ 90
    - SEO ≥ 90

14. **Sicherheits-Checks**
    - CSP-Header gesetzt
    - HSTS aktiv
    - Keine Vercel-Header mehr sichtbar
    - Keine internen Ports exponiert

### Phase 5 — Vercel-Deaktivierung

15. **Vercel-Deployment pausieren**
    - GitHub-Integration deaktivieren
    - Deploy-Hook löschen oder auf read-only setzen
    - Vercel-Projekt auf "Pause" setzen (nicht löschen — Rollback)

16. **GitHub-Workflow anpassen**
    - `deploy.yml`: Vercel-Trigger durch Docker-Build + SSH-Copy ersetzen
    - Neuer Job: `docker build` + `docker save` + `scp` + `docker compose up -d`

17. **Vercel erst löschen wenn:**
    - 7 Tage stabiler VPS-Betrieb
    - Keine Ausfälle durch Infrastruktur
    - Rollback-Plan nicht benötigt
    - Monitoring aktiv

---

## 5. RISIKEN UND MASSNAHMEN

| Risiko | Wahrscheinlichkeit | Maßnahme |
|---|---|---|
| DNS-Propagation-Verzögerung | Hoch | TTL 60s, Überwachung, Parallelbetrieb |
| CSP-Header fehlen | Mittel | Vorab testen, Header in Nginx/Proxy setzen |
| API-CORS-Probleme | Mittel | Backend-CORS auf neue Domains erweitern |
| Build-Unterschiede Vercel/VPS | Niedrig | Docker-Build lokal testen, gleiche Node-Version |
| Supabase-Konnektivität | Niedrig | Läuft bereits lokal auf VPS |
| Vercel Analytics-Verlust | Niedrig | Ersatz durch lokales Analytics (umami) |
| Zertifikats-Erneuerung | Niedrig | Traefik LetsEncrypt läuft bereits |
| Rollback-Komplexität | Mittel | Vercel-Projekt pausieren, nicht löschen |

---

## 6. ZEITPLAN

| Schritt | Dauer | Abhängigkeit |
|---|---|---|
| Dockerfiles erstellen | 1h | — |
| Nginx-Configs erstellen | 1h | Dockerfiles |
| Env-Vars dokumentieren | 30min | Code-Review |
| Vercel-Deps entfernen | 30min | — |
| Staging aufsetzen | 2h | Dockerfiles + Nginx |
| Tests (Playwright, Lighthouse) | 2h | Staging |
| DNS-Switch | 15min | Staging-Tests bestanden |
| Validierung | 2h | DNS-Switch |
| Vercel-Deaktivierung | 30min | 7 Tage stabiler Betrieb |

**Gesamt:** ca. 10h Arbeit, verteilt auf 2-3 Tage.  
**Cutover-Fenster:** 15 Minuten DNS-Switch + 2h Validierung.

---

## 7. ERFOLGSKRITERIEN

- [ ] `https://nexifyai.cloud` lädt von VPS (HTTP 200, kein Cloudflare 522)
- [ ] `https://admin.nexifyai.cloud` lädt Admin-Cockpit
- [ ] `https://api.nexifyai.cloud` antwortet (Health 200)
- [ ] Alle SPA-Routen funktionieren (kein 404 bei Navigation)
- [ ] Lighthouse ≥ 90 in allen Kategorien
- [ ] CSP-, HSTS-, Security-Header gesetzt
- [ ] Keine Vercel-Header oder -Analytics sichtbar
- [ ] API-Calls aus Frontend funktionieren (CORS)
- [ ] Vercel-Projekt pausiert (nicht gelöscht)

---

## 8. ROLLBACK

1. **VPS-Seite**: `docker compose stop nexify-website nexify-admin`
2. **DNS**: Cloudflare-DNS auf Vercel-CNAME zurücksetzen
3. **Vercel**: Projekt reaktivieren, letzten Deploy auslösen
4. **Traefik**: `nexifyai-website.yml` aus `dynamic/` entfernen
5. **Traefik neu laden**: `docker compose exec traefik kill -HUP 1`
6. **GitHub-Workflow**: `deploy.yml` auf Vercel-Trigger zurücksetzen

> **Dauer Rollback:** < 30 Minuten (hauptsächlich DNS-Propagation)

---

*Erstellt 2026-06-12 für P0-009. Gültig bis Migration abgeschlossen.*
