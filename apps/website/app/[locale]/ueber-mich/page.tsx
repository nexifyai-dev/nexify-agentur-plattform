import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bot, BrainCircuit, Check, UserRoundCheck } from "lucide-react";
import { Reveal, RevealGroup } from "@/components/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { company } from "@/lib/site-data";
import { getTranslations, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = getTranslations(locale as Locale);
  return { title: "Über Pascal Courbois", description: t.meta.description };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const milestones = [
    { year: "2008", title: "Einstieg in die IT", text: "Beginn mit Webentwicklung, Systemadministration und erster Kundenprojekte." },
    { year: "2015", title: "Unternehmensgründung", text: "Gründung der eigenen IT-Beratung mit Fokus auf mittelständische Unternehmen." },
    { year: "2020", title: "Full-Stack Entwicklung", text: "Spezialisierung auf moderne Web-Standards: React, Next.js, TypeScript, Cloud-native Architekturen." },
    { year: "2024", title: "AI-gestützte Arbeitsweise", text: "Integration von AI-Werkzeugen in den gesamten Entwicklungsprozess – von der Analyse bis zum Deployment." },
    { year: "2025", title: "NeXify AI", text: "Gründung von NeXify AI als spezialisierte B2B-Agentur für AI-gestützte Webentwicklung." },
  ];

  return (
    <main>
      <section className="subpage-hero about-hero">
        <div className="site-container grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-center">
          <Reveal>
            <div className="portrait-card">
              <div className="portrait-monogram">PC</div>
              <span>{company.owner}</span>
              <small>Inhaber · IT-Berater · Entwickler</small>
            </div>
          </Reveal>
          <div>
            <Reveal delay={100}><Badge>Erfahrung vor Hype</Badge></Reveal>
            <Reveal delay={200}><h1>Ihr Projekt wird von einem Fachmann geführt – nicht von einer anonymen Produktionskette.</h1></Reveal>
            <Reveal delay={300}><p>Pascal Courbois verbindet unternehmerische Perspektive, technische Umsetzung und moderne AI-gestützte Werkzeuge. Alter und Erfahrung sind dabei kein Nachteil, sondern die Grundlage für ruhigere Entscheidungen, klare Kommunikation und Verantwortung bis zum Ergebnis.</p></Reveal>
            <Reveal delay={400}>
              <div className="hero-actions">
                <Button asChild size="lg"><Link href={`/${locale}/kontakt`}>Direkt mit Pascal sprechen <ArrowRight className="size-4" /></Link></Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section site-container">
        <Reveal>
          <div className="section-heading">
            <div><p className="kicker">Werdegang</p><h2>17+ Jahre Erfahrung in IT und Webentwicklung.</h2></div>
            <p>Von der Systemadministration über Full-Stack-Entwicklung bis zur AI-gestützten Produktionsweise – jeder Schritt hat das Verständnis für nachhaltige, betriebsfähige Lösungen vertieft.</p>
          </div>
        </Reveal>
        <RevealGroup stagger={80} className="grid gap-4 lg:grid-cols-5">
          {milestones.map((m) => (
            <div key={m.year} className="p-5 rounded-[var(--r-lg)] border border-[var(--border)] bg-[var(--bg-surface)]">
              <p className="font-mono text-[11px] text-[var(--text-4)] mb-3">{m.year}</p>
              <h3 className="text-[15px] font-semibold text-[var(--text-1)] mb-2">{m.title}</h3>
              <p className="text-[12px] text-[var(--text-2)] font-light leading-[1.7]">{m.text}</p>
            </div>
          ))}
        </RevealGroup>
      </section>

      <section className="section-muted">
        <div className="site-container">
          <RevealGroup stagger={100} className="grid gap-5 lg:grid-cols-3">
            <Card className="about-card"><UserRoundCheck /><h2>Persönlich verantwortlich</h2><p>Kein Verkaufsgespräch mit anschließender Weitergabe. Derjenige, der den Scope versteht, trifft auch die technischen Entscheidungen und prüft die Umsetzung.</p></Card>
            <Card className="about-card"><BrainCircuit /><h2>Erfahrung als Filter</h2><p>Nicht jede neue Technologie ist sinnvoll. Erfahrung hilft, unnötige Komplexität, Lock-in, Folgekosten und technische Schulden früh zu erkennen.</p></Card>
            <Card className="about-card"><Bot /><h2>AI als Werkzeug</h2><p>AI beschleunigt Recherche, Design, Code, Tests und Dokumentation. Sie ersetzt nicht Urteilskraft, Verantwortung, Datenschutz oder Qualitätskontrolle.</p></Card>
          </RevealGroup>
        </div>
      </section>

      <section className="site-container pb-8">
        <Reveal>
          <div className="principles-panel">
            <div><p className="kicker">Arbeitsprinzipien</p><h2>Woran Sie die Zusammenarbeit messen können.</h2></div>
            <ul>
              <li><Check />Klare Aussagen statt technischer Nebel</li>
              <li><Check />Vorhandene Open-Source-Lösungen vor unnötigem Neubau</li>
              <li><Check />Wartbarkeit und Betrieb vor kurzfristigem Show-Effekt</li>
              <li><Check />Ehrliche Grenzen und sichtbarer Zusatzaufwand</li>
              <li><Check />Tests und Nachweise statt bloßer Fertigmeldung</li>
              <li><Check />Direkte B2B-Kommunikation auf Augenhöhe</li>
            </ul>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
