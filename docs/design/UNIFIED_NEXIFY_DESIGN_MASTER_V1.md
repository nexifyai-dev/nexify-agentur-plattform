# ═══════════════════════════════════════════════════════════════
# NEⅪFY AI — UNIFIED DESIGN MASTER V1
# Perfektes Gesamtkonzept · 2026-06-20
# ═══════════════════════════════════════════════════════════════

> **Konsolidiert von:** Hermes Agent (vps-admin) — Langlauf Run 2
> **Designer:** Rekonstruiert + vereint aus 5 fragmentierten Systemen
> **Experten:** UI-Architektur · Marketing/Brand · Design-System
> **Status:** 🟢 Kanonisch — ersetzt alle Vorgänger

---

## INHALTSVERZEICHNIS

1. [Design-Philosophie & Brand DNA](#1-design-philosophie--brand-dna)
2. [Unified Token System](#2-unified-token-system)
3. [Typografie-System](#3-typografie-system)
4. [Tiefenstaffelung & Licht/Schatten](#4-tiefenstaffelung--lichtschatten)
5. [Atomic Component Hierarchy](#5-atomic-component-hierarchy)
6. [Marketing-Surface (Website)](#6-marketing-surface-website)
7. [Admin/Workstation Surface](#7-adminworkstation-surface)
8. [PDFs, Angebote, E-Mails](#8-pdfs-angebote-e-mails)
9. [Micro-Interactions & Motion](#9-micro-interactions--motion)
10. [Barrierearmut & Accessibility](#10-barrierearmut--accessibility)
11. [Brand & Tone-of-Voice](#11-brand--tone-of-voice)
12. [Customer Journey Map](#12-customer-journey-map)
13. [Implementierungs-Pfad](#13-implementierungs-pfad)
14. [Komponenten-Inventar (90+)](#14-komponenten-inventar-90)

---

# 1. DESIGN-PHILOSOPHIE & BRAND DNA

## 1.1 Die Essenz

**NeXify AI ist keine Startup-Marke.** NeXify ist eine **Präzisionswerkbank** für KI-Automatisierung — entwickelt für Entscheider, nicht für Early Adopter.

```
┌────────────────────────────────────────────────────┐
│  NEⅪFY = Präzision · Souveränität · Substanz      │
│                                                     │
│  „Chat it. Automate it." — Kein Versprechen,        │
│   sondern Ergebnis.                                  │
└────────────────────────────────────────────────────┘
```

## 1.2 Design-Prinzipien (10 Gebote)

| # | Prinzip | Bedeutung | Verbot |
|---|---------|-----------|--------|
| 1 | **Licht & Schatten** | Echte Tiefe durch physikalisch korrekte Beleuchtung (45° von links-oben) | Flache Shadows, unechte Glows |
| 2 | **Reduktion aufs Wesentliche** | Jedes Element hat eine Funktion. Wenn nicht → entfernen. | Dekoration ohne Zweck |
| 3 | **Hierarchie durch Tiefe** | Wichtiger = höher. Cards schweben über Surfaces, Modals über Cards. | Alles gleich flach |
| 4 | **Kontrollierte Akzente** | Eine Farbe für Aktion. Keine Regenbogen-Buttons. | Gradienten, Farb-Chaos |
| 5 | **Substanz vor Effekt** | Gute Typografie + Layout > Glassmorphismus | Effekte als Krücke |
| 6 | **WCAG AA ist Minimum** | AAA für primäre Text/Fokus-Paare. Niemand ausschließen. | Grau-auf-Grau |
| 7 | **Dark-First für Tools** | Workstation/Admin: Dark Mode Standard. Website: Light Standard. | Dark-Only für Website |
| 8 | **System-Schrift priorisiert** | Inter für UI, System-Font als Fallback. Keine Schrift-Lade-Blockade. | Webfont-Bloat |
| 9 | **Konsistent > Clever** | Gleiche Komponente = gleiches Aussehen. Keine One-Off-Designs. | Jede Seite neu erfunden |
| 10 | **Deutsch & Direkt** | Deutsche UX-Kultur: klar, effizient, kein Bullshit. | Anglizismen, Marketing-Sprech |

## 1.3 Visuelle Referenzen

| Inspiration | Was übernommen wird | Was NICHT |
|-------------|---------------------|-----------|
| **Linear** | Saubere Typografie, reduzierte UI, Status-Farben | Farben, Button-Styles |
| **Stripe** | Vertrauens-Design, Pricing Cards, Dashboard | Blau-Dominanz |
| **Arc Browser** | Premium-Fenster, Command-Bar, Sidebar-UI | Mac-only Look |
| **Apple** | Material-Qualität, Mikro-Animationen, Präzision | Minimalismus um jeden Preis |
| **shadcn/ui** | Token-Struktur, Komponenten-API, Varianten | Farbsystem |

---

# 2. UNIFIED TOKEN SYSTEM

## 2.1 Kernentscheidung: Graphite Premium erbt NeXify V2

Nach Analyse aller 5 Systeme → **Entscheidung:**

> **Basis:** NeXify V2 (Deep Navy Foundation)  
> **Premium-Effekte:** Übernahme aus GRAPHITE PREMIUM CSS (6 Depth Layers, Button Illusions, Glass)  
> **Verworfen:** Graphite v1 (zu neutral, keine Brand-Identität), Grün-Accent (wirkt nicht technisch), Purple-Accent (zu modisch)

### 2.2 Color Palette — Unified

```css
:root, [data-theme="nexify"] {
  /* ── BACKGROUNDS (7 Ebenen) ── */
  --nx-bg:           #FFFFFF;     /* hellster Grund */
  --nx-sidebar:      #F1F5F9;     /* Sidebar/Shell */
  --nx-surface:      #FFFFFF;     /* Card/Content */
  --nx-surface-2:    #F8FAFC;     /* abgesetzt */
  --nx-surface-hover:#F1F5F9;     /* Hover */
  --nx-topbar-bg:    rgba(255,255,255,0.92);  /* Glass-Topbar */
  --nx-input-bg:     #FFFFFF;
  --nx-code-bg:      #F1F5F9;

  /* ── BORDERS ── */
  --nx-border:       #E2E8F0;     /* slate-200 */
  --nx-border-2:     #CBD5E1;     /* slate-300 */
  --nx-border-subtle:#F1F5F9;     /* slate-100 */

  /* ── TEXT ── */
  --nx-text:         #0F172A;     /* slate-900 */
  --nx-text-strong:  #020617;     /* slate-950 */
  --nx-text-muted:   #64748B;     /* slate-500 */
  --nx-text-em:      #334155;     /* slate-700 */
  --nx-code-text:    #0F172A;

  /* ── PRIMARY: Deep Navy ── */
  --nx-primary:         #0F172A;     /* slate-900 */
  --nx-primary-hover:   #1E293B;     /* slate-800 */
  --nx-primary-text:    #FFFFFF;
  --nx-primary-bg:      rgba(15,23,42,0.08);
  --nx-primary-bg-strong: rgba(15,23,42,0.15);

  /* ── ACCENT: NeXify Blue ── */
  --nx-accent:          #2563EB;     /* blue-600 */
  --nx-accent-hover:    #1D4ED8;     /* blue-700 */
  --nx-accent-text:     #FFFFFF;
  --nx-accent-bg:       rgba(37,99,235,0.10);
  --nx-accent-bg-strong:rgba(37,99,235,0.18);

  /* ── SECONDARY: Teal (Erfolg, Bestätigung) ── */
  --nx-teal:            #0D9488;     /* teal-600 */
  --nx-teal-hover:      #0F766E;     /* teal-700 */
  --nx-teal-text:       #FFFFFF;

  /* ── SEMANTIC ── */
  --nx-success:   #059669;     /* emerald-600 */
  --nx-warning:   #D97706;     /* amber-600 */
  --nx-error:     #DC2626;     /* red-600 */
  --nx-info:      #2563EB;     /* blue-600 */
  --nx-gold:      #D97706;     /* amber — Auszeichnungen */
}

:root.dark, [data-theme="nexify-dark"] {
  /* ── BACKGROUND (8 Ebenen Tiefe) ── */
  --nx-bg:           #0A0D14;     /* deep navy-black */
  --nx-sidebar:      #0E1118;
  --nx-surface:      #131720;
  --nx-surface-2:    #181D28;
  --nx-surface-hover:#1C2230;
  --nx-topbar-bg:    rgba(10,13,20,0.88);  /* Glass */
  --nx-input-bg:     #131720;
  --nx-code-bg:      #1C2230;

  /* ── BORDERS ── */
  --nx-border:       #1E2536;
  --nx-border-2:     #2A3348;
  --nx-border-subtle:#161C28;

  /* ── TEXT ── */
  --nx-text:         #E8EDF5;
  --nx-text-strong:  #FFFFFF;
  --nx-text-muted:   #7B8799;
  --nx-text-em:      #A0AEC0;
  --nx-code-text:    #E8EDF5;

  /* ── PRIMARY: Deep Navy on Dark ── */
  --nx-primary:         #1E293B;
  --nx-primary-hover:   #334155;
  --nx-primary-text:    #E8EDF5;
  --nx-primary-bg:      rgba(255,255,255,0.06);
  --nx-primary-bg-strong: rgba(255,255,255,0.10);

  /* ── ACCENT ── */
  --nx-accent:          #3B82F6;     /* blue-500 (heller für Dark) */
  --nx-accent-hover:    #60A5FA;     /* blue-400 */
  --nx-accent-text:     #FFFFFF;
  --nx-accent-bg:       rgba(59,130,246,0.12);
  --nx-accent-bg-strong:rgba(59,130,246,0.20);
}
```

## 2.2 Spacing & Sizing

```css
/* Space — 4er-Raster */
--nx-space-1:  4px;   /* 0.25rem — Icons, Chips */
--nx-space-2:  8px;   /* 0.5rem  — Input-Innen */
--nx-space-3:  12px;  /* 0.75rem — Button-Innen */
--nx-space-4:  16px;  /* 1rem    — Standard */
--nx-space-6:  24px;  /* 1.5rem  — Sections */
--nx-space-8:  32px;  /* 2rem    — Page-Sections */
--nx-space-12: 48px;  /* 3rem    — Hero/Features */
--nx-space-16: 64px;  /* 4rem    — Page-Top */

/* Radius */
--nx-radius-sm:   4px;   /* Inputs, kleine Komponenten */
--nx-radius-md:   8px;   /* Cards, Modal, Dropdown */
--nx-radius-lg:   12px;  /* Dialoge, große Cards */
--nx-radius-xl:   16px;  /* Hero-Sektionen */
--nx-radius-full: 9999px; /* Badges, Avatare */
```

---

# 3. TYPOGRAFIE-SYSTEM

## 3.1 Font-Stack

```
Primary:  Inter (Variable, wght 300-700)
Fallback: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
Mono:     JetBrains Mono / SF Mono / Menlo / Consolas / monospace
```

## 3.2 Size Scale

```css
--nx-text-xs:   0.75rem;   /* 12px — Captions, Metadaten */
--nx-text-sm:   0.875rem;  /* 14px — UI-Labels, secundär */
--nx-text-base: 1rem;      /* 16px — Body (Standardgewicht 400) */
--nx-text-lg:   1.125rem;  /* 18px — Large Body */
--nx-text-xl:   1.25rem;   /* 20px — Subheadline */
--nx-text-2xl:  1.5rem;    /* 24px — H4 */
--nx-text-3xl:  1.875rem;  /* 30px — H3 */
--nx-text-4xl:  2.25rem;   /* 36px — H2 */
--nx-text-5xl:  3rem;      /* 48px — H1 */
--nx-text-6xl:  3.75rem;   /* 60px — Hero (Website) */
--nx-text-7xl:  4.5rem;    /* 72px — Hero groß (selten) */
```

## 3.3 Weight Mapping

| Token | Weight | Verwendung |
|-------|--------|------------|
| `regular` | 400 | Body, Labels, Input-Werte |
| `medium` | 500 | Buttons, Nav-Items, H4 |
| `semibold` | 600 | H2, H3, Card-Titel |
| `bold` | 700 | H1, Hero, KPI-Werte |

---

# 4. TIEFENSTAFFELUNG & LICHT/SCHATTEN

## 4.1 Die 6 Depth Layers

Das Herz des Premium-Designs. Lichtquelle: **45° von links-oben**.

```
Layer 0 — Surface (flach)
  └─ kein Schatten, nur 1px border-subtle
  └─ Bg, Sidebar, Inputs
     
Layer 1 — Cards, Panels (leicht erhaben)
  ├─ shadow: 0 1px 2px rgba(0,0,0,0.04)
  └─ Hover: translateY(-1px) + shadow Verstärkung

Layer 2 — Karten, Dropdowns (schwebt)
  ├─ shadow: 0 4px 12px rgba(0,0,0,0.06)
  └─ Hover: translateY(-2px)

Layer 3 — Modals, Popovers (deutlich schwebend)
  ├─ shadow: 0 12px 32px rgba(0,0,0,0.08)
  └─ z-index: 50

Layer 4 — Tooltips, Toasts (hoch)
  ├─ shadow: 0 24px 64px rgba(0,0,0,0.10)
  └─ z-index: 100

Layer 5 — Modals/Overlays (maximal)
  ├─ shadow: 0 32px 80px rgba(0,0,0,0.12)
  └─ z-index: 200
```

## 4.2 Embossing (Light-Mode Qualität)

```css
.card {
  box-shadow: var(--depth-1-shadow), inset 0 1px 0 rgba(255,255,255,0.6);
  /* emboss-inner hellt die Card-Kante auf → wirkt physisch */
}
```

## 4.3 Button Illusions (4 Zustände)

```css
.btn-primary {
  /* Default: flach mit leichter Erhebung */
  box-shadow: 0 1px 2px rgba(0,0,0,0.06),
              inset 0 1px 0 rgba(255,255,255,0.12);
  transform: none;
}
.btn-primary:hover {
  /* Hover: schwebt leicht */
  transform: translateY(-1px) scale(1.02);
  box-shadow: 0 4px 12px rgba(0,0,0,0.10),
              0 1px 3px rgba(0,0,0,0.04);
}
.btn-primary:active {
  /* Active: gedrückt */
  transform: translateY(0) scale(0.98);
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.15);
}
.btn-primary:disabled {
  /* Disabled: keine Tiefe, nur outline */
  opacity: 0.4;
  transform: none;
  box-shadow: none;
}
```

## 4.4 Glassmorphismus (gezielt, nicht Standard)

Nur für:
- **Topbar** (light: `rgba(255,255,255,0.92)` dark: `rgba(10,13,20,0.88)`)
- **Composer/Input** (Chat-Eingabe, Command-Bar)
- **Overlay-Sheets** (Mobile Navigation)

```css
.glass {
  background: rgba(255,255,255,0.60);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.80);
}
```

---

# 5. ATOMIC COMPONENT HIERARCHY

> **Vollständiges Inventar:** 110+ Komponenten  
> **Detail:** `/workspace/nexify/07_ui_ci/NEXIFY_COMPONENT_MAP_V1.md`

```
ATOMS (23)
├── Button (6 Varianten: primary, secondary, ghost, danger, outline, link)
│   └── Sizes: sm, md, lg | States: hover, active, disabled, loading
├── Input, Select, Checkbox, Radio, Toggle, Textarea
├── Badge (info, success, warning, error, neutral)
├── StatusDot (online, offline, busy, away, error)
├── Spinner (3 sizes), Skeleton (4 variants)
├── Icon (24px baseline), Avatar (4 sizes), Tooltip
├── Separator, ProgressBar, Tag, Chip
└── Switch, Slider, Stepper (quantity)

MOLECULES (42)
├── FormField (label + input + error + hint)
├── Card (5 variants: default, interactive, elevated, bordered, ghost)
├── StatCard (icon + value + label + trend)
├── Alert (4 types: info, success, warning, error)
├── Modal (size: sm/md/lg/full | 3 header variants)
├── DropdownMenu, SelectMenu, ContextMenu
├── Tabs (line, pill, underline), Accordion, Stepper
├── Pagination, Breadcrumb, Table (sortable, selectable)
├── Toast (4 types, 2 positions: top-right, bottom-center)
├── ChatMessage (user + assistant + system + error)
├── KPIValue (label + value + change + sparkline)
├── IntegrationBadge, StatusCard, MetricRow
└── EmptyState, ErrorState, LoadingState, SuccessState

ORGANISMS (35)
├── AppShell (sidebar + topbar + content)
├── Sidebar (nav + user + workspace + status)
├── Topbar (search + breadcrumb + actions + userMenu)
├── ChatPanel (messages + composer + header)
├── KanbanBoard (columns + cards + drag)
├── Dashboard (widget-grid + kpi-row + charts)
├── NotificationCenter (list + filters + actions)
├── CommandPalette (search + categories + shortcuts)
├── OnboardingFlow (steps + progress + skip)
├── AgentConfigPanel (settings + tools + model + memory)
├── WorkflowBuilder (nodes + edges + properties)
├── PricingTable (3-4 tiers + feature-list + CTA)
├── FeatureCardGrid, TestimonialCarousel, FAQList
├── IntegrationList (connected + available + search)
├── Footer (links + social + legal + newsletter)
├── Navigation (desktop + mobile + hamburger)
└── HeroSection (headline + sub + cta + visual + stats)

TEMPLATES (10)
├── WorkstationLayout
├── MarketingLayout (hero + features + pricing + faq + footer)
├── OfferLayout (header + scope + pricing + signature)
├── InvoiceLayout (header + items + totals + footer)
├── EmailLayout (header + body + signature + footer)
├── PDFLayout (cover + toc + content + appendix)
├── LoginLayout (form + social + divider + help)
├── SettingsLayout (sidebar-nav + sections)
├── DashboardLayout (sidebar + kpi + widgets + recent)
└── ErrorLayout (code + message + action + home-link)

PAGES (20+)
├── Website: Landing, Pricing, Features, About, Contact, Blog, Docs, Legal
├── Workstation: Chat, Dashboard, Kanban, Agents, Workflows, Settings, Integrations, Analytics
├── Admin: Users, Billing, Logs, Audit, Templates, Branding
└── Auth: Login, Register, Onboarding, PasswordReset
```

---

# 6. MARKETING-SURFACE (WEBSITE)

## 6.1 Eigenschaften

```
Theme:     Light Mode (hell, professionell, vertrauensvoll)
Bg:        #FFFFFF
Accent:    #2563EB (NeXify Blue)
Hero:      Deep Navy (#0F172A) Full-Width
Font:      Inter (40px/72px Headlines)
Stil:      Stripe-inspiriert: viel Whitespace, große Headlines, KPI-Stats
Responsive: Mobile-First, bis 320px
```

## 6.2 Hero-Sektion

```
┌──────────────────────────────────────────────────────────────┐
│  ████████████████████████████████████████████████████████████  │
│  ██  [Logo]           Nav1 Nav2 Nav3 Nav4  [CTA Demo]    ██  │
│  ██                                                        ██  │
│  ██  KI-Automatisierung,                                  ██  │
│  ██  die Ihr Unternehmen                                  ██  │
│  ██  wirklich versteht.                                   ██  │
│  ██                                                        ██  │
│  ██  [Starte jetzt] [Demo ansehen]                        ██  │
│  ██                                                        ██  │
│  ██  ⭐⭐⭐⭐⭐ 4.9/5 — 200+ Unternehmen vertrauen           ██  │
│  ██  ┌──────────────────────────────────────────────────┐  ██  │
│  ██  │  [Visuell: Dashboard-Preview/Architektur-3D]     │  ██  │
│  ██  └──────────────────────────────────────────────────┘  ██  │
│  ████████████████████████████████████████████████████████████  │
└──────────────────────────────────────────────────────────────┘
```

## 6.3 KPI-Stats (Stripe-Stil)

```
─── 10.000+ ─── ─── 99,9% ─── ─── 4.9/5 ─── ─── 30 min ───
   Automatisierungen  Uptime       Bewertung    Time-to-Value
```

---

# 7. ADMIN/WORKSTATION SURFACE

## 7.1 Eigenschaften

```
Theme:     Dark Mode (Deep Navy-Black, produktiv)
Bg:        #0A0D14 (kein reines Schwarz — angenehmer für lange Sessions)
Sidebar:   #0E1118
Surfaces:  #131720 → #181D28 (gestaffelt)
Accent:    #3B82F6 (helleres Blau für Dark Mode)
Font:      Inter (14-24px, 400/500/600)
Stil:      Linear-inspiriert: reduziert, fokussiert, schnell
```

## 7.2 App Shell

```
┌─────────────────────────────────────────────────────────────────┐
│ [≡] [Suche...]                              [Status] [User ▼]  │
├──────┬──────────────────────────────────────────────────────────┤
│      │                                                          │
│ Nav  │           CONTENT AREA                                   │
│      │                                                          │
│ Chat │  ┌──────────────────────────────────────────────────┐    │
│ Dash │  │  Widget Grid (2×2, 3×2, 4×2)                    │    │
│ WFs  │  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐           │    │
│ Sets │  │  │ KPI  │ │ KPI  │ │ KPI  │ │ KPI  │           │    │
│      │  │  └──────┘ └──────┘ └──────┘ └──────┘           │    │
│ Ints │  │  ┌──────────────────────────────────────┐      │    │
│      │  │  │ Chart / Activity Feed                 │      │    │
│      │  │  └──────────────────────────────────────┘      │    │
│      │  └──────────────────────────────────────────────────┘    │
│      │                                                          │
└──────┴──────────────────────────────────────────────────────────┘
```

---

# 8. PDFs, ANGEBOTE, E-MAILS

## 8.1 Angebote (B2B-Quote Documents)

```
─────────────────────────────────────────────────────
NEⅪFY AI                        Angebots-Nr: 2026-001
Chat it. Automate it.           Datum: 20.06.2026
─────────────────────────────────────────────────────

AN: Firma GmbH, z.Hd. Max Mustermann

SEHR GEEHRTER HERR MUSTERMANN,

Sie möchten Ihre Kundenkommunikation automatisieren.
Wir liefern die Lösung.

LEISTUNGSÜBERSICHT
─────────────────────────────────────────────────────
  KI-Chatbot Integration           einmalig    12.900 €
  Workflow-Automation (3 Flows)    monatlich    2.400 €
  Hosting & Wartung                monatlich      490 €
  ─────────────────────────────────────────────────
  Einrichtungssumme                            12.900 €
  Monatlich                                    2.890 €

LIEFERUMFANG
─────────────────────────────────────────────────────
• 5 KI-Assistenten auf Ihrer Website
• WhatsApp + Telegram Anbindung
• CRM-Synchronisation (Ihre Wunsch-Schnittstelle)
• Schulung (2h Remote, inkl. Aufzeichnung)
• 30 Tage kostenfreier Testbetrieb

INFORMATIONEN ZUR AUTOMATISIERUNG
─────────────────────────────────────────────────────
Wir verwenden ausschließlich deutsche/holländische
Rechenzentren (ISO 27001). Daten verlassen nie die EU.

MIT FREUNDLICHEN GRÜSSEN,
NeXify AI — [Name]
```

## 8.2 E-Mail Signature

```
Mit freundlichen Grüßen

───
Max Mustermann · Senior AI Consultant
NEⅪFY AI — Chat it. Automate it.
max@nexifyai.cloud · +49 151 1234567
www.nexifyai.cloud
```

---

# 9. MICRO-INTERACTIONS & MOTION

## 9.1 Timing & Easings

```css
--nx-ease-out:     cubic-bezier(.33,1,.68,1);     /* Standard-Exit */
--nx-ease-spring:  cubic-bezier(.16,1,.3,1);       /* Buttons, Cards */
--nx-ease-bounce:  cubic-bezier(.34,1.56,.64,1);   /* Badges, Notifications */
--nx-ease-smooth:  cubic-bezier(.4,0,.2,1);        /* Modals, Transitions */
```

## 9.2 Duration by Element

| Element | Default | Reduce Motion |
|---------|---------|---------------|
| Button Hover | 150ms | 0ms |
| Card Hover | 250ms | 0ms |
| Modal Enter/Exit | 300ms | 150ms |
| Page Transition | 400ms | 200ms |
| Notification | 300ms slide + 3s visible | sofort |
| Skeleton Pulse | 1.5s cycle | keine Animation |

## 9.3 Key Interactions

```
Button:       hover→translateY(-1px) scale(1.02) [150ms spring]
              active→translateY(0) scale(0.98)
Card:         hover→translateY(-2px) shadow→depth-2 [250ms smooth]
Sidebar Item: active→subtle glow left border + bg-strong
Composer:     focus→border accent + glow-ring
Modal:        backdrop fade (150ms) + content scale(0.95→1.0) [300ms]
Toast:        slide-in-right (300ms) → visible 3s → slide-out (200ms)
```

---

# 10. BARRIEREARMUT & ACCESSIBILITY

## 10.1 Standards

```
WCAG-Stufe:  AA (Minimum für alle Text/Bg-Paare)
             AAA (primäre Text/Fokus-Komponenten)
Tastatur:    Vollständig per Tastatur bedienbar (Tab-Reihenfolge)
Focus:       Sichtbarer Fokus-Ring (2px offset, accent)
Screenreader: ARIA-Labels auf allen interaktiven Elementen
Motion:      prefers-reduced-motion respektiert
Kontrast:    Alle Paare via contrast-grid verifiziert
```

## 10.2 Focus Ring

```css
:focus-visible {
  outline: 2px solid var(--nx-accent);
  outline-offset: 2px;
  border-radius: var(--nx-radius-sm);
}
```

---

# 11. BRAND & TONE-OF-VOICE

## 11.1 Brand Archetype

> **Magier + Herrscher** — Wir erschaffen die Zukunft (Magier), mit Souveränität und Kontrolle (Herrscher). Nicht der laute Startup-Magier, sondern der ruhige, kompetente Experte.

## 11.2 Tone-of-Voice Prinzipien

| Prinzip | Bedeutung |
|---------|-----------|
| **Klar & Präzise** | Kurze Sätze. Kein Füllwort. Komma wie Skalpell. |
| **Vertrauensvoll & Bescheiden** | Wir zeigen, nicht behaupten. Ergebnisse sprechen. |
| **Deutsch & Direkt** | Deutsche Geschäftssprache. Kein Denglisch. |
| **Technisch Fundiert** | Fachbegriffe verwenden, aber erklären. |
| **Ergebnisorientiert** | Nicht "KI ist toll", sondern "30% mehr Conversions". |

## 11.3 Word Choices

```
✅ VERWENDEN:
  Automatisierung · Workflow · Integration · Skalierung
  Effizienz · Präzision · Sicherheit · DSGVO-konform
  KI-Assistent · Chat-Bot · Agentic Workflow
  Chat it. Automate it.

❌ VERMEIDEN:
  Revolution · disruptiv · game-changer · next-gen
  innovativ (wenn nicht belegt) · hübsch · fancy
  Startup · Unicorn · Growth-Hacking
  Künstliche Intelligenz (sag "KI")
```

## 11.4 Persona Matrix

| Rolle | Pain | NeXify Answer |
|-------|------|---------------|
| **Dr. Marcus Brenner**, CTO (47) | 20 Anfragen/Tag manuell beantwortet | 5 KI-Assistenten übernehmen 80% |
| **Sabine Wieland**, CEO (54) | Mitarbeiter in Routinen gefangen | Workflows automatisieren Abläufe |
| **Julia Chen**, Head of Digital (38) | 5 Tools, keine Integration | Einheitliche Automatisierungs-Plattform |

---

# 12. CUSTOMER JOURNEY MAP

```
PHASE 1: AWARENESS
├── Touchpoints: Google-Suche, LinkedIn, Empfehlung, Blog-Beitrag
├── Kundengefühlt: „Schon wieder ein KI-Tool?"
├── NeXify Antwort: Fachartikel, Case Studies, KPI-Statistiken
└── Design: Hero-Section, KPI-Stats, Trust-Signale

PHASE 2: CONSIDERATION
├── Touchpoints: Website, Docs, Feature-Vergleich, Preis-Seite
├── Kundengefühlt: „Was genau kann das?"
├── NeXify Antwort: Klare Feature-Cards, Pricing-Tabelle, Demo-Buchung
└── Design: Feature-Grid, Vergleichstabelle, CTA-Konsistenz

PHASE 3: DECISION
├── Touchpoints: Demo-Gespräch, Angebot, Test-Zugang
├── Kundengefühlt: „Funktioniert das bei uns?"
├── NeXify Antwort: Maßgeschneidertes Angebot, 30-Tage-Test
└── Design: Angebot-PDF, Onboarding-UI, Status-Tracking

PHASE 4: ONBOARDING
├── Touchpoints: Willkommens-Mail, Setup-Wizard, Chat-Support
├── Kundengefühlt: „Hoffentlich einfach einzurichten."
├── NeXify Antwort: Geführter Onboarding-Flow, 2h Schulung
└── Design: Progress-Stepper, Tooltips, Empty States mit Anleitung

PHASE 5: IMPLEMENTATION
├── Touchpoints: Workstation, Integrationen, API-Docs
├── Kundengefühlt: „Läuft. Aber ich will mehr."
├── NeXify Antwort: Dashboard, Analytics, Expansion-Optionen
└── Design: Dashboard, Widget-Grid, Integration-Catalog

PHASE 6: LIVE & OPTIMIZE
├── Touchpoints: Monats-Report, Analytics, Upsell
├── Kundengefühlt: „Was hat's gebracht?"
├── NeXify Antwort: KPI-Reports, Automatisierungs-Statistiken
└── Design: Analytics-Dashboard, PDF-Reports, E-Mail Zusammenfassung
```

---

# 13. IMPLEMENTIERUNGS-PFAD

## Phase 1 (Sofort) — Token Foundation
```
1. CSS Custom Properties in :root definieren (Token-System)
2. Tailwind Preset bauen (extends theme)
3. Globals.css schreiben (Tokens + Base-Styles)
4. Dark Mode via class-Strategie
```

## Phase 2 (Diese Woche) — Atom-Komponenten
```
5. Button (6 Varianten, 4 States)
6. Input, Select, Badge, Avatar
7. Card (5 Varianten)
8. Modal, Dropdown, Toast
```

## Phase 3 (Nächste Woche) — Organisms
```
9. App Shell (Sidebar + Topbar + Content)
10. Sidebar Navigation + User Menu
11. Chat Panel + Composer
12. Dashboard Widget Grid + KPI Cards
```

## Phase 4 (Design Review) — Marketing Surface
```
13. Hero Section + Navigation
14. Feature Card Grid + Pricing Table
15. Footer + Trust Section
16. Responsive Breakpoints testen
```

## Phase 5 — PDFs & E-Mails
```
17. Angebot-Layout (HTML → PDF)
18. E-Mail Signature + Templates
19. Invoice Layout
```

---

# 14. KOMPONENTEN-INVENTAR (90+)

> Vollständige Component Map:  
> 📄 `/workspace/nexify/07_ui_ci/NEXIFY_COMPONENT_MAP_V1.md`  
> (400+ Zeilen, Atomic Design Hierarchie mit Varianten, Props, States)

### Quick-Reference

```
Atoms:     23  (Button, Input, Badge, Avatar, Spinner, Skeleton, Icon, Tag, Chip, ...)
Molecules: 42  (Card, Modal, Alert, Dropdown, Tabs, Table, Toast, ChatMessage, ...)
Organisms: 35  (AppShell, Sidebar, ChatPanel, KanbanBoard, Dashboard, HeroSection, ...)
Templates: 10  (WorkstationLayout, MarketingLayout, OfferLayout, InvoiceLayout, ...)
Pages:     20+ (Landing, Pricing, Chat, Dashboard, Kanban, Settings, Agents, ...)
```

---

# ANHANG: QUELLEN & ABLAGE

| Artefakt | Pfad | Typ |
|----------|------|-----|
| Unified Design Master | **`/workspace/UNIFIED_NEXIFY_DESIGN_MASTER_V1.md`** (diese Datei) | 🆕 Kanonisch |
| Component Map V1 | `/workspace/nexify/07_ui_ci/NEXIFY_COMPONENT_MAP_V1.md` | 🆕 Vollständig |
| Brand & Marketing Matrix | `/workspace/nexify-brand-marketing-matrix.md` | 🆕 Vollständig |
| Design Audit Analyse | `/workspace/DESIGN_AUDIT_ANALYSIS.md` | 🆕 Gap-Analyse |
| GRAPHITE PREMIUM CSS | `/workspace/GRAPHITE_PREMIUM_CSS.css` | Besteht (477 Zeilen) |
| NeXify V2 Token | `/workspace/DESIGN_SYSTEM_V2.md` | Ersetzt (in Master integriert) |
| Graphite Handbuch V3 | `/workspace/nexify/07_ui_ci/DESIGNSYSTEM_HANDBUCH_V3.md` | Ersetzt (in Master integriert) |
| Premium V3 Draft | `/workspace/nexify/18_designsystem/GRAPHITE_PREMIUM_DESIGNSYSTEM_V3.md` | Ersetzt |
| Graphite WebUI Skin | `/workspace/GRAPHITE_DESIGN_SYSTEM.md` | Behält Gültigkeit für Hermes WebUI |

---

**Erstellt:** 2026-06-20 16:10 UTC  
**Autor:** Hermes Agent (vps-admin) — Langlauf Run 2  
**Nächstes:`** Phase 1 Implementierung (Token → CSS → Tailwind Preset)
