"use client";

import { useEffect, useState } from "react";
import { FileText, CreditCard, MessageSquare, LifeBuoy, UserCog, Sparkles } from "lucide-react";
import { useLang } from "@/lib/lang-context";

const STEPS = {
  de: [
    { icon: Sparkles, title: "Willkommen in Ihrem Kundenportal!", text: "Hier verwalten Sie alles rund um Ihre Zusammenarbeit mit NeXify AI – wir zeigen Ihnen kurz die wichtigsten Funktionen." },
    { icon: FileText, title: "Angebote einsehen & entscheiden", text: "Unter „Ihre Angebote“ finden Sie alle Angebote inkl. PDF-Download. Klappen Sie ein Angebot auf und nehmen Sie es mit einem Klick an – oder lehnen Sie es mit einer optionalen Nachricht ab." },
    { icon: CreditCard, title: "Ersten Tagessatz sicher bezahlen", text: "Nach der Annahme können Sie die Anzahlung (1. Arbeitstag, € 999) direkt und sicher über Revolut bezahlen. Ihr Projekt startet damit sofort." },
    { icon: MessageSquare, title: "Rückfragen direkt am Angebot", text: "Zu jedem Angebot gibt es einen Nachrichtenbereich. Ihre Fragen landen direkt bei uns – Antworten erhalten Sie hier und per E-Mail." },
    { icon: LifeBuoy, title: "Support-Tickets", text: "Für alle weiteren Anliegen eröffnen Sie einfach ein Support-Ticket. Unser AI-Support antwortet in der Regel innerhalb von 30 Minuten." },
    { icon: UserCog, title: "Ihre Daten, Ihre Kontrolle", text: "Rechts pflegen Sie Ihre Kontaktdaten. Über „Neues Angebot anfordern“ starten Sie jederzeit das nächste Projekt. Viel Erfolg!" },
  ],
  en: [
    { icon: Sparkles, title: "Welcome to Your Customer Portal!", text: "Here you manage everything about your collaboration with NeXify AI – we'll briefly show you the most important functions." },
    { icon: FileText, title: "View & Decide on Offers", text: "Under \"Your Offers\" you'll find all offers including PDF download. Open an offer and accept it with one click – or decline with an optional message." },
    { icon: CreditCard, title: "Pay First Day Rate Securely", text: "After acceptance, you can pay the deposit (1st working day, € 999) directly and securely via Revolut. Your project then starts immediately." },
    { icon: MessageSquare, title: "Inquiries Directly on the Offer", text: "Each offer has a message area. Your questions go directly to us – answers come here and by email." },
    { icon: LifeBuoy, title: "Support Tickets", text: "For all other concerns, simply open a support ticket. Our AI support typically responds within 30 minutes." },
    { icon: UserCog, title: "Your Data, Your Control", text: "On the right you manage your contact details. Use \"Request New Offer\" to start your next project anytime. Good luck!" },
  ],
  nl: [
    { icon: Sparkles, title: "Welkom in uw klantportaal!", text: "Hier beheert u alles rond uw samenwerking met NeXify AI – wij tonen u kort de belangrijkste functies." },
    { icon: FileText, title: "Offertes inzien & beslissen", text: "Onder „Uw offertes“ vindt u alle offertes incl. PDF-download. Klap een offerte open en neem deze met één klik aan – of wijs af met een optioneel bericht." },
    { icon: CreditCard, title: "Eerste dagtarief veilig betalen", text: "Na acceptatie betaalt u de aanbetaling (1e werkdag, € 999) direct en veilig via Revolut. Uw project start daarmee meteen." },
    { icon: MessageSquare, title: "Vragen direct bij de offerte", text: "Bij elke offerte hoort een berichtenveld. Uw vragen komen direct bij ons terecht – antwoorden ontvangt u hier en per e-mail." },
    { icon: LifeBuoy, title: "Support-tickets", text: "Voor alle overige vragen opent u eenvoudig een support-ticket. Onze AI-support antwoordt doorgaans binnen 30 minuten." },
    { icon: UserCog, title: "Uw gegevens, uw controle", text: "Rechts beheert u uw contactgegevens. Via „Nieuwe offerte aanvragen“ start u op elk moment het volgende project. Veel succes!" },
  ],
};

export function PortalTour() {
  const { lang } = useLang();
  const [step, setStep] = useState(-1);
  const steps = STEPS[lang];

  useEffect(() => {
    if (!window.localStorage.getItem("nexify-tour-done")) setStep(0);
  }, []);

  if (step < 0) return null;
  const s = steps[step];
  const Icon = s.icon;
  const done = () => {
    window.localStorage.setItem("nexify-tour-done", "1");
    setStep(-1);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" data-testid="portal-tour">
      <div className="w-full max-w-md rounded-3xl border border-white/15 bg-[#101013] p-8 shadow-[0_32px_80px_rgba(0,0,0,0.7)]">
        <div className="flex size-12 items-center justify-center rounded-xl border border-white/15 bg-white/[0.05]">
          <Icon size={22} className="text-zinc-200" />
        </div>
        <h2 className="mt-5 font-[family-name:var(--font-heading)] text-xl font-medium text-white">{s.title}</h2>
        <p className="mt-3 text-[14px] leading-relaxed text-zinc-400">{s.text}</p>
        <div className="mt-6 flex items-center justify-between">
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <span key={i} className={`h-1.5 rounded-full transition-all ${i === step ? "w-6 bg-white" : "w-1.5 bg-white/25"}`} />
            ))}
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-2 text-xs text-zinc-500 hover:text-white" onClick={done} data-testid="tour-skip">
              {lang === "nl" ? "Overslaan" : "Überspringen"}
            </button>
            <button
              className="btn-primary !px-5 !py-2 !text-[13px]"
              onClick={() => (step === steps.length - 1 ? done() : setStep(step + 1))}
              data-testid="tour-next"
            >
              {step === steps.length - 1 ? (lang === "nl" ? "Aan de slag" : "Los geht's") : (lang === "nl" ? "Verder" : "Weiter")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
