/**
 * Payments + Orders repository.
 *
 * Same pattern as pricing-repo and chat/repo: in-memory today, one-line
 * Prisma swap when DATABASE_URL is live. Public surface stays identical.
 */

import type {
  Order,
  OrderStatus,
  Payment,
  PaymentEvent,
  PaymentStatus,
} from "./types";

// ---------- Store ----------

const g = globalThis as unknown as {
  __orders?: Map<string, Order>;
  __payments?: Map<string, Payment>;
  __paymentEvents?: Map<string, PaymentEvent[]>;
};
if (!g.__orders) g.__orders = new Map();
if (!g.__payments) g.__payments = new Map();
if (!g.__paymentEvents) g.__paymentEvents = new Map();

const orders = g.__orders;
const payments = g.__payments;
const events = g.__paymentEvents;

// ---------- Orders ----------

export interface CreateOrderInput {
  planId?: string;
  planSnapshot: Record<string, unknown>;
  amountBdt: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string;
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const now = new Date().toISOString();
  const order: Order = {
    id: `ord-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    planId: input.planId,
    planSnapshot: input.planSnapshot,
    amountBdt: input.amountBdt,
    currency: "BDT",
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    customerPhone: input.customerPhone,
    status: "draft",
    notes: input.notes,
    createdAt: now,
    updatedAt: now,
  };
  orders.set(order.id, order);
  return order;
}

export async function getOrder(id: string): Promise<Order | null> {
  return orders.get(id) ?? null;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
  const order = orders.get(id);
  if (!order) return null;
  const updated: Order = { ...order, status, updatedAt: new Date().toISOString() };
  orders.set(id, updated);
  return updated;
}

// ---------- Payments ----------

export interface CreatePaymentInput {
  orderId?: string;
  amountBdt: number;
  method: Payment["method"];
  gateway: string;
  merchantInvoice: string;
  expiresAt?: string;
}

export async function createPayment(input: CreatePaymentInput): Promise<Payment> {
  const now = new Date().toISOString();
  const payment: Payment = {
    id: `pay-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    orderId: input.orderId,
    amountBdt: input.amountBdt,
    currency: "BDT",
    method: input.method,
    gateway: input.gateway,
    merchantInvoice: input.merchantInvoice,
    status: "pending",
    expiresAt: input.expiresAt,
    createdAt: now,
    updatedAt: now,
  };
  payments.set(payment.id, payment);
  events.set(payment.id, []);

  // Initial event so the history starts with "created"
  await appendPaymentEvent({
    paymentId: payment.id,
    toStatus: "pending",
    source: "init",
  });

  return payment;
}

export async function getPayment(id: string): Promise<Payment | null> {
  return payments.get(id) ?? null;
}

export async function getPaymentByMerchantInvoice(invoice: string): Promise<Payment | null> {
  for (const p of payments.values()) {
    if (p.merchantInvoice === invoice) return p;
  }
  return null;
}

