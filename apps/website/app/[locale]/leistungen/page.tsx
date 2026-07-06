import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Reveal, RevealGroup } from "@/components/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { company, services } from "@/lib/site-data";

import { euro } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Leistungen", description: "Landingpages, Unternehmenswebsites, Onlineshops, Web-Apps und AI-gestützte Automatisierung zum transparenten Tagessatz." };
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <main>
      <section className="subpage-hero">
        <div className="site-container">
          <Reveal><Badge>Leistungen für B2B-Unternehmen</Badge></Reveal>
          <Reveal delay={100}><h1>Digitale Produkte mit klarer Verantwortung.</h1></Reveal>
          <Reveal delay={200}><p>Vom ersten Konzept bis zur geprüften Übergabe: Strategie, Premium-Design, Entwicklung, Integrationen und Qualitätssicherung werden als ein zusammenhängender Prozess geführt.</p></Reveal>
        </div>
      </section>

      <section className="site-container pb-8">
        <RevealGroup stagger={80} className="service-list">
          {services.map((service, index) => {
            const Icon = service.icon;
            const min = service.minDays * company.dayRate;
            const max = service.maxDays ? service.maxDays * company.dayRate : undefined;
            return (
              <article key={service.slug} className="service-row">
                <div className="service-row-index">0{index + 1}</div>
                <div className="service-row-main">
                  <div className="service-icon"><Icon /></div>
                  <p className="kicker">{service.eyebrow}</p>
                  <h2>{service.title}</h2>
                  <p>{service.description}</p>
                  <div className="flex flex-wrap gap-2">{service.features.slice(0, 4).map((item) => <span className="mini-tag" key={item}><Check />{item}</span>)}</div>
                </div>
                <Card className="service-row-price">
                  <span>Typischer Startumfang</span>
                  <strong>{service.days}</strong>
                  <p>{service.from ? "ab " : ""}{euro(min)}{max ? ` – ${euro(max)}` : ""} netto</p>
                  <Button asChild variant="outline"><Link href={`/${locale}/leistungen/${service.slug}`}>Leistung ansehen <ArrowRight className="size-4" /></Link></Button>
                </Card>
              </article>
            );
          })}
        </RevealGroup>
      </section>
    </main>
  );
}
