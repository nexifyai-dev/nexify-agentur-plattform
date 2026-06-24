# NeXify AI Website – technische Test-Evidence

**Zeitpunkt:** 20.06.2026, Europe/Berlin  
**Scope:** lokaler, eigenständiger Website-Build in diesem Paket

## Ausgeführte Prüfungen

```text
npm install --no-audit --no-fund
RESULT = PASSED
DEPENDENCIES = vollständig installiert

npm run typecheck
RESULT = PASSED

npm run lint
RESULT = PASSED

npm run build
RESULT = PASSED
NEXT_VERSION = 16.2.2
STATIC_PAGES_GENERATED = 30
DYNAMIC_ROUTE = /api/contact
SSG_SERVICE_ROUTES = 8
```

## Route-Smoke

Alle 27 geprüften Routen lieferten HTTP 200:

```text
/
/leistungen
/leistungen/landingpages
/leistungen/websites
/leistungen/onlineshops
/leistungen/enterprise-commerce
/leistungen/web-apps
/leistungen/mobile-apps
/leistungen/automatisierung
/leistungen/ai-agenten
/preise
/prozess
/ueber-mich
/kontakt
/faq
/referenzen
/plattform
/wissen
/impressum
/datenschutz
/agb
/ki-hinweise
/cookie-richtlinie
/avv
/widerruf
/robots.txt
/sitemap.xml
```

```text
ROUTE_SMOKE = PASSED_27_OF_27
```

## API-Negativtest

```http
POST /api/contact
Content-Type: application/json
{}
```

Ergebnis:

```text
HTTP 422
{"message":"Bitte füllen Sie alle Pflichtfelder korrekt aus."}
```

Damit wird ein unvollständiger Request abgelehnt und nicht als Erfolg ausgegeben.

## Laufzeit-Smoke

```text
GET /
HTTP = 200
Content-Type = text/html; charset=utf-8
Security Headers:
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- X-Frame-Options: SAMEORIGIN
- Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## Terminologieprüfung

```text
VERBOTENE_BEZEICHNUNGEN = 0 Vorkommen im auslieferbaren Code und Inhalt
PFLICHTSPRACHE = AI-gestützt
```

## Noch nicht als bestanden behauptet

- Browser-Screenshot des real laufenden Next-Builds war in der isolierten Umgebung durch eine Chromium-Administratorrichtlinie gegen lokale URLs blockiert.
- Die eigenständig erzeugte Designvorschau wurde visuell geprüft; der echte Build wurde stattdessen durch Production-Build, HTTP-Smokes und HTML-Inhaltsprüfung verifiziert.
- Resend-Zustellung benötigt echte, sichere Umgebungsvariablen und eine verifizierte Absenderdomain.
- Vercel-Preview, Mobile-Browser-Smokes, Lighthouse und Production-Liveprüfung stehen nach Repo-Integration aus.
- Rechts- und Steuerprüfung steht aus.
