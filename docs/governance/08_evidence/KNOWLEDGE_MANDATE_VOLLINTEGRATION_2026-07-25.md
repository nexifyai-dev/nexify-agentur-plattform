# Evidence — Knowledge/FlowSearch Vollintegration + Nutzungspflicht

**Datum:** 2026-07-25  
**OpenReview:** https://openreview.net/forum?id=z5uVAKwmjf (Challenge möglich → Spiegel Pflicht)

## Auftrag

Alle Bereiche scannen, Wissen/Quellen verwalten, **verpflichtend vollintegriert**, **Nutzungspflicht**.

## Geliefert

| Artefakt | Pfad |
|----------|------|
| Knowledge Source Register | `12_register/KNOWLEDGE_SOURCE_REGISTER_V1.md` (+ JSON) |
| SOP Nutzungspflicht | `02_sops/SOP_FLOWSEARCH_KNOWLEDGE_NUTZUNGSPFLICHT_V1.md` |
| Regel | `01_regelwerke/FLOWSEARCH_KNOWLEDGE_FIRST_REGEL_V1.md` |
| Official Docs DOC-018–020 | Register MD+JSON |
| Gate 07 | `PRE_TASK_CHECKLIST_AUTOMATION.sh` |
| GOVERNANCE §2.1 | Gate FLOWSEARCH_KNOWLEDGE |
| Mandate checker | `scripts/check_knowledge_mandate.py` |
| Shared State | `knowledge_mandate` block |
| CLAUDE.md | Quickstart Nutzungspflicht |

## Verifikation

```bash
python scripts/check_knowledge_mandate.py
cd backend && pytest tests/test_knowledge_mandate.py tests/test_flowsearch.py -q
```

## Bereiche gescannt

A-GOV … A-DES inkl. A-FLOW (siehe Knowledge Register §1).
