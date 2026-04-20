import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { Container } from "@/components/ui/Container";
import { blogPosts } from "@/lib/data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <>
      <Header />
      <main id="main" className="py-14 sm:py-20">
        <Container size="narrow">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-body-sm text-fg-secondary hover:text-fg mb-6"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Back to blog
          </Link>

          <p className="text-micro uppercase text-accent mb-3">{post.category}</p>
          <h1 className="text-display text-fg">{post.title}</h1>
          <p className="mt-5 text-body-lg text-fg-secondary">{post.excerpt}</p>

          <div className="mt-6 flex items-center gap-3 text-caption text-fg-tertiary">
            <span className="font-medium text-fg">{post.author}</span>
            <span aria-hidden="true">·</span>
            <span>
              {new Date(post.date).toLocaleDateString("en-BD", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1">
              <Clock size={11} aria-hidden="true" />
              {post.readMinutes} min read
            </span>
          </div>

          <div className="mt-10 aspect-video bg-gradient-to-tr from-bg-elevated to-accent-soft rounded-lg" />

          <div className="mt-12 prose prose-neutral max-w-none">
            <p className="text-body-lg text-fg-secondary">
              Full article content coming soon. This post will go live once
              editorial review is complete.
            </p>
            <p className="text-body text-fg-secondary mt-4">
              In the meantime, if this topic is urgent for your team, reach out
              on WhatsApp or the contact form and we&apos;ll walk you through it
              directly.
            </p>
          </div>
        </Container>
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
