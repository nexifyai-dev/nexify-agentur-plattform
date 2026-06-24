---
id: TEAM_SYSTEM_V1
title: Team-System – 12 Spezialisierte Teams
version: 1.0.0
status: active
created: 2026-06-10
author: System-Architektur
tags: [teams, organisation, rollen, kanban]
mermaid: teams_overview, team_flows
---

# TEAM_SYSTEM_V1 – 12 Spezialisierte Teams

## Überblick

Das Nexify-Agentensystem wird durch **12 spezialisierte Teams** betrieben, die jeweils klar definierte Rollen, Verantwortlichkeiten und Kanban-Queues besitzen. Jedes Team arbeitet autonom, ist aber über den Dispatcher und die Task-Registry mit allen anderen Teams verbunden.

---

## Team-Übersicht

| # | Team | Codename | Purpose |
|---|------|----------|---------|
| 01 | Orchestrierung/Kontext | `orchestra` | Master-Registry, Session-Control, Gate-Kontrolle |
| 02 | Anforderungen/Auftragsfach | `intake` | Requirements Engineering, Intake, User Stories |
| 03 | Automatik/Dispatcher | `auto` | Chat Operator, Automation Controller, Queue-Management |
| 04 | Kanban/ToDo | `kanban` | Task-Registry, Priorisierung, Fortschritt |
| 05 | Brain/agentmemory/Knowledge | `cortex` | Memory-Schicht, Knowledge-Management |
| 06 | Skills/MCP/Tools | `skills` | Skill-First, MCP-Routing, Tool-Permissions |
| 07 | UI/CI/Design | `ux` | Workstation-Veredelung, Designsystem |
| 08 | Router/Modelle | `9router` | 9Router, Provider, Fallback |
| 09 | DevOps/Infrastruktur | `infra` | DNS, Cloudflare, Vercel, Server |
| 10 | Security/Compliance | `guard` | Audits, Policy Gate, Security-Prüfung |
| 11 | Vertrieb/Support/Angebote | `sales` | CRM, Sales, Delivery |
| 12 | Review/QR/Evidence | `qr` | Quality Review, Crush, Evidence |

---

## Team 01 – Orchestrierung/Kontext (`orchestra`)

- **Purpose**: Zentrales Master-Registry für alle Agenten, Sessions und Kontexte. Steuert den Lebenszyklus jeder Session und führt die Gate-Kontrolle durch.
- **Key Responsibilities**:
  - Master-Registry aller aktiven Agenten und Sub-Agenten
  - Session-Lifecycle-Management (Init → Active → Suspend → Terminate)
  - Gate-Kontrolle: Prüfung der Berechtigungen vor jedem Dispatch
  - Kontext-Sync zwischen Teams
- **Member Types**: Orchestrator-Agent, Session-Manager, Gate-Keeper
- **Tools**: `registry`, `session_control`, `gate`, `context_bridge`
- **Kanban-Queue**: `queue:orchestra` (P0 priorisiert)

---

## Team 02 – Anforderungen/Auftragsfach (`intake`)

- **Purpose**: Aufnahme, Strukturierung und Validierung aller eingehenden Anforderungen – von User-Stories bis zu technischen Spezifikationen.
- **Key Responsibilities**:
  - Requirements-Intake und -Strukturierung
  - User-Story-Erstellung (INVEST-konform)
  - Abnahmekriterien-Definition
  - Traceability-Anlage (Anforderung → Task → Evidence)
- **Member Types**: Requirements-Engineer, Product-Owner-Agent, Intake-Manager
- **Tools**: `story_writer`, `requirement_analyzer`, `acceptance_criteria`
- **Kanban-Queue**: `queue:intake`

---

## Team 03 – Automatik/Dispatcher (`auto`)

- **Purpose**: Zentrale Automatisierungs- und Dispatch-Engine. Steuert die Weiterleitung von Tasks an die zuständigen Teams, automatisiert Abläufe und verwaltet die Queue.
- **Key Responsibilities**:
  - Chat-Operator-Funktion (Eingabe-/Ausgabe-Kommunikation)
  - Automation-Controller (Zustandsmaschine)
  - Queue-Management (Priorisierung, Routing, Lastverteilung)
  - Event-Hooks für Task-Lifecycle
