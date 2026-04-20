import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { FinalCTA } from "@/components/FinalCTA";
import { ProjectsHero } from "@/components/projects/ProjectsHero";
import { ProjectsGrid } from "@/components/projects/ProjectsGrid";
import { projects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Websites, apps, and platforms Wevnix has built and is building — real clients across Bangladesh and beyond. Filter by completed work, work in progress, or service type.",
  alternates: {
    canonical: "/projects",
  },
};

export default function ProjectsPage() {
  // Sort: featured first, then completed before ongoing, then newest year first
  const sorted = [...projects].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    if (a.status !== b.status) return a.status === "completed" ? -1 : 1;
    return b.year.localeCompare(a.year);
  });

  return (
    <>
      <Header />

      <main id="main">
        <ProjectsHero />
        <ProjectsGrid projects={sorted} />
        <FinalCTA />
      </main>

      <Footer />
      <FloatingActions />
    </>
  );
}
