# FILE: docs/gtm/GSC-SITEMAP-HUMAN-GATE.md
# NIR: 02.08.2026 09:35
# UPDATED: 02.08.2026 09:35
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI GTM
# WHAT: Human-Gate Checkliste Google Search Console + Sitemap
# WHY: Agent kann Property nicht verifizieren; Deploy liefert sitemap.xml
# DEPENDS: https://www.nexifyai.cloud/sitemap.xml, /blog/rss.xml
# DOCS-REF: docs/gtm/DACH-ACQUISITION-PLAYBOOK.md
# SESSION: website-blog-dach-gtm-7dd5

# Google Search Console — Human Gate

## Schritte (Owner)

1. Property `https://www.nexifyai.cloud` (URL-Präfix oder Domain) verifizieren.
2. Sitemap einreichen: `https://www.nexifyai.cloud/sitemap.xml`
3. Optional Feed-Hinweis: `https://www.nexifyai.cloud/blog/rss.xml` (nicht GSC-Sitemap, aber Discovery).
4. Nach Merge Blog-PR: URL-Prüfung für `/blog` und 1–2 Seed-Artikel anstoßen.
5. hreflang: erwartet `de` + `x-default` (kein gleichwertiges NL-Acquisition-hreflang).

## Getrennt (nicht GSC)

- Resend/SMTP für Outbound: Secrets außerhalb Repo; Label `human-gate` auf Issues.
- Issue-Tracker-Referenz: interne Ops-Issue (z. B. #123) für Verify-Status pflegen.

## Agent-Hinweis

Cloud Agent darf nur erinnern / Draft-Issues öffnen — keine Credentials speichern.
