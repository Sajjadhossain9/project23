import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { logoutAction } from "@/app/admin/login/actions";

interface TopBarProps {
  user: { email: string; name?: string | null; role: "admin" | "editor" };
}

export function TopBar({ user }: TopBarProps) {
  const initials = (user.name ?? user.email).slice(0, 2).toUpperCase();

  return (
    <header
      className="h-14 sticky top-0 z-20 border-b border-border-subtle bg-bg-surface/80 backdrop-blur-md flex items-center justify-end gap-3 px-4 sm:px-6"
      aria-label="Admin top bar"
    >
      <Link
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 h-8 rounded-md text-body-sm text-fg-secondary hover:text-fg hover:bg-bg-raised transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        View site
        <ExternalLink size={14} aria-hidden="true" />
      </Link>

      <div className="h-6 w-px bg-border-default" aria-hidden="true" />

      <div className="flex items-center gap-2.5">
        <div
          className="h-8 w-8 rounded-full bg-accent-soft text-accent-ink flex items-center justify-center text-caption font-semibold"
          aria-hidden="true"
        >
          {initials}
        </div>
        <div className="hidden sm:flex flex-col leading-tight">
          <span className="text-caption font-medium text-fg">{user.name ?? user.email}</span>
          <span className="text-caption text-fg-tertiary capitalize">{user.role}</span>
        </div>
      </div>

      <form action={logoutAction}>
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 px-3 h-8 rounded-md text-body-sm text-fg-secondary hover:text-fg hover:bg-bg-raised transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <LogOut size={14} aria-hidden="true" />
          Sign out
        </button>
      </form>
    </header>
  );
}
