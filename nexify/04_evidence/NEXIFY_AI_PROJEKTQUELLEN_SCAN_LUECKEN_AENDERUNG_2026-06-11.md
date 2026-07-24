# NeXify AI — Projektquellen-Scan, Lücken-Schließung und Änderungserlass

**Datum**: 2026-06-11  
**Status**: **VERBINDLICH — P0-Ergänzung**  
**Klassifikation**: NeXify-intern | Critical | Governance  

---

## Präambel

Dieser Erlass konsolidiert alle bisher verstreuten Projektquellen, Aufträge, Regelwerke, CLI-/Plugin-/Repo-Quellen, Agentenlogiken und Betriebsvorgaben zu einem vollständigen, prüfbaren NeXify-Gesamtsystem. Er identifiziert kritische Lücken im bestehenden Quellenbestand, definiert die erforderlichen Pflichtdateien pro Lücke, setzt verbindliche Regeln für deren Schließung und legt die neue Sofort-Reihenfolge (P0-001 bis P0-015) fest.

**Kernkorrektur**: Nicht noch mehr Einzelaufträge. Nicht noch mehr verstreute Regelwerke. Jetzt: zentrale Register, Bauplan, Secret-Management, Capability-MCP, Oracle-Zielbetrieb, Promptmaster-Governance, 9Router-No-Crash und Real-Progress-Gates.

---

## 1. Ergebnis des Scans

Die bisherigen Projektquellen enthalten eine starke Grundarchitektur mit folgenden aktiven Komponenten:

| Komponente | Status |
|---|---|
| Workstation / Hermes WebUI | Aktiv |
| Auftragsfach | Aktiv |
| Kanban | Aktiv |
| Brain / agentmemory | Aktiv |
| Auto-Chat / User-Chat-Driver | Aktiv |
| Claude Code Systemmaster | Aktiv |
| Goose ACC / CLI | Aktiv |
| 9Router | Aktiv |
| Graphite-CI | Aktiv |
| GitHub / Vercel / Cloudflare / Supabase | Aktiv |
| Evidence | Aktiv |
| Review | Aktiv |
| Oracle-Zielbild | In Planung |

Trotz dieser soliden Basis bleiben **12 kritische Lücken**, die im Folgenden detailliert beschrieben werden. Jede Lücke definiert Pflichtdateien, eine verbindliche Regel und konkrete Akzeptanzkriterien.

---

## 2. Bisher noch zu schwach verankerte Lücken

### 2.1 Vollständiges Quellen-/Repo-/Plugin-/CLI-Register

**Beschreibung**: Fehlende zentrale Übersicht über alle Quellen, Repositories, Plugins und CLI-Tools. Ohne Register ist nicht prüfbar, welche Komponenten aktuell sind, welche fehlen und wo Inkonsistenzen bestehen.

**Pflichtdateien**:
- `/workspace/nexify/30_operating_data/NEXIFY_SOURCE_REPO_PLUGIN_CLI_MASTER_REGISTER.md`
- `/workspace/nexify/30_operating_data/nexify-source-repo-plugin-cli-master-register.json`
- `/workspace/nexify/30_operating_data/NEXIFY_SOURCE_COVERAGE_GAP_REPORT.md`
- `/workspace/nexify/30_operating_data/nexify-source-coverage-gap-report.json`

**Mindestquellen (12 Repos)**:
1. `hermes-webui` — Hermes Workstation WebUI
2. `claude-code-templates` — Claude Code Promptvorlagen
3. `agentmemory` — Brain-Agent-Gedächtnis
4. `9router` — 9Router API Gateway Core
5. `9router-web-search` — 9Router Web Search Plugin
6. `rtk` — RTK Toolchain
7. `caveman` — Caveman Compression Engine
8. `karpathy-skills` — Karpathy Skill Set
9. `crush` — CRUSH Scheduling Engine
10. `kilocode` — KiloCode Codebase Analyzer
11. `agency-agents` — Agency Agent Framework
12. `simplex-chat` — Simplex Chat Integration

**Regel**: Jedes neue Repo muss innerhalb von 24h nach Integration im Register erfasst sein. Fehlende Einträge gelten als P1-Blocker.

---

### 2.2 Bauplan-Zwang

