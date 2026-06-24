# NEXIFY-AUTOMATE ACTIVE WEBSITE PLAN V1

---
**Titel:** Nexify-Automate Active Website Plan — Hauptdomain-Strategie
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

## 1. STRATEGISCHE ENTSCHEIDUNG

### 1.1 Beschluss

> **`nexify-automate.com` bleibt die aktive Haupt-Website-Domain.**
> Keine Migration zu `nexifyai.cloud` als Hauptdomain.

### 1.2 Begründung

| Grund | Detail |
|---|---|
| **Etabliert** | Domain ist indexiert, verlinkt, hat SEO-Aufbau |
| **Funktioniert** | 200 OK, SSL aktiv, Vercel-Anbindung läuft |
| **Kein Grund für Wechsel** | `nexifyai.cloud` ist für technische Dienste reserviert |
| **Aufwand/Nutzen** | Migration wäre Aufwand ohne erkennbaren Mehrwert |

---

## 2. DOMAIN-STRUKTUR (AKTUELL & ZIEL)

### 2.1 Aktuelle Struktur

```
nexify-automate.com (Apex)
    │
    ├── 200 OK (Vercel — Website)
    │
    └── www.nexify-automate.com
         └── 308 Redirect → nexify-automate.com
```

### 2.2 Ziel-Struktur (unverändert, nur optimiert)

```
nexify-automate.com (Apex)
    │
    ├── 200 OK (Vercel — Website, Landing Page)
    ├── SSL: Full (strict) via Cloudflare
    ├── HSTS aktiv
    │
    └── www.nexify-automate.com
         └── 308 Redirect → nexify-automate.com (permanent)
```

---

## 3. WWW-SUBDOMAIN-PLAN

### 3.1 Status Quo

| Aspekt | Wert | Status |
|---|---|---|
| `www` existiert | ✅ Ja | Aktiv |
| Redirect-Typ | `308 Permanent Redirect` | ✅ Korrekt |
| Ziel | `https://nexify-automate.com` | ✅ Korrekt |
| SSL auf www | ✅ Aktiv | ✅ Korrekt |

### 3.2 Empfehlung

| Maßnahme | Empfehlung | Begründung |
|---|---|---|
| `www` beibehalten? | ✅ **Ja** | Weiterleitung ist SEO-korrekt |
| `308` statt `301`? | ✅ **308** (behalten) | 308 bewahrt POST-Daten, sicherer |
| HSTS auf www? | ✅ **Ja** | Sollte HSTS der Apex erben |
| `www` als canonical? | ❌ **Nein** | Apex (`nexify-automate.com`) ist canonical |

### 3.3 DNS-Eintrag für www

| Typ | Name | Wert | TTL | Proxy |
|---|---|---|---|---|
| CNAME | `www` | `nexify-automate.com` | `Auto` | ❌ Aus |

> **HINWEIS:** Der Redirect wird von Vercel gesteuert (in `vercel.json` oder Vercel-Dashboard).
> DNS leitet nur an Vercel weiter.

---

## 4. SSL-PLAN

### 4.1 SSL-Strategie für nexify-automate.com

| Aspekt | Vorschlag | Status |
|---|---|---|
| **SSL-Modus (Cloudflare)** | `Full (strict)` | ⏸ Änderung geplant |
| **Zertifikatsquelle** | Vercel (managed) + Cloudflare (Universal) | ✅ Aktiv |
| **HSTS** | `max-age=31536000; includeSubDomains; preload` | ⏸ Prüfen ob aktiv |
| **Minimum TLS Version** | `1.2` | ⏸ Prüfen ob korrekt |
| **Always Use HTTPS** | `ON` | ⏸ Prüfen |
| **Automatic HTTPS Rewrites** | `ON` | ⏸ Prüfen |

### 4.2 Vercel SSL

> Vercel stellt automatisch SSL-Zertifikate für Custom Domains aus.
> Kein manuelles Zertifikat nötig für `nexify-automate.com`.

| Aspekt | Status |
|---|---|
| Vercel SSL automatisch | ✅ Ja |
| Erneuerung | ✅ Automatisch |
| Custom Domain verifiziert | ❓ Prüfen im Vercel-Dashboard |

---

## 5. VERCEL-ANBINDUNG

### 5.1 Aktuelle Vercel-Konfiguration

