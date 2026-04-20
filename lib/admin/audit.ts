/**
 * Audit log writer.
 *
 * Best-effort: if the DB isn't wired yet, we log to console instead of
 * throwing — the pricing edit still succeeds, it's just not recorded.
 * When Prisma is live, every admin write gets a row in AuditLog.
 */

import "server-only";

export interface AuditEntry {
  userId: string;
  entity: string;   // "PricingPlan"
  entityId: string;
  action: "create" | "update" | "delete";
  before?: unknown;
  after?: unknown;
}

export async function writeAudit(entry: AuditEntry): Promise<void> {
  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.auditLog.create({
      data: {
        userId: entry.userId,
        entity: entry.entity,
        entityId: entry.entityId,
        action: entry.action,
        before: (entry.before as object) ?? undefined,
        after: (entry.after as object) ?? undefined,
      },
    });
  } catch {
    // DB not reachable — log to console so at least there's a trail in dev.
    if (process.env.NODE_ENV !== "production") {
      console.log("[audit]", JSON.stringify(entry));
    }
  }
}
