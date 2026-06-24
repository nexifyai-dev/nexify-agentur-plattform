# Goose User-Chat Driver – MVP-Plan

| Feld | Wert |
|------|------|
| **Dokument** | GOOSE_USER_CHAT_DRIVER_MVP_PLAN.md |
| **Version** | 1.0.0 |
| **Sprache** | Deutsch |
| **Audit-Pflicht** | Ja |
| **Letzte Änderung** | 2026-06-10 |

---

## Aktueller Status

| Kriterium | Wert |
|-----------|------|
| **Status** | `GOOSE_USER_CHAT_DRIVER_DRY_RUN_OK` |
| **Datum** | 2026-06-10 |
| **Version** | 1.0.0 |
| **Nächster Schritt** | Test-Injection in WAITING-Session vorbereiten |

### Erreicht in Dry-Run
- 6 Python-Module erstellt (session_watcher, user_chat_driver, cli_injector, output_observer, loop_guard, config)
- Config-Struktur definiert
- State-Management implementiert
- Session-Erkennung getestet
- Context-Loader validiert
- Policy-Gate logisch geprüft
- Loop-Guard-Regeln definiert
- Message-Builder implementiert
- Logging-Framework integriert

---

## Phasen-Plan

### Phase 1: Dry-Run ✅ (ERLEDIGT)
| Akzeptanzkriterium | Status |
|--------------------|--------|
| Alle Module sind erstellt | ✅ |
| Config wird geladen ohne Fehler | ✅ |
| State kann gelesen/geschrieben werden | ✅ |
| Logging funktioniert | ✅ |
| Keine Injektion in Produktion | ✅ |
| Dokumentation vollständig | ✅ |

### Phase 2: Test-Injection (SQLite) 🔜 NÄCHSTE

**Ziel:** Erste automatisierte Injektion in eine Goose CLI Session im WAITING-Status.

| Akzeptanzkriterium | Status |
|--------------------|--------|
| Session im WAITING-Status wird erkannt | ⬜ |
| PolicyGate erlaubt Injektion | ⬜ |
| LoopGuard gibt PASS | ⬜ |
| MessageBuilder erzeugt valide Nachricht (Prefix vorhanden) | ⬜ |
| Injector sendet Nachricht via tmux/screen | ⬜ |
| Observer registriert Ausgabe nach Injektion | ⬜ |
| Keine Nebenwirkungen auf andere Sessions | ⬜ |
| Evidence-Dokument wird aktualisiert | ⬜ |

**Testumgebung:** SQLite-Dummy-Goose-Session
**Risiko:** Gering – isolierte Testumgebung
**Dauer:** 1 Tag

### Phase 3: Beobachtungsmodus aktivieren (tmux/screen) 📋 GEPLANT

**Ziel:** Output-Observer ist aktiv und liest CLI-Output in Echtzeit.

| Akzeptanzkriterium | Status |
|--------------------|--------|
| tmux-Session wird korrekt erkannt | ⬜ |
| Output wird in Echtzeit gelesen | ⬜ |
| Status-Erkennung funktioniert (WAITING/RUNNING/BLOCKED) | ⬜ |
| Logs werden geschrieben | ⬜ |
| Observer läuft stabil > 1 Stunde | ⬜ |
| Kein Speicher-Leak | ⬜ |

**Testumgebung:** Reale tmux-Goose-Session (read-only)
**Risiko:** Mittel – Beobachtung könnte stören
**Dauer:** 2 Tage

### Phase 4: Sichere interne Fortsetzung 📋 GEPLANT

**Ziel:** Der Driver kann eine Goose CLI Session automatisch fortsetzen, wenn sie im WAITING-Status ist.

| Akzeptanzkriterium | Status |
|--------------------|--------|
| Automatische Fortsetzung nach Session-Pause | ⬜ |
| Korrekte Erkennung des letzten Prompts | ⬜ |
| Keine Endlos-Loops (LoopGuard greift) | ⬜ |
| Rate-Limits werden eingehalten | ⬜ |
| Stopp bei ERROR-Status | ⬜ |
| Graceful Shutdown bei SIGINT | ⬜ |

**Risiko:** Hoch – Endlos-Loop möglich ohne LoopGuard
**Dauer:** 3 Tage

### Phase 5: 24h-Nachweis 📋 GEPLANT

**Ziel:** Der Driver läuft 24 Stunden stabil ohne menschliches Eingreifen.

| Akzeptanzkriterium | Status |
|--------------------|--------|
| 24h Betrieb ohne Crash | ⬜ |
| Weniger als 5 WARN-Level-Events pro Stunde | ⬜ |
| 0 FATAL-Level-Events | ⬜ |
| Alle Injektionen protokolliert | ⬜ |
| Evidence nach 24h erstellt | ⬜ |
| LoopGuard hat korrekt geblockt (mind. 1x getestet) | ⬜ |

**Risiko:** Mittel – unerwartete Edge-Cases
**Dauer:** 1 Tag (24h kontinuierlich)

### Phase 6: Produktionsfreigabe 📋 GEPLANT

**Ziel:** Vollständige Freigabe für den Produktionseinsatz.

| Akzeptanzkriterium | Status |
|--------------------|--------|
| Alle Phasen 1-5 abgeschlossen | ⬜ |
| Dokumentation finalisiert | ⬜ |
| Disaster-Recovery getestet | ⬜ |
| Audit-Pflicht erfülllt (alle Entscheidungen nachvollziehbar) | ⬜ |
| Kill-Switch funktioniert | ⬜ |
| Rollback-Plan existiert | ⬜ |
| Freigabe durch Code-Review | ⬜ |

---

## Zeitplan (geschätzt)

| Phase | Dauer | Deadline | Status |
|-------|-------|----------|--------|
| Phase 1: Dry-Run | 2 Tage | 2026-06-09 | ✅ |
| Phase 2: Test-Injection | 1 Tag | 2026-06-11 | 🔜 |
| Phase 3: Beobachtung | 2 Tage | 2026-06-13 | 📋 |
| Phase 4: Fortsetzung | 3 Tage | 2026-06-16 | 📋 |
| Phase 5: 24h-Nachweis | 1 Tag | 2026-06-17 | 📋 |
| Phase 6: Produktion | 1 Tag | 2026-06-18 | 📋 |
| **Gesamt** | **10 Tage** | **2026-06-18** | 🟡 |

---

## Risiko-Matrix

| Risiko | Wahrscheinlichkeit | Impact | Massnahme |
|--------|-------------------|--------|-----------|
| Endlos-Loop im Chat | Mittel | Hoch | LoopGuard + Hard-Limit |
| Falsche Session erwischt | Niedrig | Hoch | Session-ID-Validierung |
| Rate-Limit Goose CLI | Mittel | Mittel | Config-Rate-Limits < Goose CLIs eigene Limits |
| Crash durch Output-Parsing | Mittel | Mittel | Try-Except + Logging |
| Mensch überschreibt Auto-Input | Niedrig | Mittel | Prefix-Prüfung |
| tmux-Session disconnected | Niedrig | Hoch | Reconnect-Logik |

---

*Ende des MVP-Plans. Version 1.0.0 – Audit-konform.*
