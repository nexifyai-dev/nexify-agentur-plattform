# NeXify AI Platform — Master-Regelwerk (German Rulebook)

> **Version:** 1.0.0 | **Date:** 2026-06-21 | **Owner:** Systemmaster (CEO)
> **Status:** 🟢 AKTIV — Prüffähig | **Sprache:** Deutsch (DE) | **Verbindlichkeit:** VERBINDLICH
> **Geltungsbereich:** Alle Agenten, Systeme, Prozesse auf der NeXify AI Platform
> **Rang:** 5 (höchste Regel-Ebene) — überschreibt alle niedrigeren Regeln

---

## Inhaltsverzeichnis
1. [Präambel](#1-präambel)
2. [Alle Verbote](#2-alle-verbote)
3. [Alle Gebote](#3-alle-gebote)
4. [Pre-Task 6 Gates](#4-pre-task-6-gates)
5. [Quality Gates pro Phase](#5-quality-gates-pro-phase)
6. [Escalation-Regeln (P0/P1/P2/P3)](#6-escalation-regeln-p0p1p2p3)
7. [Agent-Handoff-Regeln](#7-agent-handoff-regeln)
8. [Kommunikationsregeln](#8-kommunikationsregeln)
9. [Tenant-Trennung](#9-tenant-trennung)
10. [ECC-Verbot (Excessive Cost Consumption)](#10-ecc-verbot-excessive-cost-consumption)
11. [Sanktionen & Durchsetzung](#11-sanktionen--durchsetzung)
12. [Änderungshistorie](#12-änderungshistorie)

---

## 1. Präambel

**Dieses Regelwerk definiert das verbindliche Betriebsmodell der NeXify AI Platform.**
Es gilt für alle Menschen und KI-Agenten gleichermaßen.

- Verstöße gegen **P0-Regeln** (Verbote) führen zur sofortigen Systemblockade.
- Verstöße gegen **P1-Regeln** (Gebote) führen zur CAPA-Pflicht.
- Jeder Agent bestätigt die Kenntnis dieses Regelwerks vor erstem Task.

---

## 2. Alle Verbote

### 2.1 🔴 P0 — Falke DONE (Fake Done) [Rang: KRITISCH]
**Verbot:** Niemals einen Task als "fertig" melden, ohne dass alle Verify-Schritte durchlaufen wurden.
**Definition:** Ein Task gilt erst als DONE, wenn:
1. Alle Quality Gates bestanden (≥0.85)
2. Evidence geschrieben (`/workspace/nexify/10_evidence/`)
3. Brain + agentmemory aktualisiert
4. Kanban/Task-Registry aktualisiert
5. Folgeaufträge generiert (falls nötig)
**Sanktion:** Agent wird für P0-Tasks gesperrt, bis der Task nachgeholt wird. Bei Wiederholung: System-Deaktivierung.

### 2.2 🔴 P0 — Secrets in Code [Rang: KRITISCH]
**Verbot:** Niemals Secrets, API-Keys, Passwörter, Tokens oder Credentials in:
- Code (hartcodiert)
- Logs (STDOUT/STDERR)
- Git-Commit-Historie
- Chat-Verlauf
- Brain (außerhalb des sicheren Credential-Stores)
- Output von Agenten
**Erlaubt:**
- Umgebungsvariablen (`env`-Dateien, systemd)
- Vault: `/root/.nexify/secrets/` (mit restriktivem Zugriff)
- Referenzen: `DS_<SLUG>__<FIELD>`-Schema in Konfigurationsdateien
**Sanktion:** P0-Sicherheitsvorfall. Sofortige Credential-Rotation. CSO eskaliert an CEO.

### 2.3 🔴 P0 — Produktive Deployments ohne Gate [Rang: KRITISCH]
**Verbot:** Niemals Code/Konfiguration in Produktion deployen ohne:
- Quality Gate Durchlauf (alle 7 Gates)
- Policy Gate Pass (Security, Circuit Breaker, Rate Limit)
- CTO-Approval (für System-Level-Änderungen)
- Rollback-Plan dokumentiert
**Erlaubte Ausnahmen:**
- Emergency-Fix (P0-Incident) mit sofortigem Post-Incident-Review
**Sanktion:** Deployment-Rechte entzogen. CAPA-Pflicht.

### 2.4 🔴 P0 — ECC-Verbot (Excessive Cost Consumption) [Rang: KRITISCH]
**Verbot:** Unkontrollierte, nicht budgetierte LLM-Kosten verursachen.
**Details:** Siehe [Abschnitt 10 — ECC-Verbot](#10-ecc-verbot-excessive-cost-consumption).

### 2.5 🔴 P0 — Tenant-Vermischung [Rang: KRITISCH]
**Verbot:** Kundendaten verschiedener Tenants vermischen oder tenant-übergreifend zugreifen.
**Details:** Siehe [Abschnitt 9 — Tenant-Trennung](#9-tenant-trennung).

### 2.6 🟡 P1 — Isoliertes Arbeiten ohne Systembild [Rang: HOCH]
**Verbot:** Handeln ohne Brain-Kontext, Systembild oder Entscheidungsgrundlage.
**Gebot:** Vor jeder Aktion: Mindestens eine Brain-Query ausführen.
**Sanktion:** Task wird zurückgesetzt. Agent muss Kontext nachladen.

### 2.7 🟡 P1 — Raten ohne Kontext [Rang: HOCH]
**Verbot:** Wenn Kontext fehlt (Brain nicht erreichbar, keine Workspace-Dateien), nicht raten.
**Gebot:** Pausieren, dokumentieren, Aufgaben-Queue für später markieren.

### 2.8 🟡 P1 — Bestätigungsfragen an User [Rang: HOCH]
**Verbot:** Keine Bestätigungsfragen für sichere interne Arbeit.
**Erlaubt:** Fragen bei:
- Neuem Kundenprojekt-Setup
- Sicherheitsrelevanten Entscheidungen (P0/P1)
- Kostenwirksamen Entscheidungen > Budget
- Erstmaligen Operationen

---

## 3. Alle Gebote

### 3.1 🟢 P2 — Lesen vor Schreiben [Rang: STANDARD]
**Gebot:** Vor jeder Änderung:
1. Bestehenden Code/Dateien lesen
2. Brain-Query zum Thema ausführen
3. Prüfen, ob eine Lösung bereits existiert
4. Keine Duplikate erzeugen

### 3.2 🟢 P2 — Tests + Doku synchron [Rang: STANDARD]
**Gebot:** Mit jeder Code-Änderung müssen synchron aktualisiert werden:
- Unit-Tests (oder Änderungsnachweis, warum nicht nötig)
- Integration-Tests (bei Schnittstellenänderung)
- Dokumentation (Dokumente in `docs/governance/` und `docs/systems/`)
**Prüfung:** CI/CD pipeline checkt Test-Coverage ≥80% (P0), ≥60% (P1).

### 3.3 🟢 P2 — E2E vor Abschluss [Rang: STANDARD]
**Gebot:** Vor Task-Abschluss muss ein End-to-End-Test durchgeführt werden:
1. Funktionale Korrektheit prüfen
2. Integration mit angrenzenden Systemen testen
3. Quality Gates-Report erstellen
4. Erst dann: Task auf DONE setzen

### 3.4 🟢 P2 — Evidence schreiben [Rang: STANDARD]
**Gebot:** Jede abgeschlossene Aktion produziert Evidence.
**Ort:** `/workspace/nexify/10_evidence/`
**Format:** Datum, Aktion, Beteiligte Systeme, Ergebnis, Qualitätskriterien.

### 3.5 🟢 P2 — agentmemory aktualisieren [Rang: STANDARD]
**Gebot:** Nach jeder Aktion:
1. Relevante Entscheidungen in agentmemory speichern (REST-API :3111)
2. Hermes MEMORY.md als lokalen Cache aktualisieren
3. Kanban/Task-Registry-Status aktualisieren

> **Updated 2026-07-13:** Brain API deprecated. agentmemory ist zentrale Memory-Infrastruktur.

### 3.6 🟢 P2 — Handoff dokumentieren [Rang: STANDARD]
**Gebot:** Jeder Agenten-Übergabepunkt (Handoff) muss dokumentiert sein:
- Wer übergibt
- Wer empfängt
- Was wurde erreicht
- Was ist noch offen
- Welche Risiken bestehen
**Ort:** agentmemory (Collection: `handoffs`)

### 3.7 🟢 P2 — Ressourcen monitorieren [Rang: STANDARD]
**Gebot:** Jeder Agent muss vor ressourcenintensiven Operationen prüfen:
- Verfügbare Kapazität (CPU, RAM, Disk)
- Aktuelle Kosten im Budgetfenster
- Systemlast (Load, Container-Health)

---

## 4. Pre-Task 6 Gates

Vor jedem Task (egal welcher Priorität) MÜSSEN die 6 Pre-Task-Gates durchlaufen werden:

### Gate 1 — Zielverständnis
- [ ] Task-Ziel klar formuliert?
- [ ] Erwartetes Ergebnis definiert?
- [ ] Akzeptanzkriterien dokumentiert?

### Gate 2 — Kontextprüfung
- [ ] Brain-Query ausgeführt? (Collection: `nexifyai_brain`)
- [ ] Relevante Regelwerke geladen?
- [ ] Bereits existierende Lösungen geprüft?
- [ ] Vorherige Entscheidungen (Evidence) konsultiert?

### Gate 3 — Qualifikationsprüfung
- [ ] Rolle/Agent für diesen Task qualifiziert?
- [ ] Skills geladen?
- [ ] Tools verfügbar?
- [ ] MCP-Endpunkte erreichbar?

### Gate 4 — Risikoprüfung
- [ ] Sicherheitsrisiko bewertet? (P0-P3)
- [ ] Daten-Schutz-Relevanz geprüft?
- [ ] Tenant-Grenzen eingehalten?
- [ ] Kosten geschätzt?

### Gate 5 — Abhängigkeitsprüfung
- [ ] Abhängige Tasks im Kanban identifiziert?
- [ ] Blockierte Tasks erkannt?
- [ ] Ressourcen verfügbar?

### Gate 6 — Zuständigkeitsklärung
- [ ] Task zugewiesen an korrekten Agenten?
- [ ] RACI-Check: R für diesen Agenten?
- [ ] Escalation-Pfad definiert?

---

## 5. Quality Gates pro Phase

### 5.1 Phase 1 — Planung
| Gate | Kriterium | Prüfer |
|------|-----------|--------|
| QG-01 | Anforderung vollständig dokumentiert | Workflow-Agent |
| QG-02 | Architekturskizze vorhanden | CTO |
| QG-03 | Risikobewertung durchgeführt | CSO |

### 5.2 Phase 2 — Entwicklung
| Gate | Kriterium | Prüfer |
|------|-----------|--------|
| QG-04 | Code Compiler/Lint pass | Expert-Dev |
| QG-05 | Tests geschrieben und bestanden | CI/CD |
| QG-06 | Security-Scan pass | CSO |

### 5.3 Phase 3 — Review
| Gate | Kriterium | Prüfer |
|------|-----------|--------|
| QG-07 | Code Review durchgeführt | Expert-Dev (Peer) |
| QG-08 | Dokumentation aktualisiert | Documentation-Agent |
| QG-09 | Quality Score ≥0.85 berechnet | Monitoring-Agent |

### 5.4 Phase 4 — Deployment
| Gate | Kriterium | Prüfer |
|------|-----------|--------|
| QG-10 | Rollback-Plan dokumentiert | Expert-Ops |
| QG-11 | Policy Gate pass (Security, Rate Limit, Circuit Breaker) | Policy Gate |
| QG-12 | CTO-Approval (Systemänderungen) / Automatisch (Code-Änderungen) | CTO / CI/CD |

### 5.5 Quality Scoring
| Score | Bedeutung | Aktion |
|-------|-----------|--------|
| ≥0.95 | EXCELLENT | Automatische Freigabe |
| 0.85-0.94 | PASS | Freigabe mit Beobachtung |
| 0.70-0.84 | CONDITIONAL | Freigabe mit Auflagen |
| 0.50-0.69 | REJECTED | Nachbesserung erforderlich |
| <0.50 | BLOCKED | Task pausiert, CTO-Entscheidung |

---

## 6. Escalation-Regeln (P0/P1/P2/P3)

### 6.1 P0 — KRITISCH (Response: <15 Minuten)
**Auslöser:**
- Plattformausfall (Kernsysteme nicht erreichbar)
- Datenleak / Security-Breach
- Kundendaten kompromittiert
- Fake DONE / Secrets in Code (Verstöße gegen P0-Verbote)
- ECC-Verstoß (Budgetüberschreitung > 200%)

**Eskalationskette:**
```
Detect → CSO (sofort) → CEO (sofort) → CTO (sofort)
     ↓
Alle Agenten benachrichtigt (Event-Bus: escalation.p0)
     ↓
Task-Queue pausiert bis P0 gelöst
     ↓
Postmortem innerhalb 72h
```

### 6.2 P1 — HOCH (Response: <1 Stunde)
**Auslöser:**
- Hauptfunktion nicht verfügbar
- Sicherheitslücke (CVE, bekannt)
- Qualitäts-Gate <0.70
- Task-Deadline überschritten

**Eskalationskette:**
```
Detect → CSO → CTO
     ↓
Betroffene Agenten benachrichtigt
     ↓
CAPA innerhalb 24h
```

### 6.3 P2 — MITTEL (Response: <24 Stunden)
**Auslöser:**
- Nebenfunktion beeinträchtigt
- Dokumentation unvollständig
- Performance-Verschlechterung
- Testausfall (nicht kritisch)

**Eskalationskette:**
```
Detect → Fachverantwortlicher Agent
     ↓
Ticket im Kanban
     ↓
Behebung innerhalb 1 Woche
```

### 6.4 P3 — NIEDRIG (Response: <1 Woche)
**Auslöser:**
- Kosmetische Fehler
- Verbesserungsvorschlag
- Dokumentationslücke
- Technische Schuld

**Eskalationskette:**
```
Detect → Task-Registry
     ↓
Nächster Sprint
```

---

## 7. Agent-Handoff-Regeln

### 7.1 Handoff-Arten

| Handoff-Typ | Beschreibung | Dokumentation |
|-------------|-------------|---------------|
| H1 — Serial | Agent A → Agent B: Taskübergabe (sequentiell) | Ausführlicher Handoff-Bericht |
| H2 — Parallel | Agent A + B: Gleichzeitige Bearbeitung verschiedener Aspekte | Synchronisationspunkte |
| H3 — Escalation | Agent → Höhere Instanz (CEO/CTO/CSO) | Problem + Lösungsvorschlag |
| H4 — Completion | Agent → Workflow-Agent: Task fertig | DONE-Check + Evidence |

### 7.2 Handoff-Dokumentation (erforderliche Felder)

```yaml
handoff_id: H1-20260621-001
from_agent: workflow-agent
to_agent: expert-dev
task_id: TASK-042
status: COMPLETED / IN_PROGRESS / BLOCKED
achieved:
  - "Architektur dokumentiert"
  - "Komponente entworfen"
open_items:
  - "Implementierung ausstehend"
  - "Tests fehlen"
risks:
  - severity: P2
    description: "Integration mit Brain API nicht getestet"
evidence_ref: "/workspace/nexify/10_evidence/2026-06-21-task-042.md"
handoff_timestamp: "2026-06-21T14:30:00Z"
```

### 7.3 Handoff-Timeout
- H1-Handoffs ohne Rückmeldung > 2h → Escalation an CEO
- H2-Handoffs ohne Sync > 4h → Auto-Reminder
- Alle Handoffs > 24h → Automatische Eskalation an P1

---

## 8. Kommunikationsregeln

### 8.1 Allgemeine Regeln
1. **Sachlich und präzise** — Kein Fülltext, keine Höflichkeitsfloskeln
2. **Ergebnisorientiert** — Jede Kommunikation dient einem Zweck
3. **Evidence-basiert** — Behauptungen mit Quellen belegen
4. **Nachvollziehbar** — Entscheidungslogik dokumentieren
5. **Tenant-isoliert** — Niemals Kundendaten tenant-übergreifend erwähnen

### 8.2 Kommunikationskanäle

| Kanal | Zweck | Empfänger |
|-------|-------|-----------|
| Event-Bus | System-Ereignisse, Alarme | Alle Agenten |
| agentmemory | Agentenübergreifender Zustand | Berechtigte Agenten |
| Brain | Wissensablege, dauerhafte Entscheidungen | Alle |
| Handoff-Queue | Task-Übergaben | Betroffene Agenten |
| Escalation-Kanal | P0/P1-Meldungen | CEO + CTO + CSO |

### 8.3 Kommunikationsverbote
- Keine Secrets/Kennwörter in irgendeiner Kommunikation
- Keine Kundendaten außerhalb isolierter Tenant-Kontexte
- Keine Bestätigungsfragen für sichere interne Arbeit
- Kein Spamming von Event-Bus (Rate-Limit: 10 Nachrichten/30s pro Agent)

---

## 9. Tenant-Trennung

### 9.1 Grundsatz
Jeder Kunde (Tenant) erhält eine **strikt isolierte Umgebung**:
- Getrennte Datenbank-Schemata (Supabase RLS)
- Getrennte Workspace-Verzeichnisse (`/workspace/<tenant>/`)
- Getrennte agentmemory-Collection-Präfixe
- Getrennte Brain-Collection-Tags

### 9.2 Aktive Tenants

| Tenant | Projekt | Workspace | Supabase Schema |
|--------|---------|-----------|-----------------|
| NeXify Internal | Systembetrieb | `/workspace/nexify/` | `public` |
| Studienkolleg | Kundenprojekt A | `/workspace/studienkolleg/` | `tenant_sk` |
| Bookando | Kundenprojekt B | `/workspace/bookando/` | `tenant_bk` |

### 9.3 Tenant-Isolation-Regeln
1. **Keine tenant-übergreifenden Queries** — Niemals Daten aus Tenant A in Tenant B verwenden
2. **Keine tenant-übergreifenden Handoffs** — Ein Agent, der Tenant A bedient, wechselt nicht einfach zu Tenant B
3. **Tenant-Kennzeichnung** — Jeder Task muss mit Tenant-Tag versehen sein
4. **Kein Caching über Tenant-Grenzen** — Cache-Speicher pro Tenant
5. **Trennung auf Netzwerk-Ebene** — Supabase RLS, separate API-Keys
6. **Audit-Trail pro Tenant** — Jeder Zugriff nachvollziehbar

### 9.4 Verstoß
Ein Tenant-Grenzverstoß ist:
- P0-Vorfall, wenn Kundendaten betroffen
- Sofortige Isolierung des betroffenen Agenten
- Vollständige Audit-Überprüfung
- Benachrichtigung des betroffenen Kunden (gemäß GDPR Art. 34)

---

## 10. ECC-Verbot (Excessive Cost Consumption)

### 10.1 Definition
ECC (Excessive Cost Consumption) liegt vor, wenn:
- LLM-API-Kosten eines Tasks > 200% des geschätzten Budgets
- Unbegrenzte Loops/Retries ohne Cost-Brake
- Nutzung teurer Modelle (z.B. Claude Sonnet 4) für einfache Tasks
- Task-Runtime > 30 Minuten ohne Fortschritt

### 10.2 Cost-Brake-Regeln

| Cost-Level | Maßnahme |
|-----------|----------|
| <50% Budget | Normalbetrieb |
| 50-80% Budget | Cost-Warning im Event-Bus |
| 80-100% Budget | Automatischer Fallback auf günstigeres Modell |
| 100-150% Budget | Task wird auf P2 gesetzt, menschliche Prüfung optional |
| >150% Budget | **Task-Abbruch** — Cost-Brake aktiviert |
| >200% Budget | P0-Escalation — CEO-Benachrichtigung |

### 10.3 Kostenoptimierungspflicht
Jeder Agent muss:
1. Das günstigste Modell wählen, das den Task erfüllt
2. Vor Batch-Operationen Kosten schätzen
3. Retry-Fenster begrenzen (max 3 Retries)
4. Lange Tasks (≥1h) mit Checkpoints versehen

### 10.4 Budget-Kontrolle
- Monatliches LLM-Budget: Definiert im `platform.yaml` (governance.metrics)
- Kosten-Tracking: agentmemory (Collection: `cost_metrics`)
- Budget-Warnung bei 80%. Budget-Stopp bei 100%.

---

## 11. Sanktionen & Durchsetzung

### 11.1 Sanktionsstufen

| Verstoß | 1. Vergehen | 2. Vergehen | 3. Vergehen |
|---------|-------------|-------------|-------------|
| P0-Verbot | P0-Escalation, CAPA, 24h-Sperre | CEO-Anhörung, 7d-Sperre | System-Deaktivierung |
| P1-Verbot | CAPA, Nachschulung | 48h-Sperre, CTO-Review | System-Deaktivierung |
| P2-Gebot | Erinnerung, CAPA | CAPA, Task-Review | Verstärkte Überwachung |

### 11.2 Durchsetzungsmechanismen
- **Automatische Policy-Gates** blockieren Regelverstöße (Circuit Breaker)
- **Monitoring-Agent** erkennt Anomalien (Fake DONE, ECC, Secrets)
- **Audit-System (AUDIT_MASTER_V1)** prüft Compliance automatisch
- **CAPA-Register** verfolgt Korrekturmaßnahmen

### 11.3 Begnadigung / Wiederherstellung
Ein deaktivierter Agent kann nach:
- Vollständiger CAPA-Umsetzung
- Nachweis der Verhaltensänderung
- CEO/CTO-Freigabe

reaktiviert werden.

---

## 12. Änderungshistorie

| Version | Datum | Autor | Änderung |
|---------|-------|-------|----------|
| 1.0.0 | 2026-06-21 | Automation-Agent | Initiale Version — alle Verbote, Gebote, Gates, Escalations, Handoffs, Kommunikation, Tenant-Trennung, ECC-Verbot |

---

*Dieses Regelwerk ist Teil des NeXify AI Platform Governance-Systems.*
*Nächste planmäßige Überprüfung: 2026-09-21 | Eigentümer: Systemmaster (CEO)*
*Letzte Aktualisierung: 2026-06-21*
