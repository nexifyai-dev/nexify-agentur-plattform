export const company = {
  brand: "NeXify AI",
  descriptor: "Chat it. Automate it.",
  legalName: "NeXify AI by NeXify – chat it. Automate it.",
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
  website: "https://nexifyai.cloud",
  kvk: "90483944",
  vatId: "NL865786276B01",
  dayRate: 999,
  vatRate: 0.21,
} as const;

export const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";
