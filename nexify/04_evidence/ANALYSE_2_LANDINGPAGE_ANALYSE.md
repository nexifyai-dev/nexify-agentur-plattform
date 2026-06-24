# Analyse 2: Landingpage-Analyse und Anforderungsdefinition

**Datum:** 2026-06-22 | **Status:** EVIDENCE | **Version:** 1.0.0
**Analyst:** Frontend/Design Agent (NeXify AI OS)
**Quellen:** Live-Site (nexifyai.cloud), lokale Website (`nexifyai-agency-website`), Analyse 1, Design-Vorgabe, Quality Audit

---

## 1. Zusammenfassung

Die Landingpage `nexifyai.cloud` ist eine vollständig implementierte Next.js 16 Website mit **20 Seitenrouten**, **12 React-Komponenten**, eigenem CSS-Designsystem (351 Zeilen `globals.css`) und umfangreichen Test-Gates (TypeScript, ESLint, Playwright Design-Audit auf 11 Viewports). Die Seite ist **technisch solide**, aber hat **signifikante Design-Inkonsistenzen** zum definierten Graphite Designsystem und **fehlende Features** für eine professionelle SaaS-/Agentur-Präsenz.

**Kernbefund:** Die Website ist funktional vollständig und produktionsfähig (31 statische Seiten, alle Tests bestanden). Die Hauptaufgaben sind: (1) Designsystem-Vereinheitlichung mit Graphite Premium, (2) Light-Mode-Implementierung, (3) Performance- und SEO-Optimierung, (4) fehlende Features ergänzen.

---

## 2. Aktueller Stand — Technologie-Analyse

### 2.1 Tech Stack

| Komponente | Technologie | Version |
|------------|------------|---------|
| Framework | Next.js (App Router) | 16.2.2 |
| UI Library | React | 19.2.0 |
| CSS | Tailwind CSS 4 + Custom CSS | 4.1.11 |
| TypeScript | TypeScript | 5.9.2 |
| Icons | Lucide React | 0.468.0 |
| Component Pattern | Radix UI Slot + CVA | 1.2.3 / 0.7.1 |
| Testing | Node Test Runner + Playwright | - |
| Deployment | Vercel (vorbereitet) | - |

### 2.2 Architektur

```
nexifyai-agency-website/
├── app/                    # Next.js App Router (20 Routen)
│   ├── page.tsx           # Homepage/Landingpage
│   ├── layout.tsx         # Root Layout (Header + Footer + JSON-LD)
│   ├── globals.css        # Design-Tokens + alle Styles (351 Zeilen)
│   ├── leistungen/        # Service-Übersicht + [slug] Detailseiten
│   ├── preise/            # Preise + Pricing-Table
│   ├── prozess/           # Arbeitsweise (5-Schritte-Timeline)
│   ├── ueber-mich/        # Über mich
│   ├── kontakt/           # Kontaktformular
│   ├── referenzen/        # Referenzen
│   ├── plattform/         # Plattform
│   ├── wissen/            # Wissens-Hub
│   ├── faq/               # FAQ
│   ├── impressum/         # Impressum (Pflicht)
│   ├── datenschutz/       # Datenschutz (Pflicht)
│   ├── agb/               # AGB (Pflicht)
│   ├── ki-hinweise/       # AI-Hinweise
│   ├── cookie-richtlinie/ # Cookie-Richtlinie
│   ├── avv/               # AVV
│   └── widerruf/          # Widerrufsbelehrung
├── components/            # 12 Komponenten
│   ├── ui/               # Badge, Button, Card, Input, Textarea
│   ├── site-header.tsx   # Sticky Header mit Glass-Blur
│   ├── site-footer.tsx   # 4-Spalten Footer
│   ├── brand.tsx         # Logo (45° Squares)
│   ├── operator-visual.tsx # 3D Dashboard-Visualisierung
│   ├── pricing-calculator.tsx # Interaktiver Rechner
│   ├── contact-form.tsx  # Kontaktformular
│   └── legal-page.tsx    # Legal-Dokument-Layout
├── lib/
│   ├── site-data.ts      # Firmendaten, Services, Prozess, FAQs
│   ├── utils.ts          # cn(), euro()
│   └── legal-content.ts  # Rechtstexte
└── tests/
    ├── site-contract.test.mjs   # Contract-Tests
    └── e2e/design-audit.spec.ts # Playwright Design-Audit
```

---

