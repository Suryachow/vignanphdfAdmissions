/**
 * Admin Portal – API client utilities
 */

export const API_BASE: string =
    typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL
        ? import.meta.env.VITE_API_URL.replace(/\/$/, "")
        : "http://localhost:8000";

/** Construct a full API URL from a path (ensures no double slashes). */
export function adminApiUrl(path: string): string {
    const p = path.startsWith("/") ? path : `/${path}`;
    return `${API_BASE}${p}`;
}