**Beschreibung**: Ohne zentralen Bauplan (Architecture Blueprint) fehlt die Grundlage für Systementscheidungen. Alle Agenten und Tools müssen denselben autoritativen Bauplan referenzieren.

**Pflichtdateien (6 Dateien)**:
- `/workspace/nexify/03_regelwerke/NEXIFY_BLUEPRINT_MASTER_V1.md`
- `/workspace/nexify/30_operating_data/nexify-blueprint-master.json`
- `/workspace/nexify/03_regelwerke/NEXIFY_APPLICATION_INVENTORY_V1.md`
- `/workspace/nexify/30_operating_data/nexify-application-inventory.json`
- `/workspace/nexify/03_regelwerke/NEXIFY_DEPENDENCY_MAP_V1.md`
- `/workspace/nexify/30_operating_data/nexify-dependency-map.json`

**Pflichtfelder pro Eintrag**:
`name`, `type`, `path`, `repo`, `runtime`, `owner_agent`, `function`, `business_value`, `dependencies`, `current_status`, `health_status`, `test_status`, `security_status`, `next_safe_action`

**Regel**: Jede Systemänderung erfordert vorab eine Aktualisierung des Bauplans. Ohne aktuellen Blueprint-Eintrag ist keine Deployment-Freigabe gültig.

---

### 2.3 Secret-/Key-/Passwortverwaltung

**Beschreibung**: Secrets, API-Keys und Passwörter sind verteilt und nicht zentral rotierbar. Dies stellt ein erhebliches Sicherheitsrisiko dar.

**Pflichtdateien (9 Dateien in `/workspace/nexify/07_security_secrets/`)**:
- `NEXIFY_SECRET_MASTER_REGISTER_V1.md`
- `nexify-secret-master-register.json`
- `NEXIFY_SECRET_ROTATION_POLICY_V1.md`
- `NEXIFY_SECRET_ACCESS_AUDIT_V1.md`
- `nexify-secret-access-audit.json`
- `NEXIFY_ENCRYPTION_KEY_MANAGEMENT_V1.md`
- `NEXIFY_VAULT_INTEGRATION_V1.md`
- `NEXIFY_SECRET_INCIDENT_RESPONSE_V1.md`
- `NEXIFY_SECRET_ROTATION_EVIDENCE_2026-06-11.md`

**Regel**: Vor finalem Livegang müssen alle Secrets rotiert sein. **Live-Rotation = WAITING_FOR_APPROVAL**. Secrets niemals im Klartext in Repos oder Logs ablegen.

---

### 2.4 Oracle-Zielbetrieb

**Beschreibung**: Oracle ist das Zielsystem für canonical State-Ablage. Brain, agentmemory und Qdrant bleiben aktiv, bis Oracle vollständig betriebsfähig ist. Es darf kein Datenverlust während der Migration entstehen.

**Pflichtdateien (8 Dateien in `/workspace/nexify/31_oracle/`)**:
- `NEXIFY_ORACLE_ARCHITECTURE_V1.md`
- `NEXIFY_ORACLE_MIGRATION_PLAN_V1.md`
- `NEXIFY_ORACLE_DATA_SCHEMA_V1.md`
- `NEXIFY_ORACLE_API_SPEC_V1.md`
- `NEXIFY_ORACLE_INTEGRATION_TEST_PLAN_V1.md`
- `NEXIFY_ORACLE_ROLLBACK_PLAN_V1.md`
- `NEXIFY_ORACLE_OPERATIONS_V1.md`
- `NEXIFY_ORACLE_CUTOVER_CHECKLIST_V1.md`

**Regel**: Brain, agentmemory und Qdrant bleiben aktiv, bis Oracle den Status `OPERATIONAL` erreicht hat. Kein Abschalten alter Systeme ohne erfolgreichen Cutover-Test.

---

### 2.5 9Router-No-Crash-Schutz

**Beschreibung**: Der 9Router ist das kritische API-Gateway. Ausfälle sind geschäftskritisch. Es braucht einen abgesicherten Change-Prozess mit vollständiger Evidence-Kette.

**LLM-Combo**: `nexifyai-combo-llm = deepseek-v4-flash + deepseek-reasoner`

