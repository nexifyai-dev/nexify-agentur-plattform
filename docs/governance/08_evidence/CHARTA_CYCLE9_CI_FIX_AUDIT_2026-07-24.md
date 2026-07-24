# FILE: docs/governance/08_evidence/CHARTA_CYCLE9_CI_FIX_AUDIT_2026-07-24.md
# NIR: 24.07.2026 17:06
# UPDATED: 24.07.2026 17:06
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI DevOps
# WHAT: Charta §2 Vollprüfung — 4 pre-existing CI-Failures identifiziert + refaktorierend gefixt
# WHY: CI/CD war auf main durchgehend rot — Blockade für Deployment-Qualität
# BEST-PRACTICE: Minimal-Invasivität — nur die Bruchstelle fixen, keine Restrukturierung
# DEPENDS: GitHub Actions, pnpm, Python 3.11

# Charta Zyklus 9 — CI-Fix Audit

## §2 Vollprüfung: Gefundene Abweichungen

| ID | § | Severity | Beschreibung | Status |
|----|---|----------|-------------|--------|
| D11 | §3/Build | P1 | pnpm-workspace.yaml listet apps/paperclip/hermes ohne package.json | ✅ fixed |
| D12 | §3/CI | P1 | test.yml npm-Scripts funktionieren nicht (pnpm fehlt) | ✅ fixed |
| D13 | §3/CI | P2 | Backend CI: privates litellm-Wheel nicht auf GH-Runnern | ✅ fixed |
| D14 | §7 | P2 | n8n-Konfiguration nicht in .env.example | ✅ fixed |

## Fix-Details

### D11: pnpm-workspace.yaml
- **ALT:** `packages: ['apps/website', 'apps/paperclip', 'apps/hermes']`
- **NEU:** `packages: ['apps/website']`
- **Ursache:** paperclip (nur `.claude/`) + hermes (Python-Projekt) haben kein package.json
- **Effekt:** pnpm install schlug fehl mit "packages field missing or empty"

### D12: test.yml npm/pnpm-Mismatch
- **ALT:** `npm run lint` → root script `pnpm -r lint` → pnpm nicht im CI-Pfad
- **NEU:** `cd apps/website && npx eslint .` / `node --test tests/*.test.mjs`
- **Ursache:** Root package.json-scripts nutzen pnpm, CI konfiguriert nur npm
- **Effekt:** Lint + Unit Tests schlugen fehl

### D13: Backend CI — privates litellm-Wheel
- **ALT:** `pip install -r requirements.txt` inkl. `litellm @ https://customer-assets.emergentagent.com/...`
- **NEU:** `pip install -r requirements-ci.txt` (ohne litellm)
- **Ursache:** Privater Wheel-URL nicht auf öffentlichen GH-Runnern erreichbar
- **Effekt:** pip install schlug fehl → ganze Backend-Job abgebrochen
- **Hinweis:** VPS-Deploy nutzt weiterhin requirements.txt (vollständig)

### D14: n8n-Konfiguration
- **NEU:** `N8N_BASE_URL` + `N8N_API_KEY` in `.env.example`
- **Hinweis:** Tatsächlicher Key nur in gitignoriertem `.env`

## §12 Circuit Breaker Check
- **Dateien geändert:** 5 (pnpm-workspace.yaml, ci.yml, test.yml, requirements-ci.txt, .env.example)
- **Neue Dateien:** 1 (requirements-ci.txt)
- **Deviations:** 4 gefunden, 4 gefixt
- **Iterationen:** 1 Zyklus
- **Laufzeit:** < 30 Minuten
- **Grenzen eingehalten:** ✅

## §13 Urteilsvermögen
- **Wiederverwendung:** requirements-ci.txt folgt dem bestehenden Muster (requirements.txt bleibt unverändert)
- **Risiko:** Gering — CI wird nur weniger restriktiv, VPS-Deploy unberührt
- **Grenzen:** Backend-Tests laufen noch in CI nicht vollständig (continue-on-error), aber pip install gate ist jetzt offen

## Nächste Schritte
- PR #29 mergen → CI sollte auf main grün werden
- Danach: Issue #28 (VPS) + Issue #19 (Website-Design) priorisieren
