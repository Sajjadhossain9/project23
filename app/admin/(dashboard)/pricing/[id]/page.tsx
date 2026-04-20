import { notFound } from "next/navigation";
import { PricingForm } from "@/components/admin/PricingForm";
import { getPlan } from "@/lib/admin/pricing-repo";
import { updatePlanAction } from "../actions";

export const metadata = { title: "Edit plan" };

export default async function EditPricingPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const plan = await getPlan(id);
  if (!plan) notFound();

  // Bind the plan id into the action so the form can stay generic
  const boundAction = updatePlanAction.bind(null, id);

  return <PricingForm action={boundAction} plan={plan} mode="edit" />;
}