**Pflichtschritte (lückenlose Prozesskette)**:
1. **Backup** — Vollständiges Backup vor jeder Änderung
2. **Config Export** — Export der aktuellen Router-Konfiguration
3. **Health Baseline** — Aufnahme der aktuellen Health-Metriken
4. **Shadow-Test** — Test der Änderung im Shadow-Mode
5. **Rollback** — Dokumentierter Rollback-Plan
6. **Change** — Durchführung der Änderung
7. **Post-Change Health** — Erneute Health-Messung
8. **Evidence** — Vollständige Dokumentation aller Schritte

**Pflichtdateien**:
- `/workspace/nexify/10_evidence/9router/NEXIFY_9ROUTER_NO_CRASH_POLICY_V1.md`
- `/workspace/nexify/10_evidence/9router/NEXIFY_9ROUTER_HEALTH_BASELINE_2026-06-11.md`
- `/workspace/nexify/10_evidence/9router/NEXIFY_9ROUTER_CHANGE_EVIDENCE_2026-06-11.md`

**Regel**: Jede 9Router-Änderung durchläuft die gesamte 8-Schritt-Kette. Fehlt ein Schritt, gilt die Änderung als nicht autorisiert.

---

### 2.6 RTK/Caveman/Semantic Compression

**Beschreibung**: Die Kompressions-Toolchain (RTK → Caveman → Semantic Compression) ist essenziell für effiziente Speicherung und Kontexterhaltung. Es braucht einheitliche Ausgabeformate.

**Pflichtdateien (5 Dateien in `/workspace/nexify/07_tools_cli/compression/`)**:
- `NEXIFY_COMPRESSION_PIPELINE_V1.md`
- `NEXIFY_COMPRESSION_CONFIG_V1.md`
- `NEXIFY_COMPRESSION_OUTPUT_SCHEMA_V1.md`
- `NEXIFY_COMPRESSION_PERFORMANCE_BENCHMARKS_V1.md`
- `NEXIFY_COMPRESSION_INTEGRATION_TEST_V1.md`

**Pflichtausgabe pro Kompressionsvorgang**:
`summary`, `facts`, `decisions`, `open_tasks`, `risks`, `blockers`, `source_refs`, `systems`, `repos`, `tags`, `priority`, `brain_relevance`, `oracle_relevance`, `next_action`, `loss_warning`

**Regel**: Jede Kompression muss verlustbehaftete Felder explizit in `loss_warning` dokumentieren. Ohne `loss_warning` gilt die Kompression als fehlerhaft.

---

### 2.7 Research Cache

**Beschreibung**: Wiederholte Internet-Recherchen verschwenden Zeit und Tokens. Ein zentraler Research Cache vermeidet Doppelarbeit.

**Pflichtdateien (3 Dateien)**:
- `/workspace/nexify/30_operating_data/NEXIFY_RESEARCH_CACHE_REGISTER_V1.md`
- `/workspace/nexify/30_operating_data/nexify-research-cache-register.json`
- `/workspace/nexify/03_regelwerke/NEXIFY_RESEARCH_CACHE_USAGE_RULES_V1.md`

**Regel**: Vor jeder neuen Internet-Recherche ist der Cache zu prüfen. Bei Treffer (Cache-Hit) ist die Recherche zu protokollieren, nicht zu wiederholen. Cache-TTL: 7 Tage für allgemeine Recherchen, 24h für zeitkritische Themen.

---

### 2.8 Promptmaster-Governance

**Beschreibung**: Produktive Prompts (Claude Code, Goose, Auto-Chat) sind das Gehirn der Agenten-Orchestrierung. Änderungen dürfen nur durch Promptmaster erfolgen.

**Pflichtdateien (3 Dateien)**:
- `/workspace/nexify/03_regelwerke/NEXIFY_PROMPTMASTER_GOVERNANCE_V1.md`
- `/workspace/nexify/03_regelwerke/NEXIFY_PROMPT_CHANGE_REQUEST_TEMPLATE_V1.md`
- `/workspace/nexify/30_operating_data/NEXIFY_PROMPT_CHANGE_LOG_V1.md`

**Regel**: **Nur Promptmaster ändert produktive Prompts.** Jede Prompt-Änderung durchläuft: Change Request → Review → Approval → Deployment → Evidence. Nicht autorisierte Prompt-Änderungen gelten als Sicherheitsvorfall.

---

### 2.9 Kundenprojekt-Trennung

