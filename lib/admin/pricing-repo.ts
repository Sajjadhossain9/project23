/**
 * Pricing repository — single source of truth for pricing plan reads and writes.
 *
 * Today: in-memory store seeded from lib/data.ts, persisted across HMR via
 * globalThis. The public pricing page and the admin panel both call this
 * module — so edits made in the admin show up on the public site immediately.
 *
 * Production migration:
 *   1. Run `npx prisma migrate dev` and `npx prisma db seed`
 *   2. Replace each function body with the Prisma equivalent commented below.
 *   3. Call sites don't change.
 */

import { pricingPlans as seedPlans } from "../data";
import type { PricingPlan, PricingCategory } from "../types";

// ---------- Store (globalThis so HMR doesn't wipe edits) ----------

const g = globalThis as unknown as { __pricingStore?: Map<string, PricingPlan> };
if (!g.__pricingStore) {
  g.__pricingStore = new Map(seedPlans.map((p) => [p.id, { ...p }]));
}
const store = g.__pricingStore;

// ---------- Types ----------

export type CreatePlanInput = Omit<PricingPlan, "id" | "updatedAt">;
export type UpdatePlanInput = Partial<Omit<PricingPlan, "id">>;

// ---------- Reads ----------

export async function listPlans(filters?: {
  category?: PricingCategory;
  activeOnly?: boolean;
}): Promise<PricingPlan[]> {
  // Prisma:
  //   return prisma.pricingPlan.findMany({
  //     where: {
  //       ...(filters?.category && { category: filters.category }),
  //       ...(filters?.activeOnly && { active: true }),
  //     },
  //     orderBy: [{ category: "asc" }, { order: "asc" }],
  //   });

  let plans = Array.from(store.values());
  if (filters?.category) plans = plans.filter((p) => p.category === filters.category);
  if (filters?.activeOnly) plans = plans.filter((p) => p.active);
  return plans.sort(
    (a, b) => a.category.localeCompare(b.category) || a.order - b.order
  );
}

export async function getPlan(id: string): Promise<PricingPlan | null> {
  // Prisma: return prisma.pricingPlan.findUnique({ where: { id } });
  return store.get(id) ?? null;
}

// ---------- Writes ----------

export async function createPlan(input: CreatePlanInput): Promise<PricingPlan> {
  // Prisma: return prisma.pricingPlan.create({ data: input });
  const id = `plan-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const now = new Date().toISOString();
  const plan: PricingPlan = { ...input, id, updatedAt: now };
  store.set(id, plan);
  return plan;
}

export async function updatePlan(id: string, input: UpdatePlanInput): Promise<PricingPlan | null> {
  // Prisma: return prisma.pricingPlan.update({ where: { id }, data: input });
  const existing = store.get(id);
  if (!existing) return null;
  const updated: PricingPlan = {
    ...existing,
    ...input,
    id, // never let id be overwritten
    updatedAt: new Date().toISOString(),
  };
  store.set(id, updated);
  return updated;
}

export async function deletePlan(id: string): Promise<boolean> {
  // Prisma: await prisma.pricingPlan.delete({ where: { id } }); return true;
  return store.delete(id);
}

export async function togglePlanActive(id: string): Promise<PricingPlan | null> {
  const existing = store.get(id);
  if (!existing) return null;
  return updatePlan(id, { active: !existing.active });
}
