import { company } from "@/lib/site-data";
import type { LegalPage } from "@/lib/legal-content";

export const legalPagesEn: Record<string, LegalPage> = {
  impressum: {
    slug: "impressum",
    title: "Legal Notice",
    intro: "Company information and contact details of NeXifyAI by NeXify – Chat it. Automate it.",
    updated: "4 July 2026",
    sections: [
      { heading: "Company Details", paragraphs: [`${company.legalName}`, `${company.legalForm}, Owner: ${company.owner}`, `${company.address}, ${company.postalCity}, ${company.country}`] },
      { heading: "Contact", paragraphs: [`Email: ${company.email}`, `Phone: ${company.phone}`, `Web: nexifyai.cloud`] },
      { heading: "Registration & Tax", paragraphs: [`Chamber of Commerce (KvK): ${company.kvk}`, `VAT ID: ${company.vatId}`, "Scope: IT consulting, AI-powered automation and software development."] },
      { heading: "Representation", paragraphs: [`${company.owner}, Owner / Director. Responsible for editorial content: ${company.owner}.`] },
      { heading: "B2B Focus", paragraphs: ["This offering is exclusively aimed at businesses, legal entities and comparable organisations acting in their professional capacity."] },
      { heading: "Liability", paragraphs: ["Content is created with care. Liability is only accepted where expressly agreed or legally required."] },
    ],
  },
  datenschutz: {
    slug: "datenschutz",
    title: "Privacy Policy",
    intro: "Information on the processing of personal data in accordance with the GDPR.",
    updated: "4 July 2026",
    sections: [
      { heading: "1. Controller", paragraphs: [`${company.legalName}, ${company.address}, ${company.postalCity}, ${company.country}. Contact: ${company.email}.`] },
      { heading: "2. Principles", paragraphs: ["NeXifyAI processes personal data purpose-bound and proportionately. This website operates without marketing tracking by default."] },
      { heading: "3. Hosting", paragraphs: ["Technical data may be processed for delivery, stability and abuse prevention. Legal basis: legitimate interest."] },
      { heading: "4. Contact Form", paragraphs: ["Contact details are processed for inquiry handling and pre-contractual communication."] },
      { heading: "5. AI Processing", paragraphs: ["AI tools may be used for structuring, development and testing. Personal data is only transferred when necessary, contractually permitted and adequately secured."] },
      { heading: "6. Your Rights", bullets: ["Access, rectification, erasure", "Data portability", "Objection to processing based on legitimate interests", "Complaint to the Dutch Data Protection Authority (Autoriteit Persoonsgegevens)"] },
    ],
  },
  agb: {
    slug: "agb",
    title: "Terms & Conditions (B2B)",
    intro: "Contractual basis for services provided by NeXifyAI.",
    updated: "4 July 2026",
    sections: [
      { heading: "1. Scope", paragraphs: ["These terms apply to agreements with businesses. No consumer agreements are concluded."] },
      { heading: "2. Pricing", paragraphs: [`€${company.dayRate}/day net. Excluding VAT. Reverse charge may apply for cross-border B2B services.`] },
      { heading: "3. AI Support", paragraphs: ["AI accelerates work; responsibility remains with the developer."] },
      { heading: "4. Liability", paragraphs: ["Limited to contractually foreseeable damage."] },
      { heading: "5. Governing Law", paragraphs: ["Dutch law. Forum: seat of NeXifyAI."] },
    ],
  },
  "ki-hinweise": {
    slug: "ki-hinweise",
    title: "AI Disclosure",
    intro: "How NeXifyAI uses AI tools.",
    updated: "4 July 2026",
    sections: [
      { heading: "AI-Assisted", paragraphs: ["AI accelerates processes; humans remain responsible."] },
      { heading: "Control", bullets: ["Expert directs decisions", "AI output is reviewed", "High-risk: no AI-only decisions"] },
    ],
  },
  "cookie-richtlinie": {
    slug: "cookie-richtlinie",
    title: "Cookie Policy",
    intro: "No marketing tracking by default.",
    updated: "4 July 2026",
    sections: [
      { heading: "Essential", paragraphs: ["Technical cookies for functionality."] },
      { heading: "No Marketing", paragraphs: ["No tracking cookies without consent."] },
    ],
  },
  avv: {
    slug: "avv",
    title: "Data Processing Agreement",
    intro: "For processing on behalf of clients.",
    updated: "4 July 2026",
    sections: [
      { heading: "When Required", paragraphs: ["When processing personal data solely on client instructions."] },
      { heading: "Components", bullets: ["Purpose and scope", "Technical measures", "Incident reporting"] },
    ],
  },
  widerruf: {
    slug: "widerruf",
    title: "Right of Withdrawal",
    intro: "B2B only. No consumer right of withdrawal.",
    updated: "4 July 2026",
    sections: [
      { heading: "No Consumer Agreement", paragraphs: ["Agreements are concluded exclusively with businesses. Consumer withdrawal rights do not apply."] },
    ],
  },
};
