# VERCEL DOMAIN PLAN V1

---
**Titel:** Vercel Domain Plan — Custom Domains, Env-Vars, Deployment-Hooks
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

## 1. VERCEL-PROJEKT-ÜBERSICHT

### 1.1 Bekannte Informationen

| Aspekt | Wert | Status |
|---|---|---|
| **Vercel Account** | Existiert (vermutlich Pascal persönlich) | ❓ Bestätigung nötig |
| **Team / Personal** | ❓ Team oder persönlicher Account? | ❓ Unbekannt |
| **Projektname** | ❓ Unbekannt | ❓ Unbekannt |
| **vercel.json** | ✅ Im Repository vorhanden | 📄 Inhalt prüfen |
| **Git-Integration** | ❓ GitHub? GitLab? | ❓ Unbekannt |
| **Production Branch** | ❓ `main` / `master`? | ❓ Unbekannt |
| **Framework** | ❓ Next.js? Static? | ❓ Unbekannt |

---

## 2. CUSTOM DOMAINS

### 2.1 Aktuelle Custom Domains (Annahme)

```
nexify-automate.com      → Production
www.nexify-automate.com  → Redirect → nexify-automate.com
```

### 2.2 Ziel: Custom Domains

| Domain | Status | Vercel-Konfiguration |
|---|---|---|
| `nexify-automate.com` | ✅ Aktiv (besteht) | Als Production Domain setzen |
| `www.nexify-automate.com` | ✅ Aktiv (besteht) | Redirect zur Apex |
| `nexifyai.cloud` | ❌ Nicht in Vercel | Bleibt auf VDS — nicht in Vercel |
| `docs.nexifyai.cloud` | ⏸ Optional (später) | Könnte auf Vercel deployt werden |

### 2.3 Custom Domain hinzufügen (falls nötig)

> **HINWEIS:** Wenn keine Änderung nötig, bestehende Konfiguration belassen.

Falls neue Domains in Vercel hinzugefügt werden sollen:

```
Schritt 1: Vercel-Dashboard → Project → Settings → Domains
Schritt 2: Domain eingeben
Schritt 3: DNS-Konfiguration befolgen (A-Record auf Vercel-IP oder CNAME)
Schritt 4: SSL-Zertifikat ausstellen lassen (Vercel macht das automatisch)
Schritt 5: Warten auf Propagation und grünen Haken
```

### 2.4 Vercel-DNS-IPs

```
76.76.21.21
76.76.21.22
76.76.21.61
76.76.21.123
```

> ⚠️ Diese IPs können sich ändern. Aktuelle IPs im Vercel-Dashboard prüfen.

---

## 3. ENVIRONMENT VARIABLES

### 3.1 Notwendige Umgebungsvariablen

| Variable | Beschreibung | Beispielwert | Secret? |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | Basis-URL für API | `https://api.nexifyai.cloud` | ❌ Nein |
| `NEXT_PUBLIC_AUTH_URL` | Auth-Endpoint | `https://auth.nexifyai.cloud` | ❌ Nein |
| `NEXIFY_API_KEY` | API-Key für Backend-Kommunikation | *(geheim)* | ✅ Ja |
| `DATABASE_URL` | Datenbank-Verbindung | *(geheim)* | ✅ Ja |
| `REDIS_URL` | Redis-Verbindung (falls nötig) | *(geheim)* | ✅ Ja |
| `JWT_SECRET` | JWT-Signierung | *(geheim)* | ✅ Ja |
| `CLOUDFLARE_API_TOKEN` | Cloudflare-API-Token | *(geheim)* | ✅ Ja |
| `TUNNEL_TOKEN` | Tunnel-Auth (falls nötig) | *(geheim)* | ✅ Ja |

### 3.2 Umgebungsstufen

| Umgebung | Beschreibung | Domain |
|---|---|---|
| **Production** | Live-Website | `nexify-automate.com` |
| **Preview** | PR-Deployments | `*-git-xxx.vercel.app` |
| **Development** | Lokale Entwicklung | `localhost:3000` |

### 3.3 Empfehlung: Env-Vars organisieren

```
📁 .env.local              → Lokale Entwicklung (nicht im Git)
📁 .env.production         → Production-Werte (Referenz)
📁 .env.example            → Template für neue Developer
```

> **WICHTIG:** Secrets niemals ins Repository committen.
> Production-Umgebungsvariablen ausschließlich im Vercel-Dashboard setzen.

