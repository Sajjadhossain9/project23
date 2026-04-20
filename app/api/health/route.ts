import { NextResponse } from "next/server";

/**
 * GET /api/health
 *
 * Liveness check for Uptime Robot, Better Stack, or your monitoring of choice.
 * Returns 200 with a tiny JSON payload.
 */
export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "wevnix",
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
