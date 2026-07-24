# NeXify AI – Designsystem v1.0

**Status: VERBINDLICH.** Gilt ab sofort als fixe, generelle Vorgabe für **alle** UI-Elemente aller NeXifyAI-Frontend-Outputs – unabhängig vom jeweiligen Projekt (Website nexifyai.cloud, Hermes WebUI, Vercel-Preview- und Live-Projekte, sonstige KI-generierte UIs aus der Cowork/Laguna-Ausführungsstufe). Abweichungen nur mit expliziter Freigabe durch Pascal Courbois.

**Referenziert durch:** AUF-NXAI-ORDERFLOW-2026-001, Abschnitt 10.
**Quelle:** Von Pascal Courbois bereitgestellte Spezifikation, unverändert übernommen.

**Ästhetik:** Premium Dark/Silver · Glassmorphism · Monochrom mit Silber-Akzenten · „Chat it. Automate it."

---

## 1. Farbpalette (Design-Tokens)

| Token | Wert | Verwendung |
|---|---|---|
| `--bg` | `#09090b` | Haupthintergrund (Zinc-950) |
| `--bg-2` | `#0e0e11` | Sekundärflächen, Chat-Panel |
| `--panel` | `rgba(255,255,255,0.03)` | Glas-Karten Grundfläche |
| `--panel-2` | `rgba(255,255,255,0.05)` | Karten Hover-Zustand |
| `--line` | `rgba(255,255,255,0.08)` | Standard-Border |
| `--line-2` | `rgba(255,255,255,0.16)` | Border Hover/Fokus |
| `--silver` | `#d4d4d8` | Silber-Akzent (Zinc-300) |
| `--silver-2` | `#a1a1aa` | Sekundärtext, Eyebrows (Zinc-400) |
| `--muted` | `#8f8f98` | Gedämpfter Fließtext |
| `--white` | `#fafafa` | Primärtext (Zinc-50) |

**Gradienten:**
- Silber-Text: `linear-gradient(120deg, #fafafa 0%, #c8c8d0 30%, #71717a 50%, #e4e4e7 72%, #fafafa 100%)` (animiert, 8s Shimmer)
- Primär-Button: `linear-gradient(120deg, #e4e4e7, #ffffff 45%, #c4c4cc)` (Textfarbe darauf: `#09090b`)

## 2. Typografie

| Rolle | Font | Einsatz |
|---|---|---|
| Headings (h1–h4) | Outfit | Titel, Zahlen, Buttons |
| Body | Manrope | Fließtext, UI |

- H1: `text-4xl sm:text-5xl lg:text-6xl`, oft mit `.text-silver` (Shimmer-Gradient)
- Eyebrow/Overline: 11px, `letter-spacing: 0.28em`, UPPERCASE, `#a1a1aa`, mit 28px-Linie davor
- Body: `text-base` (mobil `text-sm`), Zeilenhöhe locker

## 3. Kernprinzipien

1. **Dunkel + Tiefe:** Solides `#09090b` + 2 dezente radiale Glows + SVG-Noise-Overlay (Opacity 0.04) – nie flach.
2. **Glassmorphism:** `blur(16–28px)`, hauchdünne weiße Borders, Radius 20–24px.
3. **Silber statt Farbe:** Keine bunten Akzente – Hierarchie über Helligkeit/Glow.
4. **Micro-Motion überall:** Hover-Lifts (`translateY(-2…-4px)`), Pulse-Rings, Orbits, Reveal-on-Scroll (`cubic-bezier(0.22,1,0.36,1)`).
5. **Pill-Buttons:** `border-radius: 999px`, Primär = Silber-Gradient mit Innenglanz, Ghost = transparente Border.
6. **Layout:** Container `min(1240px, 100% − 48px)`, großzügiger Weißraum (2–3×), asymmetrische Sektionen.

## 4. Komplettes CSS (verbindlich, Copy & Paste – keine kreative Abwandlung)

