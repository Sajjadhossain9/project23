import type {
  Service,
  ServiceCategory,
  ProcessStep,
  TechCategory,
  Solution,
  CaseStudy,
  PricingTier,
  PricingPlan,
  Testimonial,
  BlogPost,
  TldInfo,
  Project,
} from "./types";

export const services: Service[] = [
  {
    slug: "software",
    title: "Software Development",
    titleBn: "সফটওয়্যার ডেভেলপমেন্ট",
    description: "Custom platforms, ERPs, and internal tools built to your process.",
    descriptionBn: "আপনার প্রক্রিয়ার জন্য তৈরি কাস্টম প্ল্যাটফর্ম ও ইআরপি।",
    deliverables: ["Custom platforms", "ERP systems", "Internal tools"],
    proof: "40+ projects delivered",
    longDescription:
      "We build custom software that fits the way your business actually works — not the other way around. From ERPs to internal dashboards to complex multi-tenant platforms, we handle the architecture, engineering, and rollout.",
    features: [
      "Custom ERP and CRM systems",
      "Multi-tenant SaaS platforms",
      "Internal admin tools and dashboards",
      "API design and integrations",
      "Legacy system modernization",
    ],
    startingPriceBdt: 200000,
  },
  {
    slug: "web",
    title: "Web Development",
    titleBn: "ওয়েব ডেভেলপমেন্ট",
    description: "Marketing sites, dashboards, and web apps that convert.",
    descriptionBn: "মার্কেটিং সাইট, ড্যাশবোর্ড ও ওয়েব অ্যাপ যা কাজ করে।",
    deliverables: ["Next.js + React", "Dashboards", "E-commerce"],
    proof: "Used by 50+ brands",
    longDescription:
      "Fast, accessible websites and web apps — built with Next.js and React, designed for real conversion. Bilingual, SEO-ready, and tuned for the latency profile of users browsing from Bangladesh.",
    features: [
      "Marketing sites and landing pages",
      "E-commerce with bKash and Nagad",
      "Customer dashboards and portals",
      "Bengali and English from day one",
      "Core Web Vitals in the green",
    ],
    startingPriceBdt: 25000,
  },
  {
    slug: "app",
    title: "Mobile Apps",
    titleBn: "মোবাইল অ্যাপ",
    description: "iOS and Android apps built natively or with React Native.",
    descriptionBn: "নেটিভ বা ক্রস-প্ল্যাটফর্ম আইওএস ও অ্যান্ড্রয়েড অ্যাপ।",
    deliverables: ["iOS & Android", "React Native", "Store publishing"],
    longDescription:
      "Mobile apps for iOS and Android, built natively when performance matters or with React Native when it makes economic sense. We handle the build, the store submission, and the first 90 days after launch.",
    features: [
      "Native iOS (Swift) and Android (Kotlin)",
      "Cross-platform with React Native",
      "App Store and Play Store submission",
      "Push notifications and deep links",
      "Crash reporting and analytics",
    ],
    startingPriceBdt: 180000,
  },
  {
    slug: "ai",
    title: "AI Solutions",
    titleBn: "এআই সলিউশন",
    description: "Chatbots, automations, and custom LLM integrations.",
    descriptionBn: "চ্যাটবট, অটোমেশন ও কাস্টম এলএলএম সংযোগ।",
    deliverables: ["Chatbots", "Workflow automation", "RAG systems"],
    longDescription:
      "Practical AI that earns its keep — chatbots trained on your content, automations that take busywork off your team, and LLM integrations that actually ship. We start with the outcome, not the model.",
    features: [
      "Customer support chatbots with RAG",
      "Workflow and document automation",
      "Custom LLM integrations (Claude, GPT)",
      "Bengali and English language support",
      "Analytics and continuous training",
    ],
    startingPriceBdt: 80000,
  },
  {
    slug: "hosting",
    title: "Hosting",
    titleBn: "হোস্টিং",
    description: "Fast, managed hosting with 99.9% uptime and local support.",
    descriptionBn: "দ্রুত ও নির্ভরযোগ্য হোস্টিং, ৯৯.৯% আপটাইম।",
    deliverables: ["Shared & VPS", "Managed WordPress", "SSL & backups"],
    proof: "99.9% uptime",
    longDescription:
      "Managed hosting that stays out of your way. We handle the server, the updates, the backups, and the 2 a.m. incidents so your team can focus on the business.",
    features: [
      "Managed VPS and shared hosting",
      "Free SSL and daily backups",
      "DDoS protection via Cloudflare",
      "99.9% uptime SLA",
      "Bangla-speaking support on WhatsApp",
    ],
    startingPriceBdt: 3000,
  },
  {
    slug: "seo",
    title: "SEO & Marketing",
    titleBn: "এসইও ও মার্কেটিং",
    description: "Organic growth, content strategy, and paid campaigns.",
    descriptionBn: "অর্গানিক গ্রোথ, কনটেন্ট স্ট্র্যাটেজি ও পেইড ক্যাম্পেইন।",
    deliverables: ["SEO audits", "Content", "Google & Meta ads"],
    longDescription:
      "Organic growth that compounds — technical SEO audits, bilingual content strategy, and paid campaigns on Google and Meta tuned for the Bangladeshi market.",
    features: [
      "Technical SEO audits and fixes",
      "Bengali and English content strategy",
      "Google Ads and Meta Ads management",
      "Local SEO for BD search intent",
      "Monthly reporting and iteration",
    ],
    startingPriceBdt: 15000,
  },
];

