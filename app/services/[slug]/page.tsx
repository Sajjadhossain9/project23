import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { FinalCTA } from "@/components/FinalCTA";
import { Container, Section } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { services, projects } from "@/lib/data";
import { formatBdt } from "@/lib/utils";
import { JsonLd, serviceSchema, breadcrumbSchema } from "@/lib/seo/jsonld";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.longDescription ?? service.description,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

const categoryMap: Record<string, "web" | "ecommerce" | "software" | "app" | "ai"> = {
  software: "software",
  web: "web",
  app: "app",
  ai: "ai",
  hosting: "web", // Hosting projects shown alongside web
  seo: "web",
};

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  // Related projects — filter by the closest matching category
  const relatedCategory = categoryMap[service.slug];
  const relatedProjects = projects
    .filter((p) => p.category === relatedCategory)
    .slice(0, 3);

  return (
    <>
      <Header />

      <JsonLd
        data={[
          serviceSchema({
            name: service.title,
            description: service.longDescription ?? service.description,
            slug: service.slug,
            priceBdt: service.startingPriceBdt,
          }),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Services", url: "/services" },
            { name: service.title, url: `/services/${service.slug}` },
          ]),
        ]}
      />

      <main id="main">
        {/* Hero */}
        <section
          aria-label="Service"
          className="relative overflow-hidden pt-14 pb-10 sm:pt-20 sm:pb-12 lg:pt-24 lg:pb-14"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgb(var(--accent)/0.06),transparent_60%)]"
          />
          <Container>
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-body-sm text-fg-secondary hover:text-fg mb-6"
            >
              <ArrowLeft size={14} aria-hidden="true" />
              Back to services
            </Link>

            <div className="max-w-3xl">
              <p className="text-micro uppercase text-accent mb-4">Service</p>
              <h1 className="text-display text-fg">{service.title}</h1>
              <p className="mt-6 text-body-lg text-fg-secondary">
                {service.longDescription ?? service.description}
              </p>

              {service.startingPriceBdt && (
                <p className="mt-6 text-body-sm text-fg-tertiary">
                  Starting at{" "}
                  <span className="text-fg font-medium tabular-nums">
                    {formatBdt(service.startingPriceBdt)}
                  </span>
                </p>
              )}

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <LinkButton
                  href={`/contact?service=${service.slug}`}
                  variant="primary"
                  size="lg"
                  iconRight={<ArrowRight size={18} />}
                >
                  Get a quote
                </LinkButton>
                <LinkButton href="/pricing" variant="secondary" size="lg">
                  See pricing
                </LinkButton>
              </div>
            </div>
          </Container>
        </section>

        {/* Features */}
        {service.features && service.features.length > 0 && (
          <Section variant="raised" ariaLabel="What's included">
            <Container>
              <SectionHeading
                eyebrow="Included"
                title="What you get."
                subtitle="Every engagement includes these deliverables. Additional scope is quoted separately before work begins."
              />
              <ul className="mt-10 grid gap-4 sm:grid-cols-2" role="list">
                {service.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 rounded-lg bg-bg-surface border border-border-subtle p-4"
                  >
                    <span className="shrink-0 inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent-soft text-accent mt-0.5">
                      <Check size={14} aria-hidden="true" />
                    </span>
                    <span className="text-body text-fg">{feature}</span>
                  </li>
                ))}
              </ul>
            </Container>
          </Section>
        )}

        {/* Related projects */}
        {relatedProjects.length > 0 && (
          <Section ariaLabel="Related work">
            <Container>
              <SectionHeading
                eyebrow="Related work"
                title={`${service.title} projects we've shipped.`}
              />
              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {relatedProjects.map((project) => (
                  <Link
                    key={project.slug}
                    href={`/projects/${project.slug}`}
                    className="group rounded-lg border border-border-subtle bg-bg-surface p-5 shadow-elev-1 hover:shadow-elev-2 hover:-translate-y-0.5 hover:border-border-default transition-all duration-200"
                  >
                    <h3 className="text-h4 text-fg mb-1 group-hover:text-accent transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-body-sm text-fg-secondary line-clamp-2">
                      {project.description}
                    </p>
                    <div className="mt-4 inline-flex items-center gap-1 text-body-sm text-accent">
                      View project <ArrowRight size={14} aria-hidden="true" />
                    </div>
                  </Link>
                ))}
              </div>
            </Container>
          </Section>
        )}

        <FinalCTA />
      </main>

      <Footer />
      <FloatingActions />
    </>
  );
}
