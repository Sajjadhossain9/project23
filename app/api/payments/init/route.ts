/**
 * POST /api/payments/init
 *
 * Creates an Order + a Payment row, calls the provider to get a gateway
 * URL, and returns that URL to the client. The client then redirects the
 * browser there.
 *
 * Request body:
 *   {
 *     planId: string,               // PricingPlan.id
 *     method: "bkash"|"nagad"|"rocket"|"card"|"bank_transfer",
 *     customerName: string,
 *     customerEmail: string,
 *     customerPhone: string,        // +880-style
 *     notes?: string
 *   }
 *
 * Response:
 *   { paymentId, redirectUrl }
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getPricingPlans } from "@/lib/pricing";
import {
  createOrder,
  createPayment,
  updatePayment,
  updateOrderStatus,
} from "@/lib/payments/repo";
import { getProviderForMethod } from "@/lib/payments/providers";
import { PAYMENT_CONFIG, getPublicBaseUrl } from "@/lib/payments/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  planId: z.string().min(1),
  method: z.enum(["bkash", "nagad", "rocket", "card", "bank_transfer"]),
  customerName: z.string().min(2).max(120),
  customerEmail: z.string().email(),
  // BD phone numbers: +8801XXXXXXXXX or 01XXXXXXXXX
  customerPhone: z
    .string()
    .regex(/^(?:\+?880|0)1[0-9]{9}$/, "Enter a valid Bangladeshi phone number"),
  notes: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  // 1. Validate
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 }
    );
  }
  const { planId, method, customerName, customerEmail, customerPhone, notes } =
    parsed.data;

  // 2. Resolve plan from the source of truth (so the admin can't be undercut
  //    by a stale client-side price).
  const plans = await getPricingPlans();
  const plan = plans.find((p) => p.id === planId);
  if (!plan) {
    return NextResponse.json({ error: "Plan not found." }, { status: 404 });
  }
  if (plan.customQuote) {
    return NextResponse.json(
      { error: "This plan requires a custom quote. Please contact us." },
      { status: 400 }
    );
  }
  if (plan.priceBdt <= 0) {
    return NextResponse.json({ error: "Invalid plan price." }, { status: 400 });
  }

  // 3. Create the order (snapshot the plan so later admin edits don't rewrite history)
  const order = await createOrder({
    planId,
    planSnapshot: { ...plan },
    amountBdt: plan.priceBdt,
    customerName,
    customerEmail,
    customerPhone,
    notes,
  });

  // 4. Create the payment with an explicit merchant invoice — this is what we
  //    cross-check in the webhook, so it must be unique and under our control.
  const merchantInvoice = `WVX-${order.id.slice(-10)}-${Date.now()}`;
  const payment = await createPayment({
    orderId: order.id,
    amountBdt: plan.priceBdt,
    method,
    gateway: PAYMENT_CONFIG.primaryProvider,
    merchantInvoice,
    expiresAt: new Date(
      Date.now() + PAYMENT_CONFIG.sessionTtlMinutes * 60 * 1000
    ).toISOString(),
  });

  // 5. Ask the provider for a redirect URL
  const provider = getProviderForMethod(method);
  const baseUrl = getPublicBaseUrl();

  try {
    const initResult = await provider.init({
      paymentId: payment.merchantInvoice, // The gateway should echo this back
      orderId: order.id,
      amountBdt: plan.priceBdt,
      method,
      customerName,
      customerEmail,
      customerPhone,
      returnUrl: `${baseUrl}/payments/return`,
      ipnUrl: `${baseUrl}/api/payments/webhook`,
    });

    // 6. Record the URL + any synchronous gateway reference
    await updatePayment(payment.id, {
      gatewayUrl: initResult.redirectUrl,
      gatewayRef: initResult.gatewayRef,
    });

    await updateOrderStatus(order.id, "awaiting_payment");

    return NextResponse.json(
      {
        paymentId: payment.id,
        merchantInvoice: payment.merchantInvoice,
        redirectUrl: initResult.redirectUrl,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    // Gateway init failed — mark payment failed but leave the order so admin can retry
    const reason = err instanceof Error ? err.message : "Gateway init failed";
    await updatePayment(payment.id, { status: "failed", failureReason: reason });
    console.error("[payments/init]", reason, err);
    return NextResponse.json(
      { error: "Could not start payment. Please try a different method or contact support." },
      { status: 502 }
    );
  }
}
