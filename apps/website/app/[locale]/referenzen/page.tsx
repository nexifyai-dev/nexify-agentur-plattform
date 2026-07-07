import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, CalendarCheck2, FileSearch, ShoppingCart, Workflow } from "lucide-react";
import { Reveal, RevealGroup } from "@/components/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getTranslations, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = getTranslations(locale as Locale);
  return { title: "Projektarten", description: t.meta.description };
}

export default async function ReferencesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const examples = [
    { icon: Building2, title: "B2B-Unternehmensportale", text: "Mehrsprachige Informations-, Anfrage- und Dokumentenstrecken mit klarer Kundenführung." },
    { icon: CalendarCheck2, title: "Buchungs- und Serviceflows", text: "Verfügbarkeit, Terminlogik, Formulare, Benachrichtigungen und nachvollziehbare Fehlerpfade." },
    { icon: ShoppingCart, title: "Commerce und große Kataloge", text: "Produktdaten, Filter, Suche, Import, Checkout und Integrationen für wachsende Sortimente." },
    { icon: Workflow, title: "Interne Automatisierung", text: "Wiederkehrende E-Mail-, Dokument-, Daten- und Freigabeprozesse mit Monitoring." },
    { icon: FileSearch, title: "Recherche- und Wissenssysteme", text: "Strukturierte Quellen, durchsuchbares Wissen, Rollen, Evidence und kontrollierte AI-Unterstützung." },
  ];

  return (
    <main>
      <section className="subpage-hero">
        <div className="site-container">
          <Reveal><Badge>Projektarten statt erfundener Erfolgsmeldungen</Badge></Reveal>
          <Reveal delay={100}><h1>Erfahrung zeigt sich im Umgang mit realer Komplexität.</h1></Reveal>
          <Reveal delay={200}><p>Vertrauliche Kundenprojekte werden nicht ungefragt als Marketingmaterial genutzt. Diese Übersicht zeigt deshalb typische Aufgabenfelder und technische Schwerpunkte.</p></Reveal>
        </div>
      </section>

      <section className="site-container grid gap-5 pb-8 md:grid-cols-2 lg:grid-cols-3">
        <RevealGroup stagger={80}>
          {examples.map(({ icon: Icon, title, text }) => <Card className="project-card" key={title}><Icon /><h2>{title}</h2><p>{text}</p></Card>)}
        </RevealGroup>
      </section>

      <section className="section site-container">
        <Reveal>
          <div className="cta-panel">
            <div><p className="kicker">Passender als jede Hochglanz-Referenz</p><h2>Starten Sie mit Ihrem konkreten Problem.</h2><p>Nach einer kurzen Einordnung erhalten Sie eine sachliche Empfehlung, welche Lösung sinnvoll ist und wie viele Arbeitstage realistisch sind.</p></div>
            <Button asChild size="lg"><Link href={`/${locale}/kontakt`}>Projekt einordnen lassen <ArrowRight className="size-4" /></Link></Button>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
