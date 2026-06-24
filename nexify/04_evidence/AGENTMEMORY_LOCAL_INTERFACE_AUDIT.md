---
id: EVIDENCE_AGENTMEMORY_LOCAL_INTERFACE_AUDIT_001
title: Agentmemory Local Interface — Audit-Evidence
version: 1.0.0
status: COMPLETED
datum: 2026-06-10
tester: Goose AI CLI (NeXify Auto-System)
audit_pflicht: ja
tags: [agentmemory, interface, audit, ports, evidence]
---

# AGENTMEMORY_LOCAL_INTERFACE_AUDIT

## 1. Container-Status

| Container | Status | Ports |
|-----------|--------|-------|
| `coolify-agentmemory-1` | ✅ Up 5h (healthy) | 3111/tcp (nicht exponiert) |
| `agentmemory-iii-engine-1` | ✅ Up 5h | 127.0.0.1:3111, 3112, 9464, 49134 |

## 2. Prozesse

| PID | User | Kommando |
|-----|------|----------|
| 219705 | root | tini → agentmemory-entrypoint.sh |
| 219752 | ubuntu | node /usr/local/bin/agentmemory |
| 219792 | ubuntu | iii --config .../iii-config.yaml (agentmemory worker) |
| 219906 | 65532 | iii --config /app/config.yaml (iii-engine) |

## 3. Ports

| Port | Typ | Status | Antwort |
|------|-----|--------|---------|
| 127.0.0.1:3111 | HTTP (iii-engine) | ✅ LISTEN | Leer (kein REST-Endpunkt auf /) |
| 127.0.0.1:3112 | WebSocket (iii-stream) | ✅ LISTEN | "Connection header did not include 'upgrade'" |
| 127.0.0.1:9464 | Prometheus Metrics | ⚠️ LISTEN | Connection reset by peer |
| 127.0.0.1:49134 | WebSocket (iii-engine) | ✅ LISTEN | "Connection header did not include 'upgrade'" |

## 4. REST-API-Zugang

| Methode | Status | Detail |
|---------|--------|--------|
| Cloudflare HTTP | 🔴 301 | `agentmemory.nexifyai.cloud/health` |
| Localhost 3111 | ⚠️ Leer | Keine HTTP-Antwort auf / oder /health |
| Docker intern | ✅ Funktioniert | `docker exec curl :3111/agentmemory/health` mit HMAC-Auth |
| Health-Status | ✅ healthy | 254 Funktionen, 1 Worker, 5h Uptime |
| Memories gespeichert | ✅ 18 | In 7 Kategorien |
| MCP Standalone | ✅ Startet | v0.9.26/0.9.27 |

## 5. Nutzbarkeit

| Schnittstelle | Nutzbar | Hinweis |
|---------------|---------|---------|
| REST API (Docker) | ✅ Ja | `docker exec coolify-agentmemory-1 curl ...` |
| REST API (Cloudflare) | 🔴 Nein | 301 — Routing-Review erforderlich |
| MCP Standalone | ✅ Ja | `node dist/standalone.mjs` |
| iii-engine WebSocket | ✅ Ja | Port 49134 für SDK/Worker-Verbindung |

## 6. Empfehlung

1. Cloudflare 301 für `agentmemory.nexifyai.cloud` fixen (Routing-Review)
2. MCP-Standalone in Goose-Config als Extension eintragen
3. REST-API-Zugang über Docker-internen Port standardisieren

---

*Evidence erstellt am 2026-06-10 21:31 UTC | Version 1.0.0 | Audit-Pflichtig*
