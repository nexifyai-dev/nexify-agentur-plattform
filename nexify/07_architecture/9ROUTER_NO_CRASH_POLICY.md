# 9Router — No-Crash Policy (Erweitert)

> Stand: 2026-06-12
> Version: 1.1

## Neue Regel (v1.1)

**HTTP 200 mit leerem, malformed oder nicht parsebarem Body ist als Fehler zu behandeln, nicht als Erfolg.**

## Pflichtreaktion bei malformed HTTP 200

| Schritt | Aktion |
|---|---|
| 1 | Request-ID erfassen |
| 2 | Body-Länge erfassen |
| 3 | Content-Type erfassen |
| 4 | Modell erfassen |
| 5 | Provider erfassen |
| 6 | Kompression/Proxy/MITM-Status erfassen |
| 7 | Fallback-Modell testen |
| 8 | Agentenlauf nicht als DONE melden |
| 9 | Evidence schreiben |
| 10 | Brain-Eintrag erzeugen |

## Bestehende Regeln (v1.0)

- Kein Vollabsturz bei Provider-Fehler
- Fallback auf nächstes Modell
- Token-Saver deaktivieren bei wiederholten Fehlern
- Kein Proxy/MITM als Standardbetrieb
- Evidence bei jedem Fehler

## Auslöser

| Fehler | Action |
|---|---|
| Provider timeout → HTTP 502 | Fallback-Modell |
| Rate limit → HTTP 429 | Warten + Retry |
| Auth → HTTP 401 | Key-Rotation prüfen |
| **Malformed → HTTP 200 (leer/kaputt)** | **Fallback + Capture + Evidence (NEU)** |
