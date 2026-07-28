"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CalendarCheck2, CheckCircle2, PhoneCall } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { api } from "@/lib/auth";
import { useLang } from "@/lib/lang-context";

type Slot = { id: string; start_at: string; duration_min: number };

const T = {
  de: {
    eyebrow: "Persönlicher Rückruf",
    title: "Buchen Sie Ihren festen Rückruf-Termin",
    intro: "Wählen Sie ein freies Zeitfenster – Pascal Courbois ruft Sie persönlich und pünktlich an. Verbindlich, kostenlos und ohne Umwege.",
    pick: "1. Zeitfenster wählen",
    details: "2. Ihre Kontaktdaten",
    none: "Aktuell sind alle Zeitfenster vergeben. Bitte schauen Sie in Kürze wieder vorbei oder senden Sie uns eine Nachricht über das Kontaktformular.",
    name: "Ihr Name *",
    email: "E-Mail *",
    phone: "Telefonnummer für den Rückruf *",
    company: "Unternehmen",
    topic: "Worum geht es? (optional)",
    privacy: "Ich habe die Datenschutzerklärung zur Kenntnis genommen. *",
    submit: "Rückruf verbindlich buchen",
    submitting: "Wird gebucht …",
    successTitle: "Termin bestätigt!",
    successText: "Ihr Rückruf-Termin ist verbindlich gebucht. Eine Bestätigung ist unterwegs an Ihre E-Mail-Adresse.",
    successWhen: "Ihr Termin:",
    back: "Zur Startseite",
    minutes: "Min.",
    contactAlt: "Lieber schriftlich? Zum Kontaktformular",
  },
  en: {
    eyebrow: "Personal Callback",
    title: "Book Your Fixed Callback Appointment",
    intro: "Choose an available time slot – Pascal Courbois will call you personally and punctually. Binding, free and without detours.",
    pick: "1. Choose a time slot",
    details: "2. Your contact details",
    none: "All time slots are currently taken. Please check back soon or send us a message via the contact form.",
    name: "Your name *",
    email: "Email *",
    phone: "Phone number for callback *",
    company: "Company",
    topic: "What is it about? (optional)",
    privacy: "I have read and understood the privacy policy. *",
    submit: "Book callback appointment",
    submitting: "Booking …",
    successTitle: "Appointment confirmed!",
    successText: "Your callback appointment has been booked. A confirmation is on its way to your email address.",
    successWhen: "Your appointment:",
    back: "Back to homepage",
    minutes: "min.",
    contactAlt: "Prefer writing? To the contact form",
  },
  nl: {
    eyebrow: "Persoonlijk teruggebeld",
    title: "Boek uw vaste terugbelafspraak",
    intro: "Kies een vrij tijdslot – Pascal Courbois belt u persoonlijk en stipt op tijd. Bindend, gratis en zonder omwegen.",
    pick: "1. Kies een tijdslot",
    details: "2. Uw contactgegevens",
    none: "Momenteel zijn alle tijdsloten bezet. Kom binnenkort terug of stuur ons een bericht via het contactformulier.",
    name: "Uw naam *",
    email: "E-mail *",
    phone: "Telefoonnummer voor het terugbellen *",
    company: "Bedrijf",
    topic: "Waar gaat het om? (optioneel)",
    privacy: "Ik heb kennisgenomen van de privacyverklaring. *",
    submit: "Terugbelafspraak definitief boeken",
    submitting: "Wordt geboekt …",
    successTitle: "Afspraak bevestigd!",
    successText: "Uw terugbelafspraak is definitief geboekt. Een bevestiging is onderweg naar uw e-mailadres.",
    successWhen: "Uw afspraak:",
    back: "Naar de startpagina",
    minutes: "min.",
    contactAlt: "Liever schriftelijk? Naar het contactformulier",
  },
};

