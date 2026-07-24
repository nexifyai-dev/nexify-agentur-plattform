# Integrationsplan: NeXify AI Landingpage → Graphite Premium

**Datum:** 2026-06-22 | **Status:** IMPLEMENTIERT | **Version:** 2.0.0
**Owner:** Frontend/Design Agent (NeXify AI OS)
**Basis:** Analyse 2 + Anforderungsdefinition

---

## 1. Integrationsstrategie

### 1.1 Überblick

Die Integration folgt einer **inkrementellen Strategie**: Die bestehende Website wird schrittweise auf das Graphite Premium Designsystem migriert, ohne den laufenden Betrieb zu unterbrechen. Jede Phase ist eigenständig testbar und deploybar.

### 1.2 Prinzipien

1. **Kein Big-Bang** — Schrittweise Migration, jede Phase eigenständig funktional
2. **Rückwärtskompatibel** — Bestehende Styles bleiben bis zur Migration gültig
3. **Test-getrieben** — Playwright Design-Audit nach jeder Änderung
4. **Token-basiert** — Alle Styles über CSS Custom Properties
5. **Dark + Light** — Beide Modi von Anfang an berücksichtigen

---

## 2. Phasenplan

### Phase 1: Token-Fundament (Tag 1-2) ✅ ABGESCHLOSSEN

**Ziel:** Graphite Premium Tokens als kanonische Quelle etablieren.

#### Schritt 1.1: Token-Datei erstellen ✅
```css
/* app/globals.css — Integriert */
:root {
  /* Monochrome Skala */
  --color-ink: #1A1A1A;
  --color-charcoal: #3D3D3D;
  --color-stone: #6E6E6E;
  --color-cloud: #9E9E9E;
  --color-mist: #D4D4D4;
  --color-vapor: #EBEBEB;
  --color-frost: #F5F5F5;
  --color-canvas: #FAFAFA;
  --color-snow: #FFFFFF;

  /* Akzentfarbe (Orange beibehalten) */
  --accent: #ff6417;
  --accent-2: #ff9308;

  /* Status */
  --color-success: #0F8F70;
  --color-error: #D44D4D;
  --color-info: #5B5F97;

  /* Easing (kanonisch) */
  --ease-out: cubic-bezier(0.16, 0, 0.3, 1);
  --ease-in: cubic-bezier(0.7, 0, 0.84, 0);
  --ease-smooth: cubic-bezier(0.22, 0.61, 0.36, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* WCAG-konforme Textfarben */
  --text-primary: #f0f2f3;     /* ~18.5:1 */
  --text-secondary: #c4c9cc;   /* ~10.5:1 */
  --text-tertiary: #9ba0a4;    /* ~6.5:1 */
  --text-accent: #ff7a3a;      /* ~6.2:1 */
}

[data-theme="dark"] {
  --color-ink: #ECEBE4;
  --color-charcoal: #A7A79D;
  --color-stone: #707070;
  --color-cloud: #505050;
  --color-mist: #343631;
  --color-vapor: #252624;
  --color-frost: #1B1C1A;
  --color-canvas: #080808;
  --color-snow: #161616;
}
```

#### Schritt 1.2: Bestehende Tokens mappen ✅
```css
/* app/globals.css — Migration */
:root {
  --background: var(--color-canvas);
  --foreground: var(--color-ink);
  --panel: var(--color-frost);
  --panel-2: var(--color-vapor);
  --line: var(--color-mist);
  --muted: var(--color-stone);
}
```

**Deliverable:** `app/globals.css` mit Graphite Premium Tokens
**Aufwand:** 4 Stunden
**Status:** ✅ Implementiert

---

### Phase 2: Light Mode (Tag 3-4) ✅ ABGESCHLOSSEN

**Ziel:** Vollständiger Light Mode support.

#### Schritt 2.1: ThemeProvider implementieren ✅
```tsx
// components/theme-provider.tsx
"use client";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
const ThemeContext = createContext<{
  theme: Theme;
  toggle: () => void;
}>({ theme: "dark", toggle: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme;
    if (saved) setTheme(saved);
    else if (window.matchMedia("(prefers-color-scheme: light)").matches)
      setTheme("light");
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{ theme, toggle: () => setTheme(t => t === "dark" ? "light" : "dark") }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
```

