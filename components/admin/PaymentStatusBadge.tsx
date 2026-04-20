import type { PaymentStatus } from "@/lib/payments/types";

const config: Record<PaymentStatus, { label: string; dot: string; classes: string }> = {
  pending: {
    label: "Pending",
    dot: "bg-fg-tertiary",
    classes: "bg-bg-raised text-fg-secondary",
  },
  processing: {
    label: "Processing",
    dot: "bg-accent",
    classes: "bg-accent-soft text-accent-ink",
  },
  succeeded: {
    label: "Succeeded",
    dot: "bg-success",
    classes: "bg-success/10 text-success",
  },
  failed: {
    label: "Failed",
    dot: "bg-danger",
    classes: "bg-danger/10 text-danger",
  },
  refunded: {
    label: "Refunded",
    dot: "bg-warning",
    classes: "bg-warning/10 text-warning",
  },
  expired: {
    label: "Expired",
    dot: "bg-fg-tertiary",
    classes: "bg-bg-raised text-fg-tertiary",
  },
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const c = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-caption ${c.classes}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} aria-hidden="true" />
      {c.label}
    </span>
  );
}
