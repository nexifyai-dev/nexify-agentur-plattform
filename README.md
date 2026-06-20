# NeXify AI – Agentur-Website

Finale, mehrseitige B2B-Agentur-Website für **NeXifyAI by NeXify – Chat it. Automate it.**

## Ziel

Die Website positioniert NeXify AI als persönlich geführten, AI-gestützt arbeitenden Software- und Digitalpartner für Unternehmen. Im Vordergrund stehen fachliche Erfahrung, direkte Verantwortung, transparente Arbeitstage und kurze Durchlaufzeiten.

## Enthaltene Seiten

- `/` – Startseite
- `/leistungen` – Leistungsübersicht
- `/leistungen/[slug]` – acht detaillierte Leistungsseiten
- `/preise` – Arbeitstage, Netto- und 21-%-BTW-Vergleich
- `/prozess` – Ablauf und Abnahme
- `/ueber-mich` – Pascal Courbois, Erfahrung und Arbeitsweise
- `/kontakt` – qualifiziertes Projektformular
- `/faq` – häufige Fragen
- `/referenzen` – Referenz- und Nachweislogik
- `/plattform` – NeXify-AI-Plattform und Operator-System
- `/wissen` – Wissensbereich
- `/impressum`, `/datenschutz`, `/agb`, `/ki-hinweise`, `/cookie-richtlinie`, `/avv`, `/widerruf`
- `/api/contact` – serverseitig validierter Resend-Kontaktendpunkt

## Preislogik

| Leistung | Arbeitstage | Netto | inkl. 21 % BTW |
|---|---:|---:|---:|
| Landingpage | 1 | 999,00 € | 1.208,79 € |
| Unternehmenswebsite | 2–3 | 1.998,00–2.997,00 € | 2.417,58–3.626,37 € |
| Onlineshop | 6–8 | 5.994,00–7.992,00 € | 7.252,74–9.670,32 € |
| Shop ab 50.000 Artikeln | ab 12 | ab 11.988,00 € | ab 14.505,48 € |
| Web-App-MVP | 6–8 | 5.994,00–7.992,00 € | 7.252,74–9.670,32 € |
| Mobile-App-MVP | 6–8 | 5.994,00–7.992,00 € | 7.252,74–9.670,32 € |

Die 21-%-Spalte ist eine transparente Vergleichsrechnung. Bei grenzüberschreitenden EU-B2B-Leistungen kann Reverse Charge gelten.

## Technologie

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn-kompatibles Komponentenmodell mit Radix Slot und CVA
- Lucide Icons
- Resend-Kontaktintegration
- Responsive Graphite-Premium-CI

## Lokaler Start

```bash
cp .env.example .env.local
npm install
npm run dev
```

Danach: `http://localhost:3000`

## Produktionsprüfung

```bash
npm run typecheck
npm run lint
npm run build
```

Zusätzlich sind vor Veröffentlichung Browser-Smokes für Desktop und Mobil, Formularzustellung, Links, Sitemap, Robots, Consent-/Tracking-Zustand und rechtliche Texte zu prüfen.

## Umgebungsvariablen

```env
NEXT_PUBLIC_SITE_URL=https://nexify-automate.com
RESEND_API_KEY=
CONTACT_TO_EMAIL=support@nexify-automate.com
CONTACT_FROM_EMAIL=NeXify AI Website <website@nexify-automate.com>
```

Ohne `RESEND_API_KEY` liefert das Formular eine klare Konfigurationsmeldung statt einen Schein-Erfolg.

## Freigabeschutz

Kein Merge und kein Production-Deployment ohne die ausdrückliche Kennzeichnung:

```text
PR-FREIGABE: JA
```

## Rechtlicher Hinweis

Die rechtlichen Seiten wurden mit den vorliegenden Unternehmensdaten und der B2B-Ausrichtung erstellt. Vor Production sollten sie durch eine qualifizierte niederländische beziehungsweise grenzüberschreitend tätige Rechts- und Steuerberatung geprüft werden. Sie sind keine Rechts- oder Steuerberatung.
