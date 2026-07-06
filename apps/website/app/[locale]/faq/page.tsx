import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal, RevealGroup } from "@/components/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { faqs } from "@/lib/site-data";
import { getTranslations, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = getTranslations(locale as Locale);
  return { title: "FAQ", description: t.faq.subtitle };
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getTranslations(locale as Locale);

  return (
    <main>
      <section className="subpage-hero">
        <div className="site-container">
          <Reveal><Badge>{t.faq.kicker}</Badge></Reveal>
          <Reveal delay={100}><h1>{t.faq.title}</h1></Reveal>
          <Reveal delay={200}><p>{t.faq.subtitle}</p></Reveal>
        </div>
      </section>

      <section className="site-container max-w-4xl pb-8">
        <RevealGroup stagger={60} className="faq-list">
          {faqs.map((faq, index) => (
            <details key={faq.q} open={index === 0}>
              <summary><span>0{index + 1}</span>{faq.q}</summary>
              <p>{faq.a}</p>
            </details>
          ))}
        </RevealGroup>
        <Reveal>
          <div className="mt-8 flex justify-center">
            <Button asChild><Link href={`/${locale}/kontakt`}>Offene Frage stellen <ArrowRight className="size-4" /></Link></Button>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
