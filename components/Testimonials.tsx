import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";
import { Container, Section } from "./ui/Container";
import { Card } from "./ui/Card";
import { SectionHeading } from "./ui/SectionHeading";
import { testimonials } from "@/lib/data";

export function Testimonials() {
  return (
    <Section id="testimonials" ariaLabel="Client testimonials">
      <Container>
        <SectionHeading
          eyebrow="Testimonials"
          title="What our clients say."
          subtitle="Quotes straight from the founders and teams we&rsquo;ve built for."
        />

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.id} className="h-full flex flex-col">
              <div
                className="flex items-center gap-1 mb-4 text-highlight"
                aria-label="5 out of 5 stars"
              >
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} size={14} fill="currentColor" aria-hidden="true" />
                ))}
              </div>

              <blockquote className="flex-1 text-body text-fg">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <footer className="mt-6 pt-4 border-t border-border-subtle flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-full bg-accent-soft text-accent-ink flex items-center justify-center text-caption font-semibold"
                  aria-hidden="true"
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-body-sm font-medium text-fg">{t.author}</p>
                  <p className="text-caption text-fg-tertiary">
                    {t.role}, {t.company}
                  </p>
                </div>
              </footer>
            </Card>
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="inline-flex items-center gap-2 text-body-sm text-fg-secondary">
            <div className="flex text-highlight" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} size={14} fill="currentColor" />
              ))}
            </div>
            <span className="font-medium text-fg">4.9 on Google Reviews</span>
          </div>
          <Link
            href="https://g.page/wevnix/review"
            className="inline-flex items-center gap-1.5 text-body-sm font-medium text-fg hover:text-accent transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
          >
            See more reviews
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </Section>
  );
}
