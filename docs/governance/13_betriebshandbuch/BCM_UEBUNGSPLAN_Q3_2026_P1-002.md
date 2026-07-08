# BCM-Übungsplan Q3/2026 (P1-002)
## NeXifyAI Agentur-Plattform

> **Datum:** 2026-07-08 | **Version:** 1.0
> **Kontext:** ISO 22301 (Business Continuity), BCM-Pflicht
> **Status:** GEPLANT | **Genehmigung:** CAB erforderlich

---

## 1. Übungsziele

| Ziel | Messgröße |
|------|----------|
| Incident-Response funktionsfähig | Reaktionszeit < 15 Min (P0) |
| Rollback-Plan praktisch erprobt | Restore-Zeit < 30 Min |
| Kommunikationskette funktioniert | Alle Rollen erreicht innerhalb 10 Min |
| Lessons Learned dokumentiert | Verbesserungsmaßnahmen identifiziert |

---

## 2. Geplante Szenarien

### Szenario 1: VPS-Ausfall (srv1243952)

| Feld | Detail |
|------|--------|
| **Termin** | 16. Juli 2026, 10:00 UTC |
| **Dauer** | 2 Stunden |
| **Trigger** | VPS nicht erreichbar (simuliert durch DNS-TTL-Ablauf) |
| **Betroffene Systeme** | S01–S07, S11 (Hermes, Paperclip, 9Router, agentmemory, LightRAG, Spaether, Traefik) |
| **Erwartetes Verhalten** | Traefik-Fallback → Maintenance-Page. Cloudflare CDN hält Cache. |
| **Ablauf** | |
| | 1. Detektion: Health-Check-Script meldet Timeout (0 Min) |
| | 2. Eskalation: P0-Kette (CSO → CEO → CTO) (2 Min) |
| | 3. Diagnose: SSH-Zugang prüfen, Docker-Status (5 Min) |
| | 4. Wiederherstellung: `docker compose up -d` oder VPS-Reboot (15 Min) |
| | 5. Verifikation: Health-Check alle Endpunkte (20 Min) |
| | 6. Post-Mortem: Dokumentation (30 Min) |
| **Messwerte** | MTTR, Kommunikationskette vollständig, Rollback erfolgreich |
| **Erfolgskriterium** | MTTR < 30 Min, alle Endpunkte erreichbar |

### Szenario 2: Datenleck (Tenant-Isolation-Breach)

| Feld | Detail |
|------|--------|
| **Termin** | 30. Juli 2026, 10:00 UTC |
| **Dauer** | 3 Stunden |
| **Trigger** | Tenant A erhält Daten von Tenant B (simuliert via DB-Query-Fehler) |
| **Betroffene Systeme** | S03 (Paperclip), S08 (Supabase) |
| **Erwartetes Verhalten** | P0-Incident. Sofortige Isolation. DSGVO-Meldepflicht prüfen. |
| **Ablauf** | |
| | 1. Detektion: Monitoring-Agent meldet Anomalie (0 Min) |
| | 2. Isolation: Betroffener Tenant gesperrt (5 Min) |
| | 3. Eskalation: P0-Kette + DSB (10 Min) |
| | 4. Forensik: Logs prüfen, Umfang bestimmen (30 Min) |
| | 5. DSGVO-Meldung: Prüfung 72h-Window (60 Min) |
| | 6. Wiederherstellung: Tenant-Reinigung (90 Min) |
| | 7. Post-Mortem: Lessons Learned (120 Min) |
| **Messwerte** | MTTD, MTTR, DSGVO-Frist eingehalten, Kommunikation vollständig |
| **Erfolgskriterium** | Isolation < 10 Min, DSGVO-Meldung innerhalb 72h |

### Szenario 3: Angriff (Credential-Kompromittierung)

| Feld | Detail |
|------|--------|
| **Termin** | 13. August 2026, 10:00 UTC |
| **Dauer** | 2 Stunden |
| **Trigger** | API-Key-Leak (simuliert via Test-Key in Git) |
| **Betroffene Systeme** | S04 (9Router), S08 (Supabase), S09 (Cloudflare) |
| **Erwartetes Verhalten** | P0-Incident. Sofortige Key-Rotation. Git-History bereinigen. |
| **Ablauf** | |
| | 1. Detektion: Secret-Scan meldet Leak (0 Min) |
| | 2. Isolation: Betroffene Keys gesperrt (2 Min) |
| | 3. Rotation: Neue Keys generieren, verteilen (15 Min) |
| | 4. Git-Cleanup: BFG Repo-Cleanup oder force-push (30 Min) |
| | 5. Verifikation: Alle Dienste mit neuen Keys (45 Min) |
| | 6. Post-Mortem: Wie konnte das passieren? (60 Min) |
| **Messwerte** | MTTD, Rotation-Zeit, Git-Cleanup vollständig |
| **Erfolgskriterium** | Key-Rotation < 15 Min, kein aktiver Leak nach 30 Min |

---

## 3. Rollen & Verantwortlichkeiten

| Rolle | Person/Agent | Aufgabe in Übung |
|-------|-------------|-----------------|
| **Übungsleiter** | Pascal | Start/Stop, Bewertung, Lessons Learned |
| **Incident Commander** | Systemmaster Agent | Eskalationsleitung, Entscheidungen |
| **Technischer Lead** | Hermes Agent | Diagnose, Wiederherstellung |
| **Kommunikator** | Paperclip Agent | Status-Updates, Stakeholder-Informierung |
| **Dokumentar** | Hermes Agent | Protokoll, Evidence, Nachbereitung |
| **Beobachter** | Pascal (Fallback) | Qualitätssicherung, Feedback |

---

## 4. Nachbereitung (pro Szenario)

| Schritt | Frist | Verantwortlich |
|---------|-------|---------------|
| Übungsprotokoll erstellen | +1 Tag | Dokumentar |
| Lessons Learned dokumentieren | +2 Tage | Übungsleiter |
| Verbesserungsmaßnahmen definieren | +3 Tage | Incident Commander |
| Maßnahmen in Kanban übertragen | +5 Tage | Systemmaster |
| Nächste Übung planen | +30 Tage | Pascal |

---

## 5. Erfolgskriterien (Gesamt)

| Kriterium | Ziel | Messung |
|-----------|------|---------|
| Alle 3 Szenarien durchgeführt | 3/3 | Übungsprotokolle |
| MTTR (VPS-Ausfall) | < 30 Min | Zeitmessung |
| Isolation (Datenleck) | < 10 Min | Zeitmessung |
| Key-Rotation (Angriff) | < 15 Min | Zeitmessung |
| Lessons Learned | ≥ 3 pro Szenario | Dokumentation |
| Verbesserungsmaßnahmen | ≥ 2 pro Szenario | Kanban |

---

## 6. Versionierung

| Version | Datum | Autor | Änderung |
|---------|-------|-------|----------|
| 1.0 | 2026-07-08 | Hermes Agent (Automode) | Initiale Planung Q3/2026 |

---

*P1-002: BCM-Übungsplan Q3/2026. Genehmigung durch CAB erforderlich.*
*Nächster Schritt: CAB-Meeting Mittwoch 10:00 UTC — Übungsplan freigeben.*
