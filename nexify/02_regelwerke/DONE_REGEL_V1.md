# DONE_REGEL V1 — Erweiterte Definition of Done

**Status:** 🟢 Aktiv / Active
**Version:** 1.0.0
**Datum:** 2026-06-10
**Autor:** NeXify Governance System
**Audit-Pflicht:** Ja
**Übergeordnetes Regelwerk:** DOS Definition of Done (Rang 6)

---

## 1. Zweck

Diese Regel definiert das **verbindliche Kriterienset** für die Fertigstellung
**jeder Arbeit** im NeXify-System. Sie erweitert die bestehende DOS Definition of
Done um die Bereiche Evidence, Memory und Audit.

> **Kernsatz:** Eine Arbeit ist erst dann fertig, wenn **alle 6 Kriterien** erfüllt sind.

---

## 2. Die 6 DONE-Kriterien

```
┌─────────────────────────────────────────────────────┐
│                  DONE = ALLE 6 🟢                    │
├──────────┬──────────┬──────────┬──────────┬─────────┤
│ Ziel     │ Tests    │ Evidence │ Memory   │ Kanban  │ Audit  │
│ erreicht │ bestanden│ geschrieben│ sync    │ aktuell │ bestanden│
└──────────┴──────────┴──────────┴──────────┴─────────┴─────────┘
```

### Kriterium 1: 🎯 Zielzustand erreicht

**Check:** Das in GATE 2 (DOS GATES) definierte Ziel ist vollständig erreicht.

| Prüfung | Beschreibung |
|---------|--------------|
| Akzeptanzkriterien | Alle vorab definierten Akzeptanzkriterien sind grün |
| Definition of Done | DOS Definition of Done (5 Dimensionen) ist erfüllt |
| Quality Gate | Keine offenen Qualitätsmängel (Linting, Coverage, Code-Smells) |
| Funktionale Vollständigkeit | Alle Anforderungen aus der Aufgabenstellung sind umgesetzt |

**Negativ-Kriterien (bei Zutreffen → nicht DONE):**
- ❌ Es gibt bekannte Bugs
- ❌ Edge Cases sind nicht behandelt
- ❌ Die Lösung deckt nicht alle spezifizierten Anforderungen ab

### Kriterium 2: ✅ Tests bestanden

**Check:** Alle Tests laufen grün — und die Testabdeckung ist ausreichend.

| Prüfung | Schwelle | Aktion bei Unterschreitung |
|---------|----------|----------------------------|
| Unit-Tests | 100% grün | Fehler beheben, nicht DONE |
| Integrationstests | 100% grün | Fehler beheben, nicht DONE |
| Test Coverage | ≥ 90% | Coverage-Lücke dokumentieren und Issue erfassen |
| Linting | 0 Fehler, 0 Warnings | Linting-Fehler beheben |
| Security-Scan | 0 CRITICAL/HIGH | Findings beheben oder Ausnahmegenehmigung einholen |

### Kriterium 3: 📝 Evidence geschrieben

**Check:** Eine vollständige Evidence-Datei wurde erstellt.

**Pflichtbestandteile:**
- Status (DONE / PARTIAL / FAILED / BLOCKED)
- Datum und Autor
- Durchgeführte Aktionen (Chain of Actions)
- Ergebnis und Abweichungen vom Plan
- Security-Check
- Memory-Sync-Status (aus Kriterium 4)
- Referenz zur Aufgaben-ID
- Referenz zum durchlaufenen Policy Gate

> **Formatvorlage:** [EVIDENCE_TEMPLATE_V1.md](./EVIDENCE_TEMPLATE_V1.md)

### Kriterium 4: 💾 agentmemory aktualisiert

**Check:** agentmemory wurde mit den Ergebnissen der Arbeit synchronisiert.

| Prüfung | Beschreibung |
|---------|--------------|
| Sync durchgeführt | Memory-Sync wurde ausgelöst |
| Struktur eingehalten | Einträge folgen der agentmemory-Struktur |
| Vollständigkeit | Alle relevanten Ergebnisse, Entscheidungen und Learnings sind gespeichert |
| Verknüpfung | Memory-Einträge sind mit Aufgaben-ID und Evidence verknüpft |

