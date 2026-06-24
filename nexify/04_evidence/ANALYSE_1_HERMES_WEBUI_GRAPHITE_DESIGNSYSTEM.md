# Analyse 1: Hermes Agent WebUI als Basis für Designsystem "Graphite"

**Datum:** 2026-06-22 | **Status:** EVIDENCE | **Version:** 1.0.0  
**Analyst:** Frontend/Design Agent (NeXify AI OS)  
**Quellen:** 8+ Design-Dokumente, 6 CSS-Dateien, 12 React-Komponenten

---

## 1. Zusammenfassung

Die Analyse untersucht die Hermes Agent WebUI als Basis für das "Graphite" Designsystem. Es existieren **6 verschiedene Design-System-Definitionen** im Workspace, die teils widersprüchlich sind. Das "Graphite Premium" System (4 CSS-Dateien) ist das reifste und vollständigste — es liefert die technische Basis für ein einheitliches Designsystem.

**Kernbefund:** Die Hermes WebUI liefert die Architektur (CSS Custom Properties, data-skin Attribute, Tailwind-Preset), die Website (`nexifyai-agency-website`) liefert die Komponenten-Implementierung. Beide müssen unter dem "Graphite" Dach vereinheitlicht werden.

---

## 2. Quellen-Inventar

### 2.1 Design-System-Dokumente (8 Stück)

| # | Datei | Zeilen | Status | Kernphilosophie |
|---|-------|--------|--------|----------------|
| 1 | `GRAPHITE_DESIGN_SYSTEM.md` | 368 | **KANONISCH (Graphite v1)** | Neutral grau, system-ui, Flat, WCAG AAA |
| 2 | `DESIGN_SYSTEM_V2.md` | 384 | **KANONISCH (NeXify v2)** | Deep Navy, Blue+Teal, Inter+Space Grotesk |
| 3 | `DESIGN_AUDIT_ANALYSIS.md` | 266 | **AUDIT** | Vergleicht alle 6 Systeme, identifiziert Konflikte |
| 4 | `UNIFIED_NEXIFY_DESIGN_MASTER_V1.md` | ~900 | **MASTER PLAN** | Vereinheitlichungsversuch |
| 5 | `nexify/18_designsystem/GRAPHITE_PREMIUM_DESIGNSYSTEM_V3.md` | 29 | FRAGMENT | Dark #07090d, Purple #7c5cff |
| 6 | `nexify/07_ui_ci/DESIGNSYSTEM_HANDBUCH_V3.md` | 182 | FRAGMENT | Dark #0D0D0D, Green #00E676 |
| 7 | `nexify/07_ui_ci/GRAPHITE_DESIGN_SYSTEM_V1.md` | 157 | VERALTET | Orange #FF6B00, Manrope |
| 8 | `design-vision.md` | ~1500 | **VISION** | Premium Dark Operator Shell |

### 2.2 CSS-Dateien (Graphite Premium — 4 Dateien, ~4200 Zeilen)

| Datei | Zeilen | Inhalt |
|-------|--------|--------|
| `graphite-premium-tokens.css` | 272 | **Tokens:** Farben, Radii, Spacing, Typografie, Easing, Schatten |
| `graphite-premium-primitives.css` | 342 | **Komponenten:** Button (4 Varianten), Input, Card (3 Varianten), Badge, Tooltip, Avatar, Skeleton, Progress |
| `graphite-premium-layout.css` | 669 | **Layout:** App-Shell (3-Panel), Grid (12-Spalten), Stack, Sidebar (260px→56px), Topbar (56px) |
| `graphite-premium-premium.css` | 828 | **Premium:** 6-Layer Depth, Glass-Effekte, Interactions, Animationen, Tabs, Switch |

### 2.3 Tailwind-Presets (2 Dateien)

| Datei | Prefix | Token-Basis |
|-------|--------|-------------|
| `tw-graphite-preset.js` | `--gr-*` | Graphite v1 (neutral grau) |
| `tw-nexify-preset.js` | `--nx-*` | NeXify v2 (Deep Navy) |

### 2.4 Implementierte Website (`nexifyai-agency-website`)

