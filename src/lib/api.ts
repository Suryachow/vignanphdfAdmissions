/**
 * Vignan Admissions – API client utilities
 * ─────────────────────────────────────────
 * Centralises base URL config, request helpers, retry logic, and timeout.
 * Set VITE_API_URL in .env.production for AWS deployment.
 */

// ─── Base URL (Hardcoded for production stability) ────────────────────────
export const API_BASE =
  typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace(/\/$/, "")
    : "http://13.204.96.58:8000";

/** Construct a full API URL from a path (ensures no double slashes). */
export function apiUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${p}`;
}

// ─── Fetch helpers ────────────────────────────────────────────────────────

/** Default request timeout in milliseconds. */
const DEFAULT_TIMEOUT_MS = 20_000; // 20 seconds (safe for file uploads too)

/**
 * Fetch with automatic timeout using AbortController.
 * Throws a typed error on timeout or network failure.
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } catch (err) {
    if ((err as Error).name === "AbortError") {
      throw new Error("Request timed out. Please check your connection and try again.");
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Fetch with retry on transient failures (network errors, 5xx).
 *
 * @param url      - Full URL to fetch
 * @param options  - Standard RequestInit options
 * @param retries  - Number of retry attempts (default 2)
 * @param delay    - Base delay between retries in ms (exponential backoff)
 */
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 2,
  delay = 800,
): Promise<Response> {
  let lastError: Error | null = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetchWithTimeout(url, options);
      // Retry on server errors (5xx) but not client errors (4xx)
      if (res.status >= 500 && attempt < retries) {
        await sleep(delay * Math.pow(2, attempt));
        continue;
      }
      return res;
    } catch (err) {
      lastError = err as Error;
      if (attempt < retries) {
        await sleep(delay * Math.pow(2, attempt));
      }
    }
  }
  throw lastError ?? new Error("Request failed after retries");
}

// ─── Utility ──────────────────────────────────────────────────────────────
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
