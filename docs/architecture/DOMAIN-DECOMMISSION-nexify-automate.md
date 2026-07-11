# Domain-Abkündigung: nexify-automate.com → nexifyai.cloud (Entscheidung 11.07.2026)

## Entscheidung (Betreiber, verbindlich)

`nexify-automate.com` wird **nicht mehr verwendet**. Die Domain bleibt nur als
**reine 301-Weiterleitung auf `nexifyai.cloud`** bestehen. Es gibt keinen eigenen
Content, kein eigenes Deployment und keine neuen Verweise mehr auf diese Domain.

## Ziel-Zustand

| Aufruf | Ziel |
|---|---|
| `nexify-automate.com/*` | `301 → https://nexifyai.cloud/*` (Pfad erhalten) |
| `www.nexify-automate.com/*` | `301 → https://nexifyai.cloud/*` |

## Umsetzung (wo die Weiterleitung konfiguriert wird)

Die Domain ist aktuell als zusätzliche Production-Domain am Vercel-Projekt `website`
angebunden (deshalb zeigte `nexify-automate.com/de` bisher die Live-Seite statt einer
Weiterleitung). Umstellung:

1. **Vercel** (Projekt `website` → Settings → Domains): `nexify-automate.com` und
   `www.nexify-automate.com` von „Serve" auf **„Redirect to nexifyai.cloud" (301)**
   umstellen. Das ist die einzige nötige Änderung, solange das DNS der Domain auf
   Vercel zeigt.
2. Alternativ (falls DNS zu Cloudflare umzieht): Bulk-Redirect-Regel
   `*nexify-automate.com/* → https://nexifyai.cloud/$2` (301, preserve path).

## Repo-Status (bereits erledigt / bewusst offen)

- ✅ `apps/website/.env.example`: Domain-Altlast `nexify-automate.com` → `nexifyai.cloud`
  korrigiert (PR #5). Im Website-Quellcode existieren keine Referenzen mehr.
- ⚠️ **Bewusst belassen**: `backend/tests/*` verwenden `…@nexify-automate.com` als
  Test-E-Mail-Adressen (u. a. der real angelegte Test-Kunde `support@nexify-automate.com`).
  Das sind Postfach-Adressen, keine Web-Referenzen. Sobald das Mail-Setup der Domain
  abgeschaltet wird, müssen (a) der Test-Kunden-Account im Live-System auf eine
  `@nexifyai.cloud`-Adresse migriert und (b) diese Testdateien angepasst werden.
- ⚠️ Historische Erwähnungen in `memory/`, `docs/`, `nexify/` (Betriebsnotizen/Audits)
  bleiben als Historie stehen — sie beschreiben Vergangenheit und werden nicht umgeschrieben.

## Prüfkriterien (Definition of Done)

- [ ] `curl -sI https://nexify-automate.com/de` liefert `301` mit
      `location: https://nexifyai.cloud/de` (nicht 200).
- [ ] `curl -sI https://www.nexify-automate.com` liefert `301` auf `nexifyai.cloud`.
- [ ] Vercel-Projekt `website` listet die Domain als Redirect, nicht als Serving-Domain.
- [ ] Test-Kunde auf `@nexifyai.cloud` migriert, Backend-Tests grün.
