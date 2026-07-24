# Customer Boundary Enforcement — CI/CD Gates Definition
**Status**: VERBINDLICH | **Scope**: ALLE_REPOS | **Erstellt**: 2026-06-22
**Basierend auf**: CUSTOMER_PROJECT_ISOLATION_POLICY_V1.md

---

## 1. Übersicht: Drei Enforcement-Gates

```
Pre-Commit          Pre-Push            Pre-Deploy
  │                    │                   │
  ▼                    ▼                   ▼
┌──────────┐    ┌──────────────┐    ┌─────────────┐
│Kunden-   │    │ Tenant-      │    │ Boundary-   │
│Daten-Check│    │ Isolation-   │    │ Check       │
│          │    │ Check        │    │             │
└──────────┘    └──────────────┘    └─────────────┘
  │                    │                   │
  ▼                    ▼                   ▼
BLOCK bei Fail    BLOCK bei Fail     BLOCK bei Fail
```

---

## 2. Gate 1: Pre-Commit — Kundendaten-Check

**Trigger**: Jeder `git commit`
**Zweck**: Verhindert, dass Kundendaten/Kunden-PII committed wird

### Prüfpunkte:
| # | Check | Pattern | Severity |
|---|-------|---------|----------|
| C1 | Keine Kunden-PII in Staged Files | `@student`, `@kunde`, `@bookando` | P0-BLOCK |
| C2 | Keine Kundendaten in Brain-Einträgen | `kundendaten`, `studentendaten` | P0-BLOCK |
| C3 | Keine .env mit Kunden-Secrets | `*.env`, `.env.*` | P0-BLOCK |
| C4 | Keine Kundendaten in Logs | `log`, `*.log`, `*.json` (regex: email, IBAN) | P1-WARN |
| C5 | Scope-Tag Pflicht bei Customer-Brain | `CUSTOMER_PROJECT` scope | P1-WARN |

### Implementierung: `.git/hooks/pre-commit` + `scripts/check-customer-data.sh`

---

## 3. Gate 2: Pre-Push — Tenant-Isolation-Check

**Trigger**: Jeder `git push`
**Zweck**: Verhindert Cross-Tenant-Kontamination

### Prüfpunkte:
| # | Check | Beschreibung | Severity |
|---|-------|-------------|----------|
| T1 | Code-Trennung | Kein Kundenprojekt-Code in `/workspace/nexify/` | P0-BLOCK |
| T2 | Agent-Trennung | Keine Kunden-Agenten in globalen `/root/.claude/` | P0-BLOCK |
| T3 | Secret-Trennung | Keine Kunden-Secrets in `/root/.nexify/secrets/` | P0-BLOCK |
| T4 | Repo-Zuordnung | Dateien nur im richtigen Kunden-Repo | P1-WARN |
| T5 | Keine Cross-Customer-Mischung | Keine Daten zwischen Kundenprojekten | P0-BLOCK |

### Implementierung: `scripts/check-tenant-isolation.sh`

---

## 4. Gate 3: Pre-Deploy — Boundary-Check

**Trigger**: Vor jedem Deployment (GitHub Actions Workflow)
**Zweck**: Kompletter Boundary-Check vor Produktion

### Prüfpunkte:
| # | Check | Beschreibung | Severity |
|---|-------|-------------|----------|
| D1 | Docker-Compose Isolation | Getrennte Projekte auf Hostinger | P0-BLOCK |
| D2 | DNS-Zone-Trennung | Cloudflare: Separate Zonen pro Kunde | P0-BLOCK |
| D3 | API-Key-Isolation | 9Router/Resend: Getrennte Keys | P0-BLOCK |
| D4 | Brain-Scope-Check | Brain-Einträge: Scope=CUSTOMER_PROJECT | P1-WARN |
| D5 | Evidence-Isolation | Keine Kundendaten in Evidence | P0-BLOCK |
| D6 | Vercel-Team-Trennung | Separate Teams/Projekte | P1-WARN |

### Implementierung: GitHub Actions `.github/workflows/boundary-enforcement.yml`

---

## 5. Severity-Definitionen

| Severity | Aktion | Beschreibung |
|----------|--------|-------------|
| **P0-BLOCK** | Commit/Push/Deploy wird **verhindert** | Harte Policy-Verletzung |
| **P1-WARN** | Warning + Review-Pflicht | Soft-Gate, Review vor Merge |

---

## 6. Escalation

- Jeder P0-BLOCK → automatischer Incident (INC-BOUNDARY-*)
- Jeder P1-WARN → Review-Required im PR
- Wiederholte Verstöße → Systemmaster-Alert

---

*Ende Gate Definition V1*
