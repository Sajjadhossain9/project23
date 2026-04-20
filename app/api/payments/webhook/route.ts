/**
 * POST /api/payments/webhook
 *
 * Receives SSLCOMMERZ's IPN (Instant Payment Notification). For every
 * incoming notification:
 *   1. Find the Payment by merchantInvoice (tran_id).
 *   2. Call the provider's verify() — a server-to-server check against the
 *      gateway. THIS is the authoritative signal, NOT the webhook body.
 *   3. Transition the payment row idempotently (safe on replay).
 *   4. If succeeded: mark the Order paid and trigger fulfillment.
 *
 * SSLCOMMERZ may hit this endpoint multiple times for the same transaction
 * (retries on network errors). The transitionPayment() helper is idempotent,
 * so duplicates are safe.
 *
 * SECURITY: Never update a payment to succeeded based on the IPN body alone.
 * An attacker who knows your IPN URL can forge a body. The verify() call to
 * SSLCOMMERZ's validation API is what makes this trustworthy.
 */

import { NextRequest, NextResponse } from "next/server";
import {
  getPaymentByMerchantInvoice,
  transitionPayment,
  updateOrderStatus,
  getOrder,
} from "@/lib/payments/repo";
import { getProviderByName } from "@/lib/payments/providers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // SSLCOMMERZ sends form-encoded. Some providers send JSON. Handle both.
  const contentType = req.headers.get("content-type") ?? "";
  let payload: Record<string, unknown> = {};

  try {
    if (contentType.includes("application/json")) {
      payload = (await req.json()) as Record<string, unknown>;
    } else {
      const form = await req.formData();
      for (const [k, v] of form.entries()) {
        payload[k] = typeof v === "string" ? v : String(v);
      }
    }
  } catch {
    return NextResponse.json({ error: "Could not parse body." }, { status: 400 });
  }

  // tran_id is the merchantInvoice we sent during init
  const merchantInvoice = payload.tran_id as string | undefined;
  if (!merchantInvoice) {
    return NextResponse.json({ error: "Missing tran_id." }, { status: 400 });
  }

  // Find the payment — reject unknown invoices
  const payment = await getPaymentByMerchantInvoice(merchantInvoice);
  if (!payment) {
    // Log but return 200 so the gateway doesn't retry an unknown transaction forever
    console.warn("[payments/webhook] Unknown merchantInvoice:", merchantInvoice);
    return NextResponse.json({ received: true }, { status: 200 });
  }

  // Terminal states — ignore any further updates. Critical for idempotency.
  if (
    payment.status === "succeeded" ||
    payment.status === "refunded" ||
    payment.status === "expired"
  ) {
    return NextResponse.json({ received: true, status: payment.status }, { status: 200 });
  }

  // Resolve the provider and verify server-to-server
  const provider = getProviderByName(payment.gateway);
  if (!provider) {
    console.error("[payments/webhook] Unknown provider:", payment.gateway);
    return NextResponse.json({ error: "Provider not configured." }, { status: 500 });
  }

  let verification: Awaited<ReturnType<typeof provider.verify>>;
  try {
    verification = await provider.verify({ payment, gatewayPayload: payload });
  } catch (err) {
    console.error("[payments/webhook] verify() threw:", err);
    // Return 500 so the gateway retries — transient verification failures
    // shouldn't cause us to permanently fail a real payment.
    return NextResponse.json({ error: "Verification failed." }, { status: 500 });
  }

  // Apply the verified status transition
  const updated = await transitionPayment({
    paymentId: payment.id,
    toStatus: verification.status,
    source: "ipn",
    payload: { verification, rawPayload: payload },
    gatewayRef: verification.gatewayRef,
    failureReason: verification.failureReason,
  });

  if (!updated) {
    return NextResponse.json({ error: "Payment not found on update." }, { status: 404 });
  }

  // Side effects on success
  if (verification.verified && verification.status === "succeeded" && payment.orderId) {
    await updateOrderStatus(payment.orderId, "paid");
    void runPostPaymentHooks({ paymentId: payment.id, orderId: payment.orderId });
  }

  return NextResponse.json({ received: true, status: updated.status }, { status: 200 });
}

// ---------- Post-payment hooks ----------

/**
 * Fire-and-forget actions after a successful payment. Errors are swallowed —
 * the webhook response must succeed regardless, because the gateway will
 * retry forever if we return 5xx.
 */
async function runPostPaymentHooks(input: { paymentId: string; orderId: string }): Promise<void> {
  try {
    const order = await getOrder(input.orderId);
    if (!order) return;

    // Example: send a Resend email to the customer + ops (uncomment when ready)
    // const { Resend } = await import("resend");
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await Promise.all([
    //   resend.emails.send({
    //     from: "orders@wevnix.com",
    //     to: order.customerEmail,
    //     subject: `Payment received — ${order.id}`,
    //     text: `Thanks for your payment. We'll be in touch within one business day to start your project.`,
    //   }),
    //   resend.emails.send({
    //     from: "orders@wevnix.com",
    //     to: "ops@wevnix.com",
    //     subject: `[PAID] ${order.customerName} — ${order.amountBdt} BDT`,
    //     text: JSON.stringify(order, null, 2),
    //   }),
    // ]);

    // Example: Slack ping
    // if (process.env.SLACK_PAYMENT_WEBHOOK) {
    //   await fetch(process.env.SLACK_PAYMENT_WEBHOOK, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       text: `💰 Payment received\nOrder: ${order.id}\nCustomer: ${order.customerName}\nAmount: ৳${order.amountBdt.toLocaleString()}`,
    //     }),
    //   });
    // }

    console.log("[payments/webhook] payment succeeded:", input.paymentId);
  } catch (err) {
    console.error("[payments/webhook] post-payment hook failed:", err);
  }
}
