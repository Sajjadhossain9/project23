import type { Metadata } from "next";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Wevnix. Send us a message, chat on WhatsApp, or visit our Dhaka office. We reply within one business day.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; service?: string; type?: string }>;
}) {
  const params = await searchParams;
  const prefilledContext = params.plan
    ? `I'm interested in the ${params.plan} plan.`
    : params.service
    ? `I'd like to talk about ${params.service}.`
    : params.type === "custom-quote"
    ? "I'd like a custom quote."
    : "";

  return (
    <>
      <Header />

      <main id="main" className="py-14 sm:py-20">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="max-w-3xl mb-10">
              <p className="text-micro uppercase text-accent mb-4">Contact</p>
              <h1 className="text-display text-fg">
                Tell us what you need. <span className="text-accent">We&apos;ll reply within 24 hours.</span>
              </h1>
              <p className="mt-6 text-body-lg text-fg-secondary">
                Use the form below for a written record, or tap WhatsApp for a
                faster conversation. Either works.
              </p>
            </div>

            <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:gap-16">
              <ContactForm prefilledMessage={prefilledContext} />

              <aside className="space-y-6">
                <InfoCard icon={MessageCircle} label="WhatsApp" primary>
                  <a
                    href="https://wa.me/8801700000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-body-sm text-fg hover:text-accent transition-colors"
                  >
                    +880 1700 000000
                  </a>
                  <p className="text-caption text-fg-tertiary mt-1">
                    Fastest — usually replies in minutes
                  </p>
                </InfoCard>

                <InfoCard icon={Mail} label="Email">
                  <a
                    href="mailto:hello@wevnix.com"
                    className="text-body-sm text-fg hover:text-accent transition-colors"
                  >
                    hello@wevnix.com
                  </a>
                </InfoCard>

                <InfoCard icon={Phone} label="Phone">
                  <a
                    href="tel:+8801700000000"
                    className="text-body-sm text-fg hover:text-accent transition-colors"
                  >
                    +880 1700 000000
                  </a>
                  <p className="text-caption text-fg-tertiary mt-1">
                    Sat–Thu, 10am–7pm
                  </p>
                </InfoCard>

                <InfoCard icon={MapPin} label="Office">
                  <p className="text-body-sm text-fg">
                    Level 5, House 42, Road 11
                    <br />
                    Banani, Dhaka 1213
                  </p>
                </InfoCard>
              </aside>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
      <FloatingActions />
    </>
  );
}

function InfoCard({
  icon: Icon,
  label,
  children,
  primary,
}: {
  icon: typeof Mail;
  label: string;
  children: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <div
      className={`rounded-lg p-5 ${primary ? "bg-accent-soft" : "bg-bg-raised"}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`inline-flex h-9 w-9 items-center justify-center rounded-md ${primary ? "bg-accent text-accent-ink" : "bg-bg-surface text-accent"}`}
        >
          <Icon size={16} aria-hidden="true" />
        </div>
        <div className="flex-1">
          <p className="text-caption text-fg-tertiary uppercase tracking-wider mb-1">
            {label}
          </p>
          {children}
        </div>
      </div>
    </div>
  );
}
