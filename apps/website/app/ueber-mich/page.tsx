import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bot, BrainCircuit, Check, UserRoundCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { company } from "@/lib/site-data";

export const metadata: Metadata = { title: "Über Pascal Courbois", description: "Persönliche Verantwortung, Erfahrung und AI-gestützte Entwicklung für Websites, Apps, Shops und Automatisierung." };

export default function AboutPage() {
  return (
    <main>
      <section className="subpage-hero about-hero"><div className="site-container grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-center"><div className="portrait-card"><div className="portrait-monogram">PC</div><span>{company.owner}</span><small>Inhaber · IT-Berater · Entwickler</small></div><div><Badge>Erfahrung vor Hype</Badge><h1>Ihr Projekt wird von einem Fachmann geführt – nicht von einer anonymen Produktionskette.</h1><p>Pascal Courbois verbindet unternehmerische Perspektive, technische Umsetzung und moderne AI-gestützte Werkzeuge. Alter und Erfahrung sind dabei kein Nachteil, sondern die Grundlage für ruhigere Entscheidungen, klare Kommunikation und Verantwortung bis zum Ergebnis.</p><div className="hero-actions"><Button asChild size="lg"><Link href="/kontakt">Direkt mit Pascal sprechen <ArrowRight className="size-4" /></Link></Button></div></div></div></section>
      <section className="section site-container"><div className="grid gap-5 lg:grid-cols-3">
        <Card className="about-card"><UserRoundCheck /><h2>Persönlich verantwortlich</h2><p>Kein Verkaufsgespräch mit anschließender Weitergabe. Derjenige, der den Scope versteht, trifft auch die technischen Entscheidungen und prüft die Umsetzung.</p></Card>
        <Card className="about-card"><BrainCircuit /><h2>Erfahrung als Filter</h2><p>Nicht jede neue Technologie ist sinnvoll. Erfahrung hilft, unnötige Komplexität, Lock-in, Folgekosten und technische Schulden früh zu erkennen.</p></Card>
        <Card className="about-card"><Bot /><h2>AI als Werkzeug</h2><p>AI beschleunigt Recherche, Design, Code, Tests und Dokumentation. Sie ersetzt nicht Urteilskraft, Verantwortung, Datenschutz oder Qualitätskontrolle.</p></Card>
      </div></section>
      <section className="site-container pb-8"><div className="principles-panel"><div><p className="kicker">Arbeitsprinzipien</p><h2>Woran Sie die Zusammenarbeit messen können.</h2></div><ul><li><Check />Klare Aussagen statt technischer Nebel</li><li><Check />Vorhandene Open-Source-Lösungen vor unnötigem Neubau</li><li><Check />Wartbarkeit und Betrieb vor kurzfristigem Show-Effekt</li><li><Check />Ehrliche Grenzen und sichtbarer Zusatzaufwand</li><li><Check />Tests und Nachweise statt bloßer Fertigmeldung</li><li><Check />Direkte B2B-Kommunikation auf Augenhöhe</li></ul></div></section>
    </main>
  );
}
