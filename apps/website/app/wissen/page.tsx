import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, CircleDollarSign, Scale, ShieldCheck } from "lucide-react";
import { Reveal, RevealGroup } from "@/components/reveal";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = { title: "Wissen", description: "Grundlagen zu Projektpreisen, AI-gestützter Entwicklung, Datenschutz und wartbaren digitalen Produkten." };

const topics = [
  { href: "/preise", icon: CircleDollarSign, title: "Warum Arbeitstage fairer sind", text: "Eine transparente Kalkulation macht Annahmen, Scope und Zusatzaufwand sichtbar." },
  { href: "/ki-hinweise", icon: ShieldCheck, title: "AI-gestützt, aber verantwortlich", text: "Wo AI Arbeit beschleunigt und warum menschliche Prüfung unverzichtbar bleibt." },
  { href: "/datenschutz", icon: Scale, title: "Datensparsame Website", text: "Welche Daten technisch verarbeitet werden und warum unnötiges Tracking vermieden wird." },
  { href: "/prozess", icon: BookOpenCheck, title: "Vom Ziel zur Abnahme", text: "Ein klarer Entwicklungsprozess mit Scope, Tests und nachvollziehbarer Übergabe." },
];

export default function KnowledgePage() {
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