**Beschreibung**: NeXify-interne, Kundenprojekt-, Shared Infrastructure-, Sandbox- und Archiv-Bereiche müssen strikt getrennt bleiben. Vermischung führt zu Datenlecks und Compliance-Verstößen.

**Pflichtdateien (4 Dateien)**:
- `/workspace/nexify/04_projects/CUSTOMER_PROJECT_ISOLATION_POLICY.md`
- `/workspace/nexify/04_projects/customer-project-isolation-policy.json`
- `/workspace/nexify/04_projects/CUSTOMER_DATA_CLASSIFICATION_POLICY.md`
- `/workspace/nexify/04_projects/customer-data-classification-policy.json`

**Regel**: Kategorien **NeXify-intern**, **Kundenprojekt**, **Shared Infrastructure**, **Sandbox** und **Archiv** dürfen nie ungeprüft vermischt werden. Jeder Dateizugriff protokolliert die Herkunftskategorie. Datenübertritte zwischen Kategorien erfordern explizite Freigabe.

---

### 2.10 Finanzen/Kosten/Marge

**Beschreibung**: Ohne zentrales Kostenregister und wirtschaftliche Entscheidungsrichtlinie fehlt die Grundlage für margenorientierte Steuerung.

**Pflichtdateien (3 Dateien)**:
- `/workspace/nexify/30_operating_data/NEXIFY_COST_VALUE_MARGIN_REGISTER.md`
- `/workspace/nexify/30_operating_data/nexify-cost-value-margin-register.json`
- `/workspace/nexify/03_regelwerke/ECONOMIC_DECISION_POLICY_V1.md`

**Regel**: Jede Investitionsentscheidung >500€ (oder äquivalenter Aufwand >8h) durchläuft die Economic Decision Policy: Business-Value-Justification → Kostenprognose → Margenberechnung → Entscheid mit Begründung → Nachkalkulation.

---

### 2.11 Incident/Backup/Restore/DR

**Beschreibung**: Es fehlt ein abgestimmtes Incident-, Backup-, Restore- und Disaster-Recovery-Regelwerk. Ohne dieses ist die Betriebsfähigkeit bei Störungen nicht garantiert.

**Pflichtdateien (5 Dateien)**:
- `/workspace/nexify/03_regelwerke/NO_FULL_CRASH_POLICY_V1.md`
- `/workspace/nexify/03_regelwerke/CHANGE_MANAGEMENT_POLICY_V1.md`
- `/workspace/nexify/03_regelwerke/INCIDENT_RESPONSE_POLICY_V1.md`
- `/workspace/nexify/03_regelwerke/BACKUP_RESTORE_DR_POLICY_V1.md`
- `/workspace/nexify/10_evidence/CHANGE_SAFETY_BASELINE_EVIDENCE.md`

**Regel**: Alle Backup-Pläne werden wöchentlich getestet (Restore-Probe). DR-Übungen erfolgen monatlich. Change-Safety-Baselines werden vor jeder Produktionsänderung erhoben.

---

### 2.12 Real-Progress-Audit

**Beschreibung**: Ohne echtes Fortschritts-Audit werden Aufgaben voreilig als "done" markiert oder wiederholen sich sinnlos. Es braucht ein Gate, das echten von vorgetäuschtem Fortschritt trennt.

**Pflichtdateien (3 Dateien)**:
- `/workspace/nexify/10_evidence/real_progress/REAL_PROGRESS_AUDIT_SINCE_LAST_NIGHT.md`
- `/workspace/nexify/08_kanban_tasks/REAL_PROGRESS_TASK_CORRECTION.md`
- `/workspace/nexify/03_regelwerke/REAL_PROGRESS_GATE_V1.md`

**Messfelder** (12 Dimensionen):
| # | Messfeld | Beschreibung |
|---|---|---|
| 1 | **fertige Dateien** | Anzahl neu erstellter Dateien |
| 2 | **validierte Dateien** | Davon durch Review bestätigt |
| 3 | **gelöste Blocker** | Anzahl behobener Blockaden |
| 4 | **Tests** | Geschriebene + bestandene Tests |
| 5 | **Review** | Durchgeführte Code-Reviews |
| 6 | **aktualisierte Tasks** | Task-Status-Korrekturen |
| 7 | **Pending** | Noch offene Aufgaben |
| 8 | **Show-Artefakte** | Nachweisbar gemachter Fortschritt |
| 9 | **Wiederholungen** | Wiederholt erledigte Aufgaben |
| 10 | **ungenutzte Evidence** | Erstellte, aber nicht referenzierte Evidence |
| 11 | **falsche DONEs** | Fälschlich als done markierte Tasks |
| 12 | **Nettoprogredienz** | Bereinigter Gesamtfortschritt (Differenz aus 1–11) |

