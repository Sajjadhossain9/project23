import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { FinalCTA } from "@/components/FinalCTA";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServicesHero } from "@/components/services/ServicesHero";
import { ServiceDetailCard } from "@/components/services/ServiceDetailCard";
import { ProcessSection } from "@/components/services/ProcessSection";
import { TechStackSection } from "@/components/services/TechStackSection";
import { services, serviceCategories } from "@/lib/data";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Software, web, mobile, AI, hosting, and SEO services from Wevnix — built in Bangladesh, priced in BDT, with bilingual support throughout.",
  alternates: {
    canonical: "/services",
  },
};

export default function ServicesPage() {
  // Build a quick lookup so category ordering drives the render
  const serviceBySlug = new Map(services.map((s) => [s.slug, s]));

  return (
    <>
      <Header />

      <main id="main">
        <ServicesHero />

        {/* Categorized service sections */}
        {serviceCategories.map((category, index) => (
          <Section
            key={category.id}
            id={category.id}
            ariaLabel={category.eyebrow}
            // Tighten the top padding on the first category since the hero already pads below
            className={index === 0 ? "!pt-6 sm:!pt-10" : undefined}
          >
            <Container>
              <SectionHeading
                eyebrow={category.eyebrow}
                title={category.title}
                subtitle={category.subtitle}
              />

              <div className="mt-12 grid gap-5 sm:grid-cols-2 sm:gap-6">
                {category.serviceSlugs.map((slug) => {
                  const service = serviceBySlug.get(slug);
                  if (!service) return null;
                  return <ServiceDetailCard key={slug} service={service} />;
                })}
              </div>
            </Container>
          </Section>
        ))}

        <ProcessSection />

        <TechStackSection />

        <FinalCTA />
      </main>

      <Footer />
      <FloatingActions />
    </>
  );
}
