---
id: EVIDENCE_AGENTMEMORY_AUTH_ANALYSIS_001
title: Agentmemory Auth-Mechanismus — Analyse-Evidence
version: 1.0.0
status: COMPLETED
datum: 2026-06-10
tester: Goose AI CLI (Session 20260610_28)
methode: Source-Code-Analyse + Docker-ENV-Prüfung + API-Tests
audit_pflicht: ja
tags: [agentmemory, auth, analyse, evidence]
---

# AGENTMEMORY_AUTH_ANALYSIS_EVIDENCE

## 1. Zusammenfassung

Agentmemory läuft lokal (Container healthy, 5h+ Uptime), aber die API ist nicht
nutzbar, weil der Auth-Mechanismus nicht konfiguriert ist. Der Source-Code erwartet
`AGENTMEMORY_SECRET` als Environment-Variable, die im Docker-Container nicht gesetzt ist.

## 2. Runtime-Status

| Container | Status | Ports |
|-----------|--------|-------|
| `coolify-agentmemory-1` | ✅ Up 5h (healthy) | 3111/tcp (nicht exponiert) |
| `agentmemory-iii-engine-1` | ✅ Up 5h | 127.0.0.1:3111,3112,9464,49134 |

## 3. Host-ENV

| Variable | Status |
|----------|--------|
| `AGENTMEMORY_URL` | SET (http://localhost:3111) |
| `AGENTMEMORY_INJECT_CONTEXT` | SET (false) |
| `AGENTMEMORY_SLOTS` | SET (true) |
| `AGENTMEMORY_TOOLS` | SET (all) |
| `AGENTMEMORY_SECRET` | **NOT_SET** |

## 4. Docker-Container ENV

| Variable | Status |
|----------|--------|
| `AGENTMEMORY_III_VERSION` | SET (0.11.2) |
| `SERVICE_FQDN_AGENTMEMORY_3111` | SET (leer) |
| `AGENTMEMORY_SECRET` | **NOT_SET** |
| `AGENTMEMORY_API_KEY` | NOT_SET |
| `III_API_KEY` | NOT_SET |
| `AGENTMEMORY_AUTH_TOKEN` | NOT_SET |

Keine `.env`-Datei in `~/.agentmemory/`, kein Secret-Volume gemountet.

## 5. Source-Code-Auth-Logik

```
Datei: /root/agentmemory/src/triggers/api.ts
Funktion: middleware::api-auth (Zeile 141-163)

if (!secret) return { action: "continue" };         ← wenn kein Secret: ALLOW
const auth = headers["authorization"] || headers["Authorization"];
if (!timingSafeCompare(auth, `Bearer ${secret}`)) {  ← HMAC-SHA256 Vergleich
    return { action: "respond", response: { status_code: 401, body: { error: "unauthorized" } } };
}
return { action: "continue" };
```

```
Datei: /root/agentmemory/src/index.ts (Zeile 220)
const secret = getEnvVar("AGENTMEMORY_SECRET");
```

## 6. API-Tests

| Endpunkt | Methode | Auth | Port | Ergebnis |
|----------|---------|------|------|----------|
| `/agentmemory/livez` | GET | Keine | Container-intern 3111 | ✅ `{"service":"agentmemory","status":"ok"}` |
| `/agentmemory/health` | GET | middleware::api-auth | Container-intern 3111 | ❌ `{"error":"unauthorized"}` |
| `/agentmemory/config/flags` | GET | checkAuth() | Container-intern 3111 | ❌ `{"error":"unauthorized"}` |
| `/agentmemory/remember` | POST | checkAuth() | Container-intern 3111 | ❌ Nicht getestet (401 erwartet) |
| `127.0.0.1:3111/` | GET | — | Host | ❌ Leere Antwort (falscher Container) |

## 7. Befund

| Aspekt | Befund |
|--------|--------|
| **Benötigte ENV** | `AGENTMEMORY_SECRET` |
| **Benötigter Header** | `Authorization: Bearer ${AGENTMEMORY_SECRET}` |
| **Auth-Typ** | HMAC-SHA256 via `crypto.timingSafeEqual` |
| **Secret im Container** | ❌ NOT_SET |
| **Secret-Quelle** | Container-ENV oder `~/.agentmemory/.env` |
| **Source sagt bei !secret** | `continue` (sollte ohne Auth erlauben) |
| **Tatsächliches Verhalten** | 401 unauthorized |
| **Ursache wahrscheinlich** | Image/Code-Mismatch oder Coolify-seitiger Secret-Mechanismus |
| **Livez funktioniert** | ✅ Ja (keine middleware) |

## 8. Workaround-Erkenntnis

Die `docker exec`-basierten Aufrufe mit dem HMAC-Secret aus `/data/.hmac` aus
früheren Tests haben funktioniert (18 Memories gespeichert). Ob das Zufall war
oder das HMAC-Secret temporär gültig war, ist nicht abschließend geklärt.

## 9. Empfehlung

1. `AGENTMEMORY_SECRET` als Coolify-Secret setzen oder in `~/.agentmemory/.env`
2. Oder Source-Code-Mismatch zwischen Container-Image und Repo klären
3. Bis dahin: Pending-Import verwenden

---

*Evidence erstellt am 2026-06-10 21:37 UTC | Version 1.0.0 | Audit-Pflichtig*
