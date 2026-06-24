# NeXify AI OS — Penetrationstest 4-Phasen-Plan

**Erstellt:** 2026-06-22  
**Verantwortlicher:** Security Agent (NeXify AI OS)  
**Ausgangslage:** Security-Score 3.3/10, kein Penetrationstest durchgeführt  
**Ziel:** Systematischer Aufbau der Sicherheitstestung in 4 Phasen  
**Dokument:** P2-Task 8

---

## Übersicht

| Phase | Name | Zeitraum | Status |
|-------|------|----------|--------|
| 1 | SSH-Härtung & Basis-Absicherung | KW 26–27 (22.06.–05.07.2026) | 🔴 Offen |
| 2 | Container- & Abhängigkeits-Scans | KW 27–28 (06.07.–19.07.2026) | 🟡 Teilw. erledigt |
| 3 | Externer Penetrationstest | KW 29–31 (20.07.–09.08.2026) | 🔴 Offen |
| 4 | Quartalsweise Wiederholung & Monitoring | Ab KW 32 (laufend) | 🔴 Offen |

**Ziel-Security-Score nach Phase 4:** ≥ 7.0/10

---

## Phase 1: SSH-Härtung & Basis-Absicherung

**Zeitraum:** KW 26–27 (22.06.–05.07.2026)  
**Verantwortlich:** Security Agent + Systemmaster Agent  
**Priorität:** KRITISCH

### Maßnahmen

| # | Maßnahme | Verantwortlich | Fällig | Status |
|---|----------|---------------|--------|--------|
| 1.1 | SSH-Config härten (Key-only, kein Root-Login, Port-Änderung) | Systemmaster | 24.06.2026 | 🔴 |
| 1.2 | Fail2Ban für SSH aktivieren | Systemmaster | 24.06.2026 | 🔴 |
| 1.3 | UFW/Firewall-Regeln definieren (nur benötigte Ports) | Security Agent | 26.06.2026 | 🔴 |
| 1.4 | SSH-Keys rotieren (alte Keys entfernen) | Systemmaster | 28.06.2026 | 🔴 |
| 1.5 | SSH-Audit durchführen (ssh-audit Tool) | Security Agent | 30.06.2026 | 🔴 |
| 1.6 | Ergebnisse dokumentieren & Evidence speichern | Security Agent | 02.07.2026 | 🔴 |

### SSH-Hardening-Konfiguration (Zielzustand)

```
# /etc/ssh/sshd_config — Zielwerte
Port 2222
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2
AllowUsers hermeswebui
Protocol 2
X11Forwarding no
```

### Akzeptanzkriterien
- [ ] Kein Root-Login via SSH möglich
- [ ] Passwort-Auth deaktiviert
- [ ] Fail2Ban blockiert nach 3 fehlgeschlagenen Versuchen
- [ ] SSH-Audit-Bericht ohne HIGH/CRITICAL Findings
- [ ] Evidence in `/workspace/nexify/10_evidence/security/` gespeichert

---

## Phase 2: Container- & Abhängigkeits-Scans

**Zeitraum:** KW 27–28 (06.07.–19.07.2026)  
**Verantwortlich:** Security Agent + DevOps Agent  
**Priorität:** HOCH  
**Vorläufer:** Phase 1 abgeschlossen

### Bisherige Ergebnisse (Basis)

Folgende Scans wurden bereits durchgeführt:
- `trivy_scan_nexify-webui_20260622.txt` — Container-Scan
- `trivy_scan_hermes-webui_20260622.txt` — Container-Scan
- `trivy-nginx-alpine.json` — Base-Image-Scan

### Maßnahmen

| # | Maßnahme | Verantwortlich | Fällig | Status |
|---|----------|---------------|--------|--------|
| 2.1 | Trivy-Scan aller Container-Images (vollständig) | Security Agent | 08.07.2026 | 🟡 |
| 2.2 | npm/pip Dependency-Scan (npm audit, pip-audit) | DevOps Agent | 10.07.2026 | 🔴 |
| 2.3 | CRITICAL/HIGH Vulnerabilities beheben | DevOps Agent | 14.07.2026 | 🔴 |
| 2.4 | Base-Images auf minimale Varianten umstellen | DevOps Agent | 16.07.2026 | 🔴 |
| 2.5 | Trivy als CI-Pipeline-Step integrieren | DevOps Agent | 18.07.2026 | 🔴 |
| 2.6 | Scan-Ergebnisse & Remediation dokumentieren | Security Agent | 19.07.2026 | 🔴 |

