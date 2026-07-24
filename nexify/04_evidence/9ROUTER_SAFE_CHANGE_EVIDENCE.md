# 9Router — Safe Change Evidence

> **Stand**: 2026-06-11 | **Template-Version**: 1.0 | **Nächster Einsatz**: Bei nächster 9Router-Änderung

---

## 1. Änderungs-Metadata

| Feld | Wert |
|---|---|
| **Datum** | `YYYY-MM-DD HH:MM` |
| **Verantwortlich** | `[Name / Subagent-ID]` |
| **Ticket / Issue** | `[Ticket-Nummer / Issue-Link]` |
| **Änderungstyp** | `[Config / Provider / Modell / Rollback / Sonstiges]` |
| **Kritikalität** | `[Niedrig / Mittel / Hoch / Kritisch]` |
| **Staging getestet?** | `[Ja / Nein]` |

---

## 2. Änderungsbeschreibung

**Was wurde geändert?**

```
[Beschreibung der Änderung in 3-5 Sätzen]
```

**Warum wurde geändert?**

```
[Begründung — Welches Problem wurde gelöst?]
```

---

## 3. Pre-Change Checkliste (Gates)

| # | Gate | Status | Notizen |
|---|---|---|---|
| G1 | Config-Backup erstellt? | `[✅ / ❌]` | Backup-Pfad: |
| G2 | IST-Modellliste gesichert? | `[✅ / ❌]` | Anzahl Modelle: 7 |
| G3 | Health-Status geprüft? | `[✅ / ❌]` | Status: operational |
| G4 | Rollback-fähig geprüft? | `[✅ / ❌]` | Rollback-Befehl: |
| G5 | Staging getestet? | `[✅ / ❌ / N/A]` | Staging-Ergebnis: |

### Backup-Nachweis

```json
{
  "backup_path": "/pfad/zu/backups/YYYYMMDD_HHMMSS/",
  "backup_files": [
    "config.yaml",
    "models.json",
    "health.json"
  ],
  "backup_size": "[Grösse in KB]",
  "backup_checksum": "[SHA256]"
}
```

---

## 4. Änderungs-Details

### 4.1 Config-Änderungen

```diff
# ALTE Config (vor Änderung)
[Alter Config-Wert]

# NEUE Config (nach Änderung)
[Neuer Config-Wert]
```

### 4.2 Provider-Änderungen

| Provider | Vorher | Nachher | Status |
|---|---|---|---|
| DeepSeek | `[Status]` | `[Status]` | `[✅/❌]` |
| OpenAI | `[Status]` | `[Status]` | `[✅/❌]` |
| Anthropic | `[Status]` | `[Status]` | `[✅/❌]` |
| Google | `[Status]` | `[Status]` | `[✅/❌]` |
| Meta | `[Status]` | `[Status]` | `[✅/❌]` |

### 4.3 Modell-Änderungen

| Modell | Vorher | Nachher | Teil von combo-llm? |
|---|---|---|---|
| nexifyai-combo-llm | `[ja/nein]` | `[ja/nein]` | — |
| deepseek-v4-flash | `[ja/nein]` | `[ja/nein]` | `[ja/nein]` |
| deepseek-reasoner | `[ja/nein]` | `[ja/nein]` | `[ja/nein]` |
| gpt-4o | `[ja/nein]` | `[ja/nein]` | — |
| claude-sonnet-4-20250514 | `[ja/nein]` | `[ja/nein]` | — |
| gemini-2.5-flash | `[ja/nein]` | `[ja/nein]` | — |
| llama-4-scout | `[ja/nein]` | `[ja/nein]` | — |

---

## 5. Post-Change Validierung

### 5.1 Tests

| TC# | Test | Ergebnis | Latenz |
|---|---|---|---|
| TC1.1 | Einfache Anfrage | `[✅/❌]` | `[s]` |
| TC1.2 | Einfache Anfrage | `[✅/❌]` | `[s]` |
| TC2.1 | Komplexe Anfrage | `[✅/❌]` | `[s]` |
| TC2.2 | Komplexe Anfrage | `[✅/❌]` | `[s]` |
| TC3.1 | Combo-Anfrage | `[✅/❌]` | `[s]` |
| TC4.1 | Timeout-Test | `[✅/❌]` | `[s]` |
| TC5.1 | Fallback-Test | `[✅/❌]` | `[s]` |
| TC6.1 | Health-Check | `[✅/❌]` | `[s]` |

### 5.2 Health-Status nach Änderung

```json
{
  "status": "operational",
  "timestamp": "YYYY-MM-DDTHH:MM:SSZ",
  "models_operational": 7,
  "combo_llm_operational": true,
  "fallback_chain_intact": true
}
```

---

## 6. Rollback-Plan

### 6.1 Rollback-Befehl

```bash
# Config zurücksetzen
cp /pfad/zu/backups/YYYYMMDD_HHMMSS/config.yaml /pfad/zu/9router/config.yaml

# Neustart
systemctl reload 9router

# Health-Check
curl -s https://ai-router.nexifyai.cloud/v1/health
```

### 6.2 Rollback-Getestet?

| Frage | Antwort |
|---|---|
| Wurde der Rollback getestet? | `[Ja / Nein]` |
| Rollback-Dauer | `[s]` |
| Rollback-Ergebnis | `[✅ Erfolgreich / ❌ Fehlgeschlagen]` |

---

## 7. Risikobewertung

### 7.1 Vor der Änderung

| Risiko | Eintritts-W'keit | Auswirkung | Massnahme |
|---|---|---|---|
| [Risiko 1] | [N/M/H] | [N/M/H] | [Massnahme] |
| [Risiko 2] | [N/M/H] | [N/M/H] | [Massnahme] |

### 7.2 Nach der Änderung

| Risiko | Eingetreten? | Massnahme |
|---|---|---|
| [Risiko 1] | [Ja / Nein] | [Ergriffene Massnahme] |
| [Risiko 2] | [Ja / Nein] | [Ergriffene Massnahme] |

---

## 8. Fazit

| Aspekt | Bewertung |
|---|---|
| **Änderung erfolgreich?** | `[Ja / Nein / Teilweise]` |
| **combo-llm intakt?** | `[Ja / Nein]` |
| **Alle Modelle vorhanden?** | `[Ja / Nein]` — Anzahl: `[7]` |
| **Rollback möglich?** | `[Ja / Nein]` |
| **Evidence vollständig?** | `[Ja / Nein]` |

**Nächste Schritte**:

```
1. [Nächster Schritt]
2. [Nächster Schritt]
```

---

## 9. Anhänge

- `[Link zum Config-Backup]`
- `[Link zur Modellliste]`
- `[Link zum Health-Log]`
- `[Link zum Test-Report]`
