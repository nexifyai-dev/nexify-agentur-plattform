# Design-Vorgabe NeXify AI Agenturwebsite

Stand: 2026-06-21 01:20 Europe/Berlin
Owner: Pascal Courbois / NeXify AI by NeXify
Status: verbindliche Design- und Code-Vorgabe fuer den Vercel-Preview-Stand


Diese Vorgabe ist verbindlich fuer die Website in diesem Repository. Sie uebersetzt die bereitgestellte `preview.html`-Referenz in wartbare Next.js-/Tailwind-Regeln.

## Visuelle Richtung

- Graphite-Premium-Shell mit dunkler technischer Materialitaet.
- Orange als Hauptakzent, Lime nur fuer Status/Validitaet, Cyan nur fuer technische Signale.
- Grosszuegige Editorial-Typografie links, Operator-System rechts.
- Kein generisches AI-Purple, keine uebertriebene Glas-/Gradientendeko, keine Marketing-Stock-Optik.

## Desktop-Komposition

- Referenzrahmen: 1480 x 1160 px als Designkomposition, technisch responsiv umgesetzt.
- Hero: links Text, rechts Operator-Visual.
- Operator-Floating-Cards bleiben innerhalb der visuellen Grenze.
- Statistikzeile und Feature-Bereiche nutzen klare Raster, nicht zufaellige Kartenstapel.

## Responsive Verhalten

- Tablet: Text oben, Operator darunter, Statistiken als 2 x 2 Raster.
- Mobile: Text, Buttons, Operator, Kennzahlen, Feature-/Service-Karten einzeln.
- Keine feste 1480px-Breite auf kleineren Viewports.
- Keine horizontale Scrollbar, keine abgeschnittenen Karten, keine auslaufende Headline.

## Code-Regeln

- `hero-copy` muss `min-width: 0` behalten.
- `operator-wrap` muss `min-width: 0` und `overflow: visible` behalten.
- Floating Cards duerfen keine negativen Offsets bekommen, die mobile/desktop clipping erzeugen.
- Design-Tokens bleiben in `app/globals.css` zentral.
- Preis- und Leistungslogik bleibt in `lib/site-data.ts` zentral typisiert.
- Neue sichtbare UI-Texte muessen NeXify als persoenlich gefuehrte, AI-gestuetzte Agentur beschreiben, nicht als anonyme autonome AI-Agentur.

## Pflichtpruefung vor Push

```bash
npm run test
npm run typecheck
npm run lint
npm run build
```

Nach Vercel-Preview zusaetzlich Browser-Screenshots fuer Desktop, Tablet und Mobile pruefen.
