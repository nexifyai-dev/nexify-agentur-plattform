// FILE: apps/website/lib/delight-copy.ts
// NIR: 02.08.2026 11:15
// UPDATED: 02.08.2026 11:15
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI GTM
// WHAT: DE/EN/NL copy for post-contact delight, speed promise, portal empty state
// WHY: Neukunden P0 — warm honest next steps without fake SLAs
// BEST-PRACTICE: Single source for success UX
// PITFALL: V-DELIGHT-01: Never invent reviews or hard SLA
// DEPENDS: company
// DOCS-REF: docs/gtm/NEUKUNDEN-BEGEISTERUNG.md
// SESSION: neukunden-begeisterung-7dd5

export type DelightLang = "de" | "en" | "nl";
export type DelightVariant = "contact" | "booking" | "offer" | "lead_magnet" | "generic";

export const SPEED_PROMISE = {
  de: {
    label: "Rückmeldung · Ziel",
    text: "Persönliche Antwort in der Regel innerhalb eines Werktags — oft schneller. Kein Fake-SLA, kein Chatbot-Pingpong.",
  },
  en: {
    label: "Response · target",
    text: "Personal reply usually within one working day — often sooner. Honest target, not a fake SLA.",
  },
  nl: {
    label: "Reactie · doel",
    text: "Persoonlijk antwoord meestal binnen één werkdag — vaak sneller. Eerlijk doel, geen nep-SLA.",
  },
} as const;

const STEPS = {
  de: {
    contact: [
      { when: "Sofort", what: "Bestätigung per E-Mail (falls Versand aktiv)." },
      { when: "≤ 1 Werktag", what: "Pascal meldet sich persönlich mit Einschätzung und nächsten Schritten." },
      { when: "Optional", what: "Rückruf-Termin oder Chat — Sie wählen den Kanal." },
    ],
    booking: [
      { when: "Sofort", what: "Termin ist verbindlich; Kalender-Bestätigung geht per E-Mail raus." },
      { when: "Vor dem Termin", what: "Klarheit über Ihr Ziel reicht als Vorbereitung." },
      { when: "Am Termin", what: "Pascal ruft pünktlich an — persönlich, ohne Callcenter." },
    ],
    offer: [
      { when: "Sofort", what: "Anfrage ist bei uns; Eingangsbestätigung folgt." },
      { when: "≤ 1 Werktag", what: "Schriftliches Angebot mit Aufwandsspanne und Annahmen." },
      { when: "Danach", what: "Fragen im Portal oder per Rückruf — ohne Druck." },
    ],
    lead_magnet: [
      { when: "Sofort", what: "Anfrage erfasst — Checkliste folgt per E-Mail (PDF wird ergänzt)." },
      { when: "≤ 1 Werktag", what: "Persönlicher Hinweis bei Fragen zur Liste." },
      { when: "Optional", what: "Rückruf oder Vergleichsseite — nur wenn Sie möchten." },
    ],
    generic: [
      { when: "Sofort", what: "Ihre Nachricht ist angekommen." },
      { when: "≤ 1 Werktag", what: "Persönliche Rückmeldung von Pascal." },
      { when: "Optional", what: "Termin, WhatsApp oder E-Mail — Sie bestimmen." },
    ],
  },
  en: {
    contact: [
      { when: "Now", what: "Email confirmation (when mail delivery is active)." },
      { when: "≤ 1 working day", what: "Pascal replies personally with assessment and next steps." },
      { when: "Optional", what: "Callback or chat — you choose." },
    ],
    booking: [
      { when: "Now", what: "Slot booked; calendar confirmation by email." },
      { when: "Before the call", what: "Clarity on your goal is enough." },
      { when: "At the time", what: "Pascal calls on time — personally." },
    ],
    offer: [
      { when: "Now", what: "Request received; confirmation follows." },
      { when: "≤ 1 working day", what: "Written offer with effort range and assumptions." },
      { when: "After", what: "Clarify in portal or via callback — no pressure." },
    ],
    lead_magnet: [
      { when: "Now", what: "Request logged — checklist follows by email (PDF in progress)." },
      { when: "≤ 1 working day", what: "Personal note if you have questions." },
      { when: "Optional", what: "Callback or comparison page — only if you want." },
    ],
    generic: [
      { when: "Now", what: "Your message has arrived." },
      { when: "≤ 1 working day", what: "Personal reply from Pascal." },
      { when: "Optional", what: "Call, WhatsApp or email — your choice." },
    ],
  },
  nl: {
    contact: [
      { when: "Direct", what: "Bevestiging per e-mail (als verzending actief is)." },
      { when: "≤ 1 werkdag", what: "Pascal reageert persoonlijk met inschatting en vervolgstappen." },
      { when: "Optioneel", what: "Terugbelafspraak of chat — u kiest." },
    ],
    booking: [
      { when: "Direct", what: "Afspraak staat vast; kalenderbevestiging per e-mail." },
      { when: "Vooraf", what: "Duidelijkheid over uw doel is genoeg." },
      { when: "Op het moment", what: "Pascal belt stipt — persoonlijk." },
    ],
    offer: [
      { when: "Direct", what: "Aanvraag ontvangen; bevestiging volgt." },
      { when: "≤ 1 werkdag", what: "Schriftelijke offerte met urenraming en aannames." },
      { when: "Daarna", what: "Vragen in portaal of via terugbel — zonder druk." },
    ],
    lead_magnet: [
      { when: "Direct", what: "Aanvraag vastgelegd — checklist volgt per e-mail (PDF volgt)." },
      { when: "≤ 1 werkdag", what: "Persoonlijke tip bij vragen over de lijst." },
      { when: "Optioneel", what: "Terugbel of vergelijkingspagina — alleen als u wilt." },
    ],
    generic: [
      { when: "Direct", what: "Uw bericht is aangekomen." },
      { when: "≤ 1 werkdag", what: "Persoonlijke reactie van Pascal." },
      { when: "Optioneel", what: "Gesprek, WhatsApp of e-mail — u bepaalt." },
    ],
  },
} as const;

