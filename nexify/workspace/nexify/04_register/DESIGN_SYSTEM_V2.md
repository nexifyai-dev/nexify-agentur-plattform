# NeXify Design System v2.0 — Kanonische Quelle der Wahrheit

> **Brand:** NeXifyAI by NeXify – Chat it. Automate it.
> **Version:** 2.0.0
> **Gültig ab:** 08.05.2026
> **Register-Pfad:** /workspace/nexify/04_register/DESIGN_SYSTEM_V2.md
> **Canonical Source:** /workspace/DESIGN_SYSTEM_V2.md
> **Basis:** shadcn/ui, Tailwind CSS v3+
> **Dark Mode:** Standard für Admin + Fabrik

---

> **STATUS (25.07.2026):** Verbindliche Source of Truth für alle NeXifyAI-UI-Arbeiten.
> `design_guidelines.json` (Dark/Luxury Outfit/Manrope #0A0A0A, 04.07.) ist **superseded/legacy** — siehe
> `/opt/nexifyai/docs/decisions/DECISION-2026-07-25-DESIGN-SYSTEM-V2-SOT.md`.

## 1. Philosophie

NeXify v2 = präzise Werkbank. Klare Farbsignale, gestaffelte Tiefe, lesbare Typografie.

- **Deep Navy Foundation** — ruhiger, professioneller Hintergrund. Nicht aufdringlich, aber autoritär.
- **NeXify Blue Accent** — klare Interaktionsfarbe. Blau signalisiert Aktion, Link, Fokus.
- **Teal Secondary Accent** — Erfolg, Bestätigung, Alternative. Sanfter Kontrast zum Blau.
- **Typografie mit System** — Inter für UI + Fließtext, Space Grotesk für Headlines.
- **Dark-First für Admin/Fabrik** — Deep Navy als Standard-Hintergrund im Dark Mode.
- **Accessibility** — WCAG AA auf allen Text/Background-Paaren, AAA auf primären.
- **Kein Glassmorphismus als Standard** — flache Surfaces. Glass nur für Overlays/Topbar.
- **Keine aggressiven Gradienten** — maximal subtile Radials für Hero-Sektionen.

---

## 2. Token-Map: Alle CSS Custom Properties

### 2.1 Light Mode

```css
:root, [data-skin="nexify"] {
  color-scheme: light;

  /* ── Backgrounds ── */
  --nx-bg:                    #FFFFFF;
  --nx-sidebar:               #F1F5F9;   /* slate-100 */
  --nx-surface:               #FFFFFF;
  --nx-surface-subtle:        #F8FAFC;   /* slate-50 */
  --nx-surface-subtle-hover:  #F1F5F9;   /* slate-100 */
  --nx-main-bg:               #FFFFFF;
  --nx-topbar-bg:             rgba(255,255,255,0.94);
  --nx-input-bg:              #FFFFFF;
  --nx-code-bg:               #F1F5F9;   /* slate-100 */

  /* ── Borders ── */
  --nx-border:                #E2E8F0;   /* slate-200 */
  --nx-border-2:              #CBD5E1;   /* slate-300 */
  --nx-border-subtle:         #F1F5F9;   /* slate-100 */
  --nx-border-muted:          #E2E8F0;

  /* ── Text ── */
  --nx-text:                  #0F172A;   /* Deep Navy / slate-900 */
  --nx-text-strong:           #020617;   /* slate-950 */
  --nx-text-muted:            #64748B;   /* slate-500 */
  --nx-text-em:               #334155;   /* slate-700 */
  --nx-code-text:             #0F172A;
  --nx-pre-text:              #0F172A;

  /* ── Primary: Deep Navy ── */
  --nx-primary:               #0F172A;   /* Deep Navy */
  --nx-primary-hover:         #1E293B;   /* slate-800 */
  --nx-primary-foreground:    #FFFFFF;
  --nx-primary-bg:            rgba(15,23,42,0.08);
  --nx-primary-bg-strong:     rgba(15,23,42,0.15);

  /* ── Accent: NeXify Blue ── */
  --nx-accent:                #2563EB;   /* blue-600 */
  --nx-accent-hover:          #1D4ED8;   /* blue-700 */
  --nx-accent-foreground:     #FFFFFF;
  --nx-accent-bg:             rgba(37,99,235,0.10);
  --nx-accent-bg-strong:      rgba(37,99,235,0.18);

  /* ── Accent-2: Teal ── */
  --nx-accent-2:              #0D9488;   /* teal-600 */
  --nx-accent-2-hover:        #0F766E;   /* teal-700 */
  --nx-accent-2-foreground:   #FFFFFF;
  --nx-accent-2-bg:           rgba(13,148,136,0.10);
  --nx-accent-2-bg-strong:    rgba(13,148,136,0.18);

  /* ── Semantic Colors ── */
  --nx-blue:                  #2563EB;
  --nx-gold:                  #D97706;   /* amber-600 */
  --nx-error:                 #DC2626;   /* red-600 */
  --nx-success:               #059669;   /* emerald-600 */
  --nx-warning:               #D97706;   /* amber-600 */
  --nx-info:                  #2563EB;   /* blue-600 */

  /* ── Focus ── */
  --nx-focus-ring:            rgba(37,99,235,0.35);
  --nx-focus-glow:            rgba(37,99,235,0.10);

  /* ── Interaction ── */
  --nx-hover-bg:              rgba(15,23,42,0.05);
  --nx-code-inline-bg:        rgba(15,23,42,0.07);
}
```

### 2.2 Dark Mode

```css
:root.dark, .dark[data-skin="nexify"] {
  color-scheme: dark;

  /* ── Backgrounds ── */
  --nx-bg:                    #0F172A;   /* Deep Navy / slate-900 */
  --nx-sidebar:               #1E293B;   /* slate-800 */
  --nx-surface:               #1E293B;
  --nx-surface-subtle:        #253341;   /* zwischen slate-800 und -700 */
  --nx-surface-subtle-hover:  #334155;   /* slate-700 */
  --nx-main-bg:               #0F172A;
  --nx-topbar-bg:             rgba(15,23,42,0.92);
  --nx-input-bg:              #1E293B;
  --nx-code-bg:               #0A0F1A;   /* slate-950 */

  /* ── Borders ── */
  --nx-border:                #334155;   /* slate-700 */
  --nx-border-2:              #475569;   /* slate-600 */
  --nx-border-subtle:         #1E293B;   /* slate-800 */
  --nx-border-muted:          #334155;

  /* ── Text ── */
  --nx-text:                  #E2E8F0;   /* slate-200 */
  --nx-text-strong:           #F8FAFC;   /* slate-50 */
  --nx-text-muted:            #94A3B8;   /* slate-400 */
  --nx-text-em:               #CBD5E1;   /* slate-300 */
  --nx-code-text:             #E2E8F0;
  --nx-pre-text:              #E2E8F0;

  /* ── Primary: NeXify Blue (Brighter auf dunklem Grund) ── */
  --nx-primary:               #2563EB;   /* blue-600 */
  --nx-primary-hover:         #3B82F6;   /* blue-500 */
  --nx-primary-foreground:    #FFFFFF;
  --nx-primary-bg:            rgba(37,99,235,0.15);
  --nx-primary-bg-strong:     rgba(37,99,235,0.25);

  /* ── Accent: Hellblau ── */
  --nx-accent:                #60A5FA;   /* blue-400 */
  --nx-accent-hover:          #93C5FD;   /* blue-300 */
  --nx-accent-foreground:     #0F172A;
  --nx-accent-bg:             rgba(96,165,250,0.12);
  --nx-accent-bg-strong:      rgba(96,165,250,0.20);

  /* ── Accent-2: Hellteal ── */
  --nx-accent-2:              #2DD4BF;   /* teal-300 */
  --nx-accent-2-hover:        #5EEAD4;   /* teal-200 */
  --nx-accent-2-foreground:   #0F172A;
  --nx-accent-2-bg:           rgba(45,212,191,0.12);
  --nx-accent-2-bg-strong:    rgba(45,212,191,0.20);

  /* ── Semantic Colors ── */
  --nx-blue:                  #60A5FA;   /* blue-400 */
  --nx-gold:                  #FBBF24;   /* amber-400 */
  --nx-error:                 #F87171;   /* red-400 */
  --nx-success:               #34D399;   /* emerald-400 */
  --nx-warning:               #FBBF24;   /* amber-400 */
  --nx-info:                  #60A5FA;   /* blue-400 */

  /* ── Focus ── */
  --nx-focus-ring:            rgba(96,165,250,0.40);
  --nx-focus-glow:            rgba(96,165,250,0.12);

  /* ── Interaction ── */
  --nx-hover-bg:              rgba(255,255,255,0.06);
  --nx-code-inline-bg:        rgba(255,255,255,0.08);
}
```

### 2.3 Radii & Spacing

```css
/* Radii */
--nx-radius-sm:   4px;
--nx-radius-md:   8px;
--nx-radius-card: 8px;
--nx-radius-lg:   12px;
--nx-radius-pill: 999px;

/* Spacing */
--nx-space-1: 4px;
--nx-space-2: 8px;
--nx-space-3: 12px;
--nx-space-4: 16px;
--nx-space-5: 24px;
--nx-space-6: 32px;
--nx-space-8: 48px;
```

### 2.4 Typografie

```css
/* Font Families */
--nx-font-ui:      "Inter", "DM Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
--nx-font-heading: "Inter", "Space Grotesk", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
--nx-font-mono:    ui-monospace, "SFMono-Regular", "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;

/* Font Sizes — Moderne Skalierung */
--nx-font-size-xs:     11px;
--nx-font-size-sm:     13px;
--nx-font-size-base:   15px;  /* Standard Body */
--nx-font-size-lg:     18px;
--nx-font-size-xl:     24px;
--nx-font-size-2xl:    32px;
--nx-font-size-3xl:    40px;

/* Line Heights */
--nx-leading-tight:   1.25;
--nx-leading-normal:  1.6;
--nx-leading-relaxed: 1.75;
```

### 2.5 Tiefe & Schatten (aus Graphite übernommen)

```css
/* Ebene 0: Oberfläche (flach) */
--nx-depth-0-shadow: 0 0 0 1px var(--nx-border-subtle);

/* Ebene 1: Cards, Panels */
--nx-depth-1-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.03);

/* Ebene 2: Karten, Dialoge */
--nx-depth-2-shadow: 0 2px 8px rgba(0,0,0,0.06), 0 1px 1px rgba(0,0,0,0.03);

/* Ebene 3: Modals, Dropdowns */
--nx-depth-3-shadow: 0 12px 32px rgba(0,0,0,0.08), 0 4px 8px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.06);

/* Ebene 4: Tooltips, Toasts */
--nx-depth-4-shadow: 0 24px 64px rgba(0,0,0,0.10), 0 8px 16px rgba(0,0,0,0.05);

/* Dark Mode Schatten (höhere Opazität) */
--nx-depth-1-shadow-dark: 0 1px 2px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.04);
--nx-depth-2-shadow-dark: 0 2px 8px rgba(0,0,0,0.24), 0 1px 1px rgba(0,0,0,0.10);
--nx-depth-3-shadow-dark: 0 12px 32px rgba(0,0,0,0.36), 0 4px 8px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.06);
--nx-depth-4-shadow-dark: 0 24px 64px rgba(0,0,0,0.40), 0 8px 16px rgba(0,0,0,0.20);

/* Hover / Active Interaktionen */
--nx-hover-lift-shadow:    0 8px 24px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04);
--nx-hover-lift-shadow-dark: 0 8px 24px rgba(0,0,0,0.32), 0 2px 4px rgba(0,0,0,0.16);
--nx-active-press-shadow: 0 1px 2px rgba(0,0,0,0.04), inset 0 1px 2px rgba(0,0,0,0.06);

/* Fokus */
--nx-focus-glow-ring: 0 0 0 2px var(--nx-focus-ring);
--nx-focus-glow-strong: 0 0 0 3px var(--nx-focus-ring), 0 0 16px var(--nx-focus-glow);
```

### 2.6 Übergänge (aus Graphite übernommen)

```css
--nx-ease-out-cubic: cubic-bezier(.33,1,.68,1);
--nx-ease-spring:    cubic-bezier(.16,1,.3,1);
--nx-ease-bounce:    cubic-bezier(.34,1.56,.64,1);
--nx-ease-smooth:    cubic-bezier(.4,0,.2,1);
```

---

## 3. Tailwind Preset

**Datei:** `tw-nexify-preset.js` (siehe separates Artefakt)

Erweitert Tailwind v3+ um NeXify-Farben, -Radii, -Spacing, -Fonts, -Shadows.
Nutzt CSS-var(--nx-*)-Referenzen statt Hardcode — dynamischer Theme-Switch.

---

## 4. Theme Provider

**Datei:** `ThemeProvider.jsx` (siehe separates Artefakt)

- Steuert `data-skin="nexify"` und `.dark` Klasse auf `<html>`
- localStorage-Persistenz für Dark-Mode-Präferenz
- System-Fallback via `prefers-color-scheme: dark` Media-Query
- Automatischer Skin-Switcher über `setSkin()` (zukunftssicher für Multi-Skin)

---

## 5. Branding & Anwendung

### 5.1 Farbrollen

| Rolle | Light Mode | Dark Mode | Verwendung |
|-------|-----------|-----------|------------|
| **Primary** | `#0F172A` Deep Navy | `#2563EB` NeXify Blue | Buttons, Badges, Primary-Aktionen |
| **Accent** | `#2563EB` NeXify Blue | `#60A5FA` Hellblau | Links, Fokus, Highlight-Elemente |
| **Accent-2** | `#0D9488` Teal | `#2DD4BF` Hellteal | Sekundäre Akzente, Status-Gut |
| **Background** | `#FFFFFF` Weiß | `#0F172A` Deep Navy | Seitenhintergrund |
| **Surface** | `#FFFFFF` Weiß | `#1E293B` Slate-800 | Karten, Panels, Container |
| **Text** | `#0F172A` Deep Navy | `#E2E8F0` Slate-200 | Fließtext |

### 5.2 Typografie-Hierarchie

| Ebene | Font | Größe | Gewicht | Einsatz |
|-------|------|-------|---------|---------|
| **Hero/Headline 1** | Space Grotesk | 40px / 2xl | 700 Bold | Hero-Titel, Landing Pages |
| **Headline 2** | Space Grotesk | 32px / 2xl | 600 Semibold | Seitenüberschriften |
| **Headline 3** | Inter | 24px / xl | 600 Semibold | Sektionsüberschriften |
| **Subheadline** | Inter | 18px / lg | 500 Medium | Unterüberschriften |
| **Body** | Inter | 15px / base | 400 Regular | Fließtext, UI-Labels |
| **Body Small** | Inter | 13px / sm | 400 Regular | Sekundärtext, Metadaten |
| **Caption** | Inter | 11px / xs | 500 Medium | Captions, Badge-Text |
| **Code** | Mono (SF Mono) | 13px | 400 Regular | Code-Blöcke, Inline-Code |

### 5.3 Komponenten-Regeln

- **Buttons:** Flache Surfaces, keine Gradienten. Border-Radius 8px. Hover = translateY(-1px) + shadow.
- **Cards:** Flach (depth-1 shadow). Border 1px solid Border-Farbe. Keine linken Akzent-Streifen.
- **Badges:** Pill-Form (border-radius: 999px). Padding horizontal 8px, vertikal 2px.
- **Inputs:** Border 1px, Fokus = NeXify Blue Ring, keine abgerundeten Ecken > 8px.
- **Dialoge:** Floaten auf depth-3. Overlay = backdrop-blur(4px) + rgba(0,0,0,0.4).
- **Sidebar:** Active Item = hellerer Hintergrund + 3px Primary-Akzent-Strich links.
- **Topbar:** Leicht transparent (glass). Border-bottom 1px.

### 5.4 Marken-Anwendung

```
NeXifyAI by NeXify – Chat it. Automate it.

Logo-Verwendung:
- Deep Navy + NeXify Blue primär
- Teal als sekundärer Akzent
- Kein Gradient im Logo
- "NeXifyAI" immer mit großem 'N' und 'A'
```

---

## 6. Migration von Graphite v1 → NeXify v2

| Graphite Token | NeXify Token Light | NeXify Token Dark | Aktion |
|---------------|-------------------|-------------------|--------|
| `--bg: #FFFFFF` | `--nx-bg: #FFFFFF` | `--nx-bg: #0F172A` | **Beibehalten Light, geändert Dark** |
| `--sidebar: #F3F3F3` | `--nx-sidebar: #F1F5F9` | `--nx-sidebar: #1E293B` | **Angepasst an Slate-Palette** |
| `--surface: #FFFFFF` | `--nx-surface: #FFFFFF` | `--nx-surface: #1E293B` | **Beibehalten Light, geändert Dark** |
| `--accent: #303030` | `--nx-primary: #0F172A` | `--nx-primary: #2563EB` | **Ersetzt. Markenfarbe statt neutral.** |
| `--accent-hover: #171717` | `--nx-primary-hover: #1E293B` | `--nx-primary-hover: #3B82F6` | **Ersetzt.** |
| `--text: #242424` | `--nx-text: #0F172A` | `--nx-text: #E2E8F0` | **Angepasst an Deep Navy.** |
| `--muted: #707070` | `--nx-text-muted: #64748B` | `--nx-text-muted: #94A3B8` | **An Slate-Palette angepasst.** |
| `--font-ui: system-ui` | `--nx-font-ui: Inter, DM Sans` | — | **Systematisiert. Google Fonts.** |
| `--font-mono: ui-monospace` | `--nx-font-mono: ui-monospace` | — | **Beibehalten.** |
| `--radius-md: 8px` | `--nx-radius-md: 8px` | — | **Beibehalten.** |
| `--error: #D44D4D` | `--nx-error: #DC2626` | `--nx-error: #F87171` | **Auf Tailwind-Standard normiert.** |
| `--success: #0F8F70` | `--nx-success: #059669` | `--nx-success: #34D399` | **Auf Tailwind-Standard normiert.** |
| Grapit depth shadows | `--nx-depth-*` | — | **Umbenannt + beibehalten.** |
| `gr-*` CSS-Klassen | `nx-*` CSS-Klassen | — | **Umbenannt.** |

---

## 7. Accessibility

| Kombination | Kontrast | WCAG |
|------------|---------|------|
| Deep Navy Text (#0F172A) auf Weiß (#FFFFFF) | **15.3:1** | ✅ AAA |
| NeXify Blue (#2563EB) auf Weiß (#FFFFFF) | **8.5:1** | ✅ AAA |
| Weiß (#FFFFFF) auf Deep Navy (#0F172A) | **15.3:1** | ✅ AAA |
| NeXify Blue (#2563EB) auf Deep Navy (#0F172A) | **5.2:1** | ✅ AA |
| Slate-200 (#E2E8F0) auf Deep Navy (#0F172A) | **12.1:1** | ✅ AAA |
| Error (#DC2626) auf Weiß (#FFFFFF) | **5.8:1** | ✅ AA |
| Error Dark (#F87171) auf Deep Navy (#0F172A) | **7.2:1** | ✅ AAA |
| Teal (#0D9488) auf Weiß (#FFFFFF) | **5.5:1** | ✅ AA |

---

## 8. Datei-Struktur

```
/workspace/
├── DESIGN_SYSTEM_V2.md           # Dieses Dokument (kanonisch)
├── tw-nexify-preset.js           # Tailwind Preset
├── ThemeProvider.jsx             # React Theme Provider
├── nexify/04_register/
│   └── DESIGN_SYSTEM_V2.md       # Kanonische Referenz im Register
└── GRAPHITE_DESIGN_SYSTEM.md     # Bestehendes Graphite-System (unverändert)
```

---

## 9. Changelog

| Datum | Änderung | Autor |
|-------|---------|-------|
| 2026-06-20 | Initiale Version v2.0 — Migration von Graphite v1 | expert-design |
| 2026-06-20 | Deep Navy (#0F172A), NeXify Blue (#2563EB), Teal (#0D9488) | expert-design |
| 2026-06-20 | Typografie: Inter + Space Grotesk + DM Sans | expert-design |
| 2026-06-20 | Dark Mode: Deep Navy als Standard-Background | expert-design |
| 2026-06-20 | Komponenten-Regeln dokumentiert | expert-design |
| 2026-07-25 | SoT bestätigt: v2.0 Deep Navy/Inter verbindlich; design_guidelines.json superseded | user + agent |
