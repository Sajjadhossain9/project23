import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Calendar, Tag as TagIcon } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { projects } from "@/lib/data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.description,
    alternates: { canonical: `/projects/${project.slug}` },
  };
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const hasDemo = project.demoUrl && project.demoUrl !== "#";

  return (
    <>
      <Header />
      <main id="main" className="py-14 sm:py-20">
        <Container>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-body-sm text-fg-secondary hover:text-fg mb-6"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Back to projects
          </Link>

          <div className="max-w-3xl">
            <p className="text-micro uppercase text-accent mb-3">
              {project.category === "ecommerce"
                ? "E-commerce"
                : project.category === "ai"
                ? "AI"
                : project.category === "app"
                ? "Mobile app"
                : project.category === "software"
                ? "Software"
                : "Web"}
            </p>
            <h1 className="text-display text-fg">{project.name}</h1>
            <p className="mt-5 text-body-lg text-fg-secondary">
              {project.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-body-sm text-fg-tertiary">
              {project.client && (
                <span>
                  Client: <span className="text-fg font-medium">{project.client}</span>
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={14} aria-hidden="true" /> {project.year}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 ${project.status === "completed" ? "text-success" : "text-accent"}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${project.status === "completed" ? "bg-success" : "bg-accent"}`}
                  aria-hidden="true"
                />
                {project.status === "completed" ? "Completed" : "In progress"}
              </span>
            </div>

            {hasDemo && (
              <div className="mt-8">
                <LinkButton
                  href={project.demoUrl}
                  variant="primary"
                  size="lg"
                  iconRight={<ExternalLink size={16} />}
                >
                  Visit live site
                </LinkButton>
              </div>
            )}

            <div className="mt-12 pt-10 border-t border-border-subtle">
              <h2 className="text-h4 text-fg mb-4 inline-flex items-center gap-2">
                <TagIcon size={16} aria-hidden="true" className="text-accent" />
                Tech stack
              </h2>
              <ul role="list" className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <li
                    key={tech}
                    className="inline-flex items-center px-3 py-1.5 rounded-md bg-bg-raised border border-border-subtle text-body-sm text-fg"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-16 rounded-xl bg-bg-raised p-8 text-center">
              <h2 className="text-h3 text-fg">Want something like this?</h2>
              <p className="mt-2 text-body text-fg-secondary">
                We build a small number of projects each month. Let&apos;s see
                if yours fits.
              </p>
              <div className="mt-6">
                <LinkButton href="/contact" variant="primary" size="md">
                  Start a conversation
                </LinkButton>
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
