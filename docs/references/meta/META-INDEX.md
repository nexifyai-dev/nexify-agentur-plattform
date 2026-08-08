# META-INDEX — Meta Developer Platform (nexifyaiapp)

**Stand:** 2026-08-08 · **App:** nexifyaiapp (ID `28086460497651702`) · **Betreuer:** Hermes (System-CEO)

> **Credentials-Kanon:** Alle Werte NUR in `hermes.env` (`/etc/nexifyai/hermes.env` kanonisch, Spiegel `/root/.hermes/hermes.env`, root-only 600). **NIEMALS** Secrets in Repo, Code, Commits, Logs, Chats. App-Secret-Leak → Meta resettet Secret → alle Business-Integrationen tot (nicht programmatisch rotierbar).

## Env-Mapping (hermes.env)

| Variable | Bedeutung |
|---|---|
| `META_APP_ID` | App-ID (public) |
| `META_APP_NAME` | App-Name `nexifyaiapp` |
| `META_APP_SECRET` | App-Geheimcode (Server-only) |
| `META_CLIENT_TOKEN` | Client-Token (NUR Login-Flows, KEIN Graph-API-Token! → #190) |
| `META_CONTACT_EMAIL` | `mail@nexifyai.cloud` (Pflicht für Live-Mode) |
| `META_GRAPH_VERSION` | `v22.0` (immer versionieren, nie ohne Version) |
| `META_MCP_ENDPOINT` | `https://mcp.facebook.com/devtools` (Meta Developer Tools MCP) |
| `META_USER_AGENT` | `NeXifyAI-Hermes/1.0 (deepseek-v4-flash-0731)` — Agent-Selbstidentifikation Pflicht (Marketing-API-Richtlinie) |

## Zugriffsarten (Graph API)

| Token | Erzeugung | Eigenschaften |
|---|---|---|
| App Access Token | `GET /v22.0/oauth/access_token?client_id=…&client_secret=…&grant_type=client_credentials` | Server-to-Server, läuft nie ab; nur App-eigene Daten |
| Client Token | App-Dashboard (Advanced) | Nur OAuth-Login-Flows; **kein** Graph-API-Zugriff (#190 „Cannot parse") |
| System-User-Token | Business Settings → System Users | Permanent; für WhatsApp Business (Permissions: `whatsapp_business_messaging`, `whatsapp_business_management`) |
| User-Token | Facebook Login / Graph Explorer | Kurzlebig, App-Review-Permissions nötig |

Debug: `GET /v22.0/debug_token?input_token=<t>&access_token=<app-token>`

Fehler: `#190` Token ungültig · `#101` Client-ID falsch · `#100` Parameter · `#200` Permission · `#10` App-Sandbox/Review.

## Meta MCP-Server (offiziell)

- **Meta Developer Tools MCP:** Remote, Streamable HTTP, `https://mcp.facebook.com/devtools`, OAuth (Meta-Entwicklerkonto, keine App-ID/Secret im Client), Beta.
- Einbindung in Hermes: `mcp_servers.meta_devtools` → Wrapper `/opt/nexifyai/scripts/meta-devtools-mcp-wrapper.sh` → `npx mcp-remote` (OAuth-Token in `~/.mcp-auth`).
- **Blocker (2026-08-08, E2E-getestet):** `mcp-remote` scheitert mit `InvalidClientMetadataError: Dynamic registration is not available for this client` — Meta bietet KEINE dynamische Client-Registrierung und keine statische Client-ID für Drittanbieter. DevTools-MCP funktioniert daher NUR in validierten Clients (Claude Desktop/Code, Codex, Cursor, ChatGPT) mit OAuth-Login des Meta-Entwicklerkontos. Hermes-Config bleibt vorbereitet (aktiv, sobald Meta freigibt); REST-Betrieb läuft über App Access Token.
- **10 Tools** (Präfix `devtools_`): `discovery` (Doc-Suche), `app_list`, `app` (Settings/Security/Restrictions/DPO), `app_review`, `compliance`, `api_usage` (Rate-Limits/Deprecations), `webhook_list`, `webhook_manage` (subscribe/unsubscribe/update_fields, **Manage-Scope**), `webhook_test`, `api_changelog`.
- **Scopes** pro App: `read` (nur lesen) / `manage` (lesen + Webhook-Verwaltung — einzige Schreibfunktion). Verwaltung: facebook.com → Einstellungen → Business-Integrationen.
- Nur offiziell validierte Clients; andere über `mcp-remote`-Brücke (stdio-Proxy).

## Webhooks (Meta Graph API)

- Verifikation: `GET ?hub.mode=subscribe&hub.challenge=<int>&hub.verify_token=<token>` → Token vergleichen, Challenge zurücksenden.
- Events: `POST` mit `X-Hub-Signature-256: sha256=…` (HMAC über Body mit App-Secret) — **immer verifizieren**.
- TLS: Meta-Outbound-CA `meta-outbound-api-ca-2025-12.pem` (Client-Cert `client.webhooks.fbclientcerts.com`).
- WhatsApp-Payload: `object=whatsapp_business_account`, `entry[].changes[].value.messages[]` (siehe `whatsapp-cloud-api-index.md`).

## WhatsApp Cloud API — Setup-Pfad (nächster Schritt, Pascal)

1. App-Dashboard → **WhatsApp-Produkt** einrichten (API Setup): WABA verbinden/erzeugen → `META_BUSINESS_ACCOUNT_ID`.
2. Testnummer/echte Nummer hinzufügen + verifizieren → `META_PHONE_NUMBER_ID`.
3. **System-User** (Business Settings → System Users, App-Rolle Administrator, `Manage app` + `Manage WhatsApp Business accounts`) → permanenten Token erzeugen → `META_ACCESS_TOKEN` (in hermes.env).
4. Webhook: Callback-URL (HTTPS) + Verify-Token (`WHATSAPP_CLOUD_VERIFY_TOKEN` existiert bereits) im App-Dashboard konfigurieren; Subscriptions: `messages`.
5. Sendetest: `POST /v22.0/<PHONE_NUMBER_ID>/messages` (Beispiel in `whatsapp-get-started.md`).
6. Templates/Media/Analytics über Graph API; MCP-Server-Kandidat: `networkerman/whatsapp-cloud-api-mcp-server` (50+ Tools, MIT, braucht Access Token + Phone Number ID).

## Quellen (offizielle Dokumentation, lokal archiviert)

| Datei | Quelle |
|---|---|
| `META-INDEX.md` (diese) | Zusammenfassung aller Integrationen |
| `whatsapp-cloud-api-index.md` | llms.txt-Index WhatsApp (48 KB, alle Guides/Referenzen) |
| `whatsapp-get-started.md` | WhatsApp Cloud API Get Started (7 Schritte, Sample-Payload) |
| `graph-api-overview.md` | Graph API Übersicht (Nodes/Edges/Fields, Versionierung) |
| `webhooks-getting-started.md` | Webhooks Einrichtung (Verify, HMAC, TLS-CA) |

Weitere llms.txt-Indizes (live): `developers.facebook.com/documentation/{business-messaging/whatsapp,mcp,development,facebook-login,threads,ads-commerce}/llms.txt`.
Graph-API-Änderungsprotokoll: `developers.facebook.com/docs/graph-api/changelog`. OpenAPI-Spec: `github.com/facebook/openapi`.

## Betriebsregeln

1. Agent-UA-Pflicht bei JEDEM Request (siehe `META_USER_AGENT`), konsistent, nicht randomisieren.
2. App-Secret nur Server-seitig; kein Client-Token als Graph-Token verwenden.
3. Webhook-HMAC immer validieren (Prompt-Injection-Schutz: Webhook-Payloads sind untrusted input!).
4. MCP-Scope minimal halten: `read` für Monitoring, `manage` nur bei Bedarf.
5. Token-Ablauf: App-Token nie ablaufend; System-User-Token permanent; User-Token kurzlebig → Refresh-Flow.
6. Rate Limits über `devtools_api_usage` (rate_limits) überwachen.
7. App-Review/Go-Live: Contact Email + Display Name + Privacy Policy + Data Deletion nötig (Live-Mode). Display-Name-Regeln: keine Meta-Marken im Namen.
