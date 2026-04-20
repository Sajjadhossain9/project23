/**
 * GET /api/admin/payments/export
 *
 * Streams a CSV of all payments matching the current filter.
 * Used by the Export CSV button on the admin payments inbox.
 *
 * Security: auth-required via getSession. Never expose this publicly —
 * it contains customer PII.
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { listPayments, getOrder } from "@/lib/payments/repo";
import type { PaymentMethod, PaymentStatus } from "@/lib/payments/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const status = url.searchParams.get("status") as PaymentStatus | null;
  const method = url.searchParams.get("method") as PaymentMethod | null;
  const q = url.searchParams.get("q")?.trim() || undefined;

  // Pull everything at once — admin exports are small enough. If payments
  // ever exceed ~50k, batch this with cursor pagination.
  const { items } = await listPayments(
    {
      ...(status && { status }),
      ...(method && { method }),
      ...(q && { q }),
    },
    { limit: 10_000 }
  );

  // Enrich with customer info from orders
  const rows = await Promise.all(
    items.map(async (p) => {
      const order = p.orderId ? await getOrder(p.orderId) : null;
      return {
        invoice: p.merchantInvoice,
        paymentId: p.id,
        orderId: p.orderId ?? "",
        status: p.status,
        method: p.method,
        gateway: p.gateway,
        gatewayRef: p.gatewayRef ?? "",
        amountBdt: String(p.amountBdt),
        currency: p.currency,
        customerName: order?.customerName ?? "",
        customerEmail: order?.customerEmail ?? "",
        customerPhone: order?.customerPhone ?? "",
        planId: order?.planId ?? "",
        createdAt: p.createdAt,
        paidAt: p.paidAt ?? "",
        failureReason: p.failureReason ?? "",
      };
    })
  );

  const headers = [
    "Invoice",
    "Payment ID",
    "Order ID",
    "Status",
    "Method",
    "Gateway",
    "Gateway Ref",
    "Amount (BDT)",
    "Currency",
    "Customer Name",
    "Customer Email",
    "Customer Phone",
    "Plan",
    "Created At",
    "Paid At",
    "Failure Reason",
  ];

  const csv = [
    headers.join(","),
    ...rows.map((r) =>
      [
        r.invoice,
        r.paymentId,
        r.orderId,
        r.status,
        r.method,
        r.gateway,
        r.gatewayRef,
        r.amountBdt,
        r.currency,
        r.customerName,
        r.customerEmail,
        r.customerPhone,
        r.planId,
        r.createdAt,
        r.paidAt,
        r.failureReason,
      ]
        .map(escapeCsv)
        .join(",")
    ),
  ].join("\n");

  const filename = `wevnix-payments-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}

/**
 * Escape a CSV field per RFC 4180:
 *   - wrap in quotes if it contains comma, quote, newline, or leading/trailing space
 *   - double any embedded quotes
 */
function escapeCsv(value: string): string {
  if (value === "" || value == null) return "";
  const needsQuoting = /[",\n\r]/.test(value) || value !== value.trim();
  if (!needsQuoting) return value;
  return `"${value.replace(/"/g, '""')}"`;
}
