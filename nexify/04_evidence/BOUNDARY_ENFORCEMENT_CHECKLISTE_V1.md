# Enforcement-Checkliste: Customer Boundary Enforcement

**Status**: VERBINDLICH | **Erstellt**: 2026-06-22
**Policy**: CUSTOMER_PROJECT_ISOLATION_POLICY_V1.md

---

## Pre-Commit (Gate 1) — Kundendaten-Check

| # | Prüfpunkt | Script | Automatisch? |
|---|----------|--------|-------------|
| C1 | Keine Kunden-PII in Staged Files | `pre-commit-customer-check.sh` | ✅ |
| C2 | Keine .env/Secrets committed | `pre-commit-customer-check.sh` | ✅ |
| C3 | Brain-Einträge: CUSTOMER_PROJECT Scope | `pre-commit-customer-check.sh` | ✅ |
| C4 | Keine Kundendaten in Evidence/Logs | `pre-commit-customer-check.sh` | ✅ |
| C5 | Kein Kundenprojekt-Code im Nexify-Kern | `pre-commit-customer-check.sh` | ✅ |

**Installation:**
```bash
cp /workspace/nexify/09_dispatcher/scripts/pre-commit-customer-check.sh \
   /workspace/nexifyai-platform/.git/hooks/pre-commit
chmod +x /workspace/nexifyai-platform/.git/hooks/pre-commit
```

---

## Pre-Push (Gate 2) — Tenant-Isolation-Check

| # | Prüfpunkt | Script | Automatisch? |
|---|----------|--------|-------------|
| T1 | Code-Trennung: Kein Kunden-Code im Kern | `pre-push-tenant-isolation.sh` | ✅ |
| T2 | Agent-Trennung: Keine globalen Kunden-Agenten | `pre-push-tenant-isolation.sh` | ✅ |
| T3 | Secret-Trennung: Keine Kunden-Secrets global | `pre-push-tenant-isolation.sh` | ✅ |
| T4 | Skills-Trennung | `pre-push-tenant-isolation.sh` | ✅ |
| T5 | Keine Cross-Customer-Vermischung | `pre-push-tenant-isolation.sh` | ✅ |

**Installation:**
```bash
cp /workspace/nexify/09_dispatcher/scripts/pre-push-tenant-isolation.sh \
   /workspace/nexifyai-platform/.git/hooks/pre-push
chmod +x /workspace/nexifyai-platform/.git/hooks/pre-push
```

---

## Pre-Deploy (Gate 3) — Boundary-Check

| # | Prüfpunkt | GitHub Actions | Automatisch? |
|---|----------|---------------|-------------|
| D1 | Docker-Compose Isolation | `boundary-enforcement.yml` | ✅ |
| D2 | Deployment/DNS-Trennung | `boundary-enforcement.yml` | ✅ |
| D3 | API-Key-Isolation | `boundary-enforcement.yml` | ✅ |
| D4 | Brain-Scope-Check | `boundary-enforcement.yml` | ✅ |
| D5 | Evidence-Isolation | `boundary-enforcement.yml` | ✅ |
| D6 | Generische Boundary-Checks | `boundary-enforcement.yml` | ✅ |

---

## Severity-Handling

| Severity | Aktion |
|----------|--------|
| **P0-BLOCK** | Commit/Push/Deploy wird verhindert. Incident wird erstellt. |
| **P1-WARN** | Warning im PR. Review vor Merge erforderlich. |

---

## Manuelle Prüfpunkte (Quartalsweise)

| # | Prüfpunkt | Verantwortlich |
|---|----------|---------------|
| M1 | Audit aller Kundenprojekt-Repos auf Isolation | Systemmaster |
| M2 | Prüfung Brain-Einträge auf Scope-Compliance | Systemmaster |
| M3 | Secret-Rotation für alle Kunden-API-Keys | Systemmaster |
| M4 | Docker-Compose Review (Isolation) | Systemmaster |
| M5 | Review dieser Checkliste | Systemmaster |

---

## Incident-Escalation

Bei P0-Verstoß:
1. `INC-BOUNDARY-{datum}-{nummer}` erstellen
2. Sofortiger Rollback wenn möglich
3. Systemmaster-Alert
4. Root-Cause innerhalb 24h

---

*Ende Enforcement-Checkliste V1*
