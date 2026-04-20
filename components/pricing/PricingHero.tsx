import { ArrowRight, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";

export function PricingHero() {
  return (
    <section
      aria-label="Pricing"
      className="relative overflow-hidden pt-14 pb-10 sm:pt-20 sm:pb-12 lg:pt-28 lg:pb-16"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgb(var(--accent)/0.06),transparent_60%)]"
      />

      <Container>
        <div className="max-w-3xl mx-auto text-center">
          {/* Trust ribbon — answers the question before it's asked */}
          <div className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1.5 text-caption text-accent-ink mb-6">
            <ShieldCheck size={14} aria-hidden="true" />
            <span>No hidden charges · VAT included · Taka pricing</span>
          </div>

          <h1 className="text-display text-fg">
            Simple, transparent pricing{" "}
            <span className="text-accent">in Taka</span>.
          </h1>

          <p className="mt-6 text-body-lg text-fg-secondary">
            Fixed prices for our most requested packages. What you see is what you pay — no
            dollar-denominated surprises, no &ldquo;oh by the way&rdquo; at the end.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <LinkButton href="#plans" variant="primary" size="lg" iconRight={<ArrowRight size={18} />}>
              See the plans
            </LinkButton>
            <LinkButton href="/contact" variant="secondary" size="lg">
              Get a custom quote
            </LinkButton>
          </div>
        </div>
      </Container>
    </section>
  );
}
