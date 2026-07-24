# NeXify AI — IST/SOLL-Gap-Matrix V3

**Stand:** 2026-06-12 | **Status:** VERBINDLICH | **Version:** 3.0.0
**Owner:** Pascal Courbois / NeXify AI
**Klassifikation:** nexify_internal

---

## Statusdefinitionen

| Status | Bedeutung |
|--------|-----------|
| `ELIMINIERT_DURCH_DOKUMENTATION` | Gap in verbindliche Dokumente, Tasks und Prüfpfade überführt |
| `ELIMINIERT_DURCH_UMSETZUNG` | Gap technisch umgesetzt und geprüft |
| `WAITING_FOR_APPROVAL` | Technische Aktion gate-pflichtig |
| `BLOCKED_ACCESS` | Zugriff fehlt, sichere Nebenarbeit läuft weiter |
| `PARTIAL_DONE` | Teil vorhanden, aber nicht betriebsfertig |
| `DONE_TRUE` | Endkontrolle bestanden |

---

## Gap-Matrix

| ID | Bereich | IST-Zustand | SOLL-Zustand | Eliminierung | Priorität | Gate | Status |
|----|---------|------------|-------------|-------------|-----------|------|--------|
| GAP-001 | Gesamtzielbild | V2 vorhanden, repo-/website-/angebot-/CRM-unvollständig | V3 umfasst Agentur, Website, Portal, KI-Berater, Angebot, CRM, Betrieb | Masterzielbild V3 | P0 | intern | `DONE_TRUE` |
| GAP-002 | Dokumentationssystem | Verstreute Einzeldateien | Vollständiger Dokumentenkatalog mit Ownership | Dokumentenkatalog + Governance-Regel | P0 | intern | `ELIMINIERT_DURCH_DOKUMENTATION` |
| GAP-003 | Lastenheft | Nicht konsolidiert | Fachlich vollständige Anforderungen | Master-Lastenheft V3 | P0 | intern | `ELIMINIERT_DURCH_DOKUMENTATION` |
| GAP-004 | Pflichtenheft | Nicht konsolidiert | Technische Umsetzungspflichten | Master-Pflichtenheft V3 | P0 | intern | `ELIMINIERT_DURCH_DOKUMENTATION` |
| GAP-005 | Website | Vorhanden, aber Ziel-/Design-/Conversion-Register fehlt | Premium-Vertriebsmaschine | Website-/Portal-Blueprint | P0 | Review | `PARTIAL_DONE` |
| GAP-006 | KI-Berater-Chat | Ziel genannt | Geführter Lead-/Offer-Flow | KI-Berater-SOP + API-Katalog | P0 | Datenschutz/Review | `PARTIAL_DONE` |
| GAP-007 | Angebotsgenerator | Ziel genannt | Kalkulation, Optionen, PDF/Mail, Freigabe | Angebots-SOP + Sales Blueprint | P0 | Mail-Gate | `PARTIAL_DONE` |
| GAP-008 | Kundensuche | Ziel genannt | Rechtlich gegateter Lead-Prozess | Lead-to-CRM-SOP | P1 | Legal Gate | `BLOCKED_ACCESS` |
| GAP-009 | CRM | Nicht vollständig modelliert | Lead/Customer/Offer/Project/Timeline | CRM-Datenmodell im Sales Blueprint | P1 | Security | `PARTIAL_DONE` |
| GAP-010 | Brain | Vorhanden/angedacht | Geprüfte kanonische Wissensschicht | Brain-first SOP | P0 | Security | `PARTIAL_DONE` |
| GAP-011 | agentmemory | Vorhanden/angedacht | Arbeitsnahes Memory mit Sync-Policy | agentmemory SOP | P0 | intern | `PARTIAL_DONE` |
| GAP-012 | Oracle | Ziel vorhanden | Dispatch-/Frage-/Wissenszentrale | Oracle Folgeauftrag | P1 | Review | `PARTIAL_DONE` |
| GAP-013 | 9Router | Ziel vorhanden, Domain/Config teils offen | Router-Zentrale mit Modell-/Fallback-/Kostenpolicy | 9Router Register/Folgeauftrag | P0 | No-Full-Crash | `PARTIAL_DONE` |
| GAP-014 | Automationen | Ansätze vorhanden | Registergeführt, auditierbar | Automation- und Cronregister | P0 | Review | `PARTIAL_DONE` |
| GAP-015 | Endkontrolle | DONE-Regeln vorhanden | QR-Gate mit Evidence | Endkontrollhandbuch | P0 | intern | `PARTIAL_DONE` |
| GAP-016 | Designsystem | Graphite grob definiert | Tokensbasiert für alle Medien | Designsystem-Handbuch | P0 | UI Review | `ELIMINIERT_DURCH_DOKUMENTATION` |
| GAP-017 | Betrieb | Fragmentiert | Betriebshandbuch, Runbooks, SLAs | Betriebshandbuch | P0 | Review | `PARTIAL_DONE` |
| GAP-018 | API | Nicht vollständig katalogisiert | API-first Katalog + OpenAPI-Pflicht | API-Katalog | P0 | intern | `PARTIAL_DONE` |
| GAP-019 | Security | Regeln vorhanden | Secret Inventory, Rotation, Vault-Entscheidung | Security-Handbuch | P0 | Approval | `PARTIAL_DONE` |
| GAP-020 | Repo/Deploy | Repo vorhanden | GitHub/Vercel/Supabase/Cloudflare Drift Checks | Betriebshandbuch + SOPs | P0 | Approval | `PARTIAL_DONE` |

