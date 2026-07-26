# /nine-router

9router OpenAI-kompatibel prüfen/konfigurieren (VPS + Hermes + Backend-Client).

## Goal

Stabiler Chat über `https://ai-router.nexifyai.cloud/v1` bzw. lokal `127.0.0.1:20128/v1` mit gültigen Combos/Models.

## Common Files

- `deploy/9router/README.md`
- `deploy/9router/openai-compatible-client.env.example`
- `backend/ninerouter.py`
- VPS DB: `/root/.9router/db/data.sqlite` (nur lesen/ändern mit F32 bei Prod-Impact)
- VPS env: `/etc/nexifyai/9router-openai.env` (Secrets)

## Suggested Sequence

1. Health: Router erreichbar? `/v1/models` oder Chat-Probe.
2. Combos prüfen: DeepSeek nur `ds/deepseek-v4-flash` / `ds/deepseek-v4-pro` (alte `deepseek-chat` → Upstream 400).
3. Client-Env: `OPENAI_BASE_URL=…/v1` + Standard LLM Key aus SQLite/apiKeys — nicht committen.
4. Hermes: `model.provider=openai-api`, Default-Combo `nexifyai-combo-llm` falls so verdrahtet.
5. Repo-Defaults/Docs nur anpassen wenn Drift; Tests für `backend/ninerouter.py` laufen lassen.

## Pitfalls

- Keys nicht in Git/Chat.
- Combo-Namen ≠ Upstream-Model-IDs verwechseln.
- Production-SQLite-Schreibvorgänge → `/governance-f32`.
