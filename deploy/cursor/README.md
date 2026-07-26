# FILE: /deploy/cursor/README.md
# NIR: 25.07.2026 09:02
# UPDATED: 25.07.2026 09:17
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Cursor User-Commands — stets als ein Selbstausführungs-Befehl
# WHY: PC-Pfad C:\Users\pcour\.cursor\commands\ aus Repo-SoT befüllen
# BEST-PRACTICE: irm … | iex (Windows) bzw. curl … | bash
# PITFALL: V-CMD-01 Secrets; V-CMD-02 empty-window ohne Open Folder
# DEPENDS: Cursor Desktop; GitHub raw und/oder VPN/SSH zum VPS
# DOCS-REF: .cursor/commands/nexifyai-commands.md
# SESSION: cursor/nexifyai-commands-9368

# Cursor Commands — NeXifyAI

## Ein Befehl (Selbstausführung)

### Windows PowerShell

```powershell
irm "https://raw.githubusercontent.com/nexifyai-dev/nexify-agentur-plattform/cursor/nexifyai-commands-9368/deploy/cursor/install-commands.ps1" | iex
```

VPN-Fallback:

```powershell
$d="$env:USERPROFILE\.cursor\commands"; New-Item -ItemType Directory -Force $d|Out-Null; scp "root@10.66.66.1:/root/nexify-cursor-commands/*.md" $d; Get-ChildItem $d\*.md | % { "/$($_.BaseName)" }
```

### Shell

```bash
curl -fsSL "https://raw.githubusercontent.com/nexifyai-dev/nexify-agentur-plattform/cursor/nexifyai-commands-9368/deploy/cursor/install-commands.sh" | bash
```

Ziel: `%USERPROFILE%\.cursor\commands` bzw. `~/.cursor/commands`  
Meta: `/nexifyai-commands`

Nach Merge nach `main` Branch in der URL auf `main` umstellen.
