/**
 * Rate Limiter and Lead Deduplication Utility
 * Supports Upstash Redis REST API when configured.
 * Gracefully falls back to an in-memory sliding counter when Redis credentials are not set.
 * NOTE: In-memory fallback is best-effort and resets across cold starts in serverless environments.
 */

// In-memory store fallback
const memoryRateLimitStore = new Map();
const memoryDedupeStore = new Map();

// Periodic cleanup of in-memory store
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of memoryRateLimitStore.entries()) {
      if (now > record.resetTime) {
        memoryRateLimitStore.delete(key);
      }
    }
    for (const [key, expiresAt] of memoryDedupeStore.entries()) {
      if (now > expiresAt) {
        memoryDedupeStore.delete(key);
      }
    }
  }, 60000);
}

/**
 * Check rate limit for an identifier (e.g. client IP)
 * Max requests: limit (default 5) within windowMs (default 60000 = 1 min)
 */
export async function checkRateLimit(identifier, limit = 5, windowSeconds = 60) {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (redisUrl && redisToken) {
    try {
      const key = `rate_limit:${identifier}`;
      // Call Upstash Redis REST INCR and EXPIRE pipeline
      const pipelineRes = await fetch(`${redisUrl}/pipeline`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${redisToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          ["INCR", key],
          ["EXPIRE", key, windowSeconds, "NX"],
        ]),
      });

      if (pipelineRes.ok) {
        const results = await pipelineRes.json();
        const count = results[0]?.result || 1;
        return {
          allowed: count <= limit,
          remaining: Math.max(0, limit - count),
        };
      }
    } catch {
      // Redis error, fall back to in-memory check
    }
  }

  // In-memory Fallback
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const record = memoryRateLimitStore.get(identifier);

  if (!record || now > record.resetTime) {
    memoryRateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  record.count += 1;
  const allowed = record.count <= limit;
  return { allowed, remaining: Math.max(0, limit - record.count) };
}

/**
 * Check if the same phone number submitted from the same source within 10 minutes (600s)
 */
export async function isDuplicateSubmission(phone, source) {
  const dedupeKey = `dedupe:${phone}:${source}`;
  const ttlSeconds = 600; // 10 minutes

  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (redisUrl && redisToken) {
    try {
      // SET key 1 NX EX 600 returns "OK" if key was set, or null if key already existed
      const res = await fetch(`${redisUrl}/set/${encodeURIComponent(dedupeKey)}/1?nx=true&ex=${ttlSeconds}`, {
        headers: { Authorization: `Bearer ${redisToken}` },
      });
      if (res.ok) {
        const json = await res.json();
        // If result is null, key existed -> duplicate!
        return json.result !== "OK";
      }
    } catch {
      // Fall through to in-memory check
    }
  }

  // In-memory fallback
  const now = Date.now();
  const expiresAt = memoryDedupeStore.get(dedupeKey);

  if (expiresAt && now < expiresAt) {
    return true; // Is duplicate
  }

  memoryDedupeStore.set(dedupeKey, now + ttlSeconds * 1000);
  return false;
}
