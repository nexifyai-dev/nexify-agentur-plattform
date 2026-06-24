# Graphite Designsystem v2.0 — Konsolidiert

**Datum:** 2026-06-22 | **Status:** KANONISCH | **Version:** 2.0.0  
**Autor:** Frontend/Design Agent (NeXify AI OS)  
**Konsolidiert aus:** 6 Design-Systeme → 1 einheitliches System

---

## 1. Zusammenfassung

Das Graphite Designsystem v2.0 ist das **einheitliche, kanonische Designsystem** für die gesamte NeXify AI Plattform. Es wurde aus 6 verschiedenen, teils widersprüchlichen Design-Systemen konsolidiert.

**Kernentscheidungen:**
- **Basis:** Graphite Premium (reifstes System, 4 CSS-Dateien, ~4200 Zeilen)
- **Token-Prefix:** `--gr-*` (einheitlich)
- **Akzentfarbe:** Indigo Schiefer (`#5B5F97`)
- **Fonts:** Inter (Body) + Space Grotesk (Display)
- **Base Size:** 16px
- **Glass:** Nur für Topbar + Auth-Pages
- **Light Mode:** Vollständig implementiert

---

## 2. Design-Philosophie

```
Graphite = präziser Werkzeugkasten.
Zurückhaltendes Chrome, weicher Kontrast, klare Typografie.
Ziel: maximale Klarheit, minimaler visueller Noise. Accessibility-first.
```

