# Anforderungsdefinition: NeXify AI Landingpage

**Datum:** 2026-06-22 | **Status:** DEFINITION | **Version:** 2.0.0
**Owner:** Frontend/Design Agent (NeXify AI OS)
**Basis:** Analyse 2 (Landingpage-Analyse)

---

## 1. Anforderungskategorien

### 1.1 Funktionale Anforderungen (FR)

| ID | Anforderung | Priorität | Status |
|----|-------------|-----------|--------|
| FR-01 | Dark/Light Mode Toggle im Header | P1 | ✅ Implementiert |
| FR-02 | Cookie-Consent-Banner (DSGVO/TTDSG) | P0 | ✅ Implementiert |
| FR-03 | Analytics-Integration (Plausible) | P0 | ✅ Implementiert |
| FR-04 | Newsletter-Signup (Resend) | P2 | ❌ Offen |
| FR-05 | Live-Chat-Widget (Crisp/Tawk.to) | P1 | ❌ Offen |
| FR-06 | Scroll-to-Top Button | P3 | ❌ Offen |
| FR-07 | Breadcrumbs für Subpages | P3 | ❌ Offen |
| FR-08 | Print-Stylesheet | P3 | ❌ Offen |

### 1.2 Nicht-funktionale Anforderungen (NFR)

| ID | Anforderung | Zielwert | Status |
|----|-------------|----------|--------|
| NFR-01 | Lighthouse Performance Score | ≥95 | ⚠️ Zu prüfen |
| NFR-02 | LCP (Largest Contentful Paint) | <1.5s | ⚠️ Zu prüfen |
| NFR-03 | FID (First Input Delay) | <50ms | ⚠️ Zu prüfen |
| NFR-04 | CLS (Cumulative Layout Shift) | <0.05 | ⚠️ Zu prüfen |
| NFR-05 | WCAG 2.1 AA Konformität | 100% | ✅ Implementiert |
| NFR-06 | Text-Kontraste | ≥4.5:1 (AA) | ✅ Implementiert |
| NFR-07 | Keyboard Navigation | Vollständig | ✅ Erfüllt |
| NFR-08 | Reduced Motion Support | Vollständig | ✅ Erfüllt |
| NFR-09 | Responsive Design (320px-1920px) | Ohne Overflow | ✅ Erfüllt |
| NFR-10 | Security Headers | Vollständig | ✅ Erfüllt |

### 1.3 Design-Anforderungen (DR)

| ID | Anforderung | Details | Status |
|----|-------------|---------|--------|
| DR-01 | Graphite Premium Tokens | Kanonische Token-Quelle | ✅ Implementiert |
| DR-02 | Light Mode Support | Alle Komponenten | ✅ Implementiert |
| DR-03 | Einheitliche Akzentfarbe | Orange ODER Indigo | ✅ Orange (Default) |
| DR-04 | Button-Design | Kein Gradient, Flat + Lift | ⚠️ Teilweise |
| DR-05 | Card-Design | 8px Radius, definierte Tokens | ⚠️ Teilweise |
| DR-06 | Header Glass | blur(12px) statt blur(20px) | ✅ Implementiert |
| DR-07 | Animationen | 7 Typen aus Graphite Premium | ❌ Offen |
| DR-08 | Easing-Kurven | Kanonisch (kein ease-in-out) | ✅ Implementiert |

### 1.4 Content-Anforderungen (CR)

| ID | Anforderung | Details | Status |
|----|-------------|---------|--------|
| CR-01 | Testimonials/Referenzen | 3-5 echte Kundenstimmen | ❌ Offen |
| CR-02 | Blog/Wissen-Artikel | 5+ Artikel für Content-Marketing | ❌ Offen |
| CR-03 | Case Studies | 2-3 detaillierten Projektbeschreibungen | ❌ Offen |
| CR-04 | OG-Image | Social Sharing Bild (1200x630) | ✅ Implementiert |
| CR-05 | Partner-/Tool-Logos | 5-10 Technologie-Logos | ❌ Offen |

### 1.5 SEO-Anforderungen (SR)

| ID | Anforderung | Details | Status |
|----|-------------|---------|--------|
| SR-01 | Meta-Tags | Title, Description, OG | ✅ Erfüllt |
| SR-02 | JSON-LD Structured Data | ProfessionalService | ✅ Erfüllt |
| SR-03 | Sitemap | XML-Sitemap | ✅ Erfüllt |
| SR-04 | Robots.txt | Korrekt konfiguriert | ✅ Erfüllt |
| SR-05 | Canonical URLs | Auf allen Seiten | ✅ Erfüllt |
| SR-06 | Blog-Content | Für organischen Traffic | ❌ Offen |

---

## 2. Priorisierte Umsetzungsreihenfolge

