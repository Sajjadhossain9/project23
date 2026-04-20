import Link from "next/link";
import { ArrowRight, Tag, CreditCard, FolderKanban, FileText } from "lucide-react";
import { getSession } from "@/lib/session";
import { listPlans } from "@/lib/admin/pricing-repo";
import { listPayments, getRevenueSummary } from "@/lib/payments/repo";
import { formatBdt } from "@/lib/utils";
import { PaymentStatusBadge } from "@/components/admin/PaymentStatusBadge";
import { PaymentMethodBadge } from "@/components/admin/PaymentMethodBadge";

export default async function AdminDashboard() {
  const [session, plans, summary, recent] = await Promise.all([
    getSession(),
    listPlans(),
    getRevenueSummary(30),
    listPayments({}, { limit: 5 }),
  ]);

  const activePlans = plans.filter((p) => p.active).length;

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-h1 text-fg">Welcome back, {session?.user.name ?? "Admin"}.</h1>
        <p className="mt-2 text-body text-fg-secondary">
          Quick overview of what&apos;s live on wevnix.com.
        </p>
      </div>

      {/* Revenue + plan stats */}
      <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        <StatCard
          label="Revenue (30 days)"
          value={formatBdt(summary.totalBdt)}
          sub={`${summary.successCount} payment${summary.successCount === 1 ? "" : "s"}`}
          href="/admin/payments"
        />
        <StatCard label="Pending" value={formatBdt(summary.pendingBdt)} sub="Awaiting confirmation" />
        <StatCard label="Active plans" value={String(activePlans)} sub={`of ${plans.length} total`} href="/admin/pricing" />
        <StatCard label="Refunded" value={formatBdt(summary.refundedBdt)} sub="Last 30 days" muted />
      </dl>

      {/* Recent payments */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-h3 text-fg">Recent payments</h2>
          <Link
            href="/admin/payments"
            className="inline-flex items-center gap-1.5 text-body-sm text-fg-secondary hover:text-fg"
          >
            See all <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>

        {recent.items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border-default bg-bg-surface p-8 text-center">
            <p className="text-body-sm text-fg-tertiary">No payments yet.</p>
          </div>
        ) : (
          <div className="rounded-lg border border-border-subtle bg-bg-surface overflow-hidden">
            <ul className="divide-y divide-border-subtle" role="list">
              {recent.items.map((payment) => (
                <li key={payment.id}>
                  <Link
                    href={`/admin/payments/${payment.id}`}
                    className="flex items-center gap-4 px-4 py-3 hover:bg-bg-raised/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-body-sm text-fg truncate">
                        {payment.merchantInvoice}
                      </p>
                      <p className="text-caption text-fg-tertiary">
                        {formatDate(payment.createdAt)}
                      </p>
                    </div>
                    <PaymentMethodBadge method={payment.method} />
                    <span className="text-body-sm text-fg tabular-nums whitespace-nowrap">
                      {formatBdt(payment.amountBdt)}
                    </span>
                    <PaymentStatusBadge status={payment.status} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <h2 className="text-h3 text-fg mb-4">Quick actions</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <QuickAction href="/admin/pricing" icon={Tag} title="Manage pricing" description="Update plans, prices, and features." />
        <QuickAction href="/admin/payments" icon={CreditCard} title="View payments" description="See all transactions, filter, and export." />
        <QuickAction href="/admin/projects" icon={FolderKanban} title="Manage projects" description="Coming soon — project catalog editor." disabled />
        <QuickAction href="/admin/blog" icon={FileText} title="Write a post" description="Coming soon — blog CMS." disabled />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  muted,
  href,
}: {
  label: string;
  value: string;
  sub: string;
  muted?: boolean;
  href?: string;
}) {
  const inner = (
    <>
      <dt className="text-caption text-fg-secondary">{label}</dt>
      <dd className={`mt-1 text-h3 font-semibold tabular-nums ${muted ? "text-fg-tertiary" : "text-fg"}`}>
        {value}
      </dd>
      <p className="mt-0.5 text-caption text-fg-tertiary">{sub}</p>
    </>
  );
  if (href) {
    return (
      <Link href={href} className="block bg-bg-raised rounded-md p-4 hover:bg-bg-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
        {inner}
      </Link>
    );
  }
  return <div className="bg-bg-raised rounded-md p-4">{inner}</div>;
}

function QuickAction({
  href,
  icon: Icon,
  title,
  description,
  disabled,
}: {
  href: string;
  icon: typeof Tag;
  title: string;
  description: string;
  disabled?: boolean;
}) {
  const inner = (
    <>
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-accent-soft text-accent mb-4">
        <Icon size={18} aria-hidden="true" />
      </div>
      <h3 className="text-h4 text-fg mb-1">{title}</h3>
      <p className="text-body-sm text-fg-secondary">{description}</p>
      {!disabled && (
        <div className="mt-4 inline-flex items-center gap-1.5 text-body-sm font-medium text-accent">
          Open <ArrowRight size={14} aria-hidden="true" />
        </div>
      )}
    </>
  );

  if (disabled) {
    return (
      <div
        aria-disabled="true"
        className="rounded-lg border border-dashed border-border-default bg-bg-surface p-5 opacity-60 cursor-not-allowed"
      >
        {inner}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="block rounded-lg border border-border-subtle bg-bg-surface p-5 shadow-elev-1 transition-all duration-200 hover:shadow-elev-2 hover:-translate-y-0.5 hover:border-border-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
    >
      {inner}
    </Link>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-BD", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
