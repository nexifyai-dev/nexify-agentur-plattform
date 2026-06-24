# Unified NeXify System Architecture — Masterplan v1.0

> **Datum:** 2026-06-20
> **Design Authority:** Hermes WebUI Graphite (Premium Enhanced)
> **Status:** KONZEPTION

---

## 1. Philosophie

**Ein Hub — Ein Design — Viele Mandanten.**

Die Hermes WebUI wird zum zentralen NeXify-Betriebssystem. Alles ist darin integriert:
Agent-Interface, Paperclip Multi-Agent-Management, System-Health, MCP-Manager,
Settings, Workspace-Verwaltung. **Kundenprojekte (Bookando, Vorratsgesellschaften)
bleiben mandantenisoliert** — sie nutzen die Infrastruktur, aber ihr Branding bleibt
eigenständig.

---

## 2. Architektur — 5 Ebenen

```
┌─────────────────────────────────────────────────────────────────┐
│  EBENE 5: INTERNET-PRÄSENZ (Pre-Login)                          │
│  ┌─────────┐ ┌──────────┐ ┌───────────┐ ┌──────────┐ ┌───────┐ │
│  │ Landing │ │ Features │ │  Pricing  │ │  Login   │ │Register│ │
│  │  Page   │ │   Page   │ │   Page    │ │   Page   │ │ Page   │ │
│  └─────────┘ └──────────┘ └───────────┘ └──────────┘ └───────┘ │
├─────────────────────────────────────────────────────────────────┤
│  EBENE 4: HERMES WEBUI CORE (Post-Login)                        │
│  ┌─────────┐ ┌──────────────┐ ┌────────────────┐ ┌───────────┐ │
│  │ CHAT UI │ │  PAPERCLIP   │ │  SYSTEM CENTER │ │ WORKSPACE │ │
│  │(Agent)  │ │  Dashboard   │ │  Health/MCP/   │ │  Manager  │ │
│  │         │ │  Agent Team  │ │  Settings/Cron  │ │           │ │
│  └─────────┘ └──────────────┘ └────────────────┘ └───────────┘ │
├─────────────────────────────────────────────────────────────────┤
│  EBENE 3: GRAPHITE DESIGN SYSTEM                                │
│  ┌─────────────┐ ┌──────────────┐ ┌─────────────────────────┐  │
│  │ Premium     │ │  Component   │ │  Layout (Sidebar,       │  │
│  │ CSS-Vars    │ │  Library     │ │  Topbar, Panel, Chat)   │  │
│  │ Illusions   │ │  (shadcn/    │ │  Workspace Tree         │  │
│  │ Depth       │ │   Radix)     │ │                         │  │
│  └─────────────┘ └──────────────┘ └─────────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│  EBENE 2: BACKEND / MCP LAYER                                   │
│  ┌──────┐ ┌──────┐ ┌────────┐ ┌──────┐ ┌────────┐ ┌──────┐   │
│  │Brain │ │Qdrant│ │Agent-  │ │Tavily│ │9Router │ │Cron  │   │
│  │(MCP) │ │(MCP) │ │memory  │ │(MCP) │ │(Router)│ │Jobs  │   │
│  └──────┘ └──────┘ └────────┘ └──────┘ └────────┘ └──────┘   │
├─────────────────────────────────────────────────────────────────┤
│  EBENE 1: KUNDENPROJEKTE (Mandantenisoliert)                    │
│  ┌──────────────────┐  ┌─────────────────────────────────┐      │
│  │ BOOKANDO          │  │ VORRATSGESELLSCHAFTEN           │      │
│  │ FixDigital / Kein │  │ B2B-Landingpage                 │      │
│  │ Navy/Amber Design │  │ Eigene Identität (zu perfekt.)  │      │
│  └──────────────────┘  └─────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Graphite Premium — Design-Philosophie

Das Graphite-Theme wird zur **Licht-und-Schatten-Maschine**. Inspiration:

- **Apple Vision Pro** — Glassmorphismus, Tiefenstaffelung, Floating-Elemente
- **Arc Browser** — Seitliche Panels, Command-Bar, elegante Kurven
- **Linear App** — Mikro-Animationen, perfekte Radien, weiche Übergänge
- **Stripe** — Subtile Gradients, Icons in Inhalten, Card-Hover-Effekte

### Schlüsselelemente der Veredelung

| Feature | Technik | Wirkung |
|---------|---------|---------|
| Tiefenstaffelung | 6-layer z-index + shadow | Inhalte scheinen zu schweben |
| Glassmorphismus | Backdrop-Filter + opacity | Vision Pro Style |
| Mikro-Illusionen | Multi-layer box-shadow | Licht fällt von schräg oben |
| Hover-Depth | Scale + Shadow-Animation | Buttons heben sich an |
| Active-Depth | Translate-Y + Shadow-Reduction | Button drückt sich |
| Card-Embossing | Inset-Shadow + border | Cards wirken geprägt |
| Glow-Effekte | Box-Shadow mit accent-farbe | Fokus, Akzente |
| Smooth Transitions | Custom cubic-bezier(.16,1,.3,1) | Apple-like |

---

## 4. Komponenten-Bibliothek (Was integriert wird)

### 4.1 Hermes WebUI Core Components (Angereichert)

| Komponente | Premium Feature |
|---|---|
| Composer | Glassmorphismus, Akzent-Glow bei Focus, Scale-Hover |
| Message Bubble | Embossing, Micro-Shadow, Typografie-Verfeinerung |
| Sidebar | 2-Layer Tiefe (active item glow), Collapse-Animation |
| Session List | Hover-Item-Lift, Active-Indicator mit Bevel |
| File Tree | Depth-Lines, Hover-Expand, Icon-Animation |
| Topbar | Subtiler Glass-Effekt, Border-Glow |
| Settings Panel | Card-Embossing, Category-Tabs mit Slider |

### 4.2 Paperclip Dashboard (NEU)

| Komponente | Beschreibung |
|---|---|
| Agent Team Grid | 10 Agent-Profile mit Status, Team-Zuordnung |
| Task Kanban | Issue-Viewer, Status-Tracking |
| Agent Chat Viewer | Live-Stream von Subagent-Output |
| Skill Manager | Enable/Disable Skills (read-only sync) |
| Session Codec | Resume-Session UI |

### 4.3 System Center (NEU)

| Komponente | Beschreibung |
|---|---|
| Health Dashboard | MCP-Status, Server-Uptime, Latency |
| MCP Manager | Enable/Disable, Config-Viewer, Log-Viewer |
| Profile Switcher | CEO/CTO/CSO/Network — Role-Switch-UI |
| Cron Manager | Scheduled Tasks Overview |
| Secrets Manager | Env-Var-Viewer (read-only) |

### 4.4 Pre-Login Pages (NEU — Graphite Premium)

| Page | Besonderheit |
|---|---|
| Landing Page | Hero mit Particle-Effekt oder Gradient-Animation |
| Features Page | Card-Grid mit Hover-Lift, Interactive Demo |
| Pricing Page | Toggle Monthly/Yearly, Animated Cards |
| Login Page | Glassmorphism Card, Floating-Label Inputs |
| Register Page | Multi-Step Form mit Progress-Indicator |

---

## 5. Implementierungs-Phasen

### Phase 1 — Foundation (Jetzt)
1. ✅ Master-Plan + Konzeption
2. ✅ Graphite Premium CSS Variablen
3. **⬜ Premium CSS in /app/nexify-overlay/static/style.css einspielen**
4. **⬜ System-Architektur-Diagramm**

### Phase 2 — Pre-Login Pages
1. Landing Page (Hero + Features + CTA)
2. Login Page (Glassmorphism Card)
3. Register Page (Multi-Step)
4. Pricing Page (Plan-Comparison)

### Phase 3 — Paperclip Dashboard
1. Agent Team Grid (10 Employees)
2. Task Kanban Integration
3. Session Manager

### Phase 4 — System Center
1. Health Dashboard
2. MCP Manager UI
3. Profile Switcher
4. Cron/Secret Viewer

### Phase 5 — Kundenprojekte Perfektion
1. Bookando: Scrollbar-Fix + Color-Match + Dark Mode
2. Vorratsgesellschaften: 96 Violations fixen + Premium-Stil

---

## 6. Technische Entscheidungen

| Entscheidung | Grund |
|---|---|
| **CSS-Vars statt Tailwind only** | Hermes WebUI verwendet raw CSS — Overlay-Kompatibilität |
| **shadcn/ui für neue Komponenten** | Template-First, Radix-Primitives, Barrierefreiheit |
| **Framer Motion für Animationen** | Template-Unterstützung, flüssige 60fps |
| **React Router für Navigation** | Bereits in Hermes WebUI integriert |
| **Kein Tailwind-Preset für Kundenprojekte** | Tenant-Trennung, eigenes Branding |
| **Paperclip als Side-Panel** | Keine neue Route — floatendes Dashboard |

---

## 7. Komponenten-Ersteller

Alle neuen Komponenten liegen in:
```
/app/nexify-overlay/
├── static/
│   └── style.css          ← Premium Graphite Overrides
├── components/
│   ├── prelogin/          ← Landing, Login, Register, Pricing
│   ├── paperclip/         ← Agent Grid, Task Kanban
│   └── system/            ← Health, MCP, Profiles, Cron
└── pages/
    ├── landing.jsx
    ├── login.jsx
    ├── pricing.jsx
    └── dashboard.jsx
```

---

## 8. Qualitätskriterien

- **Barrierefreiheit:** WCAG 2.1 AA (Focus-States, Screenreader, Contrast 4.5:1)
- **Performance:** < 100ms First Paint, < 50KB CSS Overhead
- **Dark Mode:** 100% aller Komponenten
- **Formfaktoren:** Desktop-First, Tablet-kompatibel, Mobile-Bottom-Nav
- **Responsiv:** 320px bis 2560px