export const serviceCategories: ServiceCategory[] = [
  {
    id: "build",
    eyebrow: "Build",
    title: "Turn your idea into working software.",
    subtitle:
      "Product engineering, end to end. Scope it, design it, ship it — then keep making it better.",
    serviceSlugs: ["software", "web", "app", "ai"],
  },
  {
    id: "launch",
    eyebrow: "Launch & grow",
    title: "Ship it, keep it fast, help it grow.",
    subtitle:
      "The infrastructure, attention, and growth work that turn a launch into a business.",
    serviceSlugs: ["hosting", "seo"],
  },
];

export const processSteps: ProcessStep[] = [
  {
    step: "01",
    title: "Discover",
    description:
      "We meet, understand your goals, constraints, and users, and write a short brief you sign off on. No surprises later.",
    duration: "1 week",
  },
  {
    step: "02",
    title: "Design",
    description:
      "Wireframes first, then visual design, then a clickable prototype. You see the thing before we build it.",
    duration: "1–3 weeks",
  },
  {
    step: "03",
    title: "Build",
    description:
      "We ship in two-week sprints with a live preview link. You review as we go — nothing gets hidden until the end.",
    duration: "4–12 weeks",
  },
  {
    step: "04",
    title: "Launch & support",
    description:
      "We go live with you, monitor the first 30 days closely, and stay on WhatsApp for the long term.",
    duration: "Ongoing",
  },
];

export const techStack: TechCategory[] = [
  {
    name: "Frontend",
    tools: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
  },
  {
    name: "Backend",
    tools: ["Node.js", "PostgreSQL", "Prisma", "Redis", "GraphQL"],
  },
  {
    name: "Mobile",
    tools: ["React Native", "Swift", "Kotlin", "Expo"],
  },
  {
    name: "AI & Data",
    tools: ["Claude API", "OpenAI", "pgvector", "LangChain", "Python"],
  },
  {
    name: "Cloud & DevOps",
    tools: ["Vercel", "AWS", "Cloudflare", "Docker", "GitHub Actions"],
  },
];

