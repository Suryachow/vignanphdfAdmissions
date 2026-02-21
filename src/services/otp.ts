import { apiUrl } from "../lib/api"

/** Demo OTP for testing when SMS/email not configured. Kept for reference; backend accepts it only if testing block is uncommented. */
const DEMO_CODE = "123456"

export type OtpChannel = "email" | "phone"

/**
 * Send OTP via current FastAPI backend only (no Django).
 * Backend: Jio SMS for phone, SMTP for email; storage in backend DB.
 */
export async function sendOtp(channel: OtpChannel, value: string): Promise<{ success: boolean; message?: string }> {
    const trimmed = String(value).trim()
    if (channel === "email") {
        if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return { success: false, message: "Valid email required" }
    } else {
        const digits = trimmed.replace(/\D/g, "").slice(-10)
        if (digits.length !== 10) return { success: false, message: "Valid 10-digit phone required" }
    }
    try {
        const res = await fetch(apiUrl("/api/otp/send"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: channel, ...(channel === "email" ? { email: trimmed } : { phone: trimmed }) }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) return { success: false, message: (data?.detail ?? "Failed to send OTP") as string }
        return { success: true, message: data?.message }
    } catch {
        return { success: false, message: "Network error" }
    }
    // ---------- TESTING: To skip API and use demo OTP locally, set VITE_USE_REAL_OTP=false and uncomment below ----------
    // if (channel === "phone" && typeof import.meta !== "undefined" && import.meta.env?.VITE_USE_REAL_OTP !== "true") {
    //     return { success: true, message: "Demo: use " + DEMO_CODE }
    // }
}
/**
 * Verify OTP via current FastAPI backend only (checks backend DB; no Django).
 */
export async function verifyOtp(channel: OtpChannel, value: string, code: string): Promise<{ success: boolean; message?: string }> {
    const trimmedCode = String(code).trim().replace(/\D/g, "").slice(0, 6)
    if (!trimmedCode) return { success: false, message: "Enter OTP" }
    try {
        const res = await fetch(apiUrl("/api/otp/verify"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: channel, code: trimmedCode, ...(channel === "email" ? { email: value } : { phone: value }) }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) return { success: false, message: (data?.detail ?? "Invalid OTP") as string }
        return { success: true }
    } catch {
        return { success: false, message: "Network error" }
    }
}

export { DEMO_CODE }
