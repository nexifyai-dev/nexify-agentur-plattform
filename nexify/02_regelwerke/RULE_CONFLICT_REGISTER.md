# RULE CONFLICT REGISTER V1 — Bekannte Konflikte zwischen Regelwerken

**Status:** 🟢 Aktiv / Active
**Version:** 1.0.0
**Datum:** 2026-06-10
**Autor:** NeXify Governance System
**Audit-Pflicht:** Ja

---

## 1. Zweck

Dieses Register erfasst **alle bekannten Konflikte, Widersprüche und Spannungen**
zwischen aktiven Regelwerken im NeXify-System. Es dient als zentrale
Entscheidungsgrundlage bei Regelwerkskonflikten und als Treiber für
Regelwerks-Optimierung.

> **Ziel:** Transparenz über Regelwerksinkonsistenzen schaffen und systematisch
> auflösen. Ein Konflikt ist erst dann geschlossen, wenn er aufgelöst oder explizit
> akzeptiert wurde.

---

## 2. Konflikt-Klassifizierung

| Level | Bezeichnung | Bedeutung | Maßnahme |
|-------|-------------|-----------|----------|
| 🔴 **BREAKING** | Systemblockade | Konflikt verhindert Aufgabenausführung | Sofort eskalieren, Regelwerk anpassen |
| 🟡 **MAJOR** | Erschwerend | Konflikt verlangsamt oder verkompliziert Arbeit | In nächster Iteration auflösen |
| 🟢 **MINOR** | Inkonsistenz | Konflikt ist bekannt, aber nicht akut | Beobachten, bei nächster Revision prüfen |
| ⚪ **RESOLVED** | Aufgelöst | Konflikt wurde behoben | Dokumentation der Lösung |

---

## 3. Aktive Konflikte

### K001: Skill-First vs. Exploration

| Feld | Wert |
|------|------|
| **Status** | 🟡 MAJOR |
| **Betroffene Regeln** | SKILL_FIRST_REGEL_V1 (Rang 8) ↔ NeXify AI Global Rules "Nicht raten" (Rang 3) |
| **Konflikt** | SKILL_FIRST sagt: Keine Aktion ohne Skill. "Nicht raten" sagt: Bei Unsicherheit pausieren. Beide Regeln verbieten Handeln ohne vorbereiteten Skill → Exploration/Kreativität wird unterdrückt für Aufgaben, die noch keinen Skill haben. |
| **Auswirkung** | Neuartige Aufgaben werden blockiert, bis ein Skill erstellt wurde. Das kann Innovation bremsen. |
| **Lösungsansatz** | Ein "Exploration-Skill" anlegen, der explizit für Aufgaben ohne fertigen Skill autorisiert. Oder: GLOBAL_POLICY_V1 um eine "Exploration-Ausnahme" ergänzen. |
| **Eskalation** | Nicht eskaliert. Wird in Sprintf-Planung aufgenommen. |
| **Erfasst am** | 2026-06-10 |

### K002: DONE_REGEL-Vollständigkeit vs. Time-Box

| Feld | Wert |
|------|------|
| **Status** | 🟡 MAJOR |
| **Betroffene Regeln** | DONE_REGEL_V1 (Rang 7) ↔ DOS GATES G14 / Zeitrahmen (Rang 5) |
| **Konflikt** | DONE_REGEL_V1 verlangt 6 Kriterien (Ziel, Tests, Evidence, Memory, Kanban, Audit). DOS GATES G14 definiert ein Zeitbudget. Bei komplexen Aufgaben kann die vollständige DONE-Prüfung das Zeitbudget überschreiten. |
| **Auswirkung** | Agenten müssen entweder das Zeitbudget verletzen (Risiko) oder die DONE-Prüfung verkürzen (Qualitätsrisiko). |
| **Lösungsansatz** | Zeitbudget für DONE-Prüfung separat ausweisen (nicht im Aufgaben-Zeitbudget). Oder: DONE-Prüfung als eigenen Task definieren. |
| **Eskalation** | Nicht eskaliert. Zeitmessung für DONE-Prüfung einführen. |
| **Erfasst am** | 2026-06-10 |

### K003: Policy Gate Overhead bei Simplen Tasks

