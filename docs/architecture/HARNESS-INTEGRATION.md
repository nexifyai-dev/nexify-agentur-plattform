# FILE: docs/architecture/HARNESS-INTEGRATION.md
# NIR: 26.07.2026 16:00
# UPDATED: 26.07.2026 16:00
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI DevOps
# WHAT: Vollintegration Harness Open Source in das NeXify-Gesamtsystem
# WHY: Zentrales Git-Hosting, CI/CD und Artifact-Registry auf eigenem VPS —
#      unabhängig von GitHub/GitLab, vollständig selbst-gehostet.
# BEST-PRACTICE: GitHub bleibt Source-of-Truth; Harness OSS als redundanter
#                CI/CD-Pfad und selbst-gehostetes Git-Mirror.
# PITFALL: V-01: Harness OSS nutzt intern Port 3000 — auf dem VPS auf 3101 gemappt
#          (Website belegt 3000).
# PITFALL: V-02: PostgreSQL-Daten müssen vor dem ersten Start konfiguriert sein.
#          Passwort-Änderung nach erstem Start erfordert DB-Dump.
# PITFALL: V-03: SSH-Port 3022 direkt am Host — kein Traefik-Routing nötig/möglich.
# DEPENDS: Docker, docker-compose, Traefik, cloudflared, /etc/nexifyai/secrets.env
# DOCS-REF: https://developer.harness.io/docs/open-source/

# Harness Open Source — VPS Vollintegration

> **Stand:** 26.07.2026 | **Status:** Integriert | **Version:** 1.0.0
> **Owner:** NeXifyAI DevOps
> **Primärquelle:** `docs/architecture/HARNESS-INTEGRATION.md`

---

## 1. Was ist Harness Open Source?

Harness Open Source (ehemals Gitness) ist eine vollständige, selbst-gehostete DevOps-Plattform:

| Funktion | Beschreibung |
|----------|-------------|
| **Git-Hosting** | Repositories, Pull Requests, Code Review, Branch Protection |
| **CI/CD Pipelines** | YAML-basierte Pipelines, containerisiert, Multi-Stage |
| **Artifact Registry** | Docker-Images, Helm-Charts, Upstream-Proxy |
| **Gitspaces** | Cloud-Dev-Environments (On-Demand, IDE-Integration) |
| **Code Search** | Volltext-Suche über alle Repositories |
| **Webhooks** | Integration in externe Systeme |

**Lizenz:** Apache 2.0 | **Sprachen:** Go + TypeScript

---

## 2. Architektur-Integration

```
Internet (HTTPS)
    │
    ▼
Cloudflare Tunnel (cloudflared)
    │
    ▼
Traefik Reverse Proxy
    │  Host: harness.nexifyai.cloud → localhost:3101
    │
    ▼
┌──────────────────────────────────────────────────────────┐
│  VPS (srv1243952.hstgr.cloud)                             │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  Docker: nexify-harness (Port 3101:3000)             │ │
│  │  Image: harness/harness:latest                       │ │
│  │                                                       │ │
│  │  ┌─────────────────────┐  ┌─────────────────────┐   │ │
│  │  │  Git-Hosting         │  │  CI/CD Engine        │   │ │
│  │  │  Repos, PRs, Review  │  │  YAML Pipelines      │   │ │
│  │  └─────────────────────┘  └─────────────────────┘   │ │
│  │                                                       │ │
│  │  Volumes:                                             │ │
│  │  - nexify-harness-data:/data  (Repos + Config)       │ │
│  │  - /var/run/docker.sock       (CI-Runner)            │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  Docker: nexify-harness-db (Port 5433:5432)          │ │
│  │  Image: postgres:16-alpine                            │ │
│  │  Volume: nexify-harness-pgdata                        │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                           │
│  SSH (Port 3022) → direkt am Host, kein Traefik          │
└──────────────────────────────────────────────────────────┘
```

---

## 3. Spezifikationen

### 3.1 System-Anforderungen

| Metrik | Minimum | Empfohlen (Produktion) |
|--------|---------|------------------------|
| CPU | 2 vCPUs | 4 vCPUs |
| RAM | 3 GB | 8 GB |
| Disk | 20 GB | 100+ GB (für Git-Repos) |
| Docker | v24+ | v29+ |
| PostgreSQL | 14+ | 16 (enthalten) |

**Aktueller VPS:** 31 GB RAM, 387 GB Disk, Docker v29.5.3 → ausreichend ✓

### 3.2 Port-Belegung

| Port | Dienst | Bindung | Zugang |
|------|--------|---------|--------|
| 3101 | Harness Web UI | 127.0.0.1:3101 | via Traefik → Cloudflare |
| 3022 | Git-over-SSH | 0.0.0.0:3022 | direkt (VPS-IP) |
| 5433 | Harness PostgreSQL | 127.0.0.1:5433 | nur intern |

