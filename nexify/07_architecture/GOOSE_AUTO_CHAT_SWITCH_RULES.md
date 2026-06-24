# GOOSE_AUTO_CHAT Schalter-Regeln

**Dokument:** GOOSE_AUTO_CHAT_SWITCH_RULES.md  
**Version:** 1.0.0  
**Status:** Freigegeben  
**Stand:** 2026-06-10  
**Audit-Pflicht:** JA — Jede Änderung an diesem Dokument muss auditiert und versioniert werden.

---

## Inhaltsverzeichnis

1. [Alle GOOSE_USER_CHAT_DRIVER_*-Status](#1-alle-goose_user_chat_driver_-status)
2. [Verhalten pro Status](#2-verhalten-pro-status)
3. [Übergangsdiagramm zwischen Status](#3-übergangsdiagramm-zwischen-status)
4. [Notfall-Stopp-Prozedur](#4-notfall-stopp-prozedur)
5. [Status-Tabelle](#5-status-tabelle)

---

## 1. Alle GOOSE_USER_CHAT_DRIVER_*-Status

### 1.1 Übersicht

Der `GOOSE_USER_CHAT_DRIVER` ist die zentrale Schalter-Komponente (Switch), die den Gesamtzustand des Goose Auto Chat Systems steuert. Er definiert, ob und wie das System Nachrichten senden darf.

| Status | Codename | Beschreibung | Priorität |
|--------|----------|-------------|:---------:|
| `GOOSE_USER_CHAT_DRIVER_IDLE` | IDLE | System ist gestartet, aber inaktiv | 0 (niedrigste) |
| `GOOSE_USER_CHAT_DRIVER_INIT` | INIT | Initialisierungsphase | 1 |
| `GOOSE_USER_CHAT_DRIVER_ACTIVE` | ACTIVE | Normalbetrieb — Nachrichten werden gesendet | 2 |
| `GOOSE_USER_CHAT_DRIVER_PAUSED` | PAUSED | Vorübergehend pausiert (z. B. Wartung) | 3 |
| `GOOSE_USER_CHAT_DRIVER_STOP` | STOP | Angehalten — keine Nachrichten | 4 |
| `GOOSE_USER_CHAT_DRIVER_ERROR` | ERROR | Fehlerzustand — sofortiger Stopp | 5 |
| `GOOSE_USER_CHAT_DRIVER_EMERGENCY_STOP` | EMERGENCY | Notfall-Stopp — alle Prozesse sofort beenden | 6 (höchste) |
| `GOOSE_USER_CHAT_DRIVER_KILL_SWITCH` | KILL | Kill-Switch — hartes Beenden aller Aktivitäten | 7 (absolut) |

### 1.2 Umgebungsvariablen

Jeder Status wird über eine Umgebungsvariable gesetzt und vom Switch-Monitor überwacht:

```bash
# Beispiel: Status setzen
export GOOSE_USER_CHAT_DRIVER_INIT=true
export GOOSE_USER_CHAT_DRIVER_ACTIVE=false
export GOOSE_USER_CHAT_DRIVER_PAUSED=false
export GOOSE_USER_CHAT_DRIVER_STOP=false
export GOOSE_USER_CHAT_DRIVER_ERROR=false
export GOOSE_USER_CHAT_DRIVER_EMERGENCY_STOP=false
export GOOSE_USER_CHAT_DRIVER_KILL_SWITCH=false
```

### 1.3 Präzedenzregel

**Wichtig:** Nur EIN Status kann gleichzeitig aktiv sein. Bei Konflikten gilt die höhere Priorität:

```
KILL_SWITCH (7) > EMERGENCY_STOP (6) > ERROR (5) > STOP (4) > PAUSED (3) > ACTIVE (2) > INIT (1) > IDLE (0)
```

Wenn mehrere Variablen auf `true` gesetzt sind, gewinnt der Status mit der höchsten Priorität. Ein Log-Eintrag wird erstellt.

---

## 2. Verhalten pro Status

### 2.1 `GOOSE_USER_CHAT_DRIVER_IDLE`

| Aspekt | Beschreibung |
|--------|-------------|
| **Bedeutung** | System läuft, aber keine Session aktiv. Wartet auf Start-Signal. |
| **Senden erlaubt?** | ❌ Nein |
| **Empfangen erlaubt?** | ❌ Nein |
| **Session-Manager** | Inaktiv — keine Sessions werden verarbeitet |
| **Observer** | Inaktiv |
| **Policy Gate** | Geschlossen — keine Prüfungen |
| **Übergang zu** | INIT (bei Start-Signal) |
| **Typische Dauer** | Unbegrenzt (Wartezustand) |

### 2.2 `GOOSE_USER_CHAT_DRIVER_INIT`

| Aspekt | Beschreibung |
|--------|-------------|
| **Bedeutung** | Initialisierungsphase. System prüft Konfiguration und Verbindungen. |
| **Senden erlaubt?** | ❌ Nein |
| **Empfangen erlaubt?** | ❌ Nein |
| **Session-Manager** | Startet, lädt Datenbank |
| **Observer** | Startet, prüft Verbindung |
| **Policy Gate** | Lädt Regeln, initialisiert |
| **Besonderheiten** | Health-Check wird durchgeführt (Goose-CLI-Erreichbarkeit) |
| **Dauer** | Max. 30s — bei Überschreitung → ERROR |
| **Übergang zu** | ACTIVE (bei Erfolg) oder ERROR (bei Fehler) |

### 2.3 `GOOSE_USER_CHAT_DRIVER_ACTIVE`

| Aspekt | Beschreibung |
|--------|-------------|
| **Bedeutung** | Normalbetrieb. Nachrichten werden regulär gesendet und empfangen. |
| **Senden erlaubt?** | ✅ Ja (durch Policy Gate geprüft) |
| **Empfangen erlaubt?** | ✅ Ja |
| **Session-Manager** | Voll aktiv — alle Status-Transitionen möglich |
| **Observer** | Voll aktiv — analysiert alle Antworten |
| **Policy Gate** | Offen — führt alle Prüfungen durch |
| **Besonderheiten** | Einziger Status, in dem Nachrichten gesendet werden dürfen |
| **Übergang zu** | PAUSED (bei Pause), STOP (bei Beendigung), ERROR (bei Fehler) |

### 2.4 `GOOSE_USER_CHAT_DRIVER_PAUSED`

| Aspekt | Beschreibung |
|--------|-------------|
| **Bedeutung** | Vorübergehende Pause (z. B. Wartungsfenster, manuelle Unterbrechung). |
| **Senden erlaubt?** | ❌ Nein |
| **Empfangen erlaubt?** | ❌ Nein |
| **Session-Manager** | Sessions bleiben im aktuellen Status (eingefroren) |
| **Observer** | Pausiert |
| **Policy Gate** | Geschlossen |
| **Besonderheiten** | Alle aktiven Sessions werden eingefroren, aber nicht beendet |
| **Typische Dauer**| Minuten bis Stunden (manuelle Fortsetzung) |
| **Übergang zu** | ACTIVE (bei Resume), STOP (bei Abbruch), ERROR (bei Fehler während Pause) |

### 2.5 `GOOSE_USER_CHAT_DRIVER_STOP`

| Aspekt | Beschreibung |
|--------|-------------|
| **Bedeutung** | Geplantes Anhalten. Alle Sessions werden sauber beendet. |
| **Senden erlaubt?** | ❌ Nein |
| **Empfangen erlaubt?** | ❌ Nein |
| **Session-Manager** | Beendet alle aktiven Sessions → DONE |
| **Observer** | Verarbeitet letzte Antworten |
| **Policy Gate** | Geschlossen |
| **Besonderheiten** | Graceful Shutdown — laufende Nachrichten werden noch empfangen |
| **Dauer** | Max. 60s — bei Überschreitung → EMERGENCY_STOP |
| **Übergang zu** | IDLE (nach erfolgreichem Stop), EMERGENCY_STOP (bei Timeout) |

### 2.6 `GOOSE_USER_CHAT_DRIVER_ERROR`

| Aspekt | Beschreibung |
|--------|-------------|
| **Bedeutung** | Fehlerzustand. System hat einen nicht behebbaren Fehler erkannt. |
| **Senden erlaubt?** | ❌ Nein |
| **Empfangen erlaubt?** | ❌ Nein |
| **Session-Manager** | Alle Sessions → ERROR |
| **Observer** | Stoppt |
| **Policy Gate** | Geschlossen |
| **Besonderheiten** | Automatischer Recovery-Versuch nach 60s (max. 3×) |
| **Dauer** | Max. 3 Versuche à 60s, dann → STOP |
| **Übergang zu** | INIT (bei Recovery), STOP (nach erfolgloser Recovery) |

### 2.7 `GOOSE_USER_CHAT_DRIVER_EMERGENCY_STOP`

| Aspekt | Beschreibung |
|--------|-------------|
| **Bedeutung** | Notfall-Stopp. Alle Prozesse werden sofort beendet. |
| **Senden erlaubt?** | ❌ Nein — sofortiger Abbruch |
| **Empfangen erlaubt?** | ❌ Nein |
| **Session-Manager** | Alle Sessions → DONE (ohne Cleanup) |
| **Observer** | Sofortiger Stopp |
| **Policy Gate** | Sofort geschlossen |
| **Besonderheiten** | SIGTERM an alle Subprozesse, nach 5s SIGKILL |
| **Dauer** | < 10s |
| **Übergang zu** | IDLE (nach manuellem Reset), KILL_SWITCH (wenn nötig) |

### 2.8 `GOOSE_USER_CHAT_DRIVER_KILL_SWITCH`

| Aspekt | Beschreibung |
|--------|-------------|
| **Bedeutung** | Härtester Stopp. Beendet alle Goose-Prozesse auf Systemebene. |
| **Senden erlaubt?** | ❌ Nein — absolut |
| **Empfangen erlaubt?** | ❌ Nein |
| **Session-Manager** | Wird terminiert |
| **Observer** | Wird terminiert |
| **Policy Gate** | Wird terminiert |
| **Besonderheiten** | `kill -9` auf alle Goose-CLI-Prozesse. System muss manuell neugestartet werden. |
| **Dauer** | < 2s |
| **Übergang zu** | Nur via System-Neustart → INIT |

---

## 3. Übergangsdiagramm zwischen Status

### 3.1 Vollständiges Zustandsdiagramm

```
                                  +-----------+
                                  |   IDLE    |
                                  +-----+-----+
                                        │
                                   start│
                                        ▼
                                  +-----------+
          ┌───────────────────────┤   INIT    ├───────────────────────┐
          │                       +-----+-----+                       │
          │                             │                             │
          │                        ok   │   fail                      │
          │                             ▼                             │
          │                       +-----------+                       │
          │          ┌────────────┤  ACTIVE   │                       │
          │          │            +-----+-----+                       │
          │          │                  │                             │
          │          │            ┌─────┴──────┐                      │
          │          │            │            │                      │
          │          │        pause│         error│                   │
          │          │            ▼            ▼                      │
          │          │     +-----------+  +-----------+               │
          │          │     │  PAUSED   │  │  ERROR    │              │
          │          │     +-----+-----+  +-----+-----+              │
          │          │           │               │                    │
          │          │      resume│         recover│                  │
          │          │           │               │                    │
          │          │           ▼               │                    │
          │          │     +-----------+         │                   │
          │          │     │  ACTIVE   │◄────────┘                   │
          │          │     +-----------+                              │
          │          │                                                │
          │          │              +-----------+                     │
          │          └──────────────┤   STOP    │◄────────────────────┘
          │                         +-----+-----+
          │                               │
          │                          done │  timeout
          │                               ▼
          │                         +-----------+
          │                         │   IDLE    │
          │                         +-----------+
          │
          │  emergency_stop von jedem Status:
          │
          │  +-------------------+      +-------------------+
          │  │ BELIEBIGER STATUS │─────▶│ EMERGENCY_STOP    │
          │  +-------------------+      +---------+---------+
          │                                         │
          │                                    reset│
          │                                         ▼
          │                                   +-----------+
          │                                   │   IDLE    │
          │                                   +-----------+
          │
          │  kill_switch von jedem Status:
          │
          │  +-------------------+      +-------------------+
          │  │ BELIEBIGER STATUS │─────▶│   KILL_SWITCH     │
          │  +-------------------+      +-------------------+
          │                                         │
          │                                    restart│ (manuel!
          │                                         ▼
          │                                   +-----------+
          │                                   │   INIT    │
          │                                   +-----------+
```

### 3.2 Erlaubte Übergänge (Tabelle)

| Von \ Nach | IDLE | INIT | ACTIVE | PAUSED | STOP | ERROR | EMERGENCY | KILL |
|------------|:----:|:----:|:------:|:------:|:----:|:-----:|:---------:|:----:|
| **IDLE** | — | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **INIT** | ❌ | — | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **ACTIVE** | ❌ | ❌ | — | ✅ | ✅ | ✅ | ✅ | ✅ |
| **PAUSED** | ❌ | ❌ | ✅ | — | ✅ | ✅ | ✅ | ✅ |
| **STOP** | ✅ | ❌ | ❌ | ❌ | — | ❌ | ✅ | ✅ |
| **ERROR** | ❌ | ✅ | ❌ | ❌ | ✅ | — | ✅ | ✅ |
| **EMERGENCY** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | — | ✅ |
| **KILL** | ❌ | ✅ (via Restart) | ❌ | ❌ | ❌ | ❌ | ❌ | — |

### 3.3 Übergangsbedingungen

| Übergang | Bedingung | Aktion |
|----------|-----------|--------|
| IDLE → INIT | System-Start oder manuelles `start` | Konfiguration laden |
| INIT → ACTIVE | Health-Check erfolgreich | Policy Gate öffnen |
| INIT → ERROR | Health-Check fehlgeschlagen (30s Timeout) | Fehler loggen |
| ACTIVE → PAUSED | Manuelles `pause` oder Wartungsfenster | Sessions einfrieren |
| ACTIVE → STOP | Manuelles `stop` oder Shutdown-Signal | Graceful Shutdown |
| ACTIVE → ERROR | Systemfehler (z. B. DB-Verbindung verloren) | Fehlerbehandlung |
| PAUSED → ACTIVE | Manuelles `resume` | Sessions auftauen |
| PAUSED → STOP | Manuelles `stop` während Pause | Sessions beenden |
| PAUSED → ERROR | Fehler während Pause (z. B. Speicher voll) | Fehlerbehandlung |
| STOP → IDLE | Alle Sessions beendet | System zurücksetzen |
| STOP → EMERGENCY | Timeout (60s) beim Stop | Härtefall |
| ERROR → INIT | Recovery erfolgreich | Neustart der Komponenten |
| ERROR → STOP | Recovery nach 3 Versuchen fehlgeschlagen | System beenden |
| * → EMERGENCY | Notfall (manuell oder automatisch) | Sofort-Stopp |
| * → KILL | Kill-Switch aktiviert | Härtester Stopp |
| EMERGENCY → IDLE | Manueller Reset | System zurücksetzen |
| KILL → INIT | Manueller System-Neustart | Kompletter Neustart |

---

## 4. Notfall-Stopp-Prozedur

### 4.1 Auslöser für Notfall-Stopp

| Ereignis | Automatisch? | Schwelle |
|----------|:-----------:|----------|
| Kritischer Systemfehler (OOM, Kernel-Panic) | ✅ | Sofort |
| Mehr als 10 Sessions gleichzeitig in ERROR | ✅ | >10 Sessions |
| Goose-CLI-Absturz in 3 aufeinanderfolgenden Versuchen | ✅ | 3× |
| Policy-Verletzung (Sensibele-Daten-Leak erkannt) | ✅ | 1× |
| Rate-Limit-Überschreitung um >500% | ✅ | >50 Msg/min |
| Manueller Emergency-Stop via Hermes-Admin | ❌ | Admin-Entscheidung |
| Sicherheitsvorfall (IDS/IPS-Alarm) | ✅ | Externes Signal |

### 4.2 Notfall-Stopp-Ablauf

```
Phase 1: DETEKTION (0-1s)
─────────────────────────
  1. Auslöser wird erkannt
  2. GOOSE_USER_CHAT_DRIVER_EMERGENCY_STOP=true
  3. Log-Eintrag: "EMERGENCY_STOP triggered by: <Grund>"
  4. Admin-Benachrichtigung (PagerDuty/Alarm)

Phase 2: STOP (1-10s)
──────────────────────
  5. Policy Gate sofort schließen
  6. Alle aktiven Nachrichten abbrechen
  7. Injector: SIGTERM an alle Goose-CLI-Prozesse
  8. Session-Manager: Alle Sessions → DONE
  9. Observer: Letzte Daten sichern, dann stoppen

Phase 3: CLEANUP (10-30s)
──────────────────────────
  10. Nach 5s: SIGKILL an alle noch laufenden Prozesse
  11. Datenbank-Transaktionen abschließen
  12. Logs finalisieren
  13. Metriken exportieren (Prometheus: goose_emergency_stop_total++)

Phase 4: RECOVERY (manuell)
────────────────────────────
  14. Admin: Ursache analysieren
  15. Admin: System-Health prüfen
  16. Admin: GOOSE_USER_CHAT_DRIVER_EMERGENCY_STOP=false
  17. Admin: System neustarten → INIT → ACTIVE
```

### 4.3 Kill-Switch-Prozedur

Der Kill-Switch ist die letzte Eskalationsstufe und sollte nur in absoluten Notfällen verwendet werden.

```bash
# Kill-Switch aktivieren
export GOOSE_USER_CHAT_DRIVER_KILL_SWITCH=true

# Was passiert:
# 1. pgrep -f "goose" | xargs kill -9
# 2. Alle Session-Manager-Prozesse werden terminiert
# 3. Alle Datenbank-Transaktionen werden verworfen
# 4. System ist nicht mehr funktionsfähig
# 5. Manueller Neustart erforderlich
```

**Warnung:** Der Kill-Switch kann zu Datenverlust führen. Nur verwenden, wenn:
- Ein Sicherheitsvorfall vorliegt (Data Leak, unbefugter Zugriff)
- Das System auf keine andere Weise stoppbar ist
- Ein EMERGENCY_STOP nicht ausgereicht hat

### 4.4 Automatische Notfall-Stopp-Regeln

| Regel-ID | Bedingung | Aktion | Automatisch? |
|----------|-----------|--------|:------------:|
| E01 | System-Error (OOM) | → EMERGENCY_STOP | ✅ |
| E02 | >10 Sessions in ERROR | → EMERGENCY_STOP | ✅ |
| E03 | Goose-CLI 3× abgestürzt | → EMERGENCY_STOP | ✅ |
| E04 | Policy-Verletzung erkannt | → EMERGENCY_STOP | ✅ |
| E05 | Rate-Limit >500% überschritten | → EMERGENCY_STOP | ✅ |
| E06 | STOP-Timeout (60s) | → EMERGENCY_STOP | ✅ |
| E07 | Sicherheitsvorfall (extern) | → EMERGENCY_STOP | ✅ |
| E08 | Manueller Admin-Befehl | → EMERGENCY_STOP | ❌ |
| E09 | EMERGENCY_STOP fehlgeschlagen (10s) | → KILL_SWITCH | ✅ |
| E10 | Manuelle Kill-Anweisung | → KILL_SWITCH | ❌ |

---

## 5. Status-Tabelle

### 5.1 Vollständige Status-Matrix

| Status | Code | Priorität | Senden | Empfangen | Session aktiv | Policy Gate | Automatisch erreichbar | Manuell erreichbar |
|--------|:----:|:---------:|:------:|:---------:|:-------------:|:-----------:|:---------------------:|:------------------:|
| **IDLE** | `00` | 0 | ❌ | ❌ | ❌ | Geschlossen | ✅ (nach STOP) | ✅ |
| **INIT** | `01` | 1 | ❌ | ❌ | ❌ (Start) | Wird geladen | ✅ (nach Start) | ✅ |
| **ACTIVE** | `02` | 2 | ✅ | ✅ | ✅ | Offen | ✅ (nach INIT) | ✅ |
| **PAUSED** | `03` | 3 | ❌ | ❌ | Eingefroren | Geschlossen | ❌ | ✅ |
| **STOP** | `04` | 4 | ❌ | ❌ | Wird beendet | Geschlossen | ✅ (manuell) | ✅ |
| **ERROR** | `05` | 5 | ❌ | ❌ | Alle → ERROR | Geschlossen | ✅ (bei Fehler) | ✅ |
| **EMERGENCY** | `06` | 6 | ❌ | ❌ | Alle → DONE | Geschlossen | ✅ (bei Notfall) | ✅ |
| **KILL** | `07` | 7 | ❌ | ❌ | Terminiert | Terminiert | ✅ (automatisch) | ✅ |

### 5.2 Status-spezifische Umgebungsvariablen

| Variable | Typ | Default | Beschreibung |
|----------|:---:|:-------:|-------------|
| `GOOSE_USER_CHAT_DRIVER_IDLE` | bool | `true` | System im Leerlauf |
| `GOOSE_USER_CHAT_DRIVER_INIT` | bool | `false` | Initialisierung läuft |
| `GOOSE_USER_CHAT_DRIVER_ACTIVE` | bool | `false` | Normalbetrieb |
| `GOOSE_USER_CHAT_DRIVER_PAUSED` | bool | `false` | Pause aktiv |
| `GOOSE_USER_CHAT_DRIVER_STOP` | bool | `false` | Stopp eingeleitet |
| `GOOSE_USER_CHAT_DRIVER_ERROR` | bool | `false` | Fehlerzustand |
| `GOOSE_USER_CHAT_DRIVER_EMERGENCY_STOP` | bool | `false` | Notfall-Stopp |
| `GOOSE_USER_CHAT_DRIVER_KILL_SWITCH` | bool | `false` | Kill-Switch |

### 5.3 Status-Überwachung

Der Switch-Monitor prüft alle 500ms die Umgebungsvariablen auf Änderungen:

```python
def monitor_switch():
    """Überwacht GOOSE_USER_CHAT_DRIVER_* Variablen."""
    while True:
        for status in SWITCH_PRIORITY_ORDER:
            if os.getenv(f"GOOSE_USER_CHAT_DRIVER_{status.name}") == "true":
                if current_status != status:
                    transition_to(status)
                break
        time.sleep(0.5)
```

### 5.4 Status-Protokollierung

Jede Statusänderung wird protokolliert:

```json
{
  "timestamp": "2026-06-10T19:00:00.000Z",
  "event": "SWITCH_TRANSITION",
  "from": "ACTIVE",
  "to": "PAUSED",
  "reason": "Wartungsfenster (geplant 22:00-23:00)",
  "initiator": "admin@nexify",
  "session_count": 12
}
```

---

## 6. Versionshistorie

| Version | Datum | Autor | Änderung |
|---------|-------|-------|----------|
| 1.0.0 | 2026-06-10 | NeXify Dev | Initiale Version |

---

*Ende des Dokuments GOOSE_AUTO_CHAT_SWITCH_RULES.md*  
*Audit-Pflicht: Dieses Dokument unterliegt der Audit-Pflicht gemäß NeXify QM-Richtlinie QM-007.*