### Kriterium 5: 📋 Kanban aktualisiert

**Check:** Das Kanban-Board spiegelt den aktuellen Status der Arbeit wider.

| Feld | Aktion |
|------|--------|
| Task-Status | Auf "DONE" / "COMPLETED" gesetzt |
| Zugewiesener Agent | Eingetragen (falls abweichend) |
| Zeit-Erfassung | Geschätzte vs. tatsächliche Arbeitszeit |
| Changelog | Eintrag im Changelog vorhanden |
| Verknüpfungen | Links zu Evidence, Memory-Einträgen und PR |

> **Ziel:** Ein externer Betrachter muss den vollständigen Arbeitsverlauf
> aus dem Kanban nachvollziehen können.

### Kriterium 6: 🛡️ Audit bestanden

**Check:** Ein automatisiertes oder manuelles Audit hat die Arbeit bestanden.

| Audit-Art | Beschreibung |
|-----------|--------------|
| 🔄 Self-Audit | Agent prüft eigene Arbeit gegen die DONE-Kriterien |
| 🤖 Auto-Audit | Automatisierte Prüfung (Regelwerk-Compliance, Coverage, Security) |
| 👤 Manuelles Audit | Review durch Menschen oder übergeordneten Agenten (bei CRITICAL/HIGH) |

**Ergebnis:**
| Ergebnis | Bedeutung |
|----------|-----------|
| 🟢 PASS | Audit bestanden → DONE ist gültig |
| 🟡 CONDITIONAL | Kleinere Abweichungen → DONE mit Auflagen |
| 🔴 FAIL | Audit nicht bestanden → Arbeit geht zurück, nicht DONE |

---

## 3. DONE-Checkliste (Agent Overview)

Vor dem Abschluss einer Arbeit führt der Agent diesen finalen Check durch:

```markdown
## DONE-Check

- [ ] 1. Zielzustand erreicht? (Akzeptanzkriterien alle grün)
- [ ] 2. Tests bestanden? (100% grün, ≥90% Coverage)
- [ ] 3. Evidence geschrieben? (Vollständig, nach Template)
- [ ] 4. agentmemory aktualisiert? (Sync durchgeführt)
- [ ] 5. Kanban aktualisiert? (Status, Zeit, Changelog)
- [ ] 6. Audit bestanden? (PASS oder CONDITIONAL)

→ **DONE** (wenn alle 6 mit ✅)
→ **NICHT DONE** (wenn ein ❌ vorhanden)
```

---

## 4. Ausnahmen & Sonderfälle

| Fall | Regelung |
|------|----------|
| **Partielles DONE** | Wenn Teilaufgaben abgeschlossen, aber Gesamtaufgabe nicht: Status = PARTIAL, Begründung in Evidence |
| **Externer Block** | Wenn Blockade außerhalb der Kontrolle des Agenten liegt: BLOCKED-Status, dokumentieren |
| **Fast-Track** | Bei kritischem Bugfix: Audit kann auf 24h nachgelagert werden — Eintrag im RULE_CONFLICT_REGISTER |
| **Widerspruch zu DOS DoD** | DONE_REGEL_V1 erweitert DOS DoD. Bei Widerspruch gilt die strengere Regel. |

---

## 5. Konsequenzen bei Nicht-Einhaltung

| Verstoß | Konsequenz |
|---------|------------|
| Arbeit ohne DONE-Check geschlossen | Task wird reopen, Agent wird gemahnt |
| Evidence fehlt | Arbeit gilt als nicht erledigt |
| Memory nicht synchronisiert | Verlust von Kontext — automatische Wiederherstellung angeordnet |
| Audit nicht bestanden | Deployment blockiert, Freigabe verweigert |

---

## 6. Änderungsprotokoll

| Datum | Version | Änderung | Autor |
|-------|---------|----------|-------|
| 2026-06-10 | 1.0.0 | Initiale Version — 6 DONE-Kriterien | NeXify Governance |

---

*Diese Regel ersetzt nicht die DOS Definition of Done, sondern erweitert sie um die
drei zusätzlichen Kriterien Evidence, Memory und Audit.*
