import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { blogPosts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Guides, playbooks, and field reports on building software in Bangladesh — from the Wevnix engineering team.",
  alternates: { canonical: "/blog" },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function BlogPage() {
  return (
    <>
      <Header />
      <main id="main" className="py-14 sm:py-20">
        <Container>
          <div className="max-w-3xl mb-12">
            <p className="text-micro uppercase text-accent mb-4">Blog</p>
            <h1 className="text-display text-fg">
              Notes from <span className="text-accent">the team.</span>
            </h1>
            <p className="mt-6 text-body-lg text-fg-secondary">
              Guides, playbooks, and field reports from building software in
              Bangladesh.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group focus-visible:outline-none"
              >
                <Card interactive className="h-full flex flex-col p-0 overflow-hidden">
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
                    <h2 className="text-h4 text-fg mb-2 group-hover:text-accent transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-body-sm text-fg-secondary mb-5 flex-1">
                      {post.excerpt}
                    </p>
                    <p className="text-caption text-fg-tertiary flex items-center gap-1.5">
                      <span>{formatDate(post.date)}</span>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock size={11} aria-hidden="true" />
                        {post.readMinutes} min read
                      </span>
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
