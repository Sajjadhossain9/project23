import { ArrowRight, Check, Star } from "lucide-react";
import { Container, Section } from "./ui/Container";
import { Card } from "./ui/Card";
import { SectionHeading } from "./ui/SectionHeading";
import { LinkButton } from "./ui/Button";
import { pricingTiers } from "@/lib/data";
import { formatBdt } from "@/lib/utils";

export function PricingTeaser() {
  return (
    <Section variant="raised" id="pricing" ariaLabel="Pricing">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Pricing"
          title="Honest pricing. In Taka."
          subtitle="Starting packages for our most requested services. Custom quotes available for everything else."
        />

        <div className="mt-12 grid gap-4 lg:grid-cols-3 lg:gap-6 items-start">
          {pricingTiers.map((tier) => (
            <Card
              key={tier.id}
              highlighted={tier.popular}
              className="h-full flex flex-col relative"
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent text-accent-ink text-caption whitespace-nowrap">
                  <Star size={12} aria-hidden="true" /> Most popular
                </span>
              )}

              <h3 className="text-h4 text-fg">{tier.name}</h3>
              <p className="mt-1 text-body-sm text-fg-secondary">{tier.tagline}</p>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-display font-semibold text-fg tabular-nums leading-none">
                  {formatBdt(tier.priceBdt)}
                </span>
                <span className="text-body-sm text-fg-tertiary">starting</span>
              </div>

              <ul className="mt-6 space-y-3 flex-1" role="list">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-body-sm text-fg-secondary">
                    <Check
                      size={16}
                      className={`shrink-0 mt-0.5 ${tier.popular ? "text-accent" : "text-success"}`}
                      aria-hidden="true"
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <LinkButton
                  href={`/contact?tier=${tier.id}`}
                  variant={tier.popular ? "primary" : "secondary"}
                  size="md"
                  fullWidth
                  iconRight={<ArrowRight size={16} />}
                >
                  Get started
                </LinkButton>
              </div>
            </Card>
          ))}
        </div>

        <p className="mt-8 text-center text-caption text-fg-tertiary">
          All prices include VAT · No hidden fees · Installments available for BDT 100,000+
        </p>

        <div className="mt-6 text-center">
          <LinkButton href="/pricing" variant="ghost" iconRight={<ArrowRight size={16} />}>
            See all pricing
          </LinkButton>
        </div>
      </Container>
    </Section>
  );
}
