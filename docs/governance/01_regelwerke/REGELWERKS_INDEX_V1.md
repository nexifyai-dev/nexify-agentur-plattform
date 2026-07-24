# REGELWERKS_INDEX V1

**Status:** 🟢 Aktiv / Active
**Version:** 1.0.0
**Datum:** 2026-06-10
**Autor:** NeXify Governance System
**Audit-Pflicht:** Ja
**Letztes Audit:** 2026-06-10

---

## 1. Überblick

Dieser Index katalogisiert **alle aktiven Regelwerke** im NeXify-System. Er fasst
die Kernregeln aus bestehenden Quellen zusammen, dokumentiert neue Verordnungen
und dient als **Single Source of Truth** für die Regelwerkslandschaft.

> **Prinzip:** Kein Agent führt eine Aktion aus, ohne dass das zutreffende Regelwerk
> geprüft wurde. Regelwerke haben Vorrang vor individuellen Heuristiken.

---

## 2. Regelwerks-Übersicht

| # | Regelwerk | Typ | Status | Version | Erstellt | Letztes Audit |
|---|-----------|-----|--------|---------|----------|---------------|
| 1 | DOS GATES | Pflicht-Gates | 🟢 Aktiv | 1.0 | Baseline | 2026-06-10 |
| 2 | DOS Definition of Done | Qualitätssicherung | 🟢 Aktiv | 1.0 | Baseline | 2026-06-10 |
| 3 | Operational Constitution | Verfassung | 🟢 Aktiv | 1.0 | Baseline | 2026-06-10 |
| 4 | NeXify AI Global Rules | Globale Regeln | 🟢 Aktiv | 1.0 | Baseline | 2026-06-10 |
| 5 | GLOBAL_POLICY_V1 | Policy Gate | 🟢 Aktiv | 1.0 | 2026-06-10 | 2026-06-10 |
| 6 | DONE_REGEL_V1 | Definition of Done | 🟢 Aktiv | 1.0 | 2026-06-10 | 2026-06-10 |
| 7 | SKILL_FIRST_REGEL_V1 | Skill-Mandat | 🟢 Aktiv | 1.0 | 2026-06-10 | 2026-06-10 |
| 8 | MEMORY_PFLICHT_V1 | Memory-Mandat | 🟢 Aktiv | 1.0 | 2026-06-10 | 2026-06-10 |
| 9 | RULE_CONFLICT_REGISTER | Konflikt-Register | 🟢 Aktiv | 1.0 | 2026-06-10 | 2026-06-10 |
| 10 | AUDIT_MASTER_V1 | Audit-System | 🟢 Aktiv | 1.0 | 2026-06-10 | 2026-06-10 |
| 11 | EVIDENCE_TEMPLATE_V1 | Evidence-Standard | 🟢 Aktiv | 1.0 | 2026-06-10 | 2026-06-10 |
| 12 | FEEDBACK_LOOP_MASTER_V1 | Feedback-Regelung | 🟢 Aktiv | 1.0 | 2026-06-10 | 2026-06-10 |
| 13 | BRAIN_GEBOT_V1 | Brain-Gebot | 🟢 Aktiv | 1.0 | 2026-06-10 | 2026-06-10 |
| 14 | BRAIN_BEGRIFF_DEFINITION_V1 | Brain-Begriffsdefinition | 🟢 Aktiv | 1.0 | 2026-06-10 | 2026-06-10 |
| 15 | POSITIVE_SURPRISE_DELIVERY_RULE_V1 | Positive-Surprise-Regel | 🟢 Aktiv | 1.0 | 2026-06-10 | 2026-06-10 |
| 16 | GOOSE.md | Projektanweisungen für Goose | 🟢 Aktiv | 1.0 | 2026-06-10 | 2026-06-10 |
| 17 | GOOSE_NEXIFY_AUTOMATION_RULES | Goose-Automations-Regeln | 🟢 Aktiv | 1.0 | 2026-06-10 | 2026-06-10 |
| 13 | POSITIVE_SURPRISE_DELIVERY_RULE_V1 | Positive-Surprise-Regel | 🟢 Aktiv | 1.0 | 2026-06-10 | 2026-06-10 |

---

## 3. Bestehende Regelwerke — Kernregeln