export const solutions: Solution[] = [
  {
    slug: "startups",
    audience: "For Startups",
    audienceBn: "স্টার্টআপদের জন্য",
    headline: "Go from idea to MVP in 8 weeks",
    headlineBn: "৮ সপ্তাহে আইডিয়া থেকে এমভিপি",
    features: ["Rapid MVP builds", "Investor-ready demos", "Runway-friendly pricing"],
  },
  {
    slug: "smes",
    audience: "For SMEs",
    audienceBn: "এসএমইদের জন্য",
    headline: "Digitize your operations without breaking them",
    headlineBn: "আপনার অপারেশন ডিজিটাল করুন, বিঘ্ন ছাড়াই",
    features: ["Process automation", "Internal dashboards", "Staff training in Bangla"],
  },
  {
    slug: "ecommerce",
    audience: "For E-commerce",
    audienceBn: "ই-কমার্সের জন্য",
    headline: "Sell more with a store built for BD shoppers",
    headlineBn: "বাংলাদেশি ক্রেতার জন্য তৈরি স্টোর",
    features: ["bKash, Nagad, COD", "Bangla-first UX", "Courier integrations"],
  },
];

export const caseStudies: CaseStudy[] = [
  {
    slug: "shwapno-lite",
    client: "Shwapno Lite",
    coverAlt: "Grocery mobile app interface",
    outcome: "Cut order processing time by 60%",
    outcomeBn: "অর্ডার প্রসেসিং সময় ৬০% কমিয়েছে",
    tags: ["Mobile App", "Logistics", "Next.js"],
  },
  {
    slug: "robi-dashboard",
    client: "Robi Partner Hub",
    coverAlt: "Analytics dashboard screenshot",
    outcome: "Unified 200+ retailers on one dashboard",
    outcomeBn: "২০০+ রিটেইলার এক ড্যাশবোর্ডে",
    tags: ["Dashboard", "Telecom", "Analytics"],
  },
  {
    slug: "banglabook",
    client: "BanglaBook",
    coverAlt: "E-commerce bookstore homepage",
    outcome: "4x revenue in first 6 months post-launch",
    outcomeBn: "লঞ্চের ৬ মাসে ৪ গুণ আয় বৃদ্ধি",
    tags: ["E-commerce", "SEO", "bKash"],
  },
];

/**
 * Admin-editable pricing. In production, this array is replaced by a Prisma
 * query against the PricingPlan table (see prisma/schema.prisma). The page
 * itself calls `getPricingPlans()` from `lib/pricing.ts` so it works with
 * either source without changes.
 */
