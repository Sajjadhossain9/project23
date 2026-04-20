import type { ReactNode, ElementType } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  size?: "default" | "narrow";
}

export function Container({ as: Tag = "div", children, className, size = "default" }: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full px-5 sm:px-6 lg:px-8",
        size === "default" ? "max-w-content" : "max-w-3xl",
        className
      )}
    >
      {children}
    </Tag>
  );
}

interface SectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  variant?: "default" | "raised";
  ariaLabel?: string;
}

export function Section({ id, children, className, variant = "default", ariaLabel }: SectionProps) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={cn(
        "py-16 sm:py-20 lg:py-24",
        variant === "raised" && "bg-bg-raised",
        className
      )}
    >
      {children}
    </section>
  );
}
