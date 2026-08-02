import { NextRequest, NextResponse } from "next/server";

const locales = ["de", "en", "nl"] as const;
type Locale = (typeof locales)[number];
/** DACH-first: German is the only acquisition/default UI locale. NL = seat, not default. */
const defaultLocale: Locale = "de";

/**
 * PR47 / Emergent SoT: public marketing site uses UNPREFIXED routes
 * (`/`, `/leistungen`, …) with client-side LanguageProvider (nexify-lang).
 *
 * Historically, middleware forced `/{locale}/…` which served the alternate
 * `app/[locale]/*` tree and suppressed the Emergent HomePage design.
 * See DECISION-2026-07-25-WEBSITE-LAYOUT-SOT-PR47-EMERGENT.
 *
 * Locale policy (LOCALE-DE-STANDARD): never redirect acquisition to NL/EN via
 * Accept-Language or geo. Cookie default is always `de` when unset.
 */
function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  // Strip legacy locale prefixes → Emergent unprefixed routes
  // (preserves explicit user choice in cookie; does not invent NL from headers)
  if (isLocale(first)) {
    const rest = segments.slice(1).join("/");
    const url = request.nextUrl.clone();
    url.pathname = rest ? `/${rest}` : "/";
    const response = NextResponse.redirect(url, 308);
    response.cookies.set("NEXT_LOCALE", first, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return response;
  }

  // Pass through unprefixed routes; ensure DE default cookie (ignore Accept-Language)
  const response = NextResponse.next();
  const existing = request.cookies.get("NEXT_LOCALE")?.value;
  if (!isLocale(existing)) {
    response.cookies.set("NEXT_LOCALE", defaultLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next|api|favicon|.*\\..*).*)"],
};
