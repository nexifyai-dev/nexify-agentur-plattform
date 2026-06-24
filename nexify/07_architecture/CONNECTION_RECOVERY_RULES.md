# Connection Recovery Rules

**Version:** 1.0.0  
**Status:** Aktiv  
**Audit-Pflicht:** Ja  
**Letzte Aktualisierung:** 2026-06-10

---

## 1. Grundregeln

### Regel 1: Kein Laufabbruch bei Connection Loss

> **Ein Connection Loss darf NIEMALS zum Abbruch einer laufenden Aufgabe führen.**

- Der Auto-Driver pausiert und versucht automatisch die Wiederherstellung
- Keine manuelle Terminierung der Session ohne explizite Anweisung von Pascal
- Wiederaufnahme ist immer der Terminierung vorzuziehen

### Regel 2: Dateien persistieren BEVOR Response gesendet wird

> **Jede Datei-Änderung MUSS vor dem Senden der Response persistiert werden.**

```yaml
# Erzwungener Ablauf:
1. Änderung durchführen (write/edit/shell)
2. Änderung in Datei persistieren (write) – FALLS edit verwendet wurde
3. Ausgabe prüfen
4. ERST DANN Response an User senden
```

**Begründung:** Wenn der Connection Loss zwischen Schritt 3 und Schritt 4 auftritt, ist die Änderung trotzdem sicher im Dateisystem. Keine Daten verloren.

### Regel 3: Keine Doppelarbeit

> **Eine bereits bestätigte Aktion darf nicht wiederholt werden.**

- Vor jeder Aktion prüfen: Wurde diese bereits erfolgreich ausgeführt?
- Prüfkriterien: Datei existiert, Inhalt korrekt, Tool-Ausgabe vorhanden
- Ausnahme: `shell()` mit Timeout – hier ist Wiederholung erlaubt

---

## 2. Session-Recovery

### 2.1 Status aus agentmemory / State-Files wiederherstellen

```yaml
recovery_prozess:
  schritt_1: "Lade agentmemory – speichert Session-Status und laufende Tasks"
  schritt_2: "Lade state/*.json – falls vorhanden, ersetzt es agentmemory"
  schritt_3: "Prüfe Integrität: Sind alle referenzierten Dateien vorhanden?"
  schritt_4: "Stelle Session-Variablen und Kontext wieder her"
  schritt_5: "Setze Fortschrittszähler und Task-Queue zurück"
```

### 2.2 Letzte bestätigte Nachricht ermitteln

```yaml
letzte_bestaetigte_nachricht:
  quelle: "Chat-Verlauf (User-Chat) oder Conversation-Log"
  kriterien:
    - "Tool wurde aufgerufen"
    - "Tool hat erfolgreiche Ausgabe geliefert"
    - "Kein Fehler in stdout/stderr"
    - "Datei wurde geschrieben (wenn write/edit)"
  wiederaufnahme:
    - "Nach write/edit: Nächste Task in der Queue fortsetzen"
    - "Nach shell: Ausgabe erneut prüfen, dann fortsetzen"
    - "Während shell (Timeout): Befehl erneut ausführen"
```

### 2.3 Wiederholung vermeiden

| Szenario | Verhalten |
|---|---|
| Datei existiert und ist korrekt | Überspringen – als erledigt markieren |
| Datei existiert, ist aber inkorrekt | Erneut schreiben (alte Version überschreiben) |
| Datei existiert nicht | Neu erstellen (wie geplant) |
| Tool-Ausgabe vorhanden und erfolgreich | Als bestätigt markieren |
| Tool-Ausgabe vorhanden und fehlgeschlagen | Erneut versuchen (bis zu 3×) |

---

## 3. Technische Absicherung

### 3.1 tmux/screen-Wrapper

Empfohlene Konfiguration für tmux als Sitzungshalter:

```bash
# In .tmux.conf
set -g history-limit 50000
set -g detach-on-destroy off
set -g remain-on-exit on

# Start-Script für Goose-Sessions
#!/bin/bash
SESSION_NAME="nexify-$(date +%Y%m%d_%H%M%S)"
tmux new-session -d -s "$SESSION_NAME"
tmux send-keys -t "$SESSION_NAME" "cd /workspace/nexify" Enter
tmux send-keys -t "$SESSION_NAME" "goose run --auto-driver" Enter
echo "Session gestartet: $SESSION_NAME"
echo "Zugriff: tmux attach -t $SESSION_NAME"
```

