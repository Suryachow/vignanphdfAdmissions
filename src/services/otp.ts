import { apiUrl } from "../lib/api"

/** Demo OTP for testing when email not configured. Kept for reference; backend accepts it only if testing block is uncommented. */
const DEMO_CODE = "123456"

export type OtpChannel = "email"

/**
 * Send OTP via current FastAPI backend only.
 * Backend: SMTP for email; storage in backend DB.
 */
export async function sendOtp(channel: OtpChannel, value: string): Promise<{ success: boolean; message?: string }> {
    const trimmed = String(value).trim()
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        return { success: false, message: "Valid email required" }
    }

    try {
        const res = await fetch(apiUrl("/api/otp/send"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: channel, email: trimmed }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) return { success: false, message: (data?.detail ?? "Failed to send OTP") as string }
        return { success: true, message: data?.message }
    } catch {
        return { success: false, message: "Network error" }
    }
}

/**
 * Verify OTP via current FastAPI backend only.
 */
export async function verifyOtp(channel: OtpChannel, value: string, code: string): Promise<{ success: boolean; message?: string }> {
    const trimmedCode = String(code).trim().replace(/\D/g, "").slice(0, 6)
    if (!trimmedCode) return { success: false, message: "Enter OTP" }

    try {
        const res = await fetch(apiUrl("/api/otp/verify"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: channel, code: trimmedCode, email: value }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) return { success: false, message: (data?.detail ?? "Invalid OTP") as string }
        return { success: true }
    } catch {
        return { success: false, message: "Network error" }
    }
}

export { DEMO_CODE }
