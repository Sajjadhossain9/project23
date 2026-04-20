import { ArrowRight, Code2, Smartphone } from "lucide-react";
import { Container, Section } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";

export function CustomProjectsCallout() {
  return (
    <Section ariaLabel="Custom projects" className="!pt-0">
      <Container>
        <div className="rounded-xl border border-border-subtle bg-bg-surface p-8 sm:p-10 lg:p-12">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12 items-center">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-3 mb-5">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-accent-soft text-accent">
                  <Code2 size={18} aria-hidden="true" />
                </span>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-accent-soft text-accent">
                  <Smartphone size={18} aria-hidden="true" />
                </span>
              </div>

              <h2 className="text-h2 text-fg">
                Custom software &amp; mobile apps — priced per project.
              </h2>

              <p className="mt-4 text-body-lg text-fg-secondary max-w-2xl">
                Complex builds like ERPs, multi-tenant platforms, and native mobile apps don&apos;t
                fit neatly into packages. We scope them individually after a free 30-minute
                discovery call — you leave with a written estimate, no commitment.
              </p>

              <ul
                role="list"
                className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-body-sm text-fg-secondary"
              >
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                  Software starts at {formatStarting(200000)}
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                  Mobile apps start at {formatStarting(180000)}
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                  Fixed-price quotes, not hourly
                </li>
              </ul>
            </div>

            <div className="lg:col-span-4 lg:justify-self-end w-full">
              <LinkButton
                href="/contact?type=custom-quote"
                variant="primary"
                size="lg"
                fullWidth
                iconRight={<ArrowRight size={18} />}
              >
                Book a discovery call
              </LinkButton>
              <p className="mt-3 text-center text-caption text-fg-tertiary">
                30 minutes · Free · NDA available
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

function formatStarting(bdt: number): string {
  return `৳${bdt.toLocaleString("en-BD")}`;
}
