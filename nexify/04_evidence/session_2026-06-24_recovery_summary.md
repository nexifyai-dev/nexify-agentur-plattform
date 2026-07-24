# Recovery Summary — 2026-06-24 Session

## Status

| Service | REST API | MCP Plugin | Config gefixt |
|---------|----------|------------|----------------|
| Brain (8420) | ✅ UP (9249 pts) | 🔴 ClosedResource (Restart nötig) | ✅ |
| Agentmemory (40000) | ✅ UP (859 memories) | 🔴 host.docker.internal (Restart nötig) | ✅ |
| Qdrant (6333) | ✅ UP (4 collections) | ✅ vermutlich intakt | ✅ |
| RAGFlow | ✅ UP (15 datasets) | ✅ vermutlich intakt | ✅ |
| 9Router | ✅ UP | — | — |

## Config-Fixes
1. **Brain MCP**: `BRAIN_URL` → `BRAIN_BASE_URL`, URL von `https://brain.nexifyai.cloud/query` → `http://localhost:8420`
2. **Agentmemory MCP**: `http://host.docker.internal:40000` → `http://localhost:40000`
3. Beide Fixes in `/home/hermeswebui/.hermes/config.yaml`

## Nächster Schritt
Hermes WebUI neustarten (Profile nexify-ceo) — dann MCP-Plugin lädt neue Config.

## Offene Punkte
- Cron-Recovery: weiterhin STALLED (P0)
- Kill-Switch systemd-Unit: prüfen
- Work API: prüfen
