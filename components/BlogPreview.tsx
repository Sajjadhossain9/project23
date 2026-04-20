import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { Container, Section } from "./ui/Container";
import { Card } from "./ui/Card";
import { SectionHeading } from "./ui/SectionHeading";
import { LinkButton } from "./ui/Button";
import { blogPosts } from "@/lib/data";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function BlogPreview() {
  return (
    <Section variant="raised" id="blog" ariaLabel="Latest from the blog">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <SectionHeading
            eyebrow="Insights"
            title="Notes from our team."
            subtitle="Guides, playbooks, and field reports from building software in Bangladesh."
          />
          <LinkButton href="/blog" variant="ghost" iconRight={<ArrowRight size={16} />} className="shrink-0">
            Visit the blog
          </LinkButton>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group focus-visible:outline-none"
            >
              <Card interactive className="h-full flex flex-col p-0 overflow-hidden">
                {/* Cover placeholder — replace with <Image /> in production */}
                <div
                  className="aspect-video bg-gradient-to-tr from-bg-elevated to-accent-soft relative"
                  role="img"
                  aria-label={`Cover image for ${post.title}`}
                >
                  <span className="absolute top-4 left-4 inline-flex items-center px-2.5 py-1 rounded-sm bg-bg-surface/90 backdrop-blur-sm text-caption text-fg">
                    {post.category}
                  </span>
                </div>

                <div className="p-5 sm:p-6 flex-1 flex flex-col">
                  <h3 className="text-h4 text-fg mb-2 group-hover:text-accent transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-body-sm text-fg-secondary mb-5 flex-1">{post.excerpt}</p>

                  <footer className="flex items-center gap-3 pt-4 border-t border-border-subtle">
                    <div
                      className="h-8 w-8 rounded-full bg-bg-raised text-fg flex items-center justify-center text-caption font-semibold shrink-0"
                      aria-hidden="true"
                    >
                      {post.authorInitials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-caption text-fg truncate">{post.author}</p>
                      <p className="text-caption text-fg-tertiary flex items-center gap-1.5">
                        <span>{formatDate(post.date)}</span>
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-1">
                          <Clock size={11} aria-hidden="true" />
                          {post.readMinutes} min read
                        </span>
                      </p>
                    </div>
                  </footer>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
