# P0-A1: System-Prompt-Integritätscheck für CEO Agent
> ASI01 Goal Hijack — System-Prompt-Verifikation
> Owner: CTO | Deadline: 7 Tage | Stand: 2026-06-23

## Ziel
Verhindern Goal Hijack: System-Prompt darf unbemerkt geändert werden → Agent folgt falschem Ziel.
Lösung: **SHA256-Signing** + **vor jedem Turn prüfen, ob Prompt noch original ist**.

## Systemzustand
- Agenten-Seele: `/workspace/nexify/memory/AGENTEN_SEELE_NEXIFY_CEO_RALPH_LOOP.md`
- Aktueller SHA256: `c556b827eba37f47ccd6871bbc6186c41fbc02389862e144496fc75ca26c8613`
- Größe: 10.999 Bytes
- Geladen in Hermes via `system_prompt`-Dateireferenz im Profile
- Kein Integritätscheck existiert aktuell

## Anforderungen

### 1. Prompt-Signing
```bash
# Bei Deployment/Genehmigung eines neuen Prompts:
sha256sum /workspace/nexify/memory/AGENTEN_SEELE_NEXIFY_CEO_RALPH_LOOP.md > /workspace/nexify/memory/AGENTEN_SEELE_NEXIFY_CEO_RALPH_LOOP.sha256
# Gespeicherter Hash = Referenz für Verifikation
```

### 2. Prompt-Verifikation (vor jedem CEO-Start)
```bash
# Prüfen ob System-Prompt unverändert:
sha256sum -c /workspace/nexify/memory/AGENTEN_SEELE_NEXIFY_CEO_RALPH_LOOP.sha256
# Bei Fehler: ABBRUCH + Eskalation an CISO
```

### 3. Load-Zeitpunkt-Prüfung
Wie und wo im Hermes-Stack wird der System-Prompt geladen (`config.yaml` etc.)?
- Verifikation muss **vor** dem ersten LLM-Turn stattfinden
- Idealer: Hermes-Hook/Pre-Execution-Hook oder systemd-Unit vor Profile-Start

### 4. Eskalations-Pfad bei Invalid
- Agent stoppt sofort
- Schreibt Error an CISO (/tmp/prompt-tamper-alert)
- Loggt in Brain: category=security, key=prompt_tamper_alert
- Benachrichtigt Pascal

### 5. Update-Prozess (erlaubte Änderung)
- Pascal unterschreibt neuen Prompt mit `build-seele-tool.sh` (oder manuellem sha256sum)
- Prompt-Version in Dateikommentar, SHA256 in Agenten-Seele-Kopfzeile
- Alten SHA256 ins Änderungsprotokoll

## Implementierungsoptionen

### Option A: Hermes Pre-Execution-Hook (bevorzugt)
- Hermes-Plugin: `prompt_integrity_check` als Pre-Run-Plugin
- Lädt SHA256, vergleicht, bricht bei Missmatch ab
- Vorteil: zentral, alle Profile nutzbar
- Aufwand: Plugin-Entwicklung + Hermes-Integration

### Option B: systemd-Hook vor Profile-Start
- systemd-Unit: `prompt-integrity@.service` mit ExecStartPre=sha256sum-Check
- Vor Aktivierung des Hermes-Profiles
- Vorteil: unabhängig von Hermes-Plugin-Architektur

### Option C: Monolithischer Shell-PreCheck (schnellster Weg)
- Skript: `/usr/local/bin/verify-prompt.sh`
- Wird von `start-agent.sh` vor Profile-Aktivierung aufgerufen
- Output: 0 = OK, 1 = TAMPER DETECTED, 2 = FILE NOT FOUND
- Notify: syslog + /tmp/prompt-tamper-alert + Brain-Log
- Einfach, sofort testbar, kein Hermes-Refactoring nötig

## Akzeptanzkriterien
1. `verify-prompt.sh` existiert und ist ausführbar
2. Bei unverändertem Prompt: Exit-Code 0
3. Bei geändertem Prompt: Exit-Code 1 + Alarm-Datei in /tmp/ + Brain-Eintrag
4. Bei fehlender SHA256-Datei: Exit-Code 2 + Alarm
5. SHA256-Datei liegt neben Prompt-Datei
6. Dokumentation in README + Änderungsprotokoll in Agenten-Seele

## Nicht-Scope
- Kein automatisches Prompt-Update
- Kein diff-Tool (nur SHA256)
- Kein zentrales Dashboard

## Risiken
- SHA256-Datei könnte auch manipuliert werden → in Infrastruktur-Ordner ausgelagert, root-owned
- Pre-Check könnte umgangen werden → systemd-Hook als zweite Barriere
