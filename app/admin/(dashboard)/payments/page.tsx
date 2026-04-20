import Link from "next/link";
import { Download, CreditCard } from "lucide-react";
import { listPayments, getRevenueSummary } from "@/lib/payments/repo";
import { formatBdt } from "@/lib/utils";
import { PaymentStatusBadge } from "@/components/admin/PaymentStatusBadge";
import { PaymentMethodBadge } from "@/components/admin/PaymentMethodBadge";
import { PaymentFilters } from "@/components/admin/PaymentFilters";
import type { PaymentMethod, PaymentStatus } from "@/lib/payments/types";

export const metadata = { title: "Payments" };

interface SearchParams {
  status?: string;
  method?: string;
  q?: string;
  page?: string;
}

const PAGE_SIZE = 25;

export default async function PaymentsListPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  const filter = {
    status: isPaymentStatus(params.status) ? params.status : undefined,
    method: isPaymentMethod(params.method) ? params.method : undefined,
    q: params.q?.trim() || undefined,
  };

  const [{ items, total }, summary] = await Promise.all([
    listPayments(filter, { limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE }),
    getRevenueSummary(30),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const exportQuery = new URLSearchParams({
    ...(filter.status && { status: filter.status }),
    ...(filter.method && { method: filter.method }),
    ...(filter.q && { q: filter.q }),
  }).toString();

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-h1 text-fg">Payments</h1>
          <p className="mt-1 text-body text-fg-secondary">
            Every transaction from the public pricing pages.
          </p>
        </div>
        <Link
          href={`/api/admin/payments/export${exportQuery ? `?${exportQuery}` : ""}`}
          className="inline-flex items-center gap-2 h-11 px-4 rounded-md border border-border-default text-body-sm font-medium text-fg hover:bg-bg-raised transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <Download size={16} aria-hidden="true" />
          Export CSV
        </Link>
      </div>

      {/* Revenue summary */}
      <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <SummaryCard
          label="Received (30 days)"
          value={formatBdt(summary.totalBdt)}
          sub={`${summary.successCount} payment${summary.successCount === 1 ? "" : "s"}`}
        />
        <SummaryCard
          label="Pending"
          value={formatBdt(summary.pendingBdt)}
          sub="Awaiting confirmation"
        />
        <SummaryCard
          label="Refunded"
          value={formatBdt(summary.refundedBdt)}
          sub="Last 30 days"
          muted
        />
        <SummaryCard label="All time total" value={String(total)} sub="Transactions" />
      </dl>

      <PaymentFilters defaultValues={filter} />

      {items.length === 0 ? (
        <EmptyState hasFilters={!!(filter.status || filter.method || filter.q)} />
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-border-subtle bg-bg-surface">
            <table className="w-full text-left">
              <thead className="bg-bg-raised text-caption text-fg-tertiary uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">Invoice</th>
                  <th scope="col" className="px-4 py-3 font-medium">Method</th>
                  <th scope="col" className="px-4 py-3 font-medium text-right">Amount</th>
                  <th scope="col" className="px-4 py-3 font-medium">Status</th>
                  <th scope="col" className="px-4 py-3 font-medium">Date</th>
                  <th scope="col" className="px-4 py-3 font-medium text-right">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {items.map((payment) => (
                  <tr key={payment.id} className="hover:bg-bg-raised/50 transition-colors">
                    <td className="px-4 py-4">
                      <Link
                        href={`/admin/payments/${payment.id}`}
                        className="font-mono text-body-sm text-fg hover:text-accent transition-colors"
                      >
                        {payment.merchantInvoice}
                      </Link>
                      {payment.orderId && (
                        <p className="text-caption text-fg-tertiary mt-0.5 font-mono">
                          {payment.orderId}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <PaymentMethodBadge method={payment.method} />
                    </td>
                    <td className="px-4 py-4 text-body-sm text-fg tabular-nums text-right whitespace-nowrap">
                      {formatBdt(payment.amountBdt)}
                    </td>
                    <td className="px-4 py-4">
                      <PaymentStatusBadge status={payment.status} />
                    </td>
                    <td className="px-4 py-4 text-body-sm text-fg-secondary whitespace-nowrap">
                      {formatDate(payment.createdAt)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Link
                        href={`/admin/payments/${payment.id}`}
                        className="text-body-sm text-fg-secondary hover:text-fg"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <Pagination currentPage={page} totalPages={totalPages} query={exportQuery} />
          )}
        </>
      )}
    </div>
  );
}

// ---------- Subcomponents ----------

function SummaryCard({
  label,
  value,
  sub,
  muted,
}: {
  label: string;
  value: string;
  sub: string;
  muted?: boolean;
}) {
  return (
    <div className="bg-bg-raised rounded-md p-4">
      <dt className="text-caption text-fg-secondary">{label}</dt>
      <dd
        className={`mt-1 text-h3 font-semibold tabular-nums ${muted ? "text-fg-tertiary" : "text-fg"}`}
      >
        {value}
      </dd>
      <p className="mt-0.5 text-caption text-fg-tertiary">{sub}</p>
    </div>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="rounded-lg border border-dashed border-border-default bg-bg-surface p-12 text-center">
      <CreditCard size={24} className="mx-auto text-fg-tertiary mb-3" aria-hidden="true" />
      <p className="text-body text-fg">
        {hasFilters ? "No payments match those filters." : "No payments yet."}
      </p>
      <p className="mt-1 text-body-sm text-fg-tertiary">
        {hasFilters
          ? "Clear the filters or try a different search."
          : "Transactions will appear here once customers start paying."}
      </p>
      {hasFilters && (
        <Link
          href="/admin/payments"
          className="inline-block mt-4 text-body-sm font-medium text-accent hover:underline"
        >
          Clear filters
        </Link>
      )}
    </div>
  );
}

function Pagination({
  currentPage,
  totalPages,
  query,
}: {
  currentPage: number;
  totalPages: number;
  query: string;
}) {
  const href = (p: number) => `/admin/payments?${query ? `${query}&` : ""}page=${p}`;
  return (
    <nav className="mt-6 flex items-center justify-between" aria-label="Pagination">
      <p className="text-caption text-fg-tertiary">
        Page <span className="tabular-nums font-medium text-fg-secondary">{currentPage}</span> of{" "}
        <span className="tabular-nums">{totalPages}</span>
      </p>
      <div className="flex gap-2">
        {currentPage > 1 && (
          <Link
            href={href(currentPage - 1)}
            className="inline-flex h-9 px-3 items-center rounded-md border border-border-default text-body-sm hover:bg-bg-raised transition-colors"
          >
            Previous
          </Link>
        )}
        {currentPage < totalPages && (
          <Link
            href={href(currentPage + 1)}
            className="inline-flex h-9 px-3 items-center rounded-md border border-border-default text-body-sm hover:bg-bg-raised transition-colors"
          >
            Next
          </Link>
        )}
      </div>
    </nav>
  );
}

// ---------- Type guards ----------

function isPaymentStatus(v: unknown): v is PaymentStatus {
  return ["pending", "processing", "succeeded", "failed", "refunded", "expired"].includes(v as string);
}

function isPaymentMethod(v: unknown): v is PaymentMethod {
  return ["bkash", "nagad", "rocket", "card", "bank_transfer"].includes(v as string);
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
