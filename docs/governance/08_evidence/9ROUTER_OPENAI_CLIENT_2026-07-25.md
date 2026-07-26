# Evidence — 9router OpenAI Client Config 2026-07-25

## Live DB
`/root/.9router/db/data.sqlite`

## Changes (VPS)
1. Backup: `/root/.9router/db/backups/combo-fix-20260725T084825Z/`
2. Combo `nexifyai` + neu `nexifyai-combo-llm`:
   `["ds/deepseek-v4-flash","openrouter/deepseek/deepseek-v3.2","ds/deepseek-v4-pro"]`
3. Hermes `model`: openai-api → `http://127.0.0.1:20128/v1` / `nexifyai-combo-llm`
4. Hermes `.env` OPENAI_* / NINEROUTER_* → Standard/hermes apiKey
5. `/etc/nexifyai/9router-openai.env` (OpenAI-compatible)

## Verified
- `ds/deepseek-v4-flash` → content `PONG` / `OK` (local + public)
- `nexifyai` / `nexifyai-combo-llm` → HTTP 200 PONG
- `ds/deepseek-chat` → **400** (upstream retired) — removed from combo

## Repo
- `backend/ninerouter.py` defaults → v4-flash
- `deploy/9router/` OpenAI client example
