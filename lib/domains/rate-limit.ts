/**
 * Per-IP token-bucket rate limiter.
 *
 * Defaults: 20 checks / minute per IP.
 *
 * Production swap: Upstash Rate Limit. Same function signature; the only
 * difference is the storage backend.
 */

interface Bucket {
  tokens: number;
  updatedAt: number; // epoch ms
}

const g = globalThis as unknown as { __rateBuckets?: Map<string, Bucket> };
if (!g.__rateBuckets) g.__rateBuckets = new Map();
const buckets = g.__rateBuckets;

export interface RateLimitConfig {
  capacity: number; // max tokens in the bucket
  refillPerSecond: number; // tokens added each second
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number; // seconds until a token is available
}

export function checkRateLimit(
  key: string,
  config: RateLimitConfig = { capacity: 20, refillPerSecond: 20 / 60 }
): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);
  const bucket: Bucket = existing ?? { tokens: config.capacity, updatedAt: now };

  // Refill based on elapsed time
  const elapsedSec = (now - bucket.updatedAt) / 1000;
  bucket.tokens = Math.min(
    config.capacity,
    bucket.tokens + elapsedSec * config.refillPerSecond
  );
  bucket.updatedAt = now;

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    buckets.set(key, bucket);
    return {
      allowed: true,
      remaining: Math.floor(bucket.tokens),
      retryAfterSeconds: 0,
    };
  }

  buckets.set(key, bucket);
  const retryAfter = Math.max(1, Math.ceil((1 - bucket.tokens) / config.refillPerSecond));
  return { allowed: false, remaining: 0, retryAfterSeconds: retryAfter };
}

/** Extract a reasonable IP from request headers behind a proxy */
export function clientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}
