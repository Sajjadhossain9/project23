import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "surface" | "feature" | "metric";
  interactive?: boolean;
  highlighted?: boolean;
}

export function Card({
  children,
  className,
  variant = "surface",
  interactive = false,
  highlighted = false,
}: CardProps) {
  const base =
    variant === "metric"
      ? "bg-bg-raised rounded-md p-4"
      : "bg-bg-surface rounded-lg border border-border-subtle";

  const padding = variant !== "metric" ? "p-5 sm:p-6" : "";

  const interactiveStyles = interactive
    ? "shadow-elev-1 transition-all duration-200 ease-out-expo hover:shadow-elev-2 hover:-translate-y-0.5 hover:border-border-default"
    : "";

  const highlightedStyles = highlighted ? "border-2 border-accent" : "";

  return (
    <div className={cn(base, padding, interactiveStyles, highlightedStyles, className)}>
      {children}
    </div>
  );
}