- **Member Types**: Dispatcher-Agent, Automation-Controller, Queue-Manager
- **Tools**: `dispatcher`, `automation_controller`, `queue_manager`, `chat_operator`
- **Kanban-Queue**: `queue:auto`
- *Siehe auch*: `DISPATCHER_ARCHITEKTUR_V1.md`, `AUTOMATION_CONTROLLER_V1.md`

---

## Team 04 – Kanban/ToDo (`kanban`)

- **Purpose**: Verwaltung der zentralen Task-Registry. Priorisiert Aufgaben, überwacht den Fortschritt und stellt sicher, dass nichts liegenbleibt.
- **Key Responsibilities**:
  - Task-Registry-Pflege (ID, Status, Owner, Priorität)
  - Priorisierung nach (P0 > P1 > P2 > P3)
  - Fortschritts-Tracking und Reporting
  - Blocking-Issue-Erkennung und -Eskalation
- **Member Types**: Kanban-Agent, Priorisierer, Fortschrittsmonitor
- **Tools**: `task_registry`, `prioritizer`, `progress_tracker`
- **Kanban-Queue**: `queue:kanban`
- *Siehe auch*: `TASK_REGISTRY_V1.md`

---

## Team 05 – Brain/agentmemory/Knowledge (`cortex`)

- **Purpose**: Persistente Wissensschicht des gesamten Systems. Speichert und liefert Kontext, Entscheidungen, Fehler und Erfolgsmuster.
- **Key Responsibilities**:
  - Memory-Sync vor/nach jedem Task
  - Knowledge-Graph-Management
  - Embedding-basierte Ähnlichkeitssuche
  - Kontext-Verdichtung (Summarization)
- **Member Types**: Memory-Agent, Knowledge-Graph-Manager, Embedding-Service
- **Tools**: `mem_store`, `knowledge_graph`, `embedding_search`, `context_summarizer`
- **Kanban-Queue**: `queue:cortex`

---

## Team 06 – Skills/MCP/Tools (`skills`)

- **Purpose**: Verwaltet alle Skills, MCP-Tools und deren Berechtigungen. Stellt sicher, dass nur autorisierte Tools mit den korrekten Parametern ausgeführt werden.
- **Key Responsibilities**:
  - Skill-Registry und -Lifecycle
  - MCP-Routing (Tool-Aufruf → korrekter Provider)
  - Tool-Permission-Management
  - Skill-Versionierung und -Tests
- **Member Types**: Skill-Manager, MCP-Router, Permission-Controller
- **Tools**: `skill_registry`, `mcp_router`, `tool_permissions`, `skill_tester`
- **Kanban-Queue**: `queue:skills`

---

## Team 07 – UI/CI/Design (`ux`)

- **Purpose**: Gestaltung und Optimierung der Benutzeroberflächen und des CI/CD-Designsystems.
- **Key Responsibilities**:
  - Workstation-Veredelung (Agent-Oberflächen)
  - Designsystem-Pflege und -Weiterentwicklung
  - CI-Komponenten-Design
  - Barrierefreiheit und UX-Standards
- **Member Types**: UI-Designer, CI-Designer, UX-Auditor
- **Tools**: `design_system`, `ui_component_lib`, `ux_checker`
- **Kanban-Queue**: `queue:ux`

---

## Team 08 – Router/Modelle (`9router`)

- **Purpose**: Intelligentes Routing von Anfragen an die optimalen KI-Modelle. Verwaltet Provider, Fallbacks und Kostenoptimierung.
- **Key Responsibilities**:
  - 9Router-Betrieb (Anfrage → Modell-Selektion)
  - Provider-Management (OpenAI, Anthropic, Open Source, etc.)
  - Fallback-Kaskaden bei Fehlern
  - Kosten- und Latenz-Optimierung
