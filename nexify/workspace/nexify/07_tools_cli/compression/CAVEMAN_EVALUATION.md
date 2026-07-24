# Caveman — Evaluation (LLM-Ausgaben-Kompression)

> **Stand**: 2026-06-11 | **Status**: EVALUATION (Read-Only) | **Quelle**: https://github.com/JuliusBrussee/caveman.git

---

## 1. Einleitung

Caveman ist ein Tool zur **Kompression von LLM-Ausgaben**.
Es reduziert Tokens in generierten Texten, während die semantische Kerninformation erhalten bleibt.

### 1.1 Einsatzgebiet

| Aspekt | Beschreibung |
|---|---|
| **Ziel** | LLM-Ausgaben-Kompression |
| **Zielgruppe** | Agenten-interne Kommunikation |
| **Ansatz** | Semantisch-strukturelle Reduktion |
| **Kompressionsziel** | 50–80 % weniger Tokens |
| **Read-Only** | ✅ Ja — nur Evaluation, keine Installation |

### 1.2 NICHT geeignet für

| Bereich | Begründung |
|---|---|
| ❌ **Kundenkommunikation** | Semantischer Verlust nicht akzeptabel |
| ❌ **Rechtliche Texte** | Präzision erforderlich, Verlust riskant |
| ❌ **Finale Berichte** | Vollständigkeit und Genauigkeit erforderlich |
| ❌ **Verträge / Agreements** | Formulierungen juristisch bindend |
| ❌ **Compliance-Dokumente** | Nachweisbarkeit und Vollständigkeit |

---

## 2. Geeignete Anwendungsfälle

| Bereich | Beschreibung | Priorität |
|---|---|---|
| ✅ **Interne Agentenkommunikation** | Agent A → Agent B (Zusammenfassungen) | 🔴 Hoch |
| ✅ **Zwischenergebnisse** | Ergebnisse, die von nächstem Schritt weiterverarbeitet werden | 🔴 Hoch |
| ✅ **Log-Zusammenfassungen** | Komprimierte Logs für Debugging | 🟡 Mittel |
| ✅ **Brain-Drafting** | Brain-Einträge in komprimierter Form | 🟡 Mittel |
| ✅ **Interne Notizen** | Kurzfassungen von Agenten-Outputs | 🟢 Niedrig |

---

## 3. Anwendungsregeln

### 3.1 Erlaubt / Nicht erlaubt

```
✅  INTERNE Kommunikation (Agent → Agent)
✅  Zwischenergebnisse (Pipeline-Step → Next-Step)
✅  Logs (Debugging, Monitoring)
✅  Drafts (Brain-Einträge, Notizen)
✅  Tool-Call-Outputs (wenn keine Commands)

❌  EXTERNE Kommunikation (Kunde, Partner)
❌  Rechtliche Texte (Verträge, AGB, Compliance)
❌  Finale Berichte (Reports, Dokumentation)
❌  Commands (Shell-Befehle, Skripte)
❌  Evidence-Dateien (müssen vollständig bleiben)
```

### 3.2 Qualitätskontrolle

| Stufe | Aktion | Verantwortlich |
|---|---|---|
| **1** | Automatische Prüfung: Kompressionsrate < 80 % | System |
| **2** | Stichprobenartige manuelle Prüfung (jede 10. Kompression) | Agent/Reviewer |
| **3** | Vollständigkeits-Check: Kerninformationen vorhanden? | System |
| **4** | Format-Check: JSON/Struktur intakt (falls zutreffend) | System |

---

## 4. Kompressionsraten (Erwartung)

| Datentyp | Unkomprimiert | Komprimiert | Rate |
|---|---|---|---|
| Agenten-Output (8.000 Tokens) | 8.000 | ~1.600 | **80 %** |
| Zwischenergebnis (4.000 Tokens) | 4.000 | ~1.000 | **75 %** |
| Log-Ausgabe (6.000 Tokens) | 6.000 | ~1.800 | **70 %** |
| Interne Notiz (1.000 Tokens) | 1.000 | ~400 | **60 %** |
| Kurzer Output (< 500 Tokens) | 500 | ~300 | **40 %** |

---

## 5. Risiken und Einschränkungen

| Risiko | Beschreibung | Massnahme |
|---|---|---|
| **Semantischer Verlust** | Kerninformationen könnten verloren gehen | Qualitätskontrolle Stufe 2–3 |
| **Fehlinterpretation** | Nächster Agent versteht Kontext falsch | Kontext-Metadaten hinzufügen |
| **Overhead bei kurzen Texten** | Kompression lohnt sich nicht | Nur ab > 1.000 Tokens |
| **Kettenreaktion** | Verlust pflanzt sich durch Pipeline fort | Jede Stufe prüfen |

---

## 6. Vergleich mit Alternativen

| Tool | Ansatz | Kompression | Latenz | Einschränkungen |
|---|---|---|---|---|
| **Caveman** | LLM-Ausgaben-Kompression | 50–80 % | Niedrig | ❌ Nicht für Extern |
| **RTK** | Tool-Output-Kompression | 60–90 % | Mittel | ❌ Nicht für Commands |
| **NEXIFY_SEMANTIC_COMPRESSION_PROMPT_V1** | Prompt-basiert | 40–70 % | Kein Overhead | ✅ Flexibel |
| **gzip/zip** | Roh-Kompression | 20–40 % | Sehr niedrig | ❌ Binär |

---

## 7. Fazit

| Aspekt | Bewertung |
|---|---|
| **Einsatzbereit?** | 🔄 Nach Installation |
| **Kompressionsziel** | ✅ 50–80 % erreichbar |
| **Für Agentenkommunikation** | ✅ Geeignet |
| **Für externe Kommunikation** | ❌ **Nicht geeignet** |
| **NeXify-Integration** | 🔄 Nach Evaluation |
| **Nächster Schritt** | Installation + Test in Isolierter Umgebung |

**Empfehlung**: Caveman ist geeignet für interne Agentenkommunikation.
NICHT geeignet für externe oder rechtliche Texte. Vor Produktionseinsatz:
1. In isolierter Umgebung installieren und testen
2. Qualitätskontrolle einrichten
3. Nutzungsregeln durchsetzen (intern vs. extern)
4. Command-Semantik-Schutz beachten

---

## 8. Referenzen

- GitHub: https://github.com/JuliusBrussee/caveman.git
- Siehe auch: `RTK_EVALUATION.md`
- Siehe auch: `NEXIFY_SEMANTIC_COMPRESSION_PROMPT_V1.md`
- Siehe auch: `compression-policy.json`
