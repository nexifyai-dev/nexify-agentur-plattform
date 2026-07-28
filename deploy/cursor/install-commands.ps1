# FILE: /deploy/cursor/install-commands.ps1
# NIR: 25.07.2026 09:17
# UPDATED: 25.07.2026 09:17
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: One-shot Installer: NeXify Cursor-Commands nach %USERPROFILE%\.cursor\commands
# WHY: User soll stets einen einzigen selbstausführbaren PowerShell-Befehl bekommen
# BEST-PRACTICE: irm <raw-url> | iex  ODER  scp-Variante über VPN
# PITFALL: Ausführen in Windows PowerShell 5+ / pwsh; kein Admin nötig
# DEPENDS: Netzwerk zu GitHub raw ODER SSH/scp zum VPS
# DOCS-REF: deploy/cursor/README.md
# SESSION: cursor/nexifyai-commands-9368

[CmdletBinding()]
param(
    [ValidateSet("github", "vps", "repo")]
    [string]$Source = "github",
    [string]$Branch = "cursor/nexifyai-commands-9368",
    [string]$VpsHost = "10.66.66.1",
    [string]$TargetDir = ""
)

$ErrorActionPreference = "Stop"

if (-not $TargetDir) {
    $TargetDir = Join-Path $env:USERPROFILE ".cursor\commands"
}

$names = @(
    "nexifyai-commands",
    "gitlab-oss-mcp",
    "nine-router",
    "vpn-ssh",
    "governance-f32",
    "pr-flow",
    "mcp-health",
    "vps-ops"
)

New-Item -ItemType Directory -Force -Path $TargetDir | Out-Null

switch ($Source) {
    "github" {
        $base = "https://raw.githubusercontent.com/nexifyai-dev/nexify-agentur-plattform/$Branch/.cursor/commands"
        foreach ($n in $names) {
            $url = "$base/$n.md"
            $out = Join-Path $TargetDir "$n.md"
            Write-Host "GET $url"
            Invoke-WebRequest -Uri $url -OutFile $out -UseBasicParsing
        }
    }
    "vps" {
        $remote = "root@${VpsHost}:/root/nexify-cursor-commands/*.md"
        Write-Host "SCP $remote -> $TargetDir"
        & scp $remote $TargetDir
        if ($LASTEXITCODE -ne 0) { throw "scp failed (VPN/SSH? Host=$VpsHost)" }
    }
    "repo" {
        $repoCommands = Join-Path (Get-Location) ".cursor\commands"
        if (-not (Test-Path $repoCommands)) {
            throw "No .cursor\commands here. cd into nexify-agentur-plattform or use -Source github|vps"
        }
        Copy-Item -Force (Join-Path $repoCommands "*.md") $TargetDir
    }
}

Write-Host ""
Write-Host "OK -> $TargetDir"
Get-ChildItem -Path $TargetDir -Filter "*.md" | Sort-Object Name | ForEach-Object {
    Write-Host ("  /{0}" -f $_.BaseName)
}
Write-Host ""
Write-Host "Next: Cursor -> Open Folder (Repo) -> Chat tippe / -> /nexifyai-commands"
