"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Tag,
  CreditCard,
  FolderKanban,
  FileText,
  Users,
  History,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Admin navigation. Adding a new section is a one-line change here —
 * the layout auto-renders it with the right icon and active state.
 *
 * `requiredRole` limits visibility; undefined = both admin and editor.
 */
const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Pricing", href: "/admin/pricing", icon: Tag },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
  // Placeholders for future modules — already rendered as disabled items so
  // the IA is stable as the panel grows.
  { label: "Projects", href: "/admin/projects", icon: FolderKanban, disabled: true },
  { label: "Blog", href: "/admin/blog", icon: FileText, disabled: true },
  { label: "Audit log", href: "/admin/audit", icon: History, disabled: true },
  { label: "Users", href: "/admin/users", icon: Users, requiredRole: "admin", disabled: true },
  { label: "Settings", href: "/admin/settings", icon: Settings, disabled: true },
] as const;

interface SidebarProps {
  role: "admin" | "editor";
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Admin navigation"
      className="h-full flex flex-col gap-1 p-3"
    >
      <Link
        href="/admin"
        className="flex items-center gap-2 px-3 h-14 mb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md"
      >
        <LogoMark />
        <div className="flex flex-col leading-tight">
          <span className="text-body-sm font-semibold text-fg">Wevnix</span>
          <span className="text-caption text-fg-tertiary">Admin</span>
        </div>
      </Link>

      <ul className="flex-1 space-y-0.5" role="list">
        {navItems.map((item) => {
          if (item.requiredRole && item.requiredRole !== role) return null;

          const Icon = item.icon;
          const active = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

          if (item.disabled) {
            return (
              <li key={item.href}>
                <span
                  aria-disabled="true"
                  className="flex items-center gap-3 px-3 h-10 rounded-md text-body-sm text-fg-tertiary cursor-not-allowed select-none"
                >
                  <Icon size={16} aria-hidden="true" />
                  <span className="flex-1">{item.label}</span>
                  <span className="text-caption">soon</span>
                </span>
              </li>
            );
          }

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 px-3 h-10 rounded-md text-body-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                  active
                    ? "bg-bg-raised text-fg font-medium"
                    : "text-fg-secondary hover:text-fg hover:bg-bg-raised"
                )}
              >
                <Icon size={16} aria-hidden="true" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function LogoMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <rect width="28" height="28" rx="7" className="fill-brand" />
      <path
        d="M8 10l3 8 3-6 3 6 3-8"
        stroke="rgb(var(--accent))"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
