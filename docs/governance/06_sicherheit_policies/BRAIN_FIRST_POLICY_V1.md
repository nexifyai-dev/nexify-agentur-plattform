# Brain-First-Policy V1

**Status:** AKTIV
**Version:** 1.0
**Datum:** 2026-06-11
**Owner:** NeXify Chief Orchestrator (Claude Code)
**Scope:** nexify_internal

## Regel

```text
BRAIN_FIRST = TRUE
NO_SYSTEMMASTER_WORK_WITH_UNTESTED_BRAIN = TRUE
NO_DONE_WITHOUT_BRAIN_STATUS = TRUE
```

Vor jeder nicht-trivialen Architektur-, Code-, Konfigurations-, Runtime-, Deployment- oder 
Dokumentationsänderung mit Projektauswirkung:

1. Brain query (nexifyai_brain oder nexifyai_memories)
2. Prüfen, ob relevantes Wissen existiert
3. Nach der Änderung: Brain store (wenn neues, dauerhaftes Wissen entstanden)

## Ausnahmen

- Reine Lesetransaktionen an bekannten Dateien
- Explizite Brain-Umgehungsanweisung durch berechtigten Agenten
- Brain nicht erreichbar: Pending-Queue verwenden, Fehler melden

## Brain-Komponenten (Stand 2026-06-11)

| Komponente | URL | Status |
|---|---|---|
| Brain API (Python) | http://127.0.0.1:9090 | ✅ AKTIV (Systemd) |
| Brain API (Cloudflare) | https://brain.nexifyai.cloud | ⚠️ Leitet zu 9Router-Dashboard (Konfigurationskonflikt) |
| Brain SQLite DB | /var/lib/nexify/brain.db | ✅ 68 Einträge |
| Qdrant | http://127.0.0.1:6333 | ✅ 4 Collections, 3925+ Points |
| agentmemory III Engine | http://127.0.0.1:3111 | ✅ Verbunden |
| Cloudflare Tunnel | brain.nexifyai.cloud → Traefik:80 | ✅ Aktiv, aber falsches Ziel |

## Brain-Fallback-Kette

1. http://127.0.0.1:9090 (primär)
2. http://127.0.0.1:6333 (Qdrant direkt)
3. /workspace/nexify/11_brain_sync/ (Pending-Files)

## Konfigurationskonflikt: brain.nexifyai.cloud

Die Cloudflare-URL brain.nexifyai.cloud leitet aktuell zu Traefik auf Port 80,
der wiederum zum 9Router-Dashboard routet. Die Brain-API läuft auf Port 9090.
Eine Tunnel-Anpassung (brain.nexifyai.cloud → http://127.0.0.1:9090) erfordert
Produktiv-Change-Genehmigung.

**Status:** ⏳ WAITING_FOR_APPROVAL
