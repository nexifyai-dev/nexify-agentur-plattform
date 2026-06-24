# Externe Tasks Register — NeXify AI OS

**Datum:** 2026-06-23
**Agent:** Operations Agent (Hermes Subagent)
**Quelle:** Pascal-Handlung (5 identifizierte externe Tasks)
**Status:** 📋 DOKUMENTIERT & PRIORISIERT

---

## Übersicht

Externe Tasks sind Aufgaben, die **manuelles Eingreifen durch Pascal (CEO)** erfordern und nicht autonom durch AI-Agenten gelöst werden können. Sie sind als Gate-Tasks in P1/P2 des Kanban-Registers dokumentiert.

---

## Priorisierungsmatrix

| Priorität | Kriterium |
|-----------|-----------|
| **P0** | Blocking — andere Tasks können ohne dieses nicht fortgesetzt werden |
| **P1** | Kritisch — erhebliche Auswirkung auf Sicherheit, Compliance oder Go-Live |
| **P2** | Wichtig — Auswirkung auf Funktionalität, aber Workaround vorhanden |
| **P3** | Nett-to-have — kann nach Go-Live nachgeliefert werden |

---

## TASK 1: SSH-Key-Rotation 🔴 P0 — BLOCKING

**Priorität:** P0 (Sicherheit — Blocking für Compliance)
**Status:** ⏳ OFFEN
**Owner:** Pascal (CEO) → VPS-Zugriff erforderlich
**Abhängigkeiten:** VPS-Zugang (Hostinger), SSH-Zugang zum Server
**Gate:** Security Gate

### Beschreibung
SSH-Hardening wurde bereits durchgeführt (2026-06-23):
- Root-Login deaktiviert ✅
- Passwort-Auth deaktiviert ✅
- Key-Auth erzwungen ✅
- MaxAuthTries=3 ✅

**Fehlend:** Regelmäßige SSH-Key-Rotation als Sicherheitsmaßnahme.

### Erforderliche Aktionen (durch Pascal)
1. **Alte SSH-Keys auditieren:** Welche Keys sind in `/home/ubuntu/.ssh/authorized_keys` auf dem VPS?
2. **Nicht mehr benötigte Keys entfernen:** z.B. alte Laptop-Keys, temporäre CI/CD-Keys
3. **Neuen Key generieren:** `ssh-keygen -t ed25519 -C "pascal@nexifyai"` (Ed25519 empfohlen)
4. **Neuen Key auf VPS deployen:** `ssh-copy-id -i ~/.ssh/id_ed25519.pub ubuntu@72.62.152.47`
5. **Alten Key nach Verifikation löschen**
6. **Key-Rotation-Intervall definieren:** Empfohlen: alle 90 Tage

### Warum P0?
- SSH ist der einzige Zugang zum VPS
- Nicht-rotierte Keys = Sicherheitsrisiko
- Compliance-Anforderung (BSI, ISO 27001)

### Evidence-Pfad
`/workspace/nexify/10_evidence/security/ssh_hardening_summary.md`

### Zeitrahmen
**Sofort — nächste 48 Stunden empfohlen**

---

## TASK 2: Headroom Fix 🟢 P1 — ABGESCHLOSSEN (Review nötig)

**Priorität:** P1 (Infrastruktur — kritisch für LLM-Proxy)
**Status:** ✅ TECHNISCH ABGESCHLOSSEN — Review ausstehend
**Owner:** Pascal (CEO) → Review & Bestätigung
**Abhängigkeiten:** systemd-Service erstellt, Health-Check OK
**Gate:** Review Gate

### Beschreibung
Headroom (Nous Research AI Proxy) wurde als systemd-Service eingerichtet:

| Metrik | Wert |
|--------|------|
| Service | headroom-proxy.service |
| Status | ✅ active (running) |
| Version | 0.27.0 |
| Port | 8790 |
| Auto-Start | ✅ enabled |
| Auto-Restart | ✅ Restart=always |
| Health | ✅ healthy |

### Erforderliche Aktionen (durch Pascal)
1. **Review:** Service-Status und Konfiguration bestätigen
2. **Monitoring:** Langzeit-Stabilität beobachten (24-48h)
3. **Dokumentation:** Bestätigung in Betriebshandbuch eintragen

### Warum P1?
- LLM-Proxy ist infrastrukturkritisch
- Technisch bereits gelöst — nur Bestätigung nötig

### Evidence-Pfad
`/workspace/nexify/10_evidence/bolt/task3_headroom_systemd_service.md`

### Zeitrahmen
**Review innerhalb 72 Stunden**

---

