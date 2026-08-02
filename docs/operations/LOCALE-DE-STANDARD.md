# FILE: docs/operations/LOCALE-DE-STANDARD.md
# NIR: 02.08.2026 09:50
# UPDATED: 02.08.2026 09:50
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI DevOps
# WHAT: SoT — Deutsch (de / de-DE) als Standard-Locale system- und anwendungsweit
# WHY: Acquisition + Apps sind DACH-first; NL ist Firmensitz, nicht Default-UI
# BEST-PRACTICE: de default; en/nl nur explizit gewählt; Exceptions dokumentieren
# PITFALL: Accept-Language/NL nicht als Acquisition-Default; kein Hermes-Prod-Cutover
# DEPENDS: apps/website i18n, backend Accept-Language, Host /etc/default/locale
# DOCS-REF: docs/operations/TIMEZONE-EUROPE-BERLIN.md (parallel, nicht widersprüchlich)
# SESSION: locale-de-standard-7dd5

# Locale-Standard: Deutsch (`de` / `de-DE`)

## Mandat

| Ebene | Default |
|-------|---------|
| Produkt-UI / Website / APIs (owned copy) | **Deutsch (`de`)** |
| Agent-Kommunikation (Cursor/Hermes-Agenten) | **Deutsch** |
| Host OS / Shell | **`de_DE.UTF-8`** |
| NL | Firmensitz (Venlo) — **kein** Acquisition-/App-Default |
| Englisch | Nur wo technisch unvermeidbar (Identifier, Upstream-UIs) |

Zeitzone parallel: `Europe/Berlin` — siehe `TIMEZONE-EUROPE-BERLIN.md` (separater Branch/PR).

## Website (`apps/website`)

- `defaultLocale = "de"` in `lib/i18n.ts` und `middleware.ts`
- Cookie `NEXT_LOCALE=de` wenn unset; SSR `<html lang="de">`
- Unprefixed Marketing-URLs; Locale-Präfixe werden gestrippt (kein Redirect nach `/nl`)
- **Kein** Accept-Language-Redirect auf NL/EN für Acquisition
- hreflang: `de` + `en` + `nl` + **`x-default`** (Inhalt = DE-Default)

## Hermes / WebUI-Preview

- Preview-Hub (`apps/webui-preview`) und Registry: Default-Locale **de**
- Prod Hermes (`:8787` / `apps/hermes/static/i18n.js`): Upstream-Fallback ist noch **en** —
  Änderung erst mit explizitem Cutover (HARD STOP). Preview darf `hermes-lang=de` setzen.

## Backend / APIs

- Request-State `request.state.locale` aus `Accept-Language`, Default **`de`**
- User-facing Fehlermeldungen und E-Mail-Templates: Deutsch wo wir Copy besitzen

## Host / CI / Docker

```bash
# Verify
cat /etc/default/locale   # LANG=de_DE.UTF-8
locale -a | grep de_DE
echo "$LANG"
```

- CI: `LANG=de_DE.UTF-8` (mit `LC_ALL=C.UTF-8` für portable Runner)
- Docker (Website/Backend): `ENV LANG=C.UTF-8` + Kommentar Produkt-Default DE
- Hermes-Dockerfile: Upstream `en_US`/`C` — Exception bis Cutover

## EN-only Upstream-Exceptions (akzeptiert)

1. **Hermes WebUI Prod** — `i18n.js` Fallback `en` bis Cutover-Freigabe
2. **Hermes Dockerfile** — `LANG=en_US.utf8` / `LC_ALL=C` (Upstream-Image-Konvention)
3. **Code-Identifier / OpenAPI field names** — Englisch (HTTP/JSON-Konvention)
4. **Webhook/Channel-Sync Maschinencodes** — kurze EN-Tokens (`bad token`, …)
5. **Third-party Dashboards** (Portainer, Grafana, GitLab Admin, Paperclip) — Upstream-EN
6. **npm/pip Log-Ausgabe** — Toolchain EN
7. **GitHub Actions Runner-Images** — Base oft `C.UTF-8`; Job-Env setzt `LANG` wo nötig

## Verifikation (kurz)

```bash
grep LANG /etc/default/locale
# Website: Cookie NEXT_LOCALE=de ohne gespeicherte Präferenz
# Backend: Accept-Language fehlt → request.state.locale=de
```
