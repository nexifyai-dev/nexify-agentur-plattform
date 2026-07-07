import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, type, description, features } = body;

    // In production: save to Supabase, send email via Resend
    const offer = {
      id: `OFF-${Date.now().toString(36).toUpperCase()}`,
      name: name || "Unbekannt",
      email: email || "",
      type: type || "web-app",
      description: description || "",
      features: features || [],
      status: "received",
      createdAt: new Date().toISOString(),
      message: "Vielen Dank! Ihr Projektplan wird erstellt und innerhalb eines Arbeitstages per E-Mail zugestellt.",
    };

    return NextResponse.json(offer);
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }
}