| Komponente | Datei | Technik |
|------------|-------|---------|
| Button | `components/ui/button.tsx` | Radix Slot, 3 Varianten (default/outline/ghost), Gradient-BG |
| Card | `components/ui/card.tsx` | `rounded-[18px]`, Glass-Border `white/[.085]` |
| Badge | `components/ui/badge.tsx` | shadcn/ui Pattern |
| Input | `components/ui/input.tsx` | shadcn/ui Pattern |
| Textarea | `components/ui/textarea.tsx` | shadcn/ui Pattern |
| SiteHeader | `components/site-header.tsx` | Sticky, Glass-Blur, Mobile-Menü |
| Brand | `components/brand.tsx` | Logo-Mark (45° rotated squares) + Text |
| OperatorVisual | `components/operator-visual.tsx` | 3D-Dashboard-Visualisierung |
| PricingCalculator | `components/pricing-calculator.tsx` | Interaktiver Preisrechner |
| ContactForm | `components/contact-form.tsx` | Formular mit Validierung |
| SiteFooter | `components/site-footer.tsx` | Footer mit Links |
| LegalPage | `components/legal-page.tsx` | Legal-Dokument-Layout |

### 2.5 Website-Globals (`globals.css` — 351 Zeilen)

**Aktuelle Token-Definitionen der Live-Website:**

```css
:root {
  --background: #08090a;       /* Fast schwarz */
  --foreground: #f5f7f8;       /* Fast weiß */
  --panel: #101316;            /* Dunkelgrau */
  --panel-2: #15191d;          /* Mitteldunkel */
  --line: rgba(255,255,255,.1);
  --muted: #8b9298;
  --accent: #ff6417;           /* Orange! */
  --accent-2: #ff9308;         /* Helles Orange */
  --lime: #baff00;             /* Neon-Grün */
  --cyan: #8be9ff;             /* Cyan */
  --font-body: "Inter", "Avenir Next", "Segoe UI", Arial, sans-serif;
  --font-display: "Space Grotesk", "Avenir Next", "Segoe UI", Arial, sans-serif;
}
```

---

## 3. Graphite Designsystem — Tiefenanalyse

### 3.1 Philosophie (aus `GRAPHITE_DESIGN_SYSTEM.md`)

```
Graphite = neutraler Werkbock.
Zurückhaltendes Chrome, weicher Kontrast, native Systemfonts.
Ziel: maximale Klarheit, minimaler visueller Noise. Accessibility-first.
```

**Kernprinzipien:**
- **Neutrale Palette** — keine Markenfarbe dominiert. Grau/Graphit-basiert.
- **Native Fonts** — system-ui, schnell, lizenzfrei, fühlt sich lokal an.
- **Volles Light/Dark Paar** — beide rigoros definiert.
- **Accessible** — WCAG AA Kontrast auf allen Text/Hintergrund-Paaren.
- **Modular** — CSS Custom Properties, Tailwind Preset, Component Tokens.

### 3.2 Token-System (Graphite v1 — kanonisch)

**Light Mode:**
```
Background:    #FFFFFF (Snow)
Sidebar:       #F3F3F3 (Light Gray)
Surface:       #FFFFFF (Snow)
Text:          #242424 (Dark Gray)
Muted:         #707070 (Mid Gray)
Accent:        #303030 (Graphite)
Border:        #E2E2E2 (Silver)
Error:         #D44D4D (Red)
Success:       #0F8F70 (Teal)
```

**Dark Mode:**
```
Background:    #151614 (Dark Olive)
Sidebar:       #242624 (Dark Green-Gray)
Surface:       #1B1C1A (Dark Surface)
Text:          #ECEBE4 (Warm White)
Muted:         #A7A79D (Warm Gray)
Accent:        #D7D6CE (Light Warm)
Border:        #343631 (Dark Border)
Error:         #FF6B6B (Bright Red)
Success:       #10A37F (Bright Teal)
```

**Font-Stack:**
```css
--font-ui: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
--font-mono: ui-monospace, "SFMono-Regular", "SF Mono", Menlo, Consolas, monospace;
```

### 3.3 Graphite Premium — Erweitertes Token-System

Das "Premium" System (`graphite-premium-*.css`) erweitert Graphite um:

