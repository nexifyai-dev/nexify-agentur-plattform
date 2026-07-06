import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, CircleDollarSign, Scale, ShieldCheck } from "lucide-react";
import { Reveal, RevealGroup } from "@/components/reveal";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getTranslations, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = getTranslations(locale as Locale);
  return { title: "Wissen", description: t.meta.description };
}

export default async function KnowledgePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const topics = [
    { href: `/${locale}/preise`, icon: CircleDollarSign, title: "Warum Arbeitstage fairer sind", text: "Eine transparente Kalkulation macht Annahmen, Scope und Zusatzaufwand sichtbar." },
    { href: `/${locale}/ki-hinweise`, icon: ShieldCheck, title: "AI-gestützt, aber verantwortlich", text: "Wo AI Arbeit beschleunigt und warum menschliche Prüfung unverzichtbar bleibt." },
    { href: `/${locale}/datenschutz`, icon: Scale, title: "Datensparsame Website", text: "Welche Daten technisch verarbeitet werden und warum unnötiges Tracking vermieden wird." },
    { href: `/${locale}/prozess`, icon: BookOpenCheck, title: "Vom Ziel zur Abnahme", text: "Ein klarer Entwicklungsprozess mit Scope, Tests und nachvollziehbarer Übergabe." },
  ];

  return (
    <main>
      <section className="subpage-hero">
        <div className="site-container">
          <Reveal><Badge>Orientierung für Entscheider</Badge></Reveal>
          <Reveal delay={100}><h1>Technik verständlich. Preise nachvollziehbar. Verantwortung sichtbar.</h1></Reveal>
          <Reveal delay={200}><p>Kurze Grundlagen für Unternehmen, die digitale Produkte nicht nur einkaufen, sondern wirtschaftlich und dauerhaft betreiben wollen.</p></Reveal>
        </div>
      </section>

      <section className="site-container grid gap-5 pb-8 md:grid-cols-2">
        <RevealGroup stagger={80}>
          {topics.map(({ href, icon: Icon, title, text }) => (
            <Link href={href} key={title}>
              <Card className="knowledge-card"><Icon /><h2>{title}</h2><p>{text}</p><span>Weiterlesen <ArrowRight /></span></Card>
            </Link>
          ))}
        </RevealGroup>
      </section>
    </main>
  );
}
