import { Container, Section } from "./ui/Container";
import { Card } from "./ui/Card";
import { trustStats, clientLogos } from "@/lib/data";

export function TrustStrip() {
  return (
    <Section variant="raised" ariaLabel="Trusted by" className="py-12 sm:py-14">
      <Container>
        <p className="text-center text-body-sm text-fg-secondary mb-8">
          Trusted by teams building the future of business in Bangladesh
        </p>

        {/* Logo marquee — uses CSS animation, pauses on hover */}
        <div className="relative overflow-hidden mb-12" aria-label="Client logos">
          <div className="flex gap-10 sm:gap-14 animate-marquee hover:[animation-play-state:paused]">
            {[...clientLogos, ...clientLogos].map((logo, i) => (
              <span
                key={i}
                className="shrink-0 text-body-lg font-semibold tracking-tight text-fg-tertiary whitespace-nowrap"
                aria-hidden={i >= clientLogos.length}
              >
                {logo}
              </span>
            ))}
          </div>
        </div>

        {/* Stat tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {trustStats.map((stat) => (
            <Card key={stat.label} variant="metric">
              <p className="text-caption text-fg-secondary">{stat.label}</p>
              <p className="mt-1 text-h3 font-semibold text-fg tabular-nums">{stat.value}</p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
