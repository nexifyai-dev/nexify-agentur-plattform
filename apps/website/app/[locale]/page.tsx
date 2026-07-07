import Link from "next/link";
import { ArrowRight, Check, Clock3, ShieldCheck, Sparkles } from "lucide-react";
import { AnimatedCounter } from "@/components/animated-counter";
import { CodeBlock } from "@/components/code-block";
import { LiveStatus } from "@/components/live-status";
import { MarqueeStrip } from "@/components/marquee-strip";
import { OperatorVisual } from "@/components/operator-visual";
import { PricingCalculator } from "@/components/pricing-calculator";
import { Reveal, RevealGroup } from "@/components/reveal";
import { TestimonialStrip } from "@/components/testimonial-strip";
import { TrustBar } from "@/components/trust-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { company, featurePillars, processSteps, services } from "@/lib/site-data";
import { euro } from "@/lib/utils";
import { getTranslations, type Locale } from "@/lib/i18n";

const techStack = [
  "Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js",
  "PostgreSQL", "Vercel", "Docker", "Supabase", "Stripe",
  "Playwright", "GitHub Actions",
];

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getTranslations(locale as Locale);

  return (
    <main>
      {/* ── Hero ── */}
      <section className="hero-section">
        <div className="hero-grid site-container">
          <div className="hero-copy">
            <Reveal>
              <div className="flex items-center gap-3 mb-6">
                <Badge><Sparkles className="mr-2 size-3 text-[var(--text-3)]" />{t.hero.badge}</Badge>
                <LiveStatus />
              </div>
            </Reveal>
            <Reveal delay={100}>
              <h1>{t.hero.headline} <span>{t.hero.highlight}</span></h1>
            </Reveal>
            <Reveal delay={200}>
              <p>{t.hero.description}</p>
            </Reveal>
            <Reveal delay={300}>
              <div className="hero-actions">
                <Button asChild size="lg"><Link href={`/${locale}/kontakt`}>{t.hero.cta} <ArrowRight className="size-4" /></Link></Button>
                <Button asChild size="lg" variant="outline"><Link href={`/${locale}/preise`}>{t.hero.ctaSecondary}</Link></Button>
              </div>
            </Reveal>
            <Reveal delay={400}>
              <div className="hero-trust">
                <span><Check />{t.hero.trust1}</span>
                <span><Check />{t.hero.trust2}</span>
                <span><Check />{t.hero.trust3}</span>
              </div>
            </Reveal>
          </div>
          <Reveal delay={200}>
            <OperatorVisual />
          </Reveal>
        </div>
      </section>

      {/* ── Trust Bar ── */}
      <TrustBar />

      {/* ── Marquee Strip ── */}
      <MarqueeStrip items={techStack} speed={40} />

      {/* ── Proof Strip ── */}
      <section className="proof-strip">
        <RevealGroup className="site-container grid grid-cols-2 lg:grid-cols-4">
          <div><strong><AnimatedCounter end={999} /><span> €</span></strong><p>{t.proof.price}</p></div>
          <div><strong><AnimatedCounter end={1} /><span> {t.proof.landing.includes("Tag") ? "Tag" : ""}</span></strong><p>{t.proof.landing}</p></div>
          <div><strong><AnimatedCounter end={3} prefix="2–" /><span> {t.proof.website.includes("Tag") ? "Tage" : ""}</span></strong><p>{t.proof.website}</p></div>
          <div><strong><AnimatedCounter end={8} prefix="6–" /><span> {t.proof.shop.includes("Tag") ? "Tage" : ""}</span></strong><p>{t.proof.shop}</p></div>
        </RevealGroup>
      </section>

      {/* ── Services ── */}
      <section className="section site-container">
        <Reveal>
          <div className="section-heading">
            <div><p className="kicker">{t.services.kicker}</p><h2>{t.services.title}</h2></div>
            <p>{t.services.subtitle}</p>
          </div>
        </Reveal>
        <RevealGroup stagger={60} className="service-grid">
          {services.map((service, index) => {
            const Icon = service.icon;
            const netMin = service.minDays * company.dayRate;
            const netMax = service.maxDays ? service.maxDays * company.dayRate : undefined;
            return (
              <Card key={service.slug} className={index === 0 ? "service-card featured" : "service-card"}>
                <CardHeader><div className="service-icon"><Icon /></div><span className="service-number">0{index + 1}</span><CardTitle>{service.shortTitle}</CardTitle><p>{service.description}</p></CardHeader>
                <CardContent><div className="service-price"><span>{service.days}</span><strong>{service.from ? "ab " : ""}{euro(netMin)}{netMax ? ` – ${euro(netMax)}` : ""}</strong></div><Link href={`/${locale}/leistungen/${service.slug}`} className="card-link">{t.services.details} <ArrowRight /></Link></CardContent>
              </Card>
            );
          })}
        </RevealGroup>
      </section>

      {/* ── Testimonials ── */}
      <TestimonialStrip />

      {/* ── Why This Price ── */}
      <section className="section section-muted">
        <div className="site-container">
          <Reveal>
            <div className="section-heading">
              <div><p className="kicker">{t.why.kicker}</p><h2>{t.why.title}</h2></div>
              <p>{t.why.subtitle}</p>
            </div>
          </Reveal>
          <RevealGroup stagger={100} className="grid gap-5 lg:grid-cols-3">
            {featurePillars.map(({ title, text, icon: Icon }) => <Card className="pillar-card" key={title}><Icon /><h3>{title}</h3><p>{text}</p></Card>)}
          </RevealGroup>
        </div>
      </section>

      {/* ── Process ── */}
      <section className="section site-container">
        <Reveal>
          <div className="section-heading"><div><p className="kicker">{t.process.kicker}</p><h2>{t.process.title}</h2></div><p>{t.process.subtitle}</p></div>
        </Reveal>
        <RevealGroup stagger={80} className="process-grid">{processSteps.map(({ n, title, text, icon: Icon }) => <article key={n}><span>{n}</span><Icon /><h3>{title}</h3><p>{text}</p></article>)}</RevealGroup>
      </section>

      {/* ── Code Block + Calculator ── */}
      <section className="section site-container">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <Reveal>
            <div>
              <p className="kicker mb-4">Technische Transparenz</p>
              <h2 className="text-2xl font-semibold tracking-[-.03em] mb-4">Klare Konfiguration statt Blackbox.</h2>
              <p className="text-[var(--text-2)] text-sm leading-relaxed mb-6 font-light">Jedes Projekt wird vor Beginn als strukturierte Konfiguration festgehalten.</p>
              <CodeBlock />
            </div>
          </Reveal>
          <Reveal delay={150}>
            <PricingCalculator />
          </Reveal>
        </div>
      </section>

      {/* ── FAQ Preview ── */}
      <section className="section site-container">
        <Reveal>
          <div className="section-heading">
            <div><p className="kicker">{t.faq.kicker}</p><h2>{t.faq.title}</h2></div>
            <p>{t.faq.subtitle}</p>
          </div>
        </Reveal>
        <Reveal>
          <div className="max-w-3xl">
            <details className="border-b border-[var(--border)] py-5" open>
              <summary className="flex items-center gap-4 cursor-pointer text-[15px] font-medium text-[var(--text-1)]">
                <span className="font-mono text-[10px] text-[var(--text-4)]">01</span>
                {locale === "de" ? "Wie kann eine Website in zwei bis drei Tagen entstehen?" : locale === "nl" ? "Hoe kan een website in twee tot drie dagen ontstaan?" : "How can a website be built in two to three days?"}
              </summary>
              <p className="pl-8 text-[13px] text-[var(--text-2)] leading-[1.8] font-light">
                {locale === "de" ? "Nicht durch Weglassen von Qualität, sondern durch einen standardisierten Ablauf, wiederverwendbare technische Grundlagen und AI-gestützte Prozesse." : locale === "nl" ? "Niet door kwaliteit weg te laten, maar door een gestandaardiseerd proces, herbruikbare technische bouwstenen en AI-ondersteunde processen." : "Not by cutting quality, but through standardized workflows, reusable technical foundations and AI-powered processes."}
              </p>
            </details>
            <details className="border-b border-[var(--border)] py-5">
              <summary className="flex items-center gap-4 cursor-pointer text-[15px] font-medium text-[var(--text-1)]">
                <span className="font-mono text-[10px] text-[var(--text-4)]">02</span>
                {locale === "de" ? "Sind 999 Euro pro Arbeitstag ein Festpreis?" : locale === "nl" ? "Zijn 999 euro per werkdag een vaste prijs?" : "Is €999 per working day a fixed price?"}
              </summary>
              <p className="pl-8 text-[13px] text-[var(--text-2)] leading-[1.8] font-light">
                {locale === "de" ? "Der Tagessatz ist fest. Vor Beginn erhalten Sie eine belastbare Aufwandsspanne." : locale === "nl" ? "Het dagtarief is vast. Voor aanvang ontvangt u een betrouwbare inschatting." : "The daily rate is fixed. Before starting, you receive a reliable cost estimate."}
              </p>
            </details>
          </div>
        </Reveal>
        <Reveal>
          <div className="mt-6">
            <Button asChild variant="outline"><Link href={`/${locale}/faq`}>{t.faq.allQuestions} <ArrowRight className="size-4" /></Link></Button>
          </div>
        </Reveal>
      </section>

      {/* ── CTA ── */}
      <section className="section site-container">
        <Reveal>
          <div className="cta-panel">
            <div><Badge>{t.cta.kicker}</Badge><h2>{t.cta.title}</h2><p>{t.cta.description}</p></div>
            <div className="grid gap-3"><Button asChild size="lg"><Link href={`/${locale}/kontakt`}>{t.cta.button} <ArrowRight className="size-4" /></Link></Button><span><Clock3 />{t.cta.response}</span><span><ShieldCheck />{t.cta.confidential}</span></div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