## 3. Design-Analyse

### 3.1 Aktuelle Design-Tokens (globals.css)

```css
:root {
  --background: #08090a;       /* Fast schwarz */
  --foreground: #f5f7f8;       /* Fast weiß */
  --panel: #101316;            /* Dunkelgrau */
  --panel-2: #15191d;          /* Mitteldunkel */
  --line: rgba(255,255,255,.1);
  --muted: #8b9298;
  --accent: #ff6417;           /* Orange */
  --accent-2: #ff9308;         /* Helles Orange */
  --lime: #baff00;             /* Neon-Grün */
  --cyan: #8be9ff;             /* Cyan */
  --font-body: "Inter", "Avenir Next", "Segoe UI", Arial, sans-serif;
  --font-display: "Space Grotesk", "Avenir Next", "Segoe UI", Arial, sans-serif;
}
```

### 3.2 Farbsystem-Bewertung

| Aspekt | Status | Bewertung |
|--------|--------|-----------|
| Primärfarbe (Orange #ff6417) | ✅ Implementiert | CTA-stark, mutig, aber grenzwertige WCAG-Kontraste |
| Sekundärfarbe (Lime #baff00) | ✅ Implementiert | Nur für Status/Validität — korrekt eingesetzt |
| Tertiärfarbe (Cyan #8be9ff) | ✅ Implementiert | Kaum genutzt — Potential für technische Signale |
| Hintergrund-Gradient | ✅ Implementiert | Subtiler Noise-Overlay + Gradient — professionell |
| Light Mode | ❌ FEHLT | Nur Dark Mode implementiert |
| Graphite Premium Integration | ⚠️ TEILWEISE | Tokens weichen von Graphite Premium ab |

### 3.3 Typografie-Bewertung

| Aspekt | Status | Details |
|--------|--------|---------|
| Body Font | ✅ Inter | Google Fonts, sans-serif Fallback |
| Display Font | ✅ Space Grotesk | Google Fonts, für Headlines |
| Base Size | ✅ 16px | Modern, lesbar |
| Line Heights | ✅ Definiert | 1.06 (Headlines), 1.72 (Body) |
| Letter Spacing | ✅ Definiert | Negative Tracking für Headlines (-.062em) |
| Responsive Scaling | ✅ clamp() | `clamp(3.45rem, 6vw, 5.75rem)` für Hero |

### 3.4 Komponenten-Bewertung

| Komponente | Status | Qualität | Anmerkungen |
|------------|--------|----------|-------------|
| Button | ✅ Implementiert | Gut | 3 Varianten, Gradient-BG, Focus-Ring |
| Card | ✅ Implementiert | Gut | Glass-Border, 18px Radius |
| Badge | ✅ Implementiert | Gut | shadcn/ui Pattern |
| Input | ✅ Implementiert | Gut | Floating Label fehlt |
| Textarea | ✅ Implementiert | Gut | - |
| SiteHeader | ✅ Implementiert | Gut | Sticky, Glass-Blur, Mobile-Menü |
| SiteFooter | ✅ Implementiert | Gut | 4-Spalten, rechtliche Links |
| Brand | ✅ Implementiert | Gut | 45° Squares Logo |
| OperatorVisual | ✅ Implementiert | Sehr gut | 3D-Dashboard, animiert |
| PricingCalculator | ✅ Implementiert | Gut | Interaktiv, +/- Buttons |
| ContactForm | ✅ Implementiert | Gut | Validierung, Spam-Schutz |
| LegalPage | ✅ Implementiert | Gut | Strukturiert |

### 3.5 Layout-Analyse

| Aspekt | Status | Details |
|--------|--------|---------|
| Grid System | ✅ 12-Spalten | `site-container` mit 1180px max-width |
| Responsive | ✅ 3 Breakpoints | 760px, 1100px, Desktop |
| Spacing | ✅ Konsistent | Section-padding, gap-Werte definiert |
| Accessibility | ✅ Skip-Link | `skip-link` implementiert |
| Reduced Motion | ✅ Implementiert | `prefers-reduced-motion` Respekt |

---

## 4. Content-Analyse

### 4.1 Homepage-Struktur (page.tsx)

| Sektion | Inhalt | Qualität |
|---------|--------|----------|
| **Hero** | Badge + H1 + Beschreibung + 2 CTAs + Trust-Indikatoren | ✅ Sehr gut |
| **Proof Strip** | 4 Kennzahlen (999€, 1 Tag, 2-3 Tage, 6-8 Tage) | ✅ Gut |
| **Leistungen** | 8 Service-Cards mit Preisen | ✅ Gut |
| **Warum dieser Preis** | 3 Feature-Pillars + Founder-Panel | ✅ Gut |
| **Arbeitsweise** | 5-Schritte-Prozess-Grid | ✅ Gut |
| **Projekt-Rechner** | Interaktiver Pricing-Calculator | ✅ Gut |
| **CTA-Panel** | Finale Aktion mit Kontaktlink | ✅ Gut |

### 4.2 Navigation

| Link | Ziel | Status |
|------|------|--------|
| Leistungen | /leistungen | ✅ |
| Preise | /preise | ✅ |
| Arbeitsweise | /prozess | ✅ |
| Über mich | /ueber-mich | ✅ |
| Kontakt | /kontakt | ✅ |

### 4.3 SEO-Metadaten

| Aspekt | Status | Details |
|--------|--------|---------|
| Title | ✅ | "NeXify AI — AI-gestützte Websites, Apps & Automatisierung" |
| Description | ✅ | 155 Zeichen, Keyword-reich |
| Open Graph | ✅ | title, description, locale (de_DE), siteName |
| JSON-LD | ✅ | ProfessionalService Schema |
| Canonical | ✅ | "/" |
| Sitemap | ✅ | `app/sitemap.ts` implementiert |
| Robots | ✅ | `app/robots.ts` implementiert |
| Keywords | ⚠️ | Meta-Keywords (wenig relevant, aber vorhanden) |

---

## 5. Fehlende Features und Anforderungen

### 5.1 KRITISCH (P0) — Fehlende Features

| # | Feature | Beschreibung | Aufwand |
|---|---------|--------------|---------|
| 1 | **Light Mode** | Nur Dark Mode implementiert. Für Accessibility und Professionalität erforderlich. Graphite Premium hat beide Modi definiert. | 4-6h |
| 2 | **Cookie-Consent-Banner** | DSGVO/TTDSG Pflicht. Kein Cookie-Banner implementiert. | 2-3h |
| 3 | **Analytics/Tracking** | Kein Analytics implementiert. Kein Nachweis über Besucherzahlen möglich. | 1-2h |
| 4 | **Favicon/OG-Image** | `icon.svg` vorhanden, aber kein `og-image.png` für Social Sharing. | 1h |

### 5.2 HOCH (P1) — Verbesserungen

| # | Feature | Beschreibung | Aufwand |
|---|---------|--------------|---------|
| 5 | **Testimonials/Referenzen** | Referenzen-Seite existiert, aber keine echten Kundenstimmen. Social Proof fehlt. | 2-3h |
| 6 | **Blog/Wissen** | Wissen-Seite existiert, aber keine Artikel. Content-Marketing-Basis fehlt. | 4-8h |
| 7 | **Live-Chat/Widget** | Kein Kommunikationskanal außer Formular. Intercom/Crisp/Tawk.to fehlt. | 1-2h |
| 8 | **Performance-Optimierung** | Keine Bildoptimierung, kein Lazy-Loading, kein CDN für Assets. | 2-3h |
| 9 | **Animationen** | Keine Scroll-Animationen, keine Page-Transitions. Graphite Premium definiert 7 Animationstypen. | 3-4h |

### 5.3 MITTEL (P2) — Ergänzungen

| # | Feature | Beschreibung | Aufwand |
|---|---------|--------------|---------|
| 10 | **Mehrsprachigkeit** | Nur Deutsch. Für DACH+NL-Markt wäre Englisch sinnvoll. | 8-12h |
| 11 | **Newsletter-Integration** | Kein Newsletter-Signup. Resend-Integration vorbereitet (siehe Quality Audit). | 2-3h |
| 12 | **Case Studies** | Keine detaillierten Projektbeschreibungen. | 4-6h |
| 13 | **Team-Seite** | Nur "Über mich". Für Wachstum relevant. | 2h |
| 14 | **Partner-/Tool-Logos** | Keine Technologie- oder Partner-Logos. Vertrauen aufbauen. | 1-2h |

### 5.4 NIEDRIG (P3) — Nice-to-Have

| # | Feature | Beschreibung | Aufwand |
|---|---------|--------------|---------|
| 15 | **Dark/Light Toggle** | Theme-Switcher im Header. | 1-2h |
| 16 | **Scroll-to-Top Button** | Für lange Seiten. | 0.5h |
| 17 | **Breadcrumbs** | Für Subpages (Leistungen, etc.). | 1h |
| 18 | **Print-Stylesheet** | Für Rechnungen/Angebote. | 1h |

---

## 6. Design-Inkonsistenzen zu Graphite Premium

### 6.1 Farb-Migration (aus Analyse 1)

| Aktuell (Website) | Graphite Premium | Aktion |
|--------------------|-----------------|--------|
| `--accent: #ff6417` (Orange) | `--accent-hushed: #5B5F97` (Indigo) | **ENTSCHEIDUNG ERFORDERLICH** |
| `--lime: #baff00` | `--color-success: #0F8F70` | Professioneller |
| `--cyan: #8be9ff` | `--color-info: #5B5F97` | Vereinheitlichen |
| `--background: #08090a` | `--color-canvas: #080808` (Dark) | Angleichen |

### 6.2 Komponenten-Migration

| Komponente | Aktuell | Graphite Premium | Aktion |
|------------|---------|-----------------|--------|
| Button | Gradient-BG, 18px Shadow | Flat, 1px Lift | Ersetzen |
| Card | `rounded-[18px]`, Glass-Border | `rounded-[8px]`, definierte Tokens | Anpassen |
| Header | `blur(20px) saturate(140%)` | `blur(12px)` | Reduzieren |
| Body BG | Radial-Gradient + Noise | Definierte Canvas-Farbe | Angleichen |

### 6.3 WCAG-Probleme (aus Analyse 1)

| Kombination | Kontrast | WCAG | Problem |
|-------------|---------|------|---------|
| `#ff6417` auf `#08090a` | 4.8:1 | ⚠️ AA (grenzwertig) | Orange auf schwarz |
| `rgba(255,255,255,.38)` auf `#08090a` | 3.2:1 | ❌ FAIL | Zu wenig Kontrast |
| `rgba(255,255,255,.47)` auf `#08090a` | 4.1:1 | ⚠️ AA (grenzwertig) | Muted Text |

---

## 7. Integrationsplan

### Phase 1: Designsystem-Vereinheitlichung (Woche 1)

**Ziel:** Graphite Premium als kanonisches Designsystem etablieren.

| Schritt | Beschreibung | Aufwand | Abhängigkeit |
|---------|--------------|---------|--------------|
| 1.1 | Akzentfarbe entscheiden (Orange vs. Indigo) | 1h | Stakeholder-Entscheidung |
| 1.2 | Graphite Premium Tokens in `globals.css` integrieren | 2h | 1.1 |
| 1.3 | Light Mode Tokens implementieren | 3h | 1.2 |
| 1.4 | Dark/Light Toggle im Header | 2h | 1.3 |
| 1.5 | Alle Komponenten auf neue Tokens migrieren | 4h | 1.2 |
| 1.6 | WCAG-Kontraste prüfen und korrigieren | 2h | 1.5 |

### Phase 2: Kritische Features (Woche 2)

**Ziel:** DSGVO-konform, messbar, professionell.

| Schritt | Beschreibung | Aufwand | Abhängigkeit |
|---------|--------------|---------|--------------|
| 2.1 | Cookie-Consent-Banner implementieren | 3h | - |
| 2.2 | Analytics (Plausible/Umami) integrieren | 2h | 2.1 |
| 2.3 | OG-Image für Social Sharing erstellen | 1h | - |
| 2.4 | Performance-Audit (Lighthouse) | 1h | - |
| 2.5 | Bildoptimierung + Lazy-Loading | 2h | 2.4 |

### Phase 3: Content und Social Proof (Woche 3)

**Ziel:** Vertrauen aufbauen, Content-Marketing-Basis schaffen.

| Schritt | Beschreibung | Aufwand | Abhängigkeit |
|---------|--------------|---------|--------------|
| 3.1 | 3-5 Testimonials/Referenzen sammeln | 2h | - |
| 3.2 | Referenzen-Seite mit echten Projekten befüllen | 3h | 3.1 |
| 3.3 | 3-5 Blog-Artikel schreiben (Wissen-Seite) | 8h | - |
| 3.4 | Newsletter-Integration (Resend) | 3h | - |
| 3.5 | Partner-/Tool-Logos ergänzen | 2h | - |

### Phase 4: Premium Features (Woche 4)

**Ziel:** Graphite Premium Features vollständig nutzen.

| Schritt | Beschreibung | Aufwand | Abhängigkeit |
|---------|--------------|---------|--------------|
| 4.1 | Scroll-Animationen (Intersection Observer) | 3h | 1.2 |
| 4.2 | Page-Transitions (View Transitions API) | 2h | 1.2 |
| 4.3 | Glass-Effekte für Topbar optimieren | 1h | 1.2 |
| 4.4 | Depth-System für Cards (Elevated, Glass) | 2h | 1.2 |
| 4.5 | Skeleton-Loading für dynamische Inhalte | 1h | 1.2 |

---

## 8. Technische Anforderungen

### 8.1 Performance-Ziele

| Metric | Aktuell (geschätzt) | Ziel | Priorität |
|--------|---------------------|------|-----------|
| Lighthouse Performance | ~85 | ≥95 | P1 |
| LCP (Largest Contentful Paint) | ~2.5s | <1.5s | P1 |
| FID (First Input Delay) | ~100ms | <50ms | P1 |
| CLS (Cumulative Layout Shift) | ~0.1 | <0.05 | P1 |
| TTFB (Time to First Byte) | ~800ms | <200ms | P2 |

### 8.2 Accessibility-Ziele

| Kriterium | Aktuell | Ziel | Priorität |
|-----------|---------|------|-----------|
| WCAG Level | AA (teilweise) | AA vollständig | P0 |
| Kontraste (Text) | 4.1:1 - 4.8:1 | ≥4.5:1 (AA), ≥7:1 (AAA) | P0 |
| Keyboard Navigation | ✅ | ✅ | P0 |
| Screen Reader | ⚠️ Basis | ✅ Vollständig | P1 |
| Reduced Motion | ✅ | ✅ | P0 |

### 8.3 SEO-Ziele

| Kriterium | Aktuell | Ziel | Priorität |
|-----------|---------|------|-----------|
| Meta-Tags | ✅ Vollständig | ✅ | P0 |
| Structured Data | ✅ JSON-LD | ✅ Erweitern | P1 |
| Sitemap | ✅ | ✅ | P0 |
| Robots.txt | ✅ | ✅ | P0 |
| Canonical URLs | ✅ | ✅ | P0 |
| Blog/Content | ❌ Leer | 5+ Artikel | P2 |

---

## 9. Empfehlungen

### 9.1 Sofort umsetzen (diese Woche)

1. **Akzentfarbe final entscheiden** — Orange beibehalten oder zu Graphite Premium Indigo wechseln. Empfehlung: Orange beibehalten (starke Marke, CTA-optimiert).
2. **Cookie-Consent-Banner** — DSGVO/TTDSG Pflicht. z.B. CookieConsent (Osano) oder Klaro.
3. **OG-Image erstellen** — Für Social Sharing und Professionalität.

### 9.2 Nächste 2 Wochen

4. **Light Mode implementieren** — Graphite Premium Tokens nutzen, Toggle im Header.
5. **Analytics integrieren** — Plausible (DSGVO-konform, kein Cookie nötig).
6. **Performance optimieren** — Lighthouse-Audit, Bildoptimierung, Font-Loading.

### 9.3 Nächste 4 Wochen

7. **Content befüllen** — Referenzen, Blog-Artikel, Testimonials.
8. **Animationen** — Scroll-basierte Einblendungen, Page-Transitions.
9. **Newsletter** — Resend-Integration (bereits vorbereitet laut Quality Audit).

---

## 10. Datei-Referenzen

### Website-Quellcode
- `/workspace/nexify/20_website_portal/nexifyai-agency-website/` — Root
- `app/page.tsx` — Homepage/Landingpage
- `app/globals.css` — Design-Tokens (351 Zeilen)
- `app/layout.tsx` — Root Layout mit JSON-LD
- `lib/site-data.ts` — Firmendaten, Services, Prozess, FAQs (242 Zeilen)
- `components/` — 12 Komponenten

### Design-Dokumente
- `docs/DESIGN_VORGABE.md` — Verbindliche Design-Vorgabe
- `docs/QUALITY_AUDIT_2026-06-21.md` — Quality Audit

### Analysen
- `/workspace/nexify/10_evidence/design/ANALYSE_1_HERMES_WEBUI_GRAPHITE_DESIGNSYSTEM.md` — Analyse 1

---

**END OF ANALYSIS 2**
