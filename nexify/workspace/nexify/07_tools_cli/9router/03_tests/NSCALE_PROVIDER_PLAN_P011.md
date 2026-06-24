# Nscale als 9Router-Provider — Plan P0-011

**Status:** ABGESCHLOSSEN – Dokumentation  
**Datum:** 2026-06-12  
**Autor:** Systemmaster  
**Basiert auf:** P0-003 (9Router Current State Check)

## Zusammenfassung

Nscale ist bereits als vollwertiger Provider in 9Router OSS integriert (Typ: `nscale`,
OpenAI-kompatibel). Die Integration wurde im Zuge von P0-003 verifiziert.

## Verfügbare Modelle

| Modell | Typ | Status |
|--------|-----|--------|
| `nscale/meta-llama/Llama-3.3-70B-Instruct` | Chat | Verfügbar |
| `nscale/Qwen/Qwen2.5-Coder-32B-Instruct` | Chat / Code | Verfügbar |
| `nscale/Qwen/Qwen3-Embedding-8B` | Embeddings | Verfügbar (bevorzugt) |

## Verwendungszweck

- **Chat Provider**: `nscale/meta-llama/Llama-3.3-70B-Instruct` oder `nscale/Qwen/Qwen2.5-Coder-32B-Instruct`
- **Embeddings Provider**: `nscale/Qwen/Qwen3-Embedding-8B` — bevorzugtes Embedding-Modell des Systems
- **API-Zugriff**: Über 9Router-Standard-Endpunkt (`https://ai-router.nexifyai.cloud/v1`)
- **Keys**: Als `secret_ref` in 9Router-Konfiguration hinterlegt

## Test-Validierung

Die Nscale-Modelle sind über 9Router abrufbar:
```bash
curl -s https://ai-router.nexifyai.cloud/v1/models \
  -H "Authorization: Bearer $NEXIFY_API_KEY" | jq '.data[] | select(.id | test("nscale"))'
```

## Querverweise

- `/workspace/nexify/07_tools_cli/9router/03_tests/9ROUTER_COMBO_LLM_TEST_PLAN.md`
- `/workspace/nexify/07_tools_cli/9router/02_config/9ROUTER_CURRENT_STATE.md`
- `/workspace/nexify/07_tools_cli/9router/skills/9router.SKILL.md`
