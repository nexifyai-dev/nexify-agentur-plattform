import { NextResponse } from "next/server";

// Liveness/readiness probe consumed by docker-compose healthcheck,
// the Traefik loadBalancer healthCheck, deploy.sh and infra/scripts/health-check.sh.
// Kept dependency-free and uncached so it reflects the running process, not a build snapshot.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export function GET() {
  return NextResponse.json(
    {
      status: "ok",
      service: "nexify-website",
      version: process.env.NEXT_PUBLIC_APP_VERSION ?? "1.0.0",
      timestamp: new Date().toISOString(),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
