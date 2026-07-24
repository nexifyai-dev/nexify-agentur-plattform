# Token Compression — Test Evidence

> **Stand**: 2026-06-11 | **Template-Version**: 1.0 | **Nächster Einsatz**: Bei nächstem Kompressionstest

---

## 1. Test-Metadata

| Feld | Wert |
|---|---|
| **Datum** | `YYYY-MM-DD HH:MM` |
| **Verantwortlich** | `[Name / Subagent-ID]` |
| **Kompressionsmethode** | `[NEXIFY_SEMANTIC_COMPRESSION_PROMPT_V1 / RTK / Caveman]` |
| **Modell** | `[LLM-Modell, z.B. deepseek-v4-flash]` |
| **Umgebung** | `[Isoliert / Staging / Produktion]` |

---

## 2. Test-Konfiguration

| Parameter | Wert |
|---|---|
| **Min Input Tokens** | 1.000 |
| **Max Compression Ratio** | 90 % |
| **Output Format** | JSON |
| **Loss Warning Check** | `[Ja / Nein]` |
| **Review Rate** | Jede 10. Kompression |

---

## 3. Test-Results

### 3.1 Kompressionsrate

| # | Datentyp | Input Tokens | Output Tokens | Ratio | Loss Warning |
|---|---|---|---|---|---|
| 1 | `[z.B. Agent-Output]` | `[Anzahl]` | `[Anzahl]` | `[%]` | `[null / Warnung]` |
| 2 | `[z.B. Log]` | `[Anzahl]` | `[Anzahl]` | `[%]` | `[null / Warnung]` |
| 3 | `[z.B. Tool-Call]` | `[Anzahl]` | `[Anzahl]` | `[%]` | `[null / Warnung]` |
| 4 | `[z.B. Zwischenergebnis]` | `[Anzahl]` | `[Anzahl]` | `[%]` | `[null / Warnung]` |
| 5 | `[z.B. Kurzer Text]` | `[Anzahl]` | `[Anzahl]` | `[%]` | `[null / Warnung]` |

### 3.2 Semantische Qualität

| # | Feld | Vollständig? | Korrekt? | Notizen |
|---|---|---|---|---|
| 1 | `summary` | `[✅/❌]` | `[✅/❌]` | |
| 2 | `facts` | `[✅/❌]` | `[✅/❌]` | |
| 3 | `decisions` | `[✅/❌]` | `[✅/❌]` | |
| 4 | `open_tasks` | `[✅/❌]` | `[✅/❌]` | |
| 5 | `risks` | `[✅/❌]` | `[✅/❌]` | |
| 6 | `blockers` | `[✅/❌]` | `[✅/❌]` | |
| 7 | `next_action` | `[✅/❌]` | `[✅/❌]` | |

### 3.3 Fehler / Auffälligkeiten

| # | Typ | Beschreibung | Massnahme |
|---|---|---|---|
| 1 | `[Fehler / Warnung]` | `[Beschreibung]` | `[Massnahme]` |
| 2 | `[Fehler / Warnung]` | `[Beschreibung]` | `[Massnahme]` |

---

## 4. Vergleich mit anderen Methoden

| Methode | Ø Ratio | Ø Qualität | Latenz | Einschränkungen |
|---|---|---|---|---|
| **NEXIFY_SEMANTIC_COMPRESSION_PROMPT_V1** | `[%]` | `[1-5]` | `[ms]` | |
| **RTK** (falls getestet) | `[%]` | `[1-5]` | `[ms]` | |
| **Caveman** (falls getestet) | `[%]` | `[1-5]` | `[ms]` | |

---

## 5. Fazit

| Aspekt | Bewertung |
|---|---|
| **Kompressionsziel erreicht?** | `[Ja / Nein / Teilweise]` |
| **Semantische Qualität ausreichend?** | `[Ja / Nein]` |
| **Sicherheitsrelevanten Informationen erhalten?** | `[Ja / Nein]` |
| **Loss Warning Mechanismus funktioniert?** | `[Ja / Nein]` |
| **Empfehlung für Produktion?** | `[Ja / Nein]` |

**Nächste Schritte**:

```
1. [Nächster Schritt]
2. [Nächster Schritt]
```

---

## 6. Anhänge

- `[Link zum Test-Input]`
- `[Link zum komprimierten Output]`
- `[Link zum Log]`
- `[Link zur Konfiguration]`
