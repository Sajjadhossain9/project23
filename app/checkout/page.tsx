import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { Container } from "@/components/ui/Container";
import { CheckoutForm } from "@/components/payments/CheckoutForm";
import { getPricingPlans } from "@/lib/pricing";

export const metadata = { title: "Checkout" };

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const { plan: planId } = await searchParams;
  if (!planId) notFound();

  const plans = await getPricingPlans();
  const plan = plans.find((p) => p.id === planId);
  if (!plan || plan.customQuote) notFound();

  return (
    <>
      <Header />
      <main id="main" className="py-14 sm:py-20">
        <Container>
          <CheckoutForm plan={plan} />
        </Container>
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
