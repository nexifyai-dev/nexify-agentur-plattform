# SKILL_FIRST_REGEL V1 — Skill-Loading-Mandat

**Status:** 🟢 Aktiv / Active
**Version:** 1.0.0
**Datum:** 2026-06-10
**Autor:** NeXify Governance System
**Audit-Pflicht:** Ja
**Übergeordnetes Regelwerk:** NeXify AI Global Rules — Skill-First (Rang 3)

---

## 1. Zweck

Diese Regel stellt sicher, dass **vor jeder Arbeit die benötigten Skills geladen sind**.
Skills sind die einzige autorisierte Quelle für ausführbare Fähigkeiten. Kein Agent
improvisiert Fähigkeiten, die als Skill existieren oder existieren sollten.

> **Leitsatz:** Erst Skill laden, dann arbeiten. Ohne Skill = keine Aktion.

---

## 2. Kernregel

```
Vor jeder Arbeit:
  1. Prüfen: Existiert ein Skill für diese Aufgabe?
  2. Laden: Skill vollständig in den Kontext laden
  3. Bestätigen: Skill-Dokumentation gelesen und verstanden
  4. Ausführen: Arbeit mit geladenem Skill durchführen
```

### Was ist ein Skill?

Ein Skill ist eine **wiederverwendbare, dokumentierte Fähigkeit** die:

- In `/workspace/nexify/05_skills/` abgelegt ist
- Eine klare Beschreibung hat (was macht der Skill?)
- Ein definiertes Input/Output-Schema hat
- Eine Versionsnummer führt
- Getestet und auditierbar ist

---

## 3. Skill-Prüfmatrix

| Szenario | Vorgehen |
|----------|----------|
| ✅ Skill existiert & ist geladen | → Arbeit durchführen |
| ⚠️ Skill existiert, aber nicht geladen | → Skill laden → Arbeit durchführen |
| ⚠️ Skill existiert, aber veraltet | → Skill aktualisieren → laden → Arbeit durchführen |
| ❌ Skill existiert nicht | → Arbeit pausieren → Skill-Erstellung beantragen |
| ❌ Skill existiert, deckt Aufgabe nicht ab | → Skill erweitern → laden → Arbeit durchführen |
| 🔴 Skill ist defekt/fehlerhaft | → Skill-Reparatur priorisieren → Arbeit pausieren |

---

## 4. Verbotene Handlungen

| ❌ Verbot | Begründung | Alternative |
|-----------|------------|-------------|
| Fähigkeit ohne Skill improvisieren | Riskant, nicht reproduzierbar | Skill anlegen/laden |
| Skill durch Prompt-Injection umgehen | Umgeht Quality Gate | Policy Gate nutzen |
| Skill-Ergebnis als eigenes ausgeben | Fehlende Transparenz | Evidence dokumentieren |
| Skill ohne Prüfung aufrufen | Blindflug | Skill-Doku vorher lesen |

---

## 5. Skill-Loading-Check (vor jeder Arbeit)

```markdown
## Skill Loading Check

- [ ] Wurden relevante Skills identifiziert? (Skill-Liste durchgehen)
- [ ] Ist der Skill geladen? (Im aktiven Kontext vorhanden)
- [ ] Ist die Skill-Dokumentation gelesen? (Input, Output, Einschränkungen)
- [ ] Ist der Skill getestet/valide? (Letzte Audit-Prüfung bekannt)
- [ ] Deckt der Skill die Aufgabe vollständig ab? (Scope-Check)
```

---

## 6. Verhältnis zu anderen Regeln

| Regelwerk | Bezug |
|-----------|-------|
| GLOBAL_POLICY_V1 | Skill-Prüfung ist Stufe 1 des Policy Gates |
| MEMORY_PFLICHT_V1 | Skills werden im agentmemory referenziert |
| DOS GATES (G04) | Gate 4 = Skill-Selektion |
| AUDIT_MASTER_V1 | Skill-Nutzung ist audit-pflichtig |

---

## 7. Ausnahmen

Ausnahmen vom Skill-First-Prinzip sind nur mit dokumentierter Begründung möglich:

| Ausnahme | Bedingung | Dokumentation |
|----------|-----------|---------------|
| Neuartige Aufgabe | Noch kein Skill existiert → Erstellungsprozess starten | Im RULE_CONFLICT_REGISTER eintragen |
| Triviale Operation | Datei lesen, Verzeichnis auflisten | Kein Skill nötig, aber Evidence trotzdem pflichtig |

---

## 8. Änderungsprotokoll

| Datum | Version | Änderung | Autor |
|-------|---------|----------|-------|
| 2026-06-10 | 1.0.0 | Initiale Version — Skill-First-Mandat | NeXify Governance |

---

*Diese Regel implementiert das Skill-First-Prinzip aus den NeXify AI Global Rules.*
