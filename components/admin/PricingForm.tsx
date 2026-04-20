"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Save, ArrowLeft } from "lucide-react";
import type { PricingPlan, PricingCategory, BillingCycle } from "@/lib/types";
import type { PricingFormState } from "@/app/admin/(dashboard)/pricing/actions";
import { pricingCategoryLabels } from "@/lib/pricing";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type ActionFn = (
  prev: PricingFormState,
  formData: FormData
) => Promise<PricingFormState>;

interface PricingFormProps {
  action: ActionFn;
  plan?: PricingPlan;
  mode: "create" | "edit";
}

const categories: PricingCategory[] = ["web", "hosting", "seo", "ai"];
const billingCycles: BillingCycle[] = ["one-time", "monthly", "yearly"];
const billingCycleLabels: Record<BillingCycle, string> = {
  "one-time": "One-time",
  monthly: "Per month",
  yearly: "Per year",
};

export function PricingForm({ action, plan, mode }: PricingFormProps) {
  const [state, formAction] = useActionState<PricingFormState, FormData>(action, {});
  const err = (key: string) => state.errors?.[key]?.[0];

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/pricing"
        className="inline-flex items-center gap-1.5 text-body-sm text-fg-secondary hover:text-fg mb-4"
      >
        <ArrowLeft size={14} aria-hidden="true" />
        Back to pricing
      </Link>

      <h1 className="text-h1 text-fg">
        {mode === "create" ? "New pricing plan" : `Edit: ${plan?.name}`}
      </h1>
      <p className="mt-2 text-body text-fg-secondary">
        Changes take effect immediately on the public pricing page.
      </p>

      <form action={formAction} className="mt-8 space-y-6" noValidate>
        {/* Category */}
        <Field label="Category" htmlFor="category" error={err("category")}>
          <select
            id="category"
            name="category"
            defaultValue={plan?.category ?? "web"}
            className={selectClass(!!err("category"))}
            required
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {pricingCategoryLabels[c]}
              </option>
            ))}
          </select>
        </Field>

        {/* Name + Order */}
        <div className="grid gap-6 sm:grid-cols-[2fr_1fr]">
          <Field label="Name" htmlFor="name" error={err("name")}>
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={plan?.name}
              placeholder="Web Starter"
              className={inputClass(!!err("name"))}
              required
              maxLength={60}
            />
          </Field>
          <Field
            label="Display order"
            htmlFor="order"
            hint="Lower = shown first"
            error={err("order")}
          >
            <input
              id="order"
              name="order"
              type="number"
              min={0}
              max={999}
              defaultValue={plan?.order ?? 1}
              className={inputClass(!!err("order"))}
              required
            />
          </Field>
        </div>

        {/* Tagline */}
        <Field label="Tagline" htmlFor="tagline" error={err("tagline")}>
          <input
            id="tagline"
            name="tagline"
            type="text"
            defaultValue={plan?.tagline}
            placeholder="Perfect for a first professional presence"
            className={inputClass(!!err("tagline"))}
            required
            maxLength={140}
          />
        </Field>

        {/* Price + Billing */}
        <div className="grid gap-6 sm:grid-cols-2">
          <Field
            label="Price (BDT)"
            htmlFor="priceBdt"
            hint="Whole Taka. Enter 0 for custom-quote plans."
            error={err("priceBdt")}
          >
            <div className="relative">
              <span
                className="absolute left-3 top-1/2 -translate-y-1/2 text-body text-fg-tertiary pointer-events-none"
                aria-hidden="true"
              >
                ৳
              </span>
              <input
                id="priceBdt"
                name="priceBdt"
                type="number"
                min={0}
                step={100}
                defaultValue={plan?.priceBdt ?? 0}
                className={cn(inputClass(!!err("priceBdt")), "pl-8")}
                required
              />
            </div>
          </Field>
          <Field label="Billing cycle" htmlFor="billingCycle" error={err("billingCycle")}>
            <select
              id="billingCycle"
              name="billingCycle"
              defaultValue={plan?.billingCycle ?? "one-time"}
              className={selectClass(!!err("billingCycle"))}
              required
            >
              {billingCycles.map((b) => (
                <option key={b} value={b}>
                  {billingCycleLabels[b]}
                </option>
              ))}
            </select>
          </Field>
        </div>

        {/* Features */}
        <Field
          label="Features"
          htmlFor="features"
          hint="One feature per line. These appear as the checkmark list on the plan card."
          error={err("features")}
        >
          <textarea
            id="features"
            name="features"
            rows={6}
            defaultValue={plan?.features?.join("\n") ?? ""}
            placeholder={"5-page responsive website\nMobile-optimized design\nBasic SEO setup\nContact form\n1 month of support"}
            className={cn(
              inputClass(!!err("features")),
              "h-auto py-3 leading-relaxed resize-y"
            )}
            required
          />
        </Field>

        {/* Flags */}
        <fieldset className="space-y-3 border-t border-border-subtle pt-6">
          <legend className="sr-only">Plan flags</legend>

          <Checkbox
            name="active"
            label="Active"
            description="Show this plan on the public pricing page."
            defaultChecked={plan?.active ?? true}
          />
          <Checkbox
            name="popular"
            label="Mark as Most Popular"
            description="Highlights this plan with a badge and accent border."
            defaultChecked={plan?.popular ?? false}
          />
          <Checkbox
            name="customQuote"
            label="Custom quote (no fixed price)"
            description="Card shows 'Custom' instead of a Taka amount."
            defaultChecked={plan?.customQuote ?? false}
          />
        </fieldset>

        {state.message && (
          <p role="alert" className="text-body-sm text-danger">
            {state.message}
          </p>
        )}

        {/* Submit */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
          <Link
            href="/admin/pricing"
            className="inline-flex items-center justify-center h-11 px-5 rounded-md border border-border-default text-body-sm font-medium text-fg hover:bg-bg-raised transition-colors"
          >
            Cancel
          </Link>
          <SubmitButton mode={mode} />
        </div>
      </form>
    </div>
  );
}

// ---------- Helpers ----------

function SubmitButton({ mode }: { mode: "create" | "edit" }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="primary"
      size="md"
      disabled={pending}
      iconLeft={<Save size={16} />}
    >
      {pending ? "Saving…" : mode === "create" ? "Create plan" : "Save changes"}
    </Button>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-caption text-fg-secondary mb-1.5">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-caption text-fg-tertiary">{hint}</p>}
      {error && (
        <p role="alert" className="mt-1.5 text-caption text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

function Checkbox({
  name,
  label,
  description,
  defaultChecked,
}: {
  name: string;
  label: string;
  description: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-0.5 h-4 w-4 rounded border-border-default text-accent focus-visible:ring-2 focus-visible:ring-accent"
      />
      <span className="flex-1 text-body-sm">
        <span className="font-medium text-fg">{label}</span>
        <span className="block text-caption text-fg-tertiary">{description}</span>
      </span>
    </label>
  );
}

function inputClass(hasError: boolean) {
  return cn(
    "w-full h-11 px-3 bg-bg border rounded-md text-body text-fg placeholder:text-fg-tertiary transition-colors focus:outline-none focus:ring-2",
    hasError
      ? "border-danger focus:border-danger focus:ring-danger/30"
      : "border-border-default focus:border-accent focus:ring-accent/30"
  );
}

function selectClass(hasError: boolean) {
  return cn(inputClass(hasError), "pr-8");
}
