/**
 * Homepage-Inhalte exakt nach Anhang "NeXify Homepage.dc.html" — in DE/EN/NL.
 * DE = Anhang 1:1 (verbindlich). EN/NL = Übersetzung derselben Inhalte.
 */

export const PRICING = {
  dayRate: 449,
  maintenanceRate: 249,
  sliderMin: 1,
  sliderMax: 20,
  sliderDefault: 5,
} as const;

export interface HomeContent {
  heroBadge: string;
  heroTitleA: string;
  heroTitleB: string;
  heroSubtitle: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  floatCard1Title: string;
  floatCard1Sub: string;
  floatCard2Title: string;
  floatCard2Sub: string;
  stats: { value: string; label: string }[];
  marquee: string[];
  pillarsEyebrow: string;
  pillarsTitle: string;
  pillars: { title: string; text: string }[];
  servicesEyebrow: string;
  servicesTitle: string;
  servicesCta: string;
  services: { title: string; text: string; days: string; span: number }[];
  processEyebrow: string;
  processTitle: string;
  processSteps: { n: string; title: string; text: string }[];
  pricingEyebrow: string;
  pricingTitle: string;
  pricingDaysLabel: string;
  pricingMaintenanceTitle: string;
  pricingMaintenanceSub: string;
  pricingNotes: string[];
  pricingLine1: (days: number) => string;
  pricingLine2: string;
  pricingTotalLabel: string;
  pricingCta: string;
  referencesEyebrow: string;
  referencesTitle: string;
  testimonials: { quote: string; author: string }[];
  aboutEyebrow: string;
  aboutTitle: string;
  aboutText: string;
  faqEyebrow: string;
  faqTitle: string;
  faqs: { q: string; a: string }[];
  ctaBandTitle: string;
  ctaBandText: string;
  ctaBandBtn: string;
}

