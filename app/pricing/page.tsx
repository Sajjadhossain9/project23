import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { FinalCTA } from "@/components/FinalCTA";
import { PricingHero } from "@/components/pricing/PricingHero";
import { NoHiddenChargesSection } from "@/components/pricing/NoHiddenChargesSection";
import { PricingCatalog } from "@/components/pricing/PricingCatalog";
import { PricingFAQ } from "@/components/pricing/PricingFAQ";
import { getPlans } from "@/lib/pricing-store";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Transparent pricing in BDT for every Wevnix service — web, software, mobile apps, AI, hosting, and SEO. VAT included, no hidden charges, no vendor lock-in.",
  alternates: {
    canonical: "/pricing",
  },
};

// Don't cache the pricing page — admin edits should show up on next navigation.
export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const plans = await getPlans();

  return (
    <>
      <Header />

      <main id="main">
        <PricingHero />
        <NoHiddenChargesSection />
        <PricingCatalog plans={plans} />
        <PricingFAQ />
        <FinalCTA />
      </main>

      <Footer />
      <FloatingActions />
    </>
  );
}