### Akzeptanzkriterien
- [ ] Alle Container-Images gescannt
- [ ] 0 CRITICAL Vulnerabilities in Produktion
- [ ] Dependency-Scans für alle Projekte durchgeführt
- [ ] Automatisierung in CI/CD integriert
- [ ] Evidence gespeichert

---

## Phase 3: Externer Penetrationstest

**Zeitraum:** KW 29–31 (20.07.–09.08.2026)  
**Verantwortlich:** Security Agent (Koordination), Externer Dienstleister  
**Priorität:** HOCH  
**Vorläufer:** Phase 1 + 2 abgeschlossen

### Scope-Definition

| Bereich | In-Scope | Out-of-Scope |
|---------|----------|--------------|
| Web-Application (nexifyai.cloud) | ✅ | — |
| API-Endpoints (Brain, Qdrant) | ✅ | — |
| SSH/Server-Infrastruktur | ✅ | — |
| Cloudflare Tunnel | ✅ | — |
| Social Engineering | ❌ | ✅ |
| Phishing | ❌ | ✅ |
| DDoS | ❌ | ✅ |

### Maßnahmen

| # | Maßnahme | Verantwortlich | Fällig | Status |
|---|----------|---------------|--------|--------|
| 3.1 | Pen-Test-Scope & Rules of Engagement definieren | Security Agent | 22.07.2026 | 🔴 |
| 3.2 | Externen Penetrationstester beauftragen (Angebote einholen) | Security Agent + CEO | 24.07.2026 | 🔴 |
| 3.3 | Testumgebung vorbereiten (Staging) | DevOps Agent | 26.07.2026 | 🔴 |
| 3.4 | Penetrationstest durchführen lassen | Externer Dienstl. | 28.07.–04.08.2026 | 🔴 |
| 3.5 | Findings Review & Priorisierung | Security Agent | 06.08.2026 | 🔴 |
| 3.6 | Remediation-Plan erstellen | Security Agent + DevOps | 09.08.2026 | 🔴 |

### Pen-Test-Methodik (OWASP-basiert)

1. **Reconnaissance** — Information Gathering, Subdomain-Enum
2. **Scanning** — Port-Scan, Service-Enum, Vulnerability-Scan
3. **Exploitation** — SQLi, XSS, Auth-Bypass, Privilege Escalation
4. **Post-Exploitation** — Data Exfiltration Simulation, Lateral Movement
5. **Reporting** — CVSS-Scores, PoCs, Remediation-Empfehlungen

### Budget-Richtwert
- Externer Pen-Test (kleine Web-App): CHF 5'000–15'000
- Alternativ: Interne Durchführung mit Tools (Nikto, OWASP ZAP, Burp Suite Community)

### Akzeptanzkriterien
- [ ] Pen-Test-Bericht mit allen Findings vorhanden
- [ ] Alle CRITICAL Findings remediiert
- [ ] Remediation-Plan mit Timelines erstellt
- [ ] Evidence gespeichert

---

## Phase 4: Quartalsweise Wiederholung & Continuous Monitoring

**Zeitraum:** Ab KW 32 (laufend, quartalsweise)  
**Verantwortlich:** Security Agent  
**Priorität:** MITTEL  
**Vorläufer:** Phase 1–3 abgeschlossen

### Quartals-Routine

| Quartal | Zeitraum | Aktivitäten |
|---------|----------|-------------|
| Q3 2026 | Jul–Sep | Erster voller Zyklus (Phase 1–3 Abschluss) |
| Q4 2026 | Okt–Dez | Wiederholung Phase 2+3, SSH-Audit |
| Q1 2027 | Jan–Mar | Wiederholung Phase 2+3, Policy-Review |
| Q2 2027 | Apr–Jun | Wiederholung Phase 2+3, Architektur-Review |

### Continuous Monitoring (fortlaufend)

