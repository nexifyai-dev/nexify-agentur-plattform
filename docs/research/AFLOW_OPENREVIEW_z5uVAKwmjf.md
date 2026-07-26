# FILE: /docs/research/AFLOW_OPENREVIEW_z5uVAKwmjf.md
# NIR: 25.07.2026 02:20
# UPDATED: 25.07.2026 02:20
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Research brief — AFlow (ICLR 2025 Oral) mapped to NeXify agent stack.
# WHY: OpenReview forum blocked by bot-challenge; capture identity + NeXify relevance.
# BEST-PRACTICE: Cite OpenReview/arXiv/code; map ideas to existing governance before cloning code.
# PITFALL: V-RES-01: Do not vendor MetaGPT/AFlow into production without F32 Freigabe + Cost-Brake.
# DEPENDS: 9router, Paperclip/Hermes workflows, docs/governance §10–§12
# DOCS-REF: https://openreview.net/forum?id=z5uVAKwmjf · https://arxiv.org/abs/2410.10762
# SESSION: bc-d485860d-ad48-4c90-9109-ca221d3b9368

# AFlow — Automating Agentic Workflow Generation

| Feld | Wert |
|------|------|
| OpenReview | https://openreview.net/forum?id=z5uVAKwmjf |
| arXiv | https://arxiv.org/abs/2410.10762 · PDF `2410.10762` |
| Venue | **ICLR 2025 Oral** |
| Code | https://github.com/FoundationAgents/AFlow (also referenced via MetaGPT lineage) |
| Access note | Direct OpenReview HTML/API returned **ChallengeRequiredError /bot wall** from this cloud agent (2026-07-25); identity confirmed via ICLR/arXiv/GitHub |

## Abstract (kurz)

Agentic Workflows sind heute oft handgebaut. **AFlow** formuliert Workflow-Optimierung als Suche über **code-repräsentierte Graphen** (LLM-Knoten + Kanten) und exploriert den Raum mit **Monte Carlo Tree Search (MCTS)**: Code-Modifikation, baumförmige Experience, Execution-Feedback. Auf sechs Benchmarks ≈ **+5.7%** vs. SOTA; entdeckte Workflows lassen kleinere Modelle auf manchen Tasks **GPT-4o übertreffen bei ~4.55% der Inference-Kosten**.

## Kernideen

1. **Workflow-as-Code** — Knoten = vollständige LLM-Invokes (nicht Token-Schritte); Kanten = Daten-/Kontrollfluss.
2. **Operator-Library** — bekannte agentische Patterns (z. B. Critique/Refine, Ensemble) als Bausteine im Suchraum.
3. **MCTS-Schleife** — Soft mixed-probability Selection → LLM-Expansion → Execution → Backprop; Convergence-Kriterien stoppen die Suche.
4. **Cost/Performance-Tradeoff** — Optimierung kann günstigere Modelle + bessere Struktur kombinieren (direkte Relevanz zu 9router Cost-Brake / CUSTOMER vs AGENT models).

## Mapping auf NeXify

| AFlow-Konzept | NeXify-Gegenstück | Nächster Schritt (ohne Production-Write) |
|---------------|-------------------|------------------------------------------|
| Code-represented workflow | Paperclip Factory Jobs / Hermes Skills / n8n flows | Workflow-Inventory: welche Flows sind handgeschrieben? |
| Operator library | `docs/governance/02_sops/` + Skills unter `.agents/` / Hermes | Operator-Katalog (Critique, Plan, Tool-Call) als Register |
| MCTS search + feedback | Fehlt — heute feste SOPs + Pre-Task Gates | **Research spike**: Offline-Suche auf Staging-Tasks, nicht Live-VPS |
| Execution feedback | Evidence unter `08_evidence/`, Kanban-Register | Reward = Gate-Pass + Latency + `$` via 9router usage |
| Smaller model wins | `CUSTOMER_MODEL=ds/deepseek-chat` vs Combo | AFlow-ähnliche Eval: gleicher Task, Modell×Workflow-Matrix über 9router |
| Cost 4.55% of GPT-4o | `NINEROUTER_BUDGET_PCT` + FINANCE register | Benchmark-Harness an `ai-router` (kein SQLite-Eingriff) |

## Was wir bewusst *nicht* tun (jetzt)

- Kein Fork von AFlow/MetaGPT in Production (F32 / V08).
- Kein ungeprüftes Autogenerieren von Live-Cron/CEO-Worker-Skripten.
- Keine Secrets/Customer-Daten als MCTS-Reward-Signal.

## Empfohlene Folgeaufträge (P2)

1. **Lit-Gate:** AFlow + verwandte (ADAS, DsPy, TextGrad, AgentOptimizer) in `docs/research/` indexieren.
2. **Operator-Register v0:** 8–12 NeXify-Operatoren aus bestehenden SOPs extrahieren.
3. **Offline Eval Harness:** 3 interne Tasks (CRM-Reply, Offer-JSON, Ticket-Triage) × {combo, deepseek-chat} × {hand workflow, 1 AFlow-inspired variant}.
4. **Decision:** CEO/CTO — ob MCTS-Workflow-Search nur Research bleibt oder Staging-Pilot wird.

## Zitation

```bibtex
@inproceedings{zhang2025aflow,
  title={{AF}low: Automating Agentic Workflow Generation},
  author={Jiayi Zhang and Jinyu Xiang and Zhaoyang Yu and Fengwei Teng and Xiong-Hui Chen and Jiaqi Chen and Mingchen Zhuge and Xin Cheng and Sirui Hong and Jinlin Wang and Bingnan Zheng and Bang Liu and Yuyu Luo and Chenglin Wu},
  booktitle={The Thirteenth International Conference on Learning Representations},
  year={2025},
  url={https://openreview.net/forum?id=z5uVAKwmjf}
}
```
