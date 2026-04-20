import type { SupportedTld } from "./types";

export interface TldInfo {
  tld: SupportedTld;
  priceBdt: number;
  restricted: boolean;
  restrictionNote?: string;
  family: "btcl" | "generic";
}

/**
 * TLD pricing + restriction registry.
 * Admin should drive `priceBdt` from the database in production —
 * this is the seed.
 *
 * NOTE on `.bd`: BTCL does NOT permit direct second-level registrations under
 * `.bd` for general registrants (e.g. `brand.bd`). Only third-level names like
 * `brand.com.bd`, `brand.net.bd`, `brand.org.bd`, `brand.edu.bd` are allowed.
 * We keep `.bd` in the TLD list but mark it restricted so the UI can show a
 * clear explanation; the checker always returns `invalid` for it.
 */
export const TLD_REGISTRY: Record<SupportedTld, TldInfo> = {
  ".com": { tld: ".com", priceBdt: 1200, restricted: false, family: "generic" },
  ".net": { tld: ".net", priceBdt: 1400, restricted: false, family: "generic" },
  ".org": { tld: ".org", priceBdt: 1300, restricted: false, family: "generic" },
  ".bd": {
    tld: ".bd",
    priceBdt: 0,
    restricted: true,
    restrictionNote:
      "Direct .bd registrations aren't allowed by BTCL. Choose .com.bd, .net.bd, or another subdomain.",
    family: "btcl",
  },
  ".com.bd": { tld: ".com.bd", priceBdt: 1500, restricted: false, family: "btcl" },
  ".net.bd": { tld: ".net.bd", priceBdt: 1500, restricted: false, family: "btcl" },
  ".org.bd": {
    tld: ".org.bd",
    priceBdt: 1500,
    restricted: true,
    restrictionNote: "Non-profits and NGOs only — registration requires documentation.",
    family: "btcl",
  },
  ".edu.bd": {
    tld: ".edu.bd",
    priceBdt: 1500,
    restricted: true,
    restrictionNote: "Educational institutions only — requires approval from the Ministry of Education.",
    family: "btcl",
  },
};

export function getTldInfo(tld: SupportedTld): TldInfo {
  return TLD_REGISTRY[tld];
}
