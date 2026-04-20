/**
 * Per-visitor token-bucket rate limiter for the chat endpoint.
 *
 * Defaults: 15 messages / minute per visitor. Separate bucket from the
 * IP-based domain rate limiter so the two features don't throttle each other.
 *
 * Production swap: Upstash Rate Limit. Same signature.
 */

interface Bucket {
  tokens: number;
  updatedAt: number;
}

const g = globalThis as unknown as { __chatBuckets?: Map<string, Bucket> };
if (!g.__chatBuckets) g.__chatBuckets = new Map();
const buckets = g.__chatBuckets;

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export function checkChatRateLimit(
  visitorId: string,
  capacity = 15,
  refillPerSecond = 15 / 60
): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(visitorId);
  const bucket: Bucket = existing ?? { tokens: capacity, updatedAt: now };

  const elapsedSec = (now - bucket.updatedAt) / 1000;
  bucket.tokens = Math.min(capacity, bucket.tokens + elapsedSec * refillPerSecond);
  bucket.updatedAt = now;

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    buckets.set(visitorId, bucket);
    return {
      allowed: true,
      remaining: Math.floor(bucket.tokens),
      retryAfterSeconds: 0,
    };
  }

  buckets.set(visitorId, bucket);
  return {
    allowed: false,
    remaining: 0,
    retryAfterSeconds: Math.ceil((1 - bucket.tokens) / refillPerSecond),
  };
}
