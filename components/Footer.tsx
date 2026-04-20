import Link from "next/link";
import { Linkedin, Facebook, Github, Twitter, MapPin, Phone, Mail } from "lucide-react";
import { Container } from "./ui/Container";
import { Button } from "./ui/Button";

const columns = [
  {
    title: "Services",
    links: [
      { label: "Software Development", href: "/services/software" },
      { label: "Web Development", href: "/services/web" },
      { label: "Mobile Apps", href: "/services/app" },
      { label: "AI Solutions", href: "/services/ai" },
      { label: "Hosting", href: "/services/hosting" },
      { label: "SEO &amp; Marketing", href: "/services/seo" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Projects", href: "/projects" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Pricing", href: "/pricing" },
      { label: "Domains", href: "/domains" },
      { label: "FAQ", href: "/faq" },
      { label: "Status", href: "/status" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

const socials = [
  { label: "LinkedIn", href: "https://linkedin.com/company/wevnix", Icon: Linkedin },
  { label: "Facebook", href: "https://facebook.com/wevnix", Icon: Facebook },
  { label: "GitHub", href: "https://github.com/wevnix", Icon: Github },
  { label: "X / Twitter", href: "https://twitter.com/wevnix", Icon: Twitter },
];

export function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-bg-raised" aria-label="Site footer">
      <Container>
        <div className="py-12 sm:py-16 lg:py-20 grid gap-10 lg:gap-12 lg:grid-cols-12">
          {/* Brand column */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2 focus-visible:outline-none">
              <LogoMark />
              <span className="text-h4 font-semibold tracking-tight text-fg">Wevnix</span>
            </Link>
            <p className="mt-4 text-body-sm text-fg-secondary max-w-sm">
              Software, websites, and AI — built in Bangladesh, built to scale.
            </p>

            <address className="mt-6 not-italic text-body-sm text-fg-secondary space-y-2">
              <p className="flex items-start gap-2">
                <MapPin size={16} className="shrink-0 text-fg-tertiary mt-0.5" aria-hidden="true" />
                Level 5, House 42, Road 11, Banani, Dhaka 1213
              </p>
              <p className="flex items-center gap-2">
                <Phone size={16} className="shrink-0 text-fg-tertiary" aria-hidden="true" />
                <a href="tel:+8801700000000" className="hover:text-fg">+880 1700 000000</a>
              </p>
              <p className="flex items-center gap-2">
                <Mail size={16} className="shrink-0 text-fg-tertiary" aria-hidden="true" />
                <a href="mailto:hello@wevnix.com" className="hover:text-fg">hello@wevnix.com</a>
              </p>
            </address>

            <div className="mt-6 flex items-center gap-1">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md text-fg-tertiary hover:text-fg hover:bg-bg-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <Icon size={16} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-micro uppercase text-fg-tertiary mb-4">{col.title}</h3>
                <ul className="space-y-3" role="list">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-body-sm text-fg-secondary hover:text-fg transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3">
            <h3 className="text-micro uppercase text-fg-tertiary mb-4">Newsletter</h3>
            <p className="text-body-sm text-fg-secondary mb-4">
              Monthly insights on building software in BD. No spam.
            </p>
            <form
              className="space-y-2"
              onSubmit={(e) => {
                e.preventDefault();
                // Wire up to server action or email service
              }}
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                placeholder="your@email.com"
                className="w-full h-10 px-3 bg-bg-surface border border-border-default rounded-md text-body-sm text-fg placeholder:text-fg-tertiary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-colors"
              />
              <Button type="submit" variant="primary" size="sm" fullWidth>
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="py-6 border-t border-border-subtle flex flex-col sm:flex-row gap-4 items-center justify-between">
          <p className="text-caption text-fg-tertiary">
            © {new Date().getFullYear()} Wevnix Ltd · Made in Dhaka 🇧🇩
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-caption text-fg-tertiary">
            <span>BASIS Member</span>
            <span aria-hidden="true">·</span>
            <span>SSLCOMMERZ</span>
            <span aria-hidden="true">·</span>
            <span>bKash · Nagad</span>
            <span aria-hidden="true">·</span>
            <span>Visa · Mastercard</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function LogoMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <rect width="28" height="28" rx="7" className="fill-brand" />
      <path
        d="M8 10l3 8 3-6 3 6 3-8"
        stroke="rgb(var(--accent))"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