```css
:root {
  --bg: #09090b; --bg-2: #0e0e11;
  --panel: rgba(255,255,255,0.03); --panel-2: rgba(255,255,255,0.05);
  --line: rgba(255,255,255,0.08); --line-2: rgba(255,255,255,0.16);
  --silver: #d4d4d8; --silver-2: #a1a1aa; --muted: #8f8f98; --white: #fafafa;
  --font-heading: "Outfit", sans-serif; --font-body: "Manrope", sans-serif;
  --grad-silver: linear-gradient(120deg,#fafafa 0%,#c8c8d0 30%,#71717a 50%,#e4e4e7 72%,#fafafa 100%);
  --grad-btn: linear-gradient(120deg,#e4e4e7,#ffffff 45%,#c4c4cc);
}
html { scroll-behavior: smooth; background: var(--bg); }
body {
  margin: 0; min-height: 100vh; overflow-x: hidden; color: var(--white);
  background:
    radial-gradient(ellipse 70% 45% at 50% -8%, rgba(255,255,255,0.055), transparent),
    radial-gradient(ellipse 40% 35% at 88% 60%, rgba(200,200,215,0.03), transparent),
    var(--bg);
  font-family: var(--font-body); -webkit-font-smoothing: antialiased;
}
/* Noise-Overlay */
body::before {
  content: ""; position: fixed; inset: 0; z-index: 0; pointer-events: none; opacity: 0.5;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E");
}
::selection { background: rgba(212,212,216,0.3); color: #fff; }
h1,h2,h3,h4 { font-family: var(--font-heading); }
::-webkit-scrollbar { width: 10px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: #27272a; border-radius: 8px; border: 2px solid var(--bg); }

.site-container { width: min(1240px, calc(100% - 48px)); margin-inline: auto; }

/* Silber-Shimmer-Text */
.text-silver {
  background: var(--grad-silver); background-size: 200% auto;
  -webkit-background-clip: text; background-clip: text; color: transparent;
  animation: shimmer 8s linear infinite;
}
@keyframes shimmer { to { background-position: 200% center; } }

/* Eyebrow / Overline */
.eyebrow {
  display: inline-flex; align-items: center; gap: 10px;
  font-size: 11px; letter-spacing: 0.28em; text-transform: uppercase;
  color: var(--silver-2); font-weight: 600;
}
.eyebrow::before { content: ""; width: 28px; height: 1px; background: linear-gradient(90deg, transparent, #a1a1aa); }

/* Glas-Karten */
.glass {
  background: var(--panel); border: 1px solid var(--line); border-radius: 20px;
  backdrop-filter: blur(16px);
  transition: border-color .3s, transform .3s, background .3s, box-shadow .3s;
}
.glass:hover { border-color: var(--line-2); background: var(--panel-2); }
.glass-lift:hover { transform: translateY(-4px); box-shadow: 0 24px 60px rgba(0,0,0,0.45); }

/* Buttons */
.btn-primary {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  border: none; border-radius: 999px; padding: 14px 30px;
  background: var(--grad-btn); color: #09090b; font-weight: 700; font-size: 14px;
  cursor: pointer;
  box-shadow: 0 0 24px rgba(255,255,255,0.12), inset 0 1px 0 rgba(255,255,255,0.9);
  transition: transform .25s, box-shadow .25s;
}
.btn-primary:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 0 40px rgba(255,255,255,0.22), inset 0 1px 0 rgba(255,255,255,0.9); }
.btn-primary:active { transform: scale(0.98); }
.btn-ghost {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  border: 1px solid var(--line-2); border-radius: 999px; padding: 13px 28px;
  background: transparent; color: var(--white); font-weight: 600; font-size: 14px;
  cursor: pointer; transition: border-color .25s, background-color .25s, transform .25s;
}
.btn-ghost:hover { border-color: rgba(255,255,255,0.4); background-color: rgba(255,255,255,0.05); transform: translateY(-2px); }

/* Scroll-Reveal */
.reveal { opacity: 0; transform: translateY(28px); transition: opacity .8s cubic-bezier(.22,1,.36,1), transform .8s cubic-bezier(.22,1,.36,1); }
.reveal.in-view { opacity: 1; transform: none; }

/* Hero-Grid-Hintergrund */
.hero-grid-bg {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: radial-gradient(ellipse 75% 65% at 50% 30%, black 30%, transparent 75%);
  pointer-events: none;
}

/* Deko-Animationen */
.orbit-ring { animation: orbit 26s linear infinite; transform-origin: center; }
.orbit-ring-rev { animation: orbit 38s linear infinite reverse; transform-origin: center; }
@keyframes orbit { to { transform: rotate(360deg); } }
.pulse-dot { position: relative; }
.pulse-dot::after {
  content: ""; position: absolute; inset: -6px; border-radius: 999px;
  border: 1px solid rgba(228,228,231,0.5);
  animation: pulse-ring 2.4s cubic-bezier(.22,1,.36,1) infinite;
}
@keyframes pulse-ring { 0% { transform: scale(.8); opacity: 1; } 100% { transform: scale(1.9); opacity: 0; } }
@keyframes float-y { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
.float-chip { animation: float-y 6s ease-in-out infinite; }
@keyframes core-pulse { 0%,100% { filter: drop-shadow(0 0 18px rgba(255,255,255,.25)); } 50% { filter: drop-shadow(0 0 42px rgba(255,255,255,.5)); } }
.core-pulse { animation: core-pulse 4s ease-in-out infinite; }
@keyframes dash-flow { to { stroke-dashoffset: -240; } }
.dash-flow { stroke-dasharray: 6 10; animation: dash-flow 8s linear infinite; }
.marquee { display: flex; gap: 56px; width: max-content; animation: marquee 32s linear infinite; }
@keyframes marquee { to { transform: translateX(-50%); } }

/* Formulare */
input.field, textarea.field, select.field {
  width: 100%; border: 1px solid var(--line); border-radius: 14px;
  background: rgba(255,255,255,0.03); color: var(--white);
  padding: 13px 16px; font-size: 14px; outline: none;
  transition: border-color .25s, background .25s, box-shadow .25s;
}
input.field::placeholder, textarea.field::placeholder { color: #63636b; }
input.field:focus, textarea.field:focus, select.field:focus {
  border-color: rgba(255,255,255,0.35); background: rgba(255,255,255,0.05);
  box-shadow: 0 0 0 3px rgba(255,255,255,0.06);
}

/* Slider */
.range-silver { -webkit-appearance: none; appearance: none; width: 100%; height: 4px; border-radius: 999px; background: linear-gradient(90deg, #e4e4e7 var(--fill,50%), #27272a var(--fill,50%)); outline: none; }
.range-silver::-webkit-slider-thumb {
  -webkit-appearance: none; width: 20px; height: 20px; border-radius: 999px;
  background: linear-gradient(135deg,#fff,#b8b8c0); border: 1px solid rgba(255,255,255,0.6);
  box-shadow: 0 2px 12px rgba(0,0,0,0.6), 0 0 12px rgba(255,255,255,0.25);
  cursor: pointer; transition: transform .2s;
}
.range-silver::-webkit-slider-thumb:hover { transform: scale(1.15); }

/* Chat-Widget */
.chat-launcher {
  position: fixed; right: 24px; bottom: 24px; z-index: 60;
  width: 60px; height: 60px; border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.25);
  background: linear-gradient(135deg,#1c1c20,#101013);
  display: flex; align-items: center; justify-content: center; cursor: pointer;
  box-shadow: 0 8px 40px rgba(0,0,0,0.6), 0 0 24px rgba(255,255,255,0.08);
  transition: transform .25s, box-shadow .25s;
}
.chat-launcher:hover { transform: scale(1.08); }
.chat-panel {
  position: fixed; right: 24px; bottom: 96px; z-index: 60;
  width: min(400px, calc(100vw - 32px)); height: min(600px, calc(100vh - 130px));
  display: flex; flex-direction: column; border-radius: 24px;
  border: 1px solid rgba(255,255,255,0.14);
  background: rgba(14,14,17,0.92); backdrop-filter: blur(28px);
  box-shadow: 0 32px 80px rgba(0,0,0,0.7); overflow: hidden;
  animation: chat-in .35s cubic-bezier(.22,1,.36,1);
}
@keyframes chat-in { from { opacity: 0; transform: translateY(20px) scale(.96); } to { opacity: 1; transform: none; } }
.typing-dot { width: 6px; height: 6px; border-radius: 999px; background: #a1a1aa; animation: typing 1.2s infinite; }
.typing-dot:nth-child(2) { animation-delay: .15s; }
.typing-dot:nth-child(3) { animation-delay: .3s; }
@keyframes typing { 0%,60%,100% { opacity: .25; transform: translateY(0); } 30% { opacity: 1; transform: translateY(-3px); } }

/* Responsive */
@media (max-width: 640px) {
  .site-container { width: calc(100% - 32px); }
  .chat-panel { right: 16px; }
  .chat-launcher { right: 16px; bottom: 16px; }
}
```

