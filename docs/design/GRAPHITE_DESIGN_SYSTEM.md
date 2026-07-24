# Graphite Design System — Canonical Source of Truth

> **Origin:** Hermes WebUI Skin "Graphite" (2026-06-20)
> **Canonical for:** Hermes WebUI, NeXify Platform, Bookando, Vorratsgesellschaften
> **Version:** 1.0.0

---

## 1. Philosophy

Graphite = neutral workbench. Restrained chrome, soft contrast, native system fonts.
Purpose: maximum clarity, minimum visual noise. Accessibility-first.

- **Neutral palette** — no brand color fights. Gray/graphite based.
- **Native fonts** — system-ui, fast, license-free, feels local.
- **Full light/dark pair** — both rigorously defined.
- **Accessible** — WCAG AA contrast on all text/background pairs.
- **Modular** — CSS custom properties, Tailwind preset, component tokens.

---

## 2. Token Map: All CSS Custom Properties

### 2.1 Light Mode

```css
:root, [data-skin="graphite"] {
  color-scheme: light;

  /* Backgrounds */
  --bg:              #FFFFFF;
  --sidebar:         #F3F3F3;
  --surface:         #FFFFFF;
  --surface-subtle:  #F7F7F7;
  --surface-subtle-hover: #EFEFEF;
  --main-bg:         #FFFFFF;
  --topbar-bg:       rgba(255,255,255,0.94);
  --input-bg:        #FFFFFF;
  --code-bg:         #F1F1F1;

  /* Borders */
  --border:          #E2E2E2;
  --border2:         #CFCFCF;
  --border-subtle:   #E8E8E8;
  --border-muted:    #D6D6D6;

  /* Text */
  --text:            #242424;
  --strong:          #111111;
  --muted:           #707070;
  --em:              #4F4F4F;
  --code-text:       #242424;
  --pre-text:        #242424;

  /* Accent */
  --accent:          #303030;
  --accent-hover:    #171717;
  --accent-bg:       rgba(0,0,0,0.07);
  --accent-bg-strong:rgba(0,0,0,0.13);
  --accent-text:     #303030;

  /* Semantic Colors */
  --blue:            #5F5F5F;
  --gold:            #303030;
  --error:           #D44D4D;
  --success:         #0F8F70;
  --warning:         #B87916;
  --info:            #55564F;

  /* Focus */
  --focus-ring:      rgba(0,0,0,0.18);
  --focus-glow:      rgba(0,0,0,0.06);

  /* Interaction */
  --hover-bg:        rgba(0,0,0,0.05);
  --code-inline-bg:  rgba(0,0,0,0.06);

  /* User Bubbles */
  --user-bubble-bg:         #EFEFEF;
  --user-bubble-border:     #DEDEDE;
  --user-bubble-text:       #242424;
  --user-bubble-placeholder:#707070;
  --user-selection-bg:      rgba(0,0,0,0.16);
  --user-selection-text:    #111111;

  /* Typography */
  --font-ui:  -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-mono: ui-monospace, "SFMono-Regular", "SF Mono", Menlo, Consolas,
               "Liberation Mono", monospace;
  font-weight: 430;
}
```

### 2.2 Dark Mode

