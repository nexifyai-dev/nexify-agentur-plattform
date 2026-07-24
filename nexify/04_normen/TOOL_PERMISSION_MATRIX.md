# NeXify AI — Tool Permission Matrix
> ASI03 Identity & Privilege Abuse Prevention (OWASP Agentic 2026)
> Stand: 2026-06-23 | Version: 1.0 | Owner: CISO
> Norm: ISO 42001 A.4, ISO 27001 A.9, OWASP Agentic ASI02/ASI03

## 1. Aktueller Ist-Zustand (vor Maßnahme)

| Problem | Detail | Risiko |
|---------|--------|--------|
| **Keine Tool-Rechte-Matrix** | Alle 16 Profile haben Zugriff auf alle Skills/Tools | P0 — Privilege Abuse |
| **CEO-Profil ohne disabled_toolsets** | nexify-ceo hat keine eingeschränkten Toolsets trotz weitreichender MCP-Rechte | P0 — Goal Hijack |
| **Kein Rate Limit** | Keine Begrenzung der Tool-Aufrufe pro Agent/Turn | P1 — Unbounded Tool Use |
| **Kein Kill Switch** | Kein Mechanismus, einen Agenten bei Fehlverhalten zu stoppen | P1 — No Stop Condition |
| **Kein Approval Gate** | Keine HITL-Gates (Human In The Loop) für kritische Aktionen | P1 — Unchecked Production Access |
| **Kein Aktivitätslog** | Alle MCP-Calls sind ungeloggt | P2 — No Audit Trail |

## 2. Tool Permission Levels

```
Level 0 — No Access (kein Zugriff)
Level 1 — Read Only (lesen, suchen, abfragen)
Level 2 — Execute Scripted (vordefinierte Skripte ausführen)
Level 3 — Write Sandboxed (in Workspace schreiben, aber nicht Production)
Level 4 — Write Controlled (mit HITL-Gate in Production schreiben)
Level 5 — Admin (volle Kontrolle, nur für Pascal + CISO)
```

## 3. Agent-Rollen und Tool-Berechtigungen

### 3.1 CEO Agent (nexify-ceo)

| Toolset | Level | Begründung | Rate Limit |
|---------|-------|------------|------------|
| delegate_task | L4 | Darf delegieren, aber kein direktes Ausführen | 10/Turn |
| read_file | L3 | Lesen aller Dateien zur Prüfung | unlimitiert |
| write_file | L1 | NUR in 10_evidence/ schreiben | 5/Turn |
| patch | L0 | **SELBST AUSGESCHLOSSEN** — delegiert an Dev | 0 |
| terminal | L0 | **SELBST AUSGESCHLOSSEN** — delegiert an Dev | 0 |
| web_search | L3 | Recherche für Normen-Prüfungen | 5/Turn |
| web_extract | L3 | Quellen-Prüfung (DIN, ISO, OWASP) | 5/Turn |
| mcp_brain_* | L4 | Brain lesen + schreiben (Governance) | 20/Turn |
| mcp_qdrant_* | L3 | Qdrant lesen nur | 10/Turn |
| mcp_ragflow_* | L3 | RAGFlow lesen + chatten | 10/Turn |
| mcp_tavily_* | L3 | Web-Recherche | 5/Turn |
| mcp_agentmemory_* | L3 | Memory lesen + schreiben | 10/Turn |
| memory | L0 | **AUSGESCHLOSSEN** — delegiert an Memory-Agent | 0 |
| todo | L3 | Task-Management | 10/Turn |
| image_generate | L0 | **AUSGESCHLOSSEN** — delegiert an Design-Agent | 0 |
| text_to_speech | L0 | **AUSGESCHLOSSEN** | 0 |
| process | L0 | **AUSGESCHLOSSEN** | 0 |
| clarify | L4 | Darf Pascal fragen | 5/Turn |

### 3.2 CTO Agent (cto)

| Toolset | Level | Begründung | Rate Limit |
|---------|-------|------------|------------|
| terminal | L4 | System-Zugriff für Debug/Deploy | 20/Turn |
| read_file | L4 | Vollzugriff auf Code | unlimitiert |
| write_file | L4 | NACH Code-Review | 20/Turn |
| patch | L4 | Mit HITL-Gate für Production | 10/Turn |
| delegate_task | L3 | Darf Sub-Aufgaben delegieren | 5/Turn |
| web_search | L3 | Technische Recherche | 10/Turn |
| mcp_brain_* | L3 | Brain lesen + technische Einträge | 15/Turn |
| mcp_qdrant_* | L3 | Qdrant lesen | 10/Turn |
| memory | L0 | **AUSGESCHLOSSEN** | 0 |

### 3.3 CISO Agent (cso)

| Toolset | Level | Begründung | Rate Limit |
|---------|-------|------------|------------|
| read_file | L4 | Security-Audit aller Dateien | unlimitiert |
| terminal | L3 | NUR Security-Befehle (audit, scan, grep) | 10/Turn |
| web_search | L4 | Vulnerability-Recherche | 15/Turn |
| mcp_brain_* | L4 | Security-Governance-Einträge | 20/Turn |
| write_file | L2 | NUR in 10_evidence/ | 5/Turn |
| delegate_task | L2 | Security-Audit delegieren | 3/Turn |
| memory | L0 | **AUSGESCHLOSSEN** | 0 |
| patch | L0 | **AUSGESCHLOSSEN** | 0 |

### 3.4 Expert-Dev Agent (expert-dev)