export const pricingPlans: PricingPlan[] = [
  // Web development packages
  {
    id: "web-starter",
    category: "web",
    name: "Web Starter",
    tagline: "Perfect for a first professional presence",
    priceBdt: 25000,
    billingCycle: "one-time",
    features: [
      "5-page responsive website",
      "Mobile-optimized design",
      "Basic SEO setup",
      "Contact form",
      "1 month of support",
    ],
    popular: false,
    active: true,
    order: 1,
  },
  {
    id: "web-business",
    category: "web",
    name: "Business",
    tagline: "For growing teams that need more",
    priceBdt: 75000,
    billingCycle: "one-time",
    features: [
      "Up to 15 pages + blog",
      "Custom design system",
      "Advanced SEO + analytics",
      "Admin dashboard",
      "3 months of support",
    ],
    popular: true,
    active: true,
    order: 2,
  },
  {
    id: "web-ecommerce",
    category: "web",
    name: "E-commerce",
    tagline: "A full online store, launch-ready",
    priceBdt: 150000,
    billingCycle: "one-time",
    features: [
      "Full catalog + checkout",
      "bKash, Nagad, card payments",
      "Inventory management",
      "Courier integrations",
      "6 months of support",
    ],
    popular: false,
    active: true,
    order: 3,
  },

  // Hosting plans
  {
    id: "hosting-starter",
    category: "hosting",
    name: "Hosting Starter",
    tagline: "Small sites and personal projects",
    priceBdt: 500,
    billingCycle: "monthly",
    features: [
      "10 GB SSD storage",
      "Unmetered bandwidth",
      "Free SSL certificate",
      "Daily backups",
      "Email support (BN/EN)",
    ],
    active: true,
    order: 1,
  },
  {
    id: "hosting-business",
    category: "hosting",
    name: "Hosting Business",
    tagline: "Most popular for SMEs and agencies",
    priceBdt: 1500,
    billingCycle: "monthly",
    features: [
      "50 GB SSD storage",
      "Free CDN via Cloudflare",
      "Free SSL + DDoS protection",
      "Hourly backups",
      "Priority WhatsApp support",
    ],
    popular: true,
    active: true,
    order: 2,
  },
  {
    id: "hosting-enterprise",
    category: "hosting",
    name: "Hosting Enterprise",
    tagline: "Managed VPS with SLA",
    priceBdt: 6000,
    billingCycle: "monthly",
    features: [
      "Dedicated VPS resources",
      "99.9% uptime SLA",
      "Managed updates + monitoring",
      "Continuous backups",
      "Dedicated account manager",
    ],
    active: true,
    order: 3,
  },

  // SEO packages
  {
    id: "seo-starter",
    category: "seo",
    name: "SEO Starter",
    tagline: "Audit, fixes, and foundation",
    priceBdt: 15000,
    billingCycle: "monthly",
    features: [
      "Technical SEO audit",
      "On-page optimization",
      "Keyword research (EN + BN)",
      "Monthly rank report",
      "Google Search Console setup",
    ],
    active: true,
    order: 1,
  },
  {
    id: "seo-growth",
    category: "seo",
    name: "SEO Growth",
    tagline: "Content + links for steady growth",
    priceBdt: 35000,
    billingCycle: "monthly",
    features: [
      "Everything in Starter",
      "4 bilingual blog posts / month",
      "Link-building outreach",
      "Competitor analysis",
      "Monthly strategy call",
    ],
    popular: true,
    active: true,
    order: 2,
  },
  {
    id: "seo-premium",
    category: "seo",
    name: "SEO Premium",
    tagline: "Full-stack organic growth",
    priceBdt: 75000,
    billingCycle: "monthly",
    features: [
      "Everything in Growth",
      "8 bilingual posts + video SEO",
      "Paid search management",
      "Conversion-rate optimization",
      "Weekly reporting + calls",
    ],
    active: true,
    order: 3,
  },

  // AI solutions
  {
    id: "ai-chatbot",
    category: "ai",
    name: "AI Chatbot",
    tagline: "Deploy a support bot in 2 weeks",
    priceBdt: 80000,
    billingCycle: "one-time",
    features: [
      "Claude or GPT-powered",
      "RAG over your content",
      "Bengali + English support",
      "Web widget + WhatsApp",
      "3 months of tuning",
    ],
    active: true,
    order: 1,
  },
  {
    id: "ai-automation",
    category: "ai",
    name: "AI Automation",
    tagline: "Automate a recurring workflow",
    priceBdt: 150000,
    billingCycle: "one-time",
    features: [
      "Process discovery + design",
      "Custom automation build",
      "Integrations (email, CRM, docs)",
      "Admin dashboard",
      "6 months of support",
    ],
    popular: true,
    active: true,
    order: 2,
  },
  {
    id: "ai-custom",
    category: "ai",
    name: "AI Custom Build",
    tagline: "Bespoke LLM applications",
    priceBdt: 0,
    billingCycle: "one-time",
    customQuote: true,
    features: [
      "Discovery workshop included",
      "Custom model selection",
      "Full production build",
      "Infrastructure setup",
      "12 months of support",
    ],
    active: true,
    order: 3,
  },
];

/**
 * Pricing FAQ — editable via admin. Categorized for the FAQ accordion.
 */
