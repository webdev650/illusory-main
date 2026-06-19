import { NextRequest } from "next/server";

interface RateLimitInfo {
  count: number;
  resetTime: number;
}

const tracker = new Map<string, RateLimitInfo>();

/**
 * Checks if a request from a specific IP is rate-limited.
 * Default limit: 5 requests per 1 minute window.
 */
export function isRateLimited(
  req: NextRequest, 
  limit: number = 5, 
  windowMs: number = 60 * 1000
): boolean {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || 
             req.headers.get("x-real-ip") || 
             "127.0.0.1";

  const now = Date.now();
  const info = tracker.get(ip);

  if (!info) {
    tracker.set(ip, {
      count: 1,
      resetTime: now + windowMs,
    });
    return false;
  }

  // If time window expired, reset count and time window
  if (now > info.resetTime) {
    info.count = 1;
    info.resetTime = now + windowMs;
    return false;
  }

  info.count += 1;
  return info.count > limit;
}