### 3.3 Docker Volumes

| Volume | Inhalt | Backup-Priorität |
|--------|--------|-----------------|
| `nexify-harness-data` | Git-Repositories, Harness-Config | **KRITISCH** |
| `nexify-harness-pgdata` | PostgreSQL-Datenbank | **KRITISCH** |

### 3.4 Netzwerk

Harness-Container laufen im Bridge-Network `nexify-harness-net`.
Kommunikation zwischen `harness` und `harness-db` erfolgt intern über Docker-DNS (`harness-db:5432`).

---

## 4. Installation

### 4.1 Einmalige Einrichtung (VPS)

```bash
# 1. Secrets setzen (UNBEDINGT vor dem ersten Start!)
sudo nano /etc/nexifyai/secrets.env
# Ergänzen:
# HARNESS_DB_PASSWORD=<sicheres-passwort>
# HARNESS_ADMIN_PASSWORD=<sicheres-passwort>
# HARNESS_ADMIN_EMAIL=admin@nexifyai.cloud
# HARNESS_URL_BASE=https://harness.nexifyai.cloud
# HARNESS_URL_GIT=https://harness.nexifyai.cloud

# 2. Setup-Skript (Dry-Run):
bash infra/harness/setup.sh --dry-run

# 3. Setup anwenden:
bash infra/harness/setup.sh --apply

# 4. Cloudflare Tunnel patchen (Anleitung: deploy/harness/cloudflare-tunnel.md)
# 5. Traefik-Route aktivieren (deploy/harness/traefik-routes.yml → /etc/traefik/dynamic/)
```

### 4.2 Manuell via Docker Compose

```bash
cd /opt/nexifyai/repos/nexify-agentur-plattform

# Nur Harness starten:
docker compose up -d harness-db harness

# Logs prüfen:
docker logs -f nexify-harness

# Status:
docker compose ps harness harness-db
```

### 4.3 Erster Login

1. Browser: `https://harness.nexifyai.cloud`
2. "Sign Up" → Admin-Account mit `HARNESS_ADMIN_EMAIL` + `HARNESS_ADMIN_PASSWORD`
3. Organisation anlegen: `nexifyai`
4. Erstes Repo: `nexify-agentur-plattform` (Mirror von GitHub)

---

## 5. Konfiguration

### 5.1 Umgebungsvariablen (Harness Container)

| Variable | Beschreibung | Beispiel |
|----------|-------------|---------|
| `GITNESS_DATABASE_DRIVER` | DB-Typ | `postgres` |
| `GITNESS_DATABASE_DATASOURCE` | DB-Connection-String | `host=harness-db...` |
| `GITNESS_URL_BASE` | Externe Basis-URL | `https://harness.nexifyai.cloud` |
| `GITNESS_URL_GIT` | Git-Clone-URL-Basis | `https://harness.nexifyai.cloud` |
| `GITNESS_SSH_SERVER_PORT` | SSH-Port | `3022` |
| `GITNESS_ROOT_PATH` | Daten-Verzeichnis im Container | `/data` |
| `GITNESS_PRINCIPAL_ADMIN_EMAIL` | Admin-Email (nur Erststart) | `admin@nexifyai.cloud` |
| `GITNESS_PRINCIPAL_ADMIN_PASSWORD` | Admin-Passwort (nur Erststart) | geheim |

### 5.2 Pipeline-Konfiguration

Pipelines werden als YAML-Dateien im `.harness/`-Verzeichnis des Repos gespeichert:

```
.harness/
├── pipeline.yml          ← Standard-Template (Lint + Test + Build)
└── ci-default.yml        ← Vollständige CI-Pipeline für dieses Repo
```

Pipelines können im Harness Web UI bearbeitet und getriggert werden.

---

## 6. Integration mit dem NeXify-Gesamtsystem

### 6.1 GitHub als Source-of-Truth (Bidirektionaler Mirror)

```
GitHub (nexifyai-dev/nexify-agentur-plattform)
    │
    │ push → GitHub Actions (gitlab-sync.yml)
    ▼
GitLab (localhost:8922/nexifyai-dev/...)
    │
    │ (neu) Harness-Mirror-Webhook
    ▼
Harness OSS (harness.nexifyai.cloud/nexifyai/nexify-agentur-plattform)
```

**GitHub → Harness Mirror einrichten:**
1. In Harness: Repo → Settings → Webhooks → GitHub-Push-Webhook
2. In GitHub: Settings → Webhooks → `https://harness.nexifyai.cloud/api/v1/repos/nexifyai/nexify-agentur-plattform/webhooks/trigger`

