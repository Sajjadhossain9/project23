import { SUPPORTED_TLDS, type SupportedTld } from "./types";

export type ValidationResult =
  | { ok: true; sld: string }
  | { ok: false; error: string };

/**
 * SLD rules:
 * - 3–63 characters
 * - lowercase a-z, digits, hyphens
 * - cannot start or end with a hyphen
 * - no consecutive hyphens (reserved for IDN Punycode)
 */
const SLD_PATTERN = /^[a-z0-9](?:[a-z0-9-]{1,61}[a-z0-9])?$/;

export function validateSld(raw: string): ValidationResult {
  if (typeof raw !== "string") return { ok: false, error: "SLD must be a string." };

  // Strip anything a user might paste by accident
  const cleaned = raw
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    // If they typed the whole domain, take the first label
    .split(".")[0]
    .trim();

  if (!cleaned) return { ok: false, error: "Enter a domain name." };
  if (cleaned.length < 3) return { ok: false, error: "Minimum 3 characters." };
  if (cleaned.length > 63) return { ok: false, error: "Maximum 63 characters." };
  if (cleaned.includes("--"))
    return { ok: false, error: "Consecutive hyphens aren't allowed." };
  if (!SLD_PATTERN.test(cleaned))
    return {
      ok: false,
      error: "Use only letters, numbers, and hyphens (not at the start or end).",
    };

  return { ok: true, sld: cleaned };
}

export function normalizeTlds(input: unknown): SupportedTld[] {
  if (!Array.isArray(input)) return [];
  const allowed = new Set<string>(SUPPORTED_TLDS);
  return input
    .filter((t): t is string => typeof t === "string")
    .map((t) => (t.startsWith(".") ? t : `.${t}`).toLowerCase())
    .filter((t) => allowed.has(t)) as SupportedTld[];
}

export function isSupportedTld(tld: string): tld is SupportedTld {
  return (SUPPORTED_TLDS as readonly string[]).includes(tld);
}
