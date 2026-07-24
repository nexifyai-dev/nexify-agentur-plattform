# CLOUDFLARE DNS TARGET STATE V1 — ZIELZUSTAND

---
**Titel:** Cloudflare DNS Target State — Definierter Zielzustand (Nicht umsetzen!)
**Status:** PLAN_ONLY — KEINE AUSFÜHRUNG OHNE FREIGABE
**Version:** 1.0.0
**Datum:** 2026-06-10
**AUTHOR:** NETZWERK-EXPERTE
**Klassifikation:** INTERNAL — NEXIFY INFRASTRUCTURE
---

## ⚠️ WARNUNG

> **Änderungen an DNS, Cloudflare Proxy, Tunnel, Vercel, SSL und Mail-DNS sind GESPERRT bis Pascal Freigabe erteilt.**
> Dieses Dokument beschreibt den **ZIELZUSTAND** — keine Änderungen ohne schriftliche Freigabe.

---

## 1. GRUNDSÄTZLICHE ENTSCHEIDUNGEN (VORSCHLÄGE)

### 1.1 DNS-Philosophie

| Prinzip | Beschreibung |
|---|---|
| **A-Records bevorzugen** | Subdomains mit A-Record direkt auf `72.62.152.47` statt CNAME-Ketten |
| **Proxy nur mit Begründung** | Cloudflare Proxy (Orange Cloud) nur aktivieren wenn zwingend nötig |
| **TTL mindestens 120s** | Kurze TTL nur für oft geänderte Einträge; Standard 300s |
| **Tunnel reduzieren** | Tunnel nur noch für Services ohne feste IP / interne Dienste |
| **SSL: Full (strict)** | SSL-Modus auf Full (strict) für alle Endpunkte |

### 1.2 Ziel-Zustand: Netzwerk-Architektur

```
Internet
   │
   ├─── nexify-automate.com ──────► Vercel (Website, Marketing)
   ├─── www.nexify-automate.com ──► 308 → Apex (Vercel)
   │
   ├─── ai-router.nexifyai.cloud ──► A-Record → 72.62.152.47 (Direkt, kein Proxy)
   ├─── agentmemory.nexifyai.cloud ► A-Record → 72.62.152.47 (Direkt, kein Proxy)
   │
   ├─── api.nexifyai.cloud ────────► A-Record → 72.62.152.47 (API-Gateway)
   ├─── auth.nexifyai.cloud ───────► A-Record → 72.62.152.47 (Authentifizierung)
   │
   └─── nexifyai.cloud ────────────► 308 → nexify-automate.com (Reserviert, Weiterleitung)
```

---

## 2. DNS-EINTRÄGE — ZIELZUSTAND

### 2.1 Domain: `nexify-automate.com`

| Typ | Name | Wert | Proxy | TTL | Begründung |
|---|---|---|---|---|---|
| A | `@` (apex) | `76.76.21.21` (Vercel) | ❌ DNS Only | `Auto` | Vercel-Serving — Apex auf Vercel-IP |
| CNAME | `www` | `nexify-automate.com` | ❌ DNS Only | `Auto` | 308 Redirect via Vercel |
| TXT | `@` | `verification-code` (Vercel) | — | `Auto` | Vercel-Domain-Verifikation |

> **HINWEIS:** Vercel nutzt eigene Anycast-IPs.
> Aktuelle Vercel-IPs (Stand 2026): `76.76.21.21`, `76.76.21.22`, `76.76.21.61`, `76.76.21.123`
> → Bitte im Vercel-Dashboard verifizieren.

### 2.2 Domain: `nexifyai.cloud`

