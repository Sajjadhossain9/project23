import Link from "next/link";
import { ArrowRight, Check, Code2, Globe, Smartphone, Sparkles, Server, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatBdt } from "@/lib/utils";
import type { Service } from "@/lib/types";

const iconMap = {
  software: Code2,
  web: Globe,
  app: Smartphone,
  ai: Sparkles,
  hosting: Server,
  seo: TrendingUp,
} as const;

interface ServiceDetailCardProps {
  service: Service;
}

export function ServiceDetailCard({ service }: ServiceDetailCardProps) {
  const Icon = iconMap[service.slug as keyof typeof iconMap] ?? Code2;

  return (
    <Card interactive className="h-full flex flex-col group">
      {/* Icon + starting price */}
      <div className="flex items-start justify-between mb-5">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-accent-soft text-accent">
          <Icon size={22} aria-hidden="true" />
        </div>
        {service.startingPriceBdt && (
          <div className="text-right">
            <p className="text-caption text-fg-tertiary">Starting at</p>
            <p className="text-body-sm font-medium text-fg tabular-nums">
              {formatBdt(service.startingPriceBdt)}
            </p>
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="text-h3 text-fg mb-3">{service.title}</h3>

      {/* Long description, with a graceful fallback to the short one */}
      <p className="text-body text-fg-secondary mb-6">
        {service.longDescription ?? service.description}
      </p>

      {/* Feature list */}
      {service.features && service.features.length > 0 && (
        <ul className="space-y-2.5 mb-6 flex-1" role="list">
          {service.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-body-sm text-fg-secondary">
              <Check size={16} className="shrink-0 text-accent mt-0.5" aria-hidden="true" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Footer CTA */}
      <div className="mt-auto pt-4 border-t border-border-subtle flex items-center justify-between">
        <Link
          href={`/services/${service.slug}`}
          className="inline-flex items-center gap-1.5 text-body-sm font-medium text-fg group-hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
        >
          Learn more
          <ArrowRight
            size={14}
            className="group-hover:translate-x-0.5 transition-transform"
            aria-hidden="true"
          />
        </Link>
        <Link
          href={`/contact?service=${service.slug}`}
          className="text-body-sm text-fg-tertiary hover:text-fg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
        >
          Get a quote
        </Link>
      </div>
    </Card>
  );
}
