# ChatGPT MCP Connector — Anleitung für Pascal

> Stand: 2026-06-12

## Was ist das?

Ein sicherer MCP-Server, der ChatGPT mit Claude Code / NeXify Systemmaster verbindet.
Kein direkter Shell-Zugriff — nur kontrollierte Tools.

## Voraussetzung

- ChatGPT Plus/Pro (Developer Mode oder Apps SDK benötigt)
- Der MCP-Server muss auf dem VPS laufen (Port 443 hinter Cloudflare)
- Cloudflare Access / OIDC für Auth

## Konfiguration in ChatGPT

1. ChatGPT öffnen
2. Settings → Developer Mode / Apps
3. Custom MCP Server hinzufügen:
   - **URL**: `https://mcp.nexifyai.cloud/mcp`
   - **Transport**: `streamable_http`
   - **Auth**: Cloudflare Access / Bearer Token

## Test

Sobald verbunden, ChatGPT fragen:
- `What is your status?`
- `Show me the current health of your services`
- `List open blockers`

## Sicherheit

- KEIN direkter Shell-Zugriff
- KEIN sudo
- Write-Aktionen brauchen Approval
- Alles wird geloggt

## Status

🔴 **Noch nicht live.** Sobald der Server läuft, aktualisiere ich dich hier mit den genauen Daten.
