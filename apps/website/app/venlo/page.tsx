import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { company } from "@/lib/company";
import {
  breadcrumbListJsonLd,
  localBusinessPlaceJsonLd,
  pageMetadata,
} from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Webentwicklung & AI-Agentur in Venlo — NeXify AI",
  description:
    "NeXify AI in Venlo (NL): Websites, Web-Apps und AI-Automatisierung für KMU in der Grenzregion DE/NL. Persönlich vor Ort, Tagessatz 449 € netto.",
  path: "/venlo",
  ogTitle: "NeXify AI in Venlo — Web & AI für DE/NL",
  ogDescription:
    "Lokale AI-Agentur in Venlo: Premium-Websites, Apps und Automatisierung zum Tagessatz 449 € netto. Grenzregion Limburg, DACH + NL.",
});

const breadcrumbJsonLd = breadcrumbListJsonLd([
  { name: "Home", path: "/" },
  { name: "Venlo", path: "/venlo" },
]);

const localJsonLd = localBusinessPlaceJsonLd("/venlo");

export default function VenloPage() {
  return (
    <>
      <main className="pb-10 pt-28 md:pt-36" data-testid="venlo-page">
        <div className="site-container max-w-3xl">
          <span className="eyebrow">Standort · Venlo</span>
          <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-heading)] text-4xl font-light tracking-tight text-white sm:text-5xl">
            Webentwicklung &amp; AI-Automatisierung in Venlo
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-400">
            NeXify AI sitzt in Venlo (Niederlande) – nah an der deutschen Grenze.
            Primärmarkt für Neukunden ist der deutschsprachige DACH-Raum (DE/AT/CH);
            NL ist Firmensitz und sekundärer Sprachraum, nicht der Hauptkanal für
            Acquisition. Für Unternehmen in Limburg, Nordrhein-Westfalen und ganz
            DACH: klare Ansprechpartner, AI-beschleunigte Umsetzung, fester
            Tagessatz von {company.dayRate}&nbsp;€ netto.
          </p>

          <address
            className="mt-10 not-italic rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8"
            data-testid="venlo-address"
          >
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 shrink-0 text-zinc-400" size={18} aria-hidden />
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">
                  Adresse
                </p>
                <p className="mt-2 text-[15px] font-medium text-white">{company.legalName}</p>
                <p className="mt-1 text-[15px] leading-relaxed text-zinc-300">
                  {company.address}
                  <br />
                  {company.postalCity}
                  <br />
                  {company.country}
                </p>
                <p className="mt-4 text-sm text-zinc-400">
                  <a
                    href={`mailto:${company.email}`}
                    className="transition-colors hover:text-white"
                    data-testid="venlo-email"
                  >
                    {company.email}
                  </a>
                  {" · "}
                  <a
                    href={`tel:${company.phoneHref}`}
                    className="transition-colors hover:text-white"
                    data-testid="venlo-phone"
                  >
                    {company.phone}
                  </a>
                </p>
              </div>
            </div>
          </address>

          <div className="mt-12 space-y-5 border-t border-white/10 pt-8">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-medium text-white">
              Warum Venlo als Standort?
            </h2>
            <p className="text-[15.5px] leading-[1.85] text-zinc-300">
              Venlo liegt strategisch zwischen den Niederlanden und Deutschland.
              Viele unserer Kunden arbeiten grenzüberschreitend – sie brauchen
              B2B-Websites, Shops und interne Tools, die in DE und NL gleichermaßen
              funktionieren: Sprache, Mehrwertsteuer-Logik, und ein Partner, der
              beide Märkte kennt.
            </p>
            <p className="text-[15.5px] leading-[1.85] text-zinc-300">
              Als Einpersonen-Agentur mit AI-Werkstatt liefern wir ohne Agentur-
              Overhead: Konzeption, Design, Entwicklung und Abnahme aus einer Hand.
              Der Tagessatz bleibt transparent bei {company.dayRate}&nbsp;€ netto –
              Aufwandsspannen vor Start, kein versteckter Mehrbedarf.
            </p>
            <p className="text-[15.5px] leading-[1.85] text-zinc-300">
              Typische Aufträge aus der Region: Landingpages und Firmenwebsites,
              Web-Apps für interne Prozesse, Onlineshops und AI-gestützte
              Automatisierung (E-Mail-Routing, Angebotsdokumente, Datenbrücken).
              Details zu Bausteinen und Preisen finden Sie unter Leistungen und Preise.
            </p>
          </div>

          <nav
            className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8"
            aria-label="Weiterführende Seiten"
            data-testid="venlo-internal-links"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">
              Weiterlesen &amp; anfragen
            </p>
            <ul className="mt-4 flex flex-wrap gap-3">
              <li>
                <Link
                  href="/leistungen"
                  className="inline-flex items-center rounded-full border border-white/12 px-4 py-2 text-[13px] font-semibold text-zinc-300 transition-colors hover:border-white/25 hover:text-white"
                  data-testid="venlo-link-leistungen"
                >
                  Leistungen
                </Link>
              </li>
              <li>
                <Link
                  href="/preise"
                  className="inline-flex items-center rounded-full border border-white/12 px-4 py-2 text-[13px] font-semibold text-zinc-300 transition-colors hover:border-white/25 hover:text-white"
                  data-testid="venlo-link-preise"
                >
                  Preise ({company.dayRate} €)
                </Link>
              </li>
              <li>
                <Link
                  href="/wissen"
                  className="inline-flex items-center rounded-full border border-white/12 px-4 py-2 text-[13px] font-semibold text-zinc-300 transition-colors hover:border-white/25 hover:text-white"
                  data-testid="venlo-link-wissen"
                >
                  Wissen
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="btn-primary" data-testid="venlo-link-kontakt">
                  Kontakt <ArrowRight size={14} className="ml-1 inline" />
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </main>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={localJsonLd} />
    </>
  );
}
