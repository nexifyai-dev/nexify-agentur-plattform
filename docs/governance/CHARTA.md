# FILE: /docs/governance/CHARTA.md
# NIR: 25.07.2026 02:58
# UPDATED: 25.07.2026 02:58
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Vereinfachter Charta-Auszug §0–§16 — nicht Primärquelle.
# WHY: Chat-Charta konvergierte unabhängig mit docs/governance/; Rangfolge klären.
# BEST-PRACTICE: Bei Konflikt gilt docs/governance/ Ordnerbaum + GOVERNANCE.md.
# PITFALL: V-CHARTA-01: Auszug nie als Ersatz behandeln; F32 nicht selbst auflösen.
# DEPENDS: docs/governance/**, design_guidelines.json, Pre-Task Gates
# DOCS-REF: docs/governance/GOVERNANCE.md
# SESSION: bc-d485860d-ad48-4c90-9109-ca221d3b9368

# NeXify AI — Charta (vereinfachter Auszug)

> **Status:** BESTÄTIGTER AUSZUG · nicht Primärquelle  
> **Primärquelle:** `docs/governance/` (~139 Dokumente, 14 Ordner + `GOVERNANCE.md`)  
> **Rekonziliation:** 2026-07-25 — Chat-Charta ↔ Repo unabhängig konvergiert (§0–§13)

Bei Konflikt gilt die Primärquelle (siehe §16).

---

## §0 Geltungsbereich

VPS-Gesamtsystem, Kundenprojekte, NeXifyAI-Plattform. Verbindlich für jeden Agenten/Entwickler.

**Quelle:** `GOVERNANCE.md` · gesamtes `docs/governance/`

## §1 Auftrag & Datenbasis

Arbeit auf Server-/Festplatten-/Netzwerk-/Prozess-/Logdaten — nicht auf Annahmen.

**Quelle:** `01_regelwerke/`

## §2 Vollprüfung SOLL/IST

Lückenlose Prüfung, Abweichungsanalyse, Fix.

**Quelle:** `02_sops/` · `07_audits_reports/`

## §3 Integrationsprinzip

APIs, MCPs, Webhooks vollständig — keine Attrappen ohne Evidence.

**Erweitern statt Aushebeln (Pascal-Direktive 2026-08-07):** Jede Erweiterung verbindet
sich mit bestehenden Lösungen, stabilisiert und vollintegriert sie (WebUI-Panels,
Routen, i18n, Timer, Doku). Bestehende Systeme werden nie ohne Migrationspfad ersetzt.
Neue Fähigkeiten (z.B. LLM-Wiki, RSS) ergänzen das Gesamtsystem — als Optimierung,
nicht als Parallelwelt. Siehe ZENTRALE-KONFIGURATION §1a.

**Quelle:** `04_workflows/` (referenziert) · `08_evidence/`


## §4 Propagationspflicht

Standards fließen bei jeder Änderung in Doku, Register und Betrieb ein.

**Quelle:** alle Ordner unter `docs/governance/`

## §5 Fach-/Governance-Ebene

Fachexperten-Agenten pflegen Regelwerke nachvollziehbar.

**Quelle:** `01_regelwerke/` · `02_sops/`

## §6 Agenten-Architektur

Spezialagenten pro Bereich (CEO/CTO/CISO/Dev/Design/…).

**Quelle:** `11_fuehrung/`

## §7 Wissens-/Gedächtnisschicht

AgentMemory + LightRAG/Brain zentral; dauerhaftes Wissen speichern.

**Quelle:** `08_evidence/` · `12_register/` · Knowledge Source Register

## §8 Autonomie & Rückfragegrenzen

> Kurzform (Zyklus-Praxis): volle Autonomie im Auftrag, Änderungen protokollieren — solange keine harten Verbote greifen.

**Quelle:** `11_fuehrung/` · `08_evidence/CHARTA_CYCLE*.md`

⚠️ **OFFENER WIDERSPRUCH — nicht selbst auflösen → §16 / F32**  
`GOVERNANCE.md` §2.2: *„Kein interaktiver Eingriff in Produktionsprozesse ohne Freigabe“* (+ Verbot **V08**). Steht in Spannung zu §8-Autonomie. **Eskalation CEO/CTO.**

## §9 Betriebsrahmen

Live-Terminal, Deutsch, Best-Practice, voller Kontext.

**Quelle:** `13_betriebshandbuch/`

## §10 Modellstrategie

Upstage + DeepSeek / 9router, gestaffelt.

**Quelle:** `09_konzepte/` · 9router-Architektur

## §11 Monitoring

Durchgehende Überwachung.

**Quelle:** `07_audits_reports/` · `14_production/`

## §12 Circuit Breaker / Notabschaltung

Budget-/Iterationsgrenzen; Cost-Brake.

**Quelle:** `12_register/` · FINANCE-Register · GOVERNANCE Circuit Breaker

## §13 Verifikation vor Übernahme

Evidence vor „Done“; Ehrlichkeit.

**Quelle:** `10_quality_gates/` · `DONE_REGEL_V1.md`

