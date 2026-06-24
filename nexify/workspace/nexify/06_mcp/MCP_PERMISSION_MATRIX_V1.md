# MCP PERMISSION MATRIX V1

**Status:** 🟢 Entwurf / Draft
**Version:** 1.0.0
**Datum:** 2026-06-11
**Autor:** Subagent 20260611_5
**Audit-Pflicht:** Ja

---

## 1. Überblick

Diese Matrix definiert die **Berechtigungsstufen für alle Fähigkeiten (Capabilities)** im NeXify-System. Jeder Agent hat basierend auf seiner Rolle und dem Sicherheitskontext einen spezifischen Berechtigungslevel.

> **Leitsatz:** Ein Agent darf nur die Fähigkeiten nutzen, die für seine aktuelle Aufgabe erforderlich sind. Niemals mehr. (Principle of Least Privilege)

---

## 2. Berechtigungs-Stufen

| Stufe | Bezeichnung | Beschreibung | Genehmigung |
|-------|------------|-------------|-------------|
| **P0** | 🔓 Vollzugriff | Alle Fähigkeiten (nur Oracle/Admin) | Automatisch |
| **P1** | 🔑 Freigabe-Pflicht | Riskante Operationen mit Freigabe | Approval Gate |
| **P2** | 🔐 Standard | Normale Fähigkeiten | Automatisch |
| **P3** | 👁️ Read-Only | Nur Lese-Zugriff | Automatisch |
| **P4** | ⛔ Kein Zugriff | Keine Fähigkeiten nutzbar | — |

---

## 3. Permission Matrix

### 3.1 Agenten-Berechtigungen (Übersicht)

| Agent | Standard-Level | Max-Level | Besondere Einschränkungen |
|-------|---------------|-----------|--------------------------|
| **Oracle** | P0 | P0 | Keine — voller Zugriff |
| **Admin** | P1 | P0 | Benötigt Freigabe für S4 |
| **Goose Systemmaster** | P2 | P1 | Keine S4 ohne Freigabe |
| **Goose Subagent** | P3 | P2 | Temporäre Erhöhung nur durch Systemmaster |
| **Promptmaster** | P1 | P0 | Nur für Prompt-bezogene Fähigkeiten |
| **Hermes** | P2 | P1 | Keine Infra-Änderungen |
| **Hermes WebUI User** | P3 | P2 | Keine Admin-Funktionen |
| **Kilo** | P2 | P1 | Nur Audit/Scan |
| **Crush** | P2 | P1 | Nur Audit/Validate |
| **Auto-Chat** | P2 | P1 | Mit Observer-Zwang |
| **Observer** | P2 | P1 | Nur Beobachtung, keine Änderungen |
| **Compression** | P2 | P1 | Mit Backup-Zwang |
| **Gast/Extern** | P4 | P3 | Nur öffentliche Fähigkeiten |

### 3.2 Fähigkeits-Berechtigungen (Detail-Matrix)

