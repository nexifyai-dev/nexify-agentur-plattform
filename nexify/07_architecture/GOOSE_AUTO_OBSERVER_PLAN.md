# Goose Auto-Observer-Plan

| Feld | Wert |
|------|------|
| **Dokument** | GOOSE_AUTO_OBSERVER_PLAN.md |
| **Version** | 1.0.0 |
| **Sprache** | Deutsch |
| **Audit-Pflicht** | Ja |
| **Letzte Änderung** | 2026-06-10 |

---

## 1. Ziel

**Pascal kann ohne Eingabe beobachten.** Der Auto-Observer ermöglicht es, den Goose CLI Chat-Output in Echtzeit zu verfolgen, ohne dass Pascal manuell in die Session schauen muss. Der Observer ist Kernkomponente des Goose User-Chat Drivers (GUCD) und liefert die Rückmeldung für den Regelkreis.

---

## 2. Methoden – Übersicht

| Methode | Status | Latenz | Robustheit | Empfohlen für |
|---------|--------|--------|------------|---------------|
| **tmux capture-pane** | ✅ Verfügbar | ~200ms | Hoch | Primärmethode |
| **screen log** | ✅ Verfügbar | ~500ms | Mittel | Fallback |
| **pty-wrapper (ptyprocess)** | 📋 Geplant | ~50ms | Sehr hoch | Zukunft |
| **log-tail (Datei)** | ✅ Verfügbar | ~1000ms | Mittel | Audit/Evidence |
| **WebUI-Panel** | 📋 Geplant | ~100ms | Hoch | Visualisierung |

---

## 3. tmux-Integration

### 3.1 Basis-Befehl

```
tmux capture-pane -t <session-name> -p -S -<lines>
```

- `-t <session-name>`: Ziel-Session (z. B. `goose-cli-main`)
- `-p`: Output als plain text (keine Escape-Sequenzen)
- `-S -<lines>`: Letzte N Zeilen (standard: 50)

### 3.2 Implementierung

```python
class TmuxObserver:
    """
    Beobachtet eine tmux-Goose-Session und liefert Output.
    """
    
    def __init__(self, session_name: str, lines: int = 50, interval: float = 2.0):
        self.session_name = session_name
        self.lines = lines
        self.interval = interval
        self.last_output = ""
        self.status = "INIT"
    
    def capture(self) -> str:
        """Holt aktuellen Output aus der tmux-Session."""
        cmd = f"tmux capture-pane -t {self.session_name} -p -S -{self.lines}"
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        return result.stdout
    
    def get_status(self) -> str:
        """Ermittelt Status basierend auf Output."""
        output = self.capture()
        if not output or output == self.last_output:
            return "WAITING"
        if ">" in output[-5:] or "$" in output[-5:]:
            return "WAITING"
        if "Error" in output or "error" in output:
            return "ERROR"
        if "blocked" in output.lower():
            return "BLOCKED"
        return "RUNNING"
```

### 3.3 Status-Anzeige

| Status | Bedeutung | Farbe (Log) | Aktion |
|--------|-----------|-------------|--------|
| `RUNNING` | Goose CLI verarbeitet aktiv | 🟢 GRÜN | Warten |
| `WAITING` | Goose CLI wartet auf Eingabe | 🟡 GELB | Injektion möglich |
| `INJECTED` | Nachricht wurde gesendet | 🔵 BLAU | Output beobachten |
| `BLOCKED` | LoopGuard hat geblockt | 🔴 ROT | Log prüfen |
| `DONE` | Task abgeschlossen | ⚪ WEISS | Nächster Task |
| `ERROR` | Fehler in Goose CLI | 🟠 ORANGE | Fehleranalyse |
| `INIT` | Observer startet | ⚫ GRAU | Warten auf erste Daten |

### 3.4 Stop/Pause-Mechanismus

