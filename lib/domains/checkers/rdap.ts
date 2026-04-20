/**
 * RDAP (Registration Data Access Protocol) checker.
 *
 * Works for .com / .net / .org. rdap.org is a public bootstrap service that
 * routes queries to the correct registry. No API key required.
 *
 * Status mapping (strict):
 *   HTTP 404            → available
 *   HTTP 200 + valid    → unavailable
 *   HTTP 200 + empty    → unknown
 *   timeout / network   → unknown
 *   anything else       → unknown
 */

export type RdapStatus = "available" | "unavailable" | "unknown";

const RDAP_ENDPOINT = "https://rdap.org/domain/";
const TIMEOUT_MS = 5000;

export async function checkRdap(domain: string): Promise<RdapStatus> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${RDAP_ENDPOINT}${encodeURIComponent(domain)}`, {
      signal: controller.signal,
      headers: {
        Accept: "application/rdap+json, application/json",
        "User-Agent": "Wevnix-DomainCheck/1.0 (+https://wevnix.com)",
      },
      // Tell Next.js not to cache at the fetch layer — our service layer caches.
      cache: "no-store",
    });

    // 404 is the canonical "not registered" signal in RDAP
    if (res.status === 404) return "available";

    // Some registries return 400 for "not found" — treat as available only if
    // the body confirms it. Otherwise keep it conservative.
    if (!res.ok) return "unknown";

    // 200 + valid object shape = registered
    const data = (await res.json()) as { objectClassName?: string; ldhName?: string };
    if (data?.objectClassName === "domain" && data?.ldhName) return "unavailable";

    // Anything else is ambiguous — don't claim availability
    return "unknown";
  } catch {
    // Network error, timeout, JSON parse failure — all map to unknown
    return "unknown";
  } finally {
    clearTimeout(timer);
  }
}
