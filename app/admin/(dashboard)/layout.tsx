import type { ReactNode } from "react";
import { requireSession } from "@/lib/session";
import { Sidebar } from "@/components/admin/Sidebar";
import { TopBar } from "@/components/admin/TopBar";

export const metadata = {
  title: { default: "Admin", template: "%s · Wevnix Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  // Every admin page goes through this — a single guard.
  const { user } = await requireSession();

  return (
    <div className="min-h-screen bg-bg">
      <div className="lg:grid lg:grid-cols-[240px_1fr] min-h-screen">
        {/* Sidebar — sticky on desktop, top on mobile */}
        <aside className="lg:sticky lg:top-0 lg:h-screen border-b lg:border-b-0 lg:border-r border-border-subtle bg-bg-surface">
          <Sidebar role={user.role} />
        </aside>

        {/* Main column */}
        <div className="flex flex-col min-w-0">
          <TopBar user={user} />
          <main className="flex-1 px-4 sm:px-6 py-6 sm:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