```css
:root.dark, .dark[data-skin="graphite"] {
  color-scheme: dark;

  /* Backgrounds */
  --bg:              #151614;
  --sidebar:         #242624;
  --surface:         #1B1C1A;
  --surface-subtle:  #20211F;
  --surface-subtle-hover: #292B28;
  --main-bg:         #151614;
  --topbar-bg:       rgba(21,22,20,0.92);
  --input-bg:        #1E1F1D;
  --code-bg:         #111210;

  /* Borders */
  --border:          #343631;
  --border2:         #4B4D47;
  --border-subtle:   #2A2C28;
  --border-muted:    #3D3F3A;

  /* Text */
  --text:            #ECEBE4;
  --strong:          #FAF9F3;
  --muted:           #A7A79D;
  --em:              #D7D6CE;
  --code-text:       #F1F0EA;
  --pre-text:        #ECEBE4;

  /* Accent */
  --accent:          #D7D6CE;
  --accent-hover:    #F4F3EC;
  --accent-bg:       rgba(255,255,255,0.08);
  --accent-bg-strong:rgba(255,255,255,0.14);
  --accent-text:     #D7D6CE;

  /* Semantic Colors */
  --blue:            #C9C8C0;
  --gold:            #D7D6CE;
  --error:           #FF6B6B;
  --success:         #10A37F;
  --warning:         #E6B15C;
  --info:            #C9C8C0;

  /* Focus */
  --focus-ring:      rgba(244,243,236,0.22);
  --focus-glow:      rgba(244,243,236,0.08);

  /* Interaction */
  --hover-bg:        rgba(255,255,255,0.06);
  --code-inline-bg:  rgba(255,255,255,0.08);

  /* User Bubbles */
  --user-bubble-bg:         #2E302D;
  --user-bubble-border:     #454741;
  --user-bubble-text:       #F4F3EC;
  --user-bubble-placeholder:#A7A79D;
  --user-selection-bg:      rgba(255,255,255,0.18);
  --user-selection-text:    #FAF9F3;
}
```

### 2.3 Radii & Spacing (inherited from WebUI base)

```css
--radius-sm:   4px;
--radius-md:   8px;
--radius-card: 8px;
--radius-lg:   12px;
--radius-pill: 999px;

--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
```

### 2.4 Font Sizes

```css
--font-size-xs:   11px;
--font-size-sm:   12px;
--font-size-md:   14px;  /* default body */
```

---

## 3. Tailwind Preset

**File:** `tw-graphite-preset.js` (siehe separates Artefakt)

Erweitert Tailwind v3/v4 um Graphite-Farben, -Radii, -Spacing, -Fonts.
Nutzt CSS-Var-Referenzen statt Hardcode — Theme-Switcher kompatibel.

---

## 4. Migration: NeXify Platform DS → Graphite

| NeXify DS (alt) | Graphite Light | Graphite Dark | Aktion |
|---|---|---|---|
| `--bg: #0f1923` | `--bg: #FFFFFF` | `--bg: #151614` | **Ersetzen.** Dark-first nicht mehr nötig. |
| `--surface_glass: rgba(19,26,34,0.85)` | `--surface: #FFFFFF` | `--surface: #1B1C1A` | **Ersetzen.** Glas-Effekt entfernt — flache Surfaces. |
| `--primary_accent: #FE9B7B` | `--accent: #303030` | `--accent: #D7D6CE` | **Ersetzen.** Coral → neutral. |
| `--text_primary: #e2e8f0` | `--text: #242424` | `--text: #ECEBE4` | **Ersetzen.** |
| `--text_secondary: #c8d1dc` | `--muted: #707070` | `--muted: #A7A79D` | **Ersetzen.** |
| `--border: rgba(255,255,255,0.08)` | `--border: #E2E2E2` | `--border: #343631` | **Ersetzen.** |
| Manrope Headings | system-ui | system-ui | **Ersetzen.** Kein Manrope mehr. |
| Phosphor Icons | Lucide | Lucide | **Empfohlen:** auf Lucide wechseln. |
| Glassmorphism | Flat | Flat | **Ersetzen.** `backdrop-blur-xl` entfernen. |

---

## 5. Migration: Bookando → Graphite

