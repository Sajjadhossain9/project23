"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PaymentMethod, PaymentStatus } from "@/lib/payments/types";

const statusOptions: Array<{ value: PaymentStatus | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "succeeded", label: "Succeeded" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
];

const methodOptions: Array<{ value: PaymentMethod | "all"; label: string }> = [
  { value: "all", label: "All methods" },
  { value: "bkash", label: "bKash" },
  { value: "nagad", label: "Nagad" },
  { value: "rocket", label: "Rocket" },
  { value: "card", label: "Card" },
  { value: "bank_transfer", label: "Bank transfer" },
];

interface PaymentFiltersProps {
  defaultValues: {
    status?: PaymentStatus;
    method?: PaymentMethod;
    q?: string;
  };
}

export function PaymentFilters({ defaultValues }: PaymentFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  /**
   * Filter UI writes to URL search params (not component state). This means
   * the page is deep-linkable — admins can bookmark "all refunded, bKash only."
   */
  function updateParam(key: string, value: string | undefined) {
    const next = new URLSearchParams(params.toString());
    if (value && value !== "all") {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    // Reset pagination when filters change
    next.delete("page");
    router.replace(`${pathname}?${next.toString()}`);
  }

  const hasAnyFilter = !!(defaultValues.status || defaultValues.method || defaultValues.q);

  return (
    <div className="mb-6 space-y-3">
      {/* Status segmented control */}
      <div
        role="group"
        aria-label="Filter by status"
        className="inline-flex items-center rounded-md border border-border-default bg-bg-surface p-0.5 text-caption flex-wrap"
      >
        {statusOptions.map((opt) => {
          const active =
            (opt.value === "all" && !defaultValues.status) ||
            opt.value === defaultValues.status;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => updateParam("status", opt.value)}
              aria-pressed={active}
              className={cn(
                "px-3 py-1.5 rounded-sm transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                active ? "bg-brand text-fg-inverse" : "text-fg-secondary hover:text-fg"
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Method + search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={defaultValues.method ?? "all"}
          onChange={(e) => updateParam("method", e.target.value)}
          className="h-10 px-3 pr-8 bg-bg-surface border border-border-default rounded-md text-body-sm text-fg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-colors"
        >
          {methodOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="relative flex-1 max-w-sm">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-tertiary pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            defaultValue={defaultValues.q ?? ""}
            placeholder="Search invoice or order ID"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateParam("q", (e.target as HTMLInputElement).value);
              }
            }}
            className="w-full h-10 pl-9 pr-9 bg-bg-surface border border-border-default rounded-md text-body-sm text-fg placeholder:text-fg-tertiary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-colors"
          />
          {defaultValues.q && (
            <button
              type="button"
              onClick={() => updateParam("q", undefined)}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-fg-tertiary hover:text-fg"
            >
              <X size={14} aria-hidden="true" />
            </button>
          )}
        </div>

        {hasAnyFilter && (
          <button
            type="button"
            onClick={() => router.replace(pathname)}
            className="text-body-sm text-fg-secondary hover:text-fg self-center"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}
