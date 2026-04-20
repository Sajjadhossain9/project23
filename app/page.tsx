import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { TrustStrip } from "@/components/TrustStrip";
import { ServicesOverview } from "@/components/ServicesOverview";
import { WhyWevnix } from "@/components/WhyWevnix";
import { Solutions } from "@/components/Solutions";
import { CaseStudies } from "@/components/CaseStudies";
import { PricingTeaser } from "@/components/PricingTeaser";
import { Testimonials } from "@/components/Testimonials";
import { BlogPreview } from "@/components/BlogPreview";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <TrustStrip />
        <ServicesOverview />
        <WhyWevnix />
        <Solutions />
        <CaseStudies />
        <PricingTeaser />
        <Testimonials />
        <BlogPreview />
        <FinalCTA />
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