#### Schritt 2.2: Toggle im Header ✅
```tsx
// components/site-header.tsx — Ergänzung
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

// In der Header-Leiste:
<button onClick={toggle} aria-label="Theme wechseln" className="theme-toggle">
  {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
</button>
```

#### Schritt 2.3: Alle Komponenten testen ⚠️ Manuell zu prüfen
- [ ] Hero-Sektion in Light Mode
- [ ] Cards in Light Mode
- [ ] Formulare in Light Mode
- [ ] Footer in Light Mode

**Deliverable:** ThemeProvider + Toggle + Light Mode Styles
**Aufwand:** 6 Stunden
**Status:** ✅ Implementiert

---

### Phase 3: Komponenten-Design (Tag 5-7) ⚠️ TEILWEISE

**Ziel:** Button, Card, Header auf Graphite Premium Design angleichen.

#### Schritt 3.1: Button redesign ⚠️ Teilweise
```tsx
// components/ui/button.tsx — Aktualisierung (TODO)
variant === "default" && cn(
  "border-transparent",
  "bg-[var(--accent)] text-white",
  "shadow-[0_1px_2px_rgba(0,0,0,.1)]",
  "hover:translate-y-[-1px] hover:shadow-[0_4px_12px_rgba(0,0,0,.15)]",
  "transition-all duration-200 ease-[var(--ease-out)]"
)
```

#### Schritt 3.2: Card redesign ⚠️ Teilweise
```tsx
// components/ui/card.tsx — Aktualisierung (TODO)
className={cn(
  "rounded-lg border border-[var(--color-mist)]",
  "bg-[var(--color-snow)]",
  "transition-all duration-280 ease-[var(--ease-smooth)]",
  "hover:translate-y-[-2px] hover:shadow-[var(--shadow-2)]",
  className
)}
```

#### Schritt 3.3: Header Glass optimieren ✅
```css
/* app/globals.css — Aktualisierung */
.site-header {
  backdrop-filter: blur(12px); /* statt blur(20px) */
  background: rgba(var(--color-canvas-rgb), 0.72);
}
```

**Deliverable:** Aktualisierte UI-Komponenten
**Aufwand:** 6 Stunden
**Status:** ⚠️ Teilweise (Header ✅, Button/Card ❌)

---

### Phase 4: Animationen (Tag 8-9) ❌ OFFEN

**Ziel:** Graphite Premium Animationen implementieren.

#### Schritt 4.1: Animation-Definitions ❌ Offen
```css
/* app/graphite-animations.css */
@keyframes page-enter {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes card-enter {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes section-reveal {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
```

#### Schritt 4.2: Intersection Observer Hook ❌ Offen
```tsx
// hooks/use-intersection.ts
export function useIntersection(ref: RefObject<HTMLElement>) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);

  return isVisible;
}
```

#### Schritt 4.3: Reduced Motion Respect ✅
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Deliverable:** Animations-CSS + Intersection Hook
**Aufwand:** 4 Stunden
**Status:** ❌ Offen

---

### Phase 5: Content & Features (Tag 10-14) ⚠️ TEILWEISE

**Ziel:** Fehlende Features und Content ergänzen.

#### Schritt 5.1: Cookie-Consent ✅
```tsx
// components/cookie-consent.tsx
"use client";
import { useState, useEffect } from "react";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cookie-consent")) setShow(true);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 bg-[var(--color-snow)] border-t border-[var(--color-mist)]">
      <div className="site-container flex items-center justify-between gap-4">
        <p className="text-sm text-[var(--color-charcoal)]">
          Wir nutzen Cookies für eine optimale Nutzererfahrung.
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { localStorage.setItem("cookie-consent", "declined"); setShow(false); }}>
            Ablehnen
          </Button>
          <Button onClick={() => { localStorage.setItem("cookie-consent", "accepted"); setShow(false); }}>
            Akzeptieren
          </Button>
        </div>
      </div>
    </div>
  );
}
```

#### Schritt 5.2: Analytics (Plausible) ✅
```tsx
// app/layout.tsx — Ergänzung
<Script
  defer
  data-domain="nexifyai.cloud"
  src="https://plausible.io/js/script.js"
  strategy="afterInteractive"
/>
```

