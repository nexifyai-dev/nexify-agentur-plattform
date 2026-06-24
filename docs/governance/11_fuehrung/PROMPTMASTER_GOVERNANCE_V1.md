# PROMPTMASTER GOVERNANCE V1

**Status:** 🟢 Entwurf / Draft
**Version:** 1.0.0
**Datum:** 2026-06-11
**Autor:** Subagent 20260611_5
**Audit-Pflicht:** Ja
**Rang im Regelwerk:** 5 (nach Operational Constitution, Global Policy, Memory-Pflicht, DOS Gates)

---

## 1. Überblick

Dieses Dokument definiert die **Governance für Prompt-Änderungen** im NeXify-System. Der Promptmaster ist die einzige Instanz, die produktive Prompts ändern darf. Alle anderen Agenten erkennen Fehler, schlagen Verbesserungen vor und liefern Evidence — aber ändern niemals eigenmächtig Prompts.

> **Leitsatz:** Prompts sind Code. Code-Änderungen brauchen Code-Review. Prompt-Änderungen brauchen Prompt-Review.

---

## 2. Rollen und Verantwortlichkeiten

### 2.1 Promptmaster (Eigentümer)

| Verantwortung | Beschreibung |
|--------------|-------------|
| **Prompt-Pflege** | Einzige Instanz mit Schreibzugriff auf produktive Prompts |
| **Qualitätssicherung** | Stellt Konsistenz, Klarheit und Effektivität aller Prompts sicher |
| **Versionierung** | Führt Änderungsprotokoll und versioniert Prompts |
| **Change-Control** | Führt den Change-Control-Prozess durch |
| **Review** | Prüft Änderungsvorschläge anderer Agenten |
| **Dokumentation** | Dokumentiert jede Änderung mit Begründung und erwartetem Effekt |
| **Rückwärtskompatibilität** | Stellt sicher, dass Prompt-Änderungen keine bestehenden Workflows brechen |
| **Test** | Führt Prompt-Tests vor Produktivsetzung durch |

### 2.2 Andere Agenten (Vorschlagende)

| Berechtigung | Beschreibung |
|-------------|-------------|
| **Fehler erkennen** | Jeder Agent darf fehlerhafte, unklare oder ineffektive Prompts identifizieren |
| **Verbesserung vorschlagen** | Jeder Agent darf konkrete Änderungsvorschläge mit Begründung einreichen |
| **Evidence liefern** | Jeder Agent muss seine Vorschläge mit Evidence belegen (Beispiele, Logs, Tests) |
| **Test-Prompts** | Jeder Agent darf in isolierten Test-Umgebungen mit Prompt-Varianten experimentieren |

### 2.3 Verboten für alle außer Promptmaster

| Verbot | Begründung |
|--------|-----------|
| **Eigenmächtige Prompt-Änderungen** | Ohne Change-Control-Prozess besteht Risiko von Systemausfällen |
| **CLAUDE.md ohne Review überladen** | CLAUDE.md ist ein zentrales Steuerungsdokument; jede Änderung braucht Review |
| **Direktes Editieren von Prompt-Dateien** | Auch bei vermeintlich trivialen Änderungen |
| **Prompt-Templates überschreiben** | Templates haben oft Abhängigkeiten zu anderen Systemen |
| **System-Prompts in agentmemory überschreiben** | System-Prompts sind geschützt |

---

## 3. Change-Control-Prozess

### 3.1 Prozess-Übersicht

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ 1. Erkennen │ → │ 2. Vorschlag │ → │ 3. Review  │ → │ 4. Test   │ → │ 5. Deploy │
│ (Jeder)    │   │ (Jeder)    │   │ (Promptmaster)│   │ (Promptmaster)│   │ (Promptmaster)│
└──────────┘     └──────────┘     └──────────┘     └──────────┘     └──────────┘
```

### 3.2 Schritt 1: Erkennen (Jeder Agent)

Jeder Agent darf und soll Probleme in Prompts erkennen:

- **Fehler**: Rechtschreibung, Grammatik, Logikfehler
- **Unklarheit**: Mehrdeutige Anweisungen, fehlende Kontext
- **Ineffektivität**: Prompts, die nicht das gewünschte Verhalten erzeugen
- **Inkonsistenz**: Widersprüchliche Anweisungen zwischen verschiedenen Prompts
- **Sicherheit**: Prompts, die Sicherheitslücken öffnen könnten

### 3.3 Schritt 2: Vorschlag einreichen (Jeder Agent)

Jeder Änderungsvorschlag MUSS enthalten:

```markdown
## PROMPT-CHANGE-VORSCHLAG

**Datum**: {YYYY-MM-DD}
**Autor**: {Agent-ID}
**Betroffener Prompt**: {Prompt-Name/-Pfad}
**Typ**: [BUGFIX / IMPROVEMENT / CLARIFICATION / SECURITY]

