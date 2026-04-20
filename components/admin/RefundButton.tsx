"use client";

import { useFormStatus } from "react-dom";
import { RefreshCcw, Loader2 } from "lucide-react";

export function RefundButton({ amount }: { amount: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!confirm(`Refund ${amount}? This will mark the payment as refunded and cancel the order.`)) {
          e.preventDefault();
        }
      }}
      className="inline-flex items-center gap-2 h-10 px-4 rounded-md border border-border-default text-body-sm font-medium text-fg hover:bg-bg-raised hover:border-danger hover:text-danger transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50"
    >
      {pending ? (
        <Loader2 size={14} className="animate-spin" aria-hidden="true" />
      ) : (
        <RefreshCcw size={14} aria-hidden="true" />
      )}
      {pending ? "Refunding…" : "Refund"}
    </button>
  );
}
