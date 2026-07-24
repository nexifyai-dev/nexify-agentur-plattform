# Bolt-Integration: SOFORT-Fragen F01, F02, F05

**Datum:** 2026-06-22  
**Quelle:** 9Router-DB (data.sqlite) + Server-Chunks + Frontend-Code  
**VPS:** 72.62.152.47 (Container: 9router-6kxn-niner-router-1)

---

## F01: Ist RTK aktuell in 9Router aktiviert oder nur evaluiert?

### ✅ AKTIVIERT (produktiv)

**Evidence:**
```json
// Aus data.sqlite Settings (id=1):
{
  "rtkEnabled": true
}
```

**Default-Wert (Middleware):**
```javascript
// /app/.next/server/middleware.js
rtkEnabled: !0  // true by default
```

**RTK-Status:** `rtkEnabled: true` in der Datenbank → **AKTIVIERT und produktiv im Einsatz**

**RTK-Filter (aus 8895.js):**
- `git-diff` — Komprimiert git diff Ausgaben
- `git-status` — Komprimiert git status Ausgaben  
- `build-output` — Komprimiert Build-Ausgaben
- `grep` — Komprimiert grep-Ergebnisse
- `find` — Komprimiert find-Ergebnisse
- `dedup-log` — Dedupliziert Log-Ausgaben
- `ls` — Komprimiert ls-Ausgaben
- `tree` — Komprimiert tree-Ausgaben
- `smart-truncate` — Intelligentes Truncating
- `read-numbered` — Komprimiert nummerierte Read-Ausgaben
- `search-list` — Komprimiert Suchergebnis-Listen

**RTK-Log-Ausgabe:**
```
[RTK] saved {bytes}B / {total}B ({percent}%) via [{filters}] hits={count}
```

---

## F02: Ist Headroom (/v1/compress) Endpoint deployed oder nur geplant?

### ✅ DEPLOYED (URL konfiguriert, Proxy-Management implementiert)

**Evidence:**
```json
// Aus data.sqlite Settings (id=1):
{
  "headroomUrl": "http://localhost:8787"
}
```

**Default-Werte (Middleware):**
```javascript
// /app/.next/server/middleware.js
headroomEnabled: !1,  // false by default
headroomUrl: process.env.HEADROOM_URL || "http://localhost:8787",
headroomCompressUserMessages: !1
```

**API-Routen (deployed):**
- `/api/headroom/status` — GET → Prüft Headroom-Status (installed, running, python, canStart)
- `/api/headroom/start` — POST → Startet Headroom-Proxy (port 8787)
- `/api/headroom/stop` — POST → Stoppt Headroom-Proxy

**Headroom-Proxy-Logik (33016.js):**
```javascript
// Startet headroom proxy --port 8787
// PID-Datei: {dataDir}/headroom/proxy.pid
// Log-Datei: {dataDir}/headroom/proxy.log
// Health-Check: {headroomUrl}/health (1500ms timeout)
```

**Endpoint-Test:**
- `http://localhost:8787/` → HTTP 302 (Redirect, erreichbar)
- `http://localhost:8787/v1/compress` → HTTP 302 (Redirect, erreichbar)

**Headroom-Integration im Request-Flow (8895.js):**
```javascript
// Im API-Handler:
let aC = await (0,C.S)(Z, {enabled:Q, url:R, model:an, format:az, compressUserMessages:S});
let aD = (0,C.N)(aC);
aD && d?.info?.("HEADROOM", aD);
```

**Status:** 
- URL konfiguriert: `http://localhost:8787` ✅
- Endpoint erreichbar: 302 Response ✅
- `headroomEnabled` nicht explizit in DB gesetzt (Default: false) ⚠️
- Proxy-Management implementiert (start/stop/status) ✅

---

## F05: RTK-Whitelist: Welche Dateien/Tools sind von Kompression ausgenommen?

### ⚠️ KEINE EXPLIZITE WHITELIST GEFUNDEN

**Analyse:**
- Durchsucht: data.sqlite, alle .js/.ts/.json Dateien im Container
- Suchbegriffe: `rtkWhitelist`, `rtk_whitelist`, `compressWhitelist`, `noCompress`, `bypassRtk`, `rtkExclude`, `rtkSkip`, `compressBypass`, `skipCompress`, `excludeFromRtk`, `rtkIgnore`
- **Ergebnis:** Keine explizite Whitelist-Definition gefunden

**RTK arbeitet FILTER-BASIERT, nicht WHITELIST-BASIERT:**

RTK hat keine Datei/Tool-Whitelist. Stattdessen:
1. **RTK-Filter werden auf Tool-Output angewendet** (git-diff, grep, ls, etc.)
2. **Filter sind Pattern-basiert** — sie erkennen spezifische Ausgabeformate
3. **Nicht erkannte Formate bleiben unverändert** — passthrough
4. **Filter-Panics werden abgefangen** — bei Fehler wird raw output durchgereicht

**RTK-Filter-Details:**
| Filter | Beschreibung |
|--------|-------------|
| `git-diff` | Erkennt `diff --git` und `@@` Patterns |
| `git-status` | Erkennt `On branch`, `Changes`, `Untracked` Patterns |
| `build-output` | Erkennt Build-spezifische Ausgaben |
| `grep` | Erkennt grep-Ergebnisse |
| `find` | Erkennt find-Ergebnisse |
| `dedup-log` | Dedupliziert wiederholte Log-Zeilen |
| `ls` | Erkennt ls-Ausgaben |
| `tree` | Erkennt tree-Ausgaben |
| `smart-truncate` | Intelligentes Truncating langer Ausgaben |
| `read-numbered` | Erkennt nummerierte Zeilen (`\d+\|`) |
| `search-list` | Erkennt Suchergebnis-Listen |

**MODEL_NO_MAP (aus mitm/config.js):**
```javascript
// Models die NICHT umgeroutet werden (nicht RTK-Whitelist, sondern Routing-Whitelist):
const MODEL_NO_MAP = {
  antigravity: [/^tab[_-]/i],  // Tab-Autocomplete Models
};
```

---

## Zusammenfassung

| Frage | Status | Detail |
|-------|--------|--------|
| F01: RTK aktiviert? | ✅ AKTIVIERT | `rtkEnabled: true` in DB, 11 Filter aktiv |
| F02: Headroom deployed? | ✅ DEPLOYED | URL konfiguriert, Endpoint erreichbar (302), Proxy-Management implementiert |
| F05: RTK-Whitelist? | ⚠️ KEINE EXPLIZITE WHITELIST | Filter-basiert, keine Datei/Tool-Whitelist. Nicht erkannte Formate pass through. |

---

## Zusätzliche Bolt-Features (entdeckt)

| Feature | Status | Level |
|---------|--------|-------|
| Caveman | ✅ AKTIVIERT | `full` |
| Ponytail | ❓ Default | `full` (nicht in DB) |
| Headroom Compress User Messages | ❓ Default | `false` |
| Source Format Override | Verfügbar | Im Handler |
| Provider Thinking | Verfügbar | Im Handler |
