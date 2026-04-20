"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "./ui/Button";
import { tldPricing } from "@/lib/data";

export function HeroDomainSearch() {
  const router = useRouter();
  const [domain, setDomain] = useState("");
  const [tld, setTld] = useState(".com.bd");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const cleaned = domain.trim().toLowerCase();
    if (!cleaned) return;
    // Navigate to the full domain checker; it auto-runs when q is present
    const params = new URLSearchParams({ q: cleaned, tld });
    router.push(`/domains?${params.toString()}`);
  }

  const tlds = tldPricing.map((t) => t.tld);

  return (
    <div className="rounded-xl border border-border-subtle bg-bg-surface p-6 sm:p-7 shadow-elev-2">
      <div className="flex items-center gap-2 mb-1">
        <Search size={16} className="text-accent" aria-hidden="true" />
        <span className="text-micro uppercase text-accent">Domain search</span>
      </div>
      <h2 className="text-h3 text-fg mb-2">Find your perfect .bd domain</h2>
      <p className="text-body-sm text-fg-secondary mb-5">
        Check availability across .com, .bd, .com.bd, .edu.bd, .org.bd, and .net.bd.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <label htmlFor="hero-domain" className="sr-only">
            Domain name
          </label>
          <div className="relative flex-1">
            <input
              id="hero-domain"
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
              placeholder="mybrand"
              autoComplete="off"
              spellCheck="false"
              className="w-full h-11 px-4 bg-bg border border-border-default rounded-md text-body text-fg placeholder:text-fg-tertiary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-colors"
            />
          </div>
          <label htmlFor="hero-tld" className="sr-only">
            Top-level domain
          </label>
          <select
            id="hero-tld"
            value={tld}
            onChange={(e) => setTld(e.target.value)}
            className="h-11 px-3 pr-8 bg-bg border border-border-default rounded-md text-body text-fg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-colors"
          >
            {tlds.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit" variant="accent" size="md" fullWidth disabled={!domain}>
          Check availability
        </Button>
      </form>

      <p className="mt-4 text-caption text-fg-tertiary">
        No hidden renewal fees · .edu.bd &amp; .org.bd documentation handled for you.
      </p>
    </div>
  );
}
