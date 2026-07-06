import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/reveal";
import type { LegalPage as LegalPageType } from "@/lib/legal-content";

export function LegalPage({ page }: { page: LegalPageType }) {
  return (
    <main>
      <section className="subpage-hero compact">
        <div className="site-container max-w-4xl">
          <Reveal><Badge>Rechtliche Informationen</Badge></Reveal>
          <Reveal delay={100}><h1>{page.title}</h1></Reveal>
          <Reveal delay={200}><p>{page.intro}</p></Reveal>
          <Reveal delay={250}><span className="mt-6 block font-mono text-[11px] uppercase tracking-[.14em] text-[var(--text-4)]">Stand: {page.updated}</span></Reveal>
        </div>
      </section>
      <section className="site-container max-w-4xl pb-12">
        <Reveal>
          <div className="legal-document">
            {page.sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.paragraphs?.map((p) => <p key={p}>{p}</p>)}
                {section.bullets && <ul>{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul>}
              </section>
            ))}
          </div>
        </Reveal>
        <Reveal delay={100}>
          <p className="mt-8 rounded-[var(--r-lg)] border border-[var(--border)] bg-[var(--bg-surface)] p-5 font-mono text-[11px] leading-[1.7] text-[var(--text-4)]">
            Diese Website-Fassung bildet die aktuell bereitgestellten Unternehmens- und Prozessangaben ab. Projektbezogene Verträge, steuerliche Behandlung und Auftragsverarbeitung können zusätzliche Vereinbarungen erfordern.
          </p>
        </Reveal>
      </section>
    </main>
  );
}
