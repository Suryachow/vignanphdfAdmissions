/**
 * Record student phase (registration / login / payment / application) to backend
 * for audit and future analytics.
 */

import { apiUrl } from "../lib/api"

export type PhaseName = "registration" | "login" | "payment" | "application"

export async function recordPhase(phase: PhaseName, email?: string, phone?: string): Promise<void> {
    const e = email?.trim()
    const p = phone?.trim() ? String(phone).replace(/\D/g, "").slice(-10) : undefined
    if (!e && !p) return
    try {
        await fetch(apiUrl("/api/student/phase"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: e || undefined, phone: p || undefined, phase }),
        })
    } catch {
        // Non-blocking; phase recording is best-effort
    }
}