---

## P0-Gaps (aktiv zu bearbeiten)

| ID | Gap | Owner | Task | Evidence-Pfad |
|----|-----|-------|------|---------------|
| GAP-001 | Gesamtzielbild | Systemmaster | ✅ In GESAMTZIELBILD_V3.md überführt | `02_auftraege/GESAMTZIELBILD_V3.md` |
| GAP-002 | Dokumentationssystem | Systemmaster | ✅ In DOKUMENTENKATALOG_V3.md überführt | `03_regelwerke/DOKUMENTENKATALOG_V3.md` |
| GAP-003 | Lastenheft | Systemmaster | ✅ In MASTER_LASTENHEFT_V3.md überführt | `02_auftraege/MASTER_LASTENHEFT_V3.md` |
| GAP-004 | Pflichtenheft | Systemmaster | ✅ In MASTER_PFLICHTENHEFT_V3.md überführt | `02_auftraege/MASTER_PFLICHTENHEFT_V3.md` |
| GAP-016 | Designsystem | Systemmaster | ✅ In DESIGNSYSTEM_HANDBUCH_V3.md überführt | `07_ui_ci/DESIGNSYSTEM_HANDBUCH_V3.md` |

## P1-Gaps (vorbereitet, gate-pflichtig)

| ID | Gap | Owner | Task | Gate |
|----|-----|-------|------|------|
| GAP-008 | Kundensuche | Sales-Team | Lead-to-CRM-SOP | Legal Gate |
| GAP-009 | CRM | Sales-Team | CRM-Datenmodell | Security |

## Offene Gaps (keine direkte Aktion)

| ID | Gap | Grund |
|----|-----|-------|
| GAP-012 | Oracle | Folgeauftrag nach V3-Fundament |
| GAP-017 | Betrieb | Folgeauftrag nach API/CRM-Stabilisierung |

---

## Traceability: Lastenheft → Gap-Matrix

| LF (Lastenheft) | Relevante Gaps |
|-----------------|---------------|
| LF-001 Agentursteuerung | GAP-001, GAP-002 |
| LF-002 Website | GAP-005, GAP-016 |
| LF-003 KI-Berater-Chat | GAP-006, GAP-018 |
| LF-004 Angebotsgenerierung | GAP-007, GAP-009 |
| LF-005 Mailversand | GAP-007 |
| LF-006 Kundensuche | GAP-008, GAP-009 |
| LF-007 CRM | GAP-009 |
| LF-008 Workstation | GAP-001, GAP-005 |
| LF-009 Automationen | GAP-014 |
| LF-010 Brain/agentmemory | GAP-010, GAP-011 |
| LF-011 Qualität | GAP-015 |
| LF-012 Betrieb | GAP-017, GAP-019, GAP-020 |

---

## Traceability: Pflichtenheft → Gap-Matrix

| PF (Pflichtenheft) | Relevante Gaps |
|--------------------|---------------|
| PF-001 API-first | GAP-018 |
| PF-002 Domainmodell | GAP-009 |
| PF-003 Workstation | GAP-001, GAP-005 |
| PF-004 Automations-Engine | GAP-014 |
| PF-005 Angebotsgenerator | GAP-007 |
| PF-006 Kundensuche | GAP-008 |
| PF-007 Brain-first | GAP-010 |
| PF-008 Designsystem | GAP-016 |
| PF-009 CI/CD | GAP-020 |
| PF-010 Betrieb | GAP-017, GAP-019 |

---

## Änderungshistorie

| Datum | Version | Änderung |
|-------|---------|----------|
| 2026-06-12 | 3.0.0 | Initiale V3 aus Master-Lastenheft/Pflichtenheft/Gesamtzielbild |
