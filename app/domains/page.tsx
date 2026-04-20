import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { FinalCTA } from "@/components/FinalCTA";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DomainChecker } from "@/components/domains/DomainChecker";
import { TLD_REGISTRY } from "@/lib/domains/tld-registry";
import { SUPPORTED_TLDS } from "@/lib/domains/types";
import { formatBdt } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Domain Search",
  description:
    "Search and register .bd, .com.bd, .net.bd, .org.bd, .edu.bd, .com, .net, and .org domains — transparent BDT pricing, BTCL paperwork handled for you.",
  alternates: { canonical: "/domains" },
};

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function DomainsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const initialSld = (params.q ?? "").toLowerCase().replace(/[^a-z0-9-]/g, "");

  return (
    <>
      <Header />

      <main id="main">
        {/* Hero + checker */}
        <section
          aria-label="Domain search"
          className="relative overflow-hidden pt-14 pb-12 sm:pt-20 sm:pb-16 lg:pt-28 lg:pb-20"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgb(var(--accent)/0.06),transparent_60%)]"
          />
          <Container>
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <p className="text-micro uppercase text-accent mb-4">Domains</p>
                <h1 className="text-display text-fg">
                  Claim your <span className="text-accent">.bd</span> domain.
                </h1>
                <p className="mt-6 text-body-lg text-fg-secondary">
                  We check availability across all 8 supported TLDs at once — and we handle the BTCL
                  paperwork for <code className="font-mono text-fg">.edu.bd</code> and{" "}
                  <code className="font-mono text-fg">.org.bd</code> registrations.
                </p>
              </div>

              <div className="rounded-xl border border-border-subtle bg-bg-surface p-6 sm:p-8 shadow-elev-2">
                <DomainChecker initialSld={initialSld} autoCheck={!!initialSld} />
              </div>
            </div>
          </Container>
        </section>

        {/* TLD pricing reference table */}
        <Section variant="raised" ariaLabel="TLD pricing reference">
          <Container>
            <SectionHeading
              eyebrow="Pricing reference"
              title="TLDs we support."
              subtitle="Prices are annual and include VAT. .edu.bd and .org.bd require documentation — we handle it for you."
            />

            <div className="mt-10 overflow-hidden rounded-lg border border-border-subtle bg-bg-surface">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-subtle bg-bg-raised text-caption text-fg-tertiary">
                    <th className="text-left font-medium px-4 sm:px-6 py-3">TLD</th>
                    <th className="text-left font-medium px-4 sm:px-6 py-3 hidden sm:table-cell">
                      Eligibility
                    </th>
                    <th className="text-right font-medium px-4 sm:px-6 py-3">Price / year</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {SUPPORTED_TLDS.map((tld) => {
                    const info = TLD_REGISTRY[tld];
                    return (
                      <tr key={tld}>
                        <td className="px-4 sm:px-6 py-4">
                          <span className="font-mono text-body font-medium text-fg">{tld}</span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                          {info.restricted ? (
                            <span className="text-body-sm text-warning">
                              {info.restrictionNote}
                            </span>
                          ) : (
                            <span className="text-body-sm text-fg-secondary">
                              Open to anyone
                            </span>
                          )}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-right text-body-sm font-semibold text-fg tabular-nums">
                          {formatBdt(info.priceBdt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <p className="mt-6 text-caption text-fg-tertiary">
              Availability checks are best-effort for .bd family domains. BTCL is the source of truth —
              final registration depends on their verification process.
            </p>
          </Container>
        </Section>

        <FinalCTA />
      </main>

      <Footer />
      <FloatingActions />
    </>
  );
}
