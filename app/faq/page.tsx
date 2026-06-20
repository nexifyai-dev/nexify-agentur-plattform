import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { faqs } from "@/lib/site-data";

export const metadata: Metadata = { title: "Häufige Fragen", description: "Antworten zu Arbeitstagen, Preisen, AI-gestützter Entwicklung, Steuern, Technologien und Zusammenarbeit mit NeXify AI." };

export default function FaqPage() {
  return <main><section className="subpage-hero"><div className="site-container"><Badge>Häufige Fragen</Badge><h1>Klare Antworten vor dem Projektstart.</h1><p>Die wichtigsten Punkte zu Preis, Umfang, AI-gestützter Entwicklung, Steuern und Zusammenarbeit.</p></div></section><section className="site-container max-w-4xl pb-8"><div className="faq-list">{faqs.map((faq, index) => <details key={faq.q} open={index === 0}><summary><span>0{index + 1}</span>{faq.q}</summary><p>{faq.a}</p></details>)}</div><div className="mt-8 flex justify-center"><Button asChild><Link href="/kontakt">Offene Frage stellen <ArrowRight className="size-4" /></Link></Button></div></section></main>;
}
