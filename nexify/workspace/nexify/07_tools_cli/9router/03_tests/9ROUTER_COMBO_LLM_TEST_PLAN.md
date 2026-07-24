# 9Router — nexifyai-combo-llm Testplan

> **Stand**: 2026-06-11 | **Status**: DRAFT | **Fokus**: combo-llm-Funktionalität validieren

---

## 1. Testziele

| Ziel | Beschreibung |
|---|---|
| **T1** | Einfache Anfragen → werden an flash weitergeleitet |
| **T2** | Komplexe Anfragen → werden an reasoner weitergeleitet |
| **T3** | Gemischte Anfragen → combo (flash draft + reasoner review) |
| **T4** | Timeout-Verhalten → flash 30s, reasoner 120s, combo 150s |
| **T5** | Fallback-Verhalten → Kaskade funktioniert |
| **T6** | Health-Check → Endpunkt erreichbar und korrekt |
| **T7** | Rollback → Config-Rücksetzung funktioniert |

---

## 2. Test-Setup

### 2.1 Voraussetzungen

- ✅ 9Router erreichbar unter `https://ai-router.nexifyai.cloud/v1`
- ✅ Gültiger API-Key `${NEXIFY_ROUTER_KEY}`
- ✅ curl oder vergleichbares HTTP-Tool
- ✅ Zugriff auf Backup-Verzeichnis
- ✅ Staging-Umgebung (empfohlen)

### 2.2 Test-Utilities

```bash
# Helper: Einfacher Request
test_simple() {
  curl -s -X POST "https://ai-router.nexifyai.cloud/v1/chat/completions" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer ${NEXIFY_ROUTER_KEY}" \
    -d '{
      "model": "nexifyai-combo-llm",
      "messages": [{"role": "user", "content": "'"$1"'"}],
      "max_tokens": 100
    }'
}

# Helper: Mit X-9Router-Mode Header
test_mode() {
  curl -s -X POST "https://ai-router.nexifyai.cloud/v1/chat/completions" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer ${NEXIFY_ROUTER_KEY}" \
    -H "X-9Router-Mode: $1" \
    -d '{
      "model": "nexifyai-combo-llm",
      "messages": [{"role": "user", "content": "'"$2"'"}],
      "max_tokens": 100
    }'
}
```

---

## 3. Test Cases

### 3.1 Einfache Anfragen → flash (T1)

| # | Test | Prompt | Erwartet |
|---|---|---|---|
| TC1.1 | Status-Frage | "Wie spät ist es?" | ✅ Antwort < 10s |
| TC1.2 | Einfaches Lesen | "Was ist 2+2?" | ✅ Antwort < 10s |
| TC1.3 | Kurze Info | "Wer hat die Relativitätstheorie entwickelt?" | ✅ Antwort < 15s |
| TC1.4 | Echo | "Sag 'Hallo Welt'" | ✅ Antwort < 5s |

**Akzeptanzkriterium**: Alle einfachen Anfragen werden innerhalb von 15s beantwortet.

### 3.2 Komplexe Anfragen → reasoner (T2)

| # | Test | Prompt | Erwartet |
|---|---|---|---|
| TC2.1 | Architektur | "Entwerfe eine Microservice-Architektur für ein E-Commerce-System mit 10 Diensten und erkläre die Kommunikationsmuster." | ✅ Antwort < 120s |
| TC2.2 | Debugging | "Gegeben folgender Code mit Race-Condition... Analysiere und behebe das Problem." | ✅ Antwort < 120s |
| TC2.3 | Planung | "Erstelle einen mehrstufigen Migrationsplan von Monolith zu Microservices mit Risikoanalyse." | ✅ Antwort < 120s |
| TC2.4 | Mathematisch | "Beweise den Satz des Pythagoras mittels Vektorrechnung und erkläre jeden Schritt." | ✅ Antwort < 120s |

**Akzeptanzkriterium**: Alle komplexen Anfragen werden innerhalb von 120s beantwortet.

### 3.3 Gemischte Anfragen → combo (T3)

| # | Test | Prompt | Erwartet |
|---|---|---|---|
| TC3.1 | Einfach+Komplex | "Schreibe eine Funktion in Python, die Fibonacci-Zahlen berechnet (einfach). Erkläre dann die Big-O-Komplexität (komplex)." | ✅ Combo-Logik aktiv |
| TC3.2 | Iterativ | "1) Nenne 3 Vorteile von Kubernetes. 2) Entwerfe ein Deployment für eine Node.js App mit autoscaling." | ✅ Combo-Logik aktiv |
| TC3.3 | Draft+Review | "Erstelle einen Draft für eine API-Spezifikation und reviewe ihn auf Sicherheitslücken." | ✅ Draft + Review |

**Akzeptanzkriterium**: Combo-Modus wird für gemischte Anfragen genutzt (erkennbar an Latenz zwischen flash und reasoner).

### 3.4 Timeout-Tests (T4)

| # | Test | Beschreibung | Erwartet |
|---|---|---|---|
| TC4.1 | flash-Timeout | Anfrage mit `X-9Router-Mode: fast` und extrem langem Prompt | ⏱ Timeout nach 30s → Fallback |
| TC4.2 | reasoner-Timeout | Anfrage mit `X-9Router-Mode: deep` und max_tokens=32000 | ⏱ Timeout nach 120s → Fallback |
| TC4.3 | combo-Timeout | Normale combo-Anfrage mit künstlicher Verzögerung | ⏱ Timeout nach 150s → Fallback |

**Akzeptanzkriterium**: Timeouts werden korrekt behandelt und lösen Fallback aus.

