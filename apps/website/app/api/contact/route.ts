import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message, type } = body;

    const contact = {
      id: `CT-${Date.now().toString(36).toUpperCase()}`,
      name: name || "",
      email: email || "",
      message: message || "",
      type: type || "general",
      status: "received",
      createdAt: new Date().toISOString(),
      reply: "Vielen Dank für Ihre Nachricht. Wir melden uns innerhalb eines Arbeitstages.",
    };

    return NextResponse.json(contact);
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }
}
