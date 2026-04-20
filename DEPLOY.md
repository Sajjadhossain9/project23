# Wevnix Deployment Guide

Short, opinionated, and tested. Follow in order.

## 1. Prerequisites

- Vercel account (or a BD VPS with Docker + Node 18+)
- Postgres database — [Neon](https://neon.tech) recommended for serverless
- [SSLCOMMERZ](https://sslcommerz.com) merchant account (sandbox credentials work for staging)
- [Anthropic API](https://console.anthropic.com) key for the chatbot
- Cloudflare account (optional but strongly recommended for BD traffic)

## 2. Environment variables

Copy `.env.example` to `.env.local` for dev. For production, paste the same keys into Vercel's env UI.

**Required for launch:**

```bash
# Auth — generate with: openssl rand -base64 48
AUTH_SECRET=<48+ chars>

# First admin account — seed.ts creates this row
ADMIN_EMAIL=admin@wevnix.com
ADMIN_PASSWORD=<strong-password>

# Database
DATABASE_URL=postgresql://user:pass@host:5432/wevnix?sslmode=require

# WhatsApp — client-side, so NEXT_PUBLIC_ prefix
NEXT_PUBLIC_WHATSAPP_NUMBER=8801XXXXXXXXX

# Site URL — used by sitemap, OG, JSON-LD
NEXT_PUBLIC_BASE_URL=https://wevnix.com

# Payments
SSLCOMMERZ_STORE_ID=<from-sslcommerz-dashboard>
SSLCOMMERZ_STORE_PASSWORD=<from-sslcommerz-dashboard>
SSLCOMMERZ_SANDBOX=false

# Chatbot
ANTHROPIC_API_KEY=<from-anthropic-console>
```

**Optional:**

```bash
# Ops notifications when a chat visitor asks for a human
SLACK_HANDOFF_WEBHOOK=https://hooks.slack.com/services/...

# Payment + lead emails
RESEND_API_KEY=re_...

# .bd domain lookups (scraper works without this, but a real API is more reliable)
WHOIS_API_PROVIDER=whoisxml
WHOIS_API_KEY=<from-whoisxml>
```

## 3. First deploy

### Option A — Vercel (recommended)

```bash
# Link the repo
vercel link

# Pull envs locally
vercel env pull .env.local

# Push envs from .env.local to Production
# (or set each one in the Vercel dashboard)

# Deploy preview
vercel

# Deploy to production
vercel --prod
```

### Option B — BD-based VPS

```bash
# On the server
git clone <repo> wevnix && cd wevnix
npm ci
npm run build

# Process manager
npm i -g pm2
pm2 start npm --name wevnix -- start
pm2 save

# Put Caddy in front for HTTPS + security headers
```

## 4. Database — once, on first launch

```bash
npm run db:generate   # prisma generate
npm run db:migrate    # prisma migrate deploy
npm run db:seed       # creates admin user + pricing plans from lib/data.ts
```

After this, `/admin/login` works with the credentials you set in `ADMIN_EMAIL` + `ADMIN_PASSWORD`.

## 5. SSLCOMMERZ configuration

In your SSLCOMMERZ merchant dashboard:

1. Add the IPN URL: `https://wevnix.com/api/payments/webhook`
2. Add the success URL: `https://wevnix.com/payments/return`
3. Enable the wallets you want live: bKash, Nagad, Rocket, Card
4. Confirm store credentials match what's in Vercel env

## 6. DNS + Cloudflare

1. Point `wevnix.com` to Vercel (or your VPS)
2. Add Cloudflare in front (orange cloud on)
3. SSL mode: Full (strict)
4. Enable Auto Minify, Brotli, and HTTP/3
5. Add a Page Rule for `/api/*` with "Bypass Cache"

## 7. Launch checklist

Run through this list once, in order. Skip none.

- [ ] All env vars set in Vercel production
- [ ] `SSLCOMMERZ_SANDBOX=false` and real store credentials
- [ ] `NEXT_PUBLIC_WHATSAPP_NUMBER` is your real number
- [ ] `AUTH_SECRET` is 48+ chars, never committed
- [ ] `ADMIN_PASSWORD` changed from seed default
- [ ] DB migrated and seeded successfully
- [ ] SSLCOMMERZ webhook URL registered and pingable
- [ ] Visit `/api/health` → returns `{"status":"ok"}`
- [ ] Visit `/sitemap.xml` → lists all routes
- [ ] Visit `/robots.txt` → blocks `/admin`, `/api`, `/checkout`
- [ ] Log in at `/admin/login` → dashboard renders
- [ ] Edit one plan in `/admin/pricing` → change reflects on `/pricing`
- [ ] Run one sandbox payment end-to-end: checkout → gateway → return → webhook → succeeded
- [ ] Run one production payment (smallest plan) end-to-end
- [ ] Verify the admin payments inbox shows the payment
- [ ] Lighthouse on homepage, services, pricing → all green
- [ ] axe-core on every route → zero violations
- [ ] Mobile QA from a real BD 4G network (Grameenphone or Robi)
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Register for Google Business Profile
- [ ] Add BASIS listing if you're a member

## 8. Monitoring

- **Errors:** [Sentry](https://sentry.io) — `npm i @sentry/nextjs && npx @sentry/wizard@latest -i nextjs`
- **Uptime:** [Uptime Robot](https://uptimerobot.com) pinging `/api/health` every 5 min
- **Analytics:** [Plausible](https://plausible.io) or [Umami](https://umami.is) — no cookie banner needed
- **Web Vitals:** Vercel Analytics (built in) or a Plausible custom event

## 9. Backups

- Neon auto-backups daily — 7-day retention on free tier, 30-day on paid
- Add a weekly `pg_dump` cron copied to Cloudflare R2 or S3 for disaster recovery

## 10. Things that will need attention within 30 days

- `components/admin/LoginForm.tsx` uses server-side session rows — if you see "user not found" after a restart, re-run `npm run db:seed`
- The `.bd` domain scraper uses tuned strings from BTCL's current form; if BTCL redesigns, adjust `AVAILABLE_SIGNALS` / `UNAVAILABLE_SIGNALS` in `lib/domains/checkers/btcl.ts`
- The chatbot system prompt is in `lib/chat/config.ts` — review it quarterly to match your current positioning

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| "AUTH_SECRET must be set" | Env var missing or < 32 chars |
| Admin login works but dashboard redirects to login | Session row missing — re-run seed or check DB connection |
| Webhook never fires | SSLCOMMERZ IPN URL not registered, or firewall blocking POST |
| Pricing page shows stale data after admin edit | `revalidatePath` not firing — check deploy logs |
| Chat returns a generic "demo mode" reply | `ANTHROPIC_API_KEY` not set |
| Payment shows "pending" forever | Webhook didn't arrive — check Vercel function logs |
