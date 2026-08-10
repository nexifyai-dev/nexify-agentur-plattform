# Backup-Retention-Richtlinie — Finalisierung (P1-005)
## Ergänzung zu BACKUP_RESTORE_DR_POLICY_V1

> **Datum:** 2026-07-08 | **Version:** 1.0
> **Basis:** BACKUP_RESTORE_DR_POLICY_V1, VERARBEITUNGSVERZEICHNIS_VVT_ART30_DSGVO
> **Status:** VERBINDLICH

---

## 1. Retention-Tabelle (Final)

Diese Tabelle finalisiert die Aufbewahrungsfristen für alle Systeme, abgestimmt auf das VVT Art. 30 DSGVO.

| System | Backup-Intervall | Retention | Löschfrist (VVT) | Compliance |
|--------|-----------------|-----------|-----------------|------------|
| **S01 Hermes Runtime** | Täglich | 7 Tage | Session: 30d, Chat: 90d nach Projektende | ISO 27001 A.12 |
| **S02 Hermes WebUI** | Täglich | 7 Tage | Sessions: nach Abmeldung, Chat: 30d | ISO 27001 A.12 |
| **S03 Paperclip** | Täglich | 7 Tage | Projektdaten: Vertragsende + 3 Jahre | ISO 27001 A.12, DSGVO |
| **S04 9Router** | Täglich | 7 Tage | Error-Logs: 7d, Prompts: kein Logging | ISO 27001 A.12 |
| **S05 agentmemory** | Täglich | 30 Tage | Observations: Projektende + 90d, Memories: 365d Inaktivität | ISO 27001 A.12 |
| **S06 LightRAG** | Vor Re-Index | 30 Tage | Embeddings: bei Re-Indexierung | ISO 27001 A.12 |
| **S07 Spaether** | Wöchentlich | 4 Wochen | Leads ohne Fortschritt: 90d, Abgelehnte: sofort | DSGVO |
| **S08 Supabase** | Täglich (Supabase-intern) | 30 Tage (PITR) | Projektdaten: Vertragsende + 3 Jahre | DSGVO, ISO 27001 |
| **S09 Cloudflare** | Manuell bei Änderung | 90 Tage | DNS-Logs: 24h, Analytics: 30d | ISO 27001 A.12 |
| **S10 VPS (Website)** | Manuell bei Änderung | 30 Tage | Server-Logs: intern (journald), Build-Logs: 30d | ISO 27001 A.12 |
| **S11 Traefik** | Config-Export vor Änderung | 30 Tage | Access-Logs: 7d | ISO 27001 A.12 |
| **S12 Website** | Git-basiert | Permanent | Kontaktanfragen: Bearbeitung + 90d | DSGVO |
| **S13 Factory** | Täglich | 7 Tage | Session-Daten: nach Abmeldung | ISO 27001 A.12 |

---

## 2. Löschfristen-Übersicht (absteigend)

| Frist | Daten | Systeme |
|-------|-------|---------|
| **Sofort** | Abgelehnte Leads | S07 |
| **< 24h** | DNS-Logs | S09 |
| **7 Tage** | Error-Logs, Access-Logs, tägliche Backups | S04, S11, S01, S02, S03, S13 |
| **30 Tage** | Session-Backups, Build-Logs, Analytics, Supabase PITR | S05, S06, S08, S10, S01, S02 |
| **90 Tage** | Chat-Verläufe nach Projektende, Observations, Kontaktanfragen, Leads ohne Fortschritt | S01, S05, S07, S12 |
| **365 Tage** | Inaktive agentmemory Memories | S05 |
| **3 Jahre** | Projektdaten nach Vertragsende | S03, S08 |
| **Permanent** | Git-Historie, aktive Memories | S12, S05 |

---

## 3. Automatisierte Löschung

| Mechanismus | System | Trigger |
|------------|--------|---------|
| Supabase PITR | S08 | Automatisch (30d Window) |
| agentmemory Retention | S05 | memory_heal + memory_governance_delete |
| Logrotate | S11, S04 | Täglich via systemd |
| Hermes Session Archive | S01, S02 | compress_threshold (80000 tokens) |
| Supabase Cron | S03 | `DELETE WHERE created_at < now() - interval '3 years'` (geplant) |

---

## 4. Restore-Test-Protokoll (Quartalsweise)

| Test | System | Methode | Erfolgskriterium |
|------|--------|---------|-----------------|
| SQLite-Restore | S05, S04 | `.dump` einspielen | Daten vollständig |
| Supabase-PITR | S08 | Point-in-time Recovery | Zeitpunkt exakt |
| Docker-Volume | S01–S07 | Volume-Mount + Start | Container gesund |
| Config-Restore | Alle | Config-Export importieren | Services starten |

---

## 5. Compliance-Abgleich

| Anforderung | Quelle | Erfüllt |
|------------|--------|---------|
| Backup-Retention ≥ 30d für kritische Systeme | ISO 27001 A.12.3 | ✅ (S05, S08: 30d) |
| Löschfristen definiert | DSGVO Art. 17 | ✅ (diese Tabelle) |
| Restore-Test quartalsweise | ISO 27001 A.12.3 | ✅ (§4) |
| Vor-Change-Backup | CHANGE_MANAGEMENT_POLICY_V1 | ✅ (§1) |
| Backup-Isolation (tenant) | CUSTOMER_PROJECT_ISOLATION_POLICY | ⚠️ (noch nicht implementiert) |

---

## 6. Versionierung

| Version | Datum | Autor | Änderung |
|---------|-------|-------|----------|
| 1.0 | 2026-07-08 | Hermes Agent (Automode) | Finalisierung mit VVT-Abgleich |

---

*P1-005: Backup-Retention-Richtlinie finalisiert. Ergänzt BACKUP_RESTORE_DR_POLICY_V1.*
