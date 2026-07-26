# FILE: /docs/governance/08_evidence/9ROUTER_VOLLINTEGRATION_EVIDENCE_2026-07-25.md
# NIR: 25.07.2026 01:55
# WHAT: Evidence — 9router Vollintegration im Monorepo (ohne Production-DB-Write).

## Scope

In-repo Integration + Gesamtabstimmung. **Kein** Schreiben in VPS `data.sqlite` (F32).

## Artefakte

| Pfad | Änderung |
|------|----------|
| `backend/ninerouter.py` | neu — Config, Allowlist, Customer-Safe, Fallback, Cost-Brake, Health |
| `backend/server.py` | nutzt `nine.complete/stream`; `/api/health/llm` |
| `backend/portal/server.py` | Key-Aliases + konfigurierbare Base-URL |
| `backend/.env.example` | CUSTOMER_MODEL, BUDGET, Aliases |
| `.env.example` | Root-Pointer |
| `deploy/health-check.sh` | :20128 + public ai-router |
| `docs/architecture/9ROUTER_VOLLINTEGRATION.md` | Gesamtabstimmung |
| `backend/tests/test_ninerouter.py` | Unit-Tests |

## Live-Probe (Session, Key nur ephemeral)

- `GET /v1/models` → HTTP 200, 67 Modelle (Key nicht persistiert)
- Secret-Scan: Key nicht in Git

## Tests

```bash
cd backend && pytest tests/test_ninerouter.py -q
```

## Pre-Task Gates

DOCS_FIRST / SHARED_STATE / SECRET_SCAN / TENANT_ISOLATION ✅ · BRAIN degraded (cloud) · kein Production-Eingriff.
