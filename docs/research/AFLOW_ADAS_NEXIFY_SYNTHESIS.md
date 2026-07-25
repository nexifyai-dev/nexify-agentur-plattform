# FILE: /docs/research/AFLOW_ADAS_NEXIFY_SYNTHESIS.md
# NIR: 25.07.2026 02:25
# UPDATED: 25.07.2026 02:25
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Scan/Vergleich/Kombination AFlow+ADAS+Verwandte → NeXify FlowSearch.
# WHY: OpenReview-Challenge blockiert Forum; proaktive Offline-Entwicklung ohne Production-Write.
# BEST-PRACTICE: AFlow-Operatoren+MCTS übernehmen; ADAS-Code-Raum nur Research; Gates hart.
# PITFALL: V-FLOW-01: Kein Live-MCTS auf VPS/Cron ohne F32; Reward nie mit Kundendaten.
# DEPENDS: docs/governance §10–§14, 9router (optional live), backend/flowsearch/
# DOCS-REF: https://openreview.net/forum?id=z5uVAKwmjf · arXiv:2410.10762 · arXiv:2408.08435
# SESSION: bc-d485860d-ad48-4c90-9109-ca221d3b9368

# ALLE scannen · vergleichen · kombinieren · entwickeln

> **VERPFLICHTEND / NUTZUNGSPFLICHT:**  
> `docs/governance/02_sops/SOP_FLOWSEARCH_KNOWLEDGE_NUTZUNGSPFLICHT_V1.md` · Gate **FLOWSEARCH_KNOWLEDGE** ·  
> Register: `12_register/KNOWLEDGE_SOURCE_REGISTER_V1.md` · Check: `python scripts/check_knowledge_mandate.py`

## 1. Gescannte Quellen

| ID | Werk | Typ | Zugang hier |
|----|------|-----|-------------|
| S1 | **AFlow** (ICLR 2025 Oral) OpenReview `z5uVAKwmjf` | Paper+Code | Forum/API: Challenge wall; arXiv PDF + GitHub README OK |
| S2 | **ADAS** / Meta Agent Search (Hu et al. 2024) | Paper | arXiv `2408.08435` |
| S3 | DSPy / Trace / GPTSwarm / AgentOptimizer / AutoFlow | Verwandte | Lit-Vergleich in AFlow/ADAS papers |
| S4 | NeXify `docs/governance/` SOPs + Gates | Primärbetrieb | lokal |
| S5 | NeXify Website LLM (`backend/server.py`) | Runtime | lokal |
| S6 | 9router Architektur / Cost-Brake | Runtime | Doku (+ optional API) |

## 2. Vergleichsmatrix

| Dimension | AFlow | ADAS | DSPy/TextGrad | GPTSwarm | **NeXify heute** | **NeXify FlowSearch (Ziel)** |
|-----------|-------|------|---------------|----------|------------------|------------------------------|
| Suchraum | Code-Workflow + **Operators** | Turing-complete Agent-Code | Prompt/Params in festem Graph | Graph-Kanten (RL) | Hand-SOPs + feste Pipelines | **Operator-Sequenzen** (AFlow-artig), gated |
| Suchalgo | **MCTS** + tree experience | Meta-Agent linear archive | Gradient/optimizers | RL | — | **UCT/MCTS-lite** offline |
| Feedback | Task score + cost | Task score | Metric on train set | Reward | Evidence / Gates (binär) | **Score − λ·cost − Gate-Penalty** |
| Human prior | Operator library | Seed archive | Templates | Graph prior | 6 Pre-Task Gates, Verbote | Operators **aus SOPs** + hard constraints |
| Cost-aware | Pareto reported | secondary | rare | rare | Budget env (geplant) | **Reward cost term** |
| Safety | Research benchmarks | Research | Research | Research | V08/F32 Production | **Offline-only default**; live opt-in |

**Urteil:** AFlow ist der beste Fit für NeXify (Operatoren + MCTS + Cost). ADAS ist zu offen für Production. DSPy ergänzt Prompt-Finetune *innerhalb* fester Operatoren.

## 3. Kombinierte Architektur — NeXify FlowSearch

```
┌─────────────────────────────────────────────────────────┐
│ Operator Register (JSON)                                 │
│  Generate · Critique · Revise · Structure · Evidence     │
│  BrainFirst · DocsFirst · SecretScan · TenantCheck …     │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│ Workflow = ordered list of operator IDs (+ params)       │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│ MCTS-lite Optimizer (select → expand → eval → backup)    │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│ Evaluator                                                │
│  Offline: deterministic NeXify smoke tasks               │
│  Live(opt): 9router CUSTOMER_MODEL only + budget brake   │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│ Artifacts: best workflow JSON + trajectory + evidence    │
│ NEVER auto-deploy to Hermes/Cron/VPS                     │
└─────────────────────────────────────────────────────────┘
```

### Harte Constraints (kombiniert aus Governance + Research)

1. Default `mode=offline` — kein Netzwerk.
2. Live-Mode nur mit `FLOWSEARCH_LIVE=1` + `NINEROUTER_API_KEY`; nur customer-safe models.
3. Verbotene Operatoren: `delete_prod`, `rotate_secret`, `ssh_exec` (nicht im Register).
4. Gate-Operatoren sind **pflicht** in jedem expandierten Workflow (BrainFirst/DocsFirst/Evidence) — analog Pre-Task §14.
5. Ergebnisse = Vorschläge; Promotion braucht Human/CEO (F32).

## 4. Proaktiv entwickelt (dieser PR)

| Artefakt | Pfad |
|----------|------|
| Operator-Register v1 | `docs/research/operators/NEXIFY_OPERATOR_REGISTER_V1.json` |
| FlowSearch Package | `backend/flowsearch/` |
| Offline CLI | `scripts/run_flowsearch_offline.py` |
| Unit Tests | `backend/tests/test_flowsearch.py` |
| Evidence | `docs/governance/08_evidence/FLOWSEARCH_OFFLINE_EVIDENCE_2026-07-25.md` |

## 5. Lauf

```bash
python scripts/run_flowsearch_offline.py --iterations 40
cd backend && python -m pytest tests/test_flowsearch.py -q
```

## 6. Nächste Ausbaustufen

1. Live-Eval-Adapter an 9router (Customer model) — Staging only.
2. Import handcrafted Website-Chat/Offer pipelines als Seed-Workflows.
3. Leaderboard JSON im Register (AFlow roadmap parity).
4. CEO-Entscheidung: Staging-Pilot ja/nein.
