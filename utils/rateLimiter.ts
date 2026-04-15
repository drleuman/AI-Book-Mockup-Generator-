
import { SecurityError } from './security';

type RateLimiterRecord = {
  timestamps: number[];
  lockUntil: number;
};

export interface RateLimitCheckResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
}

export class InMemoryRateLimiter {
  private readonly bucket = new Map<string, RateLimiterRecord>();

  constructor(
    private readonly maxRequests: number,
    private readonly windowMs: number,
    private readonly lockMs: number = 0
  ) {}

  check(key: string): RateLimitCheckResult {
    const now = Date.now();
    const record = this.bucket.get(key) ?? { timestamps: [], lockUntil: 0 };

    if (record.lockUntil > now) {
      return {
        allowed: false,
        remaining: 0,
        retryAfterMs: record.lockUntil - now,
      };
    }

    record.timestamps = record.timestamps.filter((ts) => now - ts < this.windowMs);

    if (record.timestamps.length >= this.maxRequests) {
      record.lockUntil = this.lockMs > 0 ? now + this.lockMs : now + this.windowMs;
      this.bucket.set(key, record);

      return {
        allowed: false,
        remaining: 0,
        retryAfterMs: record.lockUntil - now,
      };
    }

    return {
      allowed: true,
      remaining: this.maxRequests - record.timestamps.length - 1,
      retryAfterMs: 0,
    };
  }

  consume(key: string): void {
    const now = Date.now();
    const record = this.bucket.get(key) ?? { timestamps: [], lockUntil: 0 };

    record.timestamps = record.timestamps.filter((ts) => now - ts < this.windowMs);
    record.timestamps.push(now);

    this.bucket.set(key, record);
  }

  assert(key: string, message = 'CRITICAL: RATE_LIMIT_EXCEEDED'): void {
    const result = this.check(key);

    if (!result.allowed) {
      const seconds = Math.ceil(result.retryAfterMs / 1000);
      throw new SecurityError(`${message}. SYSTEM_LOCK: RETRY_IN_${seconds}S.`, 'RATE_LIMITED');
    }

    this.consume(key);
  }

  reset(key: string): void {
    this.bucket.delete(key);
  }
}

export class CooldownGuard {
  private readonly lastUsed = new Map<string, number>();

  constructor(private readonly cooldownMs: number) {}

  assert(key: string, message = 'SYSTEM_COOLDOWN_ACTIVE'): void {
    const now = Date.now();
    const last = this.lastUsed.get(key) ?? 0;
    const elapsed = now - last;

    if (elapsed < this.cooldownMs) {
      const retryAfterMs = this.cooldownMs - elapsed;
      const seconds = Math.ceil(retryAfterMs / 1000);
      throw new SecurityError(`${message}. PLEASE_WAIT_${seconds}S.`, 'COOLDOWN_ACTIVE');
    }

    this.lastUsed.set(key, now);
  }

  reset(key: string): void {
    this.lastUsed.delete(key);
  }
}

export class RequestDeduper {
  private readonly inflight = new Set<string>();

  assertStart(key: string, message = 'DUPLICATE_INFLIGHT_REQUEST_DETECTED'): void {
    if (this.inflight.has(key)) {
      throw new SecurityError(message, 'DUPLICATE_INFLIGHT_REQUEST');
    }

    this.inflight.add(key);
  }

  end(key: string): void {
    this.inflight.delete(key);
  }
}

export const generationRateLimiter = new InMemoryRateLimiter(
  8,          // max requests (stricter)
  60_000,     // per minute
  90_000      // lock after hit
);

export const batchPreviewRateLimiter = new InMemoryRateLimiter(
  3,          // max batches (stricter)
  5 * 60_000, // per 5 minutes
  10 * 60_000
);

export const generationCooldownGuard = new CooldownGuard(4_000);
export const generationDeduper = new RequestDeduper();

export function getSessionRateLimitKey(prefix: string): string {
  const storageKey = 'ppp_mockup_session_id';

  let sessionId = sessionStorage.getItem(storageKey);
  if (!sessionId) {
    sessionId =
      globalThis.crypto?.randomUUID?.() ??
      `${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;

    sessionStorage.setItem(storageKey, sessionId);
  }

  return `${prefix}:${sessionId}`;
}
