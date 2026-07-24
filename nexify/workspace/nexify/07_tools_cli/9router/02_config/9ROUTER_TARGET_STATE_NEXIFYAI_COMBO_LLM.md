# 9Router Target State — nexifyai-combo-llm Schutz

> **Stand**: 2026-06-11 | **Status**: DRAFT | **Fokus**: nexifyai-combo-llm als führendes Modell schützen

---

## 1. Zielsetzung

`nexifyai-combo-llm` ist das **primäre Standardmodell** für alle NeXify-Agenten. Dieses Dokument definiert Schutzmassnahmen, um:
- **Keine Vollabstürze** des combo-llm
- **Keine Konfigurationsverluste** bei Änderungen
- **Immer rollback-fähig** bleiben
- **deepseek-v4-flash + deepseek-reasoner als Pflichtkombination** erhalten

---

## 2. Schutzziele

| Ziel | Beschreibung | Kritikalität |
|---|---|---|
| **P1 — Keine Vollabstürze** | Der combo-llm darf NIEMALS in einen nicht-wiederherstellbaren Zustand fallen | 🔴 Kritisch |
| **P2 — Config-Backup vor jeder Änderung** | Jede Konfigurationsänderung erfordert ein vollständiges Backup | 🔴 Kritisch |
| **P3 — Rollback-Fähigkeit** | Jede Änderung muss innerhalb von 60s rückgängig machbar sein | 🔴 Kritisch |
| **P4 — Pflichtkombination erhalten** | deepseek-v4-flash + deepseek-reasoner dürfen NICHT aus der combo-llm-Definition entfernt werden | 🟡 Hoch |
| **P5 — Staging vor Produktion** | Änderungen ZUERST in Staging testen | 🟡 Hoch |
| **P6 — Monitoring** | Laufende Überwachung der combo-llm-Gesundheit | 🟢 Mittel |

---

## 3. Geschützte Konfigurationsbereiche

### 3.1 `nexifyai-combo-llm` Kernkonfiguration (UNVERÄNDERLICH)

```yaml
nexifyai-combo-llm:
  # ⚠️  DISE FELDER SIND GESCHÜTZT — NICHT OHNE FREIGABE ÄNDERN
  routing:
    - model: deepseek-v4-flash     # 🔒 MUSS existieren
      mode: fast
    - model: deepseek-reasoner     # 🔒 MUSS existieren
      mode: deep
  logic:
    flash_threshold: "einfach"     # 🔒 Einfache Anfragen → flash
    deep_threshold: "komplex"      # 🔒 Komplexe Anfragen → reasoner
    combo_strategy: "flash_draft_reasoner_review"  # 🔒 Gemischt → combo
  timeout:
    flash: 30s                     # 🔒 Max 30s
    reasoner: 120s                 # 🔒 Max 120s
    combo: 150s                    # 🔒 Max 150s
```

### 3.2 Änderbare Konfiguration (MIT BACKUP)

```yaml
nexifyai-combo-llm:
  # ✅  DISE FELDER DÜRFEN NACH BACKUP GEÄNDERT WERDEN
  timeout:
    flash: [kann erhöht werden]    # Nur mit Begründung
    reasoner: [kann erhöht werden] # Nur mit Begründung
  fallback_chain:                  # Reihenfolge anpassbar
    - gpt-4o
    - claude-sonnet-4-20250514
    - gemini-2.5-flash
    - llama-4-scout
  health_check:
    interval: [30-120s]            # Anpassbar pro Modell
    timeout: [5-10s]               # Anpassbar pro Modell
```

---

## 4. Config-Backup-Protokoll

### 4.1 Backup vor jeder Änderung (PFLICHT)

```bash
# 1. Aktuelle Config exportieren
cp /pfad/zu/9router/config.yaml /pfad/zu/backups/9router_config_$(date +%Y%m%d_%H%M%S).yaml

# 2. Modellliste sichern
curl -s https://ai-router.nexifyai.cloud/v1/models > /pfad/zu/backups/models_$(date +%Y%m%d_%H%M%S).json

# 3. Health-Status dokumentieren
curl -s https://ai-router.nexifyai.cloud/v1/health > /pfad/zu/backups/health_$(date +%Y%m%d_%H%M%S).json
```

### 4.2 Backup-Verzeichnisstruktur

```
/pfad/zu/backups/
├── YYYYMMDD_HHMMSS_config.yaml      # Config-Backup
├── YYYYMMDD_HHMMSS_models.json      # Modellliste
├── YYYYMMDD_HHMMSS_health.json      # Health-Status
└── YYYYMMDD_HHMMSS_evidence.md      # 9ROUTER_SAFE_CHANGE_EVIDENCE.md
```

### 4.3 Backup-Aufbewahrung

| Kriterium | Wert |
|---|---|
| Mindestanzahl Backups | 10 letzte |
| Maximale Aufbewahrung | 30 Tage |
| Automatische Aufräumung | Hinterlässt immer die 10 neuesten |

---

## 5. Rollback-Protokoll

### 5.1 Rollback-Bedingungen

