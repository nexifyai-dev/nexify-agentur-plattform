---
ralph_loop_file: true
file_type: evidence_report
title: P0-Root-Cause-Report — 401 Auth + 9Router + Config-Fix
version: 1.0.0
date: 2026-06-22
session: 963a9a05b180
status: complete
---

# P0-Fix: Hermes 401 Auth & 9Router Routing

## Root Cause

**Dreifacher P0-Blocker:**

1. **`nexify-ceo/config.yaml`** überschrieb `model.default: gpt-5.4` — dieses Modell existiert nicht in 9Router. Hermes fiel auf OpenRouter zurück → `OPENROUTER_API_KEY not set` → 401.

2. **`agentur-admin/auth.json` + `config.yaml`** gehörten `root:root` (600). `hermeswebui` (1000) konnte nicht lesen → CLI fiel auf Default-Config → kein Credential-Store verfügbar.

3. **`providers.custom.models`** listete nur `nexifyai-combo-llm`. Alle anderen Modelle (GLM, DeepSeek Pro, etc.) wurden nicht als custom-Provider-Modelle erkannt → Fallback zu OpenRouter.

## Fixes

| # | Datei | Änderung | Befehl |
|---|-------|----------|--------|
| 1 | `~/.hermes/profiles/nexify-ceo/config.yaml` | `model.default: gpt-5.4` → `nexifyai-combo-llm` | `hermes config set` |
| 2 | `agentur-admin/auth.json`, `config.yaml` | `chown 1000:1000` | `docker exec -u root chown` |
| 3 | `~/.hermes/config.yaml` | `models: [1]` → `[19]` (alle 9Router-Modelle) | `patch` |

## 9Router Status

- **Version**: 0.5.8
- **Provider**: DeepSeek (aktiv), Baseten (aktiv, GLM-5.2), NScale (aktiv), Vercel AI Gateway (aktiv)
- **Combo**: `nexifyai-combo-llm` = DS-Reasoner + DS-Chat + DS-V4-Flash (Round-Robin)
- **Bolt-Features**: Caveman (full), RTK, Headroom (localhost:8787)
- **API-Key**: `sk-970...d256` ("hermes-webui")
- **Total Requests (lifetime)**: 70,008

## Evidence

- 9Router-DB Dump: `/workspace/nexify/10_evidence/runtime-network-20260621/read-9router-db.js`
- API-Test: `curl ai-router.nexifyai.cloud/v1/models` → 19 Modelle
- Config-Diff: `patch` auf `~/.hermes/config.yaml`
