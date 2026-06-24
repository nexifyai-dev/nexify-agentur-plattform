# NEXIFYAI.CLOUD RESERVED DOMAIN PLAN V1

---
**Titel:** nexifyai.cloud Reserved Domain Plan — Strategische Reserve-Domain
**Status:** PLAN_ONLY — KEINE AUSFÜHRUNG OHNE FREIGABE
**Version:** 1.0.0
**Datum:** 2026-06-10
**AUTHOR:** NETZWERK-EXPERTE
**Klassifikation:** INTERNAL — NEXIFY INFRASTRUCTURE
---

## ⚠️ WARNUNG

> **Änderungen an DNS, Cloudflare Proxy, Tunnel, Vercel, SSL und Mail-DNS sind GESPERRT bis Pascal Freigabe erteilt.**
> Dieses Dokument dient der **Planung** — keine Änderungen ohne schriftliche Freigabe.

---

## 1. STRATEGISCHE BEDEUTUNG VON `nexifyai.cloud`

### 1.1 Positionierung

```
nexifyai.cloud
    │
    ├── Technische Infrastruktur-Domain
    ├── Subdomains für Backend-Dienste
    ├── KI/API-Endpunkte
    ├── SDK-Hosting / Auth
    │
    └── KEINE Marketing-/Website-Funktion (dafür ist nexify-automate.com)
```

### 1.2 Entscheidungsmatrix

| Frage | Antwort | Begründung |
|---|---|---|
| Haupt-Website werden? | ❌ **Nein** | `nexify-automate.com` bleibt Hauptdomain |
| Separater Dienst werden? | ✅ **Ja** | Technische Services (API, Auth, Router) |
| Auf nexify-automate.com leiten? | ⚠️ **Später möglich** | Apex kann Redirect bekommen, Subdomains bleiben |
| Für Auth/KI-SDK nutzen? | ✅ **Ja** | Strategische Reserve für diese Zwecke |

---

## 2. SUBDOMAIN-STRUKTUR (ZIEL)

### 2.1 Aktive Subdomains

| Subdomain | Typ | Ziel | Priorität |
|---|---|---|---|
| `ai-router.nexifyai.cloud` | Backend-Router | `72.62.152.47` (VDS) | 🔴 Aktiv |
| `agentmemory.nexifyai.cloud` | Agent Memory DB | `72.62.152.47` (VDS) | 🔴 Aktiv |

### 2.2 Reservierte Subdomains (Sparplan — später aktivieren)

| Subdomain | Geplante Nutzung | Ziel | Priorität |
|---|---|---|---|
| `api.nexifyai.cloud` | API-Gateway für externe Dienste | `72.62.152.47` | 🟠 Mittel |
| `auth.nexifyai.cloud` | Authentifizierung (Auth0/NextAuth/Custom) | `72.62.152.47` | 🟠 Mittel |
| `sdk.nexifyai.cloud` | KI-SDK-Hosting / Package Registry | `72.62.152.47` od. CDN | 🟢 Niedrig |
| `docs.nexifyai.cloud` | API-Dokumentation | Vercel od. VDS | 🟢 Niedrig |
| `status.nexifyai.cloud` | System-Status-Seite | VDS od. externer Dienst | 🟢 Niedrig |
| `webhook.nexifyai.cloud` | Webhook-Empfänger | `72.62.152.47` | 🟢 Niedrig |
| `cdn.nexifyai.cloud` | CDN / Static Assets | Cloudflare / VDS | 🟢 Niedrig |

### 2.3 Wildcard-Eintrag

| Typ | Name | Wert | Begründung |
|---|---|---|---|
| A | `*.nexifyai.cloud` | `72.62.152.47` | Erlaubt schnelle Subdomain-Erweiterung ohne DNS-Änderung |

> **VORSCHLAG:** Wildcard-Eintrag als Sparplan anlegen. Dann können neue Subdomains sofort
> auf dem Server konfiguriert werden ohne DNS-Änderung.

---

## 3. WEITERLEITUNGSPLAN FÜR APEX

### 3.1 Optionen für `nexifyai.cloud` (Apex)

| Option | Beschreibung | Vorteil | Nachteil |
|---|---|---|---|
| **A) Keine Weiterleitung** | Apex zeigt Platzhalter / 404 | Einfach, keine Abhängigkeit | Ungenutzte Domain |
| **B) Weiterleitung → nexify-automate.com** | 308 Redirect auf Hauptdomain | Nutzer landen auf Website | Technische Domain wird Marketing |
| **C) Eigenes Branding** | Minimale Landing Page (VDS) | Domain sichtbar | Zusätzlicher Aufwand |
| **D) API-Playground** | Interaktive API-Testseite | Zeigt technische Power | Entwicklungsaufwand |

### 3.2 Empfehlung

> **VORSCHLAG: Option A (zunächst) → später Option D**

