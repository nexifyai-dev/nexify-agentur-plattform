# Startwrapper Test — Evidence

> Datum: 2026-06-12

## Checks

| Check | Status |
|---|---|
| File exists + executable | ✅ `-rwxr-xr-x` 1872 Bytes |
| Bash Syntax | ✅ Keine Fehler |
| ANTHROPIC_AUTH_TOKEN unset | ✅ Wrapper führt `unset` aus |
| ANTHROPIC_BASE_URL | ✅ `https://ai-router.nexifyai.cloud/v1` |
| NEXIFY_ROUTER_API_KEY prüft | ✅ Fehlt → Exit 2 |
| ANTHROPIC_API_KEY | ✅ Wird aus NEXIFY_ROUTER_API_KEY gesetzt |
| ANTHROPIC_MODEL | ✅ `nexifyai-combo-llm` Default |
| API_TIMEOUT_MS | ✅ 3000000 (5 Min) |
| CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC | ✅ 1 |
| --permission-mode auto | ✅ Wird übergeben |
| cd /workspace/nexify | ✅ |
| exec claude | ✅ Letzter Befehl |

## Ergebnis

Wrapper ist syntaktisch und logisch korrekt.
Kann bei Bedarf gestartet werden: `./claude-nexify-start.sh`
