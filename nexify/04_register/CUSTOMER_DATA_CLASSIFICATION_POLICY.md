# Customer Data Classification Policy — NeXify AI OS
## Version: 1.0 | Status: BINDING | Erstellt: 2026-06-23
## JSON-Pendant: `04_projects/customer-data-classification-policy.json`

---

## 1. Zweck und Geltungsbereich
Diese Policy definiert die Klassifikation aller Daten in der NeXify AI OS-Plattform nach Vertraulichkeitsstufen und legt Speicher-, Logging- und Incident-Regeln fest.

**Geltungsbereich:** Alle Daten — Kundenprojekte (CUSTOMER_PROJECT) und intern (NEXIFY_INTERNAL).

---

## 2. Klassifikationsstufen

| Stufe | Label | Beschreibung | Brain-Speicherung |
|---|---|---|---|
| **PUBLIC** | Öffentlich | Kein Schaden bei Offenlegung | ✅ Brain (Metadata) |
| **INTERNAL** | Intern | NeXify-intern, nicht kundenbezogen | ✅ Brain (Scope: NEXIFY_INTERNAL) |
| **CONFIDENTIAL** | Vertraulich | Kundenprojektdaten, Geschäftslogik | ⚠️ Brain (Scope: CUSTOMER_PROJECT, nur Metadata) |
| **RESTRICTED** | Streng vertraulich | PII, Secrets, Zahlungsdaten | ❌ NIEMALS Brain, NIEMALS Logs |

---

## 3. Kundenprojekt-Daten

### 3.1 Studienkolleg Aachen (CP-001)

| Datentyp | Klassifikation | Speicherort | Brain |
|---|---|---|---|
| Projektname / Status | INTERNAL | Workspace-Register | ✅ |
| Repo-URLs | INTERNAL | Workspace-Register | ✅ |
| Deployment-Domain | INTERNAL | Workspace-Register | ✅ |
| Studieninhalte | CONFIDENTIAL | NUR Kunden-Repo | Nur Metadata |
| Studentendaten | RESTRICTED | NUR Kunden-Repo | ❌ |
| API-Keys / Secrets | RESTRICTED | NUR Kunden-.env | ❌ |

### 3.2 Affilientportal / Bookando (CP-002)

| Datentyp | Klassifikation | Speicherort | Brain |
|---|---|---|---|
| Projektname / Status | INTERNAL | Workspace-Register | ✅ |
| Repo-URLs | INTERNAL | Workspace-Register | ✅ |
| Deployment-Domain | INTERNAL | Workspace-Register | ✅ |
| Affiliate-Daten | CONFIDENTIAL | NUR Kunden-Repo | Nur Metadata |
| Nutzerdaten | RESTRICTED | NUR Kunden-Repo | ❌ |
| Zahlungsdaten | RESTRICTED | NUR Stripe | ❌ |
| API-Keys / Secrets | RESTRICTED | NUR Kunden-.env | ❌ |

---

## 4. NeXify-Interne Daten

| Datentyp | Klassifikation | Brain |
|---|---|---|
| Systemkonfiguration | INTERNAL | ✅ |
| Agent-Prompts | INTERNAL | ✅ |
| Betriebsdaten (Register) | INTERNAL | ✅ |
| Brain Write Token | RESTRICTED | ❌ |
| 9Router API Keys | RESTRICTED | ❌ |
| Cloudflare Tokens | RESTRICTED | ❌ |
| Vercel Tokens | RESTRICTED | ❌ |
| Supabase Credentials | RESTRICTED | ❌ |
| Resend API Keys | RESTRICTED | ❌ |

---

## 5. Logging-Regeln

| Klassifikation | Logging erlaubt |
|---|---|
| PUBLIC / INTERNAL | ✅ Ja |
| CONFIDENTIAL (ohne PII) | ⚠️ Nur in strukturierten Logs, rotiert |
| RESTRICTED | ❌ Nein |
| Secrets / Keys | ❌ Nein |
| PII | ❌ Nein |

---

## 6. Incident-Regeln

| Vorfall | Maßnahme |
|---|---|
| Datenleck | → P0 Incident (sofortige Eskalation) |
| Vertrauliche Daten in Logs | → Sofort löschen, PII-Patch anwenden |
| Secret in Brain | → Sofort rotieren, Brain-Eintrag maskieren |

---

## 7. Review-Zyklus
Diese Policy wird bei jedem neuen Datentyp, bei Incident-Reviews und halbjährlich überprüft.

---

## 8. Änderungshistorie

| Version | Datum | Autor | Änderung |
|---|---|---|---|
| 1.0.0 | 2026-06-23 | Systemmaster | Initiale Fassung — MD-Pendant zu JSON |

---

*Ende CUSTOMER_DATA_CLASSIFICATION_POLICY*