| # | Capability | Kategorie | Standard-Berechtigung | Freigabe-Erforderlich | Audit-Pflicht | Besondere Bedingungen |
|---|-----------|-----------|---------------------|----------------------|--------------|----------------------|
| 1 | `mcp_read` | S0 | Alle (P3) | Nein | Nein | — |
| 2 | `mcp_write` | S0 | Alle (P2) | Nein | Nein | — |
| 3 | `mcp_tool_call` | S0 | Alle (P2) | Nein | Nein | — |
| 4 | `brain_query` | S0 | Alle (P3) | Nein | Nein | — |
| 5 | `memory_sync` | S0 | Alle (P2) | Nein | Nein | — |
| 6 | `9router_query` | S1 | Alle (P2) | Nein | Nein | — |
| 7 | `goose_acc` | S2 | Systemmaster (P2), Subagent (P3) | Nein | Ja | Nur mit aktiver Task |
| 8 | `hermes_cli` | S2 | Hermes (P2), Oracle (P0) | Nein | Nein | — |
| 9 | `kilo_cli` | S2 | Kilo (P2) | Nein | Ja | Nur mit aktiver Audit-Task |
| 10 | `crush_audit` | S2 | Crush (P2), Oracle (P0) | Nein | Ja | Nur mit aktiver Audit-Task |
| 11 | `cloudflare_dns` | S3 | Oracle (P1), Admin (P1) | Ja | Ja | Change-Plan erforderlich |
| 12 | `domain_management` | S4 | Oracle (P1), Admin (P1) | Ja | Ja | Rollback-Plan erforderlich |
| 13 | `rollback_exec` | S4 | Oracle (P1), Admin (P1) | Ja | Ja | Nur mit aktuellem Backup |
| 14 | `tunnel_reduction` | S4 | Oracle (P1), Admin (P1) | Ja | Ja | Change-Plan erforderlich |
| 15 | `subdomain_mgmt` | S3 | Oracle (P2), Admin (P2) | Nein | Ja | Nur dokumentierte Änderungen |
| 16 | `vercel_domain` | S3 | Oracle (P1), Admin (P1) | Ja | Ja | Deploy nur mit Gate |
| 17 | `goose_session` | S1 | Systemmaster (P2), Subagent (P2) | Nein | Nein | — |
| 18 | `goose_acc_chain` | S2 | Systemmaster (P2) | Nein | Ja | Nur mit aktiver Chain |
| 19 | `hermes_webui` | S1 | Hermes (P2), User (P3) | Nein | Nein | — |
| 20 | `hermes_automation` | S2 | Oracle (P2), Hermes (P2) | Nein | Ja | Massen-Automation mit Freigabe |
| 21 | `oracle_dispatch` | S2 | Oracle (P0) | Nein | Ja | Jeder Dispatch wird geloggt |
| 22 | `promptmaster_gov` | S2 | Promptmaster (P1) | Ja | Ja | Prompt-Change-Control |
| 23 | `auto_chat_driver` | S2 | Auto-Chat (P2) | Ja | Ja | Observer muss aktiv sein |
| 24 | `observer_service` | S1 | Observer (P2), Alle (P3) | Nein | Nein | — |
| 25 | `compression_service` | S2 | Alle (P2) | Nein | Ja | Backup vor Compression |
| 26 | `connection_loss_handler` | S2 | Goose (P2) | Nein | Ja | Recovery wird geloggt |
| 27 | `evidence_system` | S1 | Alle (P2) | Nein | Nein | Löschen verboten |
| 28 | `kanban_task` | S1 | Alle (P2) | Nein | Nein | Löschen mit Freigabe |
| 29 | `regelwerke_access` | S0 | Alle (P3) | Nein | Nein | Ändern verboten |
| 30 | `skill_registry` | S0 | Alle (P2) | Nein | Nein | — |
| 31 | `oss_candidates` | S2 | Oracle (P2), Architekten (P2) | Nein | Nein | — |
| 32 | `global_policy` | S0 | Alle (P2) | Nein | Nein | Umgehen verboten |
| 33 | `rule_conflict_register` | S1 | Alle (P2) | Nein | Ja | Nur lesen, nicht löschen |
| 34 | `audit_master` | S1 | Alle (P2), Auditoren (P1) | Nein | Ja | Audit-Logs unveränderbar |
| 35 | `feedback_loop` | S1 | Alle (P2) | Nein | Nein | — |
| 36 | `dos_gates` | S0 | Alle (P2) | Nein | Nein | Bypass nur mit Freigabe |
| 37 | `done_regel` | S0 | Alle (P2) | Nein | Nein | — |
| 38 | `skill_first_regel` | S0 | Alle (P2) | Nein | Nein | — |
| 39 | `memory_pflicht` | S0 | Alle (P2) | Nein | Nein | — |
| 40 | `brain_gebot` | S0 | Alle (P2) | Nein | Nein | — |
| 41 | `positive_surprise` | S1 | Alle (P2) | Nein | Nein | — |
| 42 | `promptmaster_change_control` | S4 | Promptmaster (P1) | Ja | Ja | 4-Augen-Prinzip |
| 43 | `no_full_crash` | S0 | Alle (P2) | Nein | Ja | Geschützte Systeme niemals ändern |
| 44 | `change_safety` | S2 | Alle (P2) | Nein | Ja | Baseline vor jeder Änderung |
| 45 | `oracle_question_routing` | S1 | Oracle (P0), Alle (P3) | Nein | Nein | — |
| 46 | `oracle_agent_dispatch` | S1 | Oracle (P0) | Nein | Ja | — |
| 47 | `oracle_research` | S2 | Oracle (P2) | Nein | Nein | Nur Oracle |
| 48 | `oracle_knowledge_migration` | S4 | Oracle (P1) | Ja | Ja | Backup vor Migration |