| Feld | Wert |
|------|------|
| **Status** | 🟢 MINOR |
| **Betroffene Regeln** | GLOBAL_POLICY_V1 (Rang 2) ↔ Effizienzprinzip (Operational Constitution) |
| **Konflikt** | GLOBAL_POLICY_V1 verlangt 5-stufiges Gate für jede Aktion. Bei simplen Aktionen (Datei lesen, Status prüfen) ist das Overhead unverhältnismäßig. |
| **Auswirkung** | Geringe Effizienz bei Routine-Aufgaben. Agenten könnten versucht sein, Gates zu umgehen. |
| **Lösungsansatz** | Quick-Check-Kurzform (in GLOBAL_POLICY_V1 Sektion 3 bereits vorgesehen) konsequent nutzen und automatisieren. |
| **Eskalation** | Nicht eskaliert. Quick-Check ist definiert, muss aber in Skills integriert werden. |
| **Erfasst am** | 2026-06-10 |

### K004: Audit-Pflicht vs. Feedback-Loop-Zeit

| Feld | Wert |
|------|------|
| **Status** | 🟢 MINOR |
| **Betroffene Regeln** | DONE_REGEL_V1 (Audit-Kriterium 6) ↔ FEEDBACK_LOOP_MASTER_V1 |
| **Konflikt** | DONE verlangt bestandenes Audit vor Fertigstellung. Feedback-Loop könnte Änderungen auslösen, die ein erneutes Audit nötig machen → potenziell endlose Schleife. |
| **Auswirkung** | Tasks könnten im "Audit → Feedback → Änderung → Re-Audit"-Zyklus hängen bleiben. |
| **Lösungsansatz** | Maximal 2 Audit-Zyklen pro Task definieren. Nach 2. Zyklus: Entscheidung durch Menschen. |
| **Eskalation** | Nicht eskaliert. Wird in AUDIT_MASTER_V1 aufgenommen. |
| **Erfasst am** | 2026-06-10 |

### K005: Memory-Pflicht vs. Agenten-Isolation

| Feld | Wert |
|------|------|
| **Status** | 🟢 MINOR |
| **Betroffene Regeln** | MEMORY_PFLICHT_V1 (Rang 4) ↔ Operational Constitution Prime Directive 1 (Kein Datenverlust) |
| **Konflikt** | MEMORY_PFLICHT verlangt zentrales Memory. Prime Directive 1 verlangt Persistenz vor neuer Transaktion. Wenn agentmemory ausfällt, dürfte laut PD1 keine neue Transaktion starten. Aber Recovery ohne Memory ist schwer. |
| **Auswirkung** | Bei agentmemory-Ausfall stoppt das gesamte System. |
| **Lösungsansatz** | Lokalen Cache als Fallback (Read-Only) plus separaten Recovery-Prozess. |
| **Eskalation** | Nicht eskaliert. Backup-Strategie für agentmemory definieren. |
| **Erfasst am** | 2026-06-10 |

---

## 4. Aufgelöste Konflikte

| ID | Konflikt | Lösung | Gelöst am |
|----|----------|--------|-----------|
| — | (Noch keine aufgelösten Konflikte) | | |

---

## 5. Konflikt-Monitoring

Jeder aktive Konflikt wird regelmäßig geprüft:

| Intervall | Aktion |
|-----------|--------|
| Beim Regelwerks-Update | Alle Konflikte auf Aktualität prüfen |
| Wöchentlich | MINOR-Konflikte reviewen |
| Monatlich | MAJOR-Konflikte auf Lösung priorisieren |
| Bei BREAKING | Sofort-Maßnahme, Eskalation |

---

## 6. Neuen Konflikt melden

Jeder Agent kann einen neuen Konflikt melden. Template:

```markdown
### K00X: [Kurzer Titel]

| Feld | Wert |
|------|------|
| Status | 🟡 MAJOR |
| Betroffene Regeln | [Regel A] ↔ [Regel B] |
| Konflikt | [Beschreibung] |
| Auswirkung | [Was passiert?] |
| Lösungsansatz | [Vorschlag] |
```

---

## 7. Änderungsprotokoll

| Datum | Version | Änderung | Autor |
|-------|---------|----------|-------|
| 2026-06-10 | 1.0.0 | Initiales Register — 5 aktive Konflikte | NeXify Governance |

---

*Ein Konflikt der nicht im Register steht, existiert nicht. Jeder Agent ist verpflichtet,
neue Konflikte zu melden.*
