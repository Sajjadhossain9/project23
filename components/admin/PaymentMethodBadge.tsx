import type { PaymentMethod } from "@/lib/payments/types";

const config: Record<PaymentMethod, { label: string; color: string }> = {
  bkash: { label: "bKash", color: "text-[#E2136E] bg-[#E2136E]/10" },
  nagad: { label: "Nagad", color: "text-[#EC1C24] bg-[#EC1C24]/10" },
  rocket: { label: "Rocket", color: "text-[#8C3494] bg-[#8C3494]/10" },
  card: { label: "Card", color: "text-fg bg-bg-raised" },
  bank_transfer: { label: "Bank", color: "text-fg bg-bg-raised" },
};

export function PaymentMethodBadge({ method }: { method: PaymentMethod }) {
  const c = config[method];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-caption font-medium ${c.color}`}>
      {c.label}
    </span>
  );
}
