# P0-005: Hermes Container Inventory

> **Status**: Fertiggestellt
> **Datum**: 2026-06-12
> **Auftrag**: P0-005 aus NeXify Final Order — Hermes-Agent-Container inventarisieren
> **Methode**: `docker ps`, `docker ps -a`, `docker compose ls`, `docker inspect`
> **Keine destruktiven Aktionen** — reine Inventur

---

## 1. Zusammenfassung

Auf diesem VDS laufen **24 Container** (davon 1 Created/gestoppt). Sie verteilen sich auf:

| Kategorie | Anzahl | Container |
|-----------|--------|-----------|
| **Hermes-Instanzen** | 4 | 3 WebUI + 1 Agent |
| **9Router** | 1 | AI-Routing-Gateway |
| **Supabase Stack** | 11 | Vollständige Supabase-Plattform |
| **NeXify Standalone** | 5 | proxy, redis, qdrant, api, mongo |
| **Agentmemory** | 1 | Persistenter Speicher (Coolify) |
| **Traefik** | 1 | Reverse Proxy / SSL |
| **Weitere** | 1 | mongo-nexify (gestoppt) |

---

## 2. Detail-Inventar

### 2.1 Hermes-Instanzen (4 Container)

#### H1 — hermes-webui-nexify-hermes-webui-1
| Feld | Wert |
|------|------|
| **Image** | `hermes-webui-nexify-hermes-webui` (lokal gebaut) |
| **Ports** | `127.0.0.1:8787 -> 8787/tcp` |
| **Status** | `Up 37 hours (healthy)` |
| **Compose** | `hermes-webui-nexify` (`/root/hermes-webui-nexify/docker-compose.yml`) |
| **Volumes** | `/root/workspace -> /workspace` (bind), `/root/.hermes -> /home/hermeswebui/.hermes` (bind) |
| **Netzwerk** | default bridge |
| **Klassifikation** | **KEEP** — Primäre Hermes WebUI-Instanz |
| **Risiko** | Produktiv-Instanz; Downtime = kein Hermes-UI |
| **Rollback** | `docker compose -f /root/hermes-webui-nexify/docker-compose.yml up -d` |

#### H2 — hermes-nexify-fix-hermes-webui-1
| Feld | Wert |
|------|------|
| **Image** | `hermes-nexify-fix-hermes-webui` (lokal gebaut) |
| **Ports** | `127.0.0.1:8789 -> 8787/tcp` |
| **Status** | `Up 37 hours (healthy)` |
| **Compose** | `hermes-nexify-fix` (`/root/hermes-webui-nexify/.claude/worktrees/hermes-nexify-fix/docker-compose.yml`) |
| **Volumes** | `/root/workspace -> /workspace` (bind), `/root/.hermes` (bind) |
| **Klassifikation** | **MERGE_TO_WORKSTATION** — Fix/Experiment aus Git-Worktree |
| **Begründung** | Läuft auf Port 8789 statt 8787, basiert auf Worktree-Branch. Sobald Fix gemerged, kann dieser Container entfernt werden. |
| **Risiko** | Kein Produktivrisiko; Worktree kann gelöscht werden |
| **Rollback** | `docker compose -f /root/hermes-webui-nexify/.claude/worktrees/hermes-nexify-fix/docker-compose.yml up -d` |

#### H3 — hermes-webui-lq3f-hermes-webui-1
| Feld | Wert |
|------|------|
| **Image** | `ghcr.io/nesquena/hermes-webui:latest` |
| **Ports** | `127.0.0.1:32769 -> 8787/tcp` |
| **Status** | `Up 15 hours (healthy)` |
| **Compose** | `hermes-webui-lq3f` (`/docker/hermes-webui-lq3f/docker-compose.yml`) |
| **Volumes** | `hermes-webui-lq3f_hermes-home`, `hermes-webui-lq3f_hermes-workspace` |
| **Klassifikation** | **REMOVE_CANDIDATE** — Legacy/Test-Instanz |
| **Begründung** | Läuft auf zufälligem Port 32769, nutzt offizielles ghcr-Image (nicht lokal), separate Volume-Names. Wahrscheinlich früherer Test, der nie aufgeräumt wurde. |
| **Risiko** | Keine Abhängigkeiten von Produktiv-Systemen. Volume-Daten prüfen vor Löschung. |
| **Rollback** | `docker compose -f /docker/hermes-webui-lq3f/docker-compose.yml up -d` |
| **Vorsicht** | Volume `hermes-webui-lq3f_hermes-home` und `_hermes-workspace` sichern vor Löschung |

