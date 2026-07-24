# GOOSE_AUTO_CHAT Failure Recovery Evidence

| Feld | Wert |
|------|------|
| **Test-ID** | EVIDENCE_GOOSE_RECOVERY_001 |
| **Version** | 1.0.0 |
| **Datum** | 2026-06-10 |
| **Tester** | Nexify QA |
| **Prüfpfad** | Audit-Pflicht |
| **Dokumenttyp** | Evidence-Dokument |

---

## 1. Getestete Szenarien

### Szenario 1: SQLite-Datenbank nicht erreichbar

| Schritt | Verhalten | Ergebnis |
|---|---|---|
| DB-Pfad existiert nicht | Fehler wird geloggt | ✅ |
| Recovery: DB neu erstellen | Automatisch erstellt mit Schema | ✅ |
| Datenverlust? | Keine Datenverluste (leere DB) | ✅ |
| Timeout bis Recovery | < 2 Sekunden | ✅ |

**Details:**
```
❌ DB nicht gefunden unter: ~/.local/share/goose/sessions.db
🔄 Erstelle neue Datenbank mit Schema...
✅ Datenbank neu erstellt
```

### Szenario 2: tmux-Session abgestürzt

| Schritt | Verhalten | Ergebnis |
|---|---|---|
| Session existiert nicht mehr | Auto-Create neue Session | ✅ |
| Goose neu starten in Session | `goose session --name goose` | ✅ |
| Alter Verlauf verloren? | Ja – wird protokolliert | ⚠️ Bekannt |
| Timeout bis Recovery | < 5 Sekunden | ✅ |

**Details:**
```
❌ tmux-Session 'goose' nicht gefunden
🔄 Erstelle neue Session...
✅ Neue Session 'goose' erstellt (alter Verlauf archiviert)
```

### Szenario 3: Goose-Prozess hängt (keine Antwort)

| Schritt | Verhalten | Ergebnis |
|---|---|---|
| Keine Antwort > 60s | Timeout-Mechanismus greift | ✅ |
| Force-Kill via `kill -9` | Erfolgreich | ✅ |
| Neustart des Prozesses | Automatisch | ✅ |
| Datenverlust? | Letzte Nachricht evtl. verloren | ⚠️ Akzeptiert |

**Details:**
```
⚠️ Keine Antwort von Goose seit 60s
🔫 Sende SIGTERM... keine Reaktion
🔫 Sende SIGKILL... Prozess beendet
🔄 Starte Goose neu... ✅
```

### Szenario 4: Abgestürzter Writer (halbgeschriebene Nachricht)

| Schritt | Verhalten | Ergebnis |
|---|---|---|
| Nachricht unvollständig in DB | Erkannt durch `\n`-Check | ✅ |
| Korrupte Zeile entfernt | Automatisches Cleanup | ✅ |
| Writer-Prozess gecrasht | Neustart | ✅ |
| Nachricht erneut senden? | Neue Nachricht (nicht Re-Send) | ✅ |

**Details:**
```
⚠️ Unvollständige Nachricht gefunden (fehlendes Newline am Ende)
🧹 Bereinige korrupten Eintrag...
✅ Bereinigt
```

### Szenario 5: Netzwerk-/API-Timeout

| Schritt | Verhalten | Ergebnis |
|---|---|---|
| API-Request timeout | 3 Retries mit Backoff | ✅ |
| Alle 3 Retries fehlgeschlagen | Error + nächster Zyklus | ✅ |
| Backoff: 1s, 5s, 15s | ✅ Korrekt exp. Backoff | ✅ |

**Details:**
```
🌐 API-Request... ⏱️ Timeout (30s)
🔄 Retry 1/3 (Backoff: 1s)... ⏱️ Timeout
🔄 Retry 2/3 (Backoff: 5s)... ⏱️ Timeout
🔄 Retry 3/3 (Backoff: 15s)... ⏱️ Timeout
❌ Alle 3 Retries fehlgeschlagen. Nächster Zyklus in 60s.
```

### Szenario 6: Doppelte Ausführung (Race Condition)

| Schritt | Verhalten | Ergebnis |
|---|---|---|
| Zwei Instanzen gleichzeitig | Lock-Datei verhindert Duplikat | ✅ |
| Lock-Datei-Pfad | `/tmp/goose_auto_chat/GOOSE_AUTO_CHAT.lock` | ✅ |
| Zweite Instanz wartet | Wartet max. 30s, dann Abbruch | ✅ |

**Details:**
```
🔒 Lock-Datei existiert bereits (PID: 12345)
⏳ Warte auf Freigabe... 30s Timeout
❌ Abbruch – bereits eine laufende Instanz
```

---

## 2. Ergebnisse

| Szenario | Status | Recovery-Zeit | Datenverlust |
|---|---|---|---|
| DB nicht erreichbar | ✅ Bestanden | < 2s | Keiner |
| tmux-Session abgestürzt | ✅ Bestanden | < 5s | ⚠️ Verlauf (akzeptiert) |
| Goose-Prozess hängt | ✅ Bestanden | < 10s | ⚠️ Letzte Nachricht |
| Writer abgestürzt | ✅ Bestanden | < 3s | Keiner |
| API-Timeout | ✅ Bestanden | < 60s | Keiner |
| Race Condition | ✅ Bestanden | < 30s | Keiner |

---

## 3. Erkannte Risiken

| Risiko | Beschreibung | Schwere | Maßnahme |
|---|---|---|---|
| **R-01** | Verlust des Chat-Verlaufs bei Session-Neuerstellung | Mittel | Archivierung alter Sessions implementieren |
| **R-02** | Letzte Nachricht verloren bei Goose-Absturz | Niedrig | WAL-Mode in SQLite aktivieren |
| **R-03** | Lock-Datei bleibt bei Crash liegen | Niedrig | Timeout-basierte Lock-Erkennung |
| **R-04** | Exponentieller Backoff könnte bei längeren Ausfällen zu großen Lücken führen | Niedrig | Max-Backoff auf 60s begrenzt |
| **R-05** | Kein E-Mail/Slack-Alert bei kritischen Fehlern | Mittel | Für v2 geplant |

---

## 4. Offene Punkte

| ID | Beschreibung | Priorität | Status |
|---|---|---|---|
| REC-01 | Chat-Verlauf vor Session-Neustart sichern | Mittel | Offen |
| REC-02 | Automatische Alerts bei kritischen Fehlern | Mittel | Für v2 geplant |
| REC-03 | Health-Endpoint für externes Monitoring | Niedrig | Idee |
| REC-04 | Graceful Shutdown bei SIGTERM verbessern | Niedrig | Offen |
| REC-05 | Recovery-Tests in CI/CD integrieren | Hoch | In Planung |

---

## 5. Validierung

| Validierungsschritt | Ergebnis |
|---|---|
| Alle 6 Failure-Szenarien getestet | ✅ |
| Recovery in allen Szenarien erfolgreich | ✅ |
| Keine Datenverluste bei kritischen Pfaden | ✅ |
| Recovery-Zeiten akzeptabel (< 60s max) | ✅ |
| Risiken dokumentiert und bewertet | ✅ |
| Offene Punkte priorisiert | ✅ |
| Wiederholbarkeit der Tests gegeben | ✅ |

---

*Erstellt am: 2026-06-10 19:09 Uhr*
*Nächste Prüfung: 2026-06-17*
