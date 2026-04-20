import { MapPin, Receipt, MessagesSquare, Handshake } from "lucide-react";
import { Container, Section } from "./ui/Container";
import { Card } from "./ui/Card";
import { SectionHeading } from "./ui/SectionHeading";

const differentiators = [
  {
    icon: MapPin,
    title: "Local + global standards",
    body: "Built in Bangladesh, delivered to international quality. Our code would pass review at any Silicon Valley startup.",
  },
  {
    icon: Receipt,
    title: "Transparent BDT pricing",
    body: "No dollar-denominated surprises. No hidden add-ons. What you see on our pricing page is what you pay.",
  },
  {
    icon: MessagesSquare,
    title: "Bilingual support",
    body: "Bangla and English, by real humans, on WhatsApp. Your project manager is one message away — not a ticket in a queue.",
  },
  {
    icon: Handshake,
    title: "Long-term partnership",
    body: "We stay after launch with hosting, SEO, and iteration. Most of our clients have been with us for 2+ years.",
  },
];

export function WhyWevnix() {
  return (
    <Section id="why" ariaLabel="Why choose Wevnix">
      <Container>
        <SectionHeading
          eyebrow="Why Wevnix"
          title="Why teams choose us."
          subtitle="Agencies overpromise. Freelancers disappear. We do neither."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {differentiators.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="h-full">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-accent-soft text-accent mb-4">
                  <Icon size={18} aria-hidden="true" />
                </div>
                <h3 className="text-h4 text-fg mb-2">{item.title}</h3>
                <p className="text-body-sm text-fg-secondary">{item.body}</p>
              </Card>
            );
          })}
        </div>

        {/* Founder quote card */}
        <Card className="mt-10 lg:mt-12 bg-bg-raised border-0">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div
              className="shrink-0 h-14 w-14 rounded-full bg-brand text-fg-inverse flex items-center justify-center text-h4 font-semibold"
              aria-hidden="true"
            >
              SH
            </div>
            <div>
              <p className="text-body-lg text-fg italic">
                &ldquo;We built Wevnix because we were tired of watching good BD businesses get
                burned by agencies that overpromised. The bar should be higher — so we&apos;re
                raising it.&rdquo;
              </p>
              <p className="mt-3 text-body-sm text-fg-secondary">
                <span className="font-medium text-fg">Sajjad Hossain</span> · Founder &amp; Lead Engineer
              </p>
            </div>
          </div>
        </Card>
      </Container>
    </Section>
  );
}
