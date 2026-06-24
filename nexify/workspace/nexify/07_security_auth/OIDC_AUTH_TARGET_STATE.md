# OIDC Auth Target State — NeXify

**Stand:** 2026-06-12
**Status:** Target State / Plan
**Version:** 1.0

---

## 1. Zielbild

OIDC (OpenID Connect) als zentrale Authentifizierungsschicht fur 9Router, Hermes WebUI, Brain, Agentmemory und interne Tools. Langfristig OIDC-only, kurzfristig **Both-Modus** (OIDC + Legacy-API-Keys).

### Transition

```
Phase 1: Both (OIDC + Legacy-Keys)  →  JETZT
Phase 2: OIDC-default, Keys-deprecated  →  nach 30 Tagen Betrieb
Phase 3: OIDC-only                    →  nach 90 Tagen + Audits
```

**Kein OIDC-Only-Wechsel ohne getesteten zweiten Admin-/Recovery-Pfad.**

---

## 2. Provider-Konfiguration

```
Issuer URL:     https://auth.nexifyai.cloud/realms/nexify
Client ID:     nexify-9router
Client Secret: secret_ref://SEC-OIDC-CLIENT-SECRET
Redirect URL:  https://ai-router.nexifyai.cloud/v1/auth/callback
Well-Known:    https://auth.nexifyai.cloud/realms/nexify/.well-known/openid-configuration
```

### Scopes

| Scope | Zweck | Erforderlich |
|-------|-------|-------------|
| `openid` | Standard OIDC | Ja |
| `profile` | Benutzername, bevorzugter Name | Optional |
| `email` | E-Mail-Adresse | Ja (Audit) |
| `offline_access` | Refresh-Token fur langlebige Sessions | Ja (Agenten) |
| `nexify:admin` | Admin-Rolle | Fur Administratoren |
| `nexify:recovery` | Recovery/SSH-Zugriff | Nur Recovery-Service |
| `nexify:agent` | Maschinenidentitat fur Agenten | Fur CI/CD/Agent-Rollen |

### Token-Lebensdauer

| Token | Gultigkeit | Erneuerung |
|-------|-----------|-----------|
| Access Token | 15 Minuten | Still (Refresh-Token) |
| Refresh Token | 24 Stunden | Rotation bei Nutzung |
| ID Token | 1 Stunde | Neu bei Session-Start |
| Session | 8 Stunden | Maximal, dann Neu-Anmeldung |

---

## 3. Admin-Zugriff

### Wege

1. **OIDC-Web-Login** (Primary) — Browser -> auth.nexifyai.cloud -> Redirect zu Ziel-UI
2. **CLI-Token** (Secondary) — `oidc-login` Befehl, temporarer Token fur CLI-Sitzungen
3. **Break-Glass** (Notfall) — Siehe Break-Glass-Policy

### Admin-Rollen

| Rolle | OIDC-Gruppe | Berechtigungen |
|-------|------------|---------------|
| super-admin | `nexify/super-admin` | Alle Systeme, alle Secrets, volle Kontrolle |
| admin | `nexify/admin` | Alle Systeme ausser User-Management |
| operator | `nexify/operator` | Read-only + Deployment-Start |
| viewer | `nexify/viewer` | Read-only (Dashboard, Logs) |

---

## 4. Recovery-Zugriff

### Anforderungen

- Muss **vor** OIDC-Only-Wechsel existieren und getestet sein
- Mindestens **zwei unabhangige Wege** mussen funktionieren
- Kein Single-Point-of-Failure in der Auth-Kette

### Recovery-Wege

| Weg | Beschreibung | Status |
|-----|-------------|--------|
| **1. Lokaler Admin-User** | Direkter Login auf 9Router/Hermes mit `.env`-Admin-Credential | Muss vor Phase 3 |
| **2. SSH + API-Key** | SSH-Tunnel zu 9Router + statischer Recovery-Key (physisch gesichert) | Muss vor Phase 3 |
| **3. Break-Glass-Webhook** | Spezieller Webhook, der temporaren Admin-Zugriff freigibt (nur mit 2-Personen-Autorisierung) | Plan |

