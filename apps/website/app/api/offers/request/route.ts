// /api/offers/request — Proxy zum Backend (api.nexifyai.cloud)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const BACKEND = (process.env.NEXT_PUBLIC_BACKEND_URL || "https://api.nexifyai.cloud") + "/api/offers/request";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const res = await fetch(BACKEND, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return new Response(await res.text(), { status: res.status, headers: { "Content-Type": "application/json" } });
  } catch (e) {
    return Response.json({ error: "offer_request_failed" }, { status: 502 });
  }
}
