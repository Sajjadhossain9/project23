import Link from "next/link";
import { Plus, Edit2, Eye, EyeOff, Trash2, CheckCircle2 } from "lucide-react";
import { listPlans } from "@/lib/admin/pricing-repo";
import { pricingCategoryLabels } from "@/lib/pricing";
import { formatBdt } from "@/lib/utils";
import { Button, LinkButton } from "@/components/ui/Button";
import { deletePlanAction, togglePlanActiveAction } from "./actions";

export const metadata = { title: "Pricing" };

export default async function PricingListPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; updated?: string; deleted?: string }>;
}) {
  const params = await searchParams;
  const plans = await listPlans();

  const successMessage =
    params.created
      ? "Plan created."
      : params.updated
      ? "Plan updated."
      : params.deleted
      ? "Plan deleted."
      : null;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-h1 text-fg">Pricing plans</h1>
          <p className="mt-1 text-body text-fg-secondary">
            Manage what appears on the public pricing page. Changes are live immediately.
          </p>
        </div>
        <LinkButton href="/admin/pricing/new" variant="primary" size="md" iconLeft={<Plus size={16} />}>
          New plan
        </LinkButton>
      </div>

      {successMessage && (
        <div
          role="status"
          className="mb-6 flex items-start gap-2 rounded-md border border-success/30 bg-success/5 p-3 text-body-sm text-success"
        >
          <CheckCircle2 size={16} className="shrink-0 mt-0.5" aria-hidden="true" />
          <span>{successMessage}</span>
        </div>
      )}

      {plans.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border-subtle bg-bg-surface">
          <table className="w-full text-left">
            <thead className="bg-bg-raised text-caption text-fg-tertiary uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">Name</th>
                <th scope="col" className="px-4 py-3 font-medium">Category</th>
                <th scope="col" className="px-4 py-3 font-medium text-right">Price</th>
                <th scope="col" className="px-4 py-3 font-medium">Status</th>
                <th scope="col" className="px-4 py-3 font-medium text-right">Order</th>
                <th scope="col" className="px-4 py-3 font-medium text-right">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {plans.map((plan) => (
                <tr key={plan.id} className="hover:bg-bg-raised/50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/pricing/${plan.id}`}
                        className="font-medium text-fg hover:text-accent transition-colors"
                      >
                        {plan.name}
                      </Link>
                      {plan.popular && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm bg-accent-soft text-accent-ink text-caption">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-caption text-fg-tertiary mt-0.5">{plan.tagline}</p>
                  </td>
                  <td className="px-4 py-4 text-body-sm text-fg-secondary">
                    {pricingCategoryLabels[plan.category]}
                  </td>
                  <td className="px-4 py-4 text-body-sm text-fg tabular-nums text-right whitespace-nowrap">
                    {plan.customQuote ? (
                      <span className="text-fg-tertiary">Custom</span>
                    ) : (
                      <>
                        {formatBdt(plan.priceBdt)}
                        <span className="ml-1 text-caption text-fg-tertiary">
                          {plan.billingCycle === "one-time" ? "" : `/${plan.billingCycle.slice(0, -2)}`}
                        </span>
                      </>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={
                        plan.active
                          ? "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-success/10 text-success text-caption"
                          : "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-bg-raised text-fg-tertiary text-caption"
                      }
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${plan.active ? "bg-success" : "bg-fg-tertiary"}`}
                        aria-hidden="true"
                      />
                      {plan.active ? "Live" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-body-sm text-fg-tertiary tabular-nums text-right">
                    {plan.order}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <form action={togglePlanActiveAction.bind(null, plan.id)}>
                        <IconButton
                          type="submit"
                          label={plan.active ? "Hide from public site" : "Show on public site"}
                        >
                          {plan.active ? <EyeOff size={15} /> : <Eye size={15} />}
                        </IconButton>
                      </form>
                      <Link
                        href={`/admin/pricing/${plan.id}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-fg-secondary hover:text-fg hover:bg-bg-raised transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        aria-label={`Edit ${plan.name}`}
                      >
                        <Edit2 size={15} aria-hidden="true" />
                      </Link>
                      <form
                        action={deletePlanAction.bind(null, plan.id)}
                        onSubmit={(e) => {
                          if (!confirm(`Delete "${plan.name}"? This cannot be undone.`)) {
                            e.preventDefault();
                          }
                        }}
                      >
                        <IconButton
                          type="submit"
                          label={`Delete ${plan.name}`}
                          className="hover:!text-danger"
                        >
                          <Trash2 size={15} />
                        </IconButton>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function IconButton({
  children,
  label,
  type,
  className,
}: {
  children: React.ReactNode;
  label: string;
  type: "button" | "submit";
  className?: string;
}) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-fg-secondary hover:text-fg hover:bg-bg-raised transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${className ?? ""}`}
    >
      {children}
    </button>
  );
}

function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-border-default bg-bg-surface p-12 text-center">
      <p className="text-body text-fg">No pricing plans yet.</p>
      <p className="mt-1 text-body-sm text-fg-tertiary">
        Create your first plan to populate the public pricing page.
      </p>
      <div className="mt-5">
        <LinkButton href="/admin/pricing/new" variant="primary" size="md" iconLeft={<Plus size={16} />}>
          New plan
        </LinkButton>
      </div>
    </div>
  );
}