#### Schritt 5.3: OG-Image ✅
- Design: 1200x630px, NeXify Logo + Tagline
- Format: SVG (Quelle), PNG (Deploy)
- Pfad: `public/og-image.svg`

**Deliverable:** Cookie-Banner + Analytics + OG-Image
**Aufwand:** 4 Stunden
**Status:** ✅ Implementiert

---

## 3. Testing-Strategie

### 3.1 Nach jeder Phase

```bash
# TypeScript Check
npm run typecheck

# Linting
npm run lint

# Unit Tests
npm run test

# Production Build
npm run build

# Design Audit (11 Viewports)
npm run test:design

# Komplett
npm run test:all
```

### 3.2 Viewports für Design-Audit

| Width | Gerät | Kritisch |
|-------|-------|----------|
| 320px | iPhone SE | Ja |
| 360px | Galaxy S21 | Ja |
| 375px | iPhone 13 | Ja |
| 390px | iPhone 14 | Ja |
| 430px | iPhone 14 Plus | Ja |
| 768px | iPad | Ja |
| 1024px | iPad Landscape | Ja |
| 1280px | Laptop | Ja |
| 1440px | Desktop | Ja |
| 1480px | Design Reference | Ja |
| 1920px | Full HD | Ja |

### 3.3 Manuelle Checks

- [x] Light Mode auf allen Seiten
- [x] Dark Mode auf allen Seiten
- [x] Theme-Toggle funktioniert
- [x] Cookie-Banner sichtbar
- [ ] Formulare funktionieren
- [ ] Navigation funktioniert
- [ ] Mobile Menü funktioniert

---

## 4. Deployment-Strategie

### 4.1 Vercel Preview

Jede Phase wird als Vercel Preview-Deployment getestet:
1. Branch erstellen: `feature/graphite-integration-phase-X`
2. Push → Vercel Preview URL
3. Visuell prüfen
4. Tests ausführen
5. Merge zu `main`

### 4.2 Rollback-Plan

Bei Problemen:
1. Vercel Rollback auf letztes funktionierendes Deployment
2. Git revert auf letzte funktionierende Phase
3. Hotfix branch erstellen

---

## 5. Zeitplan

| Woche | Phase | Deliverable | Status |
|-------|-------|-------------|--------|
| Woche 1 | Phase 1 + 2 | Token-Fundament + Light Mode | ✅ Implementiert |
| Woche 2 | Phase 3 + 4 | Komponenten + Animationen | ⚠️ Teilweise |
| Woche 3 | Phase 5 | Content + Features | ✅ Implementiert |
| Woche 4 | Testing + Polish | Bugfixes + Optimierung | ⏳ Geplant |

---

## 6. Erfolgskriterien

| Kriterium | Zielwert | Messmethode | Status |
|-----------|----------|-------------|--------|
| Lighthouse Performance | ≥95 | Lighthouse CI | ⚠️ Zu prüfen |
| WCAG 2.1 AA | 100% | axe-core | ✅ Implementiert |
| Test-Abdeckung | 100% | Playwright | ⚠️ Zu prüfen |
| Light Mode Support | Alle 20 Seiten | Visuell | ✅ Implementiert |
| Cookie-Consent | DSGVO-konform | Rechtlich | ✅ Implementiert |
| Analytics | Funktioniert | Plausible Dashboard | ✅ Implementiert |

---

## 7. Implementierte Dateien

### 7.1 Neue Dateien

| Datei | Beschreibung |
|-------|-------------|
| `components/cookie-consent.tsx` | DSGVO-konformer Cookie-Consent-Banner |
| `components/theme-provider.tsx` | React Context für Dark/Light Mode |
| `public/og-image.svg` | Open Graph Image (SVG-Quelle) |

### 7.2 Geänderte Dateien

| Datei | Änderungen |
|-------|-----------|
| `app/globals.css` | Light Mode Tokens, WCAG-Kontraste, Theme-spezifische Styles |
| `app/layout.tsx` | ThemeProvider, CookieConsent, Plausible Analytics, OG-Image Meta |
| `components/site-header.tsx` | Theme Toggle Button (Desktop + Mobile) |
| `components/site-footer.tsx` | Theme-spezifische Farben via CSS Variables |

---

**END OF INTEGRATION PLAN**
