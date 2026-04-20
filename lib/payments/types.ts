/**
 * Payment type definitions.
 *
 * These mirror the Prisma schema but are defined independently so the app
 * can build and run without Prisma installed (during the in-memory phase).
 */

export type PaymentMethod = "bkash" | "nagad" | "rocket" | "card" | "bank_transfer";

export type PaymentStatus =
  | "pending"       // Created, user hasn't paid yet
  | "processing"    // Gateway accepted; awaiting OTP/PIN
  | "succeeded"     // Captured — admin should fulfill
  | "failed"
  | "refunded"
  | "expired";

export type OrderStatus =
  | "draft"
  | "awaiting_payment"
  | "paid"
  | "cancelled"
  | "fulfilled";

export interface Order {
  id: string;
  planId?: string;
  planSnapshot: Record<string, unknown>;
  amountBdt: number;
  currency: "BDT";
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  orderId?: string;
  amountBdt: number;
  currency: "BDT";
  method: PaymentMethod;
  gateway: string;
  gatewayRef?: string;
  merchantInvoice: string;
  gatewayUrl?: string;
  status: PaymentStatus;
  failureReason?: string;
  paidAt?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentEvent {
  id: string;
  paymentId: string;
  fromStatus?: PaymentStatus;
  toStatus: PaymentStatus;
  source: "webhook" | "ipn" | "admin" | "return-url" | "init";
  payload?: Record<string, unknown>;
  createdAt: string;
}

// ---------- Provider contract ----------

/**
 * Every payment provider implements this interface. Adding a new gateway
 * (Moneybag, aamarPay, ShurjoPay) means writing one file — the rest of the
 * system is provider-agnostic.
 */
export interface PaymentInitInput {
  paymentId: string;          // Our Payment.id, used as merchant ref
  orderId?: string;
  amountBdt: number;
  method: PaymentMethod;      // Which rail the user picked at checkout
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  returnUrl: string;          // Where to send the user after success/fail
  ipnUrl: string;             // Server-to-server callback
}

export interface PaymentInitResult {
  /** URL the client should redirect the user to for the gateway-hosted form. */
  redirectUrl: string;
  /** Gateway's own reference for this attempt, if issued synchronously. */
  gatewayRef?: string;
  /** Raw response, stored for debugging. */
  rawResponse: unknown;
}

export interface PaymentVerifyInput {
  payment: Payment;
  gatewayPayload: Record<string, unknown>;  // Signed IPN/return-url params
}

export interface PaymentVerifyResult {
  verified: boolean;
  status: PaymentStatus;
  gatewayRef?: string;
  failureReason?: string;
}

export interface PaymentProvider {
  readonly name: string;
  readonly supports: PaymentMethod[];

  /** Start a payment session; returns the URL to redirect the user to. */
  init(input: PaymentInitInput): Promise<PaymentInitResult>;

  /**
   * Verify a gateway callback (IPN or return URL). Must cryptographically
   * validate the payload — never trust redirect params alone.
   */
  verify(input: PaymentVerifyInput): Promise<PaymentVerifyResult>;
}