## TASK 3: Cloudflare DNS 🔴 P0 — BLOCKING

**Priorität:** P0 (Infrastruktur — Blocking für Web-Portal & Phase 5)
**Status:** ❌ BLOCKED — Token ungültig, DNS fehlerhaft
**Owner:** Pascal (CEO) → Cloudflare Dashboard-Zugriff erforderlich
**Abhängigkeiten:** Neuer API-Token oder Dashboard-Zugriff
**Gate:** Infrastructure Gate

### Beschreibung
Cloudflare DNS hat mehrere Probleme:

| Problem | Status | Impact |
|---------|--------|--------|
| API-Token ungültig | ❌ HTTP 401 | Kein API-Zugriff möglich |
| Root-Domain zeigt auf Gateway | ❌ 64.29.17.1 statt 64.29.17.65 | Landing Page falsch geroutet |
| www zeigt auf alte IP | ❌ 216.198.79.1 | WWW-Redirect defekt |
| Token in Secrets nicht lesbar | ❌ Root-only | Container kann nicht zugreifen |

### Erforderliche Aktionen (durch Pascal)
1. **Neuen API-Token generieren:**
   - Cloudflare Dashboard → https://dash.cloudflare.com
   - Account → API Tokens → Create Token
   - Template: "Edit zone DNS" für nexifyai.cloud
   - Token in `/root/.nexify/secrets/cloudflare/` speichern
2. **DNS-Einträge korrigieren:**
   - `nexifyai.cloud` → A → 64.29.17.65 (proxied)
   - `www.nexifyai.cloud` → A → 64.29.17.65 (proxied)
3. **Tunnel-Strategie klären:**
   - A-Records vs. CNAME-Tunnel für docs/portal/vorschau
4. **Skript `cf_dns_setup.py` mit neuem Token ausführen**

### Warum P0?
- Web-Portal nicht erreichbar ohne korrekte DNS
- Phase 5 (Go-Live) nicht möglich ohne funktionierende DNS
- CEO-Review erforderlich für DNS-Strategie (A-Record vs. Tunnel)

### Evidence-Pfade
- `/workspace/nexify/10_evidence/2026-06-21_cloudflare-dns-plan.md`
- `/workspace/nexify/10_evidence/cloudflare/cloudflare_free_tier_analysis.md`

### Zeitrahmen
**Sofort — nächste 48 Stunden (Blocker für Phase 5)**

---

## TASK 4: Inbetriebnahme Phase 4 ✅ ABGESCHLOSSEN

**Priorität:** P0 (Projektstatus — abgeschlossen)
**Status:** ✅ ABGESCHLOSSEN (32/32 Tests, 100%)
**Owner:** Systemmaster Agent (durchgeführt), Pascal (Bestätigung)
**Abhängigkeiten:** Keine
**Gate:** Go/No-Go Gate → GO

### Beschreibung
Phase 4 (Test) wurde erfolgreich abgeschlossen:

| Testart | Tests | Bestanden | Status |
|---------|-------|-----------|--------|
| Unit Tests | 10 | 10 | ✅ 100% |
| Integration Tests | 6 | 6 | ✅ 100% |
| Compliance Tests | 6 | 6 | ✅ 100% |
| Performance Tests | 5 | 5 | ✅ 100% |
| Security Tests | 5 | 5 | ✅ 100% |
| **Gesamt** | **32** | **32** | **✅ 100%** |

### Erforderliche Aktionen (durch Pascal)
1. **Go/No-Go bestätigen:** Phase 4-Ergebnisse reviewen
2. **Phase 5 freigeben:** Go-Live-Planung starten
3. **Vorbedingungen für Phase 5 prüfen:** DNS, Service-Zugänge, Monitoring

### Warum dokumentiert?
- Abgeschlossen, aber CEO-Bestätigung erforderlich für Phase 5
- Nächster Schritt: Phase 5 (Go-Live)

### Evidence-Pfade
- `/workspace/nexify/10_evidence/inbetriebnahme/PHASE4_ZUSAMMENFASSUNG.md`
- `/workspace/nexify/10_evidence/memory/PHASE4_BRAIN_AGENTMEMORY_UPDATE_2026-06-23.md`

### Zeitrahmen
**CEO-Review bis Ende dieser Woche**

---

## TASK 5: Externe Service-Zugänge 🟡 P1 — CRITICAL

**Priorität:** P1 (Blocking für P1-Kanban-Tasks)
**Status:** ⏳ OFFEN — Mehrere Services betroffen
**Owner:** Pascal (CEO) → Account-Erstellungen & API-Key-Beschaffung
**Abhängigkeiten:** Accounts bei Drittanbietern
**Gate:** Service Access Gate