export const HOME_CONTENT: Record<'de' | 'en' | 'nl', HomeContent> = {
  de: {
    heroBadge: 'KI Automatisierung, Live Betrieb',
    heroTitleA: 'Ihr Unternehmen.',
    heroTitleB: 'Auf Autopilot.',
    heroSubtitle:
      'NeXify AI plant, baut und betreibt KI Agenten, die Anfragen beantworten, Termine buchen und Prozesse automatisieren, messbar schneller als jedes Team.',
    heroCtaPrimary: 'Kostenloses Erstgespräch',
    heroCtaSecondary: 'Leistungen ansehen',
    floatCard1Title: 'KI Berater aktiv',
    floatCard1Sub: 'DE & NL, im Chat',
    floatCard2Title: 'Richtwert: 1 bis 3 Tage',
    floatCard2Sub: '€ 449 / Umsetzungstag',
    stats: [
      { value: '340+', label: 'Automatisierte Prozesse im Live Betrieb' },
      { value: '1 bis 3 Tage', label: 'Richtwert bis zur ersten Agenten Version' },
      { value: '24/7', label: 'Verfügbarkeit der Agenten' },
      { value: 'DE / NL', label: 'Zweisprachiger Betrieb inklusive' },
    ],
    marquee: ['KI Agenten', 'Prozessautomatisierung', 'Terminbuchung', 'Angebotserstellung', 'E Mail Triage', 'Leadqualifizierung', 'Reporting', 'Wissensdatenbank'],
    pillarsEyebrow: 'Warum NeXify',
    pillarsTitle: 'Drei Prinzipien, an denen wir uns nie vorbeimogeln.',
    pillars: [
      { title: 'Messbar statt Marketing', text: 'Jede Automatisierung bekommt eine Kennzahl, an der wir uns festhalten lassen.' },
      { title: 'Betrieb statt Prototyp', text: 'Wir liefern keine Demo. Wir übernehmen den laufenden Betrieb inklusive Wartung.' },
      { title: 'Transparent statt Blackbox', text: 'Feste Tagessätze, klare Reichweite, keine versteckten Lizenzmodelle.' },
    ],
    servicesEyebrow: 'Leistungen',
    servicesTitle: 'Acht Bausteine für den automatisierten Betrieb.',
    servicesCta: 'Angebot anfragen',
    services: [
      { title: 'KI Chat Agent für Website und WhatsApp', text: 'Beantwortet Anfragen, qualifiziert Leads, übergibt nahtlos an Ihr Team.', days: '3 bis 5 Tage', span: 2 },
      { title: 'Terminbuchung Automatisierung', text: 'Kalender-Sync und automatische Bestätigungen.', days: '2 Tage', span: 1 },
      { title: 'E Mail Triage Agent', text: 'Sortiert und beantwortet eingehende Anfragen.', days: '2 bis 3 Tage', span: 1 },
      { title: 'Angebots Generator', text: 'Erstellt individuelle Angebote aus Ihren Konditionen.', days: '3 Tage', span: 1 },
      { title: 'CRM und Lead Pipeline Integration', text: 'Verbindet Ihre Agenten direkt mit dem bestehenden CRM, ohne Systembruch.', days: '4 bis 6 Tage', span: 2 },
      { title: 'Wissensdatenbank Agent', text: 'Beantwortet interne Fragen aus Ihrer Dokumentation.', days: '3 Tage', span: 1 },
      { title: 'Reporting Dashboard', text: 'Live Kennzahlen zu allen automatisierten Prozessen.', days: '2 Tage', span: 1 },
      { title: 'Monitoring und Wartung', text: 'Laufende Pflege und Weiterentwicklung im Abo.', days: 'laufend', span: 1 },
    ],
    processEyebrow: 'Prozess',
    processTitle: 'Fünf Schritte vom Erstgespräch zum Live-Betrieb.',
    processSteps: [
      { n: '01', title: 'Erstgespräch', text: 'Wir hören zu und skizzieren den ersten Anwendungsfall.' },
      { n: '02', title: 'Konzept', text: 'Konkreter Umfang, Aufwand und Zeitplan in Tagen.' },
      { n: '03', title: 'Umsetzung', text: 'Bau und Test des Agenten an echten Anfragen.' },
      { n: '04', title: 'Go Live', text: 'Übergabe in den produktiven Betrieb.' },
      { n: '05', title: 'Betrieb', text: 'Monitoring, Anpassungen, laufende Betreuung.' },
    ],
    pricingEyebrow: 'Preise',
    pricingTitle: 'Transparent kalkuliert. Kein Kleingedrucktes.',
    pricingDaysLabel: 'Umsetzungstage',
    pricingMaintenanceTitle: 'Laufende Betreuung',
    pricingMaintenanceSub: 'Monitoring, Anpassungen, Support',
    pricingNotes: ['Festpreis pro Tag', 'Kein Abo Zwang', 'DE & NL inklusive'],
    pricingLine1: (days: number) => `Umsetzung (${days} Tage à € 449)`,
    pricingLine2: 'Laufende Betreuung / Monat',
    pricingTotalLabel: 'Gesamt einmalig',
    pricingCta: 'Angebot anfragen',
    referencesEyebrow: 'Referenzen',
    referencesTitle: 'Stimmen aus dem laufenden Betrieb.',
    testimonials: [
      { quote: 'Der Agent beantwortet heute mehr Anfragen als unser gesamtes Team vorher, und das rund um die Uhr.', author: 'Geschäftsführung, Handwerksbetrieb' },
      { quote: 'Feste Tagessätze statt Lizenzchaos, endlich planbare Kosten für KI.', author: 'Leitung Verwaltung, Dienstleister' },
      { quote: 'Von der Idee bis zum Live Betrieb hat es genau drei Tage gedauert.', author: 'Inhaber, Einzelhandel' },
    ],
    aboutEyebrow: 'Über uns',
    aboutTitle: 'Gebaut von Praktikern, nicht von Buzzwords.',
    aboutText:
      'NeXify AI entstand aus der täglichen Arbeit mit Betrieben, die ihre Prozesse automatisieren wollten, aber keine Zeit für Experimente hatten. Wir bauen Agenten, testen sie an echten Fällen und übernehmen den laufenden Betrieb, nicht nur die Einführung.',
    faqEyebrow: 'FAQ',
    faqTitle: 'Häufige Fragen.',
    faqs: [
      { q: 'Wie schnell ist ein Agent einsatzbereit?', a: 'Die meisten Anwendungsfälle sind innerhalb von 1 bis 5 Umsetzungstagen live, je nach Komplexität der Anbindung.' },
      { q: 'Was kostet der laufende Betrieb?', a: 'Umsetzung wird pro Tag abgerechnet, laufende Betreuung optional im Monatspreis, ohne Mindestlaufzeit.' },
      { q: 'Funktioniert das auch auf Niederländisch?', a: 'Ja, alle Agenten werden standardmäßig zweisprachig DE/NL ausgeliefert.' },
      { q: 'Brauchen wir eigene Entwickler?', a: 'Nein, wir übernehmen Bau, Anbindung und Wartung vollständig.' },
      { q: 'Wie sicher sind unsere Daten?', a: 'Daten verbleiben in EU Infrastruktur, klare Auftragsverarbeitung nach AVV.' },
    ],
    ctaBandTitle: 'Lassen Sie uns Ihren ersten Agenten bauen.',
    ctaBandText: 'Kostenloses Erstgespräch, unverbindliche Einschätzung, Start in dieser Woche möglich.',
    ctaBandBtn: 'Termin anfragen',
  },
  en: {
    heroBadge: 'AI automation, live in production',
    heroTitleA: 'Your business.',
    heroTitleB: 'On autopilot.',
    heroSubtitle:
      'NeXify AI plans, builds and operates AI agents that answer enquiries, book appointments and automate processes — measurably faster than any team.',
    heroCtaPrimary: 'Free first consultation',
    heroCtaSecondary: 'View services',
    floatCard1Title: 'AI advisor active',
    floatCard1Sub: 'DE & NL, in chat',
    floatCard2Title: 'Guide: 1 to 3 days',
    floatCard2Sub: '€ 449 / implementation day',
    stats: [
      { value: '340+', label: 'Automated processes in live operation' },
      { value: '1 to 3 days', label: 'Guide to first agent version' },
      { value: '24/7', label: 'Agent availability' },
      { value: 'DE / NL', label: 'Bilingual operation included' },
    ],
    marquee: ['AI Agents', 'Process automation', 'Appointment booking', 'Proposal creation', 'Email triage', 'Lead qualification', 'Reporting', 'Knowledge base'],
    pillarsEyebrow: 'Why NeXify',
    pillarsTitle: 'Three principles we never cut corners on.',
    pillars: [
      { title: 'Measurable instead of marketing', text: 'Every automation gets a metric we hold ourselves to.' },
      { title: 'Operation instead of prototype', text: 'We do not deliver demos. We take over ongoing operation including maintenance.' },
      { title: 'Transparent instead of black box', text: 'Fixed day rates, clear scope, no hidden licensing models.' },
    ],
    servicesEyebrow: 'Services',
    servicesTitle: 'Eight building blocks for automated operation.',
    servicesCta: 'Request a quote',
    services: [
      { title: 'AI chat agent for website and WhatsApp', text: 'Answers enquiries, qualifies leads, hands over seamlessly to your team.', days: '3 to 5 days', span: 2 },
      { title: 'Appointment booking automation', text: 'Calendar sync and automatic confirmations.', days: '2 days', span: 1 },
      { title: 'Email triage agent', text: 'Sorts and answers incoming enquiries.', days: '2 to 3 days', span: 1 },
      { title: 'Proposal generator', text: 'Creates individual proposals from your conditions.', days: '3 days', span: 1 },
      { title: 'CRM and lead pipeline integration', text: 'Connects your agents directly to your existing CRM without friction.', days: '4 to 6 days', span: 2 },
      { title: 'Knowledge base agent', text: 'Answers internal questions from your documentation.', days: '3 days', span: 1 },
      { title: 'Reporting dashboard', text: 'Live metrics for all automated processes.', days: '2 days', span: 1 },
      { title: 'Monitoring and maintenance', text: 'Ongoing care and development in a subscription.', days: 'ongoing', span: 1 },
    ],
    processEyebrow: 'Process',
    processTitle: 'Five steps from first conversation to live operation.',
    processSteps: [
      { n: '01', title: 'First conversation', text: 'We listen and outline the first use case.' },
      { n: '02', title: 'Concept', text: 'Concrete scope, effort and schedule in days.' },
      { n: '03', title: 'Implementation', text: 'Building and testing the agent on real enquiries.' },
      { n: '04', title: 'Go live', text: 'Handover into productive operation.' },
      { n: '05', title: 'Operation', text: 'Monitoring, adjustments, ongoing support.' },
    ],
    pricingEyebrow: 'Pricing',
    pricingTitle: 'Transparent calculation. No fine print.',
    pricingDaysLabel: 'Implementation days',
    pricingMaintenanceTitle: 'Ongoing support',
    pricingMaintenanceSub: 'Monitoring, adjustments, support',
    pricingNotes: ['Fixed price per day', 'No subscription required', 'DE & NL included'],
    pricingLine1: (days: number) => `Implementation (${days} days at € 449)`,
    pricingLine2: 'Ongoing support / month',
    pricingTotalLabel: 'Total one-off',
    pricingCta: 'Request a quote',
    referencesEyebrow: 'References',
    referencesTitle: 'Voices from live operation.',
    testimonials: [
      { quote: 'The agent now answers more enquiries than our entire team before — around the clock.', author: 'Management, trade business' },
      { quote: 'Fixed day rates instead of license chaos, finally predictable AI costs.', author: 'Administration lead, service provider' },
      { quote: 'From idea to live operation took exactly three days.', author: 'Owner, retail' },
    ],
    aboutEyebrow: 'About us',
    aboutTitle: 'Built by practitioners, not buzzwords.',
    aboutText:
      'NeXify AI grew out of daily work with businesses that wanted to automate their processes but had no time for experiments. We build agents, test them on real cases and take over ongoing operation — not just the introduction.',
    faqEyebrow: 'FAQ',
    faqTitle: 'Frequently asked questions.',
    faqs: [
      { q: 'How fast is an agent ready?', a: 'Most use cases go live within 1 to 5 implementation days, depending on integration complexity.' },
      { q: 'What does ongoing operation cost?', a: 'Implementation is billed per day, ongoing support optionally per month, without minimum term.' },
      { q: 'Does it work in Dutch too?', a: 'Yes, all agents are delivered bilingual DE/NL by default.' },
      { q: 'Do we need our own developers?', a: 'No, we handle building, integration and maintenance completely.' },
      { q: 'How secure is our data?', a: 'Data stays in EU infrastructure, clear data processing under DPA.' },
    ],
    ctaBandTitle: 'Let us build your first agent.',
    ctaBandText: 'Free first consultation, non-binding assessment, start possible this week.',
    ctaBandBtn: 'Request an appointment',
  },
  nl: {
    heroBadge: 'AI-automatisering, live in bedrijf',
    heroTitleA: 'Uw bedrijf.',
    heroTitleB: 'Op automatische piloot.',
    heroSubtitle:
      'NeXify AI plant, bouwt en beheert KI-agents die vragen beantwoorden, afspraken boeken en processen automatiseren — meetbaar sneller dan elk team.',
    heroCtaPrimary: 'Gratis eerste gesprek',
    heroCtaSecondary: 'Bekijk diensten',
    floatCard1Title: 'KI-adviseur actief',
    floatCard1Sub: 'DE & NL, in chat',
    floatCard2Title: 'Richtwaarde: 1 tot 3 dagen',
    floatCard2Sub: '€ 449 / implementatiedag',
    stats: [
      { value: '340+', label: 'Geautomatiseerde processen in live bedrijf' },
      { value: '1 tot 3 dagen', label: 'Richtwaarde tot eerste agentversie' },
      { value: '24/7', label: 'Beschikbaarheid van de agents' },
      { value: 'DE / NL', label: 'Tweetalige bedrijfsvoering inbegrepen' },
    ],
    marquee: ['KI-agents', 'Procesautomatisering', 'Afspraakboeking', 'Offertecreatie', 'E-mailtriage', 'Leadkwalificatie', 'Reporting', 'Kennisbank'],
    pillarsEyebrow: 'Waarom NeXify',
    pillarsTitle: 'Drie principes waar we nooit aan voorbijgaan.',
    pillars: [
      { title: 'Meetbaar in plaats van marketing', text: 'Elke automatisering krijgt een meetwaarde waar we ons aan houden.' },
      { title: 'Bedrijf in plaats van prototype', text: 'Wij leveren geen demo. Wij nemen het lopende beheer inclusief onderhoud over.' },
      { title: 'Transparant in plaats van black box', text: 'Vaste dagtarieven, duidelijke scope, geen verborgen licentiemodellen.' },
    ],
    servicesEyebrow: 'Diensten',
    servicesTitle: 'Acht bouwstenen voor geautomatiseerde bedrijfsvoering.',
    servicesCta: 'Offerte aanvragen',
    services: [
      { title: 'KI-chatagent voor website en WhatsApp', text: 'Beantwoordt vragen, kwalificeert leads, draagt naadloos over aan uw team.', days: '3 tot 5 dagen', span: 2 },
      { title: 'Afspraakboeking automatisering', text: 'Kalendersynchronisatie en automatische bevestigingen.', days: '2 dagen', span: 1 },
      { title: 'E-mailtriage-agent', text: 'Sorteert en beantwoordt binnenkomende vragen.', days: '2 tot 3 dagen', span: 1 },
      { title: 'Offertegenerator', text: 'Maakt individuele offertes op basis van uw voorwaarden.', days: '3 dagen', span: 1 },
      { title: 'CRM- en leadpipeline-integratie', text: 'Verbindt uw agents direct met uw bestaande CRM, zonder systeembreuk.', days: '4 tot 6 dagen', span: 2 },
      { title: 'Kennisbank-agent', text: 'Beantwoordt interne vragen uit uw documentatie.', days: '3 dagen', span: 1 },
      { title: 'Reportingdashboard', text: 'Live cijfers voor alle geautomatiseerde processen.', days: '2 dagen', span: 1 },
      { title: 'Monitoring en onderhoud', text: 'Lopend beheer en doorontwikkeling in abonnement.', days: 'doorlopend', span: 1 },
    ],
    processEyebrow: 'Proces',
    processTitle: 'Vijf stappen van eerste gesprek tot live bedrijf.',
    processSteps: [
      { n: '01', title: 'Eerste gesprek', text: 'Wij luisteren en schetsen de eerste use case.' },
      { n: '02', title: 'Concept', text: 'Concrete scope, inzet en planning in dagen.' },
      { n: '03', title: 'Implementatie', text: 'Bouwen en testen van de agent op echte vragen.' },
      { n: '04', title: 'Go live', text: 'Overdracht naar productieve bedrijfsvoering.' },
      { n: '05', title: 'Bedrijf', text: 'Monitoring, aanpassingen, doorlopende begeleiding.' },
    ],
    pricingEyebrow: 'Prijzen',
    pricingTitle: 'Transparant berekend. Geen kleine lettertjes.',
    pricingDaysLabel: 'Implementatiedagen',
    pricingMaintenanceTitle: 'Doorlopende begeleiding',
    pricingMaintenanceSub: 'Monitoring, aanpassingen, support',
    pricingNotes: ['Vaste prijs per dag', 'Geen abonnementsdwang', 'DE & NL inbegrepen'],
    pricingLine1: (days: number) => `Implementatie (${days} dagen à € 449)`,
    pricingLine2: 'Doorlopende begeleiding / maand',
    pricingTotalLabel: 'Totaal eenmalig',
    pricingCta: 'Offerte aanvragen',
    referencesEyebrow: 'Referenties',
    referencesTitle: 'Stemmen uit het lopende bedrijf.',
    testimonials: [
      { quote: 'De agent beantwoordt nu meer vragen dan ons hele team voorheen — dag en nacht.', author: 'Directie, ambachtelijk bedrijf' },
      { quote: 'Vaste dagtarieven in plaats van licentiecHaos, eindelijk voorspelbare KI-kosten.', author: 'Leiding administratie, dienstverlener' },
      { quote: 'Van idee tot live bedrijf duurde precies drie dagen.', author: 'Eigenaar, retail' },
    ],
    aboutEyebrow: 'Over ons',
    aboutTitle: 'Gebouwd door vakmensen, niet door buzzwords.',
    aboutText:
      'NeXify AI is ontstaan uit dagelijks werk met bedrijven die hun processen wilden automatiseren, maar geen tijd hadden voor experimenten. Wij bouwen agents, testen ze op echte cases en nemen het lopende beheer over — niet alleen de introductie.',
    faqEyebrow: 'FAQ',
    faqTitle: 'Veelgestelde vragen.',
    faqs: [
      { q: 'Hoe snel is een agent inzetbaar?', a: 'De meeste use cases zijn binnen 1 tot 5 implementatiedagen live, afhankelijk van de complexiteit van de koppeling.' },
      { q: 'Wat kost het lopende beheer?', a: 'Implementatie wordt per dag gefactureerd, doorlopende begeleiding optioneel per maand, zonder minimumtermijn.' },
      { q: 'Werkt het ook in het Nederlands?', a: 'Ja, alle agents worden standaard tweetalig DE/NL opgeleverd.' },
      { q: 'Hebben we eigen ontwikkelaars nodig?', a: 'Nee, wij nemen bouw, koppeling en onderhoud volledig over.' },
      { q: 'Hoe veilig zijn onze gegevens?', a: 'Gegevens blijven in EU-infrastructuur, duidelijke verwerking onder AVG.' },
    ],
    ctaBandTitle: 'Laat ons uw eerste agent bouwen.',
    ctaBandText: 'Gratis eerste gesprek, vrijblijvende inschatting, start deze week mogelijk.',
    ctaBandBtn: 'Afspraak aanvragen',
  },
};
