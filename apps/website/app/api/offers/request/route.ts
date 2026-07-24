import { NextResponse } from "next/server";
import { proxyPost } from "@/lib/backend";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: { name?: string; email?: string; type?: string; description?: string; features?: string[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }

  if (!body.email) {
    return NextResponse.json(
      { error: "Bitte eine E-Mail-Adresse angeben, damit das Angebot zugestellt werden kann." },
      { status: 400 },
    );
  }

  try {
    const upstream = await proxyPost("/api/offers/request", body);
    if (upstream) return upstream;
  } catch {
    return NextResponse.json(
      { error: "Angebot konnte nicht angefragt werden. Bitte per E-Mail an mail@nexifyai.cloud." },
      { status: 502 },
    );
  }

  // No backend configured — fail honestly instead of pretending the offer was queued.
  return NextResponse.json(
    { error: "Angebotsanfrage ist derzeit nicht konfiguriert. Bitte per E-Mail an mail@nexifyai.cloud." },
    { status: 503 },
  );
}
