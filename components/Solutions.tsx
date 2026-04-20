import Link from "next/link";
import { ArrowRight, Rocket, Building2, ShoppingBag, Check } from "lucide-react";
import { Container, Section } from "./ui/Container";
import { Card } from "./ui/Card";
import { SectionHeading } from "./ui/SectionHeading";
import { solutions } from "@/lib/data";

const iconMap = {
  startups: Rocket,
  smes: Building2,
  ecommerce: ShoppingBag,
} as const;

export function Solutions() {
  return (
    <Section variant="raised" id="solutions" ariaLabel="Solutions by industry">
      <Container>
        <SectionHeading
          eyebrow="Solutions"
          title="Built for the way you work."
          subtitle="Tailored solutions for the three audiences we know best."
        />

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {solutions.map((solution) => {
            const Icon = iconMap[solution.slug as keyof typeof iconMap];
            return (
              <Card key={solution.slug} interactive className="h-full flex flex-col">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-accent-soft text-accent mb-5">
                  <Icon size={18} aria-hidden="true" />
                </div>
                <p className="text-caption text-fg-tertiary uppercase tracking-wider mb-2">
                  {solution.audience}
                </p>
                <h3 className="text-h4 text-fg mb-5">{solution.headline}</h3>
                <ul className="space-y-2.5 mb-6 flex-1" role="list">
                  {solution.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-body-sm text-fg-secondary">
                      <Check size={16} className="shrink-0 text-accent mt-0.5" aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/solutions/${solution.slug}`}
                  className="inline-flex items-center gap-1.5 text-body-sm font-medium text-fg hover:text-accent transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                >
                  See {solution.audience.toLowerCase().replace("for ", "")} solutions
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                </Link>
              </Card>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
