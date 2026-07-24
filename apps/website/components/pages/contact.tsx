"use client";

import Link from "next/link";
import { PhoneCall } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { ContactForm, ContactSidebar } from "@/components/contact-form";
import { useContent } from "@/lib/content";
import { useLang } from "@/lib/lang-context";

export function ContactPage() {
  const t = useContent();
  const { lang } = useLang();
  const nl = lang === "nl";

  return (
    <main className="pb-10 pt-28 md:pt-36" data-testid="contact-page">
      <div className="site-container">
        <Reveal>
          <span className="eyebrow">{t.contact.eyebrow}</span>
          <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-heading)] text-4xl font-light tracking-tight text-white sm:text-5xl">{t.contact.title}</h1>
          <p className="mt-5 max-w-2xl text-lg text-zinc-400">{t.contact.intro}</p>
        </Reveal>
        <Reveal delay={80}>
          <div className="glass mt-10 flex flex-wrap items-center justify-between gap-4 p-6" data-testid="contact-callback-banner">
            <div className="flex items-center gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.04]">
                <PhoneCall size={18} className="text-zinc-200" />
              </span>
              <div>
                <div className="text-[15px] font-semibold text-white">{nl ? "Liever direct spreken?" : "Lieber direkt sprechen?"}</div>
                <div className="text-[13px] text-zinc-500">{nl ? "Boek een bindende terugbelafspraak – Pascal Courbois belt u persoonlijk." : "Buchen Sie einen verbindlichen Rückruf-Termin – Pascal Courbois ruft Sie persönlich an."}</div>
              </div>
            </div>
            <Link href="/rueckruf" className="btn-ghost !py-2.5 !text-[13px]" data-testid="contact-callback-btn">
              {nl ? "Tijdslot kiezen" : "Zeitfenster wählen"}
            </Link>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
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
