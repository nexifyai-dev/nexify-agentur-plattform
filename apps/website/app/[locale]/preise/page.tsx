import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Scale, Sparkles } from "lucide-react";
import { PricingCalculator } from "@/components/pricing-calculator";
import { Reveal, RevealGroup } from "@/components/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { company, services } from "@/lib/site-data";
import { euro } from "@/lib/utils";


export async function generateMetadata(): Promise<Metadata> {
  return { title: "Preise", description: "999 Euro netto pro Arbeitstag. Transparente Preisbeispiele für Landingpages, Websites, Onlineshops, Web-Apps und mobile Apps." };
}

export default async function PricesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <main>
      <section className="subpage-hero">
        <div className="site-container">
          <Reveal><Badge>999 Euro netto pro Arbeitstag</Badge></Reveal>
          <Reveal delay={100}><h1>Faire Preise entstehen durch kurze Wege – nicht durch geringe Qualität.</h1></Reveal>
          <Reveal delay={200}><p>Ein erfahrener Fachmann übernimmt Strategie, Design, technische Umsetzung und Qualität. AI-gestützte Werkzeuge verkürzen die Durchlaufzeit. Dadurch bleibt der Gesamtpreis niedrig, obwohl das fachliche Niveau hoch ist.</p></Reveal>
        </div>
      </section>

      <section className="site-container pb-8">
        <Reveal>
          <div className="pricing-table">
            <div className="pricing-table-head"><span>Leistung</span><span>Arbeitstage</span><span>Netto</span><span>Bei 21 % BTW</span></div>
            {services.map((service) => {
              const min = service.minDays * company.dayRate; const max = service.maxDays ? service.maxDays * company.dayRate : undefined;
              const grossMin = min * 1.21; const grossMax = max ? max * 1.21 : undefined;
              return <Link href={`/${locale}/leistungen/${service.slug}`} className="pricing-table-row" key={service.slug}><strong>{service.shortTitle}</strong><span>{service.days}</span><span>{service.from ? "ab " : ""}{euro(min)}{max ? ` – ${euro(max)}` : ""}</span><span>{service.from ? "ab " : ""}{euro(grossMin)}{grossMax ? ` – ${euro(grossMax)}` : ""}<ArrowRight /></span></Link>;
            })}
          </div>
        </Reveal>
        <Reveal><p className="mt-5 text-xs leading-5 text-[var(--text-2)]">Alle Preisbeispiele beruhen auf einem fokussierten, entscheidungsreifen Startumfang. Bei innergemeinschaftlichen B2B-Leistungen kann Reverse Charge gelten; die 21-%-Spalte dient dann nur dem Vergleich.</p></Reveal>
      </section>

      <section className="section section-muted">
        <div className="site-container">
          <RevealGroup stagger={100} className="grid gap-5 lg:grid-cols-3">
            <Card className="price-reason"><Scale /><h2>Marktgerecht pro Stunde</h2><p>999 Euro pro Acht-Stunden-Arbeitstag entsprechen rund 124,88 Euro pro Stunde. Das liegt im Bereich professioneller Webdesign-Expertise – der entscheidende Vorteil ist die deutlich kürzere Projektdauer.</p></Card>
            <Card className="price-reason"><Sparkles /><h2>AI-gestützte Produktivität</h2><p>Research, Strukturierung, Code, Tests und Dokumentation werden intelligent beschleunigt. Nicht die Verantwortung wird automatisiert, sondern wiederholbare Arbeitsschritte.</p></Card>
            <Card className="price-reason"><Check /><h2>Kein versteckter Agenturapparat</h2><p>Keine fünf Rollen, die sich gegenseitig briefen. Kein Lockangebot mit späteren Pflichtpaketen. Sie bezahlen definierte Facharbeit und klar ausgewiesenen Zusatzumfang.</p></Card>
          </RevealGroup>
        </div>
      </section>

      <section className="section site-container">
        <Reveal><PricingCalculator /></Reveal>
      </section>

      <section className="site-container pb-8">
        <Reveal>
          <div className="cta-panel">
            <div><p className="kicker">Belastbare Kalkulation</p><h2>Sie erhalten vor Start eine klare Aufwandsspanne.</h2><p>Nach der fachlichen Einordnung werden Funktionen, Inhalte, Integrationen, Annahmen und Abnahmekriterien festgehalten.</p></div>
            <Button asChild size="lg"><Link href={`/${locale}/kontakt`}>Preisrahmen anfragen <ArrowRight className="size-4" /></Link></Button>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