export const DELIGHT = {
  de: {
    titles: {
      contact: "Danke — Ihre Anfrage ist bei uns.",
      booking: "Termin bestätigt — wir freuen uns.",
      offer: "Angebotswunsch erhalten.",
      lead_magnet: "Danke — Checkliste unterwegs.",
      generic: "Danke — wir haben Sie gehört.",
    },
    bodies: {
      contact: "Sie haben den wichtigsten Schritt getan. Als Nächstes prüfen wir Ihr Vorhaben persönlich — ehrlich, ohne Umsatzdruck.",
      booking: "Ihr Rückruf ist verbindlich. Wir rufen pünktlich an. Bei Verschiebung reicht eine kurze Mail oder WhatsApp.",
      offer: "Wir bereiten eine transparente Aufwandsspanne vor — ohne Fake-Kennzahlen.",
      lead_magnet: "Die Checkliste hilft, Website- und KI-Projekte nüchtern zu prüfen. Parallel: Rückruf oder Nachricht.",
      generic: "Wir melden uns persönlich. Bis dahin: Termin, E-Mail oder WhatsApp.",
    },
    nextTitle: "Was als Nächstes passiert",
    followUp: "Persönliches Follow-up durch Pascal Courbois — kein Callcenter.",
    ctaBook: "Rückruf-Termin sichern",
    ctaMail: "Per E-Mail schreiben",
    ctaWhatsApp: "WhatsApp öffnen",
    ctaHome: "Zur Startseite",
    ctaPortal: "Zum Kundenportal",
    ctaCompare: "Preisvergleich ansehen",
    steps: STEPS.de,
  },
  en: {
    titles: {
      contact: "Thank you — we have your enquiry.",
      booking: "Appointment confirmed — looking forward to it.",
      offer: "Offer request received.",
      lead_magnet: "Thanks — checklist on its way.",
      generic: "Thank you — we heard you.",
    },
    bodies: {
      contact: "You took the most important step. Next we review your project personally — honestly, without sales pressure.",
      booking: "Your callback is binding. We call on time. Reschedule via email or WhatsApp.",
      offer: "We prepare a transparent effort range — no fake metrics.",
      lead_magnet: "The checklist helps assess website and AI projects calmly.",
      generic: "We reply personally. Until then: call, email or WhatsApp.",
    },
    nextTitle: "What happens next",
    followUp: "Personal follow-up by Pascal Courbois — no call centre.",
    ctaBook: "Book a callback",
    ctaMail: "Write by email",
    ctaWhatsApp: "Open WhatsApp",
    ctaHome: "Back to homepage",
    ctaPortal: "Customer portal",
    ctaCompare: "See price comparison",
    steps: STEPS.en,
  },
  nl: {
    titles: {
      contact: "Dank u — uw aanvraag is binnen.",
      booking: "Afspraak bevestigd — we kijken ernaar uit.",
      offer: "Offerteverzoek ontvangen.",
      lead_magnet: "Dank u — checklist onderweg.",
      generic: "Dank u — we hebben u gehoord.",
    },
    bodies: {
      contact: "U zette de belangrijkste stap. Daarna bekijken we uw plan persoonlijk — eerlijk, zonder verkoopdruk.",
      booking: "Uw terugbelafspraak staat vast. We bellen stipt. Verplaatsen via mail of WhatsApp.",
      offer: "We bereiden een transparante urenraming voor — geen nep-cijfers.",
      lead_magnet: "De checklist helpt website- en AI-projecten nuchter te toetsen.",
      generic: "We reageren persoonlijk. Tot die tijd: belafspraak, mail of WhatsApp.",
    },
    nextTitle: "Wat er hierna gebeurt",
    followUp: "Persoonlijke follow-up door Pascal Courbois — geen callcenter.",
    ctaBook: "Terugbelafspraak boeken",
    ctaMail: "Mail sturen",
    ctaWhatsApp: "WhatsApp openen",
    ctaHome: "Naar de startpagina",
    ctaPortal: "Klantportaal",
    ctaCompare: "Prijsvergelijking bekijken",
    steps: STEPS.nl,
  },
} as const;

