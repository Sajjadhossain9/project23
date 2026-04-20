/**
 * Provider registry.
 *
 * Today every method routes through SSLCOMMERZ. Later, when direct integrations
 * make sense, change the mapping here. The rest of the app doesn't care.
 *
 * Adding a direct bKash integration later:
 *   1. Write lib/payments/providers/bkash.ts implementing PaymentProvider.
 *   2. Change the `bkash:` line below to `bkashDirect`.
 *   3. That's it — checkout, webhook, reconciliation all keep working.
 */

import { sslcommerzProvider } from "./sslcommerz";
import type { PaymentMethod, PaymentProvider } from "../types";

const providers: Record<PaymentMethod, PaymentProvider> = {
  bkash: sslcommerzProvider,
  nagad: sslcommerzProvider,
  rocket: sslcommerzProvider,
  card: sslcommerzProvider,
  bank_transfer: sslcommerzProvider,
};

export function getProviderForMethod(method: PaymentMethod): PaymentProvider {
  const provider = providers[method];
  if (!provider) throw new Error(`No provider configured for method: ${method}`);
  return provider;
}

export function getProviderByName(name: string): PaymentProvider | null {
  // Find any registered provider whose `name` matches — used when processing
  // an IPN since we know the gateway from the Payment row but not the method.
  const match = Object.values(providers).find((p) => p.name === name);
  return match ?? null;
}
