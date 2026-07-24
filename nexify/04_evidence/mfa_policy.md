# Multi-Faktor-Authentifizierung (MFA) — Policy

**Version:** 1.0
**Datum:** 2026-06-23
**Klassifikation:** Vertraulich
**Verantwortlich:** IT-Leitung / ISB
**Rechtsgrundlage:** ISO 27001 A.8.5, BSI IT-Grundschutz OPS.1.1.3

---

## 1. Ziel

Alle kritischen Systeme und Anwendungen erfordern Multi-Faktor-Authentifizierung (mindestens 2 Faktoren).

## 2. Geltungsbereich

Gilt für alle Systeme mit Zugriff auf:
- Unternehmensnetzwerk (VPN)
- Cloud-Dienste (SaaS, IaaS)
- Administrative Zugänge
- E-Mail-Systeme
- Finanzsysteme
- Quellcode-Repositories
- CI/CD-Pipelines

## 3. Akzeptierte MFA-Verfahren

| Verfahren | Sicherheitsstufe | Einsatzbereich |
|---|---|---|
| FIDO2/WebAuthn (Hardware-Key) | ★★★★★ | Admin-Zugänge, kritische Systeme |
| TOTP (Authenticator-App) | ★★★★☆ | Standard-Zugänge, Cloud-Services |
| Push-Benachrichtigung | ★★★★☆ | VPN, interne Anwendungen |
| SMS-OTP | ★★☆☆☆ | Nur als Fallback (deprecated) |

## 4. MFA-Anforderungen nach Systemklasse

| Systemklasse | MFA erforderlich | Verfahren |
|---|---|---|
| Kritisch (Admin, Root) | Ja, zwingend | FIDO2 + TOTP |
| Hoch (Finanzen, HR, Code) | Ja, zwingend | TOTP oder FIDO2 |
| Mittel (Standard-SW) | Ja | TOTP oder Push |
| Niedrig (Intranet, Wiki) | Empfohlen | TOTP |

## 5. Enrollment-Prozess

1. Bei Onboarding: MFA-Registrierung obligatorisch (erster Arbeitstag)
2. IT-Support stellt Hardware-Keys für Admins bereit
3. Self-Service-Enrollment für TOTP über Identity Provider
4. Backup-Codes: Einmalig generiert, sicher verwahrt

## 6. Ausnahmen

- Service-Accounts: Zertifikatsbasierte Authentifizierung
- Legacy-Systeme: IP-Whitelist + Monitoring als Übergangslösung
- Ausnahmen bedürfen schriftlicher Genehmigung durch ISB

## 7. Nicht-Konformität

- Zugangsdeaktivierung nach 14 Tagen ohne MFA-Setup
- Eskalation an Vorgesetzten nach 7 Tagen

---

**Freigabe:** Geschäftsführung NeXify GmbH
**Datum:** 2026-06-23