export function CallbackPage() {
  const { lang } = useLang();
  const t = T[lang];
  const locale = lang === "en" ? "en-GB" : lang === "nl" ? "nl-NL" : "de-DE";
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Slot | null>(null);
  const [f, setF] = useState({ name: "", email: "", phone: "", company: "", topic: "", privacy: false });
  const [state, setState] = useState("");
  const [booked, setBooked] = useState<string | null>(null);

  useEffect(() => {
    api("/api/booking/slots").then((s) => { setSlots(s); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const grouped = useMemo(() => {
    const g: Record<string, Slot[]> = {};
    for (const s of slots) {
      const day = new Date(s.start_at).toLocaleDateString(locale, { weekday: "long", day: "2-digit", month: "long", year: "numeric", timeZone: "Europe/Amsterdam" });
      (g[day] ??= []).push(s);
    }
    return g;
  }, [slots, locale]);

  const timeOf = (s: Slot) => new Date(s.start_at).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Amsterdam" });

  const submit = async () => {
    if (!selected) return;
    setState("sending");
    try {
      const d = await api("/api/booking/book", {
        method: "POST",
        body: JSON.stringify({ slot_id: selected.id, name: f.name, email: f.email, phone: f.phone, company: f.company || null, topic: f.topic || null, language: lang }),
      });
      setBooked(d.formatted);
      setState("");
    } catch (e) {
      setState(e instanceof Error ? e.message : String(e));
      api("/api/booking/slots").then(setSlots).catch(() => {});
    }
  };

  if (booked) {
    return (
      <main className="pb-16 pt-28 md:pb-24 md:pt-40" data-testid="callback-page">
        <div className="site-container max-w-xl text-center">
          <Reveal>
            <div className="glass p-12" data-testid="booking-success">
              <CheckCircle2 size={44} className="mx-auto text-emerald-400" />
              <h1 className="mt-6 font-[family-name:var(--font-heading)] text-3xl font-light text-white">{t.successTitle}</h1>
              <p className="mt-4 text-zinc-400">{t.successText}</p>
              <p className="mt-6 text-sm uppercase tracking-[0.2em] text-zinc-500">{t.successWhen}</p>
              <p className="mt-2 text-xl font-semibold text-white">{booked}</p>
              <Link href="/" className="btn-ghost mt-8 !py-2.5 text-sm">{t.back}</Link>
            </div>
          </Reveal>
        </div>
      </main>
    );
  }

  return (
    <main className="pb-16 pt-28 md:pb-24 md:pt-36" data-testid="callback-page">
      <div className="site-container">
        <Reveal>
          <span className="eyebrow">{t.eyebrow}</span>
          <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-heading)] text-4xl font-light tracking-tight text-white sm:text-5xl">{t.title}</h1>
          <p className="mt-5 max-w-2xl text-lg text-zinc-400">{t.intro}</p>
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <div>
              <h2 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">
                <CalendarCheck2 size={13} /> {t.pick}
              </h2>
              {loading && <p className="mt-5 text-sm text-zinc-500">…</p>}
              {!loading && slots.length === 0 && (
                <div className="glass mt-5 p-6 text-sm leading-relaxed text-zinc-400" data-testid="no-slots">
                  {t.none}
                  <div className="mt-4"><Link href="/kontakt" className="btn-ghost !py-2 !text-[12px]">{t.contactAlt}</Link></div>
                </div>
              )}
              <div className="mt-5 space-y-6">
                {Object.entries(grouped).map(([day, daySlots]) => (
                  <div key={day}>
                    <div className="text-[13px] font-semibold capitalize text-zinc-300">{day}</div>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {daySlots.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => setSelected(s)}
                          data-testid={`booking-slot-${s.id}`}
                          className={`rounded-full border px-4 py-2 text-[13px] font-semibold transition-all ${selected?.id === s.id ? "border-white/70 bg-white text-black" : "border-white/15 text-zinc-300 hover:border-white/40 hover:text-white"}`}
                        >
                          {timeOf(s)} · {s.duration_min} {t.minutes}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="glass space-y-3 p-6">
              <h2 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">
                <PhoneCall size={13} /> {t.details}
              </h2>
              <input className="field" placeholder={t.name} value={f.name} onChange={(e) => setF((x) => ({ ...x, name: e.target.value }))} data-testid="booking-name" />
              <input className="field" type="email" placeholder={t.email} value={f.email} onChange={(e) => setF((x) => ({ ...x, email: e.target.value }))} data-testid="booking-email" />
              <input className="field" type="tel" placeholder={t.phone} value={f.phone} onChange={(e) => setF((x) => ({ ...x, phone: e.target.value }))} data-testid="booking-phone" />
              <input className="field" placeholder={t.company} value={f.company} onChange={(e) => setF((x) => ({ ...x, company: e.target.value }))} />
              <textarea className="field min-h-20" placeholder={t.topic} value={f.topic} onChange={(e) => setF((x) => ({ ...x, topic: e.target.value }))} />
              <label className="flex items-start gap-2.5 text-[12px] leading-relaxed text-zinc-500">
                <input type="checkbox" className="mt-0.5 accent-white" checked={f.privacy} onChange={(e) => setF((x) => ({ ...x, privacy: e.target.checked }))} data-testid="booking-privacy" />
                <span>
                  {t.privacy} <Link href="/datenschutz" className="underline hover:text-white">Datenschutz</Link>
                </span>
              </label>
              <button
                className="btn-primary w-full !py-3 !text-[14px]"
                onClick={submit}
                disabled={!selected || !f.name || !f.email || !f.phone || !f.privacy || state === "sending"}
                data-testid="booking-submit"
              >
                {state === "sending" ? t.submitting : t.submit}
              </button>
              {selected && (
                <p className="text-center text-[12px] text-zinc-500">
                  {new Date(selected.start_at).toLocaleString(locale, { weekday: "long", day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Amsterdam" })}
                </p>
              )}
              {state && state !== "sending" && <p className="text-sm text-red-400" data-testid="booking-error">{state}</p>}
            </div>
          </Reveal>
        </div>
      </div>
    </main>
  );
}
