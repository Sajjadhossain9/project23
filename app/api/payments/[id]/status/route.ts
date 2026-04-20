/**
 * GET /api/payments/[id]/status
 *
 * Lightweight status check used by the return page while it waits for the
 * webhook to arrive. Returns minimal data — no customer PII.
 */

import { NextResponse } from "next/server";
import { getPayment } from "@/lib/payments/repo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const payment = await getPayment(id);
  if (!payment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(
    {
      id: payment.id,
      status: payment.status,
      amountBdt: payment.amountBdt,
      currency: payment.currency,
      method: payment.method,
      merchantInvoice: payment.merchantInvoice,
      paidAt: payment.paidAt,
      failureReason: payment.failureReason,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
