"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/session";
import { getPayment, transitionPayment, updateOrderStatus } from "@/lib/payments/repo";
import { writeAudit } from "@/lib/admin/audit";

/**
 * Mark a payment refunded in our DB.
 *
 * Note: this records the intent + updates state. Actually wiring the refund
 * API call to SSLCOMMERZ is a separate step — SSLCOMMERZ has a refund
 * endpoint that requires the bank_tran_id + store credentials. Commented
 * below, ready to uncomment when you have credentials in test.
 */
export async function refundPaymentAction(paymentId: string): Promise<void> {
  const session = await requireSession();
  const payment = await getPayment(paymentId);
  if (!payment) return;

  // Only succeeded payments can be refunded
  if (payment.status !== "succeeded") {
    throw new Error(`Cannot refund payment in status: ${payment.status}`);
  }

  // --- Call the gateway refund API (uncomment when ready) ---
  // const storeId = process.env.SSLCOMMERZ_STORE_ID!;
  // const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD!;
  // const base = process.env.SSLCOMMERZ_SANDBOX === "true"
  //   ? "https://sandbox.sslcommerz.com"
  //   : "https://securepay.sslcommerz.com";
  // const url = new URL(`${base}/validator/api/merchantTransIDvalidationAPI.php`);
  // url.searchParams.set("bank_tran_id", payment.gatewayRef!);
  // url.searchParams.set("refund_amount", String(payment.amountBdt));
  // url.searchParams.set("refund_remarks", "Admin-initiated refund");
  // url.searchParams.set("refe_id", payment.merchantInvoice);
  // url.searchParams.set("store_id", storeId);
  // url.searchParams.set("store_passwd", storePassword);
  // const res = await fetch(url);
  // if (!res.ok) throw new Error("Gateway refund failed");

  const updated = await transitionPayment({
    paymentId: payment.id,
    toStatus: "refunded",
    source: "admin",
    payload: { initiatedBy: session.user.id },
  });

  if (payment.orderId) {
    await updateOrderStatus(payment.orderId, "cancelled");
  }

  await writeAudit({
    userId: session.user.id,
    entity: "Payment",
    entityId: payment.id,
    action: "update",
    before: payment,
    after: updated,
  });

  revalidatePath("/admin/payments");
  revalidatePath(`/admin/payments/${payment.id}`);
}
