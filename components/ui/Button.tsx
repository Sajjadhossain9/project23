import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "accent" | "ghost" | "destructive";
type Size = "sm" | "md" | "lg";

interface ButtonBaseProps {
  variant?: Variant;
  size?: Size;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
}

interface ButtonProps extends ButtonBaseProps, ButtonHTMLAttributes<HTMLButtonElement> {
  href?: undefined;
}

interface LinkButtonProps extends ButtonBaseProps {
  href: string;
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
  target?: string;
  rel?: string;
}

const baseStyles =
  "inline-flex items-center justify-center gap-2 font-medium rounded-md transition-all duration-200 ease-out-expo active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-fg-inverse hover:bg-brand-hover",
  secondary: "bg-transparent text-fg border border-border-default hover:bg-bg-raised hover:border-border-strong",
  accent: "bg-accent text-accent-ink hover:bg-accent/90",
  ghost: "bg-transparent text-fg hover:bg-bg-raised",
  destructive: "bg-danger text-white hover:bg-danger/90",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-body-sm",
  md: "h-11 px-5 text-[15px]",
  lg: "h-14 px-7 text-[17px]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", iconLeft, iconRight, fullWidth, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], fullWidth && "w-full", className)}
        {...props}
      >
        {iconLeft && <span aria-hidden="true" className="shrink-0">{iconLeft}</span>}
        {children}
        {iconRight && <span aria-hidden="true" className="shrink-0">{iconRight}</span>}
      </button>
    );
  }
);
Button.displayName = "Button";

export function LinkButton({
  variant = "primary",
  size = "md",
  iconLeft,
  iconRight,
  fullWidth,
  href,
  className,
  children,
  ...rest
}: LinkButtonProps) {
  const isExternal = href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");
  const classes = cn(baseStyles, variants[variant], sizes[size], fullWidth && "w-full", className);

  if (isExternal) {
    return (
      <a href={href} className={classes} {...rest}>
        {iconLeft && <span aria-hidden="true" className="shrink-0">{iconLeft}</span>}
        {children}
        {iconRight && <span aria-hidden="true" className="shrink-0">{iconRight}</span>}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {iconLeft && <span aria-hidden="true" className="shrink-0">{iconLeft}</span>}
      {children}
      {iconRight && <span aria-hidden="true" className="shrink-0">{iconRight}</span>}
    </Link>
  );
}