**Monochrome Skala (9 Stufen):**
```
--color-ink:       #1A1A1A   (Primärtext)
--color-charcoal:  #3D3D3D   (Sekundärtext)
--color-stone:     #6E6E6E   (Muted/Meta)
--color-cloud:     #9E9E9E   (Placeholder)
--color-mist:      #D4D4D4   (Borders)
--color-vapor:     #EBEBEB   (Subtle Borders)
--color-frost:     #F5F5F5   (Surface Alt)
--color-canvas:    #FAFAFA   (Page Background)
--color-snow:      #FFFFFF   (Surface/Card)
```

**Akzentfarbe: Indigo Schiefer**
```
--accent-hushed:   #5B5F97   (Default — kaum sichtbar)
--accent-awake:    #4A4E80   (Hover — spürbar)
--accent-spoken:   #3C3F6A   (Active — klar)
```

**Easing-Kurven (4 Stück, kanonisch):**
```css
--ease-out:    cubic-bezier(0.16, 0, 0.3, 1);
--ease-in:     cubic-bezier(0.7, 0, 0.84, 0);
--ease-smooth: cubic-bezier(0.22, 0.61, 0.36, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
/* KEIN ease-in-out. Nie. */
```

### 3.4 Komponenten-Architektur (Graphite Premium)

**Primitives (8 Komponenten):**

| Komponente | Varianten | Key Features |
|------------|-----------|--------------|
| Button | Primary, Secondary, Ghost, Icon | Hover: translateY(-1px), 200ms ease-out |
| Input | Default + Floating Label | Bottom-border-only, Accent-Focus |
| Card | Default, Elevated, Glass | Hover: translateY(-2px), 280ms |
| Badge | Default, Success, Warning, Error, Accent | 22px Höhe, Pill-Form |
| Tooltip | CSS-only (::after) | 120ms Delay, Ink-Background |
| Status-Dot | Online, Warn, Idle, Offline, Error | 8px Circles |
| Skeleton | Pulse + Crossfade | 1.5s Loop, 300ms Crossfade |
| Progress | Default | 4px Height, Ink-Fill |
| Avatar | Default, Large | 32px/40px, Circle |

**Layout (5 Komponenten):**

| Komponente | Specs |
|------------|-------|
| App-Shell | 3-Panel: Sidebar (260px) + Main + Panel (420px) |
| Grid | 12-Spalten + Auto-Fill (280px min) |
| Stack | Vertikale Layouts mit 8 Gap-Stufen |
| Topbar | 56px Höhe, Glass bei Scroll, Breadcrumb |
| Sidebar | 260px→56px Collapse, Sections, Items, Badges |

**Premium (4 Systeme):**

| System | Ebenen |
|--------|--------|
| Depth | 6 Layer (Page → Surface → Elevated → Dialog → Tooltip → Fullscreen) |
| Glass | Topbar (blur 12px) + Auth-Card (blur 8px) |
| Interactions | 9 Patterns (Lift, Focus, Disabled, Input-Focus, Card-Hover, Sidebar-Item, Dropdown, Table-Row, Link, Toggle, Tabs) |
| Animations | 7 Types (Page-Enter, Hero-Enter, Section-Reveal, Card-Enter/Staggered, Skeleton-Pulse/Crossfade, Spinner, Badge-Pop) |

---

## 4. Konflikt-Analyse

### 4.1 Akzentfarbe — 5 verschiedene Definitionen

| System | Akzentfarbe | Charakter |
|--------|-------------|-----------|
| **Graphite v1** | `#303030` (Graphite) | Neutral, seriös |
| **NeXify v2** | `#2563EB` (Blue) | Tech, vertraut |
| **Website (live)** | `#ff6417` (Orange) | CTA-stark, mutig |
| **Premium V3** | `#7c5cff` (Purple) | Premium, exklusiv |
| **Handbuch V3** | `#00E676` (Green) | Modern, KI-Assoziation |

**Empfehlung:** Die Live-Website nutzt bereits Orange (`#ff6417`) — das ist die de facto Standard-Akzentfarbe. Für das Graphite Designsystem sollte eine neutrale Akzentfarbe gewählt werden, die mit Orange kompatibel ist.

### 4.2 Font-System — 3 verschiedene Ansätze