---

## 4. Berechtigungs-Eskalation

### 4.1 Temporäre Berechtigungs-Erhöhung

| Schritt | Beschreibung | Verantwortlich |
|---------|-------------|---------------|
| 1 | Agent beantragt temporäre Erhöhung bei Oracle | Ausführender Agent |
| 2 | Oracle prüft Begründung und Dringlichkeit | Oracle |
| 3 | Bei Freigabe: Erhöhung für max. 1 Session | Oracle |
| 4 | Erhöhung wird geloggt und auditiert | System |
| 5 | Nach Session-Ende: automatische Rückstufung | System |

### 4.2 Notfall-Eskalation

Im Fehlerfall (z. B. System-Ausfall) kann Oracle temporär P0 für jeden Agenten gewähren. Jede Notfall-Eskalation wird mit vollständigem Kontext protokolliert.

---

## 5. Berechtigungs-Regeln

### 5.1 Grundregeln

1. **Kein Agent** hat standardmäßig Zugriff auf Fähigkeiten außerhalb seines Levels
2. **Jede Berechtigungs-Erhöhung** muss dokumentiert und begründet werden
3. **Berechtigungen verfallen** nach Session-Ende oder Timeout (max. 24h)
4. **Read-Only-Agents** (P3) dürfen niemals schreibende Operationen ausführen
5. **Subagents** erben Berechtigungen vom spawnenden Agenten, aber nie höher

### 5.2 Ausnahmen

| Ausnahme | Regel | Begründung |
|----------|-------|-----------|
| Oracle hat P0 auf allem | Grundsatz | Oracle ist die zentrale Autorität |
| Observer hat P2 auf allen Fähigkeiten | Notwendigkeit | Observer muss alles überwachen können |
| Admin hat P1 auf Infra-Fähigkeiten | Arbeitsebene | Admin braucht schnellen Zugriff im Betrieb |

---

## 6. Audit & Compliance

### 6.1 Audit-Pflichtige Aktionen

Folgende Aktionen werden immer auditiert:
- Berechtigungs-Erhöhung oder -Änderung
- Zugriff auf S4-Fähigkeiten
- Fehlgeschlagene Berechtigungs-Prüfungen
- Notfall-Eskalationen
- Änderungen an der Permission Matrix selbst

### 6.2 Compliance-Prüfung

- **Täglich**: Automatischer Abgleich der Permission Matrix mit tatsächlichen Zugriffen
- **Wöchentlich**: Review aller Berechtigungs-Erhöhungen der letzten Woche
- **Monatlich**: Vollständiges Berechtigungs-Audit

---

## 7. Änderungsprotokoll

| Datum | Version | Änderung | Autor |
|-------|---------|----------|-------|
| 2026-06-11 | 1.0.0 | Initiale Permission Matrix mit 48 Fähigkeiten | Subagent 20260611_5 |

---

*Ende der Permission Matrix. Alle Änderungen an diesem Dokument sind evidence-pflichtig.*
