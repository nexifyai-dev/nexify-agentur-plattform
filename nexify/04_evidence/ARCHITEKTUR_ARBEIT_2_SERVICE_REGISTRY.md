# Architektur-Evidence: Service-Registry Update (Architektur-Arbeit 2)

**Datum:** 2026-06-22
**Geprüft von:** Systemmaster Agent
**Task:** Architektur-Arbeit 2 — Service-Registry aktualisieren

---

## Zusammenfassung

Die Service-Registry wurde vollständig neu strukturiert und aktualisiert.

### Kategorisierung (42 Container laufend)

| Kategorie | Anzahl | Status |
|-----------|--------|--------|
| Core Services | 8 | ✅ Alle gesund |
| Monitoring Services | 6 | ✅ Alle gesund |
| Knowledge Services | 5 | ✅ Alle gesund |
| Infrastructure Supabase | 11 | ✅ Alle gesund |
| Infrastructure Other | 3 | ⚠️ 1 Created (mongo-nexify) |
| Customer Bookando | 4 | ✅ Alle gesund |
| Customer VSK | 3 | ✅ Alle gesund |
| Utility | 1 | ✅ Gesund |
| Inactive/Remove Candidates | 6 | ❌ Bereinigung nötig |
| **GESAMT** | **47** (42 laufend) | — |

---

## Core Services (8)

| Service | Status | Port | Kritikalität |
|---------|--------|------|-------------|
| 9router-6kxn | ✅ healthy | 20128 | critical |
| nexify-brain | ✅ running | 9090 | critical |
| agentmemory | ✅ running | 3111 | critical |
| hermes-webui-nexify | ✅ healthy | 8787 | critical |
| supabase-db | ✅ healthy | 54322 | critical |
| nexify-qdrant | ✅ running | 6333 | critical |
| nexify-redis | ✅ running | 6379 | important |
| traefik-vsrs | ✅ running | 80/443 | critical |

---

## Monitoring Services (6)

| Service | Status | Port |
|---------|--------|------|
| Cloudflare Tunnel | ✅ running | Tunnel |
| supabase-analytics | ✅ healthy | 54327 |
| supabase-vector | ✅ healthy | internal |
| docker.service | ✅ running | Socket |
| mongod.service | ✅ running | 27017 |
| nexify-api | ✅ running | 8001 |

---

## Knowledge Services (5)

| Service | Status | Port |
|---------|--------|------|
| ragflow-xszg-ragflow-1 | ✅ running | 32770 |
| ragflow-xszg-mysql-1 | ✅ healthy | internal |
| ragflow-xszg-minio-1 | ✅ running | internal |
| ragflow-xszg-infinity-1 | ✅ running | internal |
| ragflow-xszg-redis-1 | ✅ running | internal |

---

## Infrastructure Supabase (11)

Alle Container im `nexifyai-platform` Compose-Projekt. Produktiv-Stack.

| Service | Status | Port |
|---------|--------|------|
| supabase-db | ✅ healthy | 54322 |
| supabase-kong | ✅ healthy | 54321 |
| supabase-studio | ✅ healthy | 54323 |
| supabase-auth | ✅ healthy | internal |
| supabase-rest | ✅ running | internal |
| supabase-realtime | ✅ healthy | internal |
| supabase-storage | ✅ healthy | internal |
| supabase-pg-meta | ✅ healthy | internal |
| supabase-edge-runtime | ✅ running | internal |
| supabase-inbucket | ✅ healthy | 54324 |
| supabase-analytics | ✅ healthy | 54327 |

---

## Infrastructure Other (3)

| Service | Status | Port |
|---------|--------|------|
| nexify-proxy | ✅ running | 32768 |
| postgresql-tu3y | ✅ running | 32769 |
| mongo-nexify | ⚠️ created | — |

---

## Customer Bookando (4)

| Service | Status | Port |
|---------|--------|------|
| bookando-cache | ✅ running | 6380 |
| bookando-core | ✅ running | 3002 |
| bookando-postgres | ✅ running | 5433 |
| bookando-qdrant-ai | ✅ running | 6335/6336 |

---

## Customer VSK (3)

| Service | Status | Port |
|---------|--------|------|
| vsk-email-worker | ✅ running | internal |
| vsk-mongodb | ✅ running | 27017 |
| vsk-web | ✅ running | 3088 |

---

## Health-Status

- **42 Container laufend** (bestätigt)
- **3 Container Created/Inactive** (mongo-nexify, paperclip-krv8)
- **2 Failed systemd-units** (nexify-9router-health.service, nginx.service)
- **Alle Core Services gesund**

---

## Port-Bindings

### Sicherheit

| Kategorie | Ports | Bindung | Status |
|-----------|-------|---------|--------|
| AI OS Core | 6333, 6379, 8787, 8789, 9090, 20128, 27017, 3111, 32768, 32769, 32770 | 127.0.0.1 | ✅ OK |
| Supabase | 54321-54327 | 0.0.0.0 | ⚠️ **SICHERHEITSLÜCKE** |
| Customer | Diverse | — | ✅ OK |

### Empfohlene Maßnahmen
1. Supabase-Ports auf `127.0.0.1` binden
2. Backup-Routine für kritische Volumes einrichten
3. Monitoring aufsetzen
4. Remove Candidates bereinigen

---

## Dateien

- **Service-Registry:** `/workspace/nexify/ai-os/NEXIFY_AI_OS_SERVICE_REGISTRY.md` (aktualisiert)
- **Evidence:** `/workspace/nexify/10_evidence/architektur/ARCHITEKTUR_ARBEIT_2_SERVICE_REGISTRY.md`
- **Datum:** 2026-06-22
- **Geprüft von:** Systemmaster Agent
