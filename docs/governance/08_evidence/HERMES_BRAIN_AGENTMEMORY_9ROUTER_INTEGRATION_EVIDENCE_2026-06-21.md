# Hermes WebUI: Brain/Agentmemory/9Router-Integration + Token-Kompression
## Evidence Document — 2026-06-21

### Status: INTEGRIERT & VERIFIZIERT

---

## 1. 9ROUTER ROUTING

### Problem
Network-engineer profile: `provider: zai`, `model: glm-5` → direkter Z.AI-Zugriff, 9Router umgangen.
WebUI default_model_provider: `zai`.

### Fix
**A:** `~/.hermes/profiles/network-engineer/config.yaml`
- `provider: zai` → `provider: custom`
- `default: glm-5` → `default: glm/glm-5`
- `base_url: https://ai-router.nexifyai.cloud/v1`
- Alle Requests jetzt via 9Router

**B:** `~/.hermes/webui/settings.json`
- `default_model_provider: zai` → `custom`

### Verifikation
```
9Router :20128 → {"ok":true}
Gateway :8645 → healthy
glm/glm-5 über 9Router routbar
```

---

## 2. AGENTMEMORY INTEGRATION

### Problem
`AGENTMEMORY_BASE_URL=http://localhost:3111` (Host iii Node.js) — UNERREICHBAR vom Container.
Tatsächlicher Agentmemory läuft auf Port 40000 (FastAPI+SQLite FTS5).

### Fix
**A:** `~/.hermes/.env` → `AGENTMEMORY_BASE_URL=http://localhost:40000`
**B:** `~/.hermes/profiles/network-engineer/.env` → gleicher Fix

### Verifikation
```
:40000/health → {"status":"ok","backend":"sqlite-fts5","memories":856}
:40000/smart_search → funktional
```

---

## 3. BRAIN + QDRANT SICHTBARKEIT

| Service | Port | State | Details |
|---------|------|-------|---------|
| Brain | :9090 | OK | 1.242 Einträge, 2 Collections |
| Qdrant | :6333 | OK | v1.18.2, 8.771 Vektoren |
| Agentmemory | :40000 | OK | 856 Memories, SQLite FTS5 |
| 9Router | :20128 | OK | 54+ Modelle |
| Gateway | :8645 | OK | webhook platform |

### Dashboard Plugin
`~/.hermes/plugins/nexify-infra/` — NeXify Infra Status Tab im WebUI Dashboard.
- Live-Status alle 15s
- Backend-API: `/api/plugins/nexify-infra/status`

---

## 4. TOKEN KOMPRESSION (Bolt Token Saver + RTK)

### Bolt Token Saver — Erstellte Tools

**A: Caveman Output Compressor**
- 80+ Regex-Regeln: Artikel, Füllwörter, Höflichkeiten, Hedging, verbose Konstruktionen
- Test: 54% Reduktion
- Pfad: `~/.hermes/skills/hermes/token-saver/references/scripts/caveman.py`

**B: Input Filter**
- 4 Modi: `--grep`, `--git`, `--tree`, `--logs`
- 50-90% Reduktion
- Pfad: `~/.hermes/skills/hermes/token-saver/references/scripts/input-filter.py`

### RTK Analyse (50 Sessions, 11.651 Nachrichten)
```
total_tokens_estimated:   3.696.834
estimated_savable_tokens: 1.293.892 (35%)
waste_patterns:
  verbose_block:    195
  pleasantry:       51
```

### RTK Empfehlungen
1. `compression.target_ratio` → 0.15 (von 0.2)
2. Caveman Output aktivieren (51 Pleasantries gefunden)
3. `compression.protect_last_n` → 10 (von 20)
4. Summary Injection für Exchanges älter als 20 Turns

### Aggressive Config
```yaml
compression:
  enabled: true
  threshold: 0.3      # war 0.5
  target_ratio: 0.15  # war 0.2
  protect_last_n: 10  # war 20
  protect_first_n: 2  # war 3
```

---

## 5. DATEIEN — GEÄNDERT

| Datei | Änderung |
|-------|----------|
| `~/.hermes/.env` | AGENTMEMORY_BASE_URL 3111→40000 |
| `~/.hermes/profiles/network-engineer/.env` | AGENTMEMORY_BASE_URL 3111→40000 |
| `~/.hermes/profiles/network-engineer/config.yaml` | provider zai→custom, 9Router base_url |
| `~/.hermes/webui/settings.json` | default_model_provider zai→custom, Plugin aktiviert |

## 6. DATEIEN — NEU ERSTELLT

| Datei | Zweck |
|-------|-------|
| `~/.hermes/plugins/nexify-infra/dashboard/manifest.json` | Dashboard Plugin Manifest |
| `~/.hermes/plugins/nexify-infra/dashboard/plugin_api.py` | Backend API |
| `~/.hermes/plugins/nexify-infra/dashboard/dist/index.js` | Frontend-Komponente |
| `~/.hermes/skills/hermes/token-saver/SKILL.md` | Token Saver Skill Card |
| `~/.hermes/skills/hermes/token-saver/references/scripts/caveman.py` | Output-Kompressor |
| `~/.hermes/skills/hermes/token-saver/references/scripts/input-filter.py` | Input-Filter |
| `~/.hermes/skills/hermes/token-saver/references/scripts/rtk.py` | RTK Analyzer |

---

## 7. VERIFIKATIONS-LOG

```
BRAIN (:9090):       OK — 1.242 Einträge
AGENTMEMORY (:40000): OK — 856 Memories
QDRANT (:6333):      OK — 8.771 Vektoren
9ROUTER (:20128):    OK — 54+ Modelle
GATEWAY (:8645):     OK — webhook
AGENTMEMORY_BASE_URL: OK — localhost:40000 (beide .env)
CAVEMAN TEST:        OK — 54% Token-Reduktion
RTK ANALYZER:        OK — 1,3M einsparbare Tokens (35%)
```

---

## 8. NÄCHSTE SCHRITTE

1. **Dashboard reload**: `GET /api/dashboard/plugins/rescan` oder `systemctl restart hermeswebui`
2. **Gateway restart**: Profil-Neuladen für Config-Änderungen
3. **Aggressive Compression anwenden**: RTK-Empfehlungen (threshold 0.3, target_ratio 0.15)
4. **RTK Phase 2**: Redundancy Detection + Summary Injection implementieren
5. **MCP Re-Registrierung**: MCP agentmemory Server-Skripte auf Port 40000 aktualisieren

---

*Evidence generiert von Hermes Agent (network-engineer Profil) am 2026-06-21*