| Methode | Implementierung | Status |
|---------|----------------|--------|
| **SIGINT** | `os.kill(pid, signal.SIGINT)` | ✅ |
| **tmux send-keys** | `tmux send-keys -t <session> C-c` | ✅ |
| **GUI-Button** | WebUI-Panel mit Stop-Button | 📋 Geplant |
| **Graceful Stop** | Nachricht "exit" senden | ✅ |
| **Kill-Switch** | Config `driver.mode: OFF` setzen | ✅ |

**Implementierung des Stop-Mechanismus:**

```python
def stop_session(method: str = "sigint", session_name: str = None) -> bool:
    """Stoppt die aktuelle Session."""
    if method == "sigint":
        pid = get_session_pid(session_name)
        os.kill(pid, signal.SIGINT)
        return True
    elif method == "send-keys":
        subprocess.run(["tmux", "send-keys", "-t", session_name, "C-c"])
        return True
    elif method == "config":
        set_config("driver.mode", "PAUSED")
        return True
    return False
```

---

## 4. Log-Tail-Integration

### 4.1 sqlite3-Pollen

Der Observer pollt die SQLite-State-Datenbank für Status-Änderungen.

```sql
SELECT status, last_injection, last_output, error_count
FROM gucd_state
WHERE session_name = '<session-name>';
```

Poll-Intervall: 2 Sekunden.

### 4.2 Log-Format

```
[YYYY-MM-DD HH:MM:SS] [LEVEL] [KOMPONENTE] Nachricht
```

Beispiel:
```
[2026-06-10 19:19:00] [INFO] [OBSERVER] Status: WAITING (Session: goose-cli-main)
[2026-06-10 19:19:02] [DEBUG] [OBSERVER] Output: > Bitte warten...
[2026-06-10 19:19:04] [INFO] [INJECTOR] Injektion gesendet: [GUCD] continue
[2026-06-10 19:19:06] [INFO] [OBSERVER] Status: RUNNING (Session: goose-cli-main)
```

### 4.3 Audit-Trail

Jeder Status-Wechsel wird als Evidence-Eintrag gespeichert:

| Timestamp | Alter Status | Neuer Status | Auslöser |
|-----------|-------------|--------------|----------|
| 19:19:00 | INIT | WAITING | Observer-Start |
| 19:19:04 | WAITING | INJECTED | LoopGuard PASS |
| 19:19:06 | INJECTED | RUNNING | Output erkannt |
| 19:19:30 | RUNNING | WAITING | Prompt erkannt |

---

## 5. WebUI-Panel (Zukunft)

### 5.1 Funktionen
- Live-Output in Terminal-ähnlicher Ansicht
- Status-LED (Grün/Gelb/Rot)
- Stop/Pause-Button
- Letzte 5 Injektionen anzeigen
- Rate-Limit-Status (verbleibende Injektionen)

### 5.2 Technologie
- HTML/JS mit Server-Sent-Events (SSE)
- Kein externes Framework nötig
- Port: 8765 (konfigurierbar)

---

## 6. Fehlerbehandlung

| Fehler | Erkennung | Massnahme |
|--------|-----------|-----------|
| tmux-Session existiert nicht | `capture()` gibt leeren String | Versuche screen-Fallback |
| Permission denied | `subprocess.CalledProcessError` | Log + Status ERROR |
| Session disconnected | Kein Output für >30s | Reconnect-Versuch (3x) |
| Output zu gross | >100KB Output | Truncate auf 100KB |
| Observer hängt | Kein Update >60s | Watchdog-Thread restart |

---

## 7. Konfiguration

```yaml
observer:
  method: tmux                    # tmux | screen | pty | log | webui
  session_name: goose-cli-main
  lines: 50                       # Anzahl Zeilen im Capture
  poll_interval: 2.0              # Sekunden
  max_output_size: 102400         # Bytes (100KB)
  reconnect_attempts: 3
  watchdog_timeout: 60            # Sekunden
  log_level: INFO
```

---

*Ende des Observer-Plans. Version 1.0.0 – Audit-konform.*
