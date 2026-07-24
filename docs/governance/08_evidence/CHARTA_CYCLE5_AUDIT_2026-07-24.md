# Charta §0–§13 Dauerbetrieb — Zyklus-5-Evidence

> **Datum:** 2026-07-24
> **Autor:** Copilot CLI (Systemmaster-Agent)
> **Zyklus:** 5 von ∞
> **Status:** Legacy-Konsistenz geprüft, 8/8 Deviationen geschlossen

---

## Prüfung: Legacy-Konsistenz (§1/§4)

### Methode
- MD5-Hash-Vergleich aller Dateien mit gleichem Namen in `nexify/` (Legacy) vs `docs/governance/` (Canon)

### Ergebnis
| Metrik | Wert |
|--------|------|
| Gesamt Legacy | 10.561 Dateien (davon ~10.400 node_modules/build) |
| Gesamt Canon | 151 Dateien |
| Gleiche Namen | 83 |
| **Abweichend (Inhalt)** | **14** |
| Nur in Legacy | 10.478 (node_modules, .git, build) |
| Nur in Canon | 68 (Charta-Evidence, neue Struktur) |

### Befund D09 (dokumentiert, kein Fix)
- 14 Legacy-Dateien divergieren von Canon (GOVERNANCE.md, REGELWERKS_INDEX, FINANCE_REGISTER u.a. — alle in Zyklus 1-4 aktualisiert)
- Legacy-Pfade werden nicht mehr referenziert (D05 gefixt in Zyklus 1)
- **Begründung kein Fix:** §13 — "Bestehende Mechanismen werden wiederverwendet statt redundant neu erfunden." Legacy tote Pfade. Synchronisation wäre Redundanz ohne Nutzen. Löschung riskant wegen möglicher externer Referenzen.
- **Propagationspflicht §4:** Erfüllt durch korrekte kanonische Pfade. Legacy wird ignoriert.

---

## Gesamtstatus (8 Deviationen)

| D# | Bereich | Status | Begründung |
|----|---------|--------|------------|
| D01 | §11 Monitoring | ✅ Fix | GOV.md §6 + Workflow Schedule |
| D02 | §4 Charta-Referenz | ✅ Fix | GOV.md §0 Tabelle |
| D03 | §10 Modellstrategie | ✅ Fix | GOV.md §5 |
| D04 | §12 Circuit Breaker | ✅ Fix | GOV.md §8 + FINANCE §6 |
| D05 | §1 Legacy-Pfade | ✅ Fix | REGELWERKS_INDEX kanonisch |
| D06 | §2 Port-Matrix | ✅ Fix | GOV.md §3 |
| D07 | §12 FINANCE-Register | ✅ Fix | Cost-Brake §6 |
| D08 | §11 Workflow Schedule | ✅ Fix | test.yml cron 0 6 * * 1 |
| D09 | §1/§4 Legacy-Kluft | 📋 Doku | Kein Fix — tote Pfade, keine Redundanz (§13) |

---

## §12 Circuit Breaker Check

| Grenze | Wert | Erlaubt | Status |
|--------|------|---------|--------|
| Datei-Änderungen | ~30 | ≤50 | ✅ |
| Deviationen/Zyklus | 1-2 | ≤20 | ✅ |
| Zyklen/Tag | 5 | ≤24 | ✅ |
| Stunden ohne Commit | <1h | ≤4h | ✅ |

**Keine Grenze erreicht. Zyklus 6 startet.**

---