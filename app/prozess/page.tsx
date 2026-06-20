import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, FileCheck2, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { processSteps } from "@/lib/site-data";

export const metadata: Metadata = { title: "Arbeitsweise", description: "Ein klarer, AI-gestützter Entwicklungsprozess mit persönlicher Verantwortung, transparentem Aufwand, Tests und Übergabe." };

export default function ProcessPage() {
  return (
    <main>
      <section className="subpage-hero"><div className="site-container"><Badge>Von der Idee zum geprüften Produkt</Badge><h1>Geschwindigkeit ohne Blindflug.</h1><p>AI-gestützte Entwicklung ist nur dann wertvoll, wenn Ziel, Verantwortung, Prüfungen und Übergabe klar bleiben. Deshalb wird jedes Vorhaben in nachvollziehbaren Schritten geführt.</p></div></section>
      <section className="site-container pb-8"><div className="timeline">{processSteps.map(({ n, title, text, icon: Icon }) => <article key={n}><div className="timeline-number">{n}</div><div className="timeline-icon"><Icon /></div><div><h2>{title}</h2><p>{text}</p></div></article>)}</div></section>
      <section className="section muted-section"><div className="site-container grid gap-5 lg:grid-cols-3">
        <Card className="process-proof"><FileCheck2 /><h3>Scope vor Start</h3><p>Funktionen, Inhalte, Integrationen, Annahmen und bewusst ausgeschlossene Punkte werden dokumentiert.</p></Card>
        <Card className="process-proof"><CheckCircle2 /><h3>Prüfung während der Arbeit</h3><p>Darstellung, zentrale Nutzerwege, Formulare, Schnittstellen und relevante Fehlerpfade werden nicht erst am Ende betrachtet.</p></Card>
        <Card className="process-proof"><ShieldCheck /><h3>Übergabe ohne Abhängigkeit</h3><p>Code, Konfiguration, Dokumentation und Betriebsinformationen bleiben nachvollziehbar. Unnötiger Anbieter-Lock-in wird vermieden.</p></Card>
      </div></section>
      <section className="section site-container"><div className="cta-panel"><div><p className="kicker">Der nächste Schritt</p><h2>Ein gutes Projekt beginnt mit einem präzisen Ziel.</h2><p>Beschreiben Sie, was heute nicht funktioniert und welches Ergebnis Ihr Unternehmen braucht. Daraus entsteht die erste Aufwandsspanne.</p></div><Button asChild size="lg"><Link href="/kontakt">Projekt beschreiben <ArrowRight className="size-4" /></Link></Button></div></section>
    </main>
  );
}
