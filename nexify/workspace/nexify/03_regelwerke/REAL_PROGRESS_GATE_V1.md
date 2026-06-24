# REAL PROGRESS GATE V1

> **Status**: VERBINDLICH | **Scope**: NEXIFY_INTERNAL (REAL_PROGRESS)
> **Erstellt**: 2026-06-12 | **Version**: 1.0.0
> **Gültigkeit**: dauerhaft
> **Gate-Typ**: HART — Kein DONE_TRUE ohne Gate-Pass
> **Klassifikation**: intern

---

## 1. Zweck

Diese Gate-Regel stellt sicher, dass kein Task als DONE_TRUE (abgeschlossen) deklariert wird, ohne dass die tatsächliche Existenz der erstellten Artefakte durch Dateisystem-Prüfung verifiziert wurde. Sie verhindert fälschliche "erledigt"-Behauptungen.

---

## 2. Gate-Regel (bindend)

> **Kein DONE_TRUE ohne `find` + `wc` + `git diff`**

### 2.1 Pflichtprüfungen VOR DONE_TRUE-Deklaration

| Prüfung | Befehl | Erwartung |
|---------|--------|-----------|
| Datei-Existenz | `find /workspace/nexify -name "DATEINAME"` | Datei muss existieren |
| Datei-Grösse | `wc -c DATEI` | > 0 Bytes |
| Datei-Inhalt | `head -5 DATEI` | YAML-Frontmatter + Inhalt |
| Register-Status | `grep "MA-XXX" REGISTER.json` | Status = COMPLETED |
| Git-Änderung | `git diff --stat` | Änderungen sichtbar |
| Kein Symlink-Fake | `readlink -f DATEI` | Echte Datei, kein dangling Symlink |

### 2.2 Gate-Protokoll (bei jedem Task-Abschluss)

```text
GATE CHECK — {TASK-ID / CHANGE-ID}
────────────────────────────────────
Datum:              {YYYY-MM-DD HH:MM}
Task:               {Task-Beschreibung}
Behauptete Artefakte: {kommagetrennte Liste}

PRÜFUNG 1 — Datei-Existenz
  {Datei 1}: {EXISTIERT|FEHLT}
  {Datei 2}: {EXISTIERT|FEHLT}

PRÜFUNG 2 — Datei-Grösse
  {Datei 1}: {N} Bytes
  {Datei 2}: {N} Bytes

PRÜFUNG 3 — Inhalt
  {Datei 1}: {YAML + Inhalt OK|Fehler}
  {Datei 2}: {YAML + Inhalt OK|Fehler}

PRÜFUNG 4 — Register-Update
  {MA-ID}: {COMPLETED|PENDING}

PRÜFUNG 5 — Git-Diff
  {N} Dateien geändert
  {N} Einfügungen, {N} Löschungen

GATE-ERGEBNIS: {PASS|FAIL}
────────────────────────────────────
```

---

## 3. Gate-Durchsetzung

| Phase | Gate-Aktiv | Verantwortlich |
|-------|-----------|---------------|
| Task-Planung | Inaktiv (Planung erlaubt) | Systemmaster |
| Task-Ausführung | Inaktiv (Arbeiten erlaubt) | Systemmaster |
| Task-Abschluss | **AKTIV** — Muss passen | Systemmaster |
| Report-Erstellung | **AKTIV** — Muss passen | Systemmaster |
| Brain-Entry | Referenziert Gate-Ergebnis | Systemmaster |

---

## 4. Arten von DONE

| Status | Bedeutung | Gate erforderlich |
|--------|-----------|------------------|
| **DONE_TRUE** | Fertig + verifiziert + dokumentiert | ✅ JA |
| **DONE_CLAIMED** | Behauptet fertig, aber nicht verifiziert | ❌ (wird durch Gate zu DONE_TRUE oder FAIL) |
| **DONE_PARTIAL** | Teilweise fertig, Rest offen | ❌ (offene Punkte notieren) |
| **FAIL** | Gate nicht bestanden | ❌ (Nachbesserung erforderlich) |

---

## 5. Gate-Verstöße

| Verstoss | Konsequenz |
|----------|-----------|
| DONE_TRUE ohne Gate-Prüfung | Task gilt als DONE_CLAIMED — Nachprüfung erforderlich |
| Gate-Protokoll nicht ausgefüllt | Task gilt als nicht abgeschlossen |
| Bewusst falsche Datei-Existenz behauptet | Eskalation an Pascal |
| Register-Status nicht aktualisiert | Task gilt als PENDING |

---

## 6. Gate-Vorlage (Kurzform für schnelle Tasks)

```text
GATE: {TASK}
├── find:    {PASS|FAIL} — {Anzahl Dateien}
├── wc:      {PASS|FAIL} — {Bytes}
├── Inhalt:  {PASS|FAIL}
├── Register:{PASS|FAIL}
├── git diff:{PASS|FAIL} — {Stat}
└── ERGEBNIS:{PASS|FAIL}
```

---

## 7. Integration mit anderen Policies

| Policy | Bezug |
|--------|-------|
| CHANGE_MANAGEMENT_POLICY_V1 | Gate prüft Change-Dokumentation |
| NO_FULL_CRASH_POLICY_V1 | Gate stellt sicher, dass Changes nicht riskieren |
| DONE_REGEL_V1 | Erweitert DONE-Definition um Gate-Prüfung |

---

## 8. Änderungshistorie

| Version | Datum | Autor | Änderung |
|---------|-------|-------|----------|
| 1.0.0 | 2026-06-12 | Systemmaster | Initiale Fassung — Real Progress Gate |

---

*Ende REAL PROGRESS GATE V1*
