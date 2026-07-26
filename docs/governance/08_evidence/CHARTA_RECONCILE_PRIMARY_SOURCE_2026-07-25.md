# FILE: /docs/governance/08_evidence/CHARTA_RECONCILE_PRIMARY_SOURCE_2026-07-25.md
# NIR: 25.07.2026 01:50
# UPDATED: 25.07.2026 01:50
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: Evidence: Repo-Governance als Primärquelle; CHARTA §15/§16; F32 Eskalation.
# WHY: Chat-Charta und docs/governance/ konvergierten unabhängig — Rangfolge dokumentieren.
# BEST-PRACTICE: Funde mit Zählung, Pfaden und offenen Konflikten belegen; nicht raten.
# PITFALL: V-CHARTA-02: Normkonflikt §8 vs. Production-Freigabe nicht „wegharmonisieren“.
# DEPENDS: docs/governance/, design_guidelines.json
# DOCS-REF: docs/governance/CHARTA.md §16
# SESSION: bc-d485860d-ad48-4c90-9109-ca221d3b9368

# Charta-Rekonziliation — Primärquellen-Fund (2026-07-25)

## Ergebnis

| Aussage | Nachweis |
|---------|----------|
| Repo nicht bei 0% | Workspace geklont; Governance unter `docs/governance/` vorhanden |
| ~139 Governance-Dokumente / 14 Ordner | `find docs/governance -type f` ≈ 154–155 Dateien; 13 nummerierte Ordner + Root-Index (`GOVERNANCE.md`); Index nennt **139** Dokumente |
| §0–§13 bereits abgebildet | `GOVERNANCE.md` §0 Mapping-Tabelle |
| 6 Pre-Task-Gates vorhanden | `GOVERNANCE.md` §2.1 · `SOP_PRE_TASK_COMPLIANCE_V1.md` · `PRE_TASK_CHECKLIST_AUTOMATION.sh` |
| Design-System verbindlich | `design_guidelines.json` — Dark/Luxury, Outfit+Manrope, bg **`#0A0A0A`**, commit `00add563` (2026-07-04) |
| Chat-Charta = Auszug | Neu: `docs/governance/CHARTA.md` §0–§16 |

## Unabhängige Konvergenz

Chat-Charta und Repo-Governance beschreiben dieselbe §0–§13-Struktur (Modellstrategie, Monitoring, Circuit Breaker, Verifikation). Das validiert die Chat-Arbeit; macht sie aber zum **vereinfachten Auszug**, nicht zur Quelle.

## Offener Widerspruch (nicht aufgelöst)

- **A:** Charta §8 — volle Autonomie, wartet auf niemanden (Zyklus-Praxis / Mapping)
- **B:** `GOVERNANCE.md` §2.2 — „Kein interaktiver Eingriff in Produktionsprozesse ohne Freigabe“; `VERBOTE_UND_PFLICHTREGELN_V2.md` **V08** — keine autonome Aktion auf Production/Secrets/Delete
- **Aktion:** Eskalation → Register **F32** (CEO + CTO). Agent entscheidet nicht.

## Pre-Task-Gates dieser Session

Siehe `CHARTA.md` §16.4. Script-Checkliste im Cloud-Env: 2/6 PASS (Pfad-/Brain-/Skills-Abweichungen erwartet).

## Geänderte Artefakte

1. `docs/governance/CHARTA.md` (neu, §0–§16)
2. `docs/governance/GOVERNANCE.md` (Mapping §14–§16, F32-Hinweis)
3. `docs/governance/12_register/OFFENE_FRAGEN_REGISTER.md` (F32)
4. dieses Evidence-File
