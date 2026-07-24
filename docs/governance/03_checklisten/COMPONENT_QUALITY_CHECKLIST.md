# NeXify Workstation — Component Quality Checklist
**Status:** V1.0 — Plan | **Version:** 1.0.0 | **Datum:** 2026-06-10

---

## 1. Allgemeine Qualitätskriterien

Jede UI-Komponente muss folgende Kriterien erfüllen, bevor sie als "fertig" gemeldet wird:

### Funktional
- [ ] Komponente rendert ohne JS-Fehler
- [ ] Alle States sichtbar (default, hover, active, disabled, loading, error)
- [ ] Keine CSS-Konflikte mit benachbarten Komponenten
- [ ] Responsive bis 1024px (Stack, Wrap oder Hide)
- [ ] Tastatur-navigierbar (Tab, Enter, Escape, Arrow-Keys bei Listen)
- [ ] Screenreader-kompatibel (aria-Label, Rolle, Fokus-Management)

### Visuell (Graphite-Standard)
- [ ] Farbe aus Graphite-Tokens (kein Hardcoded Hex)
- [ ] Typografie aus Graphite-Tokens (kein Hardcoded Font-Size)
- [ ] Abstände aus 8px Grid (kein beliebiges Padding)
- [ ] Border-Radius einheitlich (sm/md/lg)
- [ ] Kein horizontaler Overflow
- [ ] Keine Text-Clipping
- [ ] Kontrast ≥ 4.5:1 für Normaltext, ≥ 3:1 für Large Text (WCAG AA)

### Graphite-Spezifisch
- [ ] Hintergrund: `--gx-bg-surface` oder `--gx-bg-elevated`
- [ ] Text: `--gx-text-primary` oder `--gx-text-secondary`
- [ ] Akzente: `--gx-accent` (Orange), kein Blau/Grün/Rot außer Status
- [ ] Border: `--gx-border` (subtile Linien)
- [ ] Kein Fremd-Logo oder -Branding sichtbar

### Sprache
- [ ] Alle Labels auf Deutsch
- [ ] Keine englischen Platzhalter
- [ ] Kein "Hermes", "9Router", "OpenAI" im UI-Text
- [ ] Kein Dollar ($) in Preisen

### Performance
- [ ] Kein Layout-Shift bei laden
- [ ] Keine unnötigen Re-Renders
- [ ] CSS-Selektoren spezifisch (kein globales Styling)

---

## 2. Komponenten-Spezifische Checklisten

### Button
- [ ] States: default, hover, active, disabled, loading (Spinner)
- [ ] Größen: small (32px), medium (40px), large (48px)
- [ ] Varianten: primary (orange), secondary (border), ghost (text)
- [ ] Icon-Unterstützung: vor/nach Text

### Input
- [ ] States: default, focus, disabled, error, filled
- [ ] Label immer sichtbar (kein Floating-Label allein)
- [ ] Error-Message unter Input
- [ ] Character-Count wo begrenzt

### Chat-Nachricht
- [ ] User-Nachricht: rechtsbündig, bg-surface
- [ ] Agent-Nachricht: linksbündig, bg-elevated
- [ ] Auto-Nachricht: orange linke Border + Prefix
- [ ] Code-Blöcke mit Syntax-Highlighting
- [ ] Kopieren-Button bei Code-Blöcken
- [ ] Kein Overflow bei langen Nachrichten (word-break)

### Session-ListItem
- [ ] Titel (max 1 Zeile, ellipsis)
- [ ] Datum/Uhrzeit (relative Angabe: "vor 5 Min")
- [ ] Status-Icon (grün/gelb/rot/grau Punkt)
- [ ] Auto-Indikator (optional)
- [ ] Maximale Breite: 280px (sidebar)

### Modal
- [ ] Overlay (rgba black 0.5)
- [ ] Center-positioned
- [ ] Escape schließt
- [ ] Klick außerhalb schließt
- [ ] Fokus-Falle innerhalb Modal
- [ ] Max Breite: 560px

### Badge/Pill
- [ ] Hintergrund: accent oder status
- [ ] Text: weiß (primary) auf Akzent
- [ ] Border-Radius: full (9999px)
- [ ] Font-Size: xs (0.75rem)

---

## 3. Prüf-Reihenfolge

```
1. Funktion (JS/React-Test)
2. Visuell (Screenshot-Test, manuell)
3. Accessibility (axe-core, Tastatur-Test)
4. Sprache (Code-Review auf harte Texte)
5. Performance (Chrome DevTools)
6. Responsive (Viewport 1024, 768, 480)
7. Integration (im Workstation-Kontext testen)
```
