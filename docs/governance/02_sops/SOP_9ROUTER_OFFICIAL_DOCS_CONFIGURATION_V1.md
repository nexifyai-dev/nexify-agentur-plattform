# SOP — 9Router Official Docs & Configuration V1

**Stand:** 2026-06-12 | **Status:** VERBINDLICH | **Version:** 1.0.0
**Owner:** Routing / NeXify AI

---

## 1. Zweck

9Router wird nicht nur als Modellproxy genutzt, sondern als vollständige NeXify AI Router-Zentrale.

## 2. Pflichtquellen

```
https://github.com/decolua/9router
https://github.com/decolua/9router/tree/master/docs
https://github.com/decolua/9router/tree/master/gitbook
/workspace/nexify/07_tools_cli/9router/
```

## 3. Capability-Pflicht

Mindestens bewerten:

1. OpenAI-kompatible API unter `/v1`
2. Dashboard
3. Provider-Verwaltung
4. 3-Tier-Fallback
5. RTK Token Saver
6. Multi-Account/Round-Robin
7. Quota Tracking
8. Usage Analytics
9. Request Logging
10. Cloud Sync (policy-konform)
11. Custom Combos
12. Deploy Anywhere (localhost, VPS, Docker, Cloudflare Workers)
13. CLI-Tool-Unterstützung
14. Provider (DeepSeek, MiniMax, GLM, Kimi, OpenAI-kompatibel)

## 4. Pflichtausgaben

```
9ROUTER_OFFICIAL_DOCS_AUDIT.md
9ROUTER_CAPABILITY_MAP.md
9ROUTER_PROVIDER_AND_MODEL_REGISTER.md
9ROUTER_CONFIG_TARGET_STATE.md
9ROUTER_WORKSTATION_INTEGRATION_PLAN.md
9ROUTER_TEST_PLAN.md
9ROUTER_EVIDENCE.md
```

## 5. Tests

- Dashboard erreichbar?
- `/v1/models` erreichbar?
- Testprompt über Standardmodell?
- Fallback: kontrollierter Ausfall simuliert?
- Quota/Kostenanzeige verfügbar?
- RTK aktiviert und qualitativ geprüft?
- Logs: keine Secrets?
- Workstation: Status sichtbar?

## 6. Gate-Punkte

Gate-pflichtig: öffentliche Domain-Routen, Provider-Keys, Router-Restart, Kostenlimits, Modelle umstellen, Logging mit sensiblen Daten, Cloud Sync.
