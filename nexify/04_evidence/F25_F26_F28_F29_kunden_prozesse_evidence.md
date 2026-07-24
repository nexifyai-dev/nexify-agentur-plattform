# Evidence: F25, F26, F28, F29 — Kunden/Prozesse

**Generiert:** 2026-06-22  
**Status:** GEKLÄRT  
**Owner:** Systemmaster

---

## F25: Studienkolleg — aktueller Status

**Repo:** `/workspace/studienkolleg-aachen/`  
**Plattform:** W2G (Way2Go) Platform für Studienkolleg Aachen  
**Letztes Update:** v1.4.2 (2026-05-12) — Demo-Daten-Restore-Endpunkt

### Technischer Stand
- **66 Features** implementiert, **53 Seiten** produktionsreif
- **92 Tests**, 100% Pass Rate (Stand: 2026-04-06)
- Backend: FastAPI/Python, JWT-Auth, RBAC (8 Rollen), DeepSeek AI Integration
- Frontend: React, Responsive, i18n (DE/EN)

### Offene Blocker (Go-Live)

| Kategorie | Blocker | Status |
|-----------|---------|--------|
| **Repo-Hygiene** | H6: Git-History enthält alte Credentials | OFFEN |
| **Repo-Hygiene** | H7: Echte Credential-Rotation | OFFEN |
| **Technik** | T2: RESEND_API_KEY konfigurieren | OFFEN |
| **Technik** | T3: S3/MinIO Credentials | OFFEN |
| **Technik** | T6: MongoDB-Backup-Routine | OFFEN |
| **Technik** | T7: HTTPS/TLS für Produktion | OFFEN |
| **Recht** | R1-R5: Impressum, AGB, Datenschutz | OFFEN |
| **Betrieb** | B1-B3: Staff-Onboarding, Testbewerbung, E-Mail-Test | OFFEN |

### Bewertung
- **Technisch:** ~85% produktionsreif, aber Go-Live-Blocker vorhanden
- **Rechtlich:** Unvollständig (Impressum, AGB, Datenschutz)
- **Betrieblich:** Kein Staff-Onboarding, keine Testbewerbung durchgeführt
- **Nächster Schritt:** Blocker-Priorisierung mit Kunden abstimmen

---

## F26: Bookando — aktueller Status

**Repo Backend:** `/workspace/customers/fixdigital/bookando/bookando-api/`  
**Repo Frontend:** `/workspace/customers/fixdigital/bookando/bookando-de/`  
**Kunde:** FixDigital / Kevin Gaus  
**Domain:** https://bookando.de

### Technischer Stand
- **Backend:** FastAPI/Python, deployed auf Vercel
- **Frontend:** React, deployed auf Vercel
- **DB:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (JWT ES256)
- **Payment:** Stripe (optional, Mock-Provider im Testmodus)
- **CI/CD:** GitHub Actions (ruff check → pytest → Build-Smoke-Import)

### Pflichtenheft-Umfang (426 Zeilen)
- Terminbuchungssystem (Kalender, Zeitslots, Gruppenbuchungen)
- Vendor-System (Multi-Location, RBAC, Landingpages)
- Marketplace-System (Geolokalisierung, Filter-Engine)
- Affiliate-Booking-System (Tracking, Provisionen, Wallet)
- Wallet- und Ledger-System (Immutable Ledger, Hold/Freigabe)
- WhiteLabel-System (Custom Domains, Deep-Branding)
- CRM-System (360-Grad Kundenakte, Tagging)
- KI-Strategie (Smart Content, Predictive No-Show)
- Mobile-Strategie (PWA, Push-Benachrichtigungen)

### Bewertung
- **Status:** In Entwicklung, MVP-Phase
- **Architektur:** Solide, API-first, Multi-Tenant-fähig
- **Nächster Schritt:** MVP-Fertigstellung, erste Kundenintegration

---

## F28: DONE-Definition — gibt es eine automatisierte Prüfung?

**DOS Gates:** `/workspace/nexifyai-platform/docs/agency/DOS_GATES.md`  
**Definition of Done:** `/workspace/nexifyai-platform/docs/agency/machine-readable/dos-definition-of-done.json`