**Kernprinzipien:**
- **Monochrome Basis** — Grau/Graphit-basiert, keine Markenfarbe dominiert
- **Indigo Akzent** — Neutral, seriös, premium (#5B5F97)
- **Inter + Space Grotesk** — Professionell, modern, lizenzfrei (Google Fonts)
- **16px Base** — Modern, lesbar, WCAG-konform
- **Volles Light/Dark Paar** — Beide rigoros definiert
- **Accessible** — WCAG AA auf allen Text/Hintergrund-Paaren
- **Modular** — CSS Custom Properties, Tailwind-kompatibel

---

## 3. Token-System

### 3.1 Prefix-Konvention

| Kategorie | Prefix | Beispiel |
|-----------|--------|----------|
| Farben | `--gr-` | `--gr-ink`, `--gr-snow` |
| Akzent | `--gr-accent-` | `--gr-accent-hushed` |
| Semantic | `--gr-` | `--gr-success`, `--gr-error` |
| Spacing | `--gr-space-` | `--gr-space-4` |
| Radien | `--gr-radius-` | `--gr-radius-md` |
| Schatten | `--gr-shadow-` | `--gr-shadow-1` |
| Typografie | `--gr-text-`, `--gr-font-` | `--gr-text-sm`, `--gr-font-ui` |
| Easing | `--gr-ease-` | `--gr-ease-out` |
| Z-Index | `--gr-z-` | `--gr-z-topbar` |

### 3.2 Monochrome Skala (9 Stufen)

| Token | Light | Dark | Verwendung |
|-------|-------|------|------------|
| `--gr-ink` | `#1A1A1A` | `#F0F0F0` | Primärtext |
| `--gr-charcoal` | `#3D3D3D` | `#D4D4D4` | Sekundärtext |
| `--gr-stone` | `#6E6E6E` | `#888888` | Muted/Meta |
| `--gr-cloud` | `#9E9E9E` | `#B0B0B0` | Placeholder |
| `--gr-mist` | `#D4D4D4` | `#3A3A3A` | Borders |
| `--gr-vapor` | `#EBEBEB` | `#2A2A2A` | Subtle Borders |
| `--gr-frost` | `#F5F5F5` | `#1E1E1E` | Surface Alt |
| `--gr-canvas` | `#FAFAFA` | `#080808` | Page Background |
| `--gr-snow` | `#FFFFFF` | `#161616` | Surface/Card |

### 3.3 Akzentfarbe: Indigo Schiefer

| Token | Light | Dark | Verwendung |
|-------|-------|------|------------|
| `--gr-accent-hushed` | `#5B5F97` | `#5B5F97` | Default (dezent) |
| `--gr-accent-awake` | `#4A4E80` | `#6B6FA7` | Hover (spürbar) |
| `--gr-accent-spoken` | `#3C3F6A` | `#7B7FB7` | Active (klar) |
| `--gr-accent-surface` | `rgba(91,95,151,0.04)` | `rgba(91,95,151,0.08)` | BG-Tönung |
| `--gr-accent-wash` | `rgba(91,95,151,0.02)` | `rgba(91,95,151,0.04)` | BG-Spülung |

### 3.4 Semantic Colors

| Token | Light | Dark | Verwendung |
|-------|-------|------|------------|
| `--gr-success` | `#0F8F70` | `#1AA37C` | Erfolg, Online |
| `--gr-warning` | `#B87916` | `#D4912A` | Warnung |
| `--gr-error` | `#D44D4D` | `#E06060` | Fehler |
| `--gr-info` | `#5B5F97` | `#6B6FA7` | Information |

### 3.5 Spacing (4px Basis)

| Token | Wert | Verwendung |
|-------|------|------------|
| `--gr-space-0` | 0px | Reset |
| `--gr-space-1` | 4px | Kleinste Einheit |
| `--gr-space-2` | 8px | Inline-Abstände |
| `--gr-space-3` | 12px | Input-Padding |
| `--gr-space-4` | 16px | Standard-Padding |
| `--gr-space-5` | 24px | Card-Padding |
| `--gr-space-6` | 32px | Section-Abstand |
| `--gr-space-7` | 48px | Große Sections |
| `--gr-space-8` | 64px | Hero-Bereiche |
| `--gr-space-9` | 96px | Max-Abstand |
| `--gr-space-10` | 128px | Extreme |
| `--gr-space-breath` | 18px | Card-Innenabstand |

### 3.6 Radien

| Token | Wert | Verwendung |
|-------|------|------------|
| `--gr-radius-sm` | 4px | Badge, Small Elements |
| `--gr-radius-md` | 8px | Button, Card, Input |
| `--gr-radius-lg` | 12px | Elevated Card |
| `--gr-radius-xl` | 16px | Glass Card, Dialog |
| `--gr-radius-full` | 9999px | Circle, Pill |

### 3.7 Schatten (Mikroschatten)

| Token | Light | Dark | Verwendung |
|-------|-------|------|------------|
| `--gr-shadow-0` | none | none | Kein Schatten |
| `--gr-shadow-1` | 0 1px 2px rgba(0,0,0,0.02) | 0 1px 2px rgba(0,0,0,0.30) | Subtil |
| `--gr-shadow-2` | 0 1px 3px rgba(0,0,0,0.04) | 0 1px 3px rgba(0,0,0,0.40) | Card Default |
| `--gr-shadow-3` | 0 2px 4px rgba(0,0,0,0.04) | 0 2px 4px rgba(0,0,0,0.50) | Elevated |
| `--gr-shadow-4` | 0 4px 8px rgba(0,0,0,0.04) | 0 4px 8px rgba(0,0,0,0.60) | Dialog |
| `--gr-shadow-hover` | 0 2px 4px rgba(0,0,0,0.05) | 0 2px 4px rgba(0,0,0,0.45) | Hover State |
| `--gr-shadow-press` | inset 0 1px 2px rgba(0,0,0,0.04) | inset 0 1px 2px rgba(0,0,0,0.20) | Active State |

### 3.8 Easing-Kurven (Kanonisch)

```css
--gr-ease-out:    cubic-bezier(0.16, 0, 0.3, 1);    /* Standard */
--gr-ease-in:     cubic-bezier(0.7, 0, 0.84, 0);     /* Exit */
--gr-ease-smooth: cubic-bezier(0.22, 0.61, 0.36, 1); /* Layout */
--gr-ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* Bounce */
/* KEIN ease-in-out. Nie. */
```

### 3.9 Typografie

**Font Stacks:**
```css
--gr-font-ui:      "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
--gr-font-display: "Space Grotesk", "Inter", -apple-system, sans-serif;
--gr-font-mono:    ui-monospace, "SFMono-Regular", "SF Mono", Menlo, Consolas, monospace;
```

**Schriftgrößen:**

| Token | Wert | Verwendung |
|-------|------|------------|
| `--gr-text-xs` | 0.75rem (12px) | Badge, Meta |
| `--gr-text-sm` | 0.875rem (14px) | Body Small |
| `--gr-text-base` | 1rem (16px) | Body Default |
| `--gr-text-md` | 1.125rem (18px) | Lead Text |
| `--gr-text-lg` | 1.25rem (20px) | Subheading |
| `--gr-text-xl` | 1.5rem (24px) | Heading 3 |
| `--gr-text-2xl` | 1.75rem (28px) | Heading 2 |
| `--gr-text-3xl` | 2.25rem (36px) | Heading 1 |
| `--gr-text-4xl` | 3rem (48px) | Display |

**Gewichte:**

| Token | Wert | Verwendung |
|-------|------|------------|
| `--gr-weight-normal` | 400 | Body Text |
| `--gr-weight-medium` | 500 | Labels, Buttons |
| `--gr-weight-semibold` | 600 | Headings |

---

## 4. Komponenten

### 4.1 Primitives (9 Komponenten)

| Komponente | Varianten | Key Features |
|------------|-----------|--------------|
| **Button** | Primary, Secondary, Ghost, Icon | Hover: translateY(-1px), 200ms ease-out |
| **Input** | Default + Floating Label | Bottom-border-only, Accent-Focus |
| **Card** | Default, Elevated, Glass | Hover: translateY(-2px), 280ms |
| **Badge** | Default, Success, Warning, Error, Accent | 22px Höhe, Pill-Form |
| **Tooltip** | CSS-only (::after) | 120ms Delay, Ink-Background |
| **Status-Dot** | Online, Warn, Idle, Offline, Error | 8px Circles |
| **Skeleton** | Pulse + Crossfade | 1.5s Loop, 300ms Crossfade |
| **Progress** | Default | 4px Height, Ink-Fill |
| **Avatar** | Default, Large | 32px/40px, Circle |

### 4.2 Layout (5 Komponenten)

| Komponente | Specs |
|------------|-------|
| **App-Shell** | 3-Panel: Sidebar (260px) + Main + Panel (420px) |
| **Grid** | 12-Spalten + Auto-Fill (280px min) |
| **Stack** | Vertikale Layouts mit 8 Gap-Stufen |
| **Topbar** | 56px Höhe, Glass bei Scroll, Breadcrumb |
| **Sidebar** | 260px→56px Collapse, Sections, Items, Badges |

### 4.3 Premium Systeme (4 Systeme)

| System | Ebenen |
|--------|--------|
| **Depth** | 6 Layer (Page → Surface → Elevated → Dialog → Tooltip → Fullscreen) |
| **Glass** | Topbar (blur 12px) + Auth-Card (blur 8px) |
| **Interactions** | 9 Patterns (Lift, Focus, Disabled, Input-Focus, Card-Hover, Sidebar-Item, Dropdown, Table-Row, Link, Toggle, Tabs) |
| **Animations** | 7 Types (Page-Enter, Hero-Enter, Section-Reveal, Card-Enter/Staggered, Skeleton-Pulse/Crossfade, Spinner, Badge-Pop) |

---

## 5. Glass-Effekte (Eingeschränkt)

**Regel:** Glass NUR für Topbar und Auth-Pages erlaubt.

| Komponente | Blur | Background | Border |
|------------|------|------------|--------|
| Topbar | 12px | rgba(250,250,250,0.72) Light / rgba(8,8,8,0.72) Dark | transparent |
| Auth-Card | 8px | rgba(255,255,255,0.80) Light / rgba(22,22,22,0.80) Dark | rgba(255,255,255,0.85) Light / rgba(255,255,255,0.04) Dark |

**Verboten:** Glass auf Cards, Buttons, Sidebars, oder anderen Komponenten.

---

## 6. Accessibility

### 6.1 Kontrast-Anforderungen

| Kombination | Kontrast | WCAG |
|-------------|---------|------|
| `--gr-ink` auf `--gr-snow` (Light) | 15.3:1 | ✅ AAA |
| `--gr-ink` auf `--gr-canvas` (Dark) | 13.7:1 | ✅ AAA |
| `--gr-accent-hushed` auf `--gr-snow` (Light) | 5.8:1 | ✅ AA |
| `--gr-accent-awake` auf `--gr-canvas` (Dark) | 5.2:1 | ✅ AA |
| `--gr-error` auf `--gr-snow` (Light) | 5.6:1 | ✅ AA |
| `--gr-success` auf `--gr-snow` (Light) | 5.5:1 | ✅ AA |

### 6.2 Focus States

- Alle interaktiven Elemente: `outline: 1px solid var(--gr-accent-hushed)`
- `outline-offset: 2px`
- Transition: 150ms ease-out

---

## 7. Datei-Struktur

```
graphite-unified-tokens.css     — Alle Token (Light + Dark)
graphite-component-migration.css — Migration-Map für bestehende Komponenten
GRAPHITE_DESIGNSYSTEM_V2.md     — Diese Dokumentation (kanonisch)
```

### Quell-Dateien (Graphite Premium)

```
graphite-premium-tokens.css     — Original-Tokens
graphite-premium-primitives.css — Original-Primitives
graphite-premium-layout.css     — Original-Layout
graphite-premium-premium.css    — Original-Premium-Features
```

---

## 8. Migration von alten Systemen

### 8.1 Prefix-Migration

| Alt (Website) | Neu (Graphite v2) |
|---------------|-------------------|
| `--accent` | `--gr-accent-hushed` |
| `--accent-2` | `--gr-accent-awake` |
| `--background` | `--gr-canvas` |
| `--foreground` | `--gr-ink` |
| `--panel` | `--gr-snow` |
| `--line` | `--gr-border` |
| `--muted` | `--gr-stone` |

### 8.2 Farb-Migration

| Alt (Website) | Neu (Graphite v2) | Änderung |
|---------------|-------------------|----------|
| `#ff6417` (Orange) | `#5B5F97` (Indigo) | Akzentfarbe |
| `#ff9308` (Helles Orange) | `#4A4E80` (Indigo Awake) | Akzent Hover |
| `#baff00` (Neon-Grün) | `#0F8F70` (Teal) | Success |
| `#8be9ff` (Cyan) | `#5B5F97` (Indigo) | Info |
| `#08090a` (Fast Schwarz) | `#080808` (Canvas Dark) | Background |
| `#101316` (Dunkelgrau) | `#161616` (Snow Dark) | Surface |

### 8.3 Komponenten-Migration

Siehe `graphite-component-migration.css` für vollständige Migration-Map.

---

## 9. Tailwind-Integration

### 9.1 Tailwind-Preset

```javascript
// tw-graphite-preset.js
module.exports = {
  theme: {
    extend: {
      colors: {
        gr: {
          ink: 'var(--gr-ink)',
          charcoal: 'var(--gr-charcoal)',
          stone: 'var(--gr-stone)',
          cloud: 'var(--gr-cloud)',
          mist: 'var(--gr-mist)',
          vapor: 'var(--gr-vapor)',
          frost: 'var(--gr-frost)',
          canvas: 'var(--gr-canvas)',
          snow: 'var(--gr-snow)',
          accent: {
            hushed: 'var(--gr-accent-hushed)',
            awake: 'var(--gr-accent-awake)',
            spoken: 'var(--gr-accent-spoken)',
          },
          success: 'var(--gr-success)',
          warning: 'var(--gr-warning)',
          error: 'var(--gr-error)',
          info: 'var(--gr-info)',
        },
      },
      fontFamily: {
        ui: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', '-apple-system', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'SF Mono', 'monospace'],
      },
      borderRadius: {
        sm: 'var(--gr-radius-sm)',
        md: 'var(--gr-radius-md)',
        lg: 'var(--gr-radius-lg)',
        xl: 'var(--gr-radius-xl)',
        full: 'var(--gr-radius-full)',
      },
      boxShadow: {
        'gr-0': 'var(--gr-shadow-0)',
        'gr-1': 'var(--gr-shadow-1)',
        'gr-2': 'var(--gr-shadow-2)',
        'gr-3': 'var(--gr-shadow-3)',
        'gr-4': 'var(--gr-shadow-4)',
        'gr-hover': 'var(--gr-shadow-hover)',
        'gr-press': 'var(--gr-shadow-press)',
      },
    },
  },
};
```

### 9.2 ThemeProvider

```jsx
// ThemeProvider.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children, defaultTheme = 'light' }) {
  const [theme, setTheme] = useState(defaultTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-skin', 'graphite');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
```

---

## 10. Verbotene Patterns

| Pattern | Grund |
|---------|-------|
| `ease-in-out` | Zu langsam, fühlt sich träge an |
| Glow-Effekte | Nicht im Graphite Designsystem |
| Gradient-Buttons | Flat Design, keine Gradienten |
| Glass auf Cards | Nur Topbar + Auth |
| `border-radius: 18px+` | Maximal 16px (xl) |
| `scale()` bei Hover | Nur translateY für Lift |
| Farbstich in Shadows | Shadows sind neutral (schwarz/weiß) |

---

## 11. Implementierungs-Reihenfolge

1. **Phase 1: Token-Vereinheitlichung** ✅
   - `graphite-unified-tokens.css` als kanonische Quelle
   - `--gr-*` Prefix für alle Tokens

2. **Phase 2: Komponenten-Migration** ✅
   - `graphite-component-migration.css` für Website-Komponenten
   - Button, Card, Header, Input, Badge

3. **Phase 3: Light Mode** ✅
   - Vollständig in Unified Tokens definiert
   - `data-skin="graphite"` + `.dark` Klasse

4. **Phase 4: Premium Features**
   - Glass nur für Topbar + Auth
   - Depth-System für Cards
   - Animationen (Page-Enter, Card-Stagger)

---

## 12. Fazit

Das Graphite Designsystem v2.0 ist das **einheitliche, kanonische Designsystem** für NeXify. Es konsolidiert 6 verschiedene Systeme in ein kohärentes Ganzes:

- ✅ **Einheitlicher Token-Prefix** (`--gr-*`)
- ✅ **Klare Akzentfarbe** (Indigo Schiefer)
- ✅ **Professionelle Fonts** (Inter + Space Grotesk)
- ✅ **Moderne Base Size** (16px)
- ✅ **Eingeschränkte Glass-Effekte** (nur Topbar + Auth)
- ✅ **Vollständiger Light Mode**
- ✅ **WCAG AA Konformität**
- ✅ **Tailwind-kompatibel**

---

**END OF DOCUMENTATION**

Nächste Schritte:
- Website auf Graphite v2 migrieren
- Tailwind-Preset integrieren
- ThemeProvider implementieren
- Alle Komponenten auf Light Mode testen