| Toolset | Level | Begründung | Rate Limit |
|---------|-------|------------|------------|
| terminal | L4 | Build, Test, Git, Package-Manager | 30/Turn |
| read_file | L4 | Code lesen | unlimitiert |
| write_file | L4 | Code in Workspace schreiben | 30/Turn |
| patch | L4 | Targeted Edits | 20/Turn |
| git (via terminal) | L3 | NUR Branch + Commit. KEIN Push zu Main | 10/Turn |
| web_search | L3 | API-Docs, Stack Overflow | 10/Turn |
| delegate_task | L3 | Sub-Tasks delegieren | 5/Turn |
| mcp_brain_* | L2 | Brain lesen NUR | 10/Turn |
| memory | L0 | **AUSGESCHLOSSEN** | 0 |

### 3.5 Automation Agent (automation-agent)

| Toolset | Level | Begründung | Rate Limit |
|---------|-------|------------|------------|
| terminal | L3 | NUR vordefinierte Cron-Skripte | 50/Turn |
| read_file | L3 | Logs + Configs lesen | 20/Turn |
| write_file | L1 | NUR in /tmp/ | 5/Turn |
| mcp_brain_* | L3 | Status-Einträge schreiben | 20/Turn |
| web_search | L2 | Externe Status-Checks | 5/Turn |
| patch | L0 | **AUSGESCHLOSSEN** | 0 |
| delegate_task | L0 | **AUSGESCHLOSSEN** | 0 |
| memory | L0 | **AUSGESCHLOSSEN** | 0 |

### 3.6 Expert-Design / Expert-Data

| Toolset | Level | Begründung | Rate Limit |
|---------|-------|------------|------------|
| read_file | L3 | Design-Dateien / Daten | unlimitiert |
| write_file | L3 | Design-Outputs / Reports | 15/Turn |
| image_generate | L4 | Bilder generieren | 10/Turn |
| web_search | L3 | Design-Recherche / Daten-Quellen | 10/Turn |
| terminal | L2 | NUR Data-Processing-Skripte | 10/Turn |
| delegate_task | L2 | Sub-Tasks | 3/Turn |
| patch | L0 | **AUSGESCHLOSSEN** | 0 |
| memory | L0 | **AUSGESCHLOSSEN** | 0 |

### 3.7 Agentur-Admin

| Toolset | Level | Begründung | Rate Limit |
|---------|-------|------------|------------|
| ALL | L5 | Vollzugriff für Admin-Aufgaben | unlimitiert |
| NUR für Pascal | — | Nur auf expliziten Befehl aktivieren | — |

## 4. Rate-Limit-Definition

| Kategorie | Limit | Konsequenz bei Überschreitung |
|-----------|-------|-------------------------------|
| **Read-Aktionen** | 100/Turn | Warnung bei 80, Stop bei 100 |
| **Write-Aktionen** | 30/Turn | Block bei 30, Eskalation an CISO |
| **Critical-Aktionen** (patch/terminal write) | 10/Turn | HITL-Gate nach 5 |
| **Delegationen** | 10/Turn | Block bei 10, Stack-Overflow-Schutz |
| **Web/Netzwerk** | 20/Turn | Block bei 20, mögliche Loop |

Implementierung: Hermes-cron-job `rate-limit-monitor` prüft stündlich Logs auf Überschreitungen.

## 5. Kill-Switch-Pattern

Jeder Agent muss auf folgende Befehle reagieren:

| Befehl | Wirkung |
|--------|---------|
| `/stop` | Sofortiger Abbruch des aktuellen Tasks |
| `/halt` | Task + alle Sub-Tasks abbrechen |
| `/reset` | Alle laufenden Aktionen abbrechen, Stack leeren |
| `/rollback` | Letzte Write-Aktion rückgängig (wo möglich) |
| `/emergency` | Alle Agenten stoppen, CISO alarmieren |

Implementierung: Hermes-systemd-Unit `kill-switch.service` lauscht auf `/tmp/kill-switch/*`.

## 6. HITL-Gate (Human In The Loop)

Folgende Aktionen erfordern Freigabe durch Pascal:

| Aktion | Ausnahme |
|--------|----------|
| Production-Deployment | Keine |
| Merge zu Main/Production-Branch | Keine |
| Secrets-Änderung | Keine |
| Infrastruktur-Änderung (Docker, systemd, DNS) | Keine |
| Kunden-Daten-Berührung | Keine |
| Kostenpflichtige Aktionen (>0€) | Keine |
| Löschung von Daten | Keine |
| Neue SaaS-Tools | Keine |

Implementierung: Hermes-Plugin `hitl-gate` — blockiert die Aktion + schreibt `WAITING_FOR_APPROVAL` in /tmp/hitl-gate/.

## 7. Implementation Roadmap

| Phase | Maßnahme | Deadline | Owner |
|-------|----------|----------|-------|
| **P0-1d** | disabled_toolsets in Hermes-Profilen setzen | 1 Tag | CTO |
| **P0-1d** | HITL-Gate-Hook (bash-Fallback) | 1 Tag | CTO |
| **P0-1w** | Rate-Limit Hermes-Cron-Job | 1 Woche | CTO |
| **P0-1w** | Kill-Switch systemd-Unit | 1 Woche | CTO |
| **P0-1m** | Aktivitätslog + Dashboard | 1 Monat | CTO + CISO |
| **P0-1m** | HITL-Gate-Plugin (Hermes-nativ) | 1 Monat | CTO |

## 8. Änderungsprotokoll

| Datum | Version | Änderung | Autor |
|-------|---------|----------|-------|
| 2026-06-23 | 1.0 | Ersterstellung — 7 Agent-Rollen, 5 Permission-Levels, Rate-Limits, Kill-Switch, HITL-Gates | CISO / Systemmaster |
