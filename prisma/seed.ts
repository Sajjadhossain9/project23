/**
 * Prisma seed script.
 *
 * Run with: npx prisma db seed
 * (add this to package.json under "prisma": { "seed": "tsx prisma/seed.ts" })
 *
 * What it does:
 *   1. Creates an initial admin user from env vars ADMIN_EMAIL + ADMIN_PASSWORD.
 *   2. Seeds all active pricing plans from lib/data.ts into the PricingPlan table.
 *   3. Seeds the pricing FAQ from lib/data.ts.
 *
 * Safe to re-run — uses upserts keyed on unique fields.
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { pricingPlans, pricingFaqs } from "../lib/data";

const prisma = new PrismaClient();

async function main() {
  // 1. Admin user
  const email = process.env.ADMIN_EMAIL ?? "admin@wevnix.com";
  const password = process.env.ADMIN_PASSWORD ?? "change-me-immediately";
  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash,
      name: "Admin",
      role: "admin",
      active: true,
    },
  });
  console.log(`✓ Admin user: ${admin.email}`);

  // 2. Pricing plans
  for (const plan of pricingPlans) {
    await prisma.pricingPlan.upsert({
      where: { id: plan.id },
      update: {
        category: plan.category,
        name: plan.name,
        tagline: plan.tagline,
        priceBdt: plan.priceBdt,
        billingCycle: plan.billingCycle.replace("-", "_") as
          | "one_time"
          | "monthly"
          | "yearly",
        features: plan.features,
        popular: plan.popular ?? false,
        active: plan.active,
        order: plan.order,
        customQuote: plan.customQuote ?? false,
      },
      create: {
        id: plan.id,
        category: plan.category,
        name: plan.name,
        tagline: plan.tagline,
        priceBdt: plan.priceBdt,
        billingCycle: plan.billingCycle.replace("-", "_") as
          | "one_time"
          | "monthly"
          | "yearly",
        features: plan.features,
        popular: plan.popular ?? false,
        active: plan.active,
        order: plan.order,
        customQuote: plan.customQuote ?? false,
      },
    });
  }
  console.log(`✓ Pricing plans: ${pricingPlans.length} upserted`);

  // 3. Pricing FAQs
  for (let i = 0; i < pricingFaqs.length; i++) {
    const faq = pricingFaqs[i];
    await prisma.pricingFaq.upsert({
      where: { id: `faq-${i + 1}` },
      update: { question: faq.q, answer: faq.a, order: i, active: true },
      create: {
        id: `faq-${i + 1}`,
        question: faq.q,
        answer: faq.a,
        order: i,
        active: true,
      },
    });
  }
  console.log(`✓ Pricing FAQs: ${pricingFaqs.length} upserted`);

  console.log("\nDone. Log in at /admin/login");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
