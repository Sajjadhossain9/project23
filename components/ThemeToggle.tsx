"use client";

import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark" | "system";

const order: Theme[] = ["light", "dark", "system"];
const iconMap: Record<Theme, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};
const labelMap: Record<Theme, string> = {
  light: "Switch to dark mode",
  dark: "Switch to system mode",
  system: "Switch to light mode",
};

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const isDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  root.classList.toggle("dark", isDark);
}

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = (localStorage.getItem("theme") as Theme | null) ?? "system";
    setTheme(saved);
    applyTheme(saved);

    // Watch system changes when in system mode
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const current = (localStorage.getItem("theme") as Theme | null) ?? "system";
      if (current === "system") applyTheme("system");
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  function cycle() {
    const next = order[(order.indexOf(theme) + 1) % order.length];
    setTheme(next);
    localStorage.setItem("theme", next);
    applyTheme(next);
  }

  // Render a stable placeholder until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <button
        aria-label="Theme toggle"
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-md text-fg-secondary",
          className
        )}
      >
        <Monitor size={16} aria-hidden="true" />
      </button>
    );
  }

  const Icon = iconMap[theme];

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={labelMap[theme]}
      title={labelMap[theme]}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-md text-fg-secondary",
        "hover:text-fg hover:bg-bg-raised transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        className
      )}
    >
      <Icon size={16} aria-hidden="true" />
    </button>
  );
}