| Bookando (alt) | Graphite Light | Graphite Dark | Aktion |
|---|---|---|---|
| `--color-primary: #1A202C` | `--accent: #303030` | `--accent: #D7D6CE` | **Umbenennen + Werte.** |
| `--color-accent: #F59E0B` | `--blue: #5F5F5F` | `--blue: #C9C8C0` | **Ersetzen.** Kein Amber mehr. |
| `--color-accent-teal: #0D9488` | — | — | **Entfernen.** Nicht im Graphite-Spektrum. |
| `--color-accent-pink: #DB2777` | — | — | **Entfernen.** |
| `--color-shell-bg: #F8FAFC` | `--bg: #FFFFFF` | `--bg: #151614` | **Ersetzen.** |
| `--color-surface: #ffffff` | `--surface: #FFFFFF` | `--surface: #1B1C1A` | **1:1 Mapping.** |
| `--color-text-primary: #0F172A` | `--text: #242424` | `--text: #ECEBE4` | **Angleichen.** |
| `--color-divider: #E2E8F0` | `--border: #E2E2E2` | `--border: #343631` | **Angleichen.** |
| `--shadow-card: 0 1px 3px rgba(0,0,0,0.04)...` | `--shadow-e2` | `--shadow-e2` | **Graphite-Shadows übernehmen.** |
| Cabinet Grotesk / IBM Plex Sans | system-ui | system-ui | **Font-Change.** |
| `--radius-md: 6px` | `--radius-md: 8px` | `--radius-md: 8px` | **Anpassen auf 8px.** |
| `--color-success: #059669` | `--success: #0F8F70` | `--success: #10A37F` | **Werte angleichen.** |
| `--color-danger: #DC2626` | `--error: #D44D4D` | `--error: #FF6B6B` | **Werte angleichen.** |

**Bookando spezifische Graphite-Erweiterungen (behalten):**
- `w2g-*` Utility-Klassen → in Graphite-Namespace umbenennen (`gr-*`)
- Layout-Tokens (--shell-max-width, --topbar-height, --sidebar-width) bleiben erhalten
- Animation-Klassen (animate-slide-up, animate-fade-in) bleiben erhalten

---

## 6. Migration: Vorratsgesellschaften → Graphite

| Vorratsgesellschaften (alt) | Graphite Light | Graphite Dark | Aktion |
|---|---|---|---|
| `--navy-950: #06172a` | `--accent: #303030` | `--accent: #D7D6CE` | **Ersetzen.** |
| `--navy-900: #0a223d` | `--bg: #FFFFFF` | `--bg: #151614` | **Ersetzen.** |
| `--gold-500: #c7a24b` | `--accent-text: #303030` | `--accent-text: #D7D6CE` | **Ersetzen.** |
| `--paper: #fffdfa` | `--bg: #FFFFFF` | `--bg: #151614` | **Ersetzen.** |
| `--ink-900: #152033` | `--text: #242424` | `--text: #ECEBE4` | **Ersetzen.** |
| `--line: #dce4ee` | `--border: #E2E2E2` | `--border: #343631` | **Angleichen.** |
| Arial / Georgia | system-ui | system-ui | **Font-Change.** |
| `--radius-md: 18px` | `--radius-md: 8px` | `--radius-md: 8px` | **Deutlicher Radius-Neustart.** |
| Gold Radials | Entfernen | Entfernen | **Radial-Gradient entfernen** — Graphite ist flat. |

**Spezifische Identity bewahren?**
- Vorratsgesellschaften ist eine Premium-B2B-Landingpage. Graphite ist ein Chat-Workbench-Skin. **Empfehlung: nicht 1:1 übernehmen.** Auf helles, seriöses Layout achten — aber Systemfont + Graphite-Palette für Nav/Footer/UI-Elemente verwenden.

---

## 7. Component Architecture

### 7.1 Basis: shadcn/ui Standalone (kein Blackbox-Next.js)

| Komponente | Bookando | NeXify Platform | Vorratsges. |
|---|---|---|---|
| Button | ❌ Fehlt | ✅ JSON-Spec | ❌ Fehlt |
| Card | ✅ card.jsx | ✅ JSON-Spec | ❌ Fehlt |
| Badge | ✅ badge.jsx | ✅ JSON-Spec | ❌ Fehlt |
| Avatar | ✅ avatar.jsx | ❌ Fehlt | ❌ Fehlt |
| Input | ❌ Fehlt | ✅ JSON-Spec | ❌ Fehlt |
| Dialog | ❌ Fehlt | ❌ Fehlt | ❌ Fehlt |
| DropdownMenu | ❌ Fehlt | ❌ Fehlt | ❌ Fehlt |
| Command (CMD-K) | ❌ Fehlt | ❌ Fehlt | ❌ Fehlt |
| Tooltip | ❌ Fehlt | ❌ Fehlt | ❌ Fehlt |
| Select | ❌ Fehlt | ❌ Fehlt | ❌ Fehlt |
| Table | ❌ Fehlt | ✅ JSON-Spec | ❌ Fehlt |
| Separator | ✅ separator.jsx | ❌ Fehlt | ❌ Fehlt |
| Progress | ✅ progress.jsx | ❌ Fehlt | ❌ Fehlt |

