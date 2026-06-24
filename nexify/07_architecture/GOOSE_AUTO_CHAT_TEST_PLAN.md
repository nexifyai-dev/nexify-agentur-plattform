# GOOSE_AUTO_CHAT Testplan

**Dokument:** GOOSE_AUTO_CHAT_TEST_PLAN.md  
**Version:** 1.0.0  
**Status:** Freigegeben  
**Stand:** 2026-06-10  
**Audit-Pflicht:** JA — Jede Änderung an diesem Dokument muss auditiert und versioniert werden.

---

## Inhaltsverzeichnis

1. [Dry-Run Testspezifikation](#1-dry-run-testspezifikation)
2. [Test-Session-Injection Spezifikation](#2-test-session-injection-spezifikation)
3. [Safe-Internal-Only Tests](#3-safe-internal-only-tests)
4. [Loop-Guard Tests](#4-loop-guard-tests)
5. [Observer Tests](#5-observer-tests)
6. [Recovery Tests](#6-recovery-tests)
7. [Akzeptanzkriterien für PRODUCTION_READY](#7-akzeptanzkriterien-für-production_ready)

---

## 1. Dry-Run Testspezifikation

### 1.1 Ziel

Dry-Run Tests validieren die gesamte Pipeline **ohne** tatsächliches Senden von Nachrichten an die Goose-CLI. Sie prüfen Kontext-Sammlung, Policy-Entscheidungen und Message-Building, ohne die Ausführungsebene zu berühren.

### 1.2 Testumgebung

- **Ausführung:** Lokal auf Hermes (Ebene A)
- **Goose-CLI:** Nicht erforderlich (wird simuliert)
- **Datenbank:** In-Memory SQLite (`:memory:`)
- **Kontext:** Test-Kontext aus JSON-Fixtures

### 1.3 Testfälle

#### TC-DR-001: Vollständiger Dry-Run-Durchlauf

| Feld | Wert |
|------|------|
| **ID** | TC-DR-001 |
| **Titel** | Vollständiger Dry-Run-Durchlauf aller Komponenten |
| **Vorbedingung** | System in IDLE → INIT → ACTIVE |
| **Testdaten** | Test-Kontext mit 3 vorausgegangenen Nachrichten |
| **Schritte** | 1. Context Collector sammelt Kontext<br>2. Policy Gate prüft (soll ALLOW)<br>3. Message Builder erstellt Prompt<br>4. **Keine** Übergabe an Injector<br>5. Observer erhält Dummy-Antwort |
| **Erwartet** | Kontext, Policy-Entscheidung und Prompt werden korrekt erzeugt |
| **Ergebnis** | ✅ / ❌ |
| **Audit** | JA |

#### TC-DR-002: Dry-Run mit Policy-REJECT

| Feld | Wert |
|------|------|
| **ID** | TC-DR-002 |
| **Titel** | Dry-Run mit Policy-REJECT prüfen |
| **Vorbedingung** | Rate-Limit auf 0 gesetzt (keine Nachrichten erlaubt) |
| **Testdaten** | Normaler Test-Kontext |
| **Schritte** | 1. Context Collector sammelt Kontext<br>2. Policy Gate prüft → REJECT wegen Rate-Limit<br>3. **Kein** Message Building<br>4. REJECT wird protokolliert |
| **Erwartet** | REJECT wird korrekt erkannt und protokolliert |
| **Ergebnis** | ✅ / ❌ |
| **Audit** | JA |

#### TC-DR-003: Dry-Run mit leerem Kontext

| Feld | Wert |
|------|------|
| **ID** | TC-DR-003 |
| **Titel** | Dry-Run mit leerem Kontext |
| **Vorbedingung** | Context Collector hat keine Daten |
| **Testdaten** | Leerer Kontext (alle Felder null/leer) |
| **Schritte** | 1. Context Collector sammelt → leerer Kontext<br>2. Policy Gate prüft → ALLOW (leerer Kontext ist gültig)<br>3. Message Builder erstellt Minimal-Prompt |
| **Erwartet** | System erzeugt gültigen Minimal-Prompt aus leerem Kontext |
| **Ergebnis** | ✅ / ❌ |
| **Audit** | JA |

#### TC-DR-004: Dry-Run-Kontext-Validierung

| Feld | Wert |
|------|------|
| **ID** | TC-DR-004 |
| **Titel** | Validierung des gesammelten Kontext-Schemas |
| **Vorbedingung** | System in ACTIVE |
| **Testdaten** | Kontext mit ungültigen Feldern (z. B. `session_id`=null) |
| **Schritte** | 1. Context Collector sammelt<br>2. Schema-Validierung prüft Pflichtfelder |
| **Erwartet** | Ungültiger Kontext wird mit Fehler gemeldet |
| **Ergebnis** | ✅ / ❌ |
| **Audit** | JA |

### 1.4 Dry-Run-Erfolgskriterien

- ✅ Alle 4 Testfälle bestanden
- ✅ Keine unerwarteten Exceptions
- ✅ Policy-Entscheidungen korrekt (ALLOW/REJECT)
- ✅ Message Builder erzeugt gültigen Prompt
- ✅ Protokollierung vollständig

---

## 2. Test-Session-Injection Spezifikation

### 2.1 Ziel

Testet die Fähigkeit, Test-Sessions in das System zu injizieren, um Szenarien zu simulieren, ohne auf echte Goose-CLI-Antworten warten zu müssen.

### 2.2 Testdatum-Struktur

Jede Test-Session wird als JSON-Datei bereitgestellt:

```json
{
  "session_id": "test-0001",
  "name": "Normaler Durchlauf",
  "description": "Standard-Session mit 3 Nachrichten",
  "initial_status": "RUNNING",
  "messages": [
    {
      "from": "system",
      "content": "Starte Session",
      "delay_ms": 0
    },
    {
      "from": "goose",
      "content": "Antwort 1: System bereit",
      "delay_ms": 100
    },
    {
      "from": "system",
      "content": "Frage: Status prüfen",
      "delay_ms": 500
    },
    {
      "from": "goose",
      "content": "Antwort 2: Alles OK",
      "delay_ms": 200
    }
  ],
  "expected_final_status": "RUNNING",
  "expected_message_count": 4
}
```

### 2.3 Testfälle

#### TC-SI-001: Normale Session-Injection

| Feld | Wert |
|------|------|
| **ID** | TC-SI-001 |
| **Titel** | Normale Session-Injection mit 5 Nachrichten |
| **Vorbedingung** | System in ACTIVE |
| **Testdaten** | `test_session_normal.json` — 5 Nachrichten, 200ms Verzögerung |
| **Schritte** | 1. Session via Injector starten<br>2. Nachrichten werden nacheinander verarbeitet<br>3. Observer sammelt Antworten<br>4. Session beenden |
| **Erwartet** | Alle 5 Nachrichten korrekt verarbeitet, Status → DONE |
| **Ergebnis** | ✅ / ❌ |
| **Audit** | JA |

#### TC-SI-002: Session mit Timeout

| Feld | Wert |
|------|------|
| **ID** | TC-SI-002 |
| **Titel** | Session-Injection mit künstlichem Timeout |
| **Vorbedingung** | System in ACTIVE, response_timeout=5s |
| **Testdaten** | `test_session_timeout.json` — Goose antwortet nach 10s nicht |
| **Schritte** | 1. Session starten<br>2. Nachricht senden<br>3. 5s warten → Timeout<br>4. Status → STUCK |
| **Erwartet** | Nach 5s Timeout, Status → STUCK, Retry wird gestartet |
| **Ergebnis** | ✅ / ❌ |
| **Audit** | JA |

#### TC-SI-003: Session mit Fehlerantwort

| Feld | Wert |
|------|------|
| **ID** | TC-SI-003 |
| **Titel** | Session-Injection mit fehlerhafter Goose-Antwort |
| **Vorbedingung** | System in ACTIVE |
| **Testdaten** | `test_session_error.json` — Goose antwortet mit HTTP 500 |
| **Schritte** | 1. Session starten<br>2. Nachricht senden<br>3. Goose antwortet mit Fehler<br>4. error_count++<br>5. Nach 5 Fehlern → ERROR |
| **Erwartet** | Fehler korrekt gezählt, nach 5 Fehlern Status → ERROR |
| **Ergebnis** | ✅ / ❌ |
| **Audit** | JA |

#### TC-SI-004: Massen-Injection (10 Sessions)

| Feld | Wert |
|------|------|
| **ID** | TC-SI-004 |
| **Titel** | Gleichzeitige Injection von 10 Test-Sessions |
| **Vorbedingung** | System in ACTIVE |
| **Testdaten** | 10 JSON-Dateien mit unterschiedlichen Szenarien |
| **Schritte** | 1. Alle 10 Sessions parallel starten<br>2. Observer verarbeitet alle Antworten<br>3. Alle Sessions bis zum Ende durchlaufen |
| **Erwartet** | Kein Datenverlust, keine Race-Conditions, alle Sessions korrekt verarbeitet |
| **Ergebnis** | ✅ / ❌ |
| **Audit** | JA |

### 2.4 Session-Injection-Erfolgskriterien

- ✅ Alle 4 Testfälle bestanden
- ✅ Keine Race-Conditions bei parallelen Sessions
- ✅ Timeouts werden korrekt erkannt
- ✅ Fehlerzähler funktioniert
- ✅ Max. Session-Limit (100) wird eingehalten

---

## 3. Safe-Internal-Only Tests

### 3.1 Ziel

Diese Tests validieren, dass das System **keine** Nachrichten an externe Systeme sendet. Alle Tests laufen isoliert in der lokalen Umgebung (Ebene A ohne Verbindung zu Ebene B).

### 3.2 Netzwerkisolation

```bash
# Test-Netzwerkisolation
# Alle Goose-CLI-Aufrufe werden auf localhost umgeleitet
export GOOSE_AUTO_CHAT_TEST_MODE=true
export GOOSE_CLI_ENDPOINT="http://localhost:9999"  # nicht erreichbar
export GOOSE_AUTO_CHAT_NETWORK_LOCKDOWN=true
```

### 3.3 Testfälle

#### TC-SI-001: Keine externen Verbindungen im Test-Modus

| Feld | Wert |
|------|------|
| **ID** | TC-SI-001 (Safe Internal) |
| **Titel** | Keine externen Netzwerkverbindungen im Test-Modus |
| **Vorbedingung** | `GOOSE_AUTO_CHAT_TEST_MODE=true`, Netzwerk-Lockdown aktiv |
| **Testdaten** | Normale Session-Daten |
| **Schritte** | 1. System starten mit Test-Mode<br>2. Session anlegen<br>3. Nachricht senden (soll scheitern, da kein goose-cli)<br>4. Prüfen: Keine Verbindung nach extern (nur localhost) |
| **Erwartet** | Keine Verbindung zu externen Hosts, Fehler wird lokal behandelt |
| **Ergebnis** | ✅ / ❌ |
| **Audit** | JA |

#### TC-SI-002: Localhost-Isolation

| Feld | Wert |
|------|------|
| **ID** | TC-SI-002 (Safe Internal) |
| **Titel** | Striktes Localhost-Only im Test-Modus |
| **Vorbedingung** | `GOOSE_AUTO_CHAT_TEST_MODE=true` |
| **Testdaten** | `tcpdump`-Capture aller Netzwerkverbindungen |
| **Schritte** | 1. `tcpdump` starten<br>2. System im Test-Modus ausführen<br>3. 10 Test-Sessions durchlaufen<br>4. `tcpdump` auswerten |
| **Erwartet** | Nur Verbindungen zu 127.0.0.1 oder ::1 |
| **Ergebnis** | ✅ / ❌ |
| **Audit** | JA |

#### TC-SI-003: Policy Gate ohne Netzwerk

| Feld | Wert |
|------|------|
| **ID** | TC-SI-003 (Safe Internal) |
| **Titel** | Policy Gate arbeitet ohne Netzwerk |
| **Vorbedingung** | Netzwerk deaktiviert (Air-Gap-Modus) |
| **Testdaten** | Test-Kontext |
| **Schritte** | 1. Netzwerk deaktivieren<br>2. Policy Gate ausführen<br>3. Prüfen: Policy Gate benötigt kein Netzwerk |
| **Erwartet** | Policy Gate arbeitet netzwerkunabhängig |
| **Ergebnis** | ✅ / ❌ |
| **Audit** | JA |

### 3.4 Safe-Internal-Erfolgskriterien

- ✅ Keine externen Verbindungen in Test-Mode
- ✅ Localhost-Only strikt eingehalten
- ✅ Policy Gate ohne Netzwerk funktionsfähig
- ✅ Alle Komponenten isoliert testbar

---

## 4. Loop-Guard Tests

### 4.1 Ziel

Der Loop-Guard verhindert Endlosschleifen, indem er erkennt, wenn das System wiederholt dieselbe Nachricht sendet oder in einer Schleife gefangen ist.

### 4.2 Loop-Guard-Konfiguration

| Parameter | Default | Beschreibung |
|-----------|---------|-------------|
| `loop_guard_max_identical` | 3 | Max. identische Nachrichten in Folge |
| `loop_guard_max_consecutive` | 10 | Max. aufeinanderfolgende gleiche Antworten |
| `loop_guard_window_sec` | 300 | Zeitfenster für Loop-Erkennung (5 min) |
| `loop_guard_similarity_threshold` | 0.9 | Ähnlichkeitsschwelle (0.0–1.0) |

### 4.3 Testfälle

#### TC-LG-001: Identische Nachrichten erkennen

| Feld | Wert |
|------|------|
| **ID** | TC-LG-001 |
| **Titel** | Erkennung von 3 identischen Nachrichten |
| **Vorbedingung** | System in ACTIVE, Loop-Guard aktiv |
| **Testdaten** | 5 identische Nachrichten: "Status prüfen" |
| **Schritte** | 1. Nachricht 1 senden → OK<br>2. Nachricht 2 senden (identisch) → OK<br>3. Nachricht 3 senden (identisch) → LOOP_DETECTED<br>4. Nachricht 4+5 werden blockiert |
| **Erwartet** | Nach 3 identischen Nachrichten wird LOOP_DETECTED ausgelöst |
| **Ergebnis** | ✅ / ❌ |
| **Audit** | JA |

#### TC-LG-002: Ähnliche Nachrichten erkennen (Fuzzy)

| Feld | Wert |
|------|------|
| **ID** | TC-LG-002 |
| **Titel** | Fuzzy-Erkennung ähnlicher Nachrichten |
| **Vorbedingung** | Similarity Threshold = 0.9 |
| **Testdaten** | Nachrichten mit >90% Ähnlichkeit:<br>"Bitte prüfe den Systemstatus"<br>"Bitte prüfe Status des Systems" |
| **Schritte** | 1. Nachricht 1: "Bitte prüfe den Systemstatus"<br>2. Nachricht 2: "Bitte prüfe Status des Systems"<br>3. Ähnlichkeitsprüfung → 0.92 > 0.9 → LOOP_DETECTED |
| **Erwartet** | Ähnliche Nachrichten werden als Loop erkannt |
| **Ergebnis** | ✅ / ❌ |
| **Audit** | JA |

#### TC-LG-003: Loop-Guard nach Fenster-Reset

| Feld | Wert |
|------|------|
| **ID** | TC-LG-003 |
| **Titel** | Loop-Guard setzt sich nach Zeitfenster zurück |
| **Vorbedingung** | Loop-Guard-Window = 300s |
| **Testdaten** | 2 identische Nachrichten, dann 5 Minuten warten, dann 2 weitere |
| **Schritte** | 1. Nachricht A senden (t=0s)<br>2. Nachricht A senden (t=1s)<br>3. Warten 300s<br>4. Nachricht A senden (t=301s)<br>5. Nachricht A senden (t=302s) |
| **Erwartet** | Nach Schritt 2: 2/3 Zähler. Nach 300s Reset. Nach Schritt 5: 2/3 Zähler, kein Loop |
| **Ergebnis** | ✅ / ❌ |
| **Audit** | JA |

#### TC-LG-004: Loop-Guard deaktiviert

| Feld | Wert |
|------|------|
| **ID** | TC-LG-004 |
| **Titel** | Loop-Guard kann deaktiviert werden |
| **Vorbedingung** | `loop_guard_max_identical=0` (deaktiviert) |
| **Testdaten** | 10 identische Nachrichten |
| **Schritte** | 1. 10× identische Nachricht senden<br>2. Prüfen: Alle werden durchgelassen |
| **Erwartet** | Alle 10 Nachrichten werden gesendet, kein Loop-Detected |
| **Ergebnis** | ✅ / ❌ |
| **Audit** | JA |

### 4.4 Loop-Guard-Erfolgskriterien

- ✅ Identische Nachrichten werden nach 3× erkannt
- ✅ Ähnliche Nachrichten werden per Fuzzy-Match erkannt
- ✅ Zeitfenster-Reset funktioniert korrekt
- ✅ Loop-Guard kann deaktiviert werden (für Testzwecke)
- ✅ Keine False-Positives bei unterschiedlichen Nachrichten

---

## 5. Observer Tests

### 5.1 Ziel

Testet die Observer-Komponente auf korrekte Analyse, Antwortstruktur und Fehlererkennung.

### 5.2 Testfälle

#### TC-OB-001: Erfolgreiche Antwort analysieren

| Feld | Wert |
|------|------|
| **ID** | TC-OB-001 |
| **Titel** | Analyse einer erfolgreichen Goose-Antwort |
| **Vorbedingung** | Observer ist aktiv |
| **Testdaten** | `{"content": "Alles OK", "status": "success", "tokens": 42}` |
| **Schritte** | 1. Antwort an Observer übergeben<br>2. Observer analysiert<br>3. Strukturiertes Feedback erzeugen |
| **Erwartet** | Feedback: `success=true`, `content="Alles OK"`, `tokens_used=42` |
| **Ergebnis** | ✅ / ❌ |
| **Audit** | JA |

#### TC-OB-002: Fehlerhafte Antwort analysieren

| Feld | Wert |
|------|------|
| **ID** | TC-OB-002 |
| **Titel** | Analyse einer fehlerhaften Goose-Antwort |
| **Vorbedingung** | Observer ist aktiv |
| **Testdaten** | `{"error": "timeout", "status": "error"}` |
| **Schritte** | 1. Fehlerhafte Antwort an Observer übergeben<br>2. Observer analysiert<br>3. Fehler-Feedback erzeugen |
| **Erwartet** | Feedback: `success=false`, Fehlerliste enthält "timeout" |
| **Ergebnis** | ✅ / ❌ |
| **Audit** | JA |

#### TC-OB-003: Token-Counting

| Feld | Wert |
|------|------|
| **ID** | TC-OB-003 |
| **Titel** | Korrektes Token-Counting der Antwort |
| **Vorbedingung** | Observer ist aktiv |
| **Testdaten** | Antwort mit 150 Wörtern |
| **Schritte** | 1. Antwort übergeben<br>2. Token-Zahl ermitteln<br>3. Mit erwarteter Token-Zahl vergleichen |
| **Erwartet** | Token-Zahl ≈ Wörter × 1.3 (innerhalb 10% Toleranz) |
| **Ergebnis** | ✅ / ❌ |
| **Audit** | JA |

#### TC-OB-004: Antwortzeit-Messung

| Feld | Wert |
|------|------|
| **ID** | TC-OB-004 |
| **Titel** | Messung der Antwortzeit |
| **Vorbedingung** | Observer ist aktiv |
| **Testdaten** | Künstliche Verzögerung von 1500ms |
| **Schritte** | 1. Antwort mit Verzögerung senden<br>2. Observer misst Dauer<br>3. Gemessene Dauer prüfen |
| **Erwartet** | `duration` ≈ 1500ms (±100ms Toleranz) |
| **Ergebnis** | ✅ / ❌ |
| **Audit** | JA |

#### TC-OB-005: Observer-Metriken

| Feld | Wert |
|------|------|
| **ID** | TC-OB-005 |
| **Titel** | Observer exportiert korrekte Metriken |
| **Vorbedingung** | Prometheus-Endpunkt aktiv |
| **Testdaten** | 10 erfolgreiche + 5 fehlerhafte Antworten |
| **Schritte** | 1. 15 Antworten verarbeiten<br>2. Prometheus-Endpunkt abfragen<br>3. Metriken prüfen |
| **Erwartet** | `goose_observer_success_total=10`, `goose_observer_error_total=5` |
| **Ergebnis** | ✅ / ❌ |
| **Audit** | JA |

### 5.3 Observer-Erfolgskriterien

- ✅ Korrekte Analyse erfolgreicher Antworten
- ✅ Korrekte Analyse fehlerhafter Antworten
- ✅ Token-Counting akkurat
- ✅ Antwortzeit-Messung präzise
- ✅ Metrik-Export funktioniert

---

## 6. Recovery Tests

### 6.1 Ziel

Testet die Wiederherstellungsmechanismen des Systems aus verschiedenen Fehlerzuständen.

### 6.2 Testfälle

#### TC-RC-001: Recovery aus STUCK (Timeout)

| Feld | Wert |
|------|------|
| **ID** | TC-RC-001 |
| **Titel** | Automatische Recovery aus STUCK nach Timeout |
| **Vorbedingung** | Session in RUNNING, response_timeout=5s |
| **Testdaten** | Goose antwortet nicht (simulierter Timeout) |
| **Schritte** | 1. Nachricht senden<br>2. 5s warten → Timeout → STUCK<br>3. Automatischer Retry startet<br>4. Beim 2. Versuch antwortet Goose |
| **Erwartet** | Nach Timeout → STUCK, Retry erfolgreich → RUNNING |
| **Ergebnis** | ✅ / ❌ |
| **Audit** | JA |

#### TC-RC-002: Recovery aus ERROR (Netzwerk)

| Feld | Wert |
|------|------|
| **ID** | TC-RC-002 |
| **Titel** | Automatische Recovery aus ERROR nach Netzwerkfehler |
| **Vorbedingung** | Session in RUNNING, Netzwerk kurzzeitig getrennt |
| **Testdaten** | ConnectionError beim Senden |
| **Schritte** | 1. Nachricht senden → ConnectionError → ERROR<br>2. Automatischer Retry nach 10s<br>3. Netzwerk wieder verbunden<br>4. Retry erfolgreich → RUNNING |
| **Erwartet** | Nach Netzwerkfehler → ERROR, nach 10s Retry → RUNNING |
| **Ergebnis** | ✅ / ❌ |
| **Audit** | JA |

#### TC-RC-003: Recovery aus ERROR (Inhalt)

| Feld | Wert |
|------|------|
| **ID** | TC-RC-003 |
| **Titel** | Kein automatischer Retry bei Inhaltsfehler |
| **Vorbedingung** | Session in RUNNING |
| **Testdaten** | Policy-REJECT (Inhaltsfehler) |
| **Schritte** | 1. Nachricht senden → Policy-REJECT → ERROR<br>2. Prüfen: Kein automatischer Retry<br>3. Status → DONE |
| **Erwartet** | Bei Inhaltsfehler kein Retry, Status → DONE |
| **Ergebnis** | ✅ / ❌ |
| **Audit** | JA |

#### TC-RC-004: Recovery nach System-Neustart

| Feld | Wert |
|------|------|
| **ID** | TC-RC-004 |
| **Titel** | Recovery nach System-Neustart |
| **Vorbedingung** | 3 Sessions in RUNNING, 2 in WAITING, 1 in STUCK |
| **Testdaten** | SQLite-Datenbank mit diesen Sessions |
| **Schritte** | 1. System simulieren (Datenbank laden)<br>2. `recover_sessions()` aufrufen<br>3. Prüfen: RUNNING-Sessions bleiben RUNNING<br>4. WAITING-Sessions bleiben WAITING<br>5. STUCK-Session wird retried → RUNNING |
| **Erwartet** | Recovery nach Neustart korrekt: RUNNING→RUNNING, WAITING→WAITING, STUCK→RUNNING |
| **Ergebnis** | ✅ / ❌ |
| **Audit** | JA |

#### TC-RC-005: Maximale Retry-Versuche

| Feld | Wert |
|------|------|
| **ID** | TC-RC-005 |
| **Titel** | Max. Retry-Versuche werden eingehalten |
| **Vorbedingung** | `retry_max_attempts=3` |
| **Testdaten** | Goose antwortet 4× nicht |
| **Schritte** | 1. Nachricht senden → Timeout → STUCK<br>2. Retry 1 → Timeout → STUCK<br>3. Retry 2 → Timeout → ERROR<br>4. Kein weiterer Retry<br>5. Status nach 3. Fehler → ERROR (nicht DONE) |
| **Erwartet** | Max. 3 Retry-Versuche, danach → ERROR |
| **Ergebnis** | ✅ / ❌ |
| **Audit** | JA |

#### TC-RC-006: Recovery mit Error-Count

| Feld | Wert |
|------|------|
| **ID** | TC-RC-006 |
| **Titel** | Error-Count-Limit führt zu DONE |
| **Vorbedingung** | `max_errors=5`, Session hat bereits 4 Fehler |
| **Testdaten** | 2 weitere Fehler auslösen |
| **Schritte** | 1. Fehler 5 → error_count=5, Status → ERROR<br>2. Recovery versucht<br>3. Fehler 6 → error_count=6 ≥ max_errors → DONE |
| **Erwartet** | Nach Erreichen von max_errors (5) → DONE |
| **Ergebnis** | ✅ / ❌ |
| **Audit** | JA |

### 6.3 Recovery-Erfolgskriterien

- ✅ Timeout-Recovery funktioniert (STUCK → RUNNING)
- ✅ Netzwerk-Recovery funktioniert (ERROR → RUNNING)
- ✅ Inhaltsfehler lösen keinen Retry aus
- ✅ System-Neustart-Recovery korrekt
- ✅ Maximale Retry-Versuche werden eingehalten
- ✅ Error-Count-Limit wird korrekt ausgewertet

---

## 7. Akzeptanzkriterien für PRODUCTION_READY

### 7.1 Definition of Done (DoD)

Das System gilt als **PRODUCTION_READY**, wenn **alle** folgenden Kriterien erfüllt sind:

### 7.2 Testabdeckung

| Kriterium | Mindestanforderung | Status |
|-----------|:------------------:|:------:|
| **Dry-Run Tests** | 4/4 bestanden | ❌ |
| **Session-Injection Tests** | 4/4 bestanden | ❌ |
| **Safe-Internal Tests** | 3/3 bestanden | ❌ |
| **Loop-Guard Tests** | 6/6 bestanden | ❌ |
| **Observer Tests** | 5/5 bestanden | ❌ |
| **Recovery Tests** | 6/6 bestanden | ❌ |
| **Gesamt** | **28/28 bestanden** | **0%** |

### 7.3 Qualitätskriterien

| Kriterium | Anforderung | Prüfmethode |
|-----------|-------------|-------------|
| **Code-Qualität** | Keine Critical/High-Sonar-Issues | SonarQube-Scan |
| **Testabdeckung** | ≥ 80% Code-Coverage | `pytest --cov` |
| **Sicherheit** | Keine Critical/High-Security-Issues | SAST/DAST-Scan |
| **Performance** | < 500ms Latenz pro Nachricht (P95) | Lasttest |
| **Stabilität** | < 0.1% Fehlerrate über 24h | Dauerlauf |
| **Dokumentation** | Alle 4 Dokumente versioniert | Manuelle Prüfung |
| **Audit-Trail** | Alle Statusänderungen geloggt | Stichprobe |

### 7.4 Sicherheitskriterien

| Kriterium | Anforderung | Prüfmethode |
|-----------|-------------|-------------|
| **Netzwerkisolation** | Keine externen Verbindungen im Test-Mode | tcpdump |
| **Datenverschlüsselung** | TLS 1.3 für Ebene A↔B | Zertifikatsprüfung |
| **Secrets-Handling** | Keine Secrets in Logs/Codes | Secret-Scan |
| **Zugriffskontrolle** | Policy Gate als einziger Einstieg | Code-Review |

### 7.5 Betriebskriterien

| Kriterium | Anforderung | Prüfmethode |
|-----------|-------------|-------------|
| **Monitoring** | Prometheus-Metriken verfügbar | Abfrage /metrics |
| **Logging** | Strukturiertes JSON-Logging | Log-Inspektion |
| **Alerting** | PagerDuty-Integration aktiv | Test-Alarm |
| **Backup** | SQLite-Backup alle 6h | Backup-Job prüfen |
| **Recovery** | Automatische Recovery nach Neustart | Neustart-Test |

### 7.6 Checkliste für Go-Live

```
☐  Alle 28 Testfälle bestanden
☐  Code-Abdeckung ≥ 80%
☐  Keine Critical/High-Sonar-Issues
☐  Keine Critical/High-Security-Issues
☐  Performance-Test bestanden (< 500ms P95)
☐  24h Dauerlauf ohne Fehler
☐  Alle 4 Dokumente versioniert (1.0.0)
☐  Audit-Trail aktiviert
☐  Prometheus-Metriken exportiert
☐  PagerDuty-Alarmierung aktiv
☐  TLS 1.3 konfiguriert
☐  SQLite-Backup eingerichtet
☐  Recovery nach Neustart getestet
☐  Sicherheits-Scan ohne Findings
☐  Deployment-Dokumentation abgeschlossen
☐  Rollback-Plan vorhanden
```

### 7.7 Freigabe-Matrix

| Rolle | Freigabe erforderlich? | Name | Datum |
|-------|:---------------------:|------|-------|
| **Entwicklung** | ✅ | | |
| **QA** | ✅ | | |
| **Security** | ✅ | | |
| **Operations** | ✅ | | |
| **Produktmanagement** | ✅ | | |

---

## 8. Testautomatisierung

### 8.1 Ausführung

```bash
# Alle Tests ausführen
cd /workspace/nexify/09_dispatcher/goose_auto_chat/
pytest tests/ -v --junitxml=reports/test-results.xml

# Nur Dry-Run Tests
pytest tests/ -v -k "dry_run" --junitxml=reports/dry-run.xml

# Nur Recovery Tests
pytest tests/ -v -k "recovery" --junitxml=reports/recovery.xml

# Mit Coverage
pytest tests/ -v --cov=src --cov-report=html --cov-report=term
```

### 8.2 Testbericht

Nach jeder Testausführung wird ein Bericht erstellt:

```json
{
  "test_run": "2026-06-10T19:00:00Z",
  "total": 28,
  "passed": 0,
  "failed": 0,
  "skipped": 0,
  "coverage": "0%",
  "duration_sec": 0,
  "production_ready": false
}
```

---

## 9. Versionshistorie

| Version | Datum | Autor | Änderung |
|---------|-------|-------|----------|
| 1.0.0 | 2026-06-10 | NeXify Dev | Initiale Version |

---

*Ende des Dokuments GOOSE_AUTO_CHAT_TEST_PLAN.md*  
*Audit-Pflicht: Dieses Dokument unterliegt der Audit-Pflicht gemäß NeXify QM-Richtlinie QM-007.*
