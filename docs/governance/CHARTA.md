# FILE: /docs/governance/CHARTA.md
# NIR: 25.07.2026 01:50
# UPDATED: 25.07.2026 01:50
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Vereinfachter Charta-Auszug §0–§16 für Agenten-Betrieb.
# WHY: Schnelle Orientierung; verbindliche Primärquelle bleibt docs/governance/.
# BEST-PRACTICE: Bei Widerspruch zwischen Auszug und Ordnerbaum gilt der Ordnerbaum.
# PITFALL: V-CHARTA-01: Diesen Auszug nie als Ersatz für die 139 Governance-Dokumente behandeln.
# DEPENDS: docs/governance/**, design_guidelines.json, Pre-Task 6 Gates
# DOCS-REF: docs/governance/GOVERNANCE.md
# SESSION: bc-d485860d-ad48-4c90-9109-ca221d3b9368

# NeXify AI — Charta (vereinfachter Auszug)

> **Status:** BESTÄTIGTER AUSZUG · nicht Primärquelle  
> **Primärquelle:** `docs/governance/` (139 Dokumente, 14 Ordner + `GOVERNANCE.md`)  
> **Stand Fund:** 2026-07-25 — unabhängige Konvergenz Chat-Charta ↔ Repo-Governance (§0–§13)

Dieses Dokument ist der **vereinfachte Betriebsauszug**. Wortlaut, Policies, SOPs, Register und Evidence liegen in `docs/governance/`. Bei Konflikt gilt die Primärquelle (siehe §16).

---

## §0 Geltungsbereich

VPS-Gesamtsystem, Kundenprojekte und NeXifyAI-Plattform. Jeder Agent/Entwickler ist gebunden.

**Quelle:** `GOVERNANCE.md` §0 · gesamtes `docs/governance/`

## §1 Auftrag & Datenbasis

Arbeit stützt sich auf Server-, Festplatten-, Netzwerk-, Prozess- und Logdaten — nicht auf Annahmen.

**Quelle:** `01_regelwerke/`

## §2 Vollprüfung SOLL/IST

Lückenlose Prüfung, Abweichungsanalyse, Fix. Kein „gefühlt fertig“.

**Quelle:** `02_sops/` · `07_audits_reports/`

## §3 Integrationsprinzip

APIs, MCPs, Webhooks vollständig integrieren — keine Attrappen ohne Evidence.

**Quelle:** `04_workflows/` (referenziert) · Evidence in `08_evidence/`

## §4 Propagationspflicht

Standards fließen bei jeder Änderung neu in Doku, Register und Betrieb ein.

**Quelle:** alle Ordner unter `docs/governance/`

## §5 Fach-/Governance-Ebene

Fachexperten-Agenten pflegen Regelwerke; Änderungen sind nachvollziehbar.

**Quelle:** `01_regelwerke/` · `02_sops/`

## §6 Agenten-Architektur

Spezialagenten pro Bereich (CEO/CTO/CISO/Dev/Design/…).

**Quelle:** `11_fuehrung/`

## §7 Wissens-/Gedächtnisschicht

AgentMemory + LightRAG / Brain zentral; dauerhaftes Wissen speichern.

**Quelle:** `08_evidence/` · `12_register/`

## §8 Autonomie & Rückfragegrenzen

> Charta-Kurzform (Zyklus-Praxis): volle Autonomie im Auftrag, Änderungen protokollieren, nicht auf Freigabe warten — solange keine harten Verbote greifen.

**Quelle (Mapping):** `11_fuehrung/` · Zyklus-Evidence `08_evidence/CHARTA_CYCLE*.md`

⚠️ **OFFENER WIDERSPRUCH — nicht selbst auflösen → §16 / F32**  
`GOVERNANCE.md` §2.2 listet als verbindliches Verbot: *„Kein interaktiver Eingriff in Produktionsprozesse ohne Freigabe“* (eng verwandt mit `VERBOTE_UND_PFLICHTREGELN_V2.md` **V08**: *Keine autonome Aktion auf Production/Secrets/Delete*). Das steht in Spannung zu §8-Autonomie. **Eskalation an Owner (CEO/CTO), keine einseitige Interpretation.**

## §9 Betriebsrahmen

Live-Terminal, Deutsch, Best-Practice, voller Kontext.

**Quelle:** `13_betriebshandbuch/`

## §10 Modellstrategie

Upstage + DeepSeek, gestaffelte Migration / Routing über 9Router.

**Quelle:** `09_konzepte/`

## §11 Monitoring

Durchgehende Überwachung aller Komponenten.

**Quelle:** `07_audits_reports/` · `14_production/`

## §12 Circuit Breaker / Notabschaltung

Budget- und Iterationsgrenzen; Cost-Brake / Task-Abbruch bei Überschreitung.

**Quelle:** `12_register/` · `GOVERNANCE.md` §8 Circuit Breaker · `FINANCE_COST_VALUE_MARGIN_REGISTER.md`

