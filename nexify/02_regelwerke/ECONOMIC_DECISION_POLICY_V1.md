# ECONOMIC DECISION POLICY V1

> **Status**: VERBINDLICH | **Scope**: NEXIFY_INTERNAL (FINANCE)
> **Erstellt**: 2026-06-12 | **Version**: 1.0.0
> **Gültigkeit**: dauerhaft

---

## 1. Grundsatz

Jede wirtschaftliche Entscheidung im NeXify-Betrieb muss Kosten, Nutzen und Risiken
transparent abwägen. Diese Policy definiert den Rahmen für solche Entscheidungen.

---

## 2. Entscheidungsmatrix

| Entscheidungstyp | Beispiel | Erforderliche Abwägung | Entscheider |
|-----------------|----------|----------------------|------------|
| **Typ A** — < 10 € Monatskosten | Neuer API-Key, kleine SaaS-Tools | Einfache Prüfung | Systemmaster autonom |
| **Typ B** — 10–100 € Monatskosten | Hosting-Upgrade, zusätzlicher Service | Kosten-Nutzen-Vergleich | Systemmaster + Brain-Entry |
| **Typ C** — 100–500 € Monatskosten | Neuer LLM-Provider, größere Infrastruktur | Detaillierte Analyse mit ROI-Prognose | Systemmaster + Stakeholder |
| **Typ D** — > 500 € Monatskosten | Neue Hardware, Enterprise-Verträge | Vollständiger Business Case | Pascal + Brain-Dokumentation |

---

## 3. Bewertungskriterien

Jede Entscheidung wird bewertet nach:

1. **Kosten**: Direkte + indirekte Kosten (monatlich/jährlich)
2. **Nutzen**: Welchen Wertbeitrag liefert die Investition?
3. **Risiko**: Was passiert bei Ausfall/Fehlentscheidung?
4. **Alternativen**: Gibt es günstigere oder risikoärmere Optionen?
5. **Dringlichkeit**: Muss es sofort sein oder kann es warten?

---

## 4. LLM-Kosten-Governance

| Regel | Beschreibung |
|-------|-------------|
| Default-Modell | nexifyai-combo-llm (DeepSeek Reasoner + V4 Flash Round-Robin) |
| Teure Modelle | Nur für Architektur/Strategie-Qualität (ds/deepseek-reasoner) |
| Günstige Modelle | Standard für Routineaufgaben (ds/deepseek-v4-flash) |
| Kosten-Tracking | Monatlich via 9Router Usage-DB |
| Budget-Überschreitung | Bei > 200 €/Monat: Analyse + Optimierung erforderlich |

---

## 5. Entscheidungsprozess

```
1. BEDARF ERKENNEN
   └── Was wird benötigt? Warum?

2. OPTIONEN SAMMELN
   └── Mindestens 2 Alternativen prüfen

3. KOSTEN SCHÄTZEN
   └── Direkt + indirekt + langfristig

4. NUTZEN BEWERTEN
   └── Wertbeitrag, Effizienzgewinn, Risikoreduktion

5. RISIKO PRÜFEN
   └── Ausfallszenario, Vendor-Lock-in, Migrationsaufwand

6. ENTSCHEIDUNG TREFFEN
   └── Typabhängig (siehe 2.)

7. DOKUMENTIEREN
   └── Entscheidung + Begründung in Brain speichern

8. REVIEW (nach 90 Tagen)
   └── War die Entscheidung richtig? Nachjustieren?
```

---

## 6. Kostenregister-Pflege

- Alle Kostenstellen werden im Cost-Value-Margin Register geführt
- Monatliche Aktualisierung durch Systemmaster
- LLM-Kosten via 9Router Usage-DB automatisiert erfassen

---

## 7. Ausnahmen

- Sicherheitsrelevante Ausgaben (Incident-Response, Patches) sind sofort genehmigt
- Kosten < 5 € einmalig: keine Entscheidungsmatrix erforderlich
- Experimentelle Ausgaben für Proof-of-Concepts: Typ A/B, dokumentiert im Brain

---

## 8. Verstöße

- Nicht dokumentierte Ausgaben > 10 €/Monat → Review erforderlich
- Wiederholte Verstöße → Eskalation an Pascal

---

*Ende ECONOMIC DECISION POLICY V1*
