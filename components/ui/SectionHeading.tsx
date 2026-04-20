import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <p className="text-micro uppercase text-accent mb-4">{eyebrow}</p>
      )}
      <h2 className="text-h2 text-fg">{title}</h2>
      {subtitle && (
        <p className="mt-4 text-body-lg text-fg-secondary">{subtitle}</p>
      )}
    </div>
  );
}
