# Cursor / OpenAI-compatible → 9router

## Endpoint
- Public: `https://ai-router.nexifyai.cloud/v1`
- Local VPS: `http://127.0.0.1:20128/v1`

## Auth
API Key aus 9router DB `apiKeys` — Name **Standard LLM Key**  
(`~/.9router/db/data.sqlite` auf dem VPS). `requireApiKey=1`.

## Cursor Settings (Beispiel)
```json
{
  "openaiBaseUrl": "https://ai-router.nexifyai.cloud/v1",
  "openaiApiKey": "<Standard-LLM-Key>",
  "model": "nexifyai-combo-llm"
}
```

## curl Smoke
```bash
curl -sS https://ai-router.nexifyai.cloud/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY" | head

curl -sS https://ai-router.nexifyai.cloud/v1/chat/completions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"ds/deepseek-v4-flash","messages":[{"role":"user","content":"OK?"}],"max_tokens":32,"stream":false}'
```

## Live Combo-Kette (SQLite `combos`)
`ds/deepseek-v4-flash` → `openrouter/deepseek/deepseek-v3.2` → `ds/deepseek-v4-pro`

**Nicht** mehr: `ds/deepseek-chat` / `ds/deepseek-reasoner` (Upstream 400 — nur v4-flash/pro).