## §13 Verifikation vor Übernahme

Ehrlichkeit: behaupten nur, was geprüft ist. Evidence vor „Done“.

**Quelle:** `10_quality_gates/` · `01_regelwerke/DONE_REGEL_V1.md`

## §14 Pre-Task-Gates (verbindlich vor jeder Aktion)

Vor **jeder** nicht-trivialen Aktion müssen alle 6 Gates geprüft sein:

| # | Gate | Pflicht |
|---|------|---------|
| 1 | **BRAIN_FIRST** | Brain-/Memory-Query vor Änderung |
| 2 | **DOCS_FIRST** | Offizielle Docs / `docs/governance/` vor Tool-Config |
| 3 | **SHARED_STATE** | `12_register/SHARED_AGENT_STATE.json` konsultieren |
| 4 | **PRE_TASK_CHECKLIST** | `03_checklisten/PRE_TASK_CHECKLIST_AUTOMATION.sh` |
| 5 | **SECRET_SCAN** | Keine Secrets in Code/Config/Prompts |
| 6 | **TENANT_ISOLATION** | Kundenprojekte isoliert |

**Quelle:** `GOVERNANCE.md` §2.1 · `02_sops/SOP_PRE_TASK_COMPLIANCE_V1.md` · `06_sicherheit_policies/BRAIN_FIRST_POLICY_V1.md` · `OFFICIAL_DOCS_FIRST_POLICY_V1.md` · `CUSTOMER_PROJECT_ISOLATION_POLICY.md`

## §15 Design-System (verbindlich)

| Token | Wert |
|-------|------|
| Quelle | `/design_guidelines.json` (Emergent-Ausgabe, auto-commit 2026-07-04) |
| Theme / Archetype | Dark / Luxury (5) |
| Headings | Outfit |
| Body | Manrope |
| Background | **`#0A0A0A`** (nicht `#09090B`) |
| Surface | `rgba(255,255,255,0.03)` · Border `rgba(255,255,255,0.1)` |
| Accent | `#E0E0E0` / `#9E9E9E` |

Abweichungen vom Token-File sind Bugs, keine Stilfreiheit.

**Quelle:** `design_guidelines.json` · `10_quality_gates/DESIGN_QUALITY_GATE_FULL_TEXT_DE.md` · `09_konzepte/CI_BRAND_KONZEPT.md`

## §16 Primärquellen-Fund & offener Widerspruch (2026-07-25)

### 16.1 Fund

Das Repo ist **nicht** bei 0%. Unter `docs/governance/` liegen bereits **139** Governance-Dokumente in **14** Ordnern mit derselben §0–§13-Struktur, die in der Chat-Charta unabhängig konvergiert wurde (nicht kopiert): Modellstrategie, Monitoring, Circuit Breaker, Verifikation vor Übernahme — bereits länger vorhanden.

Zusätzlich vorhanden (im Chat-Auszug zuvor fehlend): die **6 Pre-Task-Gates** (§14).

### 16.2 Rangfolge

1. **Primär:** `docs/governance/` (Ordnerbaum + `GOVERNANCE.md`)  
2. **Auszug:** diese `CHARTA.md` — bestätigt die Struktur, ersetzt sie nicht  
3. Chat-Erinnerungen ohne Dateinachweis — nachrangig

### 16.3 Eskalation (ungeklärt — nicht selbst auflösen)

| ID | Konflikt | Seite A | Seite B | Aktion |
|----|----------|---------|---------|--------|
| **F32** | Produktions-Eingriff | Charta §8: volle Autonomie, wartet auf niemanden | `GOVERNANCE.md` §2.2 + Verbote **V08**: kein interaktiver/autonomer Eingriff in Production ohne Freigabe | **Eskalation CEO/CTO** — Agent entscheidet nicht |

Register-Eintrag: `12_register/OFFENE_FRAGEN_REGISTER.md` → **F32**.

### 16.4 Pre-Task-Gate-Status dieser Rekonziliation (Cloud-Agent)

| Gate | Ergebnis | Hinweis |
|------|----------|---------|
| BRAIN_FIRST | ⚠️ DEGRADED | `brain.nexifyai.cloud` von Cloud-Agent unreachable; AgentMemory HTTP 200 |
| DOCS_FIRST | ✅ | `docs/governance/` gelesen |
| SHARED_STATE | ✅ | `SHARED_AGENT_STATE.json` gelesen |
| PRE_TASK_CHECKLIST | ⚠️ 2/6 Script-Gates | MASTER_PLAN-Pfad / Brain / Skills / customers im Cloud-Env abweichend |
| SECRET_SCAN | ✅ | keine Secrets in dieser Änderung |
| TENANT_ISOLATION | ✅ | nur Governance-Doku, kein Customer-Write |

---

*Bei Widerspruch: Primärquelle `docs/governance/` schlägt diesen Auszug. Offene Normkonflikte eskalieren — nicht raten.*