/** Idempotent: returns existing payment if merchantInvoice already stored. */
export async function updatePayment(
  id: string,
  patch: Partial<
    Pick<
      Payment,
      "status" | "gatewayRef" | "gatewayUrl" | "failureReason" | "paidAt"
    >
  >
): Promise<Payment | null> {
  const existing = payments.get(id);
  if (!existing) return null;

  const updated: Payment = {
    ...existing,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  payments.set(id, updated);
  return updated;
}

/**
 * Transition a payment to a new status and append an event row atomically.
 * Safe to call twice with the same `toStatus` — we detect and no-op.
 */
export async function transitionPayment(input: {
  paymentId: string;
  toStatus: PaymentStatus;
  source: PaymentEvent["source"];
  payload?: Record<string, unknown>;
  gatewayRef?: string;
  failureReason?: string;
}): Promise<Payment | null> {
  const payment = payments.get(input.paymentId);
  if (!payment) return null;

  // Idempotency — if we're already at this status, just record a dup-event
  // (useful for replayed webhooks) but don't re-update the payment.
  const fromStatus = payment.status;
  if (fromStatus === input.toStatus) {
    await appendPaymentEvent({
      paymentId: input.paymentId,
      fromStatus,
      toStatus: input.toStatus,
      source: input.source,
      payload: { ...input.payload, note: "duplicate-transition-ignored" },
    });
    return payment;
  }

  // Apply the transition
  const patch: Partial<Payment> = {
    status: input.toStatus,
    ...(input.gatewayRef && { gatewayRef: input.gatewayRef }),
    ...(input.failureReason && { failureReason: input.failureReason }),
    ...(input.toStatus === "succeeded" && { paidAt: new Date().toISOString() }),
    updatedAt: new Date().toISOString(),
  };
  const updated: Payment = { ...payment, ...patch };
  payments.set(input.paymentId, updated);

  await appendPaymentEvent({
    paymentId: input.paymentId,
    fromStatus,
    toStatus: input.toStatus,
    source: input.source,
    payload: input.payload,
  });

  return updated;
}

// ---------- Payment events (audit trail) ----------

export async function appendPaymentEvent(input: {
  paymentId: string;
  fromStatus?: PaymentStatus;
  toStatus: PaymentStatus;
  source: PaymentEvent["source"];
  payload?: Record<string, unknown>;
}): Promise<PaymentEvent> {
  const event: PaymentEvent = {
    id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    paymentId: input.paymentId,
    fromStatus: input.fromStatus,
    toStatus: input.toStatus,
    source: input.source,
    payload: input.payload,
    createdAt: new Date().toISOString(),
  };
  const list = events.get(input.paymentId) ?? [];
  list.push(event);
  events.set(input.paymentId, list);
  return event;
}

export async function getPaymentEvents(paymentId: string): Promise<PaymentEvent[]> {
  return events.get(paymentId) ?? [];
}

// ---------- Admin-only queries + actions ----------

export interface ListPaymentsFilter {
  status?: PaymentStatus;
  method?: Payment["method"];
  /** ISO string — inclusive lower bound on createdAt. */
  from?: string;
  /** ISO string — inclusive upper bound on createdAt. */
  to?: string;
  /** Case-insensitive search over merchantInvoice + orderId. */
  q?: string;
}

export interface ListPaymentsResult {
  items: Payment[];
  total: number;
}

/**
 * List payments newest-first with optional filters. Used by the admin inbox.
 * Small N, so sorting in JS is fine; Prisma equivalent commented below.
 */
export async function listPayments(
  filter: ListPaymentsFilter = {},
  pagination: { limit?: number; offset?: number } = {}
): Promise<ListPaymentsResult> {
  // Prisma:
  //   const where = {
  //     ...(filter.status && { status: filter.status }),
  //     ...(filter.method && { method: filter.method }),
  //     ...(filter.from && { createdAt: { gte: new Date(filter.from) } }),
  //     ...(filter.to   && { createdAt: { lte: new Date(filter.to) } }),
  //     ...(filter.q    && { OR: [
  //       { merchantInvoice: { contains: filter.q, mode: "insensitive" } },
  //       { orderId:         { contains: filter.q, mode: "insensitive" } },
  //     ]}),
  //   };
  //   const [items, total] = await Promise.all([
  //     prisma.payment.findMany({ where, orderBy: { createdAt: "desc" }, take, skip }),
  //     prisma.payment.count({ where }),
  //   ]);
  //   return { items, total };

  const q = filter.q?.toLowerCase().trim();
  let items = Array.from(payments.values()).filter((p) => {
    if (filter.status && p.status !== filter.status) return false;
    if (filter.method && p.method !== filter.method) return false;
    if (filter.from && p.createdAt < filter.from) return false;
    if (filter.to && p.createdAt > filter.to) return false;
    if (q) {
      const hay = `${p.merchantInvoice} ${p.orderId ?? ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const total = items.length;

  const { limit = 25, offset = 0 } = pagination;
  items = items.slice(offset, offset + limit);

  return { items, total };
}

/**
 * Revenue summary for the admin dashboard. Counts only succeeded and not-yet-
 * refunded payments — pending/failed don't count as revenue.
 */
export async function getRevenueSummary(windowDays = 30): Promise<{
  totalBdt: number;
  successCount: number;
  refundedBdt: number;
  pendingBdt: number;
}> {
  const cutoff = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000).toISOString();
  let totalBdt = 0;
  let refundedBdt = 0;
  let pendingBdt = 0;
  let successCount = 0;

  for (const p of payments.values()) {
    if (p.createdAt < cutoff) continue;
    if (p.status === "succeeded") {
      totalBdt += p.amountBdt;
      successCount++;
    } else if (p.status === "refunded") {
      refundedBdt += p.amountBdt;
    } else if (p.status === "pending" || p.status === "processing") {
      pendingBdt += p.amountBdt;
    }
  }

  return { totalBdt, successCount, refundedBdt, pendingBdt };
}
