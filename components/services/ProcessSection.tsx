import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { processSteps } from "@/lib/data";

export function ProcessSection() {
  return (
    <Section variant="raised" id="process" ariaLabel="How we work">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Process"
          title="How we work."
          subtitle="A calm, predictable process. No mystery, no scope-creep surprises."
        />

        <ol
          className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-6 relative"
          role="list"
        >
          {/* Decorative connector line — desktop only */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute top-6 left-[12.5%] right-[12.5%] h-px bg-border-default"
          />

          {processSteps.map((item, index) => (
            <li key={item.step} className="relative">
              {/* Numbered circle */}
              <div
                className="relative z-10 inline-flex h-12 w-12 items-center justify-center rounded-full bg-bg-surface border-2 border-border-default text-fg font-semibold text-body-sm tabular-nums mb-5"
                aria-label={`Step ${index + 1}`}
              >
                {item.step}
              </div>

              <h3 className="text-h4 text-fg mb-2">{item.title}</h3>

              <p className="text-body-sm text-fg-secondary mb-3">{item.description}</p>

              <p className="inline-flex items-center gap-1.5 text-caption text-accent">
                <span className="h-1 w-1 rounded-full bg-accent" aria-hidden="true" />
                {item.duration}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