### 3.1 DOS GATES (17 Pflicht-Gates)

**Quelle:** DOS GATES — 17 obligatorische Prüfpunkte vor jeder Aufgabe.

**Kernregeln:**

| Gate | Regel | Kurzbeschreibung |
|------|-------|------------------|
| G01 | Aufgabenverständnis | Die Aufgabe ist vollständig verstanden und dokumentiert |
| G02 | Zieldefinition | Das Ziel ist klar, messbar und terminiert |
| G03 | Kontext-Prüfung | Relevanter Kontext ist geladen (Brain, Memory, Skills) |
| G04 | Skill-Selektion | Benötigte Skills sind identifiziert und geladen |
| G05 | Ressourcen-Check | Alle benötigten Ressourcen sind verfügbar |
| G06 | Risikoanalyse | Risiken sind identifiziert und bewertet |
| G07 | Abhängigkeits-Check | Abhängigkeiten zu anderen Aufgaben/Agenten sind bekannt |
| G08 | Qualitätskriterien | Akzeptanzkriterien sind definiert |
| G09 | Security-Prüfung | Sicherheitsrelevante Aspekte sind identifiziert |
| G10 | Evidence-Plan | Evidence-Erfassung ist geplant |
| G11 | Memory-Sync | Letzter Memory-Sync ist bestätigt |
| G12 | Audit-Vorbereitung | Audit-Anforderungen sind bekannt |
| G13 | Policy-Gate-Check | GLOBAL_POLICY ist durchlaufen |
| G14 | Zeitrahmen | Zeitbudget ist definiert |
| G15 | Abbruchkriterien | Bedingungen für Aufgabenabbruch sind definiert |
| G16 | Kommunikationsplan | Eskalationsweg ist festgelegt |
| G17 | Freigabe | Alle Gates sind grün → Freigabe zur Ausführung |

> **Geltungsbereich:** Jeder Agent vor jeder Aufgabe. Überspringen einzelner Gates
> nur mit dokumentierter Ausnahmegenehmigung.

---

### 3.2 DOS Definition of Done

**Quelle:** DOS Definition of Done — Qualitätssicherung nach 5 Dimensionen.

**Kernregeln:**

| Dimension | Kriterium |
|-----------|-----------|
| **Technisch** | Code kompiliert, Tests bestanden (≥90% Coverage), Linting ohne Fehler, keine bekannten CVEs, Dokumentation aktualisiert |
| **Inhaltlich** | Alle Anforderungen erfüllt, Akzeptanzkriterien grün, Edge Cases behandelt, User Story abgeschlossen |
| **Design** | Architektur eingehalten, Patterns befolgt, keine Duplikation, SOLID-Prinzipien gewahrt |
| **Tracking** | Kanban aktualisiert, Task-Status gesetzt, Zeit erfasst, Changelog-Eintrag vorhanden |
| **Governance** | Audit bestanden, Evidence geschrieben, Memory synchronisiert, Regelwerke nicht verletzt |

> **Geltungsbereich:** Gilt für jedes abgeschlossene Arbeitsobjekt (Task, PR, Issue).

---

### 3.3 Operational Constitution

**Quelle:** Operational Constitution — Verfassung für den Betrieb.

**Kernregeln:**

#### Prime Directives
1. **Kein Datenverlust** — Jede Transaktion muss persistiert werden, bevor eine neue beginnt
2. **Sicherheit vor Bequemlichkeit** — Security ist nicht verhandelbar
3. **Reproduzierbarkeit** — Jeder Zustand muss aus Logs/Evidence rekonstruierbar sein
4. **Transparenz** — Alle Entscheidungen sind nachvollziehbar dokumentiert
5. **Automation first** — Manuelle Schritte sind Fehler; automatisiere alles

#### CI/CD Enforcement
- Jeder Commit durchläuft: Lint → Test → Build → Security Scan → Audit
- Bei Fehler in der Pipeline: Kein Deployment, sofortige Benachrichtigung
- Rollbacks müssen innerhalb von 5 Minuten möglich sein

