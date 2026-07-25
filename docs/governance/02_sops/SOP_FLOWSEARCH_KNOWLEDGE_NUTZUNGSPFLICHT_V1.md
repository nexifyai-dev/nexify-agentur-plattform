# FILE: /docs/governance/02_sops/SOP_FLOWSEARCH_KNOWLEDGE_NUTZUNGSPFLICHT_V1.md
# NIR: 25.07.2026 02:30
# UPDATED: 25.07.2026 02:30
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: SOP — verpflichtende Vollintegration & Nutzung von FlowSearch/AFlow-Wissen.
# WHY: Research ohne Nutzungspflicht verpufft; Agenten müssen Quellen laden und anwenden.
# BEST-PRACTICE: Analog SKILL_FIRST — erst Knowledge/FlowSearch, dann Workflow-Bau.
# PITFALL: V-NUTZ-01: OpenReview-Challenge ≠ Quelle ignorieren — Spiegel (arXiv/GitHub/Synthesis) nutzen.
# DEPENDS: KNOWLEDGE_SOURCE_REGISTER_V1, backend/flowsearch, Pre-Task Gate FLOWSEARCH_KNOWLEDGE
# DOCS-REF: https://openreview.net/forum?id=z5uVAKwmjf
# SESSION: bc-d485860d-ad48-4c90-9109-ca221d3b9368

# SOP — FlowSearch & Knowledge Nutzungspflicht V1

**Status:** VERBINDLICH · **Version:** 1.0.0 · **Owner:** Systemmaster / CEO

## 1. Geltung

Gilt für **jeden** Agenten und Entwickler bei:

- Design/Änderung agentischer Workflows (Hermes, Paperclip, n8n, Backend-Agenten, Cron-Worker)
- LLM-Pipelines mit mehreren Schritten (Generate→Critique→…)
- Research-Integration zu Agentic Systems (AFlow/ADAS/…)

## 2. Nutzungspflicht (Kern)

```
VOR Workflow-Arbeit:
  1. KNOWLEDGE_SOURCE_REGISTER_V1 laden (Bereich A-FLOW / A-RES)
  2. KS-AFLOW-NX Synthesis lesen (kanonisch)
  3. Operator-Register laden
  4. FlowSearch offline ausführen ODER dokumentieren warum bestehender Seed bleibt
  5. Ergebnis in Evidence / last_flowsearch_result referenzieren
ERST DANN: Workflow implementieren oder ändern
```

**Leitsatz:** Kein handgebauter Multi-Step-Agent ohne FlowSearch-Abgleich.

## 3. Vollintegration (Soll = Ist)

| Schicht | Pflichtartefakt | Nachweis |
|---------|-----------------|----------|
| Quellen | DOC/KS-IDs im Official + Knowledge Register | Register-Diff |
| Wissen | Synthesis + Operator-Register | Dateipfade |
| Code | `backend/flowsearch` importierbar | `check_knowledge_mandate.py` |
| Gates | Pre-Task **FLOWSEARCH_KNOWLEDGE** | Checklist/Script |
| Governance | GOVERNANCE.md §2.1 + diese SOP | Index |
| Evidence | Run oder Waiver | `08_evidence/` |

## 4. Waiver (eng)

Nur erlaubt wenn:

- Task ist **kein** Workflow-/Agent-Design (reine Doku-Tippfehler, CSS, …), **oder**
- Circuit Breaker / Incident — schriftlich in Evidence, max. 72h, dann nachziehen

Waiver-Textpflicht: `FLOWSEARCH_WAIVER: <grund>`.

## 5. OpenReview Challenge

Wenn `https://openreview.net/forum?id=z5uVAKwmjf` eine Bot-Challenge liefert:

1. **Nicht abbrechen**  
2. Spiegel nutzen: arXiv `2410.10762` + GitHub FoundationAgents/AFlow + `KS-AFLOW-NX`  
3. Challenge in Evidence vermerken  

## 6. Verbote

- Workflow „aus dem Bauch“ ohne Operator-Register  
- AFlow nur zitieren, nie FlowSearch laufen lassen  
- Production-Cron mit MCTS-Live ohne F32  
- Kundendaten als Reward-Signal  

## 7. DONE-Kriterium

DONE nur wenn:

- [ ] Register-IDs genannt  
- [ ] Synthesis konsultiert  
- [ ] `python scripts/check_knowledge_mandate.py` exit 0  
- [ ] FlowSearch-Run **oder** Waiver  
- [ ] Evidence geschrieben  
