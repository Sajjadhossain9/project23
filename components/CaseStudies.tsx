import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, Section } from "./ui/Container";
import { Card } from "./ui/Card";
import { SectionHeading } from "./ui/SectionHeading";
import { LinkButton } from "./ui/Button";
import { caseStudies } from "@/lib/data";

export function CaseStudies() {
  return (
    <Section id="case-studies" ariaLabel="Featured case studies">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <SectionHeading
            eyebrow="Case studies"
            title="Real work. Real results."
            subtitle="A few projects we&rsquo;re proud of."
          />
          <LinkButton href="/projects" variant="ghost" iconRight={<ArrowRight size={16} />} className="shrink-0">
            View all projects
          </LinkButton>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {caseStudies.map((study) => (
            <Link
              key={study.slug}
              href={`/projects/${study.slug}`}
              className="group focus-visible:outline-none"
            >
              <Card interactive className="h-full overflow-hidden p-0">
                {/* Cover placeholder — replace with <Image /> in production */}
                <div
                  className="aspect-[4/3] bg-gradient-to-br from-brand to-accent relative overflow-hidden"
                  role="img"
                  aria-label={study.coverAlt}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_50%)]" />
                  <span
                    className="absolute bottom-4 left-4 text-fg-inverse text-h3 font-semibold tracking-tight opacity-80"
                    aria-hidden="true"
                  >
                    {study.client}
                  </span>
                </div>

                <div className="p-5 sm:p-6">
                  <p className="text-caption text-accent uppercase tracking-wider mb-2">
                    {study.client}
                  </p>
                  <p className="text-h4 text-fg mb-4">{study.outcome}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {study.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-0.5 rounded-sm bg-bg-raised text-caption text-fg-secondary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-body-sm font-medium text-fg group-hover:text-accent transition-colors">
                    Read case study
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
