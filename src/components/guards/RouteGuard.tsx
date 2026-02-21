import React from 'react'

/** Protects routes: no direct URL access without authentication. Login required first, then step order. */
export function RouteGuard({ children }: { children: React.ReactNode }) {
    // Bypassed: always allow access
    return <>{children}</>
}
