import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/session";
import { listPlans, createPlan } from "@/lib/admin/pricing-repo";
import { writeAudit } from "@/lib/admin/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ---------- GET /api/admin/pricing ----------

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const category = url.searchParams.get("category") as
    | "web"
    | "hosting"
    | "seo"
    | "ai"
    | null;
  const activeOnly = url.searchParams.get("active") === "true";

  const plans = await listPlans({
    ...(category && { category }),
    ...(activeOnly && { activeOnly: true }),
  });

  return NextResponse.json({ plans }, { headers: { "Cache-Control": "no-store" } });
}

// ---------- POST /api/admin/pricing ----------

const createSchema = z.object({
  category: z.enum(["web", "hosting", "seo", "ai"]),
  name: z.string().min(1).max(60),
  tagline: z.string().min(1).max(140),
  priceBdt: z.number().int().min(0),
  billingCycle: z.enum(["one-time", "monthly", "yearly"]),
  features: z.array(z.string().min(1)).min(1).max(20),
  popular: z.boolean().default(false),
  active: z.boolean().default(true),
  order: z.number().int().min(0).max(999),
  customQuote: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const plan = await createPlan(parsed.data);
  await writeAudit({
    userId: session.user.id,
    entity: "PricingPlan",
    entityId: plan.id,
    action: "create",
    after: plan,
  });

  return NextResponse.json({ plan }, { status: 201 });
}
