# Bolt-Konfiguration: F03, F04, F06 — Klärung

**Datum:** 2026-06-22  
**Agent:** 9Router-Admin  
**Quellen:** 9Router-Source (open-sse/rtk), Caveman-Source, Bolt-Integration Masterplan, F01_F02_F05 Evidence

---

## F03: Caveman "moderate" — exakte Konfigurationswerte?

### ⚠️ "moderate" EXISTIERT NICHT als Caveman-Mode

**Valid Modes (aus `caveman-config.js`):**
```javascript
const VALID_MODES = [
  'off', 'lite', 'full', 'ultra',
  'wenyan-lite', 'wenyan', 'wenyan-full', 'wenyan-ultra',
  'commit', 'review', 'compress'
];
```

**9Router CAVEMAN_LEVELS (aus `cavemanPrompts.js`):**
```javascript
export const CAVEMAN_LEVELS = {
  LITE: "lite",
  FULL: "full",
  ULTRA: "ultra",
  WENYAN_LITE: "wenyan-lite",
  WENYAN: "wenyan",
  WENYAN_ULTRA: "wenyan-ultra",
};
```

**Problem:** Der Bolt-Masterplan (Section 3) referenziert `Caveman "moderate"` für non-stream Endpoints — dieser Mode existiert NICHT.

**Verfügbare Modi mit Intensität:**

| Mode | Intensität | Beschreibung |
|------|-----------|--------------|
| `off` | 0% | Keine Kompression |
| `lite` | ~30% | Drop filler/hedging, behält Grammatik |
| `full` | ~65% | Terse caveman, Fragments OK, Artikel entfernt |
| `ultra` | ~85% | Maximum compression, Telegraphic, Abkürzungen |
| `wenyan-lite` | ~40% | Semi-classical Chinese |
| `wenyan` | ~80% | Classical Chinese (文言文) |
| `wenyan-ultra` | ~90% | Extreme classical compression |

**Exakte `lite` Prompt-Werte (Ersatz für "moderate"):**
```
"Respond tersely. Keep grammar and full sentences but drop filler, hedging
and pleasantries (just/really/basically/sure/of course/I'd be happy to).
Pattern: state the thing, the action, the reason. Then next step.
[shared examples + boundaries + auto-clarity + persistence]"
```

**Exakte `full` Prompt-Werte (aktuell in 9Router):**
```
"Respond like terse caveman. All technical substance stay exact, only fluff die.
Drop: articles (a/an/the), filler (just/really/basically/actually/simply),
pleasantries, hedging. Fragments OK. Short synonyms (big not extensive,
fix not implement a solution for).
Pattern: [thing] [action] [reason]. [next step]."
```

**Aktuelle 9Router-Konfiguration:**
- DB-Setting: `caveman: "full"` (aus F01_F02_F05 Evidence)
- ⚠️ **V13-VERSTOSS:** Caveman "full" bei SSE-Streams ist VERBOTEN
- Empfehlung: Für SSE-Streams → `off`, für non-stream → `lite`

**Lösung für F03:**
- "moderate" muss als Alias definiert werden ODER
- Bolt-Masterplan muss auf `lite` aktualisiert werden
- Empfehlung: `lite` = "moderate" (nächste Entsprechung)

---

## F04: Ponytail-Metriken — "mehr gelöscht als hinzugefügt" gemessen?

### Definition: Ponytail ist KEIN Tool, sondern ein Philosophie-Pattern