| Phase | Aktion | Zeitplan |
|---|---|---|
| **Phase 1 (Jetzt)** | Apex ohne Inhalt lassen (oder minimale Info-Seite) | Sofort |
| **Phase 2 (Später)** | API-Playground / Developer Portal auf Apex | Wenn API fertig |
| **Phase 3 (Optional)** | Branding-Seite mit Verweis auf nexify-automate.com | Bei Bedarf |

---

## 4. AUTH/KI-SDK-STRATEGIE

### 4.1 Geplante Nutzung

```
nexifyai.cloud
    │
    ├── auth.nexifyai.cloud
    │   └── OAuth2 / JWT / Session-Management
    │   └── Login-Endpunkte
    │   └── Token-Refresh
    │
    ├── api.nexifyai.cloud
    │   └── REST-API-Gateway
    │   └── Rate-Limiting
    │   └── Versionierung (v1, v2)
    │
    ├── sdk.nexifyai.cloud
    │   └── SDK-Download (npm, pip, etc.)
    │   └── Dokumentation
    │   └── Changelog
```

### 4.2 Vorteile dieser Trennung

- ✅ **Klare Trennung** — Website (nexify-automate.com) ≠ API/Infrastruktur (nexifyai.cloud)
- ✅ **Sicherheit** — API-Endpunkte sind isoliert von der Marketing-Website
- ✅ **Skalierbarkeit** — API kann unabhängig von der Website skaliert werden
- ✅ **Branding** — `*.nexifyai.cloud` signalisiert technische/Cloud-Natur

---

## 5. DNS-KONFIGURATION (ZIEL)

### 5.1 Cloudflare DNS-Einträge für `nexifyai.cloud`

| Typ | Name | Wert | TTL | Proxy |
|---|---|---|---|---|
| A | `@` (apex) | `72.62.152.47` | `300` | ❌ Aus |
| A | `ai-router` | `72.62.152.47` | `120` | ❌ Aus |
| A | `agentmemory` | `72.62.152.47` | `120` | ❌ Aus |
| A | `api` | `72.62.152.47` | `300` | ❌ Aus |
| A | `auth` | `72.62.152.47` | `300` | ❌ Aus |
| A | `sdk` | `72.62.152.47` | `300` | ❌ Aus |
| A | `docs` | `72.62.152.47` | `300` | ❌ Aus |
| A | `status` | `72.62.152.47` | `300` | ❌ Aus |
| A | `webhook` | `72.62.152.47` | `300` | ❌ Aus |
| A | `cdn` | `72.62.152.47` | `300` | ❌ Aus |
| A | `*` | `72.62.152.47` | `300` | ❌ Aus |

---

## 6. MIGRATION: NICHTS ZURÜCK MIGRIEREN

### 6.1 Grundsatz

> **Es findet KEINE Migration von nexify-automate.com zurück zu nexifyai.cloud statt.**
> `nexifyai.cloud` ist die technische Infrastruktur-Domain — kein Website-Ersatz.

### 6.2 Was ist bereits auf nexifyai.cloud und bleibt?

| Service | Status | Bleibt? |
|---|---|---|
| `ai-router.nexifyai.cloud` | ✅ Aktiv | ✅ Ja (optimiert) |
| `agentmemory.nexifyai.cloud` | ✅ Aktiv | ✅ Ja (optimiert) |
| *(zukünftige Services)* | ⏸ Geplant | ✅ Ja |

### 6.3 Was wird NICHT migriert?

| Service | Bleibt auf nexify-automate.com |
|---|---|
| Website / Landing Page | ✅ Ja |
| Marketing-Inhalte | ✅ Ja |
| Blog (falls vorhanden) | ✅ Ja |
| SEO-Rankings | ✅ Ja |
| Vercel-Deployment | ✅ Ja |

---

## 7. OFFENE PUNKTE

- [ ] Cloudflare-Dashboard prüfen: Sind beide Domains im selben Account?
- [ ] A-Records für reservierte Subdomains anlegen (nach Freigabe)
- [ ] Wildcard-Eintrag `*.nexifyai.cloud` anlegen (nach Freigabe)
- [ ] Let's Encrypt Wildcard-Zertifikat für `*.nexifyai.cloud` beantragen
- [ ] Apex-Weiterleitung vs. Platzhalter entscheiden
- [ ] nginx/caddy vhost-Konfiguration für Subdomains vorbereiten
- [ ] **FREIGABE durch Pascal vor Änderungen**

---

## 8. FREIGABE-BLOCK

```
┌─────────────────────────────────────────────────┐
│ FREIGABE DURCH PASCAL                           │
├─────────────────────────────────────────────────┤
│                                                   │
│ [] Freigegeben — nexifyai.cloud-Plan bestätigt    │
│ [] Abgelehnt — Änderungen erforderlich:           │
│    ___________________________________            │
│                                                   │
│ Datum: _____________  Unterschrift: ___________ │
└─────────────────────────────────────────────────┘
```

---

*Ende des Reserved Domain Plans für nexifyai.cloud.*
*Nächstes Dokument: `VERCEL_DOMAIN_PLAN_V1.md`*