#### Confidence Model
| Level | Kriterium | Konsequenz |
|-------|-----------|------------|
| 🟢 High | Alle Checks grün, Tests >90%, Audit bestanden | Deployment automatisch |
| 🟡 Medium | Kleinere Abweichungen, <90% Coverage | Manuelle Freigabe nötig |
| 🔴 Low | Kritische Fehler, Security Issues | Blockiert, sofortige Eskalation |

---

### 3.4 NeXify AI Global Rules

**Quelle:** NeXify AI Global Rules — Fundamentale Verhaltensregeln für Agenten.

**Kernregeln:**

#### Brain-First
- Vor jeder Entscheidung: **Brain konsultieren**
- Brain enthält: Architektur, Muster, Entscheidungsloggen, Kontext
- Ohne Brain-Zugriff: Aufgaben pausieren, nicht raten

#### Skill-First (→ siehe SKILL_FIRST_REGEL_V1)
- Skills sind die einzige Quelle für ausführbare Fähigkeiten
- Kein Agent improvisiert Fähigkeiten, die als Skill existieren
- Skills werden vor Arbeitsbeginn geladen

#### Memory-Pflicht (→ siehe MEMORY_PFLICHT_V1)
- agentmemory ist die zentrale Gedächtnisschicht
- Kein agenten-lokales Gedächtnis außerhalb von agentmemory
- Jede relevante Interaktion wird in agentmemory gespeichert

#### Weitere Global Rules
- **Nicht raten** — Bei Unsicherheit: nachfragen oder Task pausieren
- **Nicht löschen** — Keine Daten ohne Bestätigung entfernen
- **Evidence pflichtig** — Jede Aktion produziert Evidence
- **Keine Side-Effects** — Aktionen nur im definierten Scope

---

## 4. Neue Regelwerke — Kurzreferenz

| Regelwerk | Kurzbeschreibung | Kernforderung |
|-----------|------------------|--------------|
| [GLOBAL_POLICY_V1](./GLOBAL_POLICY_V1.md) | Policy Gate für alle Aktionen | Vor jeder Aktion: Skill → Brain → Memory → Policy Gate → Evidence |
| [DONE_REGEL_V1](./DONE_REGEL_V1.md) | Erweiterte Definition of Done | 6 Kriterien: Ziel, Tests, Evidence, Memory, Kanban, Audit |
| [SKILL_FIRST_REGEL_V1](./SKILL_FIRST_REGEL_V1.md) | Skill-Loading-Mandat | Skills müssen vor Arbeitsbeginn geladen sein |
| [MEMORY_PFLICHT_V1](./MEMORY_PFLICHT_V1.md) | Memory-Layer-Mandat | agentmemory = zentrale Memory-Schicht |
| [RULE_CONFLICT_REGISTER](./RULE_CONFLICT_REGISTER.md) | Konflikt-Register | Dokumentation bekannter Regelkonflikte |
| [AUDIT_MASTER_V1](./AUDIT_MASTER_V1.md) | Audit-System | Audit-Typen, Intervalle, Templates |
| [EVIDENCE_TEMPLATE_V1](./EVIDENCE_TEMPLATE_V1.md) | Evidence-Standard | Einheitliches Evidence-Format |
| [FEEDBACK_LOOP_MASTER_V1](./FEEDBACK_LOOP_MASTER_V1.md) | Feedback-Loop | Feedback → Regelwerke/Skills/Prompts |
| [BRAIN_GEBOT_V1](./BRAIN_GEBOT_V1.md) | Brain-Gebot | Brain vor jeder Aktion konsultieren |
| [BRAIN_BEGRIFF_DEFINITION_V1](./BRAIN_BEGRIFF_DEFINITION_V1.md) | Brain-Begriffsdefinition | Was „Brain" im NeXify-Kontext bedeutet |
| [POSITIVE_SURPRISE_DELIVERY_RULE_V1](./POSITIVE_SURPRISE_DELIVERY_RULE_V1.md) | Positive-Surprise-Regel | Sichere Zusatzverbesserungen mitliefern |
| GOOSE.md (/root/ + /workspace/nexify/05_skills/) | Goose-Projektanweisungen | Verbindliche Regeln für Goose-Sessions |
| GOOSE_NEXIFY_AUTOMATION_RULES (/workspace/nexify/05_skills/) | Goose-Automations-Regeln | Automations-Erlaubnis/Verbot für Goose |
| [POSITIVE_SURPRISE_DELIVERY_RULE_V1](./POSITIVE_SURPRISE_DELIVERY_RULE_V1.md) | Positive-Surprise-Regel | Bei Zielerreichung: sichere Zusatzverbesserungen prüfen und liefern |