## §14 Pre-Task-Gates (verbindlich vor jeder Aktion)

| # | Gate | Pflicht |
|---|------|---------|
| 1 | **BRAIN_FIRST** | Brain-/Memory-Query vor Änderung |
| 2 | **DOCS_FIRST** | `docs/governance/` / Official Docs vor Tool-Config |
| 3 | **SHARED_STATE** | `12_register/SHARED_AGENT_STATE.json` |
| 4 | **PRE_TASK_CHECKLIST** | `03_checklisten/PRE_TASK_CHECKLIST_AUTOMATION.sh` |
| 5 | **SECRET_SCAN** | Keine Secrets in Code/Config/Prompts |
| 6 | **TENANT_ISOLATION** | Kundenprojekte isoliert |
| 7 | **FLOWSEARCH_KNOWLEDGE** | Bei Workflow-Design: Knowledge/FlowSearch Nutzungspflicht |

**Quelle:** `GOVERNANCE.md` §2.1 · `SOP_PRE_TASK_COMPLIANCE_V1.md` · `SOP_FLOWSEARCH_KNOWLEDGE_NUTZUNGSPFLICHT_V1.md`

## §15 Design-System (verbindlich)

| Token | Wert |
|-------|------|
| Quelle | `/design_guidelines.json` (Emergent, 2026-07-04) |
| Theme / Archetype | Dark / Luxury (5) |
| Headings | Outfit |
| Body | Manrope |
| Background | **`#0A0A0A`** (nicht `#09090B`) |

Abweichungen vom Token-File sind Bugs.

**Quelle:** `design_guidelines.json` · Design-Quality-Gate · CI_BRAND_KONZEPT

## §16 Primärquellen-Rang & offener Widerspruch (2026-07-25)

### 16.1 Fund

Unter `docs/governance/` liegen bereits **~139** Governance-Dokumente mit §0–§13-Struktur — unabhängig konvergent zur Chat-Charta. Zusätzlich: Pre-Task-Gates, FlowSearch/Knowledge-Nutzungspflicht, Design-System.

### 16.2 Rangfolge

1. **Primär:** `docs/governance/` (+ `GOVERNANCE.md`)  
2. **Auszug:** diese `CHARTA.md`  
3. Chat-Erinnerung ohne Dateinachweis — nachrangig  

### 16.3 Eskalation F32 (ungeklärt)

| ID | Seite A | Seite B | Aktion |
|----|---------|---------|--------|
| **F32** | §8 volle Autonomie | GOVERNANCE §2.2 + V08: kein Production-Eingriff ohne Freigabe | **CEO/CTO — Agent entscheidet nicht** |

Register: `12_register/OFFENE_FRAGEN_REGISTER.md` → **F32**.

### 16.4 Pre-Task-Status dieser Rekonziliation

| Gate | Ergebnis |
|------|----------|
| DOCS_FIRST / SHARED_STATE / SECRET_SCAN / TENANT / FLOWSEARCH_KNOWLEDGE | ✅ |
| BRAIN_FIRST | ⚠️ brain unreachable; AgentMemory 200 |
| PRE_TASK_CHECKLIST Script | ⚠️ 3/7 (Cloud-Env Pfad-/Brain-/Skills-Drift) |

---

---

## §17 Systemvorgaben 2026-08-06 (Pascal-Direktive — verbindlich, systemweit)

Kanonisch: `docs/standards/ARBEITSVORGABEN-v2.2.md` · SOUL.md v2.2 · AgentMemory.

| # | Vorgabe | Kern |
|---|---------|------|
| 17.1 | **Abweichungs-Null-Toleranz** | Bei jeder Arbeit ALLE Abweichungen erkennen — auch nicht im Fokus (indirekte Abhängigkeiten, Nachbarsysteme). Ausnahmslos fixen, in Produktion bringen mit Ergebnis-Check + Qualitätskontrolle nach fest definierten Vorgaben. „Nur Fokus-Pfad geprüft" ≠ fertig. |
| 17.2 | **Betriebshandbuch-Pflicht** | Zu jedem System/Dienst Betriebshandbuch führen (Betrieb, Wartung, Troubleshooting, Wiederanlauf, Fehlerbehandlung). Fehler und Optimierungen erkennen UND umsetzen. |
| 17.3 | **Online-Recherchepflicht** | Ständige proaktive Tiefen-Recherche (Doku, Changelogs, Issues, Bestpraxis, Markt). Ergebnisse in AgentMemory + `~/.hermes/cron/output/`. |

*Primärquelle `docs/governance/` schlägt diesen Auszug. Offene Normkonflikte eskalieren — nicht raten.*

## Proaktiver Agentic-AI-Langlauf (Pascal-Direktive 2026-08-09, DAUERZUSTAND)

In ALLEN Daten, Dateien und Konfigurationen: proaktiv verbessern, Code verbessern UND vereinfachen (YAGNI), erweitern, optimieren — ohne auf Aufträge zu warten. Keine Ausnahmen von dieser Pflicht. (Volltext: ARBEITSVORGABEN §15, SOUL.md, ZK-Kopf.)
