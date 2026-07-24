# P0-010: VPS Runtime Inventory

> **Status**: Fertiggestellt
> **Datum**: 2026-06-12
> **Host**: `srv1243952`
> **OS**: Ubuntu 26.04 LTS (Resolute Raccoon), Kernel 7.0.0-22-generic
> **Uptime**: 2 Tage 2:47h
> **Methode**: `docker`, `systemctl`, `df`, `free`
> **Keine destruktiven Aktionen**

---

## 1. System-Übersicht

| Metrik | Wert |
|--------|------|
| **Hostname** | srv1243952 |
| **Kernel** | 7.0.0-22-generic x86_64 |
| **OS** | Ubuntu 26.04 LTS |
| **CPU** | n/a (load avg: 0.89, 0.96, 0.80) |
| **RAM** | 31 GiB total, 7.9 GiB used (25%), 23 GiB available |
| **Swap** | 0 B (kein Swap) |
| **Disk** | 387 GiB total, 64 GiB used (17%), 324 GiB frei |
| **Docker** | v29.5.3, Compose v5.1.4 |
| **Running Container** | 23 |
| **Created (stoppt)** | 1 |
| **Running Systemd Services** | 27 |

**Last**: Gering (CPU < 1.0, RAM 25%, Disk 17%). Luft nach oben.

---

## 2. Systemd Services (nur relevante)

| Service | Status | Typ | Port | Klassifikation |
|---------|--------|-----|------|----------------|
| agentmemory.service | **running** | systemd | intern :3111 | **KEEP** |
| nexify-brain.service | **running** | systemd | intern :9090 | **KEEP** |
| cloudflared.service | **running** | systemd | Tunnel | **KEEP** |
| docker.service | **running** | systemd | Socket | **KEEP** |
| mongod.service | **running** | systemd | :27017 | **CHECK** (Dublette zu mongo-nexify Container) |
| nexify-9router-health.service | **failed** | systemd | — | **REMOVE_CANDIDATE** |
| nginx.service | **failed** | systemd | — | **REMOVE_CANDIDATE** (ersetzt durch Traefik) |

### Service-Details

#### agentmemory.service
- **Zustand**: Aktiv, läuft seit Tagen
- **Port**: 3111 (nur intern, via Cloudflare Tunnel erreichbar)
- **Health**: `/agentmemory/health` — CPU/Memory, 271 Functions
- **Typ**: Node.js (basiert auf iii-engine v0.11.2)
- **Abhängigkeit**: nexify-redis, nexify-qdrant
- **Rollback**: `systemctl start agentmemory`

#### nexify-brain.service
- **Zustand**: Aktiv
- **Port**: 9090 (intern)
- **Typ**: Python (SQLite)
- **Abhängigkeit**: keine
- **Rollback**: `systemctl start nexify-brain`

#### cloudflared.service
- **Zustand**: Aktiv
- **Tunnel**: Verbindet lokale Services mit Cloudflare
- **Domains**: `ai-router.nexifyai.cloud`, `agentmemory.nexifyai.cloud`, `brain.nexifyai.cloud`, `work.nexifyai.cloud`, `nexifyai.cloud`
- **Risiko**: Tunnel-Ausfall = keine öffentliche Erreichbarkeit
- **Rollback**: `systemctl start cloudflared`

#### mongod.service (Systemdienst)
- **Zustand**: Aktiv
- **Port**: 27017 (Standard MongoDB)
- **Konflikt**: Es gibt auch Container `mongo-nexify` (Status: Created). Zwei MongoDB-Instanzen = Dublette.
- **Klassifikation**: **CHECK** — Prüfen, ob dieser Systemdienst noch gebraucht wird, oder ob der Container ihn ersetzen sollte.

#### nexify-9router-health.service (FAILED)
- **Zustand**: failed (geladen aber gestorben)
- **Zweck**: Periodischer Healthcheck für 9Router
- **Segfault**: Möglicherweise durch 9Router-Neustart oder race condition
- **Klassifikation**: **REMOVE_CANDIDATE** — Healthcheck kann auch per Cron/Docker-Restart-Policy erfolgen
- **Risiko bei Entfernung**: Keines. Docker restart policy `unless-stopped` genügt.
- **Rollback**: Systemd Unit reaktivieren

