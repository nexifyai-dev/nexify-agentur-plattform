import { Quote } from "lucide-react";
import { RevealGroup } from "@/components/reveal";

const testimonials = [
  {
    quote: "In drei Tagen eine vollständige Website – und das Ergebnis sieht aus wie von einer großen Agentur. Pascal hat sofort verstanden, was wir brauchen.",
    author: "Geschäftsführer",
    company: "B2B-Dienstleister",
    industry: "IT-Beratung",
  },
  {
    quote: "Endlich ein Entwickler, der ehrlich sagt, was sinnvoll ist und was nicht. Kein Technologie-Bla, sondern klare Empfehlungen.",
    author: "Inhaberin",
    company: "E-Commerce",
    industry: "Handel",
  },
  {
    quote: "Der Preis war transparent, die Kommunikation direkt, das Ergebnis termingerecht. So sollte Zusammenarbeit immer laufen.",
    author: "CTO",
    company: "SaaS-Startup",
    industry: "Technologie",
  },
];

export function TestimonialStrip() {
  return (
    <section className="py-20 border-y border-[var(--border)]">
      <div className="site-container">
        <RevealGroup stagger={100} className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.author} className="p-6 rounded-[var(--r-lg)] border border-[var(--border)] bg-[var(--bg-surface)]">
              <Quote className="size-5 text-[var(--text-4)] mb-4" />
              <blockquote className="text-[15px] leading-[1.7] text-[var(--text-2)] font-light mb-6">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[var(--border)] flex items-center justify-center text-[11px] font-medium text-[var(--text-3)]">
                  {t.author.charAt(0)}
                </div>
                <div>
                  <p className="text-[13px] text-[var(--text-1)] font-medium">{t.author}</p>
                  <p className="font-mono text-[10px] text-[var(--text-4)] uppercase tracking-[.1em]">{t.industry}</p>
                </div>
              </div>
            </div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
