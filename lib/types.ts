export type Locale = "en" | "bn";

export interface Service {
  slug: string;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  deliverables: string[];
  proof?: string;
  // Extended fields used on the /services page and detail pages
  longDescription?: string;
  features?: string[];
  startingPriceBdt?: number;
}

export interface ServiceCategory {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  serviceSlugs: string[];
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
  duration: string;
}

export interface TechCategory {
  name: string;
  tools: string[];
}

export interface Solution {
  slug: string;
  audience: string;
  audienceBn: string;
  headline: string;
  headlineBn: string;
  features: string[];
}

export interface CaseStudy {
  slug: string;
  client: string;
  coverAlt: string;
  outcome: string;
  outcomeBn: string;
  tags: string[];
}

export type PricingCategory = "web" | "hosting" | "seo" | "ai";
export type BillingCycle = "one-time" | "monthly" | "yearly";

export interface PricingPlan {
  id: string;
  category: PricingCategory;
  name: string;
  tagline: string;
  priceBdt: number;
  billingCycle: BillingCycle;
  features: string[];
  popular?: boolean;
  active: boolean;
  order: number;
  customQuote?: boolean;
  updatedAt?: string;
}

/** @deprecated Use PricingPlan instead. Kept for backward compatibility. */
export interface PricingTier {
  id: string;
  name: string;
  tagline: string;
  priceBdt: number;
  features: string[];
  popular?: boolean;
}

/**
 * PricingPlan is the admin-editable, full-catalog version of a plan.
 * Every field maps 1:1 to a Prisma model — see lib/pricing-store.ts for
 * the intended schema migration path.
 */
export interface PricingPlan {
  id: string;
  serviceSlug: string; // matches Service.slug — web, software, app, ai, hosting, seo
  name: string;
  tagline: string;
  priceBdt: number;
  /** Optional suffix shown next to the price, e.g. "/month", "/year", "one-time" */
  billingNote?: string;
  features: string[];
  popular?: boolean;
  active: boolean;
  order: number;
  ctaLabel?: string;
  ctaHref?: string;
  /** ISO date string, set by the store on every write */
  updatedAt?: string;
}

export interface PricingPlanInput {
  serviceSlug: string;
  name: string;
  tagline: string;
  priceBdt: number;
  billingNote?: string;
  features: string[];
  popular?: boolean;
  active?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  quoteBn?: string;
  author: string;
  role: string;
  company: string;
  initials: string;
}

export interface BlogPost {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  authorInitials: string;
  date: string;
  readMinutes: number;
}

export interface TldInfo {
  tld: string;
  priceBdt: number;
  restricted?: boolean;
  note?: string;
}

export type ProjectStatus = "completed" | "ongoing";
export type ProjectCategory = "web" | "ecommerce" | "software" | "app" | "ai";

export interface Project {
  slug: string;
  name: string;
  description: string;
  category: ProjectCategory;
  status: ProjectStatus;
  year: string;
  demoUrl: string;
  tech: string[];
  client?: string;
  featured?: boolean;
}
