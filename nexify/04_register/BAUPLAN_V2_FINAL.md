# NeXifyAI — Verbindlicher Bauplan für das integrierte Gesamtsystem
> **Version:** 2.0 final  
> **Stand:** 08.05.2026  
> **Freigabe:** Pascal / NeXifyAI  
> **Klassifikation:** Intern – Vertraulich  
> **Gespeichert:** 2026-06-20 (Hermes Langlauf Integration)

---

## 1. Architekturübersicht (Systemlandschaft)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Internet (DNS / SSL)                             │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    Traefik (traefik-tcja)                                │
│                    www.nexify-automate.com                               │
│                    admin.nexifyai.cloud                                  │
│                    ai-fabrik.nexifyai.cloud   ← NEU                     │
│                    supabase.nexifyai.cloud                               │
│                    analytics.nexifyai.cloud                              │
│                    notebook.nexifyai.cloud                               │
└─────────────────────────────────────────────────────────────────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌──────────────┐  ┌────────────────┐  ┌─────────────────────┐
│  Frontend    │  │  Admin-Cockpit │  │  KI-Fabrik           │
│  (Next.js)   │  │  (Next.js)     │  │  (Paperclip)         │
│  Port 3000   │  │  Port 8400     │  │  Port 3100           │
│              │  │  (intern)      │  │  ai-fabrik.nexifyai. │
│              │  │                │  │  cloud                │
└──────┬───────┘  └───────┬────────┘  └──────────┬──────────┘
       │                  │                      │
       └──────────────────┼──────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         Backend (FastAPI, Port 8001)                     │
│                         + Hermes Agent (intern)                          │
│                         + Oracle / Systemplaner (Skills)                 │
└─────────────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                   Daten- & Wissensschicht                                 │
│  ┌──────────┐  ┌──────────┐  ┌────────────┐  ┌──────────┐  ┌──────────┐ │
│  │ Supabase │  │ Qdrant   │  │ Honcho     │  │ Open     │  │ Umami    │ │
│  │ (SQL,    │  │ (Vektor) │  │ (Memory)   │  │ Notebook │  │ (Analyt) │ │
│  │  Auth,   │  │          │  │            │  │ (Wissen) │  │          │ │
│  │  Storage)│  │          │  │            │  │          │  │          │ │
│  └──────────┘  └──────────┘  └────────────┘  └──────────┘  └──────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

## 2. Subdomain-Struktur

| Subdomain | Dienst | Container / Port | Status |
|-----------|--------|------------------|--------|
| www.nexify-automate.com | Frontend (Next.js) | Vercel | ✅ Live |
| admin.nexifyai.cloud | Admin-Cockpit | hermes-agent-ofbh (intern) + Traefik-Proxy | ✅ Live |
| ai-fabrik.nexifyai.cloud | KI-Fabrik (Paperclip) | paperclip-etdf, Port 3100 → Traefik-Proxy | 🔧 In Umsetzung |
| supabase.nexifyai.cloud | Supabase Studio | supabase-studio, Port 3000 → proxied | ✅ Live |
| analytics.nexifyai.cloud | Umami Analytics | umami, Port 3000 → proxied | ✅ Live |
| notebook.nexifyai.cloud | Open Notebook | open-notebook-y3ih, Port 8502 → proxied | ✅ Live |

## 3. Branding

**Markenname:** NeXifyAI by NeXify – Chat it. Automate it.

**Farbwelt:**
- `--color-primary`: Deep Navy
- `--color-accent`: NeXify Blue
- `--color-accent-2`: Teal

**Typografie:**
- Headlines: Inter / Space Grotesk
- Body: Inter / DM Sans

**Komponenten:** Ausschließlich aus `/packages/ui` (shadcn/ui)
**Dark Mode:** Standard für Admin + Fabrik

## 4. Services & Bereiche

| Bereich | Umsetzung | Status |
|---------|-----------|--------|
| Kundenportal | Next.js-Routen unter /portal mit Supabase-Auth | Planung |
| Support-Chat | LiveChat-Komponente über Hermes angebunden | Planung |
| Wissensdatenbank | Open Notebook (öffentlich lesbar) | ✅ Live |
| Ticket-System | Paperclip-Tasks + supabase support_tickets | Planung |
| Statusseite | /health öffentlich | ✅ Vorhanden |
| Rechtliches | /docs/legal/ | ✅ Vorhanden |
| Partnerbereich | Phase 3 (nach KI-Fabrik-Stabilisierung) | Planung |

## 5. Autonomer Aufbaukreis (Soll-Prozess)

```
┌─────────┐    ┌──────────────┐    ┌─────────────────────┐
│ ORACLE  │───▶│ SYSTEMPLANER │───▶│   KI-FABRIK          │
│ (Wissen │    │ (Aufträge)   │    │   (Paperclip)        │
│  scan)  │    │              │    │   Worker ausführen   │
└─────────┘    └──────────────┘    └──────────┬──────────┘
     ▲                                         │
     │                                         ▼
     │              ┌──────────────┐    ┌──────────┐
     └──────────────│ BRAIN        │◀───│ AUDIT    │
                    │ (Qdrant/     │    │ (Prüfer) │
                    │  Honcho/     │    └──────────┘
                    │  Notebook)   │
                    └──────────────┘
```

## 6. Bestehende Lösungen

| Lösung | Entscheidung |
|--------|-------------|
| Supabase (13 Container) | ✅ Erhalten |
| Qdrant | ✅ Erhalten |
| Honcho | ✅ Erhalten |
| Open Notebook (2 Instanzen) | ⚠️ Nur y3ih behalten |
| Umami | ✅ Erhalten |
| Traefik | ✅ Erhalten |
| Hermes Agent | ✅ Erhalten |
| Paperclip | ✅ Ausbauen als KI-Fabrik |
| CLI-Autopilot-Skripte | ❌ Archivieren |
| Alte Admin-Seite | ✅ Erhalten als Fallback |

## 7. Sicherheit

- HTTPS via Let's Encrypt (Traefik)
- Auth-Token: Bearer-Header (nie in URLs)
- Paperclip: persistSession: true, maxIterations: 200
- Health-Score + Connection-Health als Frühwarnsystem
- Backups: Supabase täglich 03:00 + Brain-Einträge