- **Member Types**: Router-Agent, Provider-Manager, Cost-Optimizer
- **Tools**: `9router`, `provider_manager`, `fallback_chain`, `cost_analyzer`
- **Kanban-Queue**: `queue:9router`

---

## Team 09 – DevOps/Infrastruktur (`infra`)

- **Purpose**: Betrieb und Wartung der gesamten Infrastruktur – von DNS über Cloudflare bis zu Deployment-Pipelines.
- **Key Responsibilities**:
  - DNS- und Domain-Verwaltung
  - Cloudflare-Konfiguration (WAF, Cache, Rules)
  - Vercel-Deployments
  - Server-Orchestrierung und -Monitoring
- **Member Types**: DevOps-Ingenieur, Cloudflare-Spezialist, Deployment-Manager
- **Tools**: `dns_manager`, `cloudflare_api`, `vercel_deploy`, `infra_monitor`
- **Kanban-Queue**: `queue:infra`

---

## Team 10 – Security/Compliance (`guard`)

- **Purpose**: Überwachung und Durchsetzung aller Sicherheits- und Compliance-Richtlinien im gesamten System.
- **Key Responsibilities**:
  - Security-Audits (automatisiert und manuell)
  - Policy-Gate-Betrieb (Prüfung vor jeder Aktion)
  - Security-Prüfung von Code, Konfiguration und Deployments
  - Incident-Response und Forensik
- **Member Types**: Security-Auditor, Policy-Enforcer, Compliance-Manager
- **Tools**: `audit_runner`, `policy_gate`, `security_scanner`, `incident_handler`
- **Kanban-Queue**: `queue:guard`

---

## Team 11 – Vertrieb/Support/Angebote (`sales`)

- **Purpose**: Kundenorientierte Prozesse – von der Anfrage über Angebote bis zur Auslieferung und zum Support.
- **Key Responsibilities**:
  - CRM-Pflege und Kundenverwaltung
  - Angebotserstellung und -verfolgung
  - Delivery-Koordination
  - Support-Ticket-Management
- **Member Types**: Sales-Agent, CRM-Manager, Support-Agent
- **Tools**: `crm_interface`, `offer_generator`, `delivery_coordinator`, `support_ticket`
- **Kanban-Queue**: `queue:sales`

---

## Team 12 – Review/QR/Evidence (`qr`)

- **Purpose**: Qualitätssicherung durch systematische Reviews, Crush-Reviews und Evidence-Dokumentation.
- **Key Responsibilities**:
  - Code-Reviews (4-Augen-Prinzip)
  - Crush-Reviews bei Code-Änderungen
  - QR-Checkliste und -Dokumentation
  - Evidence-Sammlung und -Archivierung
- **Member Types**: Review-Agent, QR-Manager, Evidence-Archivar
- **Tools**: `code_reviewer`, `crush_review`, `qr_checklist`, `evidence_store`
- **Kanban-Queue**: `queue:qr`
- *Siehe auch*: `REVIEW_QR_PROZESS_V1.md`

---

## Team-übergreifende Kommunikation

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Team 01    │◄───►│  Team 03    │◄───►│  Team 04    │
│  Orchestra  │     │  Auto       │     │  Kanban     │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Team 02    │     │  Team 05    │     │  Team 06    │
│  Intake     │     │  Cortex     │     │  Skills     │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Team 07    │     │  Team 08    │     │  Team 09    │
│  UX         │     │  9Router    │     │  Infra      │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Team 10    │     │  Team 11    │     │  Team 12    │
│  Guard      │     │  Sales      │     │  QR         │
└─────────────┘     └─────────────┘     └─────────────┘
```

Jedes Team kommuniziert über den **Dispatcher (Team 03)** mit anderen Teams. Die **Task-Registry (Team 04)** protokolliert alle Interaktionen. **Team 10 (Guard)** prüft jede teamübergreifende Aktion.

---

## Version History

| Version | Datum | Änderung |
|---------|-------|----------|
| 1.0.0   | 2026-06-10 | Initiale Team-Definition |
