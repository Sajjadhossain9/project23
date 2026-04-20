import { NextRequest, NextResponse } from "next/server";
import { validateSld, normalizeTlds, isSupportedTld } from "@/lib/domains/validator";
import { checkDomains } from "@/lib/domains/check-service";
import { checkRateLimit, clientIp } from "@/lib/domains/rate-limit";
import { SUPPORTED_TLDS, type CheckResponse, type SupportedTld } from "@/lib/domains/types";

// Edge runtime is cheaper and lower latency for network-fanout work like this.
export const runtime = "nodejs"; // keep node for now; switch to "edge" once tested
export const dynamic = "force-dynamic";

// ---------- POST — multi-TLD check ----------
export async function POST(req: NextRequest) {
  const t0 = Date.now();

  const rl = checkRateLimit(`check:${clientIp(req.headers)}`);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down.", retryAfter: rl.retryAfterSeconds },
      {
        status: 429,
        headers: {
          "Retry-After": String(rl.retryAfterSeconds),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { sld: rawSld, tlds: rawTlds } = (body ?? {}) as {
    sld?: unknown;
    tlds?: unknown;
  };

  const v = validateSld(String(rawSld ?? ""));
  if (!v.ok) {
    return NextResponse.json({ error: v.error }, { status: 400 });
  }

  const requested = normalizeTlds(rawTlds);
  const tlds: SupportedTld[] =
    requested.length > 0 ? requested : ([...SUPPORTED_TLDS] as SupportedTld[]);

  const { results, cached, checked } = await checkDomains(v.sld, tlds);

  const response: CheckResponse = {
    query: { sld: v.sld, tlds },
    results,
    meta: { durationMs: Date.now() - t0, cached, checked },
  };

  return NextResponse.json(response, {
    headers: {
      "Cache-Control": "no-store",
      "X-RateLimit-Remaining": String(rl.remaining),
    },
  });
}

// ---------- GET — quick single-domain check (?domain=mybrand&tld=.com.bd) ----------
export async function GET(req: NextRequest) {
  const t0 = Date.now();

  const rl = checkRateLimit(`check:${clientIp(req.headers)}`);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests.", retryAfter: rl.retryAfterSeconds },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } }
    );
  }

  const url = new URL(req.url);
  const domainParam = url.searchParams.get("domain") ?? "";
  const tldParam = url.searchParams.get("tld") ?? "";

  const v = validateSld(domainParam);
  if (!v.ok) return NextResponse.json({ error: v.error }, { status: 400 });

  const normalizedTld = tldParam.startsWith(".")
    ? tldParam.toLowerCase()
    : `.${tldParam.toLowerCase()}`;

  if (!isSupportedTld(normalizedTld)) {
    return NextResponse.json({ error: "Unsupported TLD." }, { status: 400 });
  }

  const { results, cached, checked } = await checkDomains(v.sld, [normalizedTld]);
  return NextResponse.json(
    {
      query: { sld: v.sld, tlds: [normalizedTld] },
      results,
      meta: { durationMs: Date.now() - t0, cached, checked },
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
