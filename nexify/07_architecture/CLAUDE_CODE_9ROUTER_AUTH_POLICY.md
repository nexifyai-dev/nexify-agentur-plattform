# Claude Code + 9Router — Auth Policy

> Stand: 2026-06-12
> Status: FIXED

## Betriebsmodus

| Aspekt | Wert |
|---|---|
| Claude Code Account | **Kein Anthropic-Nutzerkonto** |
| LLM-Provider | 9Router → DeepSeek / nscale / eigene LLMs |
| Auth-Methode | NeXify-9Router API Key |
| Endpoint | `https://ai-router.nexifyai.cloud/v1` |

## Auth-Regel

**NUR `ANTHROPIC_API_KEY` aktiv setzen.**
`ANTHROPIC_AUTH_TOKEN` muss in **allen** Startdateien und ENV-Quellen UNSET sein.

## Geprüfte Quellen

| Datei | Status | Fix |
|---|---|---|
| `/root/.bashrc` | ✅ API_KEY only | Umgestellt (vorheriger Lauf) |
| `/root/.profile` | ✅ API_KEY only | Umgestellt (vorheriger Lauf) |
| `/root/.nexify/claude-env.sh` | ✅ API_KEY only | Umgestellt (vorheriger Lauf) |
| `/root/.claude/settings.json` | ✅ API_KEY only | AUTH_TOKEN entfernt (vorheriger Lauf) |
| `/workspace/nexify/.claude/settings.json` | ✅ API_KEY only | AUTH_TOKEN entfernt (vorheriger Lauf) |
| `/root/.bashrc.d/hermes.sh` | ✅ API_KEY only | 🔴 AUTH_TOKEN **gerade entfernt** |
| `/workspace/nexify/07_tools_cli/claude_code/claude-nexify-start.sh` | ✅ unset AUTH_TOKEN | Wrapper korrekt |

## Konsequenz

Diese Session hat alte Shell-Env geerbt. Erst **neue Login-Session** oder **Wrapper-Start** macht Auth-Konflikt endgültig frei.