#### H4 — hermes-webui-lq3f-hermes-agent-1
| Feld | Wert |
|------|------|
| **Image** | `nousresearch/hermes-agent:latest` |
| **Ports** | Keine exponiert |
| **Status** | `Up 15 hours` |
| **Compose** | `hermes-webui-lq3f` (gleiches Projekt wie H3) |
| **Volumes** | anonyme Volume + `hermes-webui-lq3f_hermes-home` (shared) |
| **Klassifikation** | **REMOVE_CANDIDATE** — Companion zu H3 |
| **Begründung** | Gehört zur lq3f-Compose. Ohne H3 nutzlos. |
| **Risiko** | Shared Volume `hermes-home` mit H3 — erst nach H3-Stopp entfernbar |

---

### 2.2 Kritische Infrastruktur (KEEP)

#### I1 — 9router-6kxn-niner-router-1
| Feld | Wert |
|------|------|
| **Image** | `ghcr.io/decolua/9router:latest` |
| **Ports** | `127.0.0.1:20128 -> 20128/tcp` |
| **Status** | `Up` |
| **Compose** | `9router-6kxn` (`/docker/9router-6kxn/docker-compose.yml`) |
| **Volumes** | `9router-6kxn_data`, `9router-6kxn_usage-data` |
| **Klassifikation** | **KEEP** — Zentrale AI-Routing-Infrastruktur |
| **Netzwerk** | Bridge `9router-6kxn_default` (172.18.0.3) |
| **Risiko** | Kritisch für alle AI-API-Requests. Ausfall = kein Modell-Zugriff. |
| **Rollback** | `docker compose -f /docker/9router-6kxn/docker-compose.yml up -d` |

#### I2 — coolify-agentmemory-1
| Feld | Wert |
|------|------|
| **Image** | `coolify-agentmemory` |
| **Ports** | `3111/tcp` (kein Host-Mapping — nur intern via Cloudflare Tunnel) |
| **Status** | `Up 46 hours (healthy)` |
| **Compose** | `coolify` (`/root/.agent-system-backups/.../docker-compose.yml`) |
| **Volumes** | `coolify_agentmemory-data` |
| **Klassifikation** | **KEEP** — Persistenter Agentenspeicher |
| **Netzwerk** | `coolify_default` (172.16.4.2) |
| **Risiko** | Brain-Daten aller Agenten. Backup vorhanden? |
| **Rollback** | `docker compose -f <path>/docker-compose.yml up -d` |

#### I3 — traefik-vsrs-traefik-1
| Feld | Wert |
|------|------|
| **Image** | `traefik:latest` |
| **Ports** | Keine exponiert (intern 80/443 über Docker-Netzwerk) |
| **Status** | `Up 46 hours` |
| **Compose** | `traefik-vsrs` (`/docker/traefik-vsrs/docker-compose.yml`) |
| **Volumes** | Docker Socket, Let's Encrypt, Dynamic Config |
| **Klassifikation** | **KEEP** — Reverse Proxy / SSL-Manager |
| **Risiko** | SSL-Zertifikatsverlust bei Datenverlust |
| **Rollback** | `docker compose -f /docker/traefik-vsrs/docker-compose.yml up -d` |

---

### 2.3 Supabase Stack (11 Container) — KEEP

Alle Container gehören zur `nexifyai-platform`. Laufen 22+ Stunden.

