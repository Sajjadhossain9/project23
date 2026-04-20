import { ArrowRight, Sparkles } from "lucide-react";
import { Container } from "./ui/Container";
import { LinkButton } from "./ui/Button";
import { HeroDomainSearch } from "./HeroDomainSearch";

export function Hero() {
  return (
    <section
      aria-label="Hero"
      className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-24 lg:pb-28"
    >
      {/* Subtle radial background wash — the one allowed "gradient" from the design system */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgb(var(--accent)/0.06),transparent_60%)]"
      />

      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12 items-center">
          {/* Content column */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1.5 text-caption text-accent-ink">
              <Sparkles size={14} aria-hidden="true" />
              <span>Bangladesh&apos;s software partner since 2019</span>
            </div>

            <h1 className="mt-6 text-display text-fg">
              Software, websites &amp; AI —{" "}
              <span className="text-accent">built in Bangladesh</span>, built to scale.
            </h1>

            <p className="mt-6 text-body-lg text-fg-secondary max-w-2xl">
              We help startups, SMEs, and e-commerce teams launch faster with reliable engineering,
              honest pricing in BDT, and support you can actually reach.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <LinkButton href="/contact" variant="primary" size="lg" iconRight={<ArrowRight size={18} />}>
                Start your project
              </LinkButton>
              <LinkButton href="/projects" variant="secondary" size="lg">
                See our work
              </LinkButton>
            </div>

            {/* Trust ribbon */}
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-body-sm text-fg-tertiary">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
                BASIS member
              </span>
              <span aria-hidden="true">·</span>
              <span>Trusted by 50+ businesses</span>
              <span aria-hidden="true">·</span>
              <span>4.9 on Google Reviews</span>
            </div>
          </div>

          {/* Domain search card */}
          <div className="lg:col-span-5">
            <HeroDomainSearch />
          </div>
        </div>
      </Container>
    </section>
  );
}
