import Link from "next/link";
import { ArrowRight, Check, Star } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { formatBdt, cn } from "@/lib/utils";
import type { PricingPlan } from "@/lib/types";

const billingSuffix: Record<PricingPlan["billingCycle"], string> = {
  "one-time": "one-time",
  monthly: "/month",
  yearly: "/year",
};

interface PricingCardProps {
  plan: PricingPlan;
}

export function PricingCard({ plan }: PricingCardProps) {
  const isCustom = plan.customQuote === true;
  const isPopular = plan.popular === true;

  return (
    <Card highlighted={isPopular} className="h-full flex flex-col relative">
      {/* Popular ribbon */}
      {isPopular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent text-accent-ink text-caption whitespace-nowrap">
          <Star size={12} aria-hidden="true" />
          Most popular
        </span>
      )}

      {/* Header */}
      <div>
        <h3 className="text-h4 text-fg">{plan.name}</h3>
        <p className="mt-1 text-body-sm text-fg-secondary">{plan.tagline}</p>
      </div>

      {/* Price block */}
      <div className="mt-6">
        {isCustom ? (
          <>
            <div className="text-display font-semibold text-fg leading-none">Custom</div>
            <p className="mt-2 text-body-sm text-fg-tertiary">
              Tailored to your scope and timeline
            </p>
          </>
        ) : (
          <>
            <div className="flex items-baseline gap-2">
              <span className="text-display font-semibold text-fg tabular-nums leading-none">
                {formatBdt(plan.priceBdt)}
              </span>
              <span
                className={cn(
                  "text-body-sm tabular-nums",
                  plan.billingCycle === "one-time" ? "text-fg-tertiary" : "text-fg-secondary"
                )}
              >
                {billingSuffix[plan.billingCycle]}
              </span>
            </div>
            <p className="mt-2 text-caption text-fg-tertiary">VAT included</p>
          </>
        )}
      </div>

      {/* Features */}
      <ul className="mt-6 space-y-3 flex-1" role="list">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-body-sm text-fg-secondary">
            <Check
              size={16}
              className={cn("shrink-0 mt-0.5", isPopular ? "text-accent" : "text-success")}
              aria-hidden="true"
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className="mt-8">
        <LinkButton
          href={isCustom ? `/contact?plan=${plan.id}` : `/checkout?plan=${plan.id}`}
          variant={isPopular ? "primary" : "secondary"}
          size="md"
          fullWidth
          iconRight={<ArrowRight size={16} />}
        >
          {isCustom ? "Get a quote" : "Get started"}
        </LinkButton>
      </div>
    </Card>
  );
}
