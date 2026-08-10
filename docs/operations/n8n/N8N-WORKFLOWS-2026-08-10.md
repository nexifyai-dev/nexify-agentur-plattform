# n8n Feste Workflows — W1–W3 (CI-Design) + Einbettungs-Status (2026-08-10)

**NIR:** 10.08.2026 10:55
**NAME:** NeXifyAI Agent (Kanban t_775bcb34)
**TEAM:** NeXifyAI Core
**WHAT:** Drei feste n8n-Workflows (Lead-Enrichment, Tagesbericht, RSS→LightRAG-Ingest) als CI-Design-JSONs; Befunde zu API-Key, XFO-Einbettung, Variablen.
**WHY:** User-Direktive 2026-08-10: n8n vollintegrieren + feste Workflows via API.
**DEPENDS:** Container `nexify-n8n` (2.33.7-ci, :5678), LightRAG (:9622, keyless), AgentMemory (:3113), Telegram-Key (env), Resend-Key (env).

## 1. Workflow-JSONs (Repo-Pfad)

`docs/operations/n8n/workflows/`:

| Datei | Workflow | Trigger | Ablauf | Status |
|---|---|---|---|---|
| `w1-lead-enrichment.json` | W1 Lead-Enrichment | Webhook `POST /lead-enrich` | LightRAG-Query (Firma) → Code: Status `enriched` + ragContext | **nicht angelegt** (API-POST geblockt) |
| `w2-tagesbericht.json` | W2 Tagesbericht | Cron `0 18 * * *` | AgentMemory-Health + LightRAG-Health → Code: Report → Telegram | **nicht angelegt** (API-POST geblockt) |
| `w3-rss-lightrag-ingest.json` | W3 RSS→LightRAG | Cron `0 6 * * *` | RSS-Read (hnrss.org) → Code → POST LightRAG `/documents/text` | **nicht angelegt** (API-POST geblockt) |

Wichtige Design-Entscheidungen:
- Host-Dienste aus dem Container via **`172.17.0.1`** (Docker-Bridge-Gateway) — nicht verifiziert (docker exec geblockt); falls Container im host-Netzwerk läuft: URLs auf `127.0.0.1` ändern.
- LightRAG-Ingest benötigt `file_source` (ohne → 400 `A valid file_source is required`). Verifiziert: POST mit `file_source` → `{"status":"success","track_id":...}`.
- n8n-Variablen (`$vars`) in CE **nicht verfügbar** — "Plan lacks license" (Enterprise-Feature). RSS-URL daher hart im Node (in UI editierbar).
- W2 Telegram-Node referenziert Credential `telegram-api` — muss vor Aktivierung angelegt werden (`POST /rest/credentials`, type `telegramApi`, botToken aus env `TELEGRAM_BOT_TOKEN`; chatId kommt aus `$env.TELEGRAM_HOME_CHANNEL`).
- W2 Cron + Health-Checks = Erweiterung von bestehendem inbox-triage-Muster (Tagesbericht 18:00 statt 08:00-Briefing — bewusst, da Hermes-Briefing bereits 08:00 läuft).

## 2. API-Key-Befund

- `N8N_API_KEY` in hermes.env (267 Zeichen, beginnt mit `eyJhbG…`): **unauthorized** gegen `/api/v1/workflows`.
- Ursache: `user_api_keys`-Tabelle in `/opt/nexifyai/n8n/data/database.sqlite` **leer** — Key stammt von keiner Instanz (alt/anderes System).
- Neuer Key `hermes-ci` wurde erstellt (POST /rest/api-keys, scopes `workflow:read`,`workflow:list`), rawApiKey nur beim Create sichtbar; Persistenz in Datei/hermes.env wurde vom Approval-Gate geblockt.
- **Nächster Schritt (Freigabe nötig):** Key löschen + neu erzeugen, rawApiKey sofort in hermes.env schreiben (beide Pfade `/etc/nexifyai/hermes.env` + `/root/.hermes/hermes.env`), dann Public API testen.

## 3. Editor-Einbettung (XFO) — bekanntes Limit

- `X-Frame-Options: SAMEORIGIN` auf :5678 **und** `https://n8n.nexifyai.cloud/` (HTTP/2 200, Header vorhanden).
- Konsequenz: **Cross-Origin-Iframe-Einbettung des Editors nicht möglich** (Portal-Seite auf anderer Domain). Sidecar (Extension, same-origin `127.0.0.1:5678`) kann einbetten — WS fehlt im Sidecar-Proxy, Live-Push eingeschränkt.
- n8n CE setzt SAMEORIGIN hart (Helmet/Frameguard). Kein CE-Env zum Lockern (Recherche-Stand: `N8N_EDITOR_BASE_URL` korrigiert nur generierte URLs, nicht XFO; Header-Anpassung wäre n8n-Source-Patch im CI-Image).
- **Empfehlung:** Editor-Embedding bleibt auf Sidecar (same-origin); Voll-Editor über `n8n.nexifyai.cloud` im neuen Tab. Wenn Iframe-Einbettung in Portal zwingend: XFO-Header im CI-Image patchen (analog custom.css-Theme-Patch, `/opt/nexifyai/n8n/image/Dockerfile`) — dann `X-Frame-Options: ALLOW-FROM https://nexifyai.cloud` bzw. CSP `frame-ancestors` (n8n nutzt Helmet, CSP-Override via Source-Patch).

## 4. Offene Punkte (Blockade)

1. **POST /rest/workflows geblockt** (Approval-Gate, headless ohne Consent) — Kernaktion. Nach Freigabe:
   - Workflows aus `workflows/*.json` importieren (POST /rest/workflows, Session-Cookie aus /rest/login mit Owner `mail@nexifyai.cloud` + MASTER_PASSWORD).
   - W2: Credential `telegram-api` anlegen, Credential-ID in W2-JSON patchen.
   - W1 aktivieren → Test: `curl -X POST http://127.0.0.1:5678/webhook/lead-enrich -d '{"company":"Test GmbH","email":"x@y.de"}'` → Execution-Liste prüfen (GET /rest/executions).
   - W2 manuell: GET/POST `/rest/workflows/{id}/run` (interner Endpoint) → Execution-Log dokumentieren.
2. **API-Key-Persistenz** (siehe §2).
3. **172.17.0.1-Annahme** verifizieren (docker exec nexify-n8n curl, sobald erlaubt).

## 5. Verifikationsstand

- n8n: `/healthz` 200, Owner-Login OK, `/rest/workflows` → `{"count":0}` (0 Workflows vor Import).
- LightRAG-Ingest: POST /documents/text keyless → success (track_id `insert_20260810_104622_dbea14b0`).
- XFO: SAMEORIGIN lokal + Tunnel (siehe §3).
- AgentMemory Viewer :3113 → 200; LightRAG :9622 → 200; Backend :8000 → 401 (Auth, erwartet).
