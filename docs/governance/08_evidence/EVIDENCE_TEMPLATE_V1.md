# EVIDENCE_TEMPLATE V1 — Evidence-Standard für NeXify

**Status:** 🟢 Aktiv / Active
**Version:** 1.0.0
**Datum:** 2026-06-10
**Autor:** NeXify Governance System
**Audit-Pflicht:** Ja

---

## 1. Zweck

Dieses Template definiert das **einheitliche Format für Evidence-Dateien**
im NeXify-System. Jede Aktion, Entscheidung oder Änderung produziert eine
Evidence-Datei, die die Nachvollziehbarkeit und Reproduzierbarkeit des Systems
sicherstellt.

> **Leitsatz:** Keine Aktion ohne Evidence. Evidence = Wahrheit.
> Eine nicht dokumentierte Aktion hat nicht stattgefunden.

---

## 2. Das Evidence-Template

```markdown
# EVIDENCE: {Titel der Aktion}

**Status:** 🟢 DONE / 🟡 PARTIAL / 🔴 FAILED / ⛔ BLOCKED
**Datum:** {YYYY-MM-DD}
**Uhrzeit:** {HH:MM} {Zeitzone}
**Autor:** {Agent-Name / Agent-ID}
**Task-ID:** {TASK-Nummer / Issue-Nummer}
**Policy-Gate-ID:** {PG-YYYYMMDD-NR}
**Audit-ID:** {AUD-YYYYMMDD-NR} (optional, falls zutreffend)

---

## 1. Aktion

**Kurzbeschreibung:**
{1-2 Sätze, was getan wurde}

**Auslöser:**
- [ ] Aufgabenbasiert (Task/Issue)
- [ ] Event-getrieben (Crush/Webhook)
- [ ] Manuelle Anfrage
- [ ] Automatisierter Workflow
- [ ] Sub-Agent (gespawned von: {Hauptagent})

**Betroffene Systeme/Komponenten:**
- {Komponente 1}
- {Komponente 2}

---

## 2. Policy-Gate-Durchlauf

### Stufe 1: Skill-Prüfung
- Geladener Skill: {Skill-Name} v{Version}
- Skill geladen: ✅ / ❌
- Skill-Doku gelesen: ✅ / ❌
- Ergebnis: PASS / WARN / BLOCK

### Stufe 2: Brain-Prüfung
- Brain-Kontext geladen: ✅ / ❌
- Relevante Patterns identifiziert: {Patterns}
- Ergebnis: PASS / WARN / BLOCK

### Stufe 3: Memory-Prüfung
- agentmemory geladen: ✅ / ❌
- Letzter Sync: {Timestamp}
- Relevante History-Einträge: {Anzahl}
- Ergebnis: PASS / WARN / BLOCK

### Stufe 4: Policy Gate
- Konformität: 🟢 / 🟡 / 🔴
- Autorisierung: 🟢 / 🟡 / 🔴
- Scope: 🟢 / 🟡 / 🔴
- Security: 🟢 / 🟡 / 🔴
- Ressourcen: 🟢 / 🟡 / 🔴
- Dependencies: 🟢 / 🟡 / 🔴
- **Gate-Ergebnis:** PASS / WARN / BLOCK

### Stufe 5: Evidence
- Evidence erstellt: ✅ (diese Datei)
- Evidence vollständig: ✅ / ❌

---

## 3. Durchgeführte Aktionen (Chain of Actions)

```
{Chronologische Liste aller durchgeführten Einzelschritte}
```

| # | Schritt | Werkzeug/Befehl | Ergebnis | Dauer |
|---|---------|-----------------|----------|-------|
| 1 | {Schritt 1} | {tool/command} | {Output Summary} | {Sekunden} |
| 2 | {Schritt 2} | {tool/command} | {Output Summary} | {Sekunden} |
| 3 | ... | ... | ... | ... |

---

## 4. Ergebnis

**Erwartetes Ergebnis:**
{Beschreibung des erwarteten Ergebnisses}

**Tatsächliches Ergebnis:**
{Beschreibung des tatsächlichen Ergebnisses}

**Abweichungen (Soil ↔ Ist):**
| # | Aspekt | Erwartet (Soll) | Tatsächlich (Ist) | Abweichung |
|---|--------|-----------------|-------------------|------------|
| 1 | {Aspekt} | {Soll} | {Ist} | 🟢 Keine / 🟡 Gering / 🔴 Kritisch |
| 2 | ... | ... | ... | ... |

---

## 5. Security-Check

- [ ] Keine Secrets/Sensiblen Daten exponiert
- [ ] Keine Injection-Risiken eingeführt
- [ ] Zugriffsrechte korrekt gesetzt
- [ ] Dependency-Scan durchgeführt (wenn zutreffend)
- [ ] CVE-Prüfung: Keine neuen CRITICAL/HIGH Findings

**Security-Ergebnis:** 🟢 PASS / 🟡 WARN / 🔴 FAIL

**Security-Notizen:**
{Relevante Sicherheitshinweise, falls vorhanden}

---

## 6. Memory-Sync-Status

- Sync durchgeführt: ✅ / ❌
- Sync-Zeitpunkt: {Timestamp}
- Memory-Eintrag-ID: {mem-YYYYMMDD-NR}
- Verknüpfte Einträge: {Liste der verknüpften Memory-IDs}
- Sync-Status: 🟢 Erfolgreich / 🟡 Teilweise / 🔴 Fehlgeschlagen

**Memory-Notizen:**
{Relevante Hinweise zum Memory-Sync}

---

## 7. DONE-Check (falls Task abgeschlossen)

| # | Kriterium | Status | Nachweis |
|---|-----------|--------|----------|
| 1 | Zielzustand erreicht | 🟢 / 🟡 / 🔴 | {Akzeptanzkriterien-Check} |
| 2 | Tests bestanden | 🟢 / 🟡 / 🔴 | {Test-Ergebnis} |
| 3 | Evidence geschrieben | 🟢 | Diese Datei |
| 4 | Memory sync | 🟢 / 🟡 / 🔴 | {Aus Abschnitt 6} |
| 5 | Kanban aktuell | 🟢 / 🟡 / 🔴 | {Kanban-Update bestätigt} |
| 6 | Audit bestanden | 🟢 / 🟡 / 🔴 | {Audit-ID} |

**DONE-Gesamt:** ✅ Ja / ❌ Nein / 🟡 Bedingt

---

## 8. Learnings & Verbesserungen

**Was ist gut gelaufen:**
- {Erfolgsfaktor 1}
- {Erfolgsfaktor 2}

**Was könnte verbessert werden:**
- {Verbesserungsvorschlag 1}
- {Verbesserungsvorschlag 2}

**Offene Punkte / Folge-Tasks:**
- [ ] {Offener Punkt 1} (Task-ID: TASK-xxx)
- [ ] {Offener Punkt 2} (Task-ID: TASK-xxx)

---

## 9. Folgeaktionen

| # | Aktion | Verantwortlich | Frist | Priorität |
|---|--------|----------------|-------|-----------|
| 1 | {Aktion 1} | {Agent} | {Datum} | 🔴 / 🟡 / 🟢 |
| 2 | {Aktion 2} | {Agent} | {Datum} | 🔴 / 🟡 / 🟢 |

---

## 10. Anhänge / Referenzen

- Policy-Gate-Log: /logs/pg-{YYYYMMDD-NR}.json
- Memory-Dump: mem-{YYYYMMDD-NR}
- Task-Details: TASK-{NR}
- Audit-Bericht: AUD-{YYYYMMDD-NR}
- Sonstige: {Links zu weiteren Ressourcen}

---

*Evidence erstellt am {YYYY-MM-DD} um {HH:MM} — Agent: {Agent-Name}*
*Diese Evidence unterliegt der Audit-Pflicht gemäß AUDIT_MASTER_V1.*
```

