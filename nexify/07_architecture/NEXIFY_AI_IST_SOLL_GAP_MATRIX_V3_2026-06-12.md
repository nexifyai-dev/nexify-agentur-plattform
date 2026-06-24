# NeXify AI — IST/SOLL-Gap-Matrix V3

| ID | Bereich | IST-Zustand | SOLL-Zustand | Eliminierung | Priorität | Gate |
|---|---|---|---|---|---|---|
| GAP-001 | Gesamtzielbild | V2 vorhanden, aber repo-/website-/angebot-/CRM-unvollständig | V3 umfasst Agentur, Website, Portal, KI-Berater, Angebot, CRM, Betrieb | Masterzielbild V3 | P0 | intern |
| GAP-002 | Dokumentationssystem | verstreute Einzeldateien | vollständiger Dokumentenkatalog mit Ownership | Dokumentenkatalog + Governance-Regel | P0 | intern |
| GAP-003 | Lastenheft | nicht konsolidiert | fachlich vollständige Anforderungen | Master-Lastenheft | P0 | intern |
| GAP-004 | Pflichtenheft | nicht konsolidiert | technische Umsetzungspflichten | Master-Pflichtenheft | P0 | intern |
| GAP-005 | Website | vorhanden, aber Ziel-/Design-/Conversion-Register fehlt | Premium-Vertriebsmaschine | Website-/Portal-Blueprint | P0 | Review |
| GAP-006 | KI-Berater-Chat | Ziel genannt | geführter Lead-/Offer-Flow | KI-Berater-SOP + API-Katalog | P0 | Datenschutz/Review |
| GAP-007 | Angebotsgenerator | Ziel genannt | Kalkulation, Optionen, PDF/Mail, Freigabe | Angebots-SOP + Sales Blueprint | P0 | Mail-Gate |
| GAP-008 | Kundensuche | Ziel genannt | rechtlich gegateter Lead-Prozess | Lead-to-CRM-SOP | P1 | Legal Gate |
| GAP-009 | CRM | nicht vollständig modelliert | Lead/Customer/Offer/Project/Timeline | CRM-Datenmodell im Sales Blueprint | P1 | Security |
| GAP-010 | Brain | vorhanden/angedacht | geprüfte kanonische Wissensschicht | Brain-first SOP | P0 | Security |
| GAP-011 | agentmemory | vorhanden/angedacht | arbeitsnahes Memory mit Sync-Policy | agentmemory SOP | P0 | intern |
| GAP-012 | Oracle | Ziel vorhanden | Dispatch-/Frage-/Wissenszentrale | Oracle Folgeauftrag | P1 | Review |
| GAP-013 | 9Router | Ziel vorhanden, Domain/Config teils offen | Router-Zentrale mit Modell-/Fallback-/Kostenpolicy | 9Router Register/Folgeauftrag | P0 | No-Full-Crash |
| GAP-014 | Automationen | Ansätze vorhanden | registergeführt, auditierbar | Automation- und Cronregister | P0 | Review |
| GAP-015 | Endkontrolle | DONE-Regeln vorhanden | QR-Gate mit Evidence | Endkontrollhandbuch | P0 | intern |
| GAP-016 | Designsystem | Graphite grob definiert | tokensbasiert für alle Medien | Designsystem-Handbuch | P0 | UI Review |
| GAP-017 | Betrieb | fragmentiert | Betriebshandbuch, Runbooks, SLAs | Betriebshandbuch | P0 | Review |
| GAP-018 | API | nicht vollständig katalogisiert | API-first Katalog + OpenAPI-Pflicht | API-Katalog | P0 | intern |
| GAP-019 | Security | Regeln vorhanden | Secret Inventory, Rotation, Vault-Entscheidung | Security-Handbuch | P0 | Approval |
| GAP-020 | Repo/Deploy | Repo vorhanden | GitHub/Vercel/Supabase/Cloudflare Drift Checks | Betriebshandbuch + SOPs | P0 | Approval |

## Statusdefinitionen

- `ELIMINIERT_DURCH_DOKUMENTATION`: Gap wurde in verbindliche Dokumente, Tasks und Prüfpfade überführt.
- `ELIMINIERT_DURCH_UMSETZUNG`: Gap wurde technisch umgesetzt und geprüft.
- `WAITING_FOR_APPROVAL`: technische Aktion ist gate-pflichtig.
- `BLOCKED_ACCESS`: Zugriff fehlt, sichere Nebenarbeit läuft weiter.
- `PARTIAL_DONE`: Teil vorhanden, aber nicht betriebsfertig.
- `DONE_TRUE`: Endkontrolle bestanden.
