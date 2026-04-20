/**
 * SSLCOMMERZ payment provider.
 *
 * Handles all three mobile wallets (bKash, Nagad, Rocket) plus cards through
 * one hosted checkout page. The user picks their method at checkout, we
 * preselect it on SSLCOMMERZ's form via the `gw` parameter, and they complete
 * payment in the wallet's native OTP/PIN flow.
 *
 * Two endpoints per transaction:
 *   1. session init — we POST to SSLCOMMERZ, get a redirect URL back
 *   2. validation   — on IPN, we POST the val_id back to SSLCOMMERZ to
 *                     cryptographically confirm the transaction amount and
 *                     status. NEVER trust the IPN body alone.
 *
 * Reference: https://developer.sslcommerz.com/
 */

import { PAYMENT_CONFIG } from "../config";
import type {
  PaymentProvider,
  PaymentInitInput,
  PaymentInitResult,
  PaymentVerifyInput,
  PaymentVerifyResult,
  PaymentStatus,
} from "../types";

const SANDBOX_BASE = "https://sandbox.sslcommerz.com";
const LIVE_BASE = "https://securepay.sslcommerz.com";

function getApiBase(): string {
  // In sandbox mode the URL differs. We key on NODE_ENV + an explicit flag
  // so you can test against sandbox in production deploys if needed.
  if (process.env.SSLCOMMERZ_SANDBOX === "true") return SANDBOX_BASE;
  return process.env.NODE_ENV === "production" ? LIVE_BASE : SANDBOX_BASE;
}

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

// ---------- Provider implementation ----------

export const sslcommerzProvider: PaymentProvider = {
  name: "sslcommerz",
  supports: ["bkash", "nagad", "rocket", "card", "bank_transfer"],

  async init(input: PaymentInitInput): Promise<PaymentInitResult> {
    const storeId = requireEnv("SSLCOMMERZ_STORE_ID");
    const storePassword = requireEnv("SSLCOMMERZ_STORE_PASSWORD");

    const body = new URLSearchParams({
      store_id: storeId,
      store_passwd: storePassword,
      total_amount: String(input.amountBdt),
      currency: PAYMENT_CONFIG.currency,
      tran_id: input.paymentId,

      // Callbacks — SSLCOMMERZ will POST to these after the user completes
      success_url: `${input.returnUrl}?status=success&paymentId=${input.paymentId}`,
      fail_url: `${input.returnUrl}?status=fail&paymentId=${input.paymentId}`,
      cancel_url: `${input.returnUrl}?status=cancel&paymentId=${input.paymentId}`,
      ipn_url: input.ipnUrl,

      // Preselect the payment method based on what the user picked
      gw: PAYMENT_CONFIG.sslcommerzMethodCodes[input.method],

      // Customer — required by SSLCOMMERZ for risk scoring
      cus_name: input.customerName,
      cus_email: input.customerEmail,
      cus_phone: input.customerPhone,
      cus_add1: "Dhaka",
      cus_city: "Dhaka",
      cus_country: "Bangladesh",

      // Product info — SSLCOMMERZ requires these fields
      product_name: "Wevnix service package",
      product_category: "Service",
      product_profile: "general",

      // Shipping: services are digital, so no shipping. This flag is required.
      shipping_method: "NO",
      num_of_item: "1",
    });

    const res = await fetch(`${getApiBase()}/gwprocess/v4/api.php`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    const data = (await res.json()) as {
      status: string;
      sessionkey?: string;
      GatewayPageURL?: string;
      failedreason?: string;
    };

    if (data.status !== "SUCCESS" || !data.GatewayPageURL) {
      throw new Error(`SSLCOMMERZ init failed: ${data.failedreason ?? "unknown"}`);
    }

    return {
      redirectUrl: data.GatewayPageURL,
      gatewayRef: data.sessionkey,
      rawResponse: data,
    };
  },

  async verify(input: PaymentVerifyInput): Promise<PaymentVerifyResult> {
    const valId = input.gatewayPayload.val_id as string | undefined;
    if (!valId) {
      return {
        verified: false,
        status: "failed",
        failureReason: "Missing val_id in gateway payload",
      };
    }

    const storeId = requireEnv("SSLCOMMERZ_STORE_ID");
    const storePassword = requireEnv("SSLCOMMERZ_STORE_PASSWORD");

    // Server-to-server validation — THE critical step. The IPN body alone can
    // be spoofed; this call confirms directly with SSLCOMMERZ.
    const url = new URL(`${getApiBase()}/validator/api/validationserverAPI.php`);
    url.searchParams.set("val_id", valId);
    url.searchParams.set("store_id", storeId);
    url.searchParams.set("store_passwd", storePassword);
    url.searchParams.set("format", "json");

    const res = await fetch(url, { method: "GET" });
    const data = (await res.json()) as {
      status?: string;              // "VALID" | "VALIDATED" | "INVALID_TRANSACTION"
      tran_id?: string;
      amount?: string;
      currency?: string;
      bank_tran_id?: string;
      card_issuer?: string;
    };

    const trustedStatus = data.status?.toUpperCase();
    const sameTxn = data.tran_id === input.payment.merchantInvoice;
    const sameAmount = Number(data.amount) === input.payment.amountBdt;
    const sameCurrency = data.currency === input.payment.currency;

    if (
      (trustedStatus === "VALID" || trustedStatus === "VALIDATED") &&
      sameTxn &&
      sameAmount &&
      sameCurrency
    ) {
      return {
        verified: true,
        status: "succeeded",
        gatewayRef: data.bank_tran_id,
      };
    }

    // Amount or txn id mismatch = fraud attempt. Log hard.
    if (!sameTxn || !sameAmount) {
      return {
        verified: false,
        status: "failed",
        failureReason: "Amount or transaction mismatch during validation",
      };
    }

    const failureReason = mapFailureReason(trustedStatus, data);
    return {
      verified: false,
      status: mapInvalidStatus(trustedStatus),
      failureReason,
    };
  },
};

// ---------- Helpers ----------

function mapInvalidStatus(upstream: string | undefined): PaymentStatus {
  if (upstream === "INVALID_TRANSACTION") return "failed";
  if (upstream === "UNAUTHORIZED") return "failed";
  if (upstream === "CANCELLED") return "failed";
  return "failed";
}

function mapFailureReason(status: string | undefined, data: Record<string, unknown>): string {
  if (!status) return "Validation returned no status";
  if (status === "INVALID_TRANSACTION") return "Gateway reports invalid transaction";
  if (status === "UNAUTHORIZED") return "Gateway auth failed — check store credentials";
  return `Upstream status: ${status}`;
}
