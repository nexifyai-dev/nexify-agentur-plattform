// FILE: apps/website/lib/legal-content.ts
// UPDATED: 02.08.2026 09:55
// WHAT: Re-Export der DE-Rechtstexte als legalPages (Locale-Routen)
// WHY: Eine Quelle (lib/legal/de.ts) verhindert Drift zwischen Flat- und Locale-Routen

export type {
  LegalSection,
  LegalSubsection,
  LegalRelatedLink,
  LegalPageData as LegalPage,
} from "./legal/de";

export { legalDe as legalPages } from "./legal/de";