### Recovery-Testplan

```
Monatlich:
  [ ] Recovery-Weg 1 testen (lokaler Admin-User)
  [ ] Recovery-Weg 2 testen (SSH + API-Key)
  [ ] Protokollieren: Hat der Weg funktioniert? Latenz?

Vierteljahrlich:
  [ ] Break-Glass-Webhook testen (trocken)
  [ ] Vollstandigen Auth-Ausfall simulieren (OIDC-Provider down)
  [ ] Recovery-Dokumentation aktualisieren
```

---

## 5. Break-Glass-Login

Siehe separates Dokument: `BREAK_GLASS_LOGIN_POLICY.md`

### Kurzfassung

- **Ausloser**: OIDC-Provider nicht erreichbar, Token-Manager down, Admin-Konto gesperrt
- **Aktivierung**: 2-Personen-Prinzip (Security + DevOps)
- **Zugriffsdauer**: Maximal 60 Minuten, automatische Sperrung
- **Audit**: Vollstandige Protokollierung aller Aktionen
- **Nachbereitung**: RCA + Pramassnahmen innerhalb 24h

---

## 6. Architektur (ASCII)

```
                     ┌──────────────────────────┐
                     │   OIDC-Provider           │
                     │   auth.nexifyai.cloud     │
                     │   (Keycloak / Authelia)   │
                     └────────────┬─────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │    9Router (OIDC-Proxy)    │
                    │  ┌──────────────────────┐ │
                    │  │ Token Validation      │ │
                    │  │ Session Management    │ │
                    │  │ Scope Enforcement     │ │
                    │  └──────────────────────┘ │
                    └─────────────┬─────────────┘
                                  │
          ┌───────────────────────┼───────────────────────┐
          │                       │                       │
          ▼                       ▼                       ▼
   ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐
   │ Hermes WebUI │    │ Brain API    │    │ Agentmemory      │
   │ (Session)    │    │ (Token)      │    │ (Token)          │
   └──────────────┘    └──────────────┘    └──────────────────┘

Recovery-Pfade (Backchannel):
   ┌─────────────────────────────────────────────────────────┐
   │ 1. Lokaler Admin auf 9Router (Direktzugriff)            │
   │ 2. SSH + Recovery-API-Key (physisch gesichert)          │
   │ 3. Break-Glass-Webhook (2-Personen)                     │
   └─────────────────────────────────────────────────────────┘
```

---

## 7. Secret-Referenzen

| Secret-ID | Name | Zweck | Verwaltung |
|-----------|------|-------|-----------|
| SEC-OIDC-CLIENT-SECRET | OIDC Client Secret | OIDC-Handshake | Infisical, 90-Tage-Rotation |
| SEC-OIDC-RECOVERY-KEY | Recovery API Key | Zweiter Recovery-Weg | Physisch + Infisical |
| SEC-OIDC-ADMIN-CRED | Lokaler Admin-User | Erster Recovery-Weg | `.env` auf Recovery-Host |

---

## 8. Migration: Ist → Both → OIDC-only

### Checkliste vor OIDC-Only-Wechsel

- [ ] OIDC-Provider lauft stabil (7 Tage >99% Uptime)
- [ ] Beide Recovery-Wege getestet (Datum: _____)
- [ ] Break-Glass-Prozedur getestet (trocken, Datum: _____)
- [ ] Alle Admin-Konten haben OIDC-Login eingerichtet
- [ ] Mindestens 2 Admins konnen sich per OIDC anmelden
- [ ] Audit-Logs zeigen erfolgreiche OIDC-Logins fur alle Admins
- [ ] Rollback-Plan dokumentiert (Rucksetzen auf Both-Modus)
- [ ] Benachrichtigung an alle Nutzer: OIDC-Only ab (Datum)

### Rollback

```
Bei Problemen nach OIDC-Only-Wechsel:
1. .env-Flag OIDC_ONLY=false setzen (aktiviert Legacy-Keys wieder)
2. Dienst neustarten
3. Prüfen: Legacy-Keys funktionieren wieder
4. RCA durchfuhren
5. Nach Fix erneut auf OIDC-only wechseln
```