#### nginx.service (FAILED)
- **Zustand**: failed
- **Zweck**: Ehemaliger Reverse Proxy, ersetzt durch Traefik
- **Klassifikation**: **REMOVE_CANDIDATE** — Wird nicht mehr gebraucht
- **Risiko bei Entfernung**: Keines solange Traefik läuft
- **Rollback**: `apt install nginx -y`

---

## 3. Container-Runtime-Übersicht

(Siehe detaillierte Liste in `/workspace/nexify/10_evidence/claude_startup/HERMES_CONTAINER_INVENTORY_P005.md`)

### Zusammenfassung nach Typ

| Typ | Anzahl | Beschreibung |
|-----|--------|-------------|
| **Infrastruktur** | 3 | 9Router, Traefik, nexify-proxy |
| **Datenhaltung** | 4 | nexify-redis, nexify-qdrant, mongo-nexify, agentmemory |
| **APIs** | 2 | nexify-api, coolify-agentmemory |
| **Hermes** | 4 | 3 WebUI + 1 Agent (1 primär, 1 fix-worktree, 2 legacy) |
| **Supabase** | 11 | Vollständiger Plattform-Stack |
| **Weitere** | 1 | Mongo (Created) |

### Volumen der Container-Images (virtuell)

Top-Verbraucher:
- hermes-agent (lq3f): 4.66 GB
- nexify-api: 2.55 GB
- supabase-db: 1.33 GB
- supabase-studio: 1.31 GB

---

## 4. Speicherplatz

| Pfad | Größe | Typ |
|------|-------|-----|
| `/` (root) | 64G / 387G (17%) | Hauptpartition |
| `/boot` | 175M / 989M (19%) | Boot |
| `/tmp` | 76M / 16G (1%) | RAM-TMPFS |
| `/var/lib/docker` | in `/` enthalten | Docker-Storage |

### Große Verzeichnisse in /root

| Verzeichnis | Größe | Beschreibung |
|-------------|-------|-------------|
| `/root/agentmemory/` | 2.9 GB | Agentmemory-Quelle + node_modules |
| `/root/llm.c/` | 1.3 GB | Karpathy LLM-Training (Projekt, nicht NeXify) |
| `/root/affilinet-portal-aachen/` | 643 MB | Git-Repo (614 MB .git) |
| `/root/nexifyai-platform/` | 601 MB | Git-Repo + Supabase |
| `/root/claude-code-templates/` | 478 MB | cct node_modules |
| `/root/projekte/` | 749 MB | Diverse Projekte (kein Git) |
| `/root/bookando-backend/` | 182 MB | Git-Repo |
| `/root/hermes-webui-nexify/` | 111 MB | Git-Repo |

---

## 5. Aufräumkandidaten

### 5.1 Container

| Container | Grund | Aktion | Risiko |
|-----------|-------|--------|--------|
| `mongo-nexify` | Gestoppt, nie benutzt | `docker rm` | Keines |
| `hermes-webui-lq3f` (2x) | Legacy-Test, Dublette zu primärer Hermes | `docker compose down -v` | Gering (Volumes prüfen) |
| `hermes-nexify-fix` (1x) | Worktree-Container. Fix muss erst gemerged werden. | Nach Merge entfernen | Gering |

### 5.2 Systemd Services

| Service | Grund | Aktion | Risiko |
|---------|-------|--------|--------|
| `nexify-9router-health.service` | failed, nicht kritisch | `systemctl disable --now` | Keines |
| `nginx.service` | failed, durch Traefik ersetzt | `systemctl disable --now` + apt remove | Keines |
| `mongod.service` | Dublette zu mongo-nexify, prüfen ob benötigt | Erst prüfen | Unbekannt |

### 5.3 Große Verzeichnisse