---

## 5. Regelwerks-Hierarchie

Bei Regelkonflikten gilt diese Hierarchie (1 = höchste Priorität):

| Rang | Regelwerk | Begründung |
|------|-----------|------------|
| 1 | Operational Constitution | Verfassungsrang — fundamentale Prinzipien |
| 2 | GLOBAL_POLICY_V1 | Prüf-Gate vor jeder Aktion |
| 3 | NeXify AI Global Rules | Globale Verhaltensregeln |
| 4 | MEMORY_PFLICHT_V1 | Datenintegrität und Persistenz |
| 5 | DOS GATES | Aufgaben-Ausführungs-Garantie |
| 6 | DOS Definition of Done | Qualitätssicherung |
| 7 | DONE_REGEL_V1 | Fertigstellungs-Definition (erweitert DoD) |
| 8 | SKILL_FIRST_REGEL_V1 | Skill-Nutzungspflicht |
| 9 | AUDIT_MASTER_V1 | Audit-System |
| 10 | EVIDENCE_TEMPLATE_V1 | Evidence-Standard |
| 11 | FEEDBACK_LOOP_MASTER_V1 | Feedback-Verarbeitung |
| 12 | RULE_CONFLICT_REGISTER | Konflikt-Dokumentation |
| 13 | BRAIN_GEBOT_V1 / BRAIN_BEGRIFF_DEFINITION_V1 | Brain-Gebot (Ergänzung zu MEMORY_PFLICHT) |
| 14 | POSITIVE_SURPRISE_DELIVERY_RULE_V1 | Positive Surprise — Mehrwert-Lieferung |
| 15 | GOOSE.md / GOOSE_NEXIFY_AUTOMATION_RULES | Goose-Projektanweisungen (spezifisch) |
| 13 | BRAIN_GEBOT_V1 | Brain vor jeder Aktion | Hinzugefügt 2026-06-10 |
| 14 | BRAIN_BEGRIFF_DEFINITION_V1 | Brain-Begriffsklärung | Hinzugefügt 2026-06-10 |
| 15 | POSITIVE_SURPRISE_DELIVERY_RULE_V1 | Positive Surprise | Hinzugefügt 2026-06-10 |
| 16 | GOOSE.md | Goose-Projektanweisung | Hinzugefügt 2026-06-10 |
| 17 | GOOSE_NEXIFY_AUTOMATION_RULES | Goose-Automation | Hinzugefügt 2026-06-10 |
| 13 | POSITIVE_SURPRISE_DELIVERY_RULE_V1 | Positive-Surprise-Ergänzung |

> **Konfliktlösung:** Bei direktem Widerspruch zwischen zwei Regelwerken entscheidet
> der ranghöhere Eintrag. Bei Gleichrang entscheidet das spezifischere Regelwerk.
> Nicht lösbare Konflikte werden im RULE_CONFLICT_REGISTER dokumentiert.

---

## 6. Änderungsprotokoll

| Datum | Version | Änderung | Autor |
|-------|---------|----------|-------|
| 2026-06-10 | 1.0.0 | Initialer Index — alle bestehenden + neuen Regelwerke | NeXify Governance |
| 2026-06-10 | 1.0.1 | + BRAIN_GEBOT, BRAIN_BEGRIFF_DEFINITION, POSITIVE_SURPRISE_DELIVERY_RULE, GOOSE.md, GOOSE_AUTOMATION_RULES | Goose AI CLI Lauf |
| 2026-06-10 | 1.0.1 | POSITIVE_SURPRISE_DELIVERY_RULE_V1 in Index ergänzt (fehlte) | goose Session 20260610_35 |

---

## 7. Verknüpfte Audits

- AUD-2026-06-10-001: Regelwerks-Vollständigkeitsprüfung
- AUD-2026-06-10-002: Hierarchie-Konsistenzprüfung

---

*Ende des Regelwerks-Index. Alle Änderungen an diesem Index sind evidence-pflichtig.*
