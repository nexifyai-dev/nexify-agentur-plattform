# FILE: docs/gtm/DACH-ACQUISITION-PLAYBOOK.md
# NIR: 02.08.2026 09:30
# UPDATED: 02.08.2026 09:30
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI GTM
# WHAT: Operatives Playbook Neukunden DACH — Blog, SEO, Outreach, Cursor Agent
# WHY: Nur abgeschlossene Projekte bisher; Acquisition DE-first, legal, GDPR
# BEST-PRACTICE: Wertvoller Experten-Content; Affiliation offenlegen; kein Cold-Spam
# PITFALL: V-GTM-SPAM: Massenmails ohne Opt-out; NL als Acquisition-Locale
# DEPENDS: CHANNEL_REGISTER_V1.md, NAP_MASTER_V1.md, OFFER_SNIPPETS_de.md, lead-outreach
# DOCS-REF: docs/gtm/README.md, .cursor/automations/gtm-dach-content-to-agent.md
# SESSION: website-blog-dach-gtm-7dd5

# DACH Acquisition Playbook

## Ziel

Neukunden **jetzt** im deutschsprachigen Markt (DE/AT/CH). Sitz Venlo (NL) = Legal/NAP, **nicht** primärer Acquisition-Locale.

## Ownership

| Stream | Owner | Artefakte | Konflikt-Regel |
|--------|-------|-----------|----------------|
| Blog / SEO / Site findability | Cursor GTM-Content-Agent | `apps/website/content/blog/**`, SEO helpers | Keine Edits an `scripts/outreach/**` |
| Lead outreach / Firecrawl | Lead-Outreach-Agent (`bacf80ab`) | `scripts/outreach/**`, outreach API | Keine Edits an Blog-MD ohne Abstimmung |
| Directory listings (Supply) | GTM + Cursor Agent | `docs/gtm/evidence/supply-wave1/**`, CHANNEL_REGISTER | Status nur mit Evidence-URL |

## Kanäle (Cadence)

| Kanal | Frequenz | Agent-Aktion | Human-Gate |
|-------|----------|--------------|------------|
| Blog MDX/MD unter `/blog` | 2–3×/Woche draft PR | Research → Draft → PR | Review/merge (automerge wenn green) |
| Wissen cross-link | bei jedem Post | Interner Link Blog↔Wissen | — |
| LinkedIn (Company/Personal) | 2×/Woche | Draft Post + UTM | Owner Login (S02/S03) |
| Xing | 1×/Woche | Draft | Owner Login (S04) |
| Foren / Reddit DE | 1–2×/Woche | Hilfreicher Thread, Affiliation | Gate vor Post (D07) |
| Free directories | Wave-1 Checklist | Update Evidence + Register | Account/Verify wo nötig |
| GSC Sitemap | nach Deploy | Reminder Issue | Human: Search Console verify (#123 / Resend/SMTP getrennt) |

## Hard Rules

1. **Kein Spam / kein illegales Cold-Spam.** Forum = Expertenwert; Affiliation offenlegen wo verlangt.
2. **GDPR:** Unsubscribe + Source-Tracking für Outreach (Lead-Pipeline).
3. **Kein Hermes-Cutover.** Keine Secrets im Repo.
4. **DE-first Content.** NL nur Sitz/Legal — Acquisition nicht mit NL führen.

## Blog CTA

Jeder Post endet mit Links zu `/leistungen`, `/preise`, `/kontakt` (Planner). RSS: `/blog/rss.xml`.

## Directory Hooks

Bestehende Free-Directories: `CHANNEL_REGISTER_V1.md` + `evidence/supply-wave1/`. Agent aktualisiert Evidence und Register-Zeilen; Owner-Gates bleiben human.

## Daily Agent Run

Siehe `.github/workflows/gtm-dach-agent.yml` → `repository_dispatch` type `gtm-dach-content` → `event-to-cloud-agent.yml`. Prompt: `.cursor/automations/gtm-dach-content-to-agent.md`.

## Human Gates

- Resend/SMTP Credentials für Outbound-Mail
- Google Search Console Property-Verify + Sitemap submit
- LinkedIn/Xing/Google Business Logins
- Issue-Label `human-gate` blockiert Cloud-Agent-Auto-Launch
