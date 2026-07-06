import { company } from "@/lib/site-data";
import type { LegalPage } from "@/lib/legal-content";

export const legalPagesNl: Record<string, LegalPage> = {
  impressum: {
    slug: "impressum",
    title: "Impressum",
    intro: "Bedrijfsgegevens en contactinformatie van NeXifyAI by NeXify – Chat it. Automate it.",
    updated: "4 juli 2026",
    sections: [
      { heading: "Bedrijfsgegevens", paragraphs: [`${company.legalName}`, `${company.legalForm}, Eigenaar: ${company.owner}`, `${company.address}, ${company.postalCity}, ${company.country}`] },
      { heading: "Contact", paragraphs: [`E-mail: ${company.email}`, `Telefoon: ${company.phone}`, `Web: nexify-automate.com`] },
      { heading: "KVK- en btw-gegevens", paragraphs: [`Kamer van Koophandel (KvK): ${company.kvk}`, `Btw-identificatienummer: ${company.vatId}`, "Werkterrein: IT-advies, AI-ondersteunde automatisering en softwareontwikkeling."] },
      { heading: "Vertegenwoordiging", paragraphs: [`${company.owner}, Eigenaar / Directeur.`] },
      { heading: "B2B-oriëntatie", paragraphs: ["Het aanbod is uitsluitend gericht op ondernemers en rechtspersonen."] },
      { heading: "Aansprakelijkheid", paragraphs: ["De inhoud wordt met zorg samengesteld. Aansprakelijkheid alleen voor zover wettelijk verplicht."] },
    ],
  },
  datenschutz: {
    slug: "datenschutz",
    title: "Privacyverklaring",
    intro: "Informatie over de verwerking van persoonsgegevens conform de AVG.",
    updated: "4 juli 2026",
    sections: [
      { heading: "1. Verantwoordelijke", paragraphs: [`${company.legalName}, ${company.address}, ${company.postalCity}. Contact: ${company.email}.`] },
      { heading: "2. Uitgangspunten", paragraphs: ["Verwerking doelgebonden en proportioneel. Standaard geen marketing-tracking."] },
      { heading: "3. Hosting", paragraphs: ["Technische gegevens voor levering en beveiliging. Rechtsgrondslag: gerechtvaardigd belang."] },
      { heading: "4. Contactformulier", paragraphs: ["Verwerking van contactgegevens voor aanvraagverwerking."] },
      { heading: "5. AI-verwerking", paragraphs: ["AI-tools voor versnelling. Persoonsgegevens alleen als noodzakelijk en beveiligd."] },
      { heading: "6. Rechten", bullets: ["Inzage, correctie, verwijdering", "Klacht bij Autoriteit Persoonsgegevens"] },
    ],
  },
  agb: {
    slug: "agb",
    title: "Algemene Voorwaarden (B2B)",
    intro: "Contractuele basis voor diensten van NeXifyAI.",
    updated: "4 juli 2026",
    sections: [
      { heading: "1. Toepassing", paragraphs: ["Alleen voor ondernemers. Geen consumentenovereenkomsten."] },
      { heading: "2. Prijs", paragraphs: [`€${company.dayRate}/dag netto. Exclusief btw. Verleggingsregeling mogelijk.`] },
      { heading: "3. AI-ondersteuning", paragraphs: ["AI versnelt werk, verantwoordelijkheid blijft bij ontwikkelaar."] },
      { heading: "4. Aansprakelijkheid", paragraphs: ["Beperkt tot contracttypisch voorzienbare schade."] },
      { heading: "5. Recht", paragraphs: ["Nederlands recht. Forum: zetel NeXifyAI."] },
    ],
  },
  "ki-hinweise": {
    slug: "ki-hinweise",
    title: "AI-mededelingen",
    intro: "Hoe NeXifyAI AI-tools inzet.",
    updated: "4 juli 2026",
    sections: [
      { heading: "AI-ondersteund", paragraphs: ["AI versnelt processen, mens blijft verantwoordelijk."] },
      { heading: "Controle", bullets: ["Vakman stuurt aan", "AI-uitvoer wordt getoetst", "Hoogrisico: geen AI-only"] },
    ],
  },
  "cookie-richtlinie": {
    slug: "cookie-richtlinie",
    title: "Cookie-mededelingen",
    intro: "Standaard geen marketing-tracking.",
    updated: "4 juli 2026",
    sections: [
      { heading: "Noodzakelijk", paragraphs: ["Technische cookies voor functionaliteit."] },
      { heading: "Geen marketing", paragraphs: ["Zonder toestemming geen tracking."] },
    ],
  },
  avv: {
    slug: "avv",
    title: "Verwerkersovereenkomst",
    intro: "Voor verwerking in opdracht.",
    updated: "4 juli 2026",
    sections: [
      { heading: "Vereist", paragraphs: ["Bij verwerking volgens klantinstructie."] },
      { heading: "Onderdelen", bullets: ["Doel verwerking", "Maatregelen", "Incidentmelding"] },
    ],
  },
  widerruf: {
    slug: "widerruf",
    title: "Herroepingsrecht",
    intro: "Alleen B2B. Geen consumentenrecht.",
    updated: "4 juli 2026",
    sections: [
      { heading: "Geen consument", paragraphs: ["Alleen overeenkomsten met ondernemers. Herroepingsrecht niet van toepassing."] },
    ],
  },
};