| Typ | Name | Wert | Proxy | TTL | Begründung |
|---|---|---|---|---|---|
| A | `@` (apex) | `72.62.152.47` | ❌ DNS Only | `300` | Apex reserviert — später Weiterleitung |
| A | `ai-router` | `72.62.152.47` | ❌ DNS Only | `120` | Backend-Router — low latency nötig |
| A | `agentmemory` | `72.62.152.47` | ❌ DNS Only | `120` | Agent Memory DB — direkter Zugriff |
| A | `api` | `72.62.152.47` | ❌ DNS Only | `300` | API-Gateway — später |
| A | `auth` | `72.62.152.47` | ❌ DNS Only | `300` | Authentifizierung — später |
| A | `*.nexifyai.cloud` | `72.62.152.47` | ❌ DNS Only | `300` | Wildcard für schnelle Subdomain-Erweiterung |

---

## 3. CLOUDFLARE PROXY (ORANGE CLOUD) — ENTSCHEIDUNGSMATRIX

### 3.1 Grundsatz: Proxy NUR wenn begründet

| Kriterium | Proxy ✅ | Proxy ❌ |
|---|---|---|
| DDoS-Schutz benötigt | ✅ | — |
| SSL/TLS-Terminierung durch CF | ✅ | ❌ Eigenes Zertifikat |
| Caching (CDN) benötigt | ✅ | ❌ Dynamischer Inhalt |
| IP-Verschleierung nötig | ✅ | ❌ Öffentlicher Dienst |
| WAF/Regeln erforderlich | ✅ | ❌ Kein Bedarf |
| Websocket / langläufige Verb. | ❌ (Probleme) | ✅ Direkt |
| Eigenes SSL vorhanden | ❌ (Double-Hop) | ✅ Full (strict) |

### 3.2 Proxy-Entscheidungen pro Subdomain

| Subdomain | Proxy? | Begründung |
|---|---|---|
| `nexify-automate.com` | ❌ Nein | Vercel served direkt, kein CF-Caching sinnvoll |
| `www.nexify-automate.com` | ❌ Nein | Redirect only |
| `ai-router.nexifyai.cloud` | ❌ Nein | Websocket? → Proxy stört langläufige Verbindungen |
| `agentmemory.nexifyai.cloud` | ❌ Nein | Direkter Zugriff für niedrige Latenz |
| `api.nexifyai.cloud` | ❌ Nein | API — kein Caching, kein DDoS-Schutz nötig |
| `auth.nexifyai.cloud` | ❌ Nein | Auth — Proxy würde Token-Handling stören |

> **AUSNAHME:** Falls DDoS-Schutz oder WAF zwingend erforderlich → Proxy pro Einzelfall prüfen.

---

## 4. SSL/TLS-ZIELKONFIGURATION

### 4.1 Cloudflare SSL/TLS Settings

| Setting | Ziel-Wert | Begründung |
|---|---|---|
| **SSL/TLS Encryption Mode** | `Full (strict)` | Ende-zu-Ende-Verschlüsselung mit validem Zertifikat |
| **Minimum TLS Version** | `1.2` | Sicherheitsstandard; TLS 1.0/1.1 deaktiviert |
| **Always Use HTTPS** | `ON` | Erzwingt HTTPS für alle Anfragen |
| **Automatic HTTPS Rewrites** | `ON` | Korrigiert gemischte Inhalte |
| **HSTS** | `ON (max-age=31536000, includeSubDomains, preload)` | Strict Transport Security |
| **Certificate Type** | `Universal (Cloudflare)` oder `Custom` | Je nach Verfügbarkeit |

### 4.2 Server-Seitiges SSL

| Subdomain | SSL-Quelle | Vorschlag |
|---|---|---|
| `72.62.152.47` (Server) | Let's Encrypt (Certbot) | ✅ Automatische Erneuerung via systemd-timer |
| `nexify-automate.com` | Vercel (automatisch) | ✅ Vercel managed SSL |
| `nexifyai.cloud` Subdomains | Let's Encrypt (Certbot) | ✅ Ein Wildcard-Zertifikat für `*.nexifyai.cloud` |

---

## 5. TUNNEL-REDUKTION (ZIEL)

