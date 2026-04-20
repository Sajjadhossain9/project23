import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { projects } from "@/lib/data";

export function ProjectsHero() {
  const completed = projects.filter((p) => p.status === "completed").length;
  const ongoing = projects.filter((p) => p.status === "ongoing").length;

  return (
    <section
      aria-label="Projects overview"
      className="relative overflow-hidden pt-14 pb-10 sm:pt-20 sm:pb-12 lg:pt-28 lg:pb-16"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgb(var(--accent)/0.06),transparent_60%)]"
      />

      <Container>
        <div className="max-w-3xl">
          <p className="text-micro uppercase text-accent mb-4">Projects</p>

          <h1 className="text-display text-fg">
            The work{" "}
            <span className="text-accent">we&apos;ve shipped</span>, and what we&apos;re building next.
          </h1>

          <p className="mt-6 text-body-lg text-fg-secondary">
            A living catalog of the websites, apps, and platforms we&apos;ve built for teams across
            Bangladesh. Real clients, real URLs, honest descriptions.
          </p>

          {/* Quick stats inline with the intro */}
          <dl className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 text-body-sm">
            <div className="flex items-center gap-2">
              <dt className="text-fg-tertiary">Completed</dt>
              <dd className="font-semibold text-fg tabular-nums">{completed}</dd>
            </div>
            <div className="flex items-center gap-2">
              <dt className="text-fg-tertiary">In progress</dt>
              <dd className="font-semibold text-fg tabular-nums">{ongoing}</dd>
            </div>
            <div className="flex items-center gap-2">
              <dt className="text-fg-tertiary">Total shipped</dt>
              <dd className="font-semibold text-fg tabular-nums">{projects.length}+</dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <LinkButton href="/contact" variant="primary" size="lg" iconRight={<ArrowRight size={18} />}>
              Start your project
            </LinkButton>
            <LinkButton href="/services" variant="secondary" size="lg">
              View services
            </LinkButton>
          </div>
        </div>
      </Container>
    </section>
  );
}
