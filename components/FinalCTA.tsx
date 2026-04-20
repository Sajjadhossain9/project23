import { ArrowRight, MessageCircle } from "lucide-react";
import { Container, Section } from "./ui/Container";
import { LinkButton } from "./ui/Button";

export function FinalCTA() {
  return (
    <Section id="cta" ariaLabel="Get in touch">
      <Container>
        <div className="relative overflow-hidden rounded-xl bg-brand text-fg-inverse p-8 sm:p-12 lg:p-16">
          {/* Decorative accent wash */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgb(var(--accent)/0.2),transparent_60%)]"
          />

          <div className="relative max-w-2xl">
            <h2 className="text-h1 text-fg-inverse">Let&apos;s build something that works.</h2>
            <p className="mt-4 text-body-lg text-fg-inverse/80">
              Tell us what you need. We&apos;ll reply within one business day — usually much sooner.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <LinkButton
                href="/contact"
                variant="accent"
                size="lg"
                iconRight={<ArrowRight size={18} />}
              >
                Start your project
              </LinkButton>
              <LinkButton
                href="https://wa.me/8801700000000?text=Hi%20Wevnix%2C%20I%27m%20interested%20in..."
                variant="secondary"
                size="lg"
                iconLeft={<MessageCircle size={18} />}
                className="!border-fg-inverse/30 !text-fg-inverse hover:!bg-fg-inverse/10"
                target="_blank"
                rel="noopener noreferrer"
              >
                Chat on WhatsApp
              </LinkButton>
            </div>

            <p className="mt-6 text-caption text-fg-inverse/70">
              Reply within 24 hours · Free initial consultation · NDA on request
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
