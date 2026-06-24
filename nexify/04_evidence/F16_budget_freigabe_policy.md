# F16: Budget-Freigabe bei Kostenüberschreitung

**Status:** ✅ DEFINED  
**Datum:** 2026-06-22  
**Governance-Agent:** NeXify AI OS

---

## Fragestellung

> Budget-Freigabe bei Kostenüberschreitung — wer entscheidet?

## Antwort

**Die Entscheidungskompetenz richtet sich nach der Höhe der Kostenüberschreitung.**

---

## Budget-Freigabe-Policy

### Schwellenwerte und Entscheider

| Überschreitung | Betrag (Richtwert) | Entscheidet | Eskalation |
|----------------|---------------------|-------------|------------|
| **Keine** | ≤ Budget | Zuständiger Agent autonom | — |
| **Gering** | +10–25% | Systemmaster | Dokumentation + Info an CEO |
| **Mittel** | +25–50% | NeXify CEO (freigabepflichtig) | Systemmaster empfiehlt |
| **Hoch** | +50–100% | NeXify CEO (freigabepflichtig) | Schriftliche Begründung + ROI-Analyse erforderlich |
| **Kritisch** | > +100% | NeXify CEO + explizite Genehmigung | Komplette Kostenaufstellung + Alternativenanalyse |

### Eskalationsmatrix

```
Kostenüberschreitung erkannt
    │
    ├── ≤ +10% → Agent entscheidet autonom, dokumentiert Abweichung
    │
    ├── +10–25% → Systemmaster prüft und genehmigt
    │       │       (Info an CEO im nächsten Report)
    │
    ├── +25–50% → Systemmaster erstellt Empfehlung
    │       │       → NeXify CEO entscheidet (freigabepflichtig)
    │
    ├── +50–100% → Systemmaster erstellt Begründung + ROI-Analyse
    │       │       → NeXify CEO entscheidet (freigabepflichtig)
    │
    └── > +100% → Systemmaster erstellt Alternativenanalyse
                → NeXify CEO muss explizit genehmigen
                → Keine Ausgaben ohne schriftliche Freigabe
```

### Dokumentationsanforderungen

| Überschreitung | Erforderliche Dokumentation |
|----------------|---------------------------|
| +10–25% | Vermerk im Budget-Log |
| +25–50% | Begründung + erwarteter Nutzen |
| +50–100% | Begründung + ROI-Analyse + Alternativen |
| > +100% | Vollständige Kostenaufstellung + Alternativenanalyse + Genehmigungsnachweis |

### 9Router-Kosten (Sonderfall)

Da der 9Router die zentrale LLM-Infrastruktur ist und Kosten stark variieren können:

| Situation | Handlung |
|-----------|----------|
| Normaler Betrieb | 9Router-Admin überwacht, Systemmaster bei Überschreitung |
| Provider-Kostenexplosion | 9Router-Admin → sofortiger Provider-Wechsel (autonom, P1) |
| Strukturelle Überschreitung | Systemmaster → CEO-Freigabe erforderlich |

---

## Prinzipien

1. **Subsidiarität** — Entscheidung so niedrig wie möglich, so hoch wie nötig.
2. **Dokumentationspflicht** — jede Überschreitung wird protokolliert.
3. **ROI-orientiert** — höhere Überschreitungen erfordern stärkere Begründung.
4. **CEO als finale Instanz** — bei > 25% Überschreitung entscheidet immer der NeXify CEO.
5. **Prävention vor Korrektur** — Monitoring und Alerts sollen Überschreitungen früh erkennen.

---

**Evidence-Typ:** Policy-Definition  
**Governance-Level:** Strategic  
**Nächste Review:** 2026-09-22