### 3.5 Fallback-Tests (T5)

| # | Test | Beschreibung | Erwartet |
|---|---|---|---|
| TC5.1 | Fallback bei 429 | Provider simuliert Rate-Limit | ✅ Nächster Fallback |
| TC5.2 | Fallback bei 503 | Provider simuliert Unavailable | ✅ Nächster Fallback + Retry |
| TC5.3 | Fallback-Kette vollständig | Alle Provider nacheinander ausfallen | ✅ llama-4-scout als letzter |
| TC5.4 | Degraded Mode | Alle Modelle tot | ✅ 503 + Wartungsseite |

**Akzeptanzkriterium**: Fallback-Kaskade arbeitet korrekt und terminiert im Degraded Mode.

### 3.6 Health-Check-Tests (T6)

| # | Test | Beschreibung | Erwartet |
|---|---|---|---|
| TC6.1 | Health-Endpunkt | `GET /v1/health` | ✅ 200 OK |
| TC6.2 | Modell-Health | Alle 7 Modelle mit Status | ✅ Jedes Modell hat Status |
| TC6.3 | combo-llm-Health | Spezifisch auf combo-llm prüfen | ✅ "operational" |
| TC6.4 | Health-Timeout | Health-Check-Reaktionszeit | ✅ < 10s |

**Akzeptanzkriterium**: Health-Endpunkt ist erreichbar und zeigt korrekte Status.

---

## 4. Automatisierte Test-Suite (Vorschlag)

```bash
#!/bin/bash
# 9ROUTER_COMBO_LLM_TEST_SUITE.sh
# Führt alle combo-llm-Tests aus und protokolliert Ergebnisse

set -euo pipefail

ROUTER_URL="https://ai-router.nexifyai.cloud/v1"
API_KEY="${NEXIFY_ROUTER_KEY}"
LOG_FILE="combo_llm_test_$(date +%Y%m%d_%H%M%S).log"
PASS=0
FAIL=0

log() { echo "[$(date +%H:%M:%S)] $*" | tee -a "$LOG_FILE"; }

test_request() {
  local name="$1"
  local prompt="$2"
  local mode="${3:-}"
  
  log "TEST: $name"
  log "PROMPT: $prompt"
  
  local start=$(date +%s%N)
  local response=$(curl -s -w "\n%{http_code}" -X POST "$ROUTER_URL/chat/completions" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $API_KEY" \
    ${mode:+-H "X-9Router-Mode: $mode"} \
    -d "{\"model\": \"nexifyai-combo-llm\", \"messages\": [{\"role\": \"user\", \"content\": \"$prompt\"}], \"max_tokens\": 100}")
  local end=$(date +%s%N)
  
  local http_code=$(echo "$response" | tail -1)
  local latency=$(( (end - start) / 1000000 ))
  
  log "HTTP: $http_code | LATENCY: ${latency}ms"
  
  if [ "$http_code" = "200" ]; then
    log "RESULT: ✅ PASS"
    ((PASS++))
  else
    log "RESULT: ❌ FAIL"
    ((FAIL++))
  fi
  log "---"
}

# TC1: Einfache Anfragen
test_request "TC1.1 - Status" "Wie spät ist es?"
test_request "TC1.2 - Einfach" "Was ist 2+2?"

# TC2: Komplexe Anfragen
test_request "TC2.1 - Architektur" "Entwerfe eine Microservice-Architektur"

# TC6: Health-Check
log "TEST: TC6.1 - Health-Endpoint"
curl -s "$ROUTER_URL/health" | head -c 200
log ""

log "═══════════════════════════"
log "ERGEBNIS: $PASS passed, $FAIL failed"
log "═══════════════════════════"
```

---

## 5. Test-Reporting

### 5.1 Test-Ergebnis-Template

```markdown
## Test Run YYYY-MM-DD HH:MM

| TC# | Name | Status | Latenz | Notizen |
|-----|------|--------|--------|---------|
| TC1.1 | Status-Frage | ✅ PASS | 3.2s | |
| TC1.2 | Einfaches Lesen | ✅ PASS | 2.1s | |
| ... | ... | ... | ... | ... |

**Gesamt**: 15/15 ✅ PASS | 0 ❌ FAIL
```

### 5.2 Fehler-Tracking

Bei fehlgeschlagenen Tests:
1. **Logs exportieren** → In `/workspace/nexify/10_evidence/9router/` speichern
2. **Root Cause Analysis** → Warum ist der Test fehlgeschlagen?
3. **Fix** → Änderung durchführen MIT BACKUP
4. **Re-Test** → Alle Tests erneut ausführen
5. **Evidence aktualisieren**

---

## 6. Test-Rhythmus

| Intervall | Tests | Auslöser |
|---|---|---|
| **Nach jedem Deploy** | Alle TC1–TC6 | Automatisch (CI/CD) |
| **Täglich** | Health-Check (TC6) | Cron-Job |
| **Wöchentlich** | Vollständiger Durchlauf | Manuell/Staging |
| **Vor Änderung** | Backup + Health-Check | Manuell |
| **Nach Änderung** | Alle TC1–TC5 | Manuell/Automatisch |

---

## 7. Referenzen

- `9ROUTER_CURRENT_STATE.md` — IST-Zustand
- `9ROUTER_TARGET_STATE_NEXIFYAI_COMBO_LLM.md` — Schutzziele
- `9ROUTER_NO_CRASH_POLICY.md` — No-Crash-Policy
- `9ROUTER_SAFE_CHANGE_EVIDENCE.md` — Evidence-Template
- `/workspace/nexify/10_evidence/9router/` — Test-Evidence-Ablage
