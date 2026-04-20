/**
 * Domain-check cache.
 *
 * Current: in-memory Map keyed by `${sld}${tld}`, survives HMR via globalThis.
 *
 * Production swap: Upstash Redis. Replace the four public functions below with
 * equivalent Redis commands — the call sites don't change.
 *
 *   import { Redis } from "@upstash/redis";
 *   const redis = Redis.fromEnv();
 *   await redis.set(key, JSON.stringify(entry), { ex: ttlSeconds });
 */

interface CacheEntry {
  value: string; // serialized DomainCheckResult
  expiresAt: number; // epoch ms
}

const g = globalThis as unknown as { __domainCache?: Map<string, CacheEntry> };
if (!g.__domainCache) g.__domainCache = new Map();
const cache = g.__domainCache;

function now(): number {
  return Date.now();
}

/** Garbage-collect expired entries opportunistically (cheap; runs O(n) on each read) */
function sweep() {
  const t = now();
  for (const [k, v] of cache) {
    if (v.expiresAt <= t) cache.delete(k);
  }
}

export function cacheGet<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (entry.expiresAt <= now()) {
    cache.delete(key);
    return null;
  }
  try {
    return JSON.parse(entry.value) as T;
  } catch {
    cache.delete(key);
    return null;
  }
}

export function cacheSet<T>(key: string, value: T, ttlSeconds: number): void {
  if (ttlSeconds <= 0) return; // don't cache invalid/zero-TTL results
  cache.set(key, {
    value: JSON.stringify(value),
    expiresAt: now() + ttlSeconds * 1000,
  });
  if (cache.size > 500) sweep(); // bound memory
}

export function cacheDelete(key: string): void {
  cache.delete(key);
}

export function cacheStats() {
  sweep();
  return { size: cache.size };
}
