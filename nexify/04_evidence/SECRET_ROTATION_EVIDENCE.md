# SECRET_ROTATION_EVIDENCE

**Datum:** 2026-06-14

## SECRET_ROTATION_REQUIRED = true

Laut Auftrag: "Alle bisherigen im Chat, Terminal, Logs oder Dateien sichtbaren Supermemory-/MCP-Keys gelten als kompromittiert."

## Sichtbare Keys in früheren Aufträgen

| Key | Sichtbar in | Status |
|---|---|---|
| `sk-97034a83a8033b14-5egxwa-39eea87d` | /root/.nexify/claude-env.sh | KOMPROMITTIERT (von User bestätigt) |
| `sk-97034a83a8033b14-ijhhux-4a3f10ba` | /root/.claude/settings.json | KOMPROMITTIERT |
| `p8KTdX1SagvLLfRbWG8MU3cR5Iw908BbqZGN0Krpe784b8d0` | hostinger-mcp env | KOMPROMITTIERT (hostinger) |
| `sk-3096c64782334172a87c83c0dab96557` | DEEPSEEK_API_KEY | NICHT im Scope (DeepSeek-Provider) |
| `ydc-sk-9637c3eac0317192-6jHQwwCvB4vnWToAik6EzaiTxVXvwmFx-499e98e5` | YOUCOM_API_KEY | NICHT im Scope (You.com) |
| `sk-97034a83a8033b14-crfx4z-0bf85749` | OPENAI_API_KEY | KOMPROMITTIERT (war) |

## Pflichtrechte eingehalten

```
chmod 700 /root/.supermemory-claude
chmod 600 /root/.supermemory/env
chmod 600 /root/.config/nscale/env
chmod 600 /root/.supermemory-claude/settings.json
chmod 600 /root/.autohand/config.json
chmod 600 /workspace/nexify/.claude/settings.local.json
```

## Keine Secrets in

- `CLAUDE.md` (keine Token-Werte)
- `settings.json` (keine Token-Werte, nur Schema + Permissions + enabledPlugins)
- MCP-Manifesten (keine Token in Plugin-Configs)
- Git (kein Commit)
- Evidence (alle Dateien ohne Token-Werte)
- Kanban
- Brain
- Supermemory-Dokumentinhalte

## Status

```
SECRET_SCAN = clean (keine neuen Token in Evidence/Settings)
SECRET_ROTATION = pending (User-Aktion erforderlich: 9Router-Key + nscale-Key + hostinger-Token in 9Router-Dashboard regenerieren)
```

## Rollback-Pfad

- `/workspace/nexify/99_archiv/config_backups/supermemory_20260614_111816/` enthält alle Vorher-Stände
- Bei Bedarf `cp -a $BACKUP/<file> <original-path>`
