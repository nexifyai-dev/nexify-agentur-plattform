import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BrainCircuit, GitBranch, ShieldCheck, Workflow } from "lucide-react";
import { OperatorVisual } from "@/components/operator-visual";
import { Reveal, RevealGroup } from "@/components/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getTranslations, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = getTranslations(locale as Locale);
  return { title: "NeXify Operator System", description: t.meta.description };
}

export default async function PlatformPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const items = [
    { icon: Workflow, title: "Aufträge und Workflows", text: "Arbeit wird als klarer Task mit Status, Verantwortlichkeit, nächsten Schritten und Blockern geführt." },
    { icon: BrainCircuit, title: "Wissen und Kontext", text: "Projektregeln, Entscheidungen, Dateien und Evidence werden nicht in einzelnen Chats verloren." },
    { icon: ShieldCheck, title: "Policy und Freigaben", text: "Sichere interne Schritte laufen effizient; riskante Änderungen erhalten bewusst definierte Freigaben." },
    { icon: GitBranch, title: "Code und Betrieb", text: "Repos, Tests, Deployments und Live-Status werden als zusammenhängende technische Wahrheit behandelt." },
  ];

  return (
    <main>
      <section className="subpage-hero">
        <div className="site-container grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
          <div>
            <Reveal><Badge>NeXify Operator System</Badge></Reveal>
            <Reveal delay={100}><h1>AI-gestützte Arbeit wird erst mit Kontrolle zum Betrieb.</h1></Reveal>
            <Reveal delay={200}><p>Die Operator-Shell ist das interne System hinter der Arbeitsweise: Aufgaben, Agenten, Wissen, Tools, Freigaben, Tests und Evidence arbeiten in einem nachvollziehbaren Prozess.</p></Reveal>
            <Reveal delay={300}>
              <div className="hero-actions">
                <Button asChild size="lg"><Link href={`/${locale}/kontakt`}>Automatisierung besprechen <ArrowRight className="size-4" /></Link></Button>
              </div>
            </Reveal>
          </div>
          <Reveal delay={200}><OperatorVisual /></Reveal>
        </div>
      </section>

      <section className="site-container grid gap-5 pb-8 md:grid-cols-2">
        <RevealGroup stagger={100}>
          {items.map(({ icon: Icon, title, text }) => (
            <Card key={title} className="platform-card"><Icon /><h2>{title}</h2><p>{text}</p></Card>
          ))}
        </RevealGroup>
      </section>
    </main>
  );
}
