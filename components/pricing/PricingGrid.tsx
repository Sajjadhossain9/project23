"use client";

import { useMemo, useState } from "react";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PricingCard } from "./PricingCard";
import { cn } from "@/lib/utils";
import { pricingCategoryLabels } from "@/lib/pricing";
import type { PricingPlan, PricingCategory } from "@/lib/types";

interface PricingGridProps {
  plans: PricingPlan[];
  categories: PricingCategory[];
}

export function PricingGrid({ plans, categories }: PricingGridProps) {
  const [active, setActive] = useState<PricingCategory>(categories[0]);

  const activePlans = useMemo(
    () => plans.filter((p) => p.category === active),
    [plans, active]
  );

  // Category-specific subtitle to set context for each section
  const subtitles: Record<PricingCategory, string> = {
    web: "One-time fixed prices. No recurring fees on the build itself.",
    hosting: "Monthly plans. Cancel anytime. Upgrade or downgrade at the next cycle.",
    seo: "Monthly retainers. Minimum 3-month engagement for meaningful results.",
    ai: "One-time builds with optional ongoing support contracts.",
  };

  return (
    <Section id="plans" ariaLabel="Pricing plans" className="!pt-4 sm:!pt-6">
      <Container>
        {/* Category tabs */}
        <div
          role="tablist"
          aria-label="Pricing categories"
          className="flex flex-wrap justify-center gap-2 mb-4"
        >
          {categories.map((category) => {
            const isActive = category === active;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`plans-panel-${category}`}
                id={`plans-tab-${category}`}
                onClick={() => setActive(category)}
                className={cn(
                  "px-4 py-2 rounded-full border text-body-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                  isActive
                    ? "bg-fg text-fg-inverse border-fg"
                    : "bg-transparent text-fg-secondary border-border-default hover:text-fg hover:border-border-strong"
                )}
              >
                {pricingCategoryLabels[category]}
              </button>
            );
          })}
        </div>

        {/* Active-category context line */}
        <p className="text-center text-body-sm text-fg-tertiary mb-12">{subtitles[active]}</p>

        {/* Card grid */}
        <div
          role="tabpanel"
          id={`plans-panel-${active}`}
          aria-labelledby={`plans-tab-${active}`}
          className="grid gap-4 lg:grid-cols-3 lg:gap-6 items-start"
        >
          {activePlans.length > 0 ? (
            activePlans.map((plan) => <PricingCard key={plan.id} plan={plan} />)
          ) : (
            <p className="col-span-3 text-center text-body-sm text-fg-tertiary py-12">
              No active plans in this category yet.
            </p>
          )}
        </div>

        {/* Fine print beneath the cards */}
        <p className="mt-8 text-center text-caption text-fg-tertiary">
          All prices in BDT and include 15% VAT · Installments available for projects over BDT 100,000
        </p>
      </Container>
    </Section>
  );
}
