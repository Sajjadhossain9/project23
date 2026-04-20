"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Lock, ShieldCheck } from "lucide-react";
import { PAYMENT_CONFIG } from "@/lib/payments/config";
import { formatBdt, cn } from "@/lib/utils";
import type { PricingPlan } from "@/lib/types";
import type { PaymentMethod } from "@/lib/payments/types";

interface CheckoutFormProps {
  plan: PricingPlan;
}

export function CheckoutForm({ plan }: CheckoutFormProps) {
  const [method, setMethod] = useState<PaymentMethod>("bkash");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = e.currentTarget;
    const body = {
      planId: plan.id,
      method,
      customerName: (form.elements.namedItem("customerName") as HTMLInputElement).value,
      customerEmail: (form.elements.namedItem("customerEmail") as HTMLInputElement).value,
      customerPhone: (form.elements.namedItem("customerPhone") as HTMLInputElement).value,
      notes: (form.elements.namedItem("notes") as HTMLTextAreaElement).value || undefined,
    };

    try {
      const res = await fetch("/api/payments/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string };
        setError(err.error ?? "Could not start payment. Please try again.");
        setSubmitting(false);
        return;
      }

      const { redirectUrl } = (await res.json()) as { redirectUrl: string };
      // Replace so the back button doesn't resubmit
      window.location.replace(redirectUrl);
    } catch {
      setError("Network error. Please try again or use WhatsApp.");
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/pricing"
        className="inline-flex items-center gap-1.5 text-body-sm text-fg-secondary hover:text-fg mb-4"
      >
        <ArrowLeft size={14} aria-hidden="true" />
        Back to pricing
      </Link>

      <h1 className="text-h1 text-fg">Complete your purchase</h1>
      <p className="mt-2 text-body text-fg-secondary">
        You&apos;ll be redirected to a secure payment page after you continue.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Form column */}
        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
          {/* Method picker */}
          <fieldset>
            <legend className="text-h4 text-fg mb-4">1. Choose payment method</legend>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {PAYMENT_CONFIG.methodOptions.map((opt) => (
                <MethodRadio
                  key={opt.method}
                  method={opt.method}
                  label={opt.label}
                  description={opt.description}
                  checked={method === opt.method}
                  onChange={() => setMethod(opt.method)}
                />
              ))}
            </div>
          </fieldset>

          {/* Contact fields */}
          <fieldset className="space-y-4">
            <legend className="text-h4 text-fg mb-4">2. Your details</legend>

            <Field label="Full name" name="customerName" autoComplete="name" required />
            <Field
              label="Email"
              name="customerEmail"
              type="email"
              autoComplete="email"
              required
              placeholder="you@company.com"
              hint="Receipt and project updates will go here"
            />
            <Field
              label="Mobile number"
              name="customerPhone"
              type="tel"
              autoComplete="tel"
              required
              placeholder="01XXXXXXXXX"
              hint={
                method === "bkash" || method === "nagad" || method === "rocket"
                  ? `Use the number registered with your ${method === "bkash" ? "bKash" : method === "nagad" ? "Nagad" : "Rocket"} wallet`
                  : "We'll use this for order follow-ups"
              }
            />
            <Field
              label="Notes (optional)"
              name="notes"
              type="textarea"
              placeholder="Anything we should know before starting?"
            />
          </fieldset>

          {error && (
            <div role="alert" className="rounded-md border border-danger/30 bg-danger/5 p-3 text-body-sm text-danger">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 h-12 px-6 w-full sm:w-auto rounded-md bg-brand text-fg-inverse font-medium hover:bg-brand-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                Redirecting to payment…
              </>
            ) : (
              <>
                <Lock size={16} aria-hidden="true" />
                Continue to pay {formatBdt(plan.priceBdt)}
              </>
            )}
          </button>

          <p className="flex items-center gap-2 text-caption text-fg-tertiary">
            <ShieldCheck size={14} aria-hidden="true" />
            SSL-encrypted. Processed by SSLCOMMERZ, Bangladesh Bank–licensed.
          </p>
        </form>

        {/* Order summary sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-lg border border-border-subtle bg-bg-surface p-5">
            <p className="text-micro uppercase text-fg-tertiary mb-3">Order summary</p>
            <h2 className="text-h4 text-fg">{plan.name}</h2>
            <p className="mt-1 text-body-sm text-fg-secondary">{plan.tagline}</p>

            <ul className="mt-5 space-y-2 text-body-sm text-fg-secondary" role="list">
              {plan.features.slice(0, 4).map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-accent shrink-0">·</span>
                  <span>{f}</span>
                </li>
              ))}
              {plan.features.length > 4 && (
                <li className="text-caption text-fg-tertiary pl-3">
                  + {plan.features.length - 4} more included
                </li>
              )}
            </ul>

            <div className="mt-5 pt-5 border-t border-border-subtle space-y-1.5 text-body-sm">
              <div className="flex justify-between text-fg-secondary">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatBdt(plan.priceBdt)}</span>
              </div>
              <div className="flex justify-between text-fg-tertiary">
                <span>VAT</span>
                <span>Included</span>
              </div>
              <div className="flex justify-between pt-2 mt-2 border-t border-border-subtle">
                <span className="font-medium text-fg">Total</span>
                <span className="tabular-nums font-semibold text-fg">
                  {formatBdt(plan.priceBdt)}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

// ---------- Helpers ----------

function MethodRadio({
  method,
  label,
  description,
  checked,
  onChange,
}: {
  method: PaymentMethod;
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      className={cn(
        "relative flex cursor-pointer items-start gap-3 rounded-md border p-4 transition-colors",
        checked
          ? "border-accent bg-accent-soft"
          : "border-border-default bg-bg-surface hover:border-border-strong"
      )}
    >
      <input
        type="radio"
        name="method"
        value={method}
        checked={checked}
        onChange={onChange}
        className="mt-0.5 h-4 w-4 text-accent focus-visible:ring-accent"
      />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-fg text-body-sm">{label}</p>
        <p className="text-caption text-fg-secondary mt-0.5">{description}</p>
      </div>
    </label>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
  autoComplete,
  hint,
}: {
  label: string;
  name: string;
  type?: "text" | "email" | "tel" | "textarea";
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  hint?: string;
}) {
  const commonProps = {
    id: name,
    name,
    placeholder,
    required,
    autoComplete,
    className:
      "w-full px-3 bg-bg border border-border-default rounded-md text-body text-fg placeholder:text-fg-tertiary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-colors",
  };

  return (
    <div>
      <label htmlFor={name} className="block text-caption text-fg-secondary mb-1.5">
        {label}
        {required && <span className="text-danger ml-0.5">*</span>}
      </label>
      {type === "textarea" ? (
        <textarea {...commonProps} rows={3} className={`${commonProps.className} py-2.5`} />
      ) : (
        <input {...commonProps} type={type} className={`${commonProps.className} h-11`} />
      )}
      {hint && <p className="mt-1.5 text-caption text-fg-tertiary">{hint}</p>}
    </div>
  );
}
