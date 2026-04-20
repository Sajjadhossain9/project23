/**
 * Payment configuration.
 *
 * Strategy: go through ONE aggregator (SSLCOMMERZ) for all three mobile wallets
 * plus cards, rather than integrating bKash, Nagad, and Rocket separately.
 *
 * Why:
 *   1. SSLCOMMERZ is Bangladesh Bank PSO-licensed and powers 150k+ merchants.
 *   2. One onboarding, one API, one reconciliation dashboard — vs. three
 *      separate merchant accounts with three separate approval queues.
 *   3. All three wallets + Visa/Mastercard/Amex on a single hosted checkout.
 *   4. The architecture still lets us swap providers per-method later —
 *      e.g., move bKash to the direct bKash API if fees matter enough.
 *
 * When to add direct integrations:
 *   - Volume > ~500 transactions/day on a single rail (direct APIs get
 *     lower fees at scale).
 *   - Regulatory requirement to reconcile against a specific provider.
 *   - UX requirement for a native experience (SSLCOMMERZ hosted form is
 *     acceptable but not beautiful).
 */

import type { PaymentMethod } from "./types";

export const PAYMENT_CONFIG = {
  /** Aggregator provider — currently SSLCOMMERZ. */
  primaryProvider: "sslcommerz" as const,

  /** How long a payment session stays valid before we mark it expired. */
  sessionTtlMinutes: 30,

  /** Currency — SSLCOMMERZ supports BDT only for local merchants. */
  currency: "BDT" as const,

  /**
   * Per-method labels shown on the checkout page. Order matters — bKash
   * first because it's the most-used wallet in BD.
   */
  methodOptions: [
    { method: "bkash" as const, label: "bKash", description: "Pay with your bKash wallet" },
    { method: "nagad" as const, label: "Nagad", description: "Pay with your Nagad wallet" },
    { method: "rocket" as const, label: "Rocket", description: "Dutch-Bangla mobile banking" },
    { method: "card" as const, label: "Card", description: "Visa, Mastercard, Amex" },
    {
      method: "bank_transfer" as const,
      label: "Bank transfer",
      description: "For BDT 100,000+ invoices. We verify manually.",
    },
  ],

  /**
   * Map our internal method names to SSLCOMMERZ's gateway codes. SSLCOMMERZ
   * uses these in the `gw` parameter to preselect a rail on the hosted page.
   */
  sslcommerzMethodCodes: {
    bkash: "bkashv2",
    nagad: "nagad",
    rocket: "dbblmobilebanking",
    card: "card",
    bank_transfer: "internetbank",
  } satisfies Record<PaymentMethod, string>,
};

export function getPublicBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_BASE_URL ??
    (process.env.NODE_ENV === "production" ? "https://wevnix.com" : "http://localhost:3000")
  );
}