## 5. Verwendungs-Cheatsheet

- **Sektion:** `.site-container` + `.eyebrow` (Overline) → H2 mit `.text-silver` auf Schlüsselwort → `--muted` Fließtext
- **Karte:** `.glass .glass-lift` + `p-6…p-8`
- **CTA-Paar:** `.btn-primary` (Silber) + `.btn-ghost` daneben
- **Einblendungen:** `.reveal` + `IntersectionObserver` setzt `.in-view` (gestaffelt via `transition-delay`)
- **Fonts laden:** Outfit (600/700/800) + Manrope (400/500/600/700), z. B. via `next/font/google`

---

## 6. Bindungsklausel für den Order-Flow (AUF-NXAI-ORDERFLOW-2026-001)

Jede von Cowork/Laguna M.1 generierte UI (Vercel-Preview, Live-Projekt) muss dieses Designsystem **verlustfrei** anwenden:

- Design-Tokens exakt übernehmen (keine abweichenden Farbwerte, kein Ersatz durch generische Tailwind-Defaults)
- Fonts Outfit + Manrope zwingend geladen
- Pill-Button-, Glass-Card- und Eyebrow-Klassen wie oben definiert
- Konformitätsprüfung ist fester Bestandteil des PRÜFVERFAHRENS in AUF-NXAI-ORDERFLOW-2026-001 (siehe dort, Punkt 8.9)

---

## 7. Zentraler Verweis (diese Datei)

**Canonical Source of Truth:** `docs/design/DESIGNSYSTEM-v1.0.md`

Alle Projekte im Monorepo (Website, Hermes, Portal, Vercel-Previews, KI-generierte UIs) MÜSSEN:
1. Diese Datei als Referenz einbinden (Symlink/Kopie der CSS-Tokens)
2. Die CSS-Variablen aus Abschnitt 4 wörtlich übernehmen
3. Outfit + Manrope Fonts laden
4. Bei Abweichung: `docs/design/DESIGNSYSTEM-v1.0.md` als Single Source of Truth konsultieren
