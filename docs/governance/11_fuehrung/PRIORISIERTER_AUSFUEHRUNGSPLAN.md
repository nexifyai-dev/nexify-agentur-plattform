# Offene Tasks — Priorisierter Ausführungsplan

**Datum:** 2026-06-23
**Agent:** Systemmaster Agent
**Status:** AKTIV

---

## Phase 1: P0 abschließen (23.–29. Juni 2026)

### Sprint 1.1: Operations-Policies (Tag 1–2)

| # | Task | Datei(en) | Owner | Aufwand | DoD |
|---|------|-----------|-------|---------|-----|
| 1 | Change Management Policy | `03_regelwerke/CHANGE_MANAGEMENT_POLICY.md` + `.json` | Systemmaster | 45min | find + wc bestätigt |
| 2 | Incident Response Policy | `03_regelwerke/INCIDENT_RESPONSE_POLICY.md` + `.json` | Systemmaster | 45min | find + wc bestätigt |
| 3 | Backup/Restore/DR Policy | `03_regelwerke/BACKUP_RESTORE_DR_POLICY.md` + `.json` | Systemmaster | 45min | find + wc bestätigt |

**Normbasis:** ISO 27001, BSI IT-Grundschutz (aus Sicherheitsplan 03_sicherheitsplan.md)

### Sprint 1.2: Missing Artifacts (Tag 2–3)

| # | Task | Datei(en) | Owner | Aufwand | DoD |
|---|------|-----------|-------|---------|-----|
| 4 | Customer Isolation Policy (MD) | `04_register/CUSTOMER_PROJECT_ISOLATION_POLICY.md` | Systemmaster | 30min | MD+JSON Paar vollständig |
| 5 | Customer Data Classification (MD) | `04_register/CUSTOMER_DATA_CLASSIFICATION_POLICY.md` | Systemmaster | 30min | MD+JSON Paar vollständig |
| 6 | Source Coverage Gap Report (MD) | `30_operating_data/NEXIFY_SOURCE_COVERAGE_GAP_REPORT.md` | Systemmaster | 30min | MD+JSON Paar vollständig |

### Sprint 1.3: Real Progress Gate (Tag 3–4)

| # | Task | Datei(en) | Owner | Aufwand | DoD |
|---|------|-----------|-------|---------|-----|
| 7 | Real Progress Audit | `03_regelwerke/REAL_PROGRESS_AUDIT_V1.md` | Systemmaster | 1h | Alle MA-IDs geprüft |
| 8 | Real Progress Gate V1 | `03_regelwerke/REAL_PROGRESS_GATE_V1.md` | Systemmaster | 1h | Gate-Regel: find+wc+git diff |

### Sprint 1.4: Infrastruktur (Tag 4–5)

| # | Task | Aktion | Owner | Aufwand | DoD |
|---|------|--------|-------|---------|-----|
| 9 | K-022: MongoDB | Docker-Container starten, API testen | Betrieb | 30min | API antwortet |
| 10 | K-023: Qdrant Rules | Brain-Regeln in nexifyai_rules vektorisieren | Brain | 1h | Points > 0 |

---

## Phase 2: P1 abarbeiten (30. Juni – 6. Juli 2026)

### Sprint 2.1: Dokumentation finalisieren (Tag 1–3)

| # | Task | Basis | Owner | Aufwand | Gate |
|---|------|-------|-------|---------|------|
| 1 | K-019: Betriebshandbuch | CEO-Bericht `02_betriebshandbuch.md` (7.143 B) erweitern | Betrieb | 2h | Review |
| 2 | K-020: Security-Handbuch | CEO-Bericht `03_sicherheitsplan.md` (4.866 B) ableiten | Security | 2h | Approval |
| 3 | K-021: Drift Checks SOP | CI/CD-Pipeline-Definition | DevOps | 1h | Approval |

### Sprint 2.2: Sales & CRM (Tag 3–5)

