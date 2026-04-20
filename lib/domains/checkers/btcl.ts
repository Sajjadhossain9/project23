/**
 * BTCL checker for the .bd family (.bd, .com.bd, .net.bd, .org.bd, .edu.bd).
 *
 * BTCL does not publish a WHOIS or RDAP endpoint, so this file supports two
 * strategies selectable by environment variable:
 *
 *   1. WHOIS_API_PROVIDER=whoisxml  (recommended for production)
 *      Set WHOIS_API_KEY. We call WhoisXML's domain availability endpoint.
 *      Any provider with a JSON availability endpoint can be plugged in here.
 *
 *   2. default                      (no config required)
 *      Scrape register.btcl.com.bd. Fragile — BTCL may change the form at any
 *      time. Parser is DEFENSIVE: on any ambiguity we return "unknown",
 *      never "available".
 *
 * Both paths share one invariant: we NEVER report "available" without positive
 * evidence.
 */

export type BtclStatus = "available" | "unavailable" | "unknown";

const TIMEOUT_MS = 8000;

/** Entry point — picks a strategy based on env. */
export async function checkBtcl(domain: string): Promise<{
  status: BtclStatus;
  source: "whois-api" | "btcl";
}> {
  const provider = process.env.WHOIS_API_PROVIDER?.toLowerCase();

  if (provider === "whoisxml" && process.env.WHOIS_API_KEY) {
    const status = await checkWhoisXmlApi(domain);
    return { status, source: "whois-api" };
  }

  const status = await checkBtclScraper(domain);
  return { status, source: "btcl" };
}

// ---------- strategy 1: WhoisXML API ----------

async function checkWhoisXmlApi(domain: string): Promise<BtclStatus> {
  const apiKey = process.env.WHOIS_API_KEY!;
  const url = new URL("https://domain-availability.whoisxmlapi.com/api/v1");
  url.searchParams.set("apiKey", apiKey);
  url.searchParams.set("domainName", domain);
  url.searchParams.set("credits", "DA");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return "unknown";

    const data = (await res.json()) as {
      DomainInfo?: { domainAvailability?: "AVAILABLE" | "UNAVAILABLE" };
    };
    const flag = data?.DomainInfo?.domainAvailability;
    if (flag === "AVAILABLE") return "available";
    if (flag === "UNAVAILABLE") return "unavailable";
    return "unknown";
  } catch {
    return "unknown";
  } finally {
    clearTimeout(timer);
  }
}

// ---------- strategy 2: BTCL scraper ----------

/**
 * Scrapes register.btcl.com.bd's domain-availability form.
 *
 * IMPORTANT: These parsing heuristics were written without direct access to
 * BTCL's current form. Before relying on this in production, inspect the real
 * response once (DevTools → Network → whatever form submission fires) and
 * adjust the `AVAILABLE_SIGNALS` / `UNAVAILABLE_SIGNALS` arrays below to match
 * the exact strings BTCL returns.
 *
 * Unknown patterns return `unknown` — we never fall through to "available".
 */

// These are conservative placeholders. Update after verifying BTCL's response.
const AVAILABLE_SIGNALS = [
  "is available",
  "domain is available",
  "congratulations",
  "ready to register",
];

const UNAVAILABLE_SIGNALS = [
  "is not available",
  "already registered",
  "already taken",
  "domain is registered",
  "not available for registration",
];

const BTCL_LOOKUP_URL = "https://bdia.btcl.com.bd/DomainChecker.do?mode=checkDomain";

async function checkBtclScraper(domain: string): Promise<BtclStatus> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    // Adjust this request shape once you've inspected the real form.
    // Many older portals expect application/x-www-form-urlencoded with a named input.
    const body = new URLSearchParams({ domain }).toString();

    const res = await fetch(BTCL_LOOKUP_URL, {
      method: "POST",
      signal: controller.signal,
      cache: "no-store",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "text/html,application/xhtml+xml",
        "User-Agent": "Wevnix-DomainCheck/1.0 (+https://wevnix.com)",
      },
      body,
    });

    if (!res.ok) return "unknown";

    const html = (await res.text()).toLowerCase();

    const matchesUnavailable = UNAVAILABLE_SIGNALS.some((s) => html.includes(s));
    const matchesAvailable = AVAILABLE_SIGNALS.some((s) => html.includes(s));

    // If both match (shouldn't happen but defensive), prefer "unavailable"
    if (matchesUnavailable) return "unavailable";
    if (matchesAvailable) return "available";
    return "unknown";
  } catch {
    return "unknown";
  } finally {
    clearTimeout(timer);
  }
}
