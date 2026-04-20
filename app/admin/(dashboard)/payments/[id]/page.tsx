import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, RefreshCcw } from "lucide-react";
import { getPayment, getPaymentEvents, getOrder } from "@/lib/payments/repo";
import { formatBdt } from "@/lib/utils";
import { PaymentStatusBadge } from "@/components/admin/PaymentStatusBadge";
import { PaymentMethodBadge } from "@/components/admin/PaymentMethodBadge";
import { PaymentTimeline } from "@/components/admin/PaymentTimeline";
import { RefundButton } from "@/components/admin/RefundButton";
import { refundPaymentAction } from "./actions";

export default async function PaymentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const payment = await getPayment(id);
  if (!payment) notFound();

  const [events, order] = await Promise.all([
    getPaymentEvents(id),
    payment.orderId ? getOrder(payment.orderId) : Promise.resolve(null),
  ]);

  return (
    <div className="max-w-4xl">
      <Link
        href="/admin/payments"
        className="inline-flex items-center gap-1.5 text-body-sm text-fg-secondary hover:text-fg mb-4"
      >
        <ArrowLeft size={14} aria-hidden="true" />
        Back to payments
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-h2 text-fg font-mono">{payment.merchantInvoice}</h1>
            <PaymentStatusBadge status={payment.status} />
          </div>
          <p className="text-body text-fg-secondary">
            Created {formatDateTime(payment.createdAt)}
          </p>
        </div>

        {payment.status === "succeeded" && (
          <form action={refundPaymentAction.bind(null, payment.id)}>
            <RefundButton amount={formatBdt(payment.amountBdt)} />
          </form>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Main column */}
        <div className="space-y-6">
          {/* Payment details */}
          <div className="rounded-lg border border-border-subtle bg-bg-surface p-5">
            <h2 className="text-h4 text-fg mb-4">Payment</h2>
            <dl className="grid gap-3 sm:grid-cols-2">
              <DetailRow label="Amount" value={formatBdt(payment.amountBdt)} mono />
              <DetailRow label="Currency" value={payment.currency} />
              <DetailRow label="Method" value={<PaymentMethodBadge method={payment.method} />} />
              <DetailRow label="Gateway" value={payment.gateway} />
              <DetailRow label="Gateway ref" value={payment.gatewayRef ?? "—"} mono />
              <DetailRow
                label="Paid at"
                value={payment.paidAt ? formatDateTime(payment.paidAt) : "—"}
              />
              {payment.failureReason && (
                <div className="sm:col-span-2">
                  <DetailRow
                    label="Failure reason"
                    value={<span className="text-danger">{payment.failureReason}</span>}
                  />
                </div>
              )}
            </dl>
          </div>

          {/* Customer + order */}
          {order && (
            <div className="rounded-lg border border-border-subtle bg-bg-surface p-5">
              <h2 className="text-h4 text-fg mb-4">Customer &amp; order</h2>
              <dl className="grid gap-3 sm:grid-cols-2">
                <DetailRow label="Name" value={order.customerName} />
                <DetailRow label="Email" value={order.customerEmail} />
                <DetailRow label="Phone" value={order.customerPhone} mono />
                <DetailRow label="Order ID" value={order.id} mono />
                <DetailRow label="Order status" value={order.status} />
                {order.planId && <DetailRow label="Plan" value={order.planId} />}
              </dl>
              {order.notes && (
                <div className="mt-4 pt-4 border-t border-border-subtle">
                  <p className="text-caption text-fg-tertiary mb-1">Notes</p>
                  <p className="text-body-sm text-fg whitespace-pre-wrap">{order.notes}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Timeline sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-lg border border-border-subtle bg-bg-surface p-5">
            <h2 className="text-h4 text-fg mb-4">Event timeline</h2>
            <PaymentTimeline events={events} />
          </div>
        </aside>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="text-caption text-fg-tertiary">{label}</dt>
      <dd className={`mt-0.5 text-body-sm text-fg ${mono ? "font-mono" : ""}`}>{value}</dd>
    </div>
  );
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
