import { ShieldCheck, Receipt, Banknote, RefreshCw } from "lucide-react";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";

const promises = [
  {
    icon: Banknote,
    title: "Fixed prices in Taka",
    body: "What's on this page is what you pay. No exchange-rate tricks, no dollar invoices that balloon when the rate moves.",
  },
  {
    icon: Receipt,
    title: "VAT already included",
    body: "Every price you see includes the 15% VAT required in Bangladesh. No line-item surprise at signing.",
  },
  {
    icon: ShieldCheck,
    title: "No surprise add-ons",
    body: "If a feature is in your scope document, it's in the price. Changes are quoted in writing before any work starts.",
  },
  {
    icon: RefreshCw,
    title: "Cancel hosting anytime",
    body: "Monthly plans, month-to-month terms. Downgrade, upgrade, or leave at the next billing cycle — no lock-in.",
  },
];

export function NoHiddenChargesSection() {
  return (
    <Section variant="raised" id="no-hidden-charges" ariaLabel="Our pricing promise">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Our promise"
          title="What you see is what you pay."
          subtitle="Four commitments we make on every invoice we send."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {promises.map((promise) => {
            const Icon = promise.icon;
            return (
              <Card key={promise.title} className="h-full">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-accent-soft text-accent mb-4">
                  <Icon size={18} aria-hidden="true" />
                </div>
                <h3 className="text-h4 text-fg mb-2">{promise.title}</h3>
                <p className="text-body-sm text-fg-secondary">{promise.body}</p>
              </Card>
            );
          })}
        </div>

        {/* Signed promise card */}
        <Card className="mt-10 border-0 bg-bg-surface">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <div
              className="shrink-0 h-12 w-12 rounded-full bg-brand text-fg-inverse flex items-center justify-center text-body-sm font-semibold"
              aria-hidden="true"
            >
              SH
            </div>
            <div>
              <p className="text-body text-fg">
                &ldquo;We learned early that clients remember the final invoice more than the first
                quote. If we can&apos;t deliver for the price we wrote down, that&apos;s on us —
                not you.&rdquo;
              </p>
              <p className="mt-3 text-caption text-fg-secondary">
                <span className="font-medium text-fg">Sajjad Hossain</span> · Founder, Wevnix
              </p>
            </div>
          </div>
        </Card>
      </Container>
    </Section>
  );
}
