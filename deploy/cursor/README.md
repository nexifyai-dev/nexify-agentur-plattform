# FILE: /deploy/cursor/README.md
# NIR: 25.07.2026 09:02
# UPDATED: 25.07.2026 09:02
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Cursor User-Commands Sync (Windows PC ↔ Repo)
# WHY: Single Source of Truth im Repo; PC-Pfad C:\Users\pcour\.cursor\commands\
# BEST-PRACTICE: Repo `.cursor/commands/*.md` pflegen, dann sync-commands-windows.ps1
# PITFALL: V-CMD-01: Secrets in Commands; V-CMD-02: empty-window ohne Open Folder
# DEPENDS: Cursor Desktop, PowerShell, git clone des Repos
# DOCS-REF: .cursor/commands/nexifyai-commands.md
# SESSION: cursor/nexifyai-commands-9368

# Cursor Commands — NeXifyAI

## Pfade

| Ort | Pfad |
|-----|------|
| Repo (SoT) | `.cursor/commands/*.md` |
| Windows User | `C:\Users\pcour\.cursor\commands\` |
| Meta-Command | `/nexifyai-commands` → erstellen, pflegen, verwalten |

## Sync (Windows)

Im Repo-Root:

```powershell
.\deploy\cursor\sync-commands-windows.ps1
```

Oder:

```powershell
Copy-Item -Force .\.cursor\commands\*.md "$env:USERPROFILE\.cursor\commands\"
```

Dann in Cursor Chat `/` tippen. **Zuerst Open Folder** auf dem Repo.

## Pflege

`/nexifyai-commands` im Chat ausführen (list / add / update / audit / sync-to-pc).
