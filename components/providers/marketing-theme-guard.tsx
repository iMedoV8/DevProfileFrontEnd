"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"

/**
 * Marketing Theme Guard
 * 
 * Enforces strong light mode on all marketing routes.
 * Operates independently of the Dashboard Theme Provider.
 * Strips any dashboard-persisted dark mode if a user navigates to the marketing layer.
 */
export function MarketingThemeGuard({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    useEffect(() => {
        // Only run on non-dashboard paths to enforce strict brand light appearance
        if (!pathname.startsWith("/dashboard")) {
            document.documentElement.classList.remove("dark")
            document.documentElement.classList.add("light")
            document.documentElement.style.colorScheme = "light"
        }
    }, [pathname])

    return <>{children}</>
}
