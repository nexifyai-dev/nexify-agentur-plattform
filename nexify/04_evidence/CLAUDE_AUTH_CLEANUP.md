# CLAUDE_AUTH_CLEANUP

**Datum:** 2026-06-14

## Quellen vorher (BEFORE)

`ANTHROPIC_API_KEY` wurde aus 4 Quellen exportiert (alle mit demselben Wert):

1. `/root/.nexify/claude-env.sh` (kanonisch, in `.bashrc` + `.profile` gesourcet)
2. `/root/.bashrc:153` (Duplikat, jetzt entfernt)
3. `/root/.bashrc.d/hermes.sh:5` (Duplikat, jetzt entfernt)
4. `/root/.claude/settings.json:4` (env-Block, behalten)

`ANTHROPIC_AUTH_TOKEN` war nirgends aktiv gesetzt (durch `claude-env.sh` wurde es gesetzt + sofort mit `unset` entfernt; das war defensiv).

## Quellen nachher (AFTER)

### `ANTHROPIC_API_KEY`

- `/root/.nexify/claude-env.sh` (kanonische Quelle, idempotent via Marker)
- `/root/.claude/settings.json` (env-Block, Redundanz für Claude-Code-Settings-Subsystem)

### `ANTHROPIC_BASE_URL`

- `/root/.nexify/claude-env.sh` (kanonisch)
- `/root/.claude/settings.json` (env-Block)

### `ANTHROPIC_AUTH_TOKEN`

- **Nicht gesetzt** — `unset` in `claude-code.sh` Bootstrap

## Verifikation in neuer Login-Shell

```
ANTHROPIC_API_KEY=***REDACTED***
ANTHROPIC_BASE_URL=https://ai-router.nexifyai.cloud/v1
ANTHROPIC_MODEL=nexifyai-combo-llm
ANTHROPIC_AUTH_TOKEN=(not present)
```

## Redaktion Quellenregister

| Variable | Quellpfad | Status | Entscheidung |
|---|---|---|---|
| ANTHROPIC_API_KEY | /root/.nexify/claude-env.sh | KANONISCH | behalten |
| ANTHROPIC_API_KEY | /root/.bashrc | DUPLIKAT | entfernt |
| ANTHROPIC_API_KEY | /root/.bashrc.d/hermes.sh | DUPLIKAT | entfernt |
| ANTHROPIC_API_KEY | /root/.claude/settings.json | env-Block | behalten (Settings-Subsystem) |
| ANTHROPIC_BASE_URL | /root/.nexify/claude-env.sh | KANONISCH | behalten |
| ANTHROPIC_BASE_URL | /root/.bashrc | DUPLIKAT | entfernt |
| ANTHROPIC_BASE_URL | /root/.bashrc.d/hermes.sh | DUPLIKAT | entfernt |
| ANTHROPIC_MODEL | /root/.nexify/claude-env.sh | KANONISCH | behalten |
| ANTHROPIC_AUTH_TOKEN | alle | UNSET | via `claude-code.sh` Bootstrap |