### Aktueller Zustand (IST)
```
{Aktueller Prompt-Text oder relevanter Ausschnitt}
```

### Problem
{Kurze Beschreibung des Problems mit konkreten Beispielen}

### Vorgeschlagene Änderung (SOLL)
```
{Vorgeschlagener Prompt-Text oder relevanter Ausschnitt}
```

### Begründung
{Warum diese Änderung das Problem löst}

### Evidence
- {Log-/Test-Beispiele, die das Problem belegen}
- {Erwartete Verbesserung durch die Änderung}

### Risikoabschätzung
- **Auswirkung**: [NIEDRIG / MITTEL / HOCH / KRITISCH]
- **Betroffene Workflows**: {Liste}
- **Rückwärtskompatibilität**: [JA / NEIN — Erklärung]
```

### 3.4 Schritt 3: Review (Promptmaster)

Der Promptmaster prüft:

| Kriterium | Beschreibung | Gewichtung |
|-----------|-------------|-----------|
| **Korrektheit** | Ist der Vorschlag fachlich richtig? | Hoch |
| **Klarheit** | Ist der Vorschlag verständlich formuliert? | Hoch |
| **Konsistenz** | Passt der Vorschlag zu bestehenden Prompts? | Hoch |
| **Vollständigkeit** | Sind alle Edge Cases abgedeckt? | Mittel |
| **Sicherheit** | Führt die Änderung zu Sicherheitsrisiken? | Kritisch |
| **Rückwärtskompatibilität** | Brechen bestehende Workflows? | Hoch |
| **Evidence** | Ist das Problem ausreichend belegt? | Mittel |
| **Dringlichkeit** | Wie dringend ist die Änderung? | Niedrig |

**Review-Ergebnisse:**

| Ergebnis | Bedeutung | Aktion |
|----------|-----------|--------|
| ✅ **APPROVED** | Änderung freigegeben | Geht zu Test |
| ⚠️ **APPROVED WITH CHANGES** | Mit Anpassungen freigegeben | Promptmaster passt an |
| 🔄 **REVISE AND RESUBMIT** | Vorschlag unvollständig | Autor überarbeitet |
| ❌ **REJECTED** | Abgelehnt mit Begründung | Vorschlag geschlossen |

### 3.5 Schritt 4: Test (Promptmaster)

Vor Produktivsetzung MUSS getestet werden:

1. **Isolationstest**: Prompt in Test-Umgebung mit bekannten Testfällen
2. **Regressionstest**: Alle bestehenden Workflows mit neuem Prompt durchlaufen
3. **Sicherheitstest**: Prompt auf Injection, Jailbreak, Data Leakage prüfen
4. **Performance-Test**: Latenz und Token-Verbrauch messen

### 3.6 Schritt 5: Deploy (Promptmaster)

1. Prompt versionieren (git-tag oder Version in Datei)
2. Alten Prompt sichern (Backup im prompts/backup-Ordner)
3. Neuen Prompt deployen
4. Evidence-Datei schreiben (siehe PROMPT_CHANGE_CONTROL_EVIDENCE.md)
5. Alle betroffenen Agenten benachrichtigen
6. 24h Monitoring nach Deploy

---

## 4. Dringlichkeits-Stufen

| Stufe | Bezeichnung | Beschreibung | SLA |
|-------|------------|-------------|-----|
| **P1** | 🔴 Kritisch | Sicherheitslücke, Systemausfall | < 1 Stunde |
| **P2** | 🟡 Hoch | Fehlerhafte Ausgaben, Datenverlust-Risiko | < 4 Stunden |
| **P3** | 🔵 Normal | Verbesserung, Klarstellung | < 48 Stunden |
| **P4** | 🟢 Niedrig | Kosmetik, Optionale Optimierung | < 2 Wochen |

---

## 5. Prompt-Datei-Struktur

Alle produktiven Prompts werden im Verzeichnis `/workspace/nexify/04_prompts/` gespeichert.

### Namenskonvention

```
{bereich}_{prompt-name}_V{version}.md
```

Beispiele:
- `goose_system-prompt_V2.md`
- `hermes_chat-template_V1.md`
- `kilo_audit-prompt_V3.md`

### Jeder Prompt enthält

```markdown
---
title: {Prompt-Name}
version: {X.Y.Z}
status: {aktiv / entwurf / deprecated}
author: Promptmaster
last_modified: {YYYY-MM-DD}
approval: {Change-Control-ID}
---

# {Prompt-Titel}

> **Zweck**: {Ein Satz, wofür dieser Prompt dient}
> **Anwendung**: {Wo und von wem dieser Prompt genutzt wird}

## Prompt

```
{Hier steht der eigentliche Prompt-Text}
```