| System | Font-Stack | Base Size |
|--------|-----------|-----------|
| **Graphite v1** | system-ui | 14px |
| **NeXify v2** | Inter + Space Grotesk | 15px |
| **Graphite Premium** | system-ui (-apple-system, BlinkMacSystemFont) | 16px |
| **Website (live)** | Inter + Space Grotesk | 16px |

**Empfehlung:** Inter + Space Grotesk (wie Website) — da bereits implementiert und Google Fonts verfügbar.

### 4.3 Philosophie — Flat vs Glass vs Gradient

| System | Glass | Gradient | Surfaces |
|--------|-------|----------|----------|
| Graphite v1 | ❌ NEIN | ❌ NEIN | FLAT |
| NeXify v2 | ❌ NEIN | ❌ NEIN | FLAT |
| Graphite Premium | ✅ JA (Topbar, Auth) | ❌ NEIN | FLAT + Glass |
| Website (live) | ✅ JA (Header) | ✅ JA (Body BG) | DEPTH + GLASS |

**Empfehlung:** Glass nur für Topbar und Auth-Pages erlauben (wie Premium definiert). Keine Gradienten auf Cards/Buttons.

### 4.4 Dark/Light Mode — 4 Systeme haben nur Dark

| System | Light Mode | Dark Mode |
|--------|-----------|-----------|
| Graphite v1 | ✅ Voll | ✅ Voll |
| NeXify v2 | ✅ Voll | ✅ Voll |
| Graphite Premium | ✅ Voll | ✅ Voll |
| Website (live) | ❌ FEHLT | ✅ (nur dark) |
| Premium V3 | ❌ FEHLT | ✅ (nur dark) |
| Handbuch V3 | ❌ FEHLT | ✅ (nur dark) |

**Empfehlung:** Website braucht Light Mode für öffentliche Zugänglichkeit. Graphite Premium hat bereits beide Modi definiert.

---

## 5. Integrations-Möglichkeiten

### 5.1 Option A: Graphite Premium als einziges Designsystem

**Vorteile:**
- Bereits vollständigste CSS-Implementierung (4 Dateien, ~4200 Zeilen)
- Light + Dark Mode definiert
- 8 Primitives + 5 Layout + 4 Premium Systeme
- Accessibility (Focus-Ringe, Kontrast) eingebaut
- Easing-Kurven kanonisch definiert

**Nachteile:**
- Website nutzt bereits andere Tokens (`--accent`, `--background`)
- Migration der Live-Website erforderlich
- Akzentfarbe muss entschieden werden

### 5.2 Option B: NeXify v2 als Basis + Premium-Erweiterungen

**Vorteile:**
- NeXify v2 hat die besten Accessibility-Berechnungen
- Inter + Space Grotesk bereits als Standard definiert
- Migration-Maps für alle Projekte vorhanden

**Nachteile:**
- Premium CSS Features (Glass, Depth, Animations) müssen nachgetragen werden
- `--nx-*` Prefix statt `--color-*`

### 5.3 Option C: Unified System (Empfohlen)

**Strategie:** Graphite Premium Tokens + NeXify v2 Accessibility + Website-Komponenten

```
┌─────────────────────────────────────────────────────┐
│              GRAPHITE DESIGNSYSTEM v2.0              │
├─────────────────────────────────────────────────────┤
│  TOKENS:     graphite-premium-tokens.css             │
│              (9 Farb-Stufen + Indigo-Akzent)         │
│  PRIMITIVES: graphite-premium-primitives.css         │
│              (8 Komponenten, 4 Button-Varianten)     │
│  LAYOUT:     graphite-premium-layout.css             │
│              (App-Shell, Grid, Sidebar, Topbar)      │
│  PREMIUM:    graphite-premium-premium.css            │
│              (Depth, Glass, Interactions, Anims)     │
│  ACCESSIBLE: WCAG-Berechnungen aus NeXify v2        │
│  COMPONENTS: shadcn/ui aus Website übernehmen        │
│  TAILWIND:   tw-graphite-preset.js (neu: unified)   │
│  PROVIDER:   ThemeProvider.jsx (data-skin toggle)    │
└─────────────────────────────────────────────────────┘
```

### 5.4 Technische Integrationsschritte

