# 9Router Verification After Startup

> Date: 2026-06-12

| Check | Result |
|---|---|
| URL | `https://ai-router.nexifyai.cloud/v1` |
| HTTP /v1/models | ✅ 200 |
| `nexifyai-combo-llm` | ✅ present |
| `ds/deepseek-reasoner` | ✅ present |
| `ds/deepseek-v4-flash` | ✅ present |
| `deepseek-v4-pro` not default | ✅ confirmed |
| Auth mechanism | ANTHROPIC_API_KEY only (ANTHROPIC_AUTH_TOKEN removed) |

## Verdict

✅ All models available. No `deepseek-v4-pro` as default. Auth conflict resolved.
