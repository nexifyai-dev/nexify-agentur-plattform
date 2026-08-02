# SOP — 9Router Official Docs & Configuration V1

## Zweck

9Router wird nicht nur als Modellproxy genutzt, sondern als vollständige NeXify AI Router-Zentrale für Modellrouting, Provider-Fallbacks, Kostenkontrolle, Quota-Management, Token-Effizienz, OpenAI-kompatible API, Dashboard, Logs, Analytics und CLI-Tool-Anbindung.

## Pflichtquellen

Vor jeder 9Router-Arbeit zu laden:

```text
https://github.com/decolua/9router
https://github.com/decolua/9router/tree/master/docs
https://github.com/decolua/9router/tree/master/gitbook
lokale /workspace/nexify/07_tools_cli/9router/ Struktur
aktuelle 9Router ENV ohne Secret-Werte
aktuelle Workstation-/VDS-/Cloudflare-/Domain-Konfiguration
```

## Capability-Pflicht

Mindestens zu bewerten:

1. OpenAI-kompatible API unter `/v1`.
2. Dashboard.
3. Provider-Verwaltung.
4. 3-Tier-Fallback.
5. RTK Token Saver.
6. Multi-Account/Round-Robin.
7. Quota Tracking.
8. Usage Analytics.
9. Request Logging.
10. Cloud Sync, falls nutzbar und policy-konform.
11. Custom Combos.
12. Deploy Anywhere: localhost, VPS, Docker, Cloudflare Workers.
13. Unterstützte CLI-Tools: Cursor Agent (NeXify-Primär), Claude Code, Cline, OpenCode, Kilo Code usw. — OpenAI Codex abgeschaltet (2026-08-02).
14. Unterstützte Provider einschließlich DeepSeek, MiniMax, GLM, Kimi, Anthropic/OpenAI-kompatible Endpunkte.

## NeXify-Zielkonfiguration

```text
NEXIFY_ROUTER_BASE_URL=https://ai-router.nexifyai.cloud/v1
NEXIFY_ROUTER_LOCAL_URL=http://localhost:20128/v1
NEXIFY_ROUTER_DEFAULT_CHAT_MODEL=nexifyai-standard-llm
NEXIFY_ROUTER_DEFAULT_REASONING_MODEL=nexifyai-reasoning-llm
NEXIFY_ROUTER_DEFAULT_EMBEDDING_MODEL=nexifyai-embedding-default
NEXIFY_ROUTER_TIMEOUT=60
NEXIFY_ROUTER_RETRY_LIMIT=2
NEXIFY_ROUTER_COST_LIMIT=projektbezogen
NEXIFY_ROUTER_EVIDENCE_MODE=on
```

Secret-Werte werden nie dokumentiert. Nur `secret_ref`.

## Pflichtausgaben

```text
9ROUTER_OFFICIAL_DOCS_AUDIT.md
9ROUTER_CAPABILITY_MAP.md
9ROUTER_PROVIDER_AND_MODEL_REGISTER.md
9ROUTER_CONFIG_TARGET_STATE.md
9ROUTER_WORKSTATION_INTEGRATION_PLAN.md
9ROUTER_TEST_PLAN.md
9ROUTER_EVIDENCE.md
```

## Tests

- Health: Dashboard erreichbar?
- API: `/v1/models` erreichbar?
- Chat: Testprompt über Standardmodell?
- Fallback: kontrollierter Ausfall simuliert?
- Cost/Quota: Quota-/Kostenanzeige verfügbar?
- RTK: aktiviert und qualitativ geprüft?
- Logs: keine Secrets?
- Workstation: Status sichtbar?

## Gate-Punkte

Gate-pflichtig:

- öffentliche Domain-Routen ändern;
- Provider-Keys setzen;
- produktiver Router-Restart;
- Kostenlimits ändern;
- produktive Modelle umstellen;
- Request-/Response-Logging mit sensiblen Daten aktivieren;
- Cloud Sync aktivieren.
