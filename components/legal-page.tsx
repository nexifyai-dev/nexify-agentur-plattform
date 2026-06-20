import { Badge } from "@/components/ui/badge";
import type { LegalPage as LegalPageType } from "@/lib/legal-content";

export function LegalPage({ page }: { page: LegalPageType }) {
  return (
    <main>
      <section className="subpage-hero compact">
        <div className="site-container max-w-4xl">
          <Badge>Rechtliche Informationen</Badge>
          <h1>{page.title}</h1>
          <p>{page.intro}</p>
          <span className="mt-6 block text-xs uppercase tracking-[0.15em] text-white/30">Stand: {page.updated}</span>
        </div>
      </section>
      <section className="site-container max-w-4xl pb-12">
        <div className="legal-document">
          {page.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs?.map((p) => <p key={p}>{p}</p>)}
              {section.bullets && <ul>{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul>}
            </section>
          ))}
        </div>
        <p className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 text-xs leading-5 text-white/35">Diese Website-Fassung bildet die aktuell bereitgestellten Unternehmens- und Prozessangaben ab. Projektbezogene Verträge, steuerliche Behandlung und Auftragsverarbeitung können zusätzliche Vereinbarungen erfordern.</p>
      </section>
    </main>
  );
}
