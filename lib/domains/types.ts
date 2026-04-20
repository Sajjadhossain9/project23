/**
 * Domain availability — shared types.
 * Every checker and every caller returns / accepts these shapes.
 */

export type CheckStatus = "available" | "unavailable" | "unknown" | "invalid";

export const SUPPORTED_TLDS = [
  ".com",
  ".net",
  ".org",
  ".bd",
  ".com.bd",
  ".net.bd",
  ".org.bd",
  ".edu.bd",
] as const;

export type SupportedTld = (typeof SUPPORTED_TLDS)[number];

export interface DomainCheckResult {
  domain: string; // full: mybrand.com.bd
  sld: string;
  tld: SupportedTld;
  status: CheckStatus;
  priceBdt: number | null;
  restricted: boolean;
  restrictionNote?: string;
  checkedAt: string; // ISO
  source: "cache" | "rdap" | "btcl" | "whois-api" | "validator";
  ttlSeconds: number;
}

export interface CheckRequest {
  sld: string;
  tlds?: SupportedTld[];
}

export interface CheckResponse {
  query: { sld: string; tlds: SupportedTld[] };
  results: DomainCheckResult[];
  meta: { durationMs: number; cached: number; checked: number };
}

/** TTLs in seconds — chosen per status to balance freshness vs. load */
export const TTL_SECONDS = {
  available: 180, // 3 min — someone could grab it
  unavailable: 900, // 15 min — registered domains stay registered
  unknown: 30, // 30 sec — allow quick retry after transient failures
  invalid: 0, // never cache
} as const;