| # | Aktivität | Frequenz | Verantwortlich |
|---|-----------|----------|---------------|
| 4.1 | Trivy-Scan (Container + Dependencies) | Wöchentlich (autom.) | DevOps Agent |
| 4.2 | SSH-Audit | Monatlich | Security Agent |
| 4.3 | Dependency-Updates prüfen | Wöchentlich | DevOps Agent |
| 4.4 | Security-Score Re-Assessment | Monatlich | Security Agent |
| 4.5 | Externer Pen-Test | Quartalsweise | Externer Dienstl. |
| 4.6 | Incident-Response-Test | Halbjährlich | Security Agent |
| 4.7 | Backup & Recovery Test | Monatlich | DevOps Agent |

### Automatisierungs-Zielstand

```
┌─────────────────────────────────────────────────┐
│            Continuous Security Pipeline          │
├─────────────────────────────────────────────────┤
│  Code Push → Trivy Scan → Dependency Check      │
│       ↓                                          │
│  CRITICAL found? → Block Deploy → Notify         │
│       ↓                                          │
│  All clear? → Deploy → Post-Deploy Smoke Test    │
│       ↓                                          │
│  Weekly: Automated SSH-Audit Report              │
│  Monthly: Security-Score Calculation             │
│  Quarterly: Pen-Test Cycle                       │
└─────────────────────────────────────────────────┘
```

### Akzeptanzkriterien
- [ ] Automatisierte Scans laufen wöchentlich
- [ ] Security-Score ≥ 7.0/10 stabil über 2 Quartale
- [ ] Quartals-Pen-Test etabliert
- [ ] Incident-Response-Plan existiert und wird getestet

---

## Verantwortlichkeits-Matrix (RACI)

| Aktivität | Security Agent | DevOps Agent | Systemmaster | CEO | Extern |
|-----------|---------------|-------------|-------------|-----|--------|
| SSH-Härtung | A | C | R | I | — |
| Fail2Ban/Firewall | A | C | R | I | — |
| Container-Scans | R | A | C | I | — |
| Dependency-Scans | C | R | A | I | — |
| Vulnerability Remediation | A | R | C | I | — |
| Pen-Test Beauftragung | R | C | I | A | — |
| Pen-Test Durchführung | I | C | C | I | R |
| Quartals-Review | R | C | C | A | C |
| CI/CD Security Integration | A | R | C | I | — |

**R** = Responsible (durchführend) | **A** = Accountable (verantwortlich) | **C** = Consulted | **I** = Informed

---

## Risikobewertung

| Risiko | Eintrittswahrscheinlichkeit | Auswirkung | Massnahme |
|--------|---------------------------|------------|-----------|
| Externer Pen-Test zu teuer | Mittel | Hoch | Interne Tools als Fallback (OWASP ZAP, Nikto) |
| CRITICAL Findings blocken Deploy | Mittel | Mittel | Priorisierte Remediation-Sprints |
| Ressourcen-Knappheit | Hoch | Mittel | Phasen-weise Umsetzung, kritische zuerst |
| Neue Vulnerabilities nach Patch | Niedrig | Hoch | Continuous Monitoring via CI/CD |

---

## Kennzahlen & KPIs

| KPI | Aktuell | Ziel (nach Phase 4) |
|-----|---------|---------------------|
| Security-Score | 3.3/10 | ≥ 7.0/10 |
| CRITICAL Vulnerabilities | Unbekannt | 0 |
| SSH-Hardening Compliance | 0% | 100% |
| Automatisierte Scans | 0 | Wöchentlich |
| Pen-Tests durchgeführt | 0 | ≥ 4/Jahr |
| Mean Time to Remediate | N/A | < 72h (CRITICAL) |

---

## Nächste Schritte (Sofortmaßnahmen KW 26)

1. **Heute (22.06.):** Plan finalisieren & speichern ✅
2. **Morgen (23.06.):** SSH-Hardening Review einleiten
3. **24.06.:** SSH-Config härten + Fail2Ban aktivieren
4. **26.06.:** Firewall-Regeln definieren
5. **30.06.:** SSH-Audit durchführen

---

*Erstellt von: Security Agent — NeXify AI OS*  
*Genehmigt durch: [Ausstehend — CEO Approval]*  
*Nächste Review: 05.07.2026 (Ende Phase 1)*
