import { ExternalLink, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/types";

interface ProjectCardProps {
  project: Project;
}

const categoryLabels: Record<Project["category"], string> = {
  web: "Web",
  ecommerce: "E-commerce",
  software: "Software",
  app: "Mobile app",
  ai: "AI",
};

export function ProjectCard({ project }: ProjectCardProps) {
  const hasDemo = project.demoUrl && project.demoUrl !== "#";
  const displayDomain = hasDemo
    ? project.demoUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")
    : "preview coming soon";

  // Visible tech chips — cap at 3 with a "+N" overflow indicator
  const MAX_TECH_VISIBLE = 3;
  const visibleTech = project.tech.slice(0, MAX_TECH_VISIBLE);
  const overflowCount = project.tech.length - visibleTech.length;

  // The whole card is either an external link or an inert container
  const CardTag = hasDemo ? "a" : "div";
  const linkProps = hasDemo
    ? {
        href: project.demoUrl,
        target: "_blank",
        rel: "noopener noreferrer",
        "aria-label": `Visit ${project.name} (opens in a new tab)`,
      }
    : {};

  return (
    <CardTag
      {...linkProps}
      className={cn(
        "group relative flex flex-col rounded-lg border border-border-subtle bg-bg-surface overflow-hidden shadow-elev-1 transition-all duration-200 ease-out-expo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        hasDemo && "hover:shadow-elev-2 hover:-translate-y-0.5 hover:border-border-default"
      )}
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border-subtle bg-bg-raised shrink-0">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        </div>
        <div className="flex-1 flex items-center gap-1.5 px-2.5 py-1 rounded bg-bg-surface text-caption text-fg-secondary truncate font-mono">
          <span className="shrink-0 h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
          <span className="truncate">{displayDomain}</span>
        </div>
        {hasDemo && (
          <ExternalLink
            size={14}
            className="shrink-0 text-fg-tertiary group-hover:text-accent transition-colors"
            aria-hidden="true"
          />
        )}
      </div>

      {/* Preview area — gradient placeholder with project name */}
      <div
        className="relative aspect-[16/10] bg-gradient-to-br from-brand via-brand to-accent overflow-hidden"
        aria-hidden="true"
      >
        {/* Subtle dot pattern overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgb(var(--fg-inverse) / 0.4) 1px, transparent 0)",
            backgroundSize: "16px 16px",
          }}
        />
        {/* Project name, large */}
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <span className="text-center text-h2 font-semibold tracking-tight text-fg-inverse leading-tight line-clamp-3">
            {project.name}
          </span>
        </div>
        {/* Category chip, top-left */}
        <span className="absolute top-3 left-3 inline-flex items-center px-2 py-0.5 rounded-sm bg-fg-inverse/15 backdrop-blur-sm text-caption text-fg-inverse">
          {categoryLabels[project.category]}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-h4 text-fg leading-tight">{project.name}</h3>
          <StatusBadge status={project.status} />
        </div>

        <p className="text-body-sm text-fg-secondary mb-4 line-clamp-2 flex-1">
          {project.description}
        </p>

        {/* Tech stack + year row */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-border-subtle">
          <div className="flex flex-wrap gap-1.5 min-w-0">
            {visibleTech.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center px-2 py-0.5 rounded-sm bg-bg-raised text-caption text-fg-secondary"
              >
                {tech}
              </span>
            ))}
            {overflowCount > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-caption text-fg-tertiary">
                +{overflowCount}
              </span>
            )}
          </div>
          <span className="shrink-0 text-caption text-fg-tertiary tabular-nums">{project.year}</span>
        </div>
      </div>
    </CardTag>
  );
}

function StatusBadge({ status }: { status: Project["status"] }) {
  if (status === "completed") {
    return (
      <span className="shrink-0 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-success/10 text-success text-caption">
        <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
        Completed
      </span>
    );
  }
  return (
    <span className="shrink-0 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-accent-soft text-accent-ink text-caption">
      <Clock size={11} aria-hidden="true" />
      In progress
    </span>
  );
}