| # | Task | Gate | Owner | Aufwand | Abhängigkeit |
|---|------|------|-------|---------|--------------|
| 4 | K-013: Website-Portal-Blueprint | Review | Sales/UX | 1h | CEO-Review |
| 5 | K-014: KI-Berater-SOP | Datenschutz | Backend | 2h | DSGVO-Prüfung |
| 6 | K-015: Angebots-SOP | Mail-Gate | Sales | 2h | Resend API-Key (GAP-06) |
| 7 | K-016: Lead-to-CRM-SOP | Legal Gate | Sales | 2h | Rechtsberatung |

### Sprint 2.3: Technische Register (Tag 5–7)

| # | Task | Owner | Aufwand | Abhängigkeit |
|---|------|-------|---------|--------------|
| 8 | K-017: Oracle Folgeauftrag | Systemmaster | 2h | Kanonisierung abgeschlossen |
| 9 | K-018: 9Router Register | Routing | 1h | No-Full-Crash-Policy |

---

## Phase 3: P2/P3 und Lücken (7.–13. Juli 2026)

### Sprint 3.1: Verzeichnisse befüllen (Tag 1–3)

| # | Task | Quelle | Aufwand |
|---|------|--------|---------|
| 1 | K-024: 16_din_iso | CEO-Bericht Normenmatrix (20+ Normen) | 1h |
| 2 | K-025: 27_audits | ISO 19011 Audit-Methodik | 1h |
| 3 | K-026: 28_feedbackschleifen | Feedback-Loop SOP | 1h |
| 4 | K-027: 29_self_optimization | Self-Optimization Register | 1h |

### Sprint 3.2: Externe Services (Tag 3–5)

| # | Task | Service | Aufwand |
|---|------|---------|---------|
| 5 | GAP-01: Hostinger Firewall | MCP (139 Tools) | 30min |
| 6 | GAP-02: Studienkolleg Profil | CUSTOMER_PROJECT | 30min |
| 7 | GAP-03: Bookando Profil | CUSTOMER_PROJECT | 30min |
| 8 | GAP-06: API-Keys | Knowledge-Work-Plugins | 30min |

### Sprint 3.3: Runtime-Aufräumen (Tag 5–7)

| # | Task | Aufwand |
|---|------|---------|
| 9 | Qdrant projects + rules befüllen | 1h |
| 10 | Retention Policy Cron implementieren | 2h |
| 11 | Stale Orchestration Tasks cancellen | 15min |

---

## Gate-Dependencies (Blocker)

```
K-016 (Lead-to-CRM-SOP)     ← Legal Gate (Rechtsberatung erforderlich)
K-014 (KI-Berater-SOP)       ← Datenschutz (DSGVO-Prüfung)
K-015 (Angebots-SOP)         ← Mail-Gate (Resend API-Key)
K-013 (Website-Blueprint)    ← Review (CEO-Freigabe)
K-019 (Betriebshandbuch)     ← Review (CEO-Freigabe)
K-020 (Security-Handbuch)    ← Approval (Geschäftsführung)
K-021 (Drift Checks SOP)     ← Approval (Geschäftsführung)
K-017 (Oracle Folgeauftrag)  ← Review (Kanonisierung abgeschlossen)
K-018 (9Router Register)     ← No-Full-Crash (kein Live-Test)
K-022 (MongoDB)              ← No-Full-Crash (Container-Start)
Secret Rotation              ← WAITING_FOR_APPROVAL (CEO)
Git Push/Merge               ← Gate-pflichtig
DNS/Cloudflare               ← Gate-pflichtig
```

---

## Erfolgskriterien

| Kriterium | Ziel | Messung |
|-----------|------|---------|
| P0-Tasks abgeschlossen | 5/5 | TASK_REGISTRY_V1 DONE |
| P1-Tasks abgeschlossen | 9/9 | KANBAN_V3 DONE |
| P2/P3-Tasks abgeschlossen | 9/9 | KANBAN_V3 DONE |
| Missing Artifacts | 0 PENDING | MA-Register leer |
| Qdrant Lücken | 0 Collections mit 0 Points | Qdrant API |
| Stale Tasks | 0 | tasks.jsonl keine RETRY_SCHEDULED |
| Gesamt-Fortschritt | >90% | 112 Tasks, >101 DONE |

---

*Erstellt: 2026-06-23 | Systemmaster Agent | NeXify AI OS*