## Änderungsprotokoll

| Version | Datum | Änderung | Autor | Approval |
|---------|-------|----------|-------|----------|
| 1.0.0 | YYYY-MM-DD | Initial | Promptmaster | CC-001 |

## Verknüpfte Evidence

- {CC-ID}: {Change-Control-Evidence-Referenz}
```

---

## 6. CLAUDE.md Governance

CLAUDE.md ist ein **besonders geschütztes Dokument**. Es steuert das Verhalten von Goose und anderen CLI-basierten Agenten.

### CLAUDE.md-Änderungs-Regeln

| Regel | Beschreibung |
|-------|-------------|
| **Nicht überladen** | CLAUDE.md darf nur Anweisungen enthalten, die für das Gesamtsystem relevant sind |
| **Keine Task-spezifischen Anweisungen** | Temporäre Anweisungen gehören in die Session, nicht in CLAUDE.md |
| **Review vor Commit** | Jede CLAUDE.md-Änderung braucht Review durch Promptmaster |
| **Evidence-Pflicht** | Jede CLAUDE.md-Änderung produziert eine Evidence-Datei |
| **Begründung** | Jede Änderung muss begründet werden (warum ist sie systemweit gültig?) |

### Erlaubte CLAUDE.md-Inhalte

- ✅ Globale Systemregeln
- ✅ Immer-gültige Workflow-Anweisungen
- ✅ Sicherheitsrichtlinien
- ✅ Verhaltenscodizes
- ✅ Qualitätsstandards

### Verbotene CLAUDE.md-Inhalte

- ❌ Task-spezifische Anweisungen ("Bei Task X mache Y")
- ❌ Temporäre Workarounds
- ❌ Benutzerspezifische Konfigurationen
- ❌ Debugging-Anweisungen
- ❌ Experimentelle Konfigurationen

---

## 7. Eskalation

### 7.1 Konflikt-Fälle

| Situation | Aktion |
|-----------|--------|
| Promptmaster ist nicht erreichbar | Oracle übernimmt temporär |
| Change-Vorschlag wird abgelehnt | Autor kann Beschwerde bei Oracle einlegen |
| Kritischer Prompt-Fehler (P1) | Promptmaster wird sofort benachrichtigt |
| Uneinigkeit über Änderung | Oracle entscheidet als letzte Instanz |

### 7.2 Notfall-Prozess

Im Falle eines kritischen Prompt-Fehlers (Sicherheitslücke, Systemausfall):

1. **Sofortige Isolation**: Betroffenen Prompt deaktivieren oder auf letzte stabile Version zurücksetzen
2. **Parallel**: Promptmaster benachrichtigen + Oracle informieren
3. **Hotfix**: Promptmaster erstellt und testet Hotfix
4. **Nachbereitung**: Vollständige Post-Mortem-Dokumentation

---

## 8. Metriken & Reporting

### 8.1 Prompt-Qualitäts-Metriken

| Metrik | Beschreibung | Zielwert |
|--------|-------------|----------|
| Change-Request-Durchlaufzeit | Zeit von Einreichung bis Deploy | < 48h (P3) |
| Approval-Rate | Anteil genehmigter Vorschläge | > 70% |
| Rollback-Rate | Anteil zurückgesetzter Änderungen | < 5% |
| Prompt-Test-Abdeckung | Anteil getesteter Änderungen | 100% |
| CLAUDE.md-Änderungsfrequenz | Änderungen pro Monat | < 5 |

### 8.2 Reporting

- **Wöchentlich**: Prompt-Change-Report (alle Änderungen der Woche)
- **Monatlich**: Prompt-Qualitäts-Report (Metriken, Trends, Probleme)
- **Vierteljährlich**: Prompt-Architektur-Review (Struktur, Redundanzen, Optimierung)

---

## 9. Verknüpfte Regelwerke

| Regelwerk | Beziehung |
|-----------|-----------|
| `GLOBAL_POLICY_V1.md` | Prompt-Änderungen durchlaufen Policy Gate |
| `EVIDENCE_TEMPLATE_V1.md` | Evidence-Format für Prompt-Änderungen |
| `FEEDBACK_LOOP_MASTER_V1.md` | Feedback zu Prompts → Verbesserungsvorschläge |
| `AUDIT_MASTER_V1.md` | Prompt-Governance wird auditiert |
| `REGELWERKS_INDEX_V1.md` | Dieses Regelwerk ist im Index registriert |

---

## 10. Änderungsprotokoll

| Datum | Version | Änderung | Autor |
|-------|---------|----------|-------|
| 2026-06-11 | 1.0.0 | Initiale Promptmaster Governance | Subagent 20260611_5 |

---

*Ende der Promptmaster Governance. Alle Änderungen an diesem Dokument sind evidence-pflichtig.*