### DOS Gates (17 Pflicht-Gates)
1. Brain-Kontext abrufen
2. Lessons Learned abrufen
3. Prevention Rules prüfen
4. Resource Catalog prüfen
5. Master-Skill-Registry prüfen
6. DOS-Anwendbarkeit prüfen
7. Projekttyp nach DOS klassifizieren
8. Funnel-Zuordnung prüfen
9. Zielgruppen-Matrix prüfen
10. Copy-Compiler prüfen (falls Content/UI)
11. Designsystem prüfen (falls UI)
12. Event-/Tracking-Pflicht prüfen
13. CI/CD-Gates prüfen
14. Security-/Compliance-Gates prüfen
15. Performance-Gates prüfen
16. Definition of Done prüfen
17. Evidence Plan erstellen

### Definition of Done (5 Kategorien)

| Kategorie | Kriterien |
|-----------|-----------|
| **Technical** | Code implementiert, Typecheck grün, Lint grün, Tests grün, Build grün, Keine Secrets, Security geprüft, Performance geprüft, Rollback möglich, CI integriert |
| **Content** | Copy-Compiler 8 Stufen, Zielgruppe definiert, Funnel-Schritt definiert, Claims mit Scope, CTA klar, Interne Verlinkung, Kernbegriffe konsistent |
| **Design** | Designsystem genutzt, Keine One-Off UI, Responsive, WCAG 2.1 AA, Brand konsistent, Dark Mode/Tokens |
| **Tracking** | Events definiert, Payload validiert, Kritische Aktionen messbar, Trigger dokumentiert, Automation versioniert |
| **Governance** | Doku aktualisiert, ADR bei Architekturentscheidung, Release Notes, Inventar aktualisiert, Owner geklärt, Risiken dokumentiert, Lessons Learned gespeichert |

### Automatisierte Prüfung
- **DOS-Compliance-Check:** `/workspace/nexifyai-platform/services/automations/cron/dos-compliance-check.py`
- **Output:** `/workspace/nexifyai-platform/services/automations/cron/output/dos-compliance-*.json`
- **Status:** JA, automatisierte Prüfung existiert als Cron-Job
- **Einschränkung:** Nicht als CI/CD-Gate integriert, sondern als periodischer Check

### Bewertung
- **DONE-Definition:** Umfassend, 5 Kategorien mit klaren Kriterien
- **Automatisierung:** Vorhanden, aber nicht als Build-Gate
- **Nächster Schritt:** Integration in CI/CD-Pipeline prüfen

---

## F29: Brain-Sync-Frequenz — wie oft wird synchronisiert?

**Script:** `/workspace/nexifyai-platform/services/automations/cron/brain-sync.py`  
**Cron:** `*/30 * * * *` (alle 30 Minuten)

### Sync-Inhalte
1. **DOS → Brain:** Synchronisiert DOS v2.0 Kapitel-Struktur in Brain DB
2. **Open Notebook Check:** Prüft ob Open Notebook erreichbar ist (via SSH)
3. **Repo-Integrität:** Prüft ob alle DOS-Pflichtverzeichnisse existieren

### Letzte Syncs (2026-05-08)
- 16 Syncs durchgeführt (01:30 bis 07:30 UTC)
- Alle erfolgreich (`success: true`)
- **Achtung:** Letzter Sync ist über 1 Monat alt (2026-05-08)

### Bewertung
- **Frequenz:** Alle 30 Minuten konfiguriert
- **Status:** Aktiv, aber letzter Sync veraltet
- **Nächster Schritt:** Prüfen ob Cron-Job noch aktiv ist, ggf. neu starten

---

## Zusammenfassung

| Frage | Status | Bewertung |
|-------|--------|-----------|
| F25: Studienkolleg | GEKLÄRT | Technisch ~85% reif, Go-Live-Blocker (Recht, Betrieb, Technik) |
| F26: Bookando | GEKLÄRT | In Entwicklung, MVP-Phase, solide Architektur |
| F28: DONE-Definition | GEKLÄRT | Umfassend (5 Kategorien), automatisiert als Cron, nicht als CI/CD-Gate |
| F29: Brain-Sync | GEKLÄRT | Alle 30 Min konfiguriert, letzter Sync veraltet (2026-05-08) |

---

*Generiert: 2026-06-22 | Nächster Review: 2026-06-29*
