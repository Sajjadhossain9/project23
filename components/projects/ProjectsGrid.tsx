"use client";

import { useMemo, useState } from "react";
import { Container, Section } from "@/components/ui/Container";
import { ProjectCard } from "./ProjectCard";
import { cn } from "@/lib/utils";
import type { Project, ProjectCategory, ProjectStatus } from "@/lib/types";

type StatusFilter = ProjectStatus | "all";
type CategoryFilter = ProjectCategory | "all";

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "completed", label: "Completed" },
  { value: "ongoing", label: "In progress" },
];

const categoryOptions: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "All types" },
  { value: "web", label: "Web" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "software", label: "Software" },
  { value: "app", label: "Mobile apps" },
  { value: "ai", label: "AI" },
];

interface ProjectsGridProps {
  projects: Project[];
}

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  const [status, setStatus] = useState<StatusFilter>("all");
  const [category, setCategory] = useState<CategoryFilter>("all");

  const filtered = useMemo(() => {
    return projects.filter((project) => {
      if (status !== "all" && project.status !== status) return false;
      if (category !== "all" && project.category !== category) return false;
      return true;
    });
  }, [projects, status, category]);

  return (
    <Section id="projects-grid" ariaLabel="Project catalog" className="!pt-6 sm:!pt-10">
      <Container>
        {/* Status segmented control */}
        <div
          role="group"
          aria-label="Filter by status"
          className="inline-flex items-center rounded-md border border-border-default bg-bg-surface p-0.5 text-caption mb-4"
        >
          {statusOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setStatus(option.value)}
              aria-pressed={status === option.value}
              className={cn(
                "px-3.5 py-1.5 rounded-sm transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                status === option.value
                  ? "bg-brand text-fg-inverse"
                  : "text-fg-secondary hover:text-fg"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Category chip row */}
        <div
          role="group"
          aria-label="Filter by category"
          className="flex flex-wrap items-center gap-2 mb-8"
        >
          {categoryOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setCategory(option.value)}
              aria-pressed={category === option.value}
              className={cn(
                "px-3.5 py-1.5 rounded-full border text-caption transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                category === option.value
                  ? "bg-fg text-fg-inverse border-fg"
                  : "bg-transparent text-fg-secondary border-border-default hover:text-fg hover:border-border-strong"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Live count for screen readers + visible */}
        <p className="text-caption text-fg-tertiary mb-6" aria-live="polite">
          Showing <span className="tabular-nums font-medium text-fg-secondary">{filtered.length}</span>{" "}
          of <span className="tabular-nums">{projects.length}</span>{" "}
          {projects.length === 1 ? "project" : "projects"}
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
            {filtered.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border-default bg-bg-surface py-16 text-center">
            <p className="text-body text-fg">No projects match those filters.</p>
            <button
              type="button"
              onClick={() => {
                setStatus("all");
                setCategory("all");
              }}
              className="mt-4 text-body-sm font-medium text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
            >
              Clear filters
            </button>
          </div>
        )}
      </Container>
    </Section>
  );
}
