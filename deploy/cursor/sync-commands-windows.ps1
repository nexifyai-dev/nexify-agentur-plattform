# FILE: /deploy/cursor/sync-commands-windows.ps1
# NIR: 25.07.2026 09:02
# UPDATED: 25.07.2026 09:02
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Kopiert Repo-.cursor/commands nach %USERPROFILE%\.cursor\commands
# WHY: PC-Pfad C:\Users\pcour\.cursor\commands aus Repo-SoT befüllen
# BEST-PRACTICE: Nach git pull ausführen; keine Secrets in *.md
# PITFALL: Script aus Repo-Root starten
# DEPENDS: PowerShell 5+, Cursor Desktop
# DOCS-REF: deploy/cursor/README.md
# SESSION: cursor/nexifyai-commands-9368

[CmdletBinding()]
param(
    [string]$SourceDir = "",
    [string]$TargetDir = ""
)

$ErrorActionPreference = "Stop"

if (-not $SourceDir) {
    $repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
    $SourceDir = Join-Path $repoRoot ".cursor\commands"
}
if (-not $TargetDir) {
    $TargetDir = Join-Path $env:USERPROFILE ".cursor\commands"
}

if (-not (Test-Path $SourceDir)) {
    throw "Source missing: $SourceDir (run from repo or pass -SourceDir)"
}

New-Item -ItemType Directory -Force -Path $TargetDir | Out-Null
$files = Get-ChildItem -Path $SourceDir -Filter "*.md" -File
if (-not $files) {
    throw "No .md commands in $SourceDir"
}

Copy-Item -Path (Join-Path $SourceDir "*.md") -Destination $TargetDir -Force

Write-Host "Synced $($files.Count) command(s):"
$files | ForEach-Object { Write-Host "  /$($_.BaseName)  <- $($_.Name)" }
Write-Host "Target: $TargetDir"
Write-Host "Next: Open Folder in Cursor, then type / in chat."