### 3.2 Environment-Variable für Auto-Reconnect

```bash
# In .bashrc oder Start-Skript
export GOOSE_AUTO_RECONNECT=true       # Auto-Reconnect aktivieren
export GOOSE_RECONNECT_MAX=3           # Maximale Versuche
export GOOSE_RECONNECT_BACKOFF=5       # Start-Backoff in Sekunden
export GOOSE_HEARTBEAT_INTERVAL=10     # Heartbeat in Sekunden
export GOOSE_REQUEST_TIMEOUT=30        # Request-Timeout in Sekunden
export GOOSE_SESSION_PERSIST=always    # Session-Status immer persistieren
```

### 3.3 Logging-Standard

```bash
# Empfohlen: script für vollständige Session-Aufzeichnung
script -q -c "goose run --auto-driver" \
  /workspace/nexify/logs/session_$(date +%Y%m%d_%H%M%S).log

# ODER: tee für paralleles Logging
goose run --auto-driver 2>&1 | tee /workspace/nexify/logs/session_latest.log
```

---

## 4. Zuständigkeiten

### 4.1 Wer startet Recovery?

```yaml
recovery_start:
  primär: "System (Auto-Driver)"
    - "Startet automatisch bei Erkennung von Connection Loss"
    - "Führt max. 3 Reconnect-Versuche durch"
    - "Erstellt Status-Dokumentation"
  
  sekundär: "Pascal (manuell)"
    - "Wenn Auto-Recovery fehlschlägt"
    - "Bei unklarem Systemzustand"
    - "Bei Datenverlust oder Inkonsistenzen"
```

### 4.2 Aufgabenverteilung

| Rolle | Aufgabe | Werkzeug |
|---|---|---|
| **Auto-Driver** | Connection Loss erkennen | Heartbeat/Timeout |
| **Auto-Driver** | Status dokumentieren | `write()` → state/*.json |
| **Auto-Driver** | Auto-Reconnect (3 Versuche) | Konfigurierbarer Mechanismus |
| **Auto-Driver** | Wiederherstellung aus agentmemory | `load()` / Chat-Verlauf |
| **Pascal** | Manuelle Analyse | Chat-Interface |
| **Pascal** | Entscheidung über Recovery-Strategie | Chat-Interface |
| **Pascal** | Präventionsmaßnahmen umsetzen | Shell/Terminal |

---

## 5. Präventions-Regelwerk für künftige Sessions

### Regel P1: Session immer in tmux starten

> **Jede Goose-CLI-Session MUSS innerhalb einer tmux- oder screen-Session gestartet werden.**

- Ausnahme: Explizite Anweisung von Pascal
- Begründung: tmux überlebt SSH-Disconnect und erlaubt Wiederherstellung

### Regel P2: Heartbeat aktivieren

> **Heartbeat-Überwachung MUSS bei jeder Session aktiv sein.**

- Intervall: 10 Sekunden
- Timeout: 30 Sekunden
- Bei 3 aufeinanderfolgenden fehlenden Heartbeats → Connection Loss ausgelöst

### Regel P3: Status alle 5 Minuten persistieren

> **Der Session-Status muss mindestens alle 5 Minuten persistiert werden.**

- Speicherort: `/workspace/nexify/state/<SESSION_ID>.json`
- Inhalt: Laufende Aufgabe, Fortschritt, letzte Aktionen
- Trigger: Automatisch nach jeder abgeschlossenen Tool-Ausführung

### Regel P4: Datei-Änderungen vor Response

> **Keine Response darf gesendet werden, während ungespeicherte Datei-Änderungen existieren.**

- Automatische Prüfung vor jeder Response
- `write()` für editierte Dateien erzwingen
- Ausnahme: Reine Statusmeldungen ohne Datei-Änderung

### Regel P5: Keine Hintergrund-Tasks ohne Persistierung

> **Jeder laufende Prozess MUSS dokumentiert und persistiert sein, bevor eine Response gesendet wird.**

- `shell()`-Befehle protokollieren (Befehl, Startzeit, PID)
- Lange laufende Tasks in tmux-Fenster auslagern
- Bei Connection Loss: PID-Liste aus Logs rekonstruieren

---

## 6. Audit-Informationen

Dieses Dokument unterliegt der Audit-Pflicht. Jede Änderung muss versioniert und protokolliert werden.

**Prüfintervall:** Monatlich  
**Nächste Prüfung:** 2026-07-10  
**Verantwortlich für Prüfung:** Pascal
