# /copilot-autonomous

GitHub Copilot CLI ohne Ja/Nein — Voll-Autonomie (NeXifyAI Agentic Mode).

## Goal

Keine Tool-/Pfad-/URL-Bestätigungen und keine Rückfragen (`askUser`).

## Run

```bash
bash scripts/install-copilot-autonomous.sh   # einmalig
copilot-nexify                                # danach immer so
```

## Flags (intern)

`copilot --yolo --no-ask-user` — siehe `deploy/copilot/README.md`

## Pitfalls

- Plain `copilot` startet **mit** Prompts — Alias `copilot-nexify` nutzen.
- Erstes Mal: Verzeichnis dauerhaft vertrauen.
- Enterprise `disableBypassPermissionsMode` blockiert `--yolo`.
