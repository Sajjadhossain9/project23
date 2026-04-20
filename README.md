# Wevnix

Production-ready marketing site, admin panel, payments, and AI chat system for Wevnix — a Bangladesh software services company.

**Stack:** Next.js 15 · TypeScript · Tailwind CSS · Prisma · Postgres

## What's inside

- Public marketing site (home, services, projects, pricing, domains, contact, about, blog)
- `/pricing` with live BDT plans that admin can edit
- `/domains` with real-time availability across .com, .com.bd, .net.bd, .org.bd, .edu.bd
- `/checkout` and `/payments/return` powering bKash, Nagad, Rocket, and cards via SSLCOMMERZ
- `/admin` — login, dashboard, pricing editor, payments inbox with CSV export, refund flow
- AI chatbot + floating WhatsApp button on every page
- Sitemap, robots, JSON-LD structured data, security headers

## Quick start

```bash
npm install
cp .env.example .env.local
# Fill in AUTH_SECRET (openssl rand -base64 48) and ADMIN_PASSWORD

npm run dev
# http://localhost:3000
# Admin at http://localhost:3000/admin/login
```

Without a database, everything runs against in-memory repos — perfect for development. Pricing edits persist across HMR but reset on cold restart.

## With Postgres

```bash
# Add DATABASE_URL to .env.local
npm run db:generate
npm run db:migrate
npm run db:seed
```

Now edits persist, sessions survive restarts, payments are reconcilable, chat transcripts are stored.

## Structure

```
wevnix/
├── app/
│   ├── (public routes)      # /, /services, /projects, /pricing, /domains, /contact, /about, /blog, /checkout, /payments/return
│   ├── admin/               # Protected admin panel
│   ├── api/                 # Domain checker, payments, chat, admin CRUD
│   ├── sitemap.ts
│   ├── robots.ts
│   └── layout.tsx
├── components/
│   ├── ui/                  # Button, Card, Container, SectionHeading
│   ├── admin/               # Sidebar, TopBar, PricingForm, PaymentFilters, etc
│   ├── domains/             # DomainChecker
│   ├── payments/            # CheckoutForm
│   ├── pricing/             # Hero, grid, cards, FAQ
│   ├── projects/            # Hero, grid, card
│   └── services/            # Hero, detail card, process, tech stack
├── lib/
│   ├── admin/               # Pricing repo + audit log
│   ├── chat/                # Bot config, LLM client, rate limit, repo
│   ├── domains/             # RDAP + BTCL checkers, cache, validator
│   ├── payments/            # SSLCOMMERZ provider, repo, config
│   ├── seo/                 # JSON-LD helpers
│   ├── auth.ts              # Password hash + JWT
│   ├── session.ts           # getSession / requireSession
│   └── data.ts              # Static seed data (services, projects, blog, pricing)
├── prisma/
│   ├── schema.prisma        # User, Session, PricingPlan, Payment, Order, ChatConversation, AuditLog
│   └── seed.ts
├── middleware.ts            # Edge JWT check for /admin
├── next.config.js           # Security headers
└── DEPLOY.md                # Production deployment guide
```

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Start local dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run migrations |
| `npm run db:seed` | Seed admin user + pricing plans |
| `npm run db:studio` | Open Prisma Studio GUI |

## Deploy

See [DEPLOY.md](./DEPLOY.md) for the full checklist.

Short version:
1. Push to Vercel
2. Set env vars (see `.env.example`)
3. Register SSLCOMMERZ webhook URL → `/api/payments/webhook`
4. Run db migration + seed
5. Walk the launch checklist in DEPLOY.md

## Design system

- Colors defined as CSS variables in `app/globals.css`, surfaced through Tailwind semantic classes (`bg-brand`, `text-fg`, `border-border-subtle`)
- Dark mode via `.dark` class on `<html>`, set pre-hydration to prevent flash
- Fluid typography (`clamp()`) for all headings
- WCAG 2.1 AA throughout — visible focus rings, 44×44 touch targets, `prefers-reduced-motion` respected

## Things to change before launch

These are marked in code with `TODO`:

- Replace `8801700000000` placeholder WhatsApp number (in `.env`, `FinalCTA.tsx`, `ContactPage.tsx`)
- Uncomment Resend/Slack hooks in `app/api/payments/webhook/route.ts` and `app/api/chat/route.ts`
- Add your real logo to `/public/logo.png`
- Replace gradient project covers with real screenshots in `/public/projects/`
- Tune `AVAILABLE_SIGNALS` / `UNAVAILABLE_SIGNALS` in `lib/domains/checkers/btcl.ts` after one live BTCL test
- Review the chatbot system prompt in `lib/chat/config.ts`

## License

Proprietary — Wevnix Ltd.
