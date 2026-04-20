import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/session";
import { getPlan, updatePlan, deletePlan } from "@/lib/admin/pricing-repo";
import { writeAudit } from "@/lib/admin/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const updateSchema = z.object({
  category: z.enum(["web", "hosting", "seo", "ai"]).optional(),
  name: z.string().min(1).max(60).optional(),
  tagline: z.string().min(1).max(140).optional(),
  priceBdt: z.number().int().min(0).optional(),
  billingCycle: z.enum(["one-time", "monthly", "yearly"]).optional(),
  features: z.array(z.string().min(1)).min(1).max(20).optional(),
  popular: z.boolean().optional(),
  active: z.boolean().optional(),
  order: z.number().int().min(0).max(999).optional(),
  customQuote: z.boolean().optional(),
});

async function requireAuth() {
  const session = await getSession();
  if (!session) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { session };
}

// ---------- GET /api/admin/pricing/[id] ----------

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const plan = await getPlan(id);
  if (!plan) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ plan }, { headers: { "Cache-Control": "no-store" } });
}

// ---------- PATCH /api/admin/pricing/[id] ----------

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const before = await getPlan(id);
  if (!before) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const plan = await updatePlan(id, parsed.data);
  await writeAudit({
    userId: auth.session.user.id,
    entity: "PricingPlan",
    entityId: id,
    action: "update",
    before,
    after: plan,
  });

  return NextResponse.json({ plan });
}

// ---------- DELETE /api/admin/pricing/[id] ----------

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const before = await getPlan(id);
  if (!before) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await deletePlan(id);
  await writeAudit({
    userId: auth.session.user.id,
    entity: "PricingPlan",
    entityId: id,
    action: "delete",
    before,
  });

  return new NextResponse(null, { status: 204 });
}
