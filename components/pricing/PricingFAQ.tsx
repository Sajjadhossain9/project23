import { Plus } from "lucide-react";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pricingFaqs } from "@/lib/data";

export function PricingFAQ() {
  return (
    <Section id="faq" ariaLabel="Pricing frequently asked questions">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionHeading
              eyebrow="FAQ"
              title="Pricing questions, answered."
              subtitle="Still unsure about something? Reach out — we&rsquo;d rather answer one more question than let you guess."
            />
          </div>

          <div className="lg:col-span-8">
            <div className="divide-y divide-border-subtle border-y border-border-subtle">
              {pricingFaqs.map((faq, index) => (
                <details
                  key={index}
                  className="group py-5 [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex items-start justify-between gap-4 cursor-pointer list-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm">
                    <h3 className="text-body font-medium text-fg group-hover:text-accent transition-colors">
                      {faq.q}
                    </h3>
                    <span
                      className="shrink-0 mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border border-border-default text-fg-secondary group-open:rotate-45 group-open:border-accent group-open:text-accent transition-transform duration-200"
                      aria-hidden="true"
                    >
                      <Plus size={14} />
                    </span>
                  </summary>
                  <p className="mt-3 pr-10 text-body-sm text-fg-secondary leading-relaxed">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