export const PORTAL_EMPTY = {
  de: {
    eyebrow: "Willkommen im Portal",
    title: "Hier startet Ihre Zusammenarbeit — klar und ruhig.",
    body: "Noch keine Angebote? Kein Problem. Fordern Sie unten eines an oder sichern Sie einen Rückruf. Wir begleiten Sie Schritt für Schritt.",
    guideTitle: "Empfohlene nächste Schritte",
    steps: [
      "Profil kurz vervollständigen (Name, Firma, Telefon).",
      "Vorhaben skizzieren — wir melden uns ≤ 1 Werktag.",
      "Optional: Rückruf buchen oder WhatsApp.",
    ],
    ctaRequest: "Zum Anfragefeld unten",
    ctaBook: "Rückruf buchen",
    ctaWhatsApp: "WhatsApp",
  },
  en: {
    eyebrow: "Welcome to the portal",
    title: "Your collaboration starts here — clear and calm.",
    body: "No offers yet? Request one below or book a callback. We guide you step by step.",
    guideTitle: "Suggested next steps",
    steps: [
      "Complete your profile (name, company, phone).",
      "Sketch your project — we reply within ≤ 1 working day.",
      "Optional: book a callback or WhatsApp.",
    ],
    ctaRequest: "Jump to request form",
    ctaBook: "Book callback",
    ctaWhatsApp: "WhatsApp",
  },
  nl: {
    eyebrow: "Welkom in het portaal",
    title: "Hier begint uw samenwerking — helder en rustig.",
    body: "Nog geen offertes? Vraag er hieronder een aan of plan een terugbel.",
    guideTitle: "Aanbevolen vervolgstappen",
    steps: [
      "Profiel kort aanvullen.",
      "Plan schetsen — reactie ≤ 1 werkdag.",
      "Optioneel: terugbel of WhatsApp.",
    ],
    ctaRequest: "Naar het aanvraagveld",
    ctaBook: "Terugbel boeken",
    ctaWhatsApp: "WhatsApp",
  },
} as const;

export function delightFor(lang: DelightLang, variant: DelightVariant) {
  const d = DELIGHT[lang];
  return {
    title: d.titles[variant],
    body: d.bodies[variant],
    nextTitle: d.nextTitle,
    followUp: d.followUp,
    steps: d.steps[variant],
    ctaBook: d.ctaBook,
    ctaMail: d.ctaMail,
    ctaWhatsApp: d.ctaWhatsApp,
    ctaHome: d.ctaHome,
    ctaPortal: d.ctaPortal,
    ctaCompare: d.ctaCompare,
  };
}