**Phase 1: Token-Vereinheitlichung (2h)**
1. `graphite-premium-tokens.css` als kanonische Token-Quelle festlegen
2. Prefix von `--color-*` auf `--gr-*` ändern (für Konsistenz mit Tailwind)
3. Light Mode Tokens aus Graphite v1 übernehmen (bereits definiert)
4. WCAG-Kontrast-Berechnungen aus NeXify v2 nachtragen

**Phase 2: Komponenten-Migration (4h)**
1. Website-Komponenten (Button, Card, Badge, Input) auf Graphite Premium Tokens umbauen
2. `globals.css` der Website auf `graphite-premium-tokens.css` umstellen
3. `tailwind.config.ts` mit `tw-graphite-preset.js` verbinden
4. `ThemeProvider.jsx` in Website integrieren

**Phase 3: Light Mode für Website (2h)**
1. Light Mode Tokens aus Graphite Premium übernehmen
2. `data-skin="graphite-premium"` Attribut auf `<html>` setzen
3. Dark/Light Toggle in Header einbauen
4. Alle Komponenten auf Light Mode testen

**Phase 4: Premium Features (3h)**
1. Glass-Effekte für Topbar (bereits in Website vorhanden)
2. Depth-System für Cards (Elevated, Glass)
3. Animationen (Page-Enter, Card-Stagger, Skeleton)
4. Interactions (Hover-Lift, Focus-Ring, Active-Press)

---

## 6. Mapping: Website-Komponenten → Graphite Premium

### 6.1 Button

| Website (aktuell) | Graphite Premium | Aktion |
|-------------------|-----------------|--------|
| `bg-[linear-gradient(135deg,var(--accent),var(--accent-2))]` | `background: var(--color-ink)` | **Ersetzen** — kein Gradient |
| `rounded-[11px]` | `border-radius: var(--radius-md)` (8px) | **Anpassen** |
| `shadow-[0_14px_34px_rgba(255,100,23,.22)]` | `box-shadow: var(--shadow-1)` | **Ersetzen** — Mikroschatten |
| `hover:brightness-110` | `hover: translateY(-1px) + shadow-hover` | **Ersetzen** — Lift statt Brightness |

### 6.2 Card

| Website (aktuell) | Graphite Premium | Aktion |
|-------------------|-----------------|--------|
| `rounded-[18px]` | `border-radius: var(--radius-md)` (8px) | **Anpassen** — 8px statt 18px |
| `border-white/[.085]` | `border: var(--line-card)` | **Ersetzen** — Token-basiert |
| `bg-white/[.025]` | `background: var(--color-snow)` | **Ersetzen** — definierte Farbe |

### 6.3 SiteHeader

| Website (aktuell) | Graphite Premium | Aktion |
|-------------------|-----------------|--------|
| `backdrop-filter: blur(20px) saturate(140%)` | `backdrop-filter: blur(12px)` | **Anpassen** — weniger Blur |
| `background: rgba(8,9,10,.82)` | `background: rgba(250,250,250,0.72)` (Light) | **Ersetzen** — Mode-abhängig |
| `border-bottom: 1px solid rgba(255,255,255,.07)` | `border-bottom: var(--line-divider)` | **Ersetzen** |

### 6.4 Farb-Migration

| Website Token | Graphite Premium Token | Wert |
|---------------|----------------------|------|
| `--accent: #ff6417` | `--accent-hushed: #5B5F97` | **ENTSCHIEDEN** — Indigo statt Orange |
| `--accent-2: #ff9308` | `--accent-awake: #4A4E80` | **ENTSCHIEDEN** |
| `--lime: #baff00` | `--color-success: #0F8F70` | **Ersetzen** — professioneller |
| `--cyan: #8be9ff` | `--color-info: #5B5F97` | **Ersetzen** |
| `--background: #08090a` | `--color-canvas: #080808` (Dark) | **Angleichen** |
| `--panel: #101316` | `--color-snow: #161616` (Dark) | **Angleichen** |

---

## 7. Accessibility-Analyse

### 7.1 Graphite v1 Kontraste (alle WCAG AAA)

