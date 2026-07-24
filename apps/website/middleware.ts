import { NextRequest, NextResponse } from "next/server";

const locales = ["de", "en", "nl"] as const;
type Locale = (typeof locales)[number];
const defaultLocale: Locale = "de";

// App routes that live OUTSIDE the localized content tree (auth/account/utility
// pages under app/*, and the /docs/vollbetrieb rewrite). Without this, the locale
// middleware rewrote e.g. /login → /de/login, which has no page → 404, making the
// entire login/admin/account flow unreachable.
const nonLocalizedPrefixes = ["login", "admin", "konto", "registrieren", "rueckruf", "docs"];

function getLocaleFromHeaders(request: NextRequest): Locale {
  const accept = request.headers.get("accept-language") ?? "";
  for (const lang of accept.split(",").map((l) => l.split(";")[0].trim().toLowerCase())) {
    if (lang.startsWith("nl")) return "nl";
    if (lang.startsWith("en")) return "en";
    if (lang.startsWith("de")) return "de";
  }
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip internal paths
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Skip non-localized app routes (auth/account/utility, docs) so they serve
  // their pages directly instead of being redirected into a missing /{locale}/… path.
  const firstSegment = pathname.split("/")[1];
  if (nonLocalizedPrefixes.includes(firstSegment)) {
    return NextResponse.next();
  }

  // Check if locale is already in URL
  const hasLocale = locales.some((l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`);
  if (hasLocale) {
    return NextResponse.next();
  }

  // Determine locale: cookie > header > default
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value as Locale | undefined;
  const locale = cookieLocale && locales.includes(cookieLocale) ? cookieLocale : getLocaleFromHeaders(request);

  // Redirect to locale-prefixed URL
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|favicon|.*\\..*).*)"],
};
