import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";
import { trustStats } from "@/lib/data";

export const metadata: Metadata = {
  title: "About",
  description:
    "Wevnix is a Bangladesh-based software company building websites, apps, and AI solutions for startups, SMEs, and e-commerce teams since 2019.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main id="main" className="py-14 sm:py-20">
        <Container>
          <div className="max-w-3xl mx-auto">
            <p className="text-micro uppercase text-accent mb-4">About</p>
            <h1 className="text-display text-fg">
              We build software in Bangladesh, <span className="text-accent">for the long term.</span>
            </h1>
            <div className="mt-8 space-y-6 text-body-lg text-fg-secondary">
              <p>
                Wevnix was founded in 2019 because we were tired of watching good
                Bangladeshi businesses get burned by agencies that overpromised
                and freelancers who disappeared after launch. The bar for
                software work in BD should be higher — so we&apos;re raising it.
              </p>
              <p>
                We work with startups, SMEs, and e-commerce teams. We price in
                Taka, invoice in Taka, and answer in Bangla. We build things that
                need to still work three years from now, not just look good on
                the launch demo.
              </p>
              <p>
                If you&apos;ve got something to build, let&apos;s talk.
              </p>
            </div>

            <dl className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-3">
              {trustStats.map((stat) => (
                <div key={stat.label} className="bg-bg-raised rounded-md p-4">
                  <dt className="text-caption text-fg-secondary">{stat.label}</dt>
                  <dd className="mt-1 text-h3 font-semibold text-fg tabular-nums">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-12">
              <LinkButton
                href="/contact"
                variant="primary"
                size="lg"
                iconRight={<ArrowRight size={18} />}
              >
                Start a project with us
              </LinkButton>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