| Kombination | Kontrast | WCAG |
|-------------|---------|------|
| `#242424` auf `#FFFFFF` | **15.3:1** | ✅ AAA |
| `#ECEBE4` auf `#151614` | **13.7:1** | ✅ AAA |
| `#303030` auf `#FFFFFF` | **13.5:1** | ✅ AAA |
| `#D7D6CE` auf `#1B1C1A` | **11.8:1** | ✅ AAA |
| `#D44D4D` auf `#FFFFFF` | **5.6:1** | ✅ AA |
| `#FF6B6B` auf `#151614` | **7.0:1** | ✅ AAA |

### 7.2 Website (live) — Problematische Kontraste

| Kombination | Kontrast | WCAG | Problem |
|-------------|---------|------|---------|
| `#ff6417` auf `#08090a` | **4.8:1** | ⚠️ AA (grenzwertig) | Orange auf schwarz |
| `rgba(255,255,255,.38)` auf `#08090a` | **3.2:1** | ❌ FAIL | Zu wenig Kontrast |
| `rgba(255,255,255,.47)` auf `#08090a` | **4.1:1** | ⚠️ AA (grenzwertig) | Muted Text |

**Empfehlung:** Graphite Premium Tokens haben bessere Kontraste als die aktuelle Website.

---

## 8. Fazit & Empfehlung

### 8.1 Kernbefund

Das **Graphite Premium** System (4 CSS-Dateien) ist die reifste und vollständigste Designsystem-Definition. Es bietet:
- ✅ Vollständiges Token-System (Light + Dark)
- ✅ 8 Primitive-Komponenten
- ✅ 5 Layout-Komponenten
- ✅ 4 Premium-Systeme (Depth, Glass, Interactions, Animations)
- ✅ Kanonische Easing-Kurven
- ✅ Accessibility (Focus-Ringe, Kontraste)

### 8.2 Empfohlene Vorgehensweise

1. **Graphite Premium als kanonisches Designsystem festlegen**
2. **Website auf Graphite Premium Tokens migrieren** (Phase 1-2)
3. **Light Mode für Website implementieren** (Phase 3)
4. **Akzentfarbe entscheiden** — Indigo (#5B5F97) als neutraler Standard
5. **Komponenten-Bibliothek erweitern** — Dialog, Dropdown, Command, Table

### 8.3 Offene Entscheidungen

| Entscheidung | Optionen | Empfehlung |
|--------------|----------|------------|
| Akzentfarbe | Indigo / Blue / Orange / Purple / Green | **Indigo** (neutral, premium) |
| Base Font | system-ui / Inter / Inter+Space Grotesk | **Inter+Space Grotesk** (bereits implementiert) |
| Base Size | 14px / 15px / 16px | **16px** (modern, lesbar) |
| Glass-Effekte | Ja / Nein / Nur Topbar | **Nur Topbar + Auth** |
| Light Mode | Ja / Nein | **Ja** (Accessibility) |

---

## 9. Datei-Referenzen

### Design-System-Dokumente
- `/workspace/GRAPHITE_DESIGN_SYSTEM.md` — Graphite v1 kanonisch
- `/workspace/DESIGN_SYSTEM_V2.md` — NeXify v2 kanonisch
- `/workspace/DESIGN_AUDIT_ANALYSIS.md` — Konflikt-Analyse
- `/workspace/design-vision.md` — Vision-Dokument

### CSS-Dateien (Graphite Premium)
- `/workspace/graphite-premium-tokens.css` — Tokens
- `/workspace/graphite-premium-primitives.css` — Primitives
- `/workspace/graphite-premium-layout.css` — Layout
- `/workspace/graphite-premium-premium.css` — Premium Features

### Tailwind-Presets
- `/workspace/tw-graphite-preset.js` — Graphite Preset
- `/workspace/tw-nexify-preset.js` — NeXify Preset

### Website-Implementierung
- `/workspace/nexify/20_website_portal/nexifyai-agency-website/` — Next.js Website
- `/workspace/nexify/20_website_portal/nexifyai-agency-website/app/globals.css` — Live-Tokens
- `/workspace/nexify/20_website_portal/nexifyai-agency-website/components/ui/` — UI-Komponenten

### Theme-Provider
- `/workspace/ThemeProvider.jsx` — React Theme Provider

---

**END OF ANALYSIS 1**