### Beschreibung
Mehrere externe Service-Zugänge werden für den Go-Live benötigt:

| Service | Zweck | Status | Blockiert |
|---------|-------|--------|-----------|
| **Resend API** | E-Mail-Versand (Angebots-SOP) | ❌ Kein Key | K-015 (Angebots-SOP) |
| **Knowledge-Work Plugins** | KI-Berater-Features | ❌ Kein Zugang | GAP-06 |
| **Hostinger Firewall MCP** | Infrastruktur-Security | ❌ Kein MCP | GAP-01 |
| **Oracle Folgeauftrag** | Kanonisierung | ⏳ Prüfung | K-017 |
| **CI/CD-Zugang** | Repo/Deploy Drift Checks | ❌ Kein Zugang | K-021 |

### Erforderliche Aktionen (durch Pascal)
1. **Resend:**
   - Account auf resend.com erstellen
   - API-Key generieren
   - Key in `/root/.nexify/secrets/resend/` speichern
   - Domain-Verifikation für nexifyai.cloud durchführen
2. **Knowledge-Work Plugins:**
   - Benötigte Plugins identifizieren
   - Accounts erstellen
   - API-Keys beschaffen
3. **Hostinger Firewall MCP:**
   - Hostinger-Zugang prüfen
   - Firewall-API-Zugang beantragen
4. **CI/CD-Zugang:**
   - GitHub-Deploy-Key oder PAT erstellen
   - Rechte für nexifyai-platform-Repo

### Warum P1?
- P1-Kanban-Tasks (K-013 bis K-021) sind ohne Zugänge blockiert
- Go-Live erfordert funktionierende E-Mail (Resend)
- Security erfordert Firewall-Zugang

### Zeitrahmen
**Schrittweise — nächste 1-2 Wochen (vor Phase 5 Go-Live)**

---

## Priorisierungszusammenfassung

| Rang | Task | Priorität | Status | Nächste Aktion | Deadline |
|------|------|-----------|--------|-----------------|----------|
| 1 | Cloudflare DNS | 🔴 P0 | ❌ BLOCKED | Neuen Token generieren | 48h |
| 2 | SSH-Key-Rotation | 🔴 P0 | ⏳ OFFEN | Keys auditieren & rotieren | 48h |
| 3 | Externe Service-Zugänge | 🟡 P1 | ⏳ OFFEN | Resend + Hostinger priorisieren | 1-2 Wochen |
| 4 | Headroom Fix | 🟢 P1 | ✅ DONE | CEO-Review | 72h |
| 5 | Phase 4 Inbetriebnahme | 🟢 P0 | ✅ DONE | CEO-Bestätigung für Phase 5 | Diese Woche |

---

## Kritischer Pfad für Phase 5 (Go-Live)

```
[SSH-Key-Rotation] ──┐
                      ├──► [Phase 5 Vorbereitung] ──► [Go-Live]
[Cloudflare DNS] ─────┘           │
                                  ▼
                     [Externe Service-Zugänge]
```

**Phase 5 (Go-Live) ist NICHT möglich ohne:**
1. ✅ Phase 4 abgeschlossen (DONE)
2. ❌ Cloudflare DNS korrekt konfiguriert
3. ⏳ SSH-Key-Rotation durchgeführt
4. ⏳ Mindestens Resend API-Key für E-Mail-Versand

---

## Brain/Agentmemory-Einträge

### MEMORY-028: Externe Tasks dokumentiert
**Typ:** Task-Management
**Inhalt:** 5 externe Tasks identifiziert, dokumentiert und priorisiert.
**Details:**
- Cloudflare DNS: P0, BLOCKED (Token ungültig)
- SSH-Key-Rotation: P0, OFFEN
- Externe Service-Zugänge: P1, OFFEN
- Headroom Fix: P1, DONE (Review nötig)
- Phase 4: P0, DONE

### MEMORY-029: Kritischer Pfad für Phase 5
**Typ:** Projektstatus
**Inhalt:** Phase 5 (Go-Live) erfordert mindestens Cloudflare DNS Fix + SSH-Key-Rotation.
**Details:**
- Blocking: Cloudflare DNS (48h)
- Blocking: SSH-Key-Rotation (48h)
- Wichtig: Resend API-Key (1-2 Wochen)

---

**Status:** ✅ EXTERNE TASKS DOKUMENTIERT & PRIORISIERT
**Erstellt von:** Operations Agent (Hermes Subagent)
**Am:** 2026-06-23
