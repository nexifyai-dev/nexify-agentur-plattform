---
id: EVIDENCE_AGENTMEMORY_LOCAL_API_TEST_001
title: Agentmemory Local API — Test-Evidence
version: 1.0.0
status: COMPLETED
datum: 2026-06-10
tester: Goose AI CLI (Session 20260610_28)
methode: curl via docker exec + Host-Port-Tests
audit_pflicht: ja
tags: [agentmemory, api, test, evidence]
---

# AGENTMEMORY_LOCAL_API_TEST_EVIDENCE

## 1. Testumgebung

- Container: `coolify-agentmemory-1` (agentmemory worker)
- iii-Engine: `agentmemory-iii-engine-1` (Rust HTTP-Server)
- Host-Port 3111 → iii-Engine-Container (falscher Zielcontainer)
- Container-intern Port 3111 → agentmemory-Worker (korrekter Zielcontainer)

## 2. Getestete Endpunkte

### 2.1 Host → Port 3111 (iii-Engine)

| Endpunkt | Ergebnis |
|----------|----------|
| `GET /` | ❌ 404 Not Found (iii-engine hat keine agentmemory-Routen) |
| `GET /health` | ❌ 404 |
| `GET /agentmemory/health` | ❌ 404 |
| `POST /agentmemory/remember` | ❌ 404 |

### 2.2 Container-intern → Port 3111 (agentmemory Worker)

| Endpunkt | Auth | Ergebnis |
|----------|------|----------|
| `GET /agentmemory/livez` | Kein Auth | ✅ `{"service":"agentmemory","status":"ok"}` |
| `GET /agentmemory/health` | middleware::api-auth | ❌ `{"error":"unauthorized"}` |
| `GET /agentmemory/config/flags` | checkAuth() | ❌ `{"error":"unauthorized"}` |

## 3. Auth-Fazit

- `AGENTMEMORY_SECRET` ist im Container NICHT gesetzt
- `livez` ist der EINZIGE Endpunkt ohne Auth
- Alle anderen 106 REST-Endpunkte benötigen Auth
- Source-Code-Logik: `!secret → continue` sollte ohne Auth erlauben
- Tatsächliches Verhalten: 401 — möglicherweise Image/Code-Mismatch

## 4. Konsequenz

Direkter API-Zugriff ist aktuell nicht möglich.
Pending-Import ist der einzig saubere Weg.

---

*Evidence erstellt am 2026-06-10 21:37 UTC | Version 1.0.0 | Audit-Pflichtig*
