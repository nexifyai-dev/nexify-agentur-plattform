import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { company } from "@/lib/site-data";

export const metadata: Metadata = { title: "Kontakt", description: "Projektanfrage an NeXify AI: Ziel, Umfang und gewünschte Funktionen beschreiben und eine transparente Aufwandsspanne erhalten." };

export default function ContactPage() {
  return (
    <main>
      <section className="subpage-hero"><div className="site-container"><Badge>Direkter B2B-Kontakt</Badge><h1>Was soll für Ihr Unternehmen entstehen?</h1><p>Je klarer Ziel, Nutzer und bestehende Systeme beschrieben sind, desto belastbarer kann der Aufwand in Arbeitstagen eingeordnet werden.</p></div></section>
      <section className="site-container grid gap-7 pb-8 lg:grid-cols-[1.2fr_.8fr]">
        <ContactForm />
        <div className="grid content-start gap-5">
          <Card className="contact-card"><p className="kicker">Direkt erreichbar</p><a href={`mailto:${company.email}`}><Mail />{company.email}</a><a href={`tel:${company.phoneHref}`}><Phone />{company.phone}</a><span><MapPin />{company.address}<br />{company.postalCity}, {company.country}</span></Card>
          <Card className="contact-card"><p className="kicker">Für eine gute Ersteinschätzung</p><ul><li>Welches Ergebnis soll erreicht werden?</li><li>Wer nutzt die Lösung?</li><li>Welche Systeme oder Inhalte existieren bereits?</li><li>Welche Funktionen sind zum Start unverzichtbar?</li><li>Gibt es einen festen Termin oder externe Abhängigkeiten?</li></ul></Card>
          <Card className="contact-card subtle"><strong>Ausschließlich B2B</strong><p>NeXifyAI arbeitet nur mit Unternehmern, Organisationen und beruflich handelnden Auftraggebern.</p></Card>
        </div>
      </section>
    </main>
  );
}