| Verzeichnis | Größe | Grund | Aktion |
|-------------|-------|-------|--------|
| `/root/projekte/` | 749 MB | Kein Git, unklar ob noch aktiv | Prüfen, ggf. archivieren |
| `/root/llm.c/` | 1.3 GB | Karpathy-Projekt, nicht NeXify | Prüfen ob noch benötigt |
| `/root/affilinet-portal-aachen/` | 643 MB (davon 614 MB .git) | Git-History | `git gc --aggressive` oder shallow clone |
| `/root/agentmemory/` | 2.9 GB | node_modules | `npm prune --production` |

---

## 6. Netzwerk-Port-Belegung

| Port | Service | Bindung |
|------|---------|---------|
| 22 | SSH (systemd) | 0.0.0.0 |
| 3111 | agentmemory (systemd) | 127.0.0.1 / Tunnel |
| 6379 | nexify-redis | 127.0.0.1 |
| 6333 | nexify-qdrant | 127.0.0.1 |
| 8787 | hermes-webui-nexify | 127.0.0.1 |
| 8789 | hermes-nexify-fix | 127.0.0.1 |
| 9090 | nexify-brain (systemd) | 127.0.0.1 / Tunnel |
| 20128 | 9router | 127.0.0.1 |
| 32768 | nexify-proxy | 127.0.0.1 |
| 32769 | hermes-webui-lq3f | 127.0.0.1 |
| 54321-54327 | Supabase-Services | 0.0.0.0 |

### Sicherheitshinweis
Ports 54321-54327 (Supabase) sind auf `0.0.0.0` gebunden — das heisst sie sind vom Netz aus erreichbar, nicht nur lokal. Prüfen ob Cloudflare Firewall dies abdeckt.

---

## 7. Cloudflare-Tunnel-Routing

| Domain | Weiterleitung | Port | Status |
|--------|--------------|------|--------|
| `ai-router.nexifyai.cloud/v1` | 9Router API | 32794 | ✅ |
| `agentmemory.nexifyai.cloud` | agentmemory | 3111 | ✅ |
| `brain.nexifyai.cloud` | Brain | 9090 | ✅ |
| `work.nexifyai.cloud` | n/a | 32769 | ✅ |
| `nexifyai.cloud` | Hermes WebUI | 8787 | ✅ |

---

## 8. Empfehlungen

### Kurzfristig (diese Woche)
1. `mongo-nexify` Container löschen (`docker rm mongo-nexify`)
2. `nexify-9router-health.service` deaktivieren (`systemctl disable --now nexify-9router-health.service`)
3. `nginx.service` deaktivieren/deinstallieren
4. `/root/projekte/` Inhalt prüfen — was ist noch relevant?

### Mittelfristig
1. `hermes-webui-lq3f` stoppen, Volumes sichern, dann löschen
2. `mongod.service` prüfen — wird er noch (vom Brain? der API?) genutzt?
3. `hermes-nexify-fix` Worktree mergen, dann Container + Worktree entfernen
4. `git gc --aggressive` in allen grossen Repos
5. `/root/agentmemory/` `npm prune --production` (spart ~1GB)

### Langfristig
1. Supabase-Ports auf `127.0.0.1` statt `0.0.0.0` binden (Sicherheit)
2. Backup-Routine für kritische Volumes etablieren
3. Monitoring/Alerting für Services

---

## 9. Risiken

| Risiko | Beschreibung | Massnahme |
|--------|-------------|-----------|
| **Kein Backup** | Kritische Docker-Volumes haben kein dokumentiertes Backup | Backup-Routine erstellen |
| **Offene DB-Ports** | Supabase-Stack auf 0.0.0.0 | Auf localhost umbinden |
| **Mongo-Dublette** | mongod systemd + mongo Container | Klären welche aktiv |
| **Kein Swap** | 0 Swap bei 31 GB RAM | Bei Bedarf Swapfile |
| **nginx.conf** | Nur deaktiviert, Config liegt noch | Nach Sicherung löschen |

---

*Erstellt: 2026-06-12 | Methode: systemctl, docker, df, free, du | Keine destruktiven Aktionen*