**Regel**: Das Real-Progress-Gate prüft vor jedem Milestone-Abschluss alle 12 Felder. Bei >3 Wiederholungen oder >2 falschen DONEs wird der Milestone zurückgesetzt.

---

## 3. Neue Sofort-Reihenfolge (P0-001 bis P0-015)

Die folgende Reihenfolge ist verbindlich und wird sequenziell abgearbeitet:

| Rang | ID | Task | Lückenbezug |
|---|---|---|---|
| P0-001 | `scan-luecke-001` | Projektquellen-Erfassung und Scannachweis | Alle |
| P0-002 | `scan-luecke-002` | Quellen-/Repo-/Plugin-/CLI-Register anlegen | 2.1 |
| P0-003 | `scan-luecke-003` | Bauplan-Dateien (6) erstellen und JSON ableiten | 2.2 |
| P0-004 | `scan-luecke-004` | Secret-Management aufsetzen (9 Dateien) | 2.3 |
| P0-005 | `scan-luecke-005` | Oracle-Zielbetrieb dokumentieren (8 Dateien) | 2.4 |
| P0-006 | `scan-luecke-006` | 9Router-No-Crash-Policy und Evidence | 2.5 |
| P0-007 | `scan-luecke-007` | RTK/Caveman/Semantic Compression Pipeline | 2.6 |
| P0-008 | `scan-luecke-008` | Research Cache Register + Usage Rules | 2.7 |
| P0-009 | `scan-luecke-009` | Promptmaster-Governance einführen | 2.8 |
| P0-010 | `scan-luecke-010` | Kundenprojekt-Trennung dokumentieren | 2.9 |
| P0-011 | `scan-luecke-011` | Finanz-/Kosten-/Margen-Register und Policy | 2.10 |
| P0-012 | `scan-luecke-012` | Incident/Backup/Restore/DR-Policies | 2.11 |
| P0-013 | `scan-luecke-013` | Real-Progress-Audit und Gate | 2.12 |
| P0-014 | `scan-luecke-014` | Oracle Canonicalization (Datenabgleich) | 2.4 |
| P0-015 | `scan-luecke-015` | Claude Code Systemmaster Update (alle 12 Lücken) | Alle |

---

## 4. Abschlussregel

Diese 12 Lücken gelten erst als **geschlossen**, wenn **alle** der folgenden Bedingungen erfüllt sind:

- [ ] Alle in Abschnitt 2 definierten **Pflichtdateien existieren**
- [ ] Alle JSON-Dateien sind **maschinenlesbar** und valide
- [ ] Für jede Lücke existieren korrespondierende **Kanban-Tasks**
- [ ] Für jede abgeschlossene Aktion existiert **Evidence** in `/workspace/nexify/10_evidence/`
- [ ] **Brain/agentmemory/Oracle-Pending** ist dokumentiert und nachvollziehbar
- [ ] **Keine Secrets** wurden geleakt (Secret-Scan durchgeführt)
- [ ] **Keine produktiven Gate-Aktionen** wurden ohne Genehmigung ausgeführt
- [ ] Die **nächste sichere Aktion** ist für jede Lücke eindeutig dokumentiert

---

## 5. Annex: Verantwortlichkeiten

| Rolle | Verantwortung |
|---|---|
| **Systemmaster (Claude Code)** | Orchestrierung, Qualitätskontrolle, Eskalation |
| **Goose ACC** | Ausführung der P0-Tasks, Dateierstellung, Validierung |
| **Promptmaster** | Governance produktiver Prompts, Change Control |
| **Oracle-Architekt** | Zielbetrieb, Migration, Schema-Design |
| **Security-Beauftragter** | Secret-Management, Rotation, Audit |
| **Review-Agent** | Code-Review, Policy-Review, Evidence-Prüfung |

---

*Erstellt am 2026-06-11 11:12 UTC | Nächste sichere Aktion: P0-001 — Projektquellen-Erfassung und Scannachweis*
