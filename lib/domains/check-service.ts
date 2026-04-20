import {
  SUPPORTED_TLDS,
  TTL_SECONDS,
  type DomainCheckResult,
  type SupportedTld,
  type CheckStatus,
} from "./types";
import { getTldInfo } from "./tld-registry";
import { cacheGet, cacheSet } from "./cache";
import { checkRdap } from "./checkers/rdap";
import { checkBtcl } from "./checkers/btcl";

/**
 * Orchestrates a batch of domain checks.
 *
 * For each (sld, tld) pair:
 *   1. Return cache hit if fresh.
 *   2. Otherwise dispatch to the right checker.
 *   3. Wrap into a DomainCheckResult and cache it (TTL depends on status).
 *
 * Runs all checks in parallel via Promise.all — the slowest TLD determines
 * the overall response time (usually 1–2s).
 */
export async function checkDomains(
  sld: string,
  tlds: SupportedTld[] = [...SUPPORTED_TLDS]
): Promise<{ results: DomainCheckResult[]; cached: number; checked: number }> {
  let cached = 0;
  let checked = 0;

  const results = await Promise.all(
    tlds.map(async (tld): Promise<DomainCheckResult> => {
      const key = `${sld}${tld}`;

      // 1. Cache
      const hit = cacheGet<DomainCheckResult>(key);
      if (hit) {
        cached++;
        return { ...hit, source: "cache" };
      }

      // 2. Live check
      checked++;
      const result = await runChecker(sld, tld);

      // 3. Cache (TTL depends on status)
      const ttl = TTL_SECONDS[result.status];
      if (ttl > 0) cacheSet(key, result, ttl);

      return result;
    })
  );

  return { results, cached, checked };
}

/** Route a single check to the right backend and assemble the result. */
async function runChecker(sld: string, tld: SupportedTld): Promise<DomainCheckResult> {
  const info = getTldInfo(tld);
  const domain = `${sld}${tld}`;
  const now = new Date().toISOString();

  // Short-circuit: direct .bd isn't registerable by BTCL rules, no network call needed.
  if (tld === ".bd") {
    return {
      domain,
      sld,
      tld,
      status: "invalid",
      priceBdt: null,
      restricted: true,
      restrictionNote: info.restrictionNote,
      checkedAt: now,
      source: "validator",
      ttlSeconds: 0,
    };
  }

  let status: CheckStatus;
  let source: DomainCheckResult["source"];

  if (info.family === "generic") {
    status = await checkRdap(domain);
    source = "rdap";
  } else {
    const r = await checkBtcl(domain);
    status = r.status;
    source = r.source;
  }

  return {
    domain,
    sld,
    tld,
    status,
    priceBdt: status === "available" ? info.priceBdt : null,
    restricted: info.restricted,
    restrictionNote: info.restrictionNote,
    checkedAt: now,
    source,
    ttlSeconds: TTL_SECONDS[status],
  };
}

/** Helper for emitting an invalid-input result without hitting the network. */
export function invalidResult(sld: string, tld: SupportedTld, reason: string): DomainCheckResult {
  const info = getTldInfo(tld);
  return {
    domain: `${sld}${tld}`,
    sld,
    tld,
    status: "invalid",
    priceBdt: null,
    restricted: info.restricted,
    restrictionNote: reason,
    checkedAt: new Date().toISOString(),
    source: "validator",
    ttlSeconds: 0,
  };
}
