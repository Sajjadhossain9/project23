import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";

export function ServicesHero() {
  return (
    <section
      aria-label="Services overview"
      className="relative overflow-hidden pt-14 pb-12 sm:pt-20 sm:pb-16 lg:pt-28 lg:pb-20"
    >
      {/* Subtle radial accent, matching the homepage hero aesthetic */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgb(var(--accent)/0.06),transparent_60%)]"
      />

      <Container>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-micro uppercase text-accent mb-4">Services</p>

          <h1 className="text-display text-fg">
            Everything it takes to build{" "}
            <span className="text-accent">and grow</span> your software.
          </h1>

          <p className="mt-6 text-body-lg text-fg-secondary">
            Six focused services, one team. From scoping your first MVP to scaling the business
            you&apos;ve already built — with transparent BDT pricing and bilingual support at every step.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <LinkButton href="/contact" variant="primary" size="lg" iconRight={<ArrowRight size={18} />}>
              Get a free consultation
            </LinkButton>
            <LinkButton href="/pricing" variant="secondary" size="lg">
              See pricing
            </LinkButton>
          </div>
        </div>
      </Container>
    </section>
  );
}