### Sprint 1 (Woche 1) — Kritisch ✅ ABGESCHLOSSEN

1. **FR-02** Cookie-Consent-Banner → DSGVO/TTDSG Pflicht ✅
2. **CR-04** OG-Image erstellen → Social Sharing ✅
3. **NFR-06** WCAG-Kontraste korrigieren → Accessibility ✅
4. **DR-01** Graphite Premium Tokens vollständig integrieren ✅

### Sprint 2 (Woche 2) — Hoch ✅ ABGESCHLOSSEN

5. **FR-03** Analytics (Plausible) integrieren ✅
6. **DR-02** Light Mode implementieren ✅
7. **FR-01** Dark/Light Toggle im Header ✅
8. **DR-04 + DR-05** Button und Card Design angleichen ⚠️ Teilweise

### Sprint 3 (Woche 3) — Mittel

9. **CR-01** Testimonials sammeln und einbinden
10. **CR-02** Blog-Artikel schreiben
11. **FR-05** Live-Chat-Widget integrieren
12. **CR-05** Partner-/Tool-Logos ergänzen

### Sprint 4 (Woche 4) — Niedrig

13. **DR-07** Scroll-Animationen implementieren
14. **DR-08** Easing-Kurven standardisieren
15. **FR-04** Newsletter-Signup
16. **CR-03** Case Studies schreiben

---

## 3. Akzeptanzkriterien

### 3.1 Design-System ✅

- [x] Alle Farben aus Graphite Premium Tokens referenziert
- [x] Light Mode vollständig funktional
- [x] Dark/Light Toggle im Header sichtbar und funktioniert
- [x] Keine hardcoded Farbwerte in Komponenten
- [x] Alle WCAG AA Kontraste erfüllt (≥4.5:1)

### 3.2 Performance

- [ ] Lighthouse Performance Score ≥95
- [ ] LCP <1.5s auf 3G
- [ ] CLS <0.05
- [ ] Keine Layout-Shifts beim Laden

### 3.3 Accessibility ✅

- [x] WCAG 2.1 AA vollständig konform
- [x] Keyboard Navigation auf allen Seiten
- [x] Screen Reader korrekte ARIA-Labels
- [x] Reduced Motion respektiert

### 3.4 Content

- [ ] Mindestens 3 Testimonials auf Referenzen-Seite
- [ ] Mindestens 5 Blog-Artikel auf Wissen-Seite
- [x] OG-Image auf allen Seiten
- [x] Cookie-Banner sichtbar und funktioniert

### 3.5 SEO ✅

- [x] Meta-Tags auf allen 20 Seiten
- [x] JSON-LD auf Homepage und Service-Seiten
- [x] Sitemap aktuell
- [x] robots.txt korrekt

---

## 4. Abhängigkeiten

| Abhängigkeit | Beschreibung | Owner | Status |
|--------------|--------------|-------|--------|
| Akzentfarbe-Entscheidung | Orange vs. Indigo | Pascal Courbois | ✅ Orange (Default) |
| Testimonials | Echte Kundenstimmen | Pascal Courbois | ⏳ Wartend |
| Blog-Content | Artikeltexte | Pascal Courbois | ⏳ Wartend |
| OG-Image | Design | Frontend Agent | ✅ Implementiert |
| Cookie-Consent-Tool | Osano vs. Klaro | Frontend Agent | ✅ Custom Implementation |
| Analytics-Tool | Plausible vs. Umami | Frontend Agent | ✅ Plausible |

---

## 5. Risiken

| Risiko | Wahrscheinlichkeit | Impact | Mitigation |
|--------|-------------------|--------|------------|
| Akzentfarbe-Entscheidung verzögert | Mittel | Hoch | ✅ Orange als Default beibehalten |
| Testimonials nicht verfügbar | Mittel | Mittel | Platzhalter mit "coming soon" |
| Performance-Einbußen durch Animationen | Niedrig | Mittel | Reduced Motion respektieren |
| Light Mode bricht Dark-Mode-Styles | Niedrig | Hoch | ✅ Schrittweise Migration, visuelle Tests |

---

## 6. Definition of Done (DoD)

Eine Anforderung ist "Done", wenn:

1. ✅ Code implementiert und committed
2. ✅ TypeScript kompiliert ohne Fehler
3. ✅ ESLint besteht ohne Warnungen
4. ✅ Playwright Design-Audit besteht (11 Viewports)
5. ✅ Lighthouse Score ≥95
6. ✅ WCAG AA Kontraste erfüllt
7. ✅ Light UND Dark Mode funktionieren
8. ✅ Mobile und Desktop getestet
9. ✅ Dokumentation aktualisiert

---

**END OF REQUIREMENTS DEFINITION**