| Aspekt | Status | Aktion |
|---|---|---|
| **vercel.json** | ✅ Im Repository vorhanden | Inhalt prüfen |
| **Custom Domain `nexify-automate.com`** | ❓ Vermutlich aktiv | Im Vercel-Dashboard prüfen |
| **Custom Domain `www.nexify-automate.com`** | ❓ Vermutlich aktiv | Im Vercel-Dashboard prüfen |
| **Environment Variables** | ❓ Unbekannt | Dokumentieren |
| **Deployment-Hooks** | ❓ Unbekannt | Für CI/CD prüfen |

### 5.2 Optimierungsvorschläge

| Optimierung | Vorschlag | Priorität |
|---|---|---|
| **Headers** | CSP, X-Frame-Options, X-Content-Type-Options setzen | 🟠 Mittel |
| **Redirects** | `vercel.json` auf Sauberkeit prüfen | 🟢 Niedrig |
| **Deployment-Hook** | Für Auto-Deployment einrichten | 🟢 Niedrig |
| **Analytics** | Vercel Analytics aktivieren? | 🟢 Niedrig |

### 5.3 Beispiel: vercel.json (Empfehlung)

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://api.nexifyai.cloud"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/:path*/",
      "destination": "/:path*",
      "permanent": true
    }
  ],
  "trailingSlash": false
}
```

---

## 6. NAMESERVER-PLAN

### 6.1 Aktuelle Nameserver

| Aspekt | Status |
|---|---|
| **Aktueller Registrar** | ❓ Unbekannt |
| **Nameserver von `nexify-automate.com`** | ❓ Cloudflare? Vercel? |
| **Nameserver von `nexifyai.cloud`** | ❓ Cloudflare? |

### 6.2 Empfehlung

| Domain | Nameserver | Begründung |
|---|---|---|
| `nexify-automate.com` | **Vercel NS** (oder Cloudflare) | Wenn Vercel DNS managed → geringere Latenz |
| `nexifyai.cloud` | **Cloudflare NS** | Für Subdomain-Management auf VDS |

> ⚠️ **WICHTIG:** Nameserver-Wechsel hat massive Auswirkungen.
> → Aktuellen Status ermitteln bevor Änderungen geplant werden.

---

## 7. MONITORING & HEALTH CHECKS

### 7.1 Vorschlag: Health-Checks

| Endpunkt | Erwartung | Intervall |
|---|---|---|
| `https://nexify-automate.com` | `200 OK` | 5 Minuten |
| `https://www.nexify-automate.com` | `308` → `200` | 5 Minuten |
| SSL-Zertifikat | > 30 Tage bis Ablauf | Täglich |

### 7.2 Tools

| Tool | Zweck | Vorschlag |
|---|---|---|
| **Uptime Robot** | Externer Monitoring-Dienst | Kostenloser Plan für 5 Checks |
| **Better Uptime** | Externes Monitoring + Status-Seite | Falls gewünscht |
| **Vercel Analytics** | Performance + Traffic | In Vercel integriert |

---

## 8. OFFENE PUNKTE

- [ ] Vercel-Dashboard checken: Custom Domains, Env-Vars, Deployments
- [ ] `vercel.json` aus Repository lesen und prüfen
- [ ] SSL-Konfiguration in Cloudflare checken (Full strict?)
- [ ] HSTS-Status prüfen (mit `curl -I` oder `ssllabs.com`)
- [ ] Nameserver-Konfiguration beider Domains notieren
- [ ] Vercel Analytics / Monitoring einrichten
- [ ] **FREIGABE durch Pascal vor Änderungen**

---

## 9. FREIGABE-BLOCK

```
┌─────────────────────────────────────────────────┐
│ FREIGABE DURCH PASCAL                           │
├─────────────────────────────────────────────────┤
│                                                   │
│ [] Freigegeben — Website-Plan wie beschrieben     │
│ [] Abgelehnt — Änderungen erforderlich:           │
│    ___________________________________            │
│                                                   │
│ Datum: _____________  Unterschrift: ___________ │
└─────────────────────────────────────────────────┘
```

---

*Ende des Active Website Plans für nexify-automate.com.*
*Nächstes Dokument: `NEXIFYAI_CLOUD_RESERVED_DOMAIN_PLAN_V1.md`*