| Bedingung | Aktion | Max. Zeit |
|---|---|---|
| combo-llm antwortet nicht | Sofort-Rollback | 60s |
| Error-Rate > 10 % nach Änderung | Automatischer Rollback | 120s |
| Latenz > 200 % des vorherigen Werts | Manuelles Review / Rollback | 300s |
| deepseek-v4-flash fehlt in combo | **Sofort-Rollback erzwungen** | 30s |
| deepseek-reasoner fehlt in combo | **Sofort-Rollback erzwungen** | 30s |

### 5.2 Rollback-Befehl

```bash
# 1. Config zurücksetzen
cp /pfad/zu/backups/YYYYMMDD_HHMMSS_config.yaml /pfad/zu/9router/config.yaml

# 2. 9Router neu laden
systemctl reload 9router   # oder: docker restart 9router

# 3. Health-Check
curl -s https://ai-router.nexifyai.cloud/v1/health

# 4. combo-llm-Test
curl -s -X POST https://ai-router.nexifyai.cloud/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${NEXIFY_ROUTER_KEY}" \
  -d '{"model": "nexifyai-combo-llm", "messages": [{"role": "user", "content": "Status?"}], "max_tokens": 50}'
```

---

## 6. Schutzmassnahmen — Detailliert

### 6.1 Preventiv (vor Änderung)

1. **Config-Backup** → Pflicht (siehe 4.)
2. **IST-Modellliste sichern** → `GET /v1/models`
3. **Health-Check** → `GET /v1/health`
4. **Rollback-fähig prüfen** → Backup vorhanden? Befehl bekannt?
5. **Staging-Test** → Änderung zuerst in Staging-Umgebung

### 6.2 Detektiv (während Änderung)

1. **Error-Rate-Monitoring** → Automatische Erkennung von Fehlern
2. **Latenz-Monitoring** → P95 darf nicht > 30s steigen
3. **Modell-Liste prüfen** → deepseek-v4-flash + deepseek-reasoner müssen vorhanden sein
4. **Health-Endpunkt** → Muss 200 OK zurückgeben

### 6.3 Reaktiv (nach Änderung)

1. **Änderungs-Evidence dokumentieren** → `9ROUTER_SAFE_CHANGE_EVIDENCE.md`
2. **combo-llm-Test** → Einfache + komplexe Anfrage testen
3. **Fallback-Test** → Fallback-Kette provozieren
4. **Monitoring-Check** → Dashboards prüfen

---

## 7. Staging-Strategie

### 7.1 Staging-Umgebung

| Aspekt | Beschreibung |
|---|---|
| **URL** | `https://ai-router-staging.nexifyai.cloud/v1` |
| **Modell-Kopie** | Gleiche 7 Modelle (oder Mock) |
| **Daten** | Keine Produktivdaten |
| **Backup** | Separates Backup-Verzeichnis |

### 7.2 Staging-Prozess

```
1. Änderung in Staging deployen
2. Alle combo-llm-Tests durchführen (siehe Testplan)
3. Rollback in Staging testen
4. Evidence dokumentieren
5. Erst DANN in Produktion deployen
```

---

## 8. Monitoring

### 8.1 combo-llm-Spezifische Metriken

| Metrik | Beschreibung | Kritisch bei |
|---|---|---|
| **`combo_llm_health`** | Health-Status (0/1) | 0 |
| **`combo_llm_latency_flash`** | Flash-Latenz | > 30s |
| **`combo_llm_latency_reasoner`** | Reasoner-Latenz | > 120s |
| **`combo_llm_error_rate`** | Error-Rate | > 5 % |
| **`combo_llm_flash_deep_ratio`** | Verhältnis flash:deep | < 50:50 |
| **`combo_llm_models_present`** | Anzahl Modelle in combo | != 2 |

### 8.2 Alert-Regeln

| Name | Bedingung | Aktion |
|---|---|---|
| `combo-llm-down` | Health = 0 für 30s | 🔴 **Sofort-Rollback** |
| `combo-llm-high-error` | Error > 10 % | 🔴 **Automatischer Rollback** |
| `combo-llm-model-missing` | flash oder reasoner fehlt | 🔴 **Sofort-Rollback** |
| `combo-llm-latency-spike` | P95 > 30s | 🟡 Manuelles Review |

---

## 9. Fazit

| Aspekt | Status |
|---|---|
| **combo-llm geschützt** | ✅ Schutzziele definiert |
| **Backup-Pflicht** | ✅ Protokoll definiert |
| **Rollback-fähig** | ✅ Rollback-Protokoll definiert |
| **Pflichtkombination gesichert** | ✅ deepseek-v4-flash + deepseek-reasoner |
| **Staging** | ✅ Strategie definiert |
| **Monitoring** | ✅ Metriken + Alerts definiert |
| **No-Crash** | ⚠️ Siehe 9ROUTER_NO_CRASH_POLICY.md |
| **Implementierung** | ⏳ Ausstehend |

---

## 10. Referenzen

- `9ROUTER_CURRENT_STATE.md` — IST-Zustand
- `9ROUTER_NO_CRASH_POLICY.md` — No-Crash-Policy
- `9ROUTER_COMBO_LLM_TEST_PLAN.md` — Testplan
- `9ROUTER_SAFE_CHANGE_EVIDENCE.md` — Evidence-Template
- `9ROUTER_TARGET_STATE_V1.md` — Ursprünglicher Target State
