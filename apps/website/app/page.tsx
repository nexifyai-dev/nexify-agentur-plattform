import Link from "next/link";
import { ArrowRight, Check, Clock3, ShieldCheck, Sparkles } from "lucide-react";
import { OperatorVisual } from "@/components/operator-visual";
import { PricingCalculator } from "@/components/pricing-calculator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { company, featurePillars, processSteps, services } from "@/lib/site-data";
import { euro } from "@/lib/utils";

export default function HomePage() {
  return (
    <main>
      <section className="hero-section">
        <div className="hero-grid site-container">
          <div className="hero-copy">
            <Badge className="border-[var(--accent)]/25 text-white/70"><Sparkles className="mr-2 size-3 text-[var(--accent)]" />Erfahrung trifft AI-gestützte Geschwindigkeit</Badge>
            <h1>Websites und Software vom Fachmann. <span>In Tagen statt Monaten.</span></h1>
            <p>Pascal Courbois verbindet persönliche Erfahrung, klare Verantwortung und hochmoderne AI-gestützte Entwicklung. So entstehen hochwertige Websites, Shops, Web-Apps, mobile Apps und Automatisierungen zu einem transparenten Preis.</p>
            <div className="hero-actions"><Button asChild size="lg"><Link href="/kontakt">Projekt besprechen <ArrowRight className="size-4" /></Link></Button><Button asChild size="lg" variant="outline"><Link href="/preise">Preise ansehen</Link></Button></div>
            <div className="hero-trust"><span><Check />Persönlich geführt</span><span><Check />999 € netto / Arbeitstag</span><span><Check />Ausschließlich B2B</span></div>
          </div>
          <OperatorVisual />
        </div>
      </section>

      <section className="proof-strip">
        <div className="site-container grid grid-cols-2 lg:grid-cols-4">
          <div><strong>999<span> €</span></strong><p>netto pro Arbeitstag</p></div>
          <div><strong>1<span> Tag</span></strong><p>für eine Landingpage</p></div>
          <div><strong>2–3<span> Tage</span></strong><p>für eine Website</p></div>
          <div><strong>6–8<span> Tage</span></strong><p>für Shop oder App-MVP</p></div>
        </div>
      </section>

      <section className="section site-container">
        <div className="section-heading">
          <div><p className="kicker">Leistungen</p><h2>Alles, was ein digitales Produkt wirklich braucht.</h2></div>
          <p>Strategie, Design, Entwicklung, Integrationen, Tests und Übergabe aus einer verantwortlichen Hand. Keine anonyme Produktionskette.</p>
        </div>
        <div className="service-grid">
          {services.map((service, index) => {
            const Icon = service.icon;
            const netMin = service.minDays * company.dayRate;
            const netMax = service.maxDays ? service.maxDays * company.dayRate : undefined;
            return (
              <Card key={service.slug} className={index === 0 ? "service-card featured" : "service-card"}>
                <CardHeader><div className="service-icon"><Icon /></div><span className="service-number">0{index + 1}</span><CardTitle>{service.shortTitle}</CardTitle><p>{service.description}</p></CardHeader>
                <CardContent><div className="service-price"><span>{service.days}</span><strong>{service.from ? "ab " : ""}{euro(netMin)}{netMax ? ` – ${euro(netMax)}` : ""}</strong></div><Link href={`/leistungen/${service.slug}`} className="card-link">Details ansehen <ArrowRight /></Link></CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="section muted-section">
        <div className="site-container">
          <div className="section-heading">
            <div><p className="kicker">Warum dieser Preis möglich ist</p><h2>Erfahrung spart Umwege. AI spart Durchlaufzeit.</h2></div>
            <p>Der Preis sinkt nicht durch weniger Verantwortung, sondern durch weniger Reibung: keine aufgeblähten Teams, keine Übergabeschleifen, keine monatelange Produktion.</p>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {featurePillars.map(({ title, text, icon: Icon }) => <Card className="pillar-card" key={title}><Icon /><h3>{title}</h3><p>{text}</p></Card>)}
          </div>
          <div className="founder-panel">
            <div className="founder-monogram">PC</div>
            <div><p className="kicker">Pascal Courbois · Inhaber</p><h3>Alter und Erfahrung sind hier kein Nebensatz.</h3><p>Ihr Projekt wird nicht an wechselnde Junior-Teams weitergereicht. Planung, technische Entscheidungen und Qualitätskontrolle werden persönlich geführt. Moderne AI-Werkzeuge erhöhen Geschwindigkeit und Prüftiefe – die Verantwortung bleibt beim Fachmann.</p></div>
            <Button asChild variant="outline"><Link href="/ueber-mich">Mehr über die Arbeitsweise</Link></Button>
          </div>
        </div>
      </section>

      <section className="section site-container">
        <div className="section-heading"><div><p className="kicker">Arbeitsweise</p><h2>Ein klarer Weg vom Ziel zum geprüften Ergebnis.</h2></div><p>Der Umfang wird vorab in Arbeitstagen geplant. Jede Phase erzeugt sichtbare Entscheidungen, Ergebnisse und Prüfungen.</p></div>
        <div className="process-grid">{processSteps.map(({ n, title, text, icon: Icon }) => <article key={n}><span>{n}</span><Icon /><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="section site-container"><PricingCalculator /></section>

      <section className="section site-container">
        <div className="cta-panel">
          <div><Badge>Start mit klarer Aufwandsspanne</Badge><h2>Beschreiben Sie das Ziel. Sie erhalten Scope, Arbeitstage und Preisrahmen.</h2><p>Keine unverbindliche Verkaufspräsentation, sondern eine erste fachliche Einordnung: Was ist nötig, was kann warten und wie lässt es sich wirtschaftlich umsetzen?</p></div>
          <div className="grid gap-3"><Button asChild size="lg"><Link href="/kontakt">Projekt anfragen <ArrowRight className="size-4" /></Link></Button><span><Clock3 />Antwort auf qualifizierte Anfragen in der Regel innerhalb eines Arbeitstags</span><span><ShieldCheck />Vertrauliche B2B-Kommunikation</span></div>
        </div>
      </section>
    </main>
  );
}