export const pricingFaqs = [
  {
    q: "Do prices include VAT?",
    a: "Yes. All prices shown on this page include 15% VAT as required in Bangladesh. You will never see a surprise line item at the end.",
  },
  {
    q: "Can I pay in installments?",
    a: "For projects over BDT 100,000 we offer a standard 3-installment plan: 40% on kickoff, 40% on design approval, 20% on launch. Custom plans available for larger engagements.",
  },
  {
    q: "What payment methods do you accept?",
    a: "bKash, Nagad, bank transfer, and credit or debit cards (Visa and Mastercard) via SSLCOMMERZ. International clients can pay via Stripe in USD.",
  },
  {
    q: "Can I switch plans later?",
    a: "Yes. Hosting and SEO plans can be upgraded or downgraded at the start of any billing cycle. We will prorate the difference automatically.",
  },
  {
    q: "Is domain and hosting included in web packages?",
    a: "Domain registration is separate (see our domains page for .bd and .com pricing). Hosting is not bundled in the one-time build price — you choose a hosting plan that fits your traffic.",
  },
  {
    q: "What is your refund policy?",
    a: "Before kickoff, full refund. After kickoff, refund the unused portion of your deposit if we cannot deliver what was agreed in the scope document. We have rarely had to issue one in five years.",
  },
  {
    q: "What if my project does not fit these packages?",
    a: "Most custom software and mobile app projects are quoted individually after a discovery call. Reach out via the contact page for a tailored quote.",
  },
];

/**
 * @deprecated Use pricingPlans filtered by category === 'web' instead.
 * Kept for any legacy consumers.
 */
export const pricingTiers: PricingTier[] = pricingPlans
  .filter((p) => p.category === "web" && p.active)
  .sort((a, b) => a.order - b.order)
  .map(({ id, name, tagline, priceBdt, features, popular }) => ({
    id,
    name,
    tagline,
    priceBdt,
    features,
    popular,
  }));

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote:
      "Wevnix built our entire platform in under three months. The team communicated in Bangla and English, kept timelines honest, and shipped exactly what we agreed on.",
    author: "Tanvir Ahmed",
    role: "Founder",
    company: "Kotha App",
    initials: "TA",
  },
  {
    id: "t2",
    quote:
      "After years of dealing with agencies that vanish post-launch, working with Wevnix felt different. They still answer our WhatsApp a year later.",
    quoteBn:
      "বছরের পর বছর যে এজেন্সিগুলো লঞ্চের পর উধাও হয়ে যেত — ওয়েভনিক্স সম্পূর্ণ আলাদা। এক বছর পরেও আমাদের হোয়াটসঅ্যাপে উত্তর দেয়।",
    author: "Farzana Rahman",
    role: "CTO",
    company: "MediCare BD",
    initials: "FR",
  },
  {
    id: "t3",
    quote:
      "Transparent pricing in BDT. No dollar surprises. Our finance team still talks about how easy the reconciliation was.",
    author: "Imran Hossain",
    role: "Operations Lead",
    company: "DhakaMart",
    initials: "IH",
  },
];

export const blogPosts: BlogPost[] = [
  {
    slug: "bd-ecommerce-payment-stack",
    category: "E-commerce",
    title: "The right payment stack for a Bangladeshi e-commerce launch",
    excerpt:
      "bKash, Nagad, SSLCOMMERZ, or Stripe? A practical decision guide for founders choosing payment rails in 2025.",
    author: "Sajjad Hossain",
    authorInitials: "SH",
    date: "2025-10-14",
    readMinutes: 7,
  },
  {
    slug: "bd-domain-rules",
    category: "Domains",
    title: "How .bd domains actually work — rules, paperwork, and timelines",
    excerpt:
      "Registering .com.bd is straightforward. .edu.bd and .org.bd need documents. Here is exactly what BTCL requires.",
    author: "Nashida Karim",
    authorInitials: "NK",
    date: "2025-09-28",
    readMinutes: 5,
  },
  {
    slug: "nextjs-in-production-bangladesh",
    category: "Engineering",
    title: "Running Next.js apps from Bangladesh: hosting, latency, and CDN",
    excerpt:
      "Should you host in Singapore, Europe, or locally? We measured real latency from Dhaka and here is what we found.",
    author: "Rafi Chowdhury",
    authorInitials: "RC",
    date: "2025-09-10",
    readMinutes: 9,
  },
];