| Container | Image | Port (Host) | Status |
|-----------|-------|-------------|--------|
| supabase_db_nexifyai-platform | postgres:17.6.1.132 | `0.0.0.0:54322 -> 5432` | healthy |
| supabase_kong_nexifyai-platform | kong:2.8.1 | `0.0.0.0:54321 -> 8000` | healthy |
| supabase_studio_nexifyai-platform | studio:2026.05.25 | `0.0.0.0:54323 -> 3000` | healthy |
| supabase_auth_nexifyai-platform | gotrue:v2.189.0 | (internal 9999) | healthy |
| supabase_rest_nexifyai-platform | postgrest:v14.12 | (internal 3000) | up |
| supabase_realtime_nexifyai-platform | realtime:v2.102.1 | (internal 4000) | healthy |
| supabase_storage_nexifyai-platform | storage-api:v1.60.2 | (internal 5000) | healthy |
| supabase_pg_meta_nexifyai-platform | postgres-meta:v0.96.6 | (internal 8080) | healthy |
| supabase_edge_runtime_nexifyai-platform | edge-runtime:v1.74.0 | (internal 8081) | up |
| supabase_inbucket_nexifyai-platform | mailpit:v1.22.3 | `0.0.0.0:54324 -> 8025` | healthy |
| supabase_analytics_nexifyai-platform | logflare:1.42.0 | `0.0.0.0:54327 -> 4000` | healthy |
| supabase_vector_nexifyai-platform | vector:0.53.0-alpine | (internal) | healthy |

**Volumes** (nur wo vorhanden):
- `supabase_db_nexifyai-platform` → PostgreSQL-Daten (`/var/lib/postgresql/data`)
- `supabase_storage_nexifyai-platform` → Storage-Daten (`/mnt`)
- `supabase_studio_nexifyai-platform` → Snippets-Bind
- `supabase_vector_nexifyai-platform` → Docker-Socket-Bind (readonly)

**Klassifikation**: ALLE **KEEP** — Produktionsdatenbank und Platform-Services.
**Risiko**: Supabase-DB ist zentrale Datenhaltung. Keine Änderungen ohne Backup.
**Rollback**: `docker compose -f /root/nexifyai-platform/docker-compose.yml up -d`

---

### 2.4 NeXify Standalone Container (5 Container)

| Container | Image | Port | Status | Klassifikation |
|-----------|-------|------|--------|----------------|
| nexify-proxy | `node:22-alpine` | `127.0.0.1:32768` | Up 46h | **KEEP** |
| nexify-redis | `redis:7-alpine` | `127.0.0.1:6379` | Up 46h | **KEEP** |
| nexify-qdrant | `qdrant/qdrant:latest` | `127.0.0.1:6333` | Up 46h | **KEEP** |
| nexify-api | `nexify-api:final` | (internal :8001) | Up 13h | **KEEP** |
| mongo-nexify | `mongo:7` | — | Created | **REMOVE_CANDIDATE** |

#### Details

**nexify-proxy**: Node.js HTTP/HTTPS-Proxy (CONNECT-Methode + GET/POST-Forwarding) auf Port 32768. Leitet verschlüsselten Traffic an externe Hosts weiter. KEEP — zentraler Proxy für AI-API-Calls.

**nexify-redis**: Redis 7 auf Standard-Port 6379. KEEP — Wird von 9Router, Agentmemory und anderen Diensten genutzt.

**nexify-qdrant** (alias `qdrant_data`): Qdrant Vector Database auf 6333. KEEP — Braindaten, Embeddings, Vektor-Suche.

**nexify-api**: Python FastAPI auf :8001 (nur intern). KEEP — NeXify API-Server.

**mongo-nexify**: MongoDB 7, erstellt aber nie gestartet (Status: Created). **REMOVE_CANDIDATE** — Vermutlich geplant für Hermes oder Agent-Speicher, aber nie aktiviert. Volume-Daten prüfen (benannte Volumes existieren).

---

## 3. Klassifikations-Matrix

