import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, CircleCheckBig } from "lucide-react";
import { Reveal, RevealGroup } from "@/components/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { company, services } from "@/lib/site-data";
import { euro } from "@/lib/utils";

export function generateStaticParams() { return services.map((service) => ({ slug: service.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  return service ? { title: service.shortTitle, description: service.description } : {};
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();
  const Icon = service.icon;
  const min = service.minDays * company.dayRate;
  const max = service.maxDays ? service.maxDays * company.dayRate : undefined;
  const grossMin = min * (1 + company.vatRate);
  const grossMax = max ? max * (1 + company.vatRate) : undefined;

  return (
    <main>
      <section className="subpage-hero service-detail-hero">
        <div className="site-container grid gap-10 lg:grid-cols-[1.25fr_.75fr] lg:items-end">
          <div>
            <Reveal><Badge><Icon className="mr-2 size-3" />{service.shortTitle}</Badge></Reveal>
            <Reveal delay={100}><h1>{service.title}</h1></Reveal>
            <Reveal delay={200}><p>{service.description}</p></Reveal>
            <Reveal delay={300}>
              <div className="hero-actions">
                <Button asChild size="lg"><Link href={`/${locale}/kontakt`}>Projekt anfragen <ArrowRight className="size-4" /></Link></Button>
                <Button asChild size="lg" variant="outline"><Link href={`/${locale}/preise`}>Preislogik ansehen</Link></Button>
              </div>
            </Reveal>
          </div>
          <Reveal delay={200}>
            <Card className="detail-price-card">
              <span>Typischer Startumfang</span>
              <strong>{service.days}</strong>
              <b>{service.from ? "ab " : ""}{euro(min)}{max ? ` – ${euro(max)}` : ""} netto</b>
              <p>{service.from ? "ab " : ""}{euro(grossMin)}{grossMax ? ` – ${euro(grossMax)}` : ""} bei 21 % BTW</p>
            </Card>
          </Reveal>
        </div>
      </section>

      <section className="section site-container grid gap-6 lg:grid-cols-3">
        <RevealGroup stagger={100}>
          <Card className="detail-card"><h2>Enthaltene Funktionen</h2><ul>{service.features.map((item) => <li key={item}><Check />{item}</li>)}</ul></Card>
          <Card className="detail-card"><h2>Lieferumfang</h2><ul>{service.deliverables.map((item) => <li key={item}><CircleCheckBig />{item}</li>)}</ul></Card>
          <Card className="detail-card"><h2>Ideal für</h2><ul>{service.idealFor.map((item) => <li key={item}><ArrowRight />{item}</li>)}</ul></Card>
        </RevealGroup>
      </section>

      <section className="site-container pb-8">
        <Reveal>
          <div className="scope-note">
            <div><p className="kicker">Klare Grenze statt Lockangebot</p><h2>{service.promise}</h2><p>Die Aufwandsspanne gilt für einen fokussierten, vollständig entscheidbaren Startumfang. Zusätzliche Sprachen, große Datenmigrationen, Spezialintegrationen, individuelle Rechtsberatung oder noch ungeklärte Fachlogik werden transparent ergänzt.</p></div>
            <Button asChild size="lg"><Link href={`/${locale}/kontakt`}>Scope prüfen lassen</Link></Button>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
