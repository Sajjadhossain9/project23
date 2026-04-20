"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/types";

interface LanguageToggleProps {
  className?: string;
  defaultLocale?: Locale;
  onChange?: (locale: Locale) => void;
}

export function LanguageToggle({ className, defaultLocale = "en", onChange }: LanguageToggleProps) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);

  function handleChange(next: Locale) {
    setLocale(next);
    onChange?.(next);
    // In a real app, this would trigger Next.js locale routing:
    // router.push(pathname, { locale: next })
  }

  return (
    <div
      role="group"
      aria-label="Language"
      className={cn(
        "inline-flex items-center rounded-md border border-border-default bg-bg-surface p-0.5 text-caption",
        className
      )}
    >
      <button
        type="button"
        onClick={() => handleChange("en")}
        aria-pressed={locale === "en"}
        className={cn(
          "px-3 py-1.5 rounded-sm transition-colors",
          locale === "en"
            ? "bg-brand text-fg-inverse"
            : "text-fg-secondary hover:text-fg"
        )}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => handleChange("bn")}
        aria-pressed={locale === "bn"}
        lang="bn"
        className={cn(
          "px-3 py-1.5 rounded-sm transition-colors",
          locale === "bn"
            ? "bg-brand text-fg-inverse"
            : "text-fg-secondary hover:text-fg"
        )}
      >
        বাং
      </button>
    </div>
  );
}