---

## 4. DEPLOYMENT-HOOKS

### 4.1 Warum Deployment-Hooks?

```
CI/CD (GitHub Actions) ──► POST /v1/integrations/deploy/... ──► Vercel Build
```

- ✅ Automatische Deployments bei Git-Push
- ✅ Manuelle Trigger (z.B. nach Datenbank-Migration)
- ✅ Integration mit Server-hooks

### 4.2 Vorschlag: Deployment-Hook einrichten

```
Schritt 1: Vercel-Dashboard → Project → Settings → Git → Deployment Hooks
Schritt 2: Hook-Name: "production-deploy"
Schritt 3: Branch: "main" (oder production-Branch)
Schritt 4: URL kopieren: https://api.vercel.com/v1/integrations/deploy/...
Schritt 5: In GitHub Actions (oder anderen CI-Tools) hinterlegen
```

### 4.3 Verwendung im Deployment-Workflow

```yaml
# Beispiel: .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        run: |
          curl -X POST "${{ secrets.VERCEL_DEPLOY_HOOK_URL }}"
```

---

## 5. VERCELL KONFIGURATION (vercel.json)

### 5.1 Aktuelle vercel.json prüfen

> **ERFORDERLICH:** Inhalt von `vercel.json` aus Repository lesen und auf folgende Punkte prüfen:

```
Prüfpunkte:
[ ] Rewrites definiert?
[ ] Redirects definiert?
[ ] Headers (CSP, Security) gesetzt?
[ ] Functions-Konfiguration?
[ ] Region-Einstellungen?
[ ] trailingSlash?
[ ] cleanUrls?
```

### 5.2 Empfohlene Minimal-Konfiguration

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
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
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
  "trailingSlash": false,
  "cleanUrls": true
}
```

---

## 6. VERCEL ANALYTICS & MONITORING

| Feature | Aktivieren? | Begründung |
|---|---|---|
| **Web Analytics** | ✅ Ja | Nutzungsstatistiken ohne Cookie-Banner |
| **Speed Insights** | ✅ Ja | Performance-Monitoring |
| **Logs** | ✅ Ja (Production) | Debugging und Fehleranalyse |
| **Edge Config** | ⏸ Später | Feature-Flags, Config ohne Deploy |

---

## 7. FREIGABE-RELEVANTE ÄNDERUNGEN

### 7.1 Welche Änderungen brauchen Freigabe?

| Änderung | Freigabe nötig? | Risiko |
|---|---|---|
| Neue Custom Domain | ✅ Ja | 🟠 Mittel — DNS-Änderung |
| Env-Vars ändern | ✅ Ja | 🟠 Mittel — könnte App-Verhalten ändern |
| Deployment-Hook einrichten | ❌ Nein | 🟢 Gering — nur neuer Trigger |
| vercel.json anpassen | ✅ Ja | 🟠 Mittel — Header/Rewrites ändern Verhalten |
| Vercel Analytics aktivieren | ❌ Nein | 🟢 Gering — kein Effekt auf Funktion |

### 7.2 Änderungen ohne Freigabe (Routine)

- Deployment auslösen (git push)
- Logs einsehen
- Analytics-Daten abrufen
- Environment-Variablen für Preview-Umgebungen

---

## 8. OFFENE PUNKTE

- [ ] Vercel-Dashboard-Zugriff anfordern
- [ ] Aktuelle Custom Domains dokumentieren
- [ ] `vercel.json` aus Repository prüfen
- [ ] Env-Vars dokumentieren (Werte geheim halten)
- [ ] Deployment-Hook für CI/CD einrichten
- [ ] Analytics & Speed Insights aktivieren
- [ ] **FREIGABE durch Pascal vor Änderungen**

---

## 9. FREIGABE-BLOCK

```
┌─────────────────────────────────────────────────┐
│ FREIGABE DURCH PASCAL                           │
├─────────────────────────────────────────────────┤
│                                                   │
│ [] Freigegeben — Vercel-Plan wie beschrieben      │
│ [] Abgelehnt — Änderungen erforderlich:           │
│    ___________________________________            │
│                                                   │
│ Datum: _____________  Unterschrift: ___________ │
└─────────────────────────────────────────────────┘
```

---

*Ende des Vercel Domain Plans.*
*Nächstes Dokument: `MAIL_DNS_SPF_DKIM_DMARC_FIX_PLAN_V1.md`*
