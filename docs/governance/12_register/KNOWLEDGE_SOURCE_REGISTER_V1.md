# FILE: /docs/governance/12_register/KNOWLEDGE_SOURCE_REGISTER_V1.md
# NIR: 25.07.2026 02:30
# UPDATED: 25.07.2026 02:30
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Verbindliches Wissens-/Quellenregister aller NeXify-Bereiche.
# WHY: Nutzungspflicht — kein agentischer Workflow ohne registrierte Primärquellen.
# BEST-PRACTICE: Jede Quelle hat ID, Typ, Pflichtpfad, Scan-Status, Owner.
# PITFALL: V-KS-01: OpenReview-Forum kann Bot-Challenge haben — arXiv/GitHub als Spiegel pflegen.
# DEPENDS: OFFICIAL_DOCS_SOURCE_REGISTER_V1, FlowSearch, docs/research/
# DOCS-REF: SOP_FLOWSEARCH_KNOWLEDGE_NUTZUNGSPFLICHT_V1.md
# SESSION: bc-d485860d-ad48-4c90-9109-ca221d3b9368

# Knowledge & Source Register V1 — VERBINDLICH

**Status:** AKTIV · **Nutzungspflicht:** JA · **Owner:** Systemmaster + CEO

## 0. Regel

Vor Arbeit an einem **Bereich** (unten) muss der Agent:

1. Bereich in dieser Tabelle identifizieren  
2. Primärquellen laden (Pfade/URLs)  
3. Bei agentischen Workflows zusätzlich **FlowSearch** (`backend/flowsearch` + Operator-Register) nutzen  
4. Evidence/Register aktualisieren  

Verstoß = kein DONE (siehe DONE_REGEL + Gate **FLOWSEARCH_KNOWLEDGE**).

## 1. Bereichs-Scan (ALLE)

| Bereich-ID | Bereich | Primärquellen (Pflicht) | Wissensartefakte | Status |
|------------|---------|-------------------------|------------------|--------|
| A-GOV | Governance / Charta / Gates | `docs/governance/GOVERNANCE.md`, `01_regelwerke/`, `10_quality_gates/` | Pre-Task 6(+1) Gates | ✅ indexed |
| A-SOP | SOPs / Checklisten | `docs/governance/02_sops/`, `03_checklisten/` | Auftrag-SOP V4 | ✅ indexed |
| A-REG | Register / Shared State | `docs/governance/12_register/` | dieses File + Official Docs | ✅ indexed |
| A-LLM | 9router / Modelle | `docs/architecture/9router-ai-architecture.md`, DOC-001/002/013 | Cost-Brake, Customer vs Agent | ✅ indexed |
| A-WEB | Website Backend LLM | `backend/server.py`, `backend/.env.example` | Chat/Offer/Planner | ✅ indexed |
| A-HER | Hermes / Paperclip | `memory/VPS_INFRA.md`, DOC-005 | Profile → 9router | ✅ indexed |
| A-MEM | Brain / AgentMemory | DOC-006, `02_sops/BRAIN_FIRST_*` | Brain-First Pflicht | ✅ indexed |
| A-SEC | Security / Secrets | `06_sicherheit_policies/`, SECURITY-INCIDENT | V01–V08 | ✅ indexed |
| A-OPS | VPS / Tunnel / Deploy | `memory/VPS_INFRA.md`, `deploy/` | C-07 SSH, cloudflared | ✅ indexed |
| A-NET | Cursor Egress / Network | `deploy/network/CURSOR_EGRESS_ALLOWLIST.md` | Settings→Network Domains | ⚠ PR-abhängig |
| A-FLOW | **Agentic Workflow Search** | **KS-AFLOW-*** (unten), `backend/flowsearch/`, Operator-Register | **Nutzungspflicht** | ✅ **MANDATORY** |
| A-RES | Research / Papers | `docs/research/` | AFlow/ADAS Synthesis | ✅ indexed |
| A-DES | Design System | `design_guidelines.json` | Dark/Luxury `#0A0A0A` | ✅ indexed |

## 2. Research-/Paper-Quellen (AFlow-Cluster)

| ID | Titel | Canonical URL | Spiegel (wenn Challenge) | Pflichtnutzung |
|----|-------|---------------|--------------------------|----------------|
| KS-AFLOW-OR | AFlow OpenReview Forum | https://openreview.net/forum?id=z5uVAKwmjf | arXiv + GitHub | Ja bei Workflow-Design |
| KS-AFLOW-ARX | AFlow arXiv | https://arxiv.org/abs/2410.10762 | PDF `2410.10762` | Ja |
| KS-AFLOW-GH | AFlow Code | https://github.com/FoundationAgents/AFlow | — | Ja (Operators/MCTS-Ideen) |
| KS-AFLOW-NX | NeXify Synthesis | `docs/research/AFLOW_ADAS_NEXIFY_SYNTHESIS.md` | — | **Ja — kanonisch intern** |
| KS-ADAS-ARX | ADAS Meta Agent Search | https://arxiv.org/abs/2408.08435 | — | Ja (Abgrenzung) |
| KS-OP-REG | Operator Register v1 | `docs/research/operators/NEXIFY_OPERATOR_REGISTER_V1.json` | — | **Ja — Code-SSOT** |
| KS-FLOW-PKG | FlowSearch Package | `backend/flowsearch/` | — | **Ja — Nutzungspflicht** |

## 3. Wissensverwaltung (Prozess)

```
Neue Quelle entdecken
→ ID vergeben (DOC-* oder KS-*)
→ Official Docs Register UND/ODER dieses Register pflegen
→ JSON-Spiegel aktualisieren (official-docs-source-register-v1.json / knowledge-source-register-v1.json)
→ Bei Workflow-Relevanz: Operator-Register + FlowSearch Seeds erweitern
→ Evidence + Brain/agentmemory Pending
```

## 4. Nutzungspflicht-Trigger

| Trigger | Pflichtaktion |
|---------|---------------|
| Neuer/geänderter agentischer Workflow | FlowSearch offline run ODER Begründung warum Seed unverändert |
| Neue LLM-Pipeline (Chat/Offer/Agent) | Operator-Register prüfen; Customer-safe Modelle |
| Research-Paper zu Agents | KS-* Eintrag + Synthesis-Abgleich |
| Tool/MCP Integration | DOC-* + Docs-First Checkliste |

## 5. Automatisierte Prüfung

```bash
python scripts/check_knowledge_mandate.py
```

Exit ≠ 0 → Gate FAIL.
