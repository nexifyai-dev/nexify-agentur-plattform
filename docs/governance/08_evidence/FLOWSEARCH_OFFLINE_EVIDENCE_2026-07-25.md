# FILE: /docs/governance/08_evidence/FLOWSEARCH_OFFLINE_EVIDENCE_2026-07-25.md
# WHAT: Evidence — NeXify FlowSearch offline prototype from AFlow/ADAS synthesis.

## Auftrag

ALLE scannen, vergleichen, kombinieren und proaktiv entwickeln (OpenReview AFlow `z5uVAKwmjf`).

## Scan

- AFlow (ICLR 2025 Oral) — MCTS + operators + cost
- ADAS — meta-agent code search (zu offen für Prod)
- DSPy/TextGrad/GPTSwarm — verwandte, enger Suchraum
- NeXify SOPs + Pre-Task Gates §14

## Combine → Develop

| Deliverable | Path |
|-------------|------|
| Synthesis | `docs/research/AFLOW_ADAS_NEXIFY_SYNTHESIS.md` |
| Operators | `docs/research/operators/NEXIFY_OPERATOR_REGISTER_V1.json` |
| Package | `backend/flowsearch/` |
| CLI | `scripts/run_flowsearch_offline.py` |
| Tests | `backend/tests/test_flowsearch.py` |

## Verifikation

```bash
python scripts/run_flowsearch_offline.py --iterations 40
cd backend && python -m pytest tests/test_flowsearch.py -q
```

## Boundaries

- Offline default — no OpenReview/9router required
- No VPS/SQLite/Cron writes (F32)
- Results are proposals, not auto-deployed workflows