### 6.2 CI/CD-Redundanz

| Pfad | Trigger | Primär |
|------|---------|--------|
| GitHub Actions | Push zu GitHub | ✅ Primär |
| GitLab CI | Push via gitlab-sync | Redundanz |
| **Harness CI** | Push zu GitHub/Harness | **Redundanz** |

### 6.3 Traefik-Integration

Die Datei `deploy/harness/traefik-routes.yml` muss in den Traefik-File-Provider-Pfad symlinked werden:

```bash
ln -sf /opt/nexifyai/repos/nexify-agentur-plattform/deploy/harness/traefik-routes.yml \
       /etc/traefik/dynamic/harness.yml
```

Traefik lädt File-Provider-Configs automatisch — kein Neustart nötig.

### 6.4 Cloudflare Tunnel

Siehe `deploy/harness/cloudflare-tunnel.md` für den vollständigen Konfigurationspatch.

### 6.5 VPS-Worker-Integration

Der VPS-Worker-Workflow (`.github/workflows/vps-worker.yml`) kann optional um einen Harness-Healthcheck im `quick-ping`-Job erweitert werden:

    # Beispiel-Ergänzung in vps-worker.yml (ping-Schritt):
    - name: ping harness
      run: curl -sf http://127.0.0.1:3101/api/v1/system/health | jq .status

---

## 7. Betrieb

### 7.1 Gesundheitsprüfung

```bash
# Harness API-Health:
curl -sf http://127.0.0.1:3101/api/v1/system/health | jq .

# Container-Status:
docker compose ps harness harness-db

# Harness-Logs:
docker logs nexify-harness --tail 50

# DB-Status:
docker exec nexify-harness-db pg_isready -U harness -d harnessdb
```

### 7.2 Updates

```bash
# Neues Harness-Image ziehen:
docker compose pull harness

# Rolling Restart:
docker compose up -d harness

# Nach Update prüfen:
curl -sf http://127.0.0.1:3101/api/v1/system/health | jq .version
```

### 7.3 Backup

```bash
# PostgreSQL-Dump:
docker exec nexify-harness-db pg_dump -U harness harnessdb \
  > /var/backup/harness-db-$(date +%Y%m%d).sql

# Harness-Daten (Git-Repos + Config):
docker run --rm -v nexify-harness-data:/data -v /var/backup:/backup \
  alpine tar czf /backup/harness-data-$(date +%Y%m%d).tar.gz /data
```

### 7.4 Rollback

```bash
# Harness auf vorherige Image-Version zurückrollen:
docker compose stop harness
docker run -d --name nexify-harness-prev \
  -e GITNESS_DATABASE_DRIVER=postgres ... \
  harness/harness:<prev-tag>

# Oder: Container stoppen, DB-Dump einspielen
docker compose down harness harness-db
docker exec nexify-harness-db psql -U harness harnessdb < /var/backup/harness-db-<datum>.sql
docker compose up -d harness-db harness
```

---

## 8. Sicherheit

| Aspekt | Maßnahme |
|--------|---------|
| Passwörter | Nur in `/etc/nexifyai/secrets.env` (chmod 600) |
| Web UI | Nur via HTTPS (Traefik + Let's Encrypt) |
| SSH | Direkt am Host, Firewall auf Port 3022 beschränken |
| PostgreSQL | Nur intern (127.0.0.1:5433) |
| Admin-Account | HARNESS_ADMIN_EMAIL/PASSWORD nach Erststart ändern |
| Docker-Socket | Nur Harness-Container hat Zugang (CI-Runner) |

---

## 9. Governance

- **Automation-Register:** `docs/governance/12_register/automation-control-register-v1.json` — Einträge `AUTO-HARNESS-001..002`
- **Evidence:** Nach jeder Harness-Pipeline: `docs/governance/08_evidence/HARNESS_CI_*.md`
- **§11 Monitoring:** VPS-Worker `quick-ping` prüft `http://127.0.0.1:3101/api/v1/system/health`

---

## 10. Fehler-Szenarien

| Szenario | Erkennung | Aktion |
|----------|-----------|--------|
| Harness offline | `curl 127.0.0.1:3101` fails | `docker compose restart harness` |
| DB nicht erreichbar | Harness Startfehler | `docker compose restart harness-db` |
| Disk voll (Git-Repos) | Container-Exit | Git-LFS-Repos prüfen, `docker system prune` |
| Port 3022 belegt | SSH-Fehler | `ss -tlnp | grep 3022` |
| URL_BASE falsch | Clone-Fehler | `GITNESS_URL_BASE` in secrets.env korrigieren |

---

*Erstellt: 26.07.2026 | Methode: Harness OSS + Docker + Traefik + Cloudflare | Keine destruktiven Aktionen*
