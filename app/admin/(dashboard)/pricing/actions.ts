"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireSession } from "@/lib/session";
import {
  createPlan,
  updatePlan,
  deletePlan,
  togglePlanActive,
  getPlan,
} from "@/lib/admin/pricing-repo";
import { writeAudit } from "@/lib/admin/audit";
import type { PricingPlan } from "@/lib/types";

// ---------- Validation ----------

const planSchema = z.object({
  category: z.enum(["web", "hosting", "seo", "ai"]),
  name: z.string().min(1, "Name is required").max(60),
  tagline: z.string().min(1, "Tagline is required").max(140),
  priceBdt: z.coerce.number().int().min(0).max(10_000_000),
  billingCycle: z.enum(["one-time", "monthly", "yearly"]),
  features: z
    .string()
    .transform((s) => s.split("\n").map((l) => l.trim()).filter(Boolean))
    .pipe(z.array(z.string()).min(1, "Add at least one feature").max(20)),
  popular: z.coerce.boolean().default(false),
  active: z.coerce.boolean().default(true),
  order: z.coerce.number().int().min(0).max(999),
  customQuote: z.coerce.boolean().default(false),
});

export type PricingFormState = {
  errors?: Record<string, string[]>;
  message?: string;
};

function parseForm(formData: FormData) {
  return planSchema.safeParse({
    category: formData.get("category"),
    name: formData.get("name"),
    tagline: formData.get("tagline"),
    priceBdt: formData.get("priceBdt"),
    billingCycle: formData.get("billingCycle"),
    features: formData.get("features"),
    // Checkboxes: present = "on", absent = missing → coerce to false
    popular: formData.get("popular") === "on",
    active: formData.get("active") === "on",
    order: formData.get("order"),
    customQuote: formData.get("customQuote") === "on",
  });
}

// ---------- Actions ----------

export async function createPlanAction(
  _prev: PricingFormState,
  formData: FormData
): Promise<PricingFormState> {
  const session = await requireSession();
  const parsed = parseForm(formData);

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const plan = await createPlan(parsed.data);
  await writeAudit({
    userId: session.user.id,
    entity: "PricingPlan",
    entityId: plan.id,
    action: "create",
    after: plan,
  });

  revalidatePath("/admin/pricing");
  revalidatePath("/pricing");
  redirect("/admin/pricing?created=1");
}

export async function updatePlanAction(
  id: string,
  _prev: PricingFormState,
  formData: FormData
): Promise<PricingFormState> {
  const session = await requireSession();
  const parsed = parseForm(formData);

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const before = await getPlan(id);
  if (!before) return { message: "Plan not found." };

  const updated = await updatePlan(id, parsed.data);
  await writeAudit({
    userId: session.user.id,
    entity: "PricingPlan",
    entityId: id,
    action: "update",
    before,
    after: updated,
  });

  revalidatePath("/admin/pricing");
  revalidatePath(`/admin/pricing/${id}`);
  revalidatePath("/pricing");
  redirect("/admin/pricing?updated=1");
}

export async function deletePlanAction(id: string): Promise<void> {
  const session = await requireSession();
  const before = await getPlan(id);
  if (!before) return;

  await deletePlan(id);
  await writeAudit({
    userId: session.user.id,
    entity: "PricingPlan",
    entityId: id,
    action: "delete",
    before,
  });

  revalidatePath("/admin/pricing");
  revalidatePath("/pricing");
  redirect("/admin/pricing?deleted=1");
}

export async function togglePlanActiveAction(id: string): Promise<void> {
  const session = await requireSession();
  const before = await getPlan(id);
  if (!before) return;

  const after = await togglePlanActive(id);
  await writeAudit({
    userId: session.user.id,
    entity: "PricingPlan",
    entityId: id,
    action: "update",
    before,
    after,
  });

  revalidatePath("/admin/pricing");
  revalidatePath("/pricing");
}