export const tldPricing: TldInfo[] = [
  { tld: ".com", priceBdt: 1200 },
  { tld: ".bd", priceBdt: 1800 },
  { tld: ".com.bd", priceBdt: 1500 },
  { tld: ".net.bd", priceBdt: 1500 },
  { tld: ".org.bd", priceBdt: 1500, restricted: true, note: "Non-profits only" },
  { tld: ".edu.bd", priceBdt: 1500, restricted: true, note: "Educational institutions only" },
];

export const trustStats = [
  { label: "Projects delivered", value: "50+" },
  { label: "Industries served", value: "15+" },
  { label: "Hosting uptime", value: "99.9%" },
  { label: "Support languages", value: "BN / EN" },
];

export const clientLogos = [
  "Shwapno",
  "Robi",
  "BRAC",
  "Grameenphone",
  "Daraz",
  "Pathao",
  "bKash",
  "Chaldal",
];

export const projects: Project[] = [
  // Real client sites
  {
    slug: "madrasah-darul-huda",
    name: "Madrasah Darul Huda",
    description:
      "Trilingual institutional website for an Islamic girls' school in Lalmonirhat — Bengali, English, and Arabic with full RTL support, 24 routes, and SEO infrastructure.",
    category: "web",
    status: "completed",
    year: "2026",
    demoUrl: "https://madrasahdarulhuda.com",
    tech: ["Next.js 15", "Tailwind CSS", "i18n", "Netlify"],
    client: "Madrasah Darul Huda",
    featured: true,
  },
  {
    slug: "aim-construction-design",
    name: "AIM Construction & Design",
    description:
      "Portfolio and service website for a construction and architectural design firm, with project gallery and lead-capture forms.",
    category: "web",
    status: "completed",
    year: "2025",
    demoUrl: "https://aimconstructiondesign.com",
    tech: ["Next.js", "Tailwind CSS", "MDX"],
    client: "AIM Construction & Design",
  },
  {
    slug: "aau-drone-club",
    name: "AAU Drone Club",
    description:
      "Official website for the university drone club — events calendar, member roster, project gallery, and media archive.",
    category: "web",
    status: "completed",
    year: "2025",
    demoUrl: "https://aaubdroneclub.com",
    tech: ["Next.js", "Tailwind CSS", "Sanity CMS"],
    client: "Atish Dipankar University Drone Club",
  },
  {
    slug: "aau-bf",
    name: "AAU BF",
    description:
      "Official website for an Atish Dipankar University student organization, with news, events, and member resources.",
    category: "web",
    status: "completed",
    year: "2025",
    demoUrl: "https://aaubdbf.com",
    tech: ["Next.js", "Tailwind CSS"],
    client: "AAU BF",
  },

  // Sample projects — web
  {
    slug: "dhaka-diner",
    name: "Dhaka Diner",
    description:
      "Multi-location restaurant website with menu, reservations, and branch locator. Bengali and English throughout.",
    category: "web",
    status: "completed",
    year: "2025",
    demoUrl: "#",
    tech: ["Next.js", "Tailwind CSS", "Mapbox"],
    client: "Dhaka Diner",
  },
  {
    slug: "mediplus-clinic",
    name: "MediPlus Clinic",
    description:
      "Healthcare clinic website with doctor profiles, online appointment booking, and patient portal — currently in development.",
    category: "web",
    status: "ongoing",
    year: "2026",
    demoUrl: "#",
    tech: ["Next.js", "Prisma", "PostgreSQL"],
    client: "MediPlus",
  },
  {
    slug: "lexon-law",
    name: "Lexon Law",
    description:
      "Corporate law firm website with practice-area pages, attorney profiles, case studies, and a secure client intake form.",
    category: "web",
    status: "completed",
    year: "2024",
    demoUrl: "#",
    tech: ["Next.js", "Tailwind CSS", "Resend"],
    client: "Lexon Law Partners",
  },

  // Sample projects — e-commerce
  {
    slug: "banglabazar",
    name: "BanglaBazar",
    description:
      "Full-stack fashion marketplace with vendor onboarding, bKash and Nagad checkout, and courier integrations for countrywide delivery.",
    category: "ecommerce",
    status: "completed",
    year: "2025",
    demoUrl: "#",
    tech: ["Next.js", "Stripe", "bKash", "Nagad", "PostgreSQL"],
    client: "BanglaBazar",
    featured: true,
  },
  {
    slug: "chaldal-lite",
    name: "ChaldalLite",
    description:
      "Grocery delivery storefront for a regional retailer — inventory sync, same-day delivery windows, and a Bangla-first UX.",
    category: "ecommerce",
    status: "ongoing",
    year: "2026",
    demoUrl: "#",
    tech: ["Next.js", "Prisma", "Redis", "bKash"],
    client: "ChaldalLite",
  },

  // Sample projects — software / platforms
  {
    slug: "school-connect",
    name: "SchoolConnect",
    description:
      "School management platform with attendance, grading, fee collection, and parent communication. Serves 12 campuses.",
    category: "software",
    status: "completed",
    year: "2024",
    demoUrl: "#",
    tech: ["Next.js", "Prisma", "PostgreSQL", "Twilio"],
    client: "SchoolConnect BD",
  },
  {
    slug: "hr-pilot",
    name: "HRPilot",
    description:
      "HR management suite — employee records, leave requests, payroll, and performance reviews — with role-based access.",
    category: "software",
    status: "completed",
    year: "2024",
    demoUrl: "#",
    tech: ["Next.js", "NextAuth", "Prisma", "AWS"],
    client: "HRPilot",
  },
  {
    slug: "stocksense",
    name: "StockSense",
    description:
      "Inventory management system with barcode scanning, multi-warehouse support, and low-stock alerts on Telegram.",
    category: "software",
    status: "ongoing",
    year: "2026",
    demoUrl: "#",
    tech: ["Next.js", "Prisma", "React Native", "Telegram API"],
    client: "StockSense",
  },

  // Sample projects — mobile apps
  {
    slug: "foodiedash",
    name: "FoodieDash",
    description:
      "Food delivery mobile app for iOS and Android with real-time order tracking, rider app, and merchant dashboard.",
    category: "app",
    status: "completed",
    year: "2024",
    demoUrl: "#",
    tech: ["React Native", "Expo", "Firebase", "Google Maps"],
    client: "FoodieDash",
    featured: true,
  },
  {
    slug: "shikhi-bd",
    name: "ShikhiBD",
    description:
      "E-learning mobile app for school students with video lessons, quizzes, and offline content — Bengali-first.",
    category: "app",
    status: "ongoing",
    year: "2026",
    demoUrl: "#",
    tech: ["React Native", "Expo", "Node.js", "MUX"],
    client: "ShikhiBD",
  },

  // Sample projects — AI
  {
    slug: "support-gpt",
    name: "SupportGPT",
    description:
      "Customer support chatbot trained on a retailer's knowledge base — resolves 68% of tickets without human intervention.",
    category: "ai",
    status: "completed",
    year: "2025",
    demoUrl: "#",
    tech: ["Claude API", "pgvector", "LangChain", "Next.js"],
    client: "SupportGPT",
  },
  {
    slug: "docscan-ai",
    name: "DocScan AI",
    description:
      "Document OCR and data-extraction platform for invoices, NID cards, and trade licenses — handles Bengali and English.",
    category: "ai",
    status: "completed",
    year: "2025",
    demoUrl: "#",
    tech: ["Python", "Claude API", "Tesseract", "AWS Lambda"],
    client: "DocScan AI",
  },
];
