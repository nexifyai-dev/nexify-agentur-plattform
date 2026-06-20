import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Scale, Sparkles } from "lucide-react";
import { PricingCalculator } from "@/components/pricing-calculator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { company, services } from "@/lib/site-data";
import { euro } from "@/lib/utils";

export const metadata: Metadata = { title: "Preise", description: "999 Euro netto pro Arbeitstag. Transparente Preisbeispiele für Landingpages, Websites, Onlineshops, Web-Apps und mobile Apps." };

export default function PricesPage() {
  return (
    <main>
      <section className="subpage-hero"><div className="site-container"><Badge>999 Euro netto pro Arbeitstag</Badge><h1>Faire Preise entstehen durch kurze Wege – nicht durch geringe Qualität.</h1><p>Ein erfahrener Fachmann übernimmt Strategie, Design, technische Umsetzung und Qualität. AI-gestützte Werkzeuge verkürzen die Durchlaufzeit. Dadurch bleibt der Gesamtpreis niedrig, obwohl das fachliche Niveau hoch ist.</p></div></section>
      <section className="site-container pb-8">
        <div className="pricing-table">
          <div className="pricing-table-head"><span>Leistung</span><span>Arbeitstage</span><span>Netto</span><span>Bei 21 % BTW</span></div>
          {services.map((service) => {
            const min = service.minDays * company.dayRate; const max = service.maxDays ? service.maxDays * company.dayRate : undefined;
            const grossMin = min * 1.21; const grossMax = max ? max * 1.21 : undefined;
            return <Link href={`/leistungen/${service.slug}`} className="pricing-table-row" key={service.slug}><strong>{service.shortTitle}</strong><span>{service.days}</span><span>{service.from ? "ab " : ""}{euro(min)}{max ? ` – ${euro(max)}` : ""}</span><span>{service.from ? "ab " : ""}{euro(grossMin)}{grossMax ? ` – ${euro(grossMax)}` : ""}<ArrowRight /></span></Link>;
          })}
        </div>
        <p className="mt-5 text-xs leading-5 text-white/35">Alle Preisbeispiele beruhen auf einem fokussierten, entscheidungsreifen Startumfang. Bei innergemeinschaftlichen B2B-Leistungen kann Reverse Charge gelten; die 21-%-Spalte dient dann nur dem Vergleich.</p>
      </section>
      <section className="section muted-section"><div className="site-container grid gap-5 lg:grid-cols-3">
        <Card className="price-reason"><Scale /><h2>Marktgerecht pro Stunde</h2><p>999 Euro pro Acht-Stunden-Arbeitstag entsprechen rund 124,88 Euro pro Stunde. Das liegt im Bereich professioneller Webdesign-Expertise – der entscheidende Vorteil ist die deutlich kürzere Projektdauer.</p></Card>
        <Card className="price-reason"><Sparkles /><h2>AI-gestützte Produktivität</h2><p>Research, Strukturierung, Code, Tests und Dokumentation werden intelligent beschleunigt. Nicht die Verantwortung wird automatisiert, sondern wiederholbare Arbeitsschritte.</p></Card>
        <Card className="price-reason"><Check /><h2>Kein versteckter Agenturapparat</h2><p>Keine fünf Rollen, die sich gegenseitig briefen. Kein Lockangebot mit späteren Pflichtpaketen. Sie bezahlen definierte Facharbeit und klar ausgewiesenen Zusatzumfang.</p></Card>
      </div></section>
      <section className="section site-container"><PricingCalculator /></section>
      <section className="site-container pb-8"><div className="cta-panel"><div><p className="kicker">Belastbare Kalkulation</p><h2>Sie erhalten vor Start eine klare Aufwandsspanne.</h2><p>Nach der fachlichen Einordnung werden Funktionen, Inhalte, Integrationen, Annahmen und Abnahmekriterien festgehalten.</p></div><Button asChild size="lg"><Link href="/kontakt">Preisrahmen anfragen <ArrowRight className="size-4" /></Link></Button></div></section>
    </main>
  );
}
