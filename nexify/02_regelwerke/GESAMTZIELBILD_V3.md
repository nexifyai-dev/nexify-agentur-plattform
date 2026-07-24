# NeXify AI — Gesamtzielbild V3: Vollständiges Agentur-Betriebssystem

**Stand:** 2026-06-12 | **Status:** VERBINDLICH | **Version:** 3.0.0
**Owner:** Pascal Courbois / NeXify AI by NeXify — chat it. Automate it.
**Führendes Repo:** `https://github.com/NeXify-AI-by-NeXify-Chat-it-Automat-it/nexifyai-platform.git`
**Aktive Agentur-Website:** `nexify-automate.com`
**Strategische Domain:** `nexifyai.cloud`
**Führende Bedienoberfläche:** NeXify AI Workstation
**Technische Basis Workstation:** Hermes WebUI / NeXify-eigene Operator-Shell
**Designlinie:** Graphite Premium
**Memory-Schichten:** Brain (kanonisch) → agentmemory (arbeitsnah) → Evidence (Nachweis) → Kanban (operativ)

---

## 1. Menschlich verstandenes Gesamtziel

Das Ziel ist ein vollständiges, steuerbares, lernendes und wirtschaftlich arbeitendes AI-Agentur-Betriebssystem.

Dieses System muss leisten:

1. **NeXify verkaufen:** Website, KI-Berater-Chat, Leadqualifizierung, Kundensuche, Angebotslogik, Follow-up, Mailversand, CRM und Vertrauensaufbau.
2. **NeXify liefern:** Projektaufnahme, Lasten-/Pflichtenheft, Angebot, Vertrag, Umsetzung, Tests, Freigabe, Deployment, Übergabe, Support.
3. **NeXify steuern:** Workstation, Kanban, Auftragsfach, Dispatcher, Automation Controller, User-Chat-Driver, Agententeams, Approval Queue, Evidence.
4. **NeXify erinnern:** Brain, agentmemory, Oracle, Projektwissen, Kundenwissen, Regeln, Entscheidungen, Lessons Learned.
5. **NeXify absichern:** Security, Datenschutz, Secret-Management, Policy Gates, No-Full-Crash, Backup, Rollback, Audit.
6. **NeXify verbessern:** Metriken, Feedback, Gewinn/Marge, Supportaufwand, Fehlerquote, Conversion, Qualität.

## 2. Systemdefinition — Fünf Ebenen

### 2.1 Agentur-Ebene
Strategie, Positionierung, Produkt-/Leistungsportfolio, Zielgruppen, Leadquellen, Vertrieb, Angebote, Kundenbetreuung, Projektabwicklung, Support, Preis-/Marge-/Kostenlogik, Qualitätsversprechen, Wachstumsschleifen.

### 2.2 Produkt- und Frontend-Ebene
Öffentliche Agentur-Website, KI-Berater-Chat, Angebotsgenerator, Kundenportal (nach Login), Admin-/Operator-Portal, Workstation, Dokumente/PDFs, E-Mail-Templates, Signaturen, Rechnungen, Angebote, Statusseiten, Self-Service-Hilfe.

### 2.3 Plattform- und Backend-Ebene
API-first Kern, Supabase/Postgres/Auth/RLS/Storage/Realtime, Python/FastAPI-Services, Qdrant, Resend, GitHub/Vercel/Cloudflare/9Router-Integrationen, Worker, Scheduler, Queues, Cron, Webhooks, Monitoring, Logs, Metrics, Alerts, Backup/Restore, Rollback.

### 2.4 Agenten- und Automations-Ebene
NeXify AI Systemmaster, 12 Agententeams, Automation Controller, Task Generator, Dispatcher, Skill Router, MCP Gateway, Tool Gateway, User-Chat-Driver, Chat Continuation & Conservation, Goose ACC (24/7-Worker), Goose CLI (interaktiv), Claude Code (Bulk/Repo/Systemmaster).

### 2.5 Wissens- und Governance-Ebene
Brain, agentmemory, Oracle, Evidence, Kanban, Auftragsfach, Dokumentationssystem, Audit-/Review-/QR-Gates.

## 3. IST-Zustand (2026-06-12)

| Bereich | Status |
|---------|--------|
| Repo + Workspace | ✅ 225 Dateien, 61 Dirs, 25 Regelwerke |
| Brain | ✅ 667 Einträge, API online |
| 9Router | ✅ v0.4.71, combo-llm aktiv |
| Supabase Stack (12 Container) | ✅ Alle healthy |
| Docker-Infrastruktur (22 Container) | ✅ 21 grün |
| Cloudflare Tunnel | ✅ brain.nexifyai.cloud aktiv |
| 12 Agententeams | ✅ Definierte Dokumentation |
| Dispatcher-Architektur | ✅ Vorhanden |
| **Nexify API** | **🔴 Crash Loop (MongoDB fehlt)** |
| **Leere Dirs** | **🔴 16_din_iso, 27_audits, 28_feedbackschleifen, 29_self_optimization** |
| **Sales/CRM/Website-SOPs** | **⚠️ Nicht ausreichend dokumentiert** |
| **KI-Berater-Chat + Angebotsgenerator** | **⚠️ Nur als Ziel genannt** |
| **Dokumentenkatalog** | **🟡 Fehlt** |

## 4. Roadmap

### P0 — Fundament (2026-06)
Dokumentationssystem, Lastenheft, Pflichtenheft, Gap-Matrix, Brain-first, agentmemory, Automation/Cronregister, Designsystem, Claude-Code-Systemmaster-Auftrag.

### P1 — Vertriebsmaschine (2026-06/07)
Website/Portal, KI-Berater-Chat, Angebotsgenerator mit Resend-Gate, CRM/Lead/Offer/Project-Datenmodell, Kundensuche-SOP.

### P2 — Delivery und Betrieb (2026-07)
Projektabwicklung, Support, Kundenportal, Deployment-/Release-Pipeline, Monitoring, Alerts, Standardreports.

### P3 — Skalierung (2026-08+)
Mandantenfähigkeit, Partner-/White-Label, weitere Kanäle, Oracle als Steuerungsinstanz, KPI-basierte Selbstoptimierung.
