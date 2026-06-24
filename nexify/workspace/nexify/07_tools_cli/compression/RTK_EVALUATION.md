# RTK — Evaluation (Token-Kompression)

> **Stand**: 2026-06-11 | **Status**: EVALUATION (Read-Only) | **Quelle**: https://github.com/rtk-ai/rtk.git

---

## 1. Einleitung

RTK (Retain Token Knowledge) ist ein Tool zur **Kompression von Tool-Ausgaben**.
Ziel: Reduzierung des Input-Token-Verbrauchs um **60–90 %** bei gleichbleibender semantischer Qualität.

### 1.1 Einsatzgebiet

| Aspekt | Beschreibung |
|---|---|
| **Ziel** | Token-Kompression von Tool-Ausgaben |
| **Zielgruppe** | LLM-Agenten (Input-Kontext reduzieren) |
| **Ansatz** | Semantische Kompression (nicht roh) |
| **Kompressionsziel** | 60–90 % weniger Input-Tokens |
| **Read-Only** | ✅ Ja — nur Evaluation, keine Installation |

### 1.2 Bewertungskriterien

| Kriterium | Gewicht |
|---|---|
| Kompressionsrate | 🔴 Hoch |
| Semantische Qualität | 🔴 Hoch |
| Latenz-Einfluss | 🟡 Mittel |
| Integrierbarkeit | 🟡 Mittel |
| Wartbarkeit | 🟢 Niedrig |

---

## 2. Funktionsweise

```
Tool Output (roh, z.B. 10.000 Tokens)
  ↓
RTK Compressor
  ↓
Komprimierte Ausgabe (z.B. 1.000–4.000 Tokens)
  ↓
LLM verarbeitet komprimierte Version
```

### 2.1 Kompressionsstrategie

- **Nicht roh komprimieren** (wie gzip)
- **Semantisch reduzieren** — unwichtige Details entfernen
- **Strukturerhaltend** — JSON, YAML, Code-Strukturen bleiben lesbar
- **Verlustbehaftet, aber kontrolliert** — Priorität auf Kerninformationen

### 2.2 Ideale Anwendungsfälle

- **Tool-Call-Outputs**: `ls -la`, `git diff`, `curl`-Antworten
- **Log-Ausgaben**: Fehler-Logs, Stack-Traces (nur relevante Teile)
- **Datenbank-Ergebnisse**: Grosse Result-Sets
- **Datei-Inhalte**: Grosse Config-Dateien, Dumps

---

## 3. Kompressionsraten (Erwartung)

| Datentyp | Unkomprimiert | Komprimiert | Rate |
|---|---|---|---|
| Lange Logs (10.000 Tokens) | 10.000 | ~1.000 | **90 %** |
| Tool-Call-Output (5.000 Tokens) | 5.000 | ~750 | **85 %** |
| JSON/Config (2.000 Tokens) | 2.000 | ~400 | **80 %** |
| Code-Ausgabe (3.000 Tokens) | 3.000 | ~900 | **70 %** |
| Kurze Outputs (< 500 Tokens) | 500 | ~300 | **40 %** |

> **Wichtig**: Kurze Outputs lohnen sich nicht — Overhead > Nutzen.

---

## 4. Risiken und Einschränkungen

| Risiko | Beschreibung | Massnahme |
|---|---|---|
| **Semantischer Verlust** | Wichtige Details könnten verloren gehen | Qualitäts-Monitoring |
| **Command-Semantik verändert** | Komprimierte Befehle könnten anders interpretiert werden | **⚠️ Command-Output NIEMALS komprimieren** |
| **Latenz-Overhead** | Kompression braucht Zeit (ms–s) | Nur bei Output > 1.000 Tokens |
| **Format-Zerstörung** | JSON/XML-Strukturen könnten beschädigt werden | Struktur-Tests vor Deployment |

---

## 5. Read-Only-Evaluation (Ohne Installation)

Da RTK nicht installiert ist, basiert diese Evaluation auf:

1. **Repository-Analyse** — README, Code-Struktur, Issues
2. **Dokumentation** — Docs, Beispiele
3. **Vergleich** — Ähnliche Tools (Caveman, Custom-Prompts)

### 5.1 Offene Fragen (vor Installation zu klären)

| Frage | Antwort-Erwartung |
|---|---|
| Kompressionsmodus? | Prompt-basiert oder API? |
| Sprach-Unterstützung? | Nur Englisch? Deutsch auch? |
| Integration? | CLI-Tool? Python-Library? |
| Konfigurierbarkeit? | Kompressionsrate einstellbar? |

### 5.2 Evaluations-Checkliste

- [ ] README gelesen und verstanden
- [ ] Lizenz geprüft (muss mit NeXify kompatibel sein)
- [ ] Abhängigkeiten bekannt (Runtime, Libraries)
- [ ] CLI/API dokumentiert
- [ ] Kompressionsbeispiele vorhanden
- [ ] Performance-Benchmarks existieren
- [ ] Einschränkungen dokumentiert

---

## 6. Vergleich mit Alternativen

| Tool | Ansatz | Kompression | Latenz | Read-Only |
|---|---|---|---|---|
| **RTK** | Semantische Kompression | 60–90 % | Mittel | ✅ |
| **Caveman** | LLM-Ausgaben-Kompression | 50–80 % | Niedrig | ✅ |
| **NEXIFY_SEMANTIC_COMPRESSION_PROMPT_V1** | Prompt-basiert | 40–70 % | Kein Overhead | ✅ |
| **gzip/zip** | Roh-Kompression | 20–40 % | Sehr niedrig | ❌ (binär) |

---

## 7. Fazit

| Aspekt | Bewertung |
|---|---|
| **Einsatzbereit?** | 🔄 Nach Installation |
| **Kompressionsziel** | ✅ 60–90 % erreichbar (bei grossen Outputs) |
| **Command-Semantik** | ⚠️ Muss geschützt werden |
| **NeXify-Integration** | 🔄 Nach Evaluation |
| **Nächster Schritt** | Installation + Benchmark in Isolierter Umgebung |

**Empfehlung**: RTK ist vielversprechend für Tool-Ausgaben-Kompression. Vor Produktionseinsatz:
1. In isolierter Umgebung installieren und testen
2. Kompressionsrate mit NeXify-typischen Outputs messen
3. Semantische Qualität manuell prüfen
4. Command-Semantik-Schutz implementieren

---

## 8. Referenzen

- GitHub: https://github.com/rtk-ai/rtk.git
- Siehe auch: `CAVEMAN_EVALUATION.md`
- Siehe auch: `NEXIFY_SEMANTIC_COMPRESSION_PROMPT_V1.md`
- Siehe auch: `compression-policy.json`
