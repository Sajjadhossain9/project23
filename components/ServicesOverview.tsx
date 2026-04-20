import Link from "next/link";
import { ArrowRight, Code2, Globe, Smartphone, Sparkles, Server, TrendingUp } from "lucide-react";
import { Container, Section } from "./ui/Container";
import { Card } from "./ui/Card";
import { SectionHeading } from "./ui/SectionHeading";
import { LinkButton } from "./ui/Button";
import { services } from "@/lib/data";

const iconMap = {
  software: Code2,
  web: Globe,
  app: Smartphone,
  ai: Sparkles,
  hosting: Server,
  seo: TrendingUp,
} as const;

export function ServicesOverview() {
  return (
    <Section id="services" ariaLabel="Our services">
      <Container>
        <SectionHeading
          eyebrow="Services"
          title="Everything you need to build, launch &amp; grow."
          subtitle="Six services, one team. From your first MVP to your next million users."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = iconMap[service.slug as keyof typeof iconMap];
            return (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group focus-visible:outline-none"
              >
                <Card interactive className="h-full focus-within:border-accent">
                  <div className="flex items-start justify-between mb-4">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-accent-soft text-accent">
                      <Icon size={18} aria-hidden="true" />
                    </div>
                    <ArrowRight
                      size={16}
                      className="text-fg-tertiary group-hover:text-accent group-hover:translate-x-0.5 transition-all"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="text-h4 text-fg mb-2">{service.title}</h3>
                  <p className="text-body-sm text-fg-secondary mb-4">{service.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {service.deliverables.map((d) => (
                      <span
                        key={d}
                        className="inline-flex items-center px-2 py-0.5 rounded-sm bg-bg-raised text-caption text-fg-secondary"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                  {service.proof && (
                    <p className="mt-4 pt-4 border-t border-border-subtle text-caption text-accent">
                      {service.proof}
                    </p>
                  )}
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <LinkButton href="/contact" variant="ghost" iconRight={<ArrowRight size={16} />}>
            Not sure which service you need? Talk to us.
          </LinkButton>
        </div>
      </Container>
    </Section>
  );
}
