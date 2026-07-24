# P2-Task 8 — Penetrationstest 4-Phasen-Plan (Executive Summary)

**Datum:** 2026-06-22  
**Status:** ✅ Plan erstellt  
**Security-Score (aktuell):** 3.3/10  
**Ziel-Score:** ≥ 7.0/10

---

## Die 4 Phasen

| Phase | Fokus | Zeitraum | Kritikalität |
|-------|-------|----------|--------------|
| **1** | SSH-Härtung & Basis-Absicherung | KW 26–27 (bis 05.07.) | 🔴 KRITISCH |
| **2** | Container- & Dependency-Scans | KW 27–28 (bis 19.07.) | 🟡 HOCH |
| **3** | Externer Penetrationstest | KW 29–31 (bis 09.08.) | 🟡 HOCH |
| **4** | Quartalsweise Wiederholung | Ab KW 32 (laufend) | 🟢 MITTEL |

---

## Key Deliverables

### Phase 1 — SSH-Härtung
- SSH-Config: Key-only, kein Root-Login, Port 2222
- Fail2Ban aktiviert (3 Fehlversuche → Block)
- Firewall: Nur benötigte Ports offen
- SSH-Audit-Bericht ohne HIGH/CRITICAL

### Phase 2 — Container & Dependencies
- Trivy-Scan aller Images (Erweiterung der bestehenden Scans)
- npm audit + pip-audit für alle Projekte
- 0 CRITICAL Vulnerabilities in Produktion
- CI/CD-Integration (automatisierte Scans)

### Phase 3 — Externer Pen-Test
- OWASP-basierte Methodik
- Scope: Web-App, API, SSH, Cloudflare Tunnel
- Budget: CHF 5'000–15'000 (oder interne Tools als Fallback)
- Findings → Remediation-Plan

### Phase 4 — Continuous Security
- Wöchentliche automatische Scans
- Monatliche SSH-Audits + Score-Recalculation
- Quartalsweise Pen-Tests
- Ziel: Security-Score ≥ 7.0/10 stabil

---

## Verantwortlichkeiten

| Rolle | Hauptaufgabe |
|-------|-------------|
| **Security Agent** | Planung, Koordination, Audit, Reporting |
| **DevOps Agent** | Technische Umsetzung, CI/CD-Integration |
| **Systemmaster** | SSH-Hardening, Server-Konfiguration |
| **CEO** | Budget-Freigabe, Externer Pen-Test Beauftragung |

---

## Nächste Sofortmaßnahmen

1. SSH-Config härten (24.06.)
2. Fail2Ban aktivieren (24.06.)
3. Firewall-Regeln definieren (26.06.)
4. SSH-Audit durchführen (30.06.)

---

**Vollständiger Plan:** `/workspace/nexify/10_evidence/security/penetration-test-4-phase-plan.md`  
**Erstellt von:** Security Agent — NeXify AI OS
