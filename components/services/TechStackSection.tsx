import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { techStack } from "@/lib/data";

export function TechStackSection() {
  return (
    <Section id="tech" ariaLabel="Our technology stack">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionHeading
              eyebrow="Tooling"
              title="The tools we reach for."
              subtitle="Pragmatic choices. Battle-tested frameworks. Nothing bleeding edge unless it earns its place."
            />
          </div>

          <div className="lg:col-span-8">
            <dl className="grid gap-8 sm:grid-cols-2">
              {techStack.map((category) => (
                <div key={category.name}>
                  <dt className="text-caption text-fg-tertiary uppercase tracking-wider mb-3">
                    {category.name}
                  </dt>
                  <dd>
                    <ul className="flex flex-wrap gap-2" role="list">
                      {category.tools.map((tool) => (
                        <li
                          key={tool}
                          className="inline-flex items-center px-3 py-1.5 rounded-md bg-bg-raised border border-border-subtle text-body-sm text-fg"
                        >
                          {tool}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Container>
    </Section>
  );
}
