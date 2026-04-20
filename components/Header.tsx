"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import { Container } from "./ui/Container";
import { LinkButton } from "./ui/Button";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Services", href: "/services" },
  { label: "Solutions", href: "/solutions" },
  { label: "Pricing", href: "/pricing" },
  { label: "Domains", href: "/domains" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when drawer is open and close on Escape
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawerOpen(false);
      window.addEventListener("keydown", onKey);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", onKey);
      };
    }
  }, [drawerOpen]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full backdrop-blur-md bg-bg-surface/80 transition-[border-color] duration-200",
          scrolled ? "border-b border-border-subtle" : "border-b border-transparent"
        )}
      >
        <Container>
          <div className="flex h-16 lg:h-18 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 focus-visible:outline-none">
              <LogoMark />
              <span className="text-h4 font-semibold tracking-tight text-fg">Wevnix</span>
            </Link>

            {/* Desktop nav */}
            <nav aria-label="Primary" className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-2 text-body-sm font-medium text-fg-secondary hover:text-fg transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Desktop right-side actions */}
            <div className="hidden lg:flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
              <div className="h-6 w-px bg-border-default mx-2" aria-hidden="true" />
              <LinkButton
                href="/contact"
                variant="primary"
                size="sm"
                iconRight={<ArrowRight size={14} />}
              >
                Get a quote
              </LinkButton>
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              aria-expanded={drawerOpen}
              aria-controls="mobile-drawer"
              className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md text-fg hover:bg-bg-raised transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <Menu size={20} aria-hidden="true" />
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile drawer */}
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}

function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div
      id="mobile-drawer"
      className={cn(
        "fixed inset-0 z-50 lg:hidden",
        open ? "pointer-events-auto" : "pointer-events-none"
      )}
      aria-hidden={!open}
    >
      {/* Overlay */}
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={cn(
          "absolute right-0 top-0 h-full w-[88%] max-w-sm bg-bg-surface shadow-elev-4 transition-transform duration-300 ease-out-expo flex flex-col",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-16 px-5 border-b border-border-subtle">
          <span className="text-h4 font-semibold">Menu</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-bg-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 py-6">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="block px-3 py-3 text-body font-medium text-fg hover:bg-bg-raised rounded-md transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-border-subtle p-5 space-y-4">
          <div className="flex items-center justify-between">
            <LanguageToggle />
            <ThemeToggle />
          </div>
          <LinkButton href="/contact" variant="primary" size="md" fullWidth iconRight={<ArrowRight size={16} />}>
            Get a quote
          </LinkButton>
        </div>
      </div>
    </div>
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
