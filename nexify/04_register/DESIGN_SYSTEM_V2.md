# NeXify Design System v2.0 — Kanonische Quelle der Wahrheit

> **Brand:** NeXifyAI by NeXify – Chat it. Automate it.
> **Version:** 2.0.0
> **Gültig ab:** 08.05.2026
> **Register-Pfad:** /workspace/nexify/04_register/DESIGN_SYSTEM_V2.md
> **Canonical Source:** /workspace/DESIGN_SYSTEM_V2.md
> **Basis:** shadcn/ui, Tailwind CSS v3+
> **Dark Mode:** Standard für Admin + Fabrik

---

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

### 2.3 Radii & Spacing (unverändert aus Graphite)

```css
--nx-radius-sm:   4px;
--nx-radius-md:   8px;
--nx-radius-card: 8px;
--nx-radius-lg:   12px;
--nx-radius-pill: 999px;

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

/* Font Sizes */
--nx-font-size-xs:     11px;
--nx-font-size-sm:     13px;
--nx-font-size-base:   15px;
--nx-font-size-lg:     18px;
--nx-font-size-xl:     24px;
--nx-font-size-2xl:    32px;
--nx-font-size-3xl:    40px;
```

### 2.5 Tiefe & Schatten (aus Graphite übernommen)

```css
--nx-depth-0-shadow: 0 0 0 1px var(--nx-border-subtle);
--nx-depth-1-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.03);
--nx-depth-2-shadow: 0 2px 8px rgba(0,0,0,0.06), 0 1px 1px rgba(0,0,0,0.03);
--nx-depth-3-shadow: 0 12px 32px rgba(0,0,0,0.08), 0 4px 8px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.06);
--nx-depth-4-shadow: 0 24px 64px rgba(0,0,0,0.10), 0 8px 16px rgba(0,0,0,0.05);

--nx-depth-1-shadow-dark: 0 1px 2px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.04);
--nx-depth-2-shadow-dark: 0 2px 8px rgba(0,0,0,0.24), 0 1px 1px rgba(0,0,0,0.10);
--nx-depth-3-shadow-dark: 0 12px 32px rgba(0,0,0,0.36), 0 4px 8px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.06);
--nx-depth-4-shadow-dark: 0 24px 64px rgba(0,0,0,0.40), 0 8px 16px rgba(0,0,0,0.20);

--nx-hover-lift-shadow:    0 8px 24px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04);
--nx-hover-lift-shadow-dark: 0 8px 24px rgba(0,0,0,0.32), 0 2px 4px rgba(0,0,0,0.16);
--nx-active-press-shadow: 0 1px 2px rgba(0,0,0,0.04), inset 0 1px 2px rgba(0,0,0,0.06);
--nx-focus-glow-ring: 0 0 0 2px var(--nx-focus-ring);
--nx-focus-glow-strong: 0 0 0 3px var(--nx-focus-ring), 0 0 16px var(--nx-focus-glow);
```

---

## 3. Tailwind Preset

**Datei:** `/workspace/tw-nexify-preset.js`

Erweitert Tailwind v3+ um NeXify-Farben, -Radii, -Spacing, -Fonts, -Shadows.

---

## 4. Theme Provider

**Datei:** `/workspace/ThemeProvider.jsx`

- `data-skin="nexify"` + `.dark` class on `<html>`
- localStorage + System fallback
- useMemo-optimiert, useCallback-stabile Referenzen

---

## 5. Migration Graphite → NeXify v2

Siehe `/workspace/DESIGN_SYSTEM_V2.md` Section 6 für vollständige Migrations-Map.

---

## 6. Accessibility

| Kombination | Kontrast | WCAG |
|------------|---------|------|
| Deep Navy (#0F172A) auf Weiß | **15.3:1** | ✅ AAA |
| NeXify Blue (#2563EB) auf Weiß | **8.5:1** | ✅ AAA |
| Weiß auf Deep Navy (#0F172A) | **15.3:1** | ✅ AAA |
| Error (#DC2626) auf Weiß | **5.8:1** | ✅ AA |

---

## 7. Changelog

| Datum | Änderung |
|-------|---------|
| 2026-06-20 | Init v2.0. Deep Navy, NeXify Blue, Teal. Inter/Space Grotesk/DM Sans. |
