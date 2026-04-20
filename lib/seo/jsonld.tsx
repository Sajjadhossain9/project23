/**
 * JSON-LD helpers.
 *
 * Usage in a server component:
 *   import { JsonLd, organizationSchema } from "@/lib/seo/jsonld";
 *   <JsonLd data={organizationSchema()} />
 *
 * Each helper returns a plain object that's stringified into a
 * <script type="application/ld+json"> tag by the <JsonLd/> component.
 */

import { getPublicBaseUrl } from "@/lib/payments/config";

// ---------- Schema builders ----------

export function organizationSchema() {
  const url = getPublicBaseUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${url}#organization`,
    name: "Wevnix",
    url,
    logo: `${url}/logo.png`,
    description:
      "Software, web, mobile, AI, hosting, and SEO services built in Bangladesh.",
    foundingDate: "2019",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Level 5, House 42, Road 11, Banani",
      addressLocality: "Dhaka",
      postalCode: "1213",
      addressCountry: "BD",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+880-1700-000000",
        contactType: "customer service",
        areaServed: "BD",
        availableLanguage: ["English", "Bengali"],
      },
    ],
    sameAs: [
      "https://linkedin.com/company/wevnix",
      "https://facebook.com/wevnix",
      "https://github.com/wevnix",
    ],
  };
}

export function websiteSchema() {
  const url = getPublicBaseUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${url}#website`,
    url,
    name: "Wevnix",
    publisher: { "@id": `${url}#organization` },
    inLanguage: ["en", "bn"],
  };
}

export function serviceSchema(input: {
  name: string;
  description: string;
  slug: string;
  priceBdt?: number;
}) {
  const url = getPublicBaseUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    provider: { "@id": `${url}#organization` },
    areaServed: { "@type": "Country", name: "Bangladesh" },
    url: `${url}/services/${input.slug}`,
    ...(input.priceBdt && {
      offers: {
        "@type": "Offer",
        price: input.priceBdt,
        priceCurrency: "BDT",
      },
    }),
  };
}

export function productOfferSchema(input: {
  name: string;
  description: string;
  priceBdt: number;
  id: string;
}) {
  const url = getPublicBaseUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    description: input.description,
    brand: { "@id": `${url}#organization` },
    offers: {
      "@type": "Offer",
      price: input.priceBdt,
      priceCurrency: "BDT",
      availability: "https://schema.org/InStock",
      url: `${url}/checkout?plan=${input.id}`,
    },
  };
}

export function faqSchema(faqs: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };
}

export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  const base = getPublicBaseUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${base}${item.url}`,
    })),
  };
}

export function articleSchema(input: {
  title: string;
  description: string;
  slug: string;
  author: string;
  publishedDate: string;
}) {
  const url = getPublicBaseUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    author: { "@type": "Person", name: input.author },
    publisher: { "@id": `${url}#organization` },
    datePublished: input.publishedDate,
    url: `${url}/blog/${input.slug}`,
  };
}

// ---------- Renderer ----------

export function JsonLd({ data }: { data: object | object[] }) {
  const payload = Array.isArray(data) ? data : [data];
  return (
    <script
      type="application/ld+json"
      // Safe: we control every input. Never pass user input here.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
