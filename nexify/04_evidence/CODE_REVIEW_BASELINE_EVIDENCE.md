# CODE REVIEW BASELINE EVIDENCE

> **Stand**: 2026-06-11 | **Template-Version**: 1.0 | **Dokumentiert durch**: Systemmaster

---

## 1. Code-Review-Status

| Aspekt | Status | Detail |
|---|---|---|
| **Review-Plugin** | ❌ NICHT INSTALLIERT | `hamelsmu/claude-review-loop` — Plugin nicht verfügbar |
| **Playwright-Plugin** | ❌ NICHT INSTALLIERT | `lackeyjb/playwright-skill` — Plugin nicht verfügbar |
| **Manueller Review-Fallback** | ✅ AKTIV | Systemmaster führt Code-Review selbst durch |
| **Review-Policy** | 🟢 ERSTELLT | Diese Datei + Policy-Verankerung |
| **Review-Evidence** | 🟢 VORBEREITET | Vorlage in dieser Datei |

---

## 2. Review-Prozess (Manueller Fallback)

Da kein Review-Plugin installiert werden konnte, gilt folgender manueller Fallback:

### Vor jeder Codeänderung

```text
1. Änderungsumfang definieren
2. Betroffene Dateien auflisten
3. Risiko einstufen (LOW/MEDIUM/HIGH/CRITICAL)
4. Testfälle definieren
5. Änderung durchführen
6. Änderung reviewen:
   a. Korrektheit prüfen
   b. Nebenwirkungen prüfen
   c. Style-Konsistenz prüfen
   d. Sicherheit prüfen
   e. Abhängigkeiten prüfen
7. Evidence schreiben
8. Bei Gate-pflichtig: Approval einholen
```

### Review-Checkliste

- [ ] Code kompiliert/läuft ohne Fehler
- [ ] Keine neuen Warnungen
- [ ] Keine Secrets im Code
- [ ] Keine hartcodierten Pfade
- [ ] Keine offensichtlichen Sicherheitslücken
- [ ] Tests vorhanden (oder Grund für fehlende Tests dokumentiert)
- [ ] Dokumentation aktualisiert
- [ ] Keine Breaking Changes ohne Migration
- [ ] Abwärtskompatibilität gewahrt
- [ ] Evidence geschrieben

---

## 3. Review-Evidence-Vorlage

```text
REVIEW-EVIDENCE
Review-ID:        R-{YYYYMMDD}-{NR}
Datum:            {YYYY-MM-DD}
Reviewer:         {Agent/Person}
Change-ID:        {CC-ID}

Betroffene Dateien:
  - {pfad/datei.xyz} — {Änderungsart}

Risiko-Level:     {LOW|MEDIUM|HIGH|CRITICAL}

Geprüft:
  - Korrektheit:   {PASS|FAIL|N/A}
  - Nebenwirkungen: {PASS|FAIL|N/A}
  - Style:         {PASS|FAIL|N/A}
  - Sicherheit:    {PASS|FAIL|N/A}
  - Abhängigkeiten: {PASS|FAIL|N/A}

Ergebnis:         {APPROVED|CHANGES_REQUESTED|REJECTED}

Anmerkungen:
  - {Anmerkung 1}
  - {Anmerkung 2}

Nächste Aktion:
  - {nächster Schritt}
```

---

## 4. Bekannte Einschränkungen

| Einschränkung | Auswirkung | Workaround |
|---|---|---|
| Kein automatischer Review-Loop | Manueller Review nötig | Systemmaster führt Review durch |
| Kein Playwright | Keine automatischen UI-Tests | Manuelle UI-Prüfung |
| Sub-Agenten haben keinen externen Review | Ergebnisse müssen manuell geprüft werden | Systemmaster reviewt Sub-Agenten-Output |
| Große Diffs schwer reviewbar | Erhöhtes Risiko | Änderungen in kleine Einheiten teilen |

---

## 5. Nächste Aktionen

- [ ] Review-Loop-Plugin erneut prüfen bei nächster Gelegenheit
- [ ] Manuellen Review-Prozess in CLAUDE.md verankern (wenn Promptmaster zustimmt)
- [ ] Review-Evidence-Vorlage in allen Reviews nutzen