**Ponytail-Prinzipien (aus Bolt-Masterplan):**
- YAGNI (You Ain't Gonna Need It)
- Reuse stdlib/existing solutions
- Deletion > Addition

**Metrik-Definition:**

**Ponytail-Deletions-Ratio (PDR):**
```
PDR = deleted_lines / added_lines

Ziel: PDR ≥ 1.0 (mehr gelöscht als hinzugefügt)
Alert-Schwelle: PDR < 1.0
```

**Messung via git:**
```bash
# Pro Commit
git diff --stat HEAD~1 HEAD | tail -1
# Output: "X files changed, Y insertions(+), Z deletions(-)"
# PDR = Z / Y

# Pro Task/PR
git diff --stat main..feature-branch | tail -1
```

**Automatisierte Metrik (pro Agent-Session):**
```javascript
// Nach jeder Code-Änderung:
const stats = {
  linesAdded: 0,
  linesDeleted: 0,
  filesChanged: 0,
  ponytailRatio: 0
};

// Berechnung:
stats.ponytailRatio = stats.linesDeleted / Math.max(stats.linesAdded, 1);

// Compliance-Check:
if (stats.ponytailRatio < 1.0) {
  console.warn("[PONYTAIL] ⚠️ More added than deleted — violates YAGNI");
}
```

**Evidence-Format:**
```markdown
## Ponytail-Evidence: <task_id>
- Lines Added: 45
- Lines Deleted: 72
- PDR: 1.6 ✅
- Files Changed: 3
- Deleted Features: old-legacy-module.js, unused-helper.ts
- Reused: stdlib crypto, existing validation
```

**Metriken im Monitoring (F23):**
| Metrik | Ziel | Alert-Schwelle | Messung |
|--------|------|----------------|---------|
| PDR (Session) | ≥ 1.0 | < 0.8 | git diff pro Session |
| PDR (Task) | ≥ 1.0 | < 0.5 | git diff pro Task |
| Reuse-Rate | ≥ 30% | < 10% | Imports/Dependencies |

---

## F06: Headroom-Kompressionsverlust: Gibt es Benchmarks?

### ❌ KEINE BENCHMARKS GEFUNDEN

**Headroom-Status (aus F01_F02_F05 Evidence):**
- URL konfiguriert: `http://localhost:8787` ✅
- Endpoint erreichbar: 302 Response ✅
- `headroomEnabled`: nicht explizit in DB (Default: false) ⚠️
- Proxy-Management implementiert (start/stop/status) ✅

**Benchmarks durchführen:**

```bash
# 1. Headroom Health Check
curl -s http://localhost:8787/health

# 2. Kompressionstest mit verschiedenen Prompts
curl -X POST http://localhost:8787/v1/compress \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Long prompt to compress...",
    "model": "deepseek-v4-flash",
    "format": "openai"
  }'

# 3. Metriken sammeln
# - Input-Tokens (vor Kompression)
# - Output-Tokens (nach Kompression)
# - Kompressionsrate (%)
# - Latenz (ms)
# - Qualitätsverlust (manuell bewerten)
```

**Benchmark-Template:**
```markdown
## Headroom-Benchmark: <datum>

### Test 1: Kurzer Prompt (< 500 Tokens)
- Input: 450 Tokens
- Output: 320 Tokens
- Rate: 28.9%
- Latenz: 45ms

### Test 2: Mittlerer Prompt (500-2000 Tokens)
- Input: 1,200 Tokens
- Output: 680 Tokens
- Rate: 43.3%
- Latenz: 120ms

### Test 3: Langer Prompt (> 2000 Tokens)
- Input: 3,500 Tokens
- Output: 1,400 Tokens
- Rate: 60.0%
- Latenz: 280ms

### Durchschnitt
- Kompressionsrate: 44.1%
- Latenz: 148ms
- Qualitätsverlust: < 5% (manuell)
```

**Empfehlung:**
1. Headroom erst aktivieren (`headroomEnabled: true` in DB)
2. Benchmark-Suite erstellen mit 10+ Test-Prompts
3. Qualitätsbewertung durch 3 Agenten
4. Ergebnisse in `/workspace/nexify/10_evidence/bolt/headroom-benchmarks/` speichern

---

## Zusammenfassung

| Frage | Status | Ergebnis |
|-------|--------|----------|
| F03: Caveman "moderate" | ⚠️ KLÄRT | "moderate" existiert NICHT. Empfehlung: `lite` als Ersatz |
| F04: Ponytail-Metriken | ✅ DEFINIERT | PDR = deleted/added, Ziel ≥ 1.0, Messung via git diff |
| F06: Headroom-Benchmarks | ❌ KEINE | Keine Benchmarks vorhanden. Benchmark-Template erstellt |

---

## Nächste Schritte

1. **F03:** Bolt-Masterplan Section 3 aktualisieren: `moderate` → `lite`
2. **F03:** 9Router-Caveman-Config prüfen: SSE-Streams → `off` (V13-Compliance)
3. **F04:** Ponytail-Metriken in Monitoring-Dashboard integrieren (F23)
4. **F06:** Headroom aktivieren + Benchmark-Suite durchführen

---

*Generiert: 2026-06-22 | Agent: 9Router-Admin*
