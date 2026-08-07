export const company = {
  brand: "NeXify AI",
  /** Canonical product line — never „Automat it.“ (Google typo). */
  descriptor: "Chat it. Automate it.",
  /** Full public brand string (meta, footer, JSON-LD, listings). */
  brandFull: "NeXify AI by NeXify — chat it. Automate it.",
  legalName: "NeXify AI by NeXify – Chat it. Automate it.",
  legalForm: "Eenmanszaak",
  owner: "Pascal Courbois",
  role: "Inhaber / Directeur",
  address: "Graaf van Loonstraat 1E",
  postalCity: "5921 JA Venlo",
  country: "Niederlande",
  countryNl: "Nederland",
  email: "mail@nexifyai.cloud",
  phone: "+31 6 133 188 56",
  phoneHref: "+31613318856",
  /** Public B2B WhatsApp deep link (same number as phone). */
  whatsappHref: "https://wa.me/31613318856",
  // @NEXIFYAI-MARKER: prelogin-canonical-www-20260713 — apex redirects to www
  website: "https://www.nexifyai.cloud",
  kvk: "90483944",
  vatId: "NL865786276B01",
  dayRate: 449,
  vatRate: 0.21,
  targetMarket: "Unternehmen in Deutschland, Österreich, der Schweiz und den Niederlanden",
  businessOnly: true,
  /**
   * Proposed GBP hours from legacy press kits — NOT verified as SoT.
   * Do not invent into imprint; owner confirms via issue #237 / GBP checklist.
   */
  openingHoursProposed: ["Mo-Fr 09:00-18:00", "Sa 10:00-14:00"] as const,
} as const;

export const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";
