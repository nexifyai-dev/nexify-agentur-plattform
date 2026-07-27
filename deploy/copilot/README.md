# GitHub Copilot CLI — Voll-Autonomie (NeXifyAI)

**Ziel:** Keine Ja/Nein-Bestätigungen mehr — Agentic AI Mode wie Cursor/Hermes `yolo`.

## Schnellstart

```bash
# 1. Copilot CLI installieren (falls fehlt)
gh extension install github/gh-copilot 2>/dev/null || true
# Offizielles Paket: siehe https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/install-copilot-cli

# 2. NeXify-Autonomie aktivieren (Alias + ~/.copilot/settings.json)
bash scripts/install-copilot-autonomous.sh

# 3. Immer so starten (nicht plain `copilot`)
copilot-nexify
# oder
bash scripts/copilot-autonomous.sh
```

## Was passiert

| Ebene | Mechanismus |
|-------|-------------|
| Repo | `.github/copilot/settings.json` → `"askUser": false` |
| Repo | `.github/copilot-instructions.md` → Voll-Autonomie-Mandat |
| Session | `--yolo` → alle Tools/Pfade/URLs ohne Prompt |
| Session | `--no-ask-user` → keine Rückfragen bei Unklarheit |
| Interaktiv | Slash `/yolo` oder `/allow-all` in laufender Session |

## Non-interactive (CI/Scripts)

```bash
copilot-nexify -p "Run tests and summarize" -s --no-ask-user
```

## Trusted Directory

Beim **ersten** Start im Repo: **„trust for this and future sessions“** wählen — sonst blockiert Copilot Pfadzugriff.

## Org-Policy

Wenn euer Copilot Enterprise `permissions.disableBypassPermissionsMode: disable` setzt, funktioniert `--yolo` **nicht**. Dann nur granulare `--allow-tool=…` Flags oder IT-Freigabe.

## Sicherheit

`--yolo` = volle Shell/FS/Netz-Rechte für die Session. Nur auf vertrauenswürdigem VPS/Workspace nutzen (NeXifyAI Standard: Control Plane + isolierte Agent-Hosts).

## Bezug Agentic Bootstrap

```bash
bash scripts/agentic-bootstrap.sh   # prüft auch Copilot-Setup
```