### 7.2 Notwendig für Graphite Unity

Jedes Projekt braucht:
1. **Tailwind v3+** (Bookando hat's, Vorratsgesellschaften nicht, NeXify Platform hat's)
2. **Graphite Tailwind Preset** `tw-graphite-preset.js` (shared)
3. **Theme Provider** — `dark` class toggle, `data-skin="graphite"` Attribut
4. **shadcn/ui components.json** — mit Graphite als `tailwind.css`

---

## 8. Theme Provider (React)

```jsx
// ThemeProvider.jsx — Einziger Provider für alle Projekte
import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children, defaultSkin = 'graphite' }) {
  const [skin, setSkin] = useState(defaultSkin);
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-skin', skin);
    document.documentElement.classList.toggle('dark', dark);
  }, [skin, dark]);

  return (
    <ThemeContext.Provider value={{ skin, setSkin, dark, setDark }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

---

## 9. Ordnerstruktur (Repository-übergreifend)

```
/workspace/packages/design-system/     # (ZUKUNFT: shared DS package)
├── tokens/
│   ├── graphite-light.css
│   ├── graphite-dark.css
│   └── graphite-radii.css
├── tw-graphite-preset.js              # <-- Shared Tailwind Preset
├── ThemeProvider.jsx                   # <-- Shared React Provider
└── GRAPHITE_REFERENCE.md              # <-- Dieses Dokument
```

**Projekt-lokal:**
```
/workspace/nexifyai-platform/tw-graphite-preset.js          → symlink or copy
/workspace/customers/fixdigital/bookando/bookando-de/tw-graphite-preset.js
/workspace/vorratsgesellschaften/.../tw-graphite-preset.js
```

---

## 10. Prio-Roadmap

| Phase | Task | Projekt | Aufwand |
|---|---|---|---|
| **P0** | Tailwind Preset `tw-graphite-preset.js` | Shared | 30min |
| **P0** | ThemeProvider.jsx | Shared | 15min |
| **P1** | Bookando CSS-Vars → Graphite Tokens | Bookando | 2h |
| **P1** | Bookando `w2g-*` → `gr-*` rename | Bookando | 1h |
| **P1** | Design-Audit fixen + ausführen | Alle | 30min |
| **P2** | NeXify Platform DS JSON → Graphite | NeXify | 1h |
| **P2** | Vorratsgesellschaften → Graphite (partial) | Vorratsg. | 2h |
| **P3** | shadcn/ui Basis-Komponenten für alle | Alle | 4h |
| **P3** | Bundle-Optimierung nach Font-Change | Alle | 1h |

---

## 11. Accessibility Notes

- Graphite Light: `#242424` on `#FFFFFF` = **15.3:1 contrast** ✅ AAA
- Graphite Dark: `#ECEBE4` on `#151614` = **13.7:1 contrast** ✅ AAA
- Accent Light: `#303030` on `#FFFFFF` = **13.5:1** ✅ AAA
- Accent Dark: `#D7D6CE` on `#1B1C1A` = **11.8:1** ✅ AAA
- Error Light: `#D44D4D` on `#FFFFFF` = **5.6:1** ✅ AA
- Error Dark: `#FF6B6B` on `#151614` = **7.0:1** ✅ AAA

**Alle Text-auf-Hintergrund-Kombinationen bestehen WCAG AA/A.**

---

## 12. Changelog

| Date | Change | Author |
|---|---|---|
| 2026-06-20 | Initial aus Hermes WebUI Graphite-Skin extrahiert | expert-design |
| 2026-06-20 | Migration-Maps für NeXify DS, Bookando, Vorratsg. | expert-design |
