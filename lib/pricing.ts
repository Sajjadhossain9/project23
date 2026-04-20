import { listPlans } from "./admin/pricing-repo";
import type { PricingCategory, PricingPlan } from "./types";

/**
 * Fetch active pricing plans, optionally filtered by category. Sorted by
 * admin-controlled `order`.
 *
 * Reads from lib/admin/pricing-repo — the same source the admin panel writes
 * to — so edits in /admin/pricing show up here immediately.
 */
export async function getPricingPlans(
  category?: PricingCategory
): Promise<PricingPlan[]> {
  const plans = await listPlans({ category, activeOnly: true });
  return plans.sort((a, b) => a.order - b.order);
}

/** Distinct categories with at least one active plan. */
export async function getPricingCategories(): Promise<PricingCategory[]> {
  const plans = await getPricingPlans();
  const categories = new Set(plans.map((p) => p.category));
  const preferred: PricingCategory[] = ["web", "hosting", "seo", "ai"];
  return preferred.filter((c) => categories.has(c));
}

/** Human-readable category labels. */
export const pricingCategoryLabels: Record<PricingCategory, string> = {
  web: "Web Development",
  hosting: "Hosting",
  seo: "SEO",
  ai: "AI Solutions",
};