| Aktuell | Ziel | Aktion |
|---|---|---|
| ❓ Tunnel für Subdomain X | ❌ Entfernen | Durch A-Record ersetzen |
| ❓ Tunnel für internen Service | ✅ Behalten | Nur wenn kein direkter Zugriff möglich |
| ❓ Tunnel für Vercel-Anbindung | ❌ Entfernen | Vercel hat eigene Anycast-IPs |

> Siehe auch: `TUNNEL_REDUCTION_PLAN_V1.md`

---

## 6. NETZWERK-SICHERHEIT (ZIEL)

| Bereich | Ziel | Maßnahme |
|---|---|---|
| **Firewall** | Nur benötigte Ports offen | `ufw` / `iptables` Regeln definieren |
| **Offene Ports** | `22` (SSH, gesichert), `80`, `443`, ggf. `8443` | Alle anderen schließen |
| **SSH-Zugriff** | Nur Key-Based, kein Passwort | Pubkey-Auth only |
| **Fail2Ban** | Installiert und aktiv | Brute-Force-Schutz |
| **Backup** | Tägliches automatisches Backup | Backup-Konzept definieren |
| **Monitoring** | Gesundheits-Checks, Log-Überwachung | Prometheus? Health-Endpoint? |

---

## 7. MIGRATIONS-MATRIX (VON → ZU)

| Service | Ist | Soll | Priorität |
|---|---|---|---|
| `ai-router.nexifyai.cloud` | Tunnel / A-Record | A-Record (kein Proxy) | 🔴 Hoch |
| `agentmemory.nexifyai.cloud` | Cloudflare Proxy (301) | A-Record (kein Proxy) | 🔴 Hoch |
| `nexify-automate.com` Nameserver | Cloudflare NS? | Vercel NS? | 🟠 Mittel |
| Tunnel gesamt | ❓ | Max. 1 Tunnel | 🟠 Mittel |
| SSL-Modus | ❓ | Full (strict) | 🟠 Mittel |
| Mail-DNS (SPF/DKIM/DMARC) | Fehlt | Gesetzt oder dokumentiert | 🟢 Niedrig |

---

## 8. NICHT-ZIELE (BEWUSST NICHT)

| Was | Warum nicht |
|---|---|
| **Cloudflare als Registrar** | Nicht nötig — bestehenden Registrar belassen |
| **Cloudflare Workers** | Kein Bedarf für Serverless Functions auf CF |
| **Cloudflare Pages** | Vercel ist die aktive Plattform |
| **Argo Tunnel / Zero Trust** | Überdimensioniert für aktuellen Bedarf |
| **Load Balancer** | Single-Server — kein LB nötig |
| **CDN für statische Assets** | Vercel Edge Network ist ausreichend |

---

## 9. OFFENE PUNKTE VOR UMSETZUNG

- [ ] Cloudflare-Dashboard-Zugriff anfordern
- [ ] Vollständigen DNS-Export erstellen und sichern
- [ ] Tunnel-Liste vom Server abrufen
- [ ] Vercel-Dashboard: Custom-Domain-Status prüfen
- [ ] Let's Encrypt-Zertifikats-Status auf Server prüfen
- [ ] Mail-DNS-Entscheidung: Brauchen wir Mail? Wenn Nein → dokumentieren
- [ ] **FREIGABE durch Pascal vor erster Änderung**

---

## 10. FREIGABE-BLOCK

```
┌─────────────────────────────────────────────────┐
│ FREIGABE DURCH PASCAL                           │
├─────────────────────────────────────────────────┤
│                                                   │
│ [] Freigegeben — Zielzustand akzeptiert           │
│ [] Abgelehnt — Änderungen erforderlich:           │
│    ___________________________________            │
│                                                   │
│ Datum: _____________  Unterschrift: ___________ │
└─────────────────────────────────────────────────┘
```

---

*Ende des Cloudflare DNS Target State — Zielzustand dokumentiert.*
*Nächstes Dokument: `SUBDOMAIN_A_RECORD_PLAN_V1.md`*
