import { PricingForm } from "@/components/admin/PricingForm";
import { createPlanAction } from "../actions";

export const metadata = { title: "New plan" };

export default function NewPricingPlanPage() {
  return <PricingForm action={createPlanAction} mode="create" />;
}
