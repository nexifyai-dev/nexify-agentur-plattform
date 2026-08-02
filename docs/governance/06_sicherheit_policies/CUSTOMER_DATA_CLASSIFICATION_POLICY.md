# Customer Data Classification Policy V1

**Status**: VERBINDLICH | **Scope**: CUSTOMER_PROJECT + NEXIFY_INTERNAL
**Erstellt**: 2026-06-11

## 1. Klassifikationsstufen

| Stufe | Label | Beschreibung | Brain-Speicherung |
|-------|-------|-------------|------------------|
| **PUBLIC** | Öffentlich | Kein Schaden bei Offenlegung | ✅ Brain (Metadata) |
| **INTERNAL** | Intern | NeXify-intern, nicht kundenbezogen | ✅ Brain (Scope: NEXIFY_INTERNAL) |
| **CONFIDENTIAL** | Vertraulich | Kundenprojektdaten, Geschäftslogik | ⚠️ Brain (Scope: CUSTOMER_PROJECT, nur Metadata) |
| **RESTRICTED** | Streng vertraulich | PII, Secrets, Zahlungsdaten | ❌ NIEMALS Brain, NIEMALS Logs |

## 2. Daten pro Kundenprojekt

### Studienkolleg Aachen (CP-001)

| Datentyp | Klassifikation | Speicherort | Brain-Status |
|----------|---------------|-------------|-------------|
| Projektname / Status | INTERNAL | Workspace-Register | ✅ |
| Repo-URLs | INTERNAL | Workspace-Register | ✅ |
| Deployment-Domain | INTERNAL | Workspace-Register | ✅ |
| Studieninhalte | CONFIDENTIAL | NUR Kunden-Repo | ⚠️ Metadata only |
| Studentendaten | RESTRICTED | NUR Kunden-Repo | ❌ Niemals |
| API-Keys / Secrets | RESTRICTED | NUR Kunden-.env | ❌ Niemals |

### Affilientportal / Bookando (CP-002)

| Datentyp | Klassifikation | Speicherort | Brain-Status |
|----------|---------------|-------------|-------------|
| Projektname / Status | INTERNAL | Workspace-Register | ✅ |
| Repo-URLs | INTERNAL | Workspace-Register | ✅ |
| Deployment-Domain | INTERNAL | Workspace-Register | ✅ |
| Affiliate-Daten | CONFIDENTIAL | NUR Kunden-Repo | ⚠️ Metadata only |
| Nutzerdaten | RESTRICTED | NUR Kunden-Repo | ❌ Niemals |
| Zahlungsdaten | RESTRICTED | NUR Revolut Merchant (PCI via Hosted Checkout) | ❌ Niemals |
| API-Keys / Secrets | RESTRICTED | NUR Kunden-.env | ❌ Niemals |

## 3. NeXify-Interne Daten

| Datentyp | Klassifikation | Brain-Status |
|----------|---------------|-------------|
| Systemkonfiguration | INTERNAL | ✅ |
| Agent-Prompts | INTERNAL | ✅ |
| Betriebsdaten (Register) | INTERNAL | ✅ |
| Brain Write Token | RESTRICTED | ❌ |
| 9Router API Keys | RESTRICTED | ❌ |
| Cloudflare Tokens | RESTRICTED | ❌ |
| Vercel Tokens | RESTRICTED | ❌ |
| Supabase Credentials | RESTRICTED | ❌ |
| Resend API Keys | RESTRICTED | ❌ |

## 4. Logging-Regeln

| Datentyp | Loggen erlaubt? |
|----------|----------------|
| PUBLIC/INTERNAL | ✅ |
| CONFIDENTIAL (ohne PII) | ⚠️ Nur in strukturierten Logs, rotiert |
| RESTRICTED | ❌ NIEMALS loggen |
| Secrets/Keys | ❌ NIEMALS loggen |
| PII | ❌ NIEMALS loggen |

## 5. Incident-Regeln

- Datenleck → P0 Incident
- Vertrauliche Daten in Logs → Sofort löschen, PII-Patch anwenden
- Secret in Brain → Sofort rotieren, Brain-Eintrag maskieren

---

*Ende Customer Data Classification Policy V1*
