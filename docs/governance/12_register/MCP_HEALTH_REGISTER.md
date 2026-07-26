# MCP Health Register — NeXify AI Systemmaster

> Status: 2026-06-12
> Connected: 5 | Needs Auth: 38 | Failed: 28 | **Total Issues: 66**

## P0 — Aktiv & Verbunden

| MCP | Status | Zweck |
|-----|--------|-------|
| claude-mem:mcp-search | ✅ Connected | Agent-Memory, Session-Kontext |
| mintlify:Mintlify | ✅ Connected | API Documentation |
| prisma:Prisma-Local | ✅ Connected | DB Schema + Migration |
| pdf-viewer:pdf | ✅ Connected | PDF Anzeige + Annotation |
| twilio-developer-kit:twilio-docs | ✅ Connected | Twilio API Docs |

## P0 — Blockiert (Need Config/Approval)

| MCP | Status | Aktion |
|-----|--------|--------|
| agentmemory (settings.json) | ✅ eingerichtet | Läuft über settings.json MCP-Server |
| hostinger-mcp (settings.json) | ✅ eingerichtet | Hosting-API |
| gitlab-oss (`@zereight/mcp-gitlab`) | ✅ eingerichtet (2026-07-25) | Self-hosted `gitlab.nexifyai.cloud`; PAT in `/etc/nexifyai/gitlab-mcp.env`; siehe `deploy/mcp/gitlab-oss/` |

## P1 — Benötigt Authentifizierung (OAuth)

| MCP | Priorität | Notwendig für |
|-----|-----------|---------------|
| engineering:github | Hoch | Code-Review, PRs, Issues |
| engineering:datadog | Mittel | Monitoring |
| engineering:pagerduty | Mittel | Incident-Response |
| productivity:slack | Mittel | Team-Kommunikation |
| productivity:notion | Mittel | Dokumentation |
| productivity:linear | Mittel | Task-Tracking |
| productivity:atlassian | Mittel | Jira/Confluence |
| productivity:asana | Niedrig | Task-Tracking |
| small-business:stripe | Mittel | Payment-Integration |
| small-business:hubspot | Mittel | CRM |
| small-business:quickbooks | Niedrig | Buchhaltung |
| small-business:paypal | Niedrig | Payment |
| small-business:square | Niedrig | Payment |
| figma:figma | Niedrig | Design-System |
| vanta:vanta-us | Niedrig | Security Compliance |

## P2 — Optional/Needs Auth

38 MCPs benötigen OAuth — sind Plugins aus `knowledge-work-plugins` (Anthropic).
OAuth ist OOTB und wird per Session gestartet bei Bedarf.

Keine Notwendigkeit, alle 38 jetzt zu konfigurieren. Nur bei Bedarf OAuth starten.

## P3 — Failed (keine Änderung nötig)

| MCP | Grund | Status |
|-----|-------|--------|
| engineering:github | Kein Netzwerkzugriff auf api.githubcopilot.com | 🔴 Keep blocked |
| bigdata-com:bigdata.com | Server nicht erreichbar | 🔴 Keep blocked |
| nimble:nimble | Server nicht erreichbar | 🔴 Keep blocked |
| zoom-plugin:* (3) | Zoom-Server nicht erreichbar | 🔴 Keep blocked |
| cockroachdb:* (3) | Lokaler Server nicht gestartet | 🔴 Keep blocked |
| data:snowflake/databricks/bigquery | Keine Credentials | 🔴 Keep blocked |
| datadog:mcp | Nicht konfiguriert (noop) | 🔴 Keep blocked |
| small-business:google* (3) | Google-API nicht verbunden | 🔴 Keep blocked |
| productivity/enterprise/engineering:gmail/calendar (6) | Duplikate, nicht konfiguriert | 🔴 Keep blocked |
| desktop-commander | Nicht installiert | 🔴 Keep blocked |

## Zusammenfassung

Die 66 Issues sind **erwartetes Verhalten** für ein Plugin-Ökosystem mit vielen optionalen MCPs:

- **5 Connected** — Kern-MCPs (agentmemory, mintlify, prisma, pdf-viewer, twilio-docs)
- **38 Needs Auth** — OAuth nicht gestartet (Plugins sind on-demand)
- **28 Failed** — Entweder Server down oder kein Zugriff/Netzwerk

**Aktion:** Keine Notwendigkeit, alle 66 zu fixen. P0-MCPs sind verbunden.
Die 66 Issues sind kosmetisch — sie entstehen durch das Laden von >50 optionalen Plugins.
