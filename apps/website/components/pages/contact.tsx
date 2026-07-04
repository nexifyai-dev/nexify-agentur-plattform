"use client";

import { Reveal } from "@/components/reveal";
import { ContactForm, ContactSidebar } from "@/components/contact-form";
import { useContent } from "@/lib/content";

export function ContactPage() {
  const t = useContent();

  return (
    <main className="pb-10 pt-36" data-testid="contact-page">
      <div className="site-container">
        <Reveal>
          <span className="eyebrow">{t.contact.eyebrow}</span>
          <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-heading)] text-4xl font-light tracking-tight text-white sm:text-5xl">{t.contact.title}</h1>
          <p className="mt-5 max-w-2xl text-lg text-zinc-400">{t.contact.intro}</p>
        </Reveal>
        <div className="mt-14 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <Reveal>
            <ContactForm />
          </Reveal>
          <Reveal delay={120}>
            <ContactSidebar />
          </Reveal>
        </div>
      </div>
    </main>
  );
}