---

## 3. Template-Abschnitte — Erläuterung

| Abschnitt | Pflicht | Zweck |
|-----------|---------|-------|
| Kopfblock | ✅ | Identifikation, Status, Verknüpfungen |
| Aktion | ✅ | Was wurde getan und warum? |
| Policy Gate | ✅ | Nachweis des vollständigen Policy-Durchlaufs |
| Chain of Actions | ✅ | Detaillierte Schritt-für-Schritt-Dokumentation |
| Ergebnis | ✅ | Soll/Ist-Vergleich |
| Security-Check | ✅ | Sicherheitsnachweis |
| Memory-Sync | ✅ | Nachweis der Memory-Persistenz |
| DONE-Check | ⚠️ | Nur bei Task-Abschluss |
| Learnings | ⚠️ | Nur bei relevanten Erkenntnissen |
| Folgeaktionen | ⚠️ | Nur bei offenen Punkten |
| Anhänge | ⚠️ | Referenzen zu verwandten Dokumenten |

---

## 4. Evidence-Datei-Struktur

- **Speicherort:** `/workspace/nexify/10_evidence/`
- **Namenskonvention:** `EV_{Typ}_{YYYYMMDD}_{NR}.md`
- **Typen-Präfixe:**

| Präfix | Typ |
|--------|-----|
| EV_TASK | Aufgaben-basierte Evidence |
| EV_PG | Policy-Gate-Durchlauf |
| EV_AUDIT | Audit-Ergebnis |
| EV_CHANGE | System-Änderung |
| EV_DECISION | Architektur-Entscheidung |
| EV_ERROR | Fehler-Dokumentation |

---

## 5. Minimale Evidence (Quick-Version)

Für triviale Aktionen (z.B. Datei-Lesen):

```markdown
# EVIDENCE: {Titel}

Status: 🟢 DONE | Datum: {YYYY-MM-DD} | Autor: {Agent}
Action: {Kurzbeschreibung}
Ergebnis: {Kurzes Ergebnis}
Security: 🟢 PASS
Memory-Sync: ✅
```

---

## 6. Verknüpfungen

Jede Evidence-Datei muss verknüpft sein mit:
- ✅ Der zugehörigen Task/Issue
- ✅ Dem Policy-Gate-Log
- ✅ Dem agentmemory-Eintrag
- ✅ Dem Audit-Bericht (bei DONE)

---

## 7. Änderungsprotokoll

| Datum | Version | Änderung | Autor |
|-------|---------|----------|-------|
| 2026-06-10 | 1.0.0 | Initiales Template — 10 Abschnitte | NeXify Governance |

---

*Jede Evidence, die nicht diesem Template folgt, gilt als unvollständig und
wird beim Audit mit WARN oder FAIL bewertet.*
