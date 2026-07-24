import { NextResponse } from "next/server";
import { proxyPost } from "@/lib/backend";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: { name?: string; email?: string; message?: string; type?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }

  if (!body.email || !body.message) {
    return NextResponse.json(
      { error: "Bitte E-Mail-Adresse und Nachricht angeben." },
      { status: 400 },
    );
  }

  try {
    const upstream = await proxyPost("/api/contact", body);
    if (upstream) return upstream;
  } catch {
    return NextResponse.json(
      { error: "Nachricht konnte nicht übermittelt werden. Bitte per E-Mail an mail@nexifyai.cloud." },
      { status: 502 },
    );
  }

  // No backend configured — fail honestly instead of pretending it was sent.
  return NextResponse.json(
    { error: "Kontaktversand ist derzeit nicht konfiguriert. Bitte per E-Mail an mail@nexifyai.cloud." },
    { status: 503 },
  );
}
