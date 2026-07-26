# FILE: /docs/architecture/9ROUTER_VOLLINTEGRATION.md
# NIR: 25.07.2026 01:55
# UPDATED: 25.07.2026 01:55
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Gesamtabstimmung 9router — Code, Env, Best Practices, Finetuning, Gates.
# WHY: Eine kanonische Integrationslage statt Drift zwischen Backend, Portal, Hermes, Docs.
# BEST-PRACTICE: Alle LLM-Calls über 9router; Kundentexte nur customer-safe Modelle.
# PITFALL: V-9R-02: Secrets nie in Git; Production-DB (`data.sqlite`) nur mit Freigabe (F32).
# DEPENDS: ai-router.nexifyai.cloud / :20128, backend/ninerouter.py
# DOCS-REF: docs/governance/GOVERNANCE.md §10–§12, SOP_9ROUTER_*, CHARTA §14
# SESSION: bc-d485860d-ad48-4c90-9109-ca221d3b9368

# 9router Vollintegration — Gesamtabstimmung

## 1. Rangfolge der Quellen

| Rang | Artefakt | Rolle |
|------|----------|-------|
| 1 | Live 9router auf VPS (`/docker/9router-6kxn/`, SQLite) | Runtime truth |
| 2 | `docs/governance/` + diese Datei | Betriebs-/Integrationsnorm |
| 3 | `backend/ninerouter.py` | Code-SSOT im Monorepo |
| 4 | Legacy `nexify/**/9router/**` Target-States | Historie / Detailpläne |

**Nicht im Monorepo:** Container-Compose unter `/docker/9router-6kxn/`.  
**DB-Pfad (VPS):** oft Docker-Volume `…/9router-6kxn_data/_data/db/data.sqlite`; Host-Pfad `~/.9router/db/data.sqlite` je nach Install. Änderungen an Provider-Keys/Combos = Production-Eingriff → **F32 / Freigabe**.

## 2. Integrationsmatrix (Soll = Ist nach diesem PR)

| Consumer | Base URL | Key Env | Default Model | Fallback |
|----------|----------|---------|---------------|----------|
| Website Backend (`server.py`) | `NINEROUTER_BASE_URL` | `NINEROUTER_API_KEY` | **Customer:** `CUSTOMER_MODEL=ds/deepseek-chat` · **Agent:** `PRIMARY_MODEL=nexifyai-combo-llm` | `FALLBACK_MODEL` |
| Portal proxy | `NINEROUTER_BASE_URL` (alias `OPENAI_BASE_URL`) | `NINEROUTER_API_KEY` \| `NINEROUTER_KEY` | client-supplied | — |
| Hermes (VPS) | `OPENAI_BASE_URL=http://127.0.0.1:20128/v1` | `OPENAI_API_KEY` (= system key) | `nexifyai-combo-llm` | combo-internal |
| Health | `/api/health` am Router + Backend `/api/health/llm` | — | — | — |

## 3. Best Practices

1. **Ein Router, viele Modelle** — nie Direct-Provider-Calls aus Website/Backend.
2. **Kundentexte ≠ Combo** — `nexifyai-combo-llm` / `deepseek-v4-pro` / `glm-5.2` können Reasoning leaken → nur `CUSTOMER_MODEL`.
3. **Salvage** — leeres `content` → `reasoning_content`; strip `<think>…</think>`.
4. **Echter Fallback** — nach Fehler/leerem Content auf `FALLBACK_MODEL` wechseln (nicht nur loggen).
5. **Key-Aliases** — `NINEROUTER_API_KEY` canonical; `NINEROUTER_KEY` / `OPENAI_API_KEY` akzeptiert.
6. **Cost-Brake** — `NINEROUTER_BUDGET_PCT`: >150 Abort, >200 P0 (GOVERNANCE Circuit Breaker).
7. **Secrets** — nur Env/Secret-Store; Rotation nach Chat-Exposure (SECURITY-INCIDENT-2026-07-11).
8. **Pre-Task Gates** — vor Config-Änderung an Live-Router: BRAIN_FIRST … TENANT_ISOLATION + Freigabe wenn Production.

## 4. Finetuning / Modellpolitik

| Use-case | Modell | Begründung |
|----------|--------|------------|
| Website Chat / Offer / Planner | `ds/deepseek-v4-flash` | saubere Antworten; `deepseek-chat` upstream retired |
| Agent / intern / Hermes | `nexifyai-combo-llm` / `nexifyai` | Multi-Provider-Redundanz |
| Fallback | `ds/deepseek-v4-flash` | stabil |
| Meiden (Customer) | `ds/deepseek-v4-pro*`, `glm-5.2` | reasoning_content / Leak |
| Meiden (alle) | `ds/deepseek-chat`, `ds/deepseek-reasoner` | Upstream 400 — nur v4-flash/pro |

**Combo-Kette (live SQLite `~/.9router/db/data.sqlite`, 2026-07-25):**  
`ds/deepseek-v4-flash` → `openrouter/deepseek/deepseek-v3.2` → `ds/deepseek-v4-pro`

### Finetuning-Hebel (ohne Production-Write aus dem Agent)

| Hebel | Wo | Hinweis |
|-------|-----|---------|
| Temperature / max_tokens | Backend Call-Sites | pro Endpoint justieren |
| Customer vs Agent Model | Env `CUSTOMER_MODEL` / `PRIMARY_MODEL` | ohne Router-Restart |
| Allowlist | `NINEROUTER_MODEL_ALLOWLIST` | harte Begrenzung |
| Budget | `NINEROUTER_BUDGET_PCT` | Cost-Brake |
| Combo-Reihenfolge | 9router SQLite / Dashboard | **Freigabe nötig** |
| RTK / Caveman | 9router Provider-Flags | siehe SOP + Open Questions F01–F06 |

## 5. Betriebschecks

```bash
# Modelle (Key nur in Env)
curl -sS -H "Authorization: Bearer $NINEROUTER_API_KEY" \
  "$NINEROUTER_BASE_URL/models" | head

# Health
curl -sf http://127.0.0.1:20128/api/health
curl -sf https://ai-router.nexifyai.cloud/api/health
curl -sf http://127.0.0.1:8001/api/health/llm   # backend port may vary

# Repo smoke
bash deploy/health-check.sh
cd backend && pytest tests/test_ninerouter.py -q
```

## 6. Abgleich Alt → Neu

| Vorher | Nachher |
|--------|---------|
| `llm_complete` retryte immer dasselbe Modell | Retry-Kette Primary → Fallback |
| Customer + Agent beide auf Combo | Customer → `CUSTOMER_MODEL` |
| Portal nur `NINEROUTER_KEY` + hardcoded `:20128` | Aliases + `NINEROUTER_BASE_URL` |
| Kein `/api/health/llm` | Endpoint vorhanden |
| Health-Script ohne 9router | `deploy/health-check.sh` prüft `:20128` + public |
| Docs drift (Target gpt-4o vs Live DeepSeek) | Diese Gesamtabstimmung = Live-Matrix |

## 7. Offene Punkte (nicht in diesem PR)

- Live-SQLite/Provider-Finetune auf VPS (braucht SSH + Freigabe F32)
- RTK/Headroom-Fragen F01–F06 im Open-Questions-Register
- Hermes-Profile auf VPS (liegen unter `/root/.hermes`, nicht im Monorepo)
- Prometheus-Scrape-Port in `14_production` Compose (8080 vs 20128) — separat bereinigen