| Container | Klasse | Begründung |
|-----------|--------|------------|
| hermes-webui-nexify-hermes-webui-1 | **KEEP** | Primäre Hermes-Instanz |
| hermes-nexify-fix-hermes-webui-1 | **MERGE_TO_WORKSTATION** | Fix-Worktree, nach Merge entfernbar |
| hermes-webui-lq3f-hermes-webui-1 | **REMOVE_CANDIDATE** | Legacy-Test |
| hermes-webui-lq3f-hermes-agent-1 | **REMOVE_CANDIDATE** | Companion zu lq3f |
| 9router-6kxn-niner-router-1 | **KEEP** | AI-Routing |
| coolify-agentmemory-1 | **KEEP** | Agentenspeicher |
| traefik-vsrs-traefik-1 | **KEEP** | Reverse Proxy |
| supabase_* (11x) | **KEEP** | Datenbank-Plattform |
| nexify-proxy | **KEEP** | API-Proxy |
| nexify-redis | **KEEP** | Cache/Queue |
| nexify-qdrant | **KEEP** | Vektordatenbank |
| nexify-api | **KEEP** | API-Server |
| mongo-nexify | **REMOVE_CANDIDATE** | Ungenutzt |

---

## 4. Entfernungskandidaten — Details

### mongo-nexify
- **Status**: Created (nie gestartet)
- **Volume**: anonyme Volumes (`/data/db`, `/data/configdb`)
- **Risiko bei Löschung**: Keines. Keine Daten erwartet (nie gestartet).
- **Sicherung**: Optional `docker cp` oder Volume-Mount prüfen
- **Löschung**: `docker rm mongo-nexify && docker volume prune -f`

### hermes-webui-lq3f (2 Container)
- **Status**: Läuft seit 15h (wurde scheinbar rezent neu gestartet)
- **Volume**: `hermes-webui-lq3f_hermes-home`, `hermes-webui-lq3f_hermes-workspace`
- **Risiko bei Löschung**: Niedrig. Primäre Hermes-Instanz ist unabhängig.
- **Sicherung**: Volume-Inhalt prüfen, sichern falls Konfigurationen enthalten
- **Löschung**: `docker compose -f /docker/hermes-webui-lq3f/docker-compose.yml down -v`

---

## 5. Port-Konflikte

| Port | Container | Bemerkung |
|------|-----------|-----------|
| 8787 | hermes-webui-nexify (H1) + lq3f (H3 via 32769) | Kein Konflikt (unterschiedliche Host-Ports) |
| 32768, 32769 | nexify-proxy + lq3f-hermes | Kein Konflikt |
| 6379 | nexify-redis | Single-Instanz |

Keine Port-Konflikte festgestellt. Alle exponierten Ports sind eindeutig.

---

## 6. Empfehlungen

1. **Sofort**: `mongo-nexify` entfernen (nie genutzt, blockiert kein Port)
2. **Diese Woche**: `hermes-webui-lq3f` prüfen und ggf. stoppen
   - Vorher Volume-Inhalt sichern: `docker run --rm -v hermes-webui-lq3f_hermes-home:/data alpine ls -la /data`
3. **Nach Fix-Merge**: `hermes-nexify-fix` Worktree-Container + Worktree entfernen
4. **Langfristig**: Alle Container sollten in docker-compose.yml mit Healthchecks und Labels dokumentiert sein
5. **Backup**: Kritische Volumes nicht vergessen:
   - `9router-6kxn_data` (Provider-Konfig)
   - `9router-6kxn_usage-data` (Usage-Logs)
   - `coolify_agentmemory-data` (Agentenerinnerungen)
   - `supabase_db_nexifyai-platform` (Datenbank)
   - `qdrant_data` (Vektordaten)

---

## 7. Systemd-Services (relevant)

| Service | Status | Typ | Klassifikation |
|---------|--------|-----|----------------|
| agentmemory.service | running | systemd | **KEEP** — Haupt-Brain-Prozess |
| cloudflared.service | running | systemd | **KEEP** — Cloudflare Tunnel |
| nexify-brain.service | running | systemd | **KEEP** — NeXify Brain |
| nexify-9router-health.service | **failed** | systemd | **REMOVE_CANDIDATE** — Healthcheck für 9Router (nicht kritisch) |
| nginx.service | **failed** | systemd | **REMOVE_CANDIDATE** — Nicht mehr aktiv (ersetzt durch Traefik) |
| mongod.service | running | systemd | **PRÜFEN** — MongoDB-Systemdienst + mongo-nexify Container = Dublette |

---

*Erstellt: 2026-06-12 | Methode: docker ps/ps -a/compose ls/inspect | Keine destruktiven Aktionen*
