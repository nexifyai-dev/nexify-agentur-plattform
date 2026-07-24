# NeXify AI — Kill-Switch Emergency Stop
> ASI03 Privilege Abuse Prevention / ISO 42001 A.4 Human Oversight
> Stand: 2026-06-23 | Version: 1.0 | Owner: CTO

## Zweck
Sofortiger Not-Stopp aller Hermes-Agenten bei Fehlverhalten, Goal-Hijack oder Sicherheitsvorfall.

## Architektur

```
Pascal                         Watcher (Daemon)
  │                                │
  │ kill-switch stop               │ loop: prüft /tmp/kill-switch/stop
  │ ──────────────────►            │
  │                          ┌─────┴──────┐
  │                          │ STOP-FLAG  │
  │                          │  gefunden?  │
  │                          └─────┬──────┘
  │                                │ Ja
  │                                ▼
  │                    ┌───────────────────┐
  │                    │ 1. Hermes-PIDs    │
  │                    │    aus Datei kill │
  │                    │ 2. Alle hermes-   │
  │                    │    Processe kill  │
  │                    │ 3. Log + Exit     │
  │                    └───────────────────┘
```

## Commands

```bash
# Aktivieren (startet Watcher-Daemon):
kill-switch enable

# NOTSTOP (alle Agenten sofort beenden):
kill-switch stop

# Nach Notstop: Reset + neu starten:
kill-switch reset

# Deaktivieren:
kill-switch disable

# Status prüfen:
kill-switch status

# Letzte Ereignisse:
kill-switch log
```

## Status-Modi

| State | Bedeutung |
|-------|-----------|
| **ENABLED** | Watcher läuft, Stop-Flag wird überwacht |
| **STOPPED** | Stop ausgelöst — alle Agenten beendet |
| **DISABLED** | Kill-Switch aus — keine Überwachung |
| **NOT RUNNING** | Watcher nicht gestartet |

## Sicherheitslogik

- `stop` wird von Pascal aufgerufen → Watcher killt alle Hermes-Prozesse
- `stop` funktioniert auch ohne laufenden Watcher (direkter Kill)
- `reset` setzt Stop-Flag zurück + startet Watcher neu
- Jede Aktion wird geloggt unter `/tmp/kill-switch/log`
- Watcher läuft mit 1s Poll-Intervall

## Integration in systemd (optional)

```ini
[Unit]
Description=Kill-Switch Watcher für Hermes Agenten
After=network.target

[Service]
Type=forking
ExecStart=/home/hermeswebui/bin/kill-switch enable
ExecStop=/home/hermeswebui/bin/kill-switch disable
PIDFile=/tmp/kill-switch/watcher.pid
User=hermeswebui
Restart=on-failure

[Install]
WantedBy=default.target
```

## Test-Nachweis

```
ENABLE: KILL-SWITCH ENABLED — Watcher PID 19789 ✅
STATUS: State=ENABLED, Log=2 entries ✅
DISABLE: KILL-SWITCH DISABLED ✅
STATUS: State=DISABLED, Log=3 entries ✅
```

## Prompt-Integration

Jeder Agent muss im System-Prompt den Kill-Switch-Hinweis haben:
```
NOTFALL: Wenn du /tmp/kill-switch/stop siehst, stoppe sofort deine Arbeit.
```
