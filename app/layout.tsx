import type { Metadata } from "next";
import { Inter, Hind_Siliguri, JetBrains_Mono } from "next/font/google";
import { JsonLd, organizationSchema, websiteSchema } from "@/lib/seo/jsonld";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const hind = Hind_Siliguri({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["bengali", "latin"],
  variable: "--font-hind",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wevnix.com"),
  title: {
    default: "Wevnix — Software, Websites & AI, built in Bangladesh",
    template: "%s · Wevnix",
  },
  description:
    "Wevnix helps startups, SMEs, and e-commerce teams in Bangladesh launch faster with reliable engineering, transparent BDT pricing, and real bilingual support.",
  keywords: [
    "software company Bangladesh",
    "web development Dhaka",
    ".bd domain search",
    "AI chatbot Bangladesh",
    "SEO Bangladesh",
    "hosting Bangladesh",
  ],
  authors: [{ name: "Wevnix" }],
  openGraph: {
    title: "Wevnix — Software, Websites & AI, built in Bangladesh",
    description:
      "Reliable engineering, transparent BDT pricing, and bilingual support for startups, SMEs, and e-commerce.",
    url: "https://wevnix.com",
    siteName: "Wevnix",
    locale: "en_US",
    alternateLocale: "bn_BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wevnix — Software, Websites & AI, built in Bangladesh",
    description:
      "Reliable engineering, transparent BDT pricing, and bilingual support for startups, SMEs, and e-commerce.",
  },
  alternates: {
    languages: {
      "en": "/",
      "bn": "/bn",
      "x-default": "/",
    },
  },
};

// Inline script to set the theme class before hydration to prevent flash.
const themeScript = `
  (function() {
    try {
      var t = localStorage.getItem('theme') || 'system';
      var d = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      if (d) document.documentElement.classList.add('dark');
    } catch (e) {}
  })();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${hind.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand focus:text-fg-inverse focus:rounded-md"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
