"use client";

import { useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { Search, Check, X, HelpCircle, Loader2, ShieldAlert, ArrowRight } from "lucide-react";
import { cn, formatBdt } from "@/lib/utils";
import type { DomainCheckResult, CheckResponse } from "@/lib/domains/types";

interface DomainCheckerProps {
  initialSld?: string;
  autoCheck?: boolean;
}

export function DomainChecker({ initialSld = "", autoCheck = false }: DomainCheckerProps) {
  const [sld, setSld] = useState(initialSld);
  const [results, setResults] = useState<DomainCheckResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function runCheck(value: string) {
    setError(null);
    setResults(null);

    startTransition(async () => {
      try {
        const res = await fetch("/api/domains/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sld: value }),
        });

        if (res.status === 429) {
          const body = await res.json();
          setError(
            `Too many requests. Try again in ${body.retryAfter ?? 60}s.`
          );
          return;
        }

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          setError(body.error ?? "Something went wrong. Please try again.");
          return;
        }

        const data = (await res.json()) as CheckResponse;
        setResults(data.results);
      } catch {
        setError("Network error. Please check your connection and try again.");
      }
    });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const cleaned = sld.trim().toLowerCase();
    if (!cleaned) return;
    runCheck(cleaned);
  }

  // Auto-run on mount if told to
  if (autoCheck && initialSld && !results && !pending && !error) {
    runCheck(initialSld);
  }

  return (
    <div className="space-y-6">
      {/* Search form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <label htmlFor="sld-input" className="block text-body-sm font-medium text-fg">
          Search a domain name
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-fg-tertiary pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="sld-input"
              type="text"
              value={sld}
              onChange={(e) =>
                setSld(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
              }
              placeholder="mybrand"
              autoComplete="off"
              spellCheck="false"
              className="w-full h-14 pl-12 pr-4 bg-bg-surface border border-border-default rounded-md text-body-lg text-fg placeholder:text-fg-tertiary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={pending || !sld.trim()}
            className="inline-flex items-center justify-center gap-2 h-14 px-6 rounded-md bg-accent text-accent-ink font-medium text-body hover:bg-accent/90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            {pending ? (
              <>
                <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                Checking…
              </>
            ) : (
              <>
                Check availability
                <ArrowRight size={18} aria-hidden="true" />
              </>
            )}
          </button>
        </div>
        <p className="text-caption text-fg-tertiary">
          We check all 8 supported TLDs at once: .com, .net, .org, .bd, .com.bd, .net.bd, .org.bd, .edu.bd
        </p>
      </form>

      {/* Error banner */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 p-4 rounded-md bg-danger/10 border border-danger/20"
        >
          <ShieldAlert size={18} className="shrink-0 mt-0.5 text-danger" aria-hidden="true" />
          <p className="text-body-sm text-danger">{error}</p>
        </div>
      )}

      {/* Results */}
      {results && (
        <div role="region" aria-label="Domain check results" aria-live="polite" className="space-y-2">
          {results.map((r) => (
            <ResultRow key={`${r.sld}${r.tld}`} result={r} />
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- single result row ----------

function ResultRow({ result }: { result: DomainCheckResult }) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-md border bg-bg-surface",
        result.status === "available" && "border-success/30",
        result.status === "unavailable" && "border-border-subtle opacity-70",
        result.status === "unknown" && "border-warning/30",
        result.status === "invalid" && "border-danger/30"
      )}
    >
      {/* Domain name */}
      <div className="flex-1 min-w-0">
        <p className="text-body font-medium text-fg font-mono truncate">
          {result.domain}
        </p>
        {result.restricted && result.restrictionNote && (
          <p className="text-caption text-fg-tertiary mt-0.5">{result.restrictionNote}</p>
        )}
      </div>

      {/* Status badge */}
      <div className="shrink-0">
        <StatusBadge status={result.status} />
      </div>

      {/* Price (only shown for available) */}
      <div className="shrink-0 sm:w-32 sm:text-right">
        {result.status === "available" && result.priceBdt !== null ? (
          <div>
            <p className="text-body font-semibold text-fg tabular-nums">
              {formatBdt(result.priceBdt)}
            </p>
            <p className="text-caption text-fg-tertiary">per year</p>
          </div>
        ) : (
          <p className="text-caption text-fg-tertiary">—</p>
        )}
      </div>

      {/* Action */}
      <div className="shrink-0">
        {result.status === "available" ? (
          <Link
            href={`/contact?domain=${encodeURIComponent(result.domain)}`}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-md bg-brand text-fg-inverse text-caption font-medium hover:bg-brand-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Register
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        ) : result.status === "unknown" ? (
          <span className="inline-flex items-center h-9 px-3.5 text-caption text-fg-tertiary">
            Try again
          </span>
        ) : null}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: DomainCheckResult["status"] }) {
  if (status === "available") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 text-success text-caption">
        <Check size={12} aria-hidden="true" />
        Available
      </span>
    );
  }
  if (status === "unavailable") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-bg-raised text-fg-secondary text-caption">
        <X size={12} aria-hidden="true" />
        Not available
      </span>
    );
  }
  if (status === "unknown") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-warning/10 text-warning text-caption">
        <HelpCircle size={12} aria-hidden="true" />
        Couldn&apos;t check
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-danger/10 text-danger text-caption">
      <X size={12} aria-hidden="true" />
      Invalid
    </span>
  );
}
