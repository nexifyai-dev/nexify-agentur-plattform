# RTK Token Saver — Evaluation

> Stand: 2026-06-12
> Status: Empfohlen für Tool-Outputs

## Was ist RTK?

RTK (Response Token Kürzung) ist ein Feature von 9Router, das Tool-Outputs
und Context-Antworten komprimiert, um Tokens zu sparen.

## Empfehlung

| Bereich | RTK-Nutzung | Begründung |
|---|---|---|
| Tool Outputs (git/grep/ls/tree/logs) | ✅ Ja | Strukturierte Daten, keine Qualitätseinbuße |
| Shell-Ausgaben | ✅ Ja | Wiederholungsarme Rohdaten |
| Audit-/Evidence-Texte | ❌ Nein | Rechtliche Genauigkeit erforderlich |
| Kundendokumente | ❌ Nein | Keine Kompression |
| Interne Reports | ⚠️ Moderat | Qualität vor Kosten |

## Caveman Output Compression

| Modus | Beschreibung | Empfehlung |
|---|---|---|
| Full | Maximale Kompression | ❌ Nicht global |
| Moderate | Ausgewogen | ✅ Für schnelle Iterationen |
| Off | Keine Kompression | ✅ Für Audit/Evidence/Rechtliches |

## Qualitätsmatrix

| Szenario | RTK | Caveman Moderat | Caveman Full |
|---|---|---|---|
| git diff | ✅ 60% saving | ✅ 50% saving | ⚠️ 30% saving, Details riskiert |
| grep -r | ✅ 70% saving | ✅ 60% saving | ⚠️ 40% saving |
| ls -la | ✅ 80% saving | ✅ 70% saving | ✅ 60% saving |
| Log-Analyse | ✅ 50% saving | ✅ 40% saving | ⚠️ Teile unlesbar |
| Evidence-Text | ❌ 0% | ❌ 0% | ❌ Qualität nicht akzeptabel |
| Regelwerk | ❌ 0% | ⚠️ 20% saving | ❌ Bedeutung riskiert |
