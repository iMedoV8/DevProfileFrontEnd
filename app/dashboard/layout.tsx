"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useDevProfileStore } from "@/lib/store/devprofile-store"
import { Sidebar } from "@/components/dashboard/sidebar"
import { WorkflowStep } from "@/lib/types/devprofile-types"

/**
 * Helper to determine if a user has sufficient workflow permissions to view a specific route.
 */
function isRouteAllowed(pathname: string, workflowStep: WorkflowStep, hasSession: boolean): boolean {
    // Always allowed
    if (
        pathname === "/dashboard" ||
        pathname === "/dashboard/settings" ||
        pathname === "/dashboard/profile"
    ) {
        return true
    }

    // GitHub, Resume always allowed if a session is active
    if (
        pathname === "/dashboard/github" ||
        pathname === "/dashboard/resume"
    ) {
        return hasSession
    }

    // Analysis requires resume to be uploaded at a minimum
    if (pathname === "/dashboard/analysis") {
        return (
            workflowStep === "RESUME_UPLOADED" ||
            workflowStep === "ANALYSIS_READY" ||
            workflowStep === "REPORT_AVAILABLE"
        )
    }

    // Reports and Roadmap require the analysis to be fully processed
    if (pathname === "/dashboard/report" || pathname === "/dashboard/roadmap") {
        return workflowStep === "REPORT_AVAILABLE"
    }

    return true
}

import { Navbar } from "@/components/navbar"
import { DashboardThemeProvider } from "@/components/providers/dashboard-theme-provider"
import { cn } from "@/lib/utils"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const { user, workflowStep, currentSessionId } = useDevProfileStore()

    // Handle Next.js hydration mismatch for Zustand persist
    const [isMounted, setIsMounted] = useState(false)
    const [storeRehydrated, setStoreRehydrated] = useState(false)
    const [authChecked, setAuthChecked] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    // Ask the backend "who am I?" using the httpOnly auth cookie. This is the
    // only way the frontend can know if there's a live session — the JWT lives
    // in a cookie we can't read from JS. Runs once on mount.
    useEffect(() => {
        if (!isMounted) return
        let cancelled = false
        useDevProfileStore.getState().bootstrapAuth()
            .finally(() => {
                if (!cancelled) setAuthChecked(true)
            })
        return () => { cancelled = true }
    }, [isMounted])

    // Cross-tab logout: when another tab logs out (writes "logout-event"),
    // bounce this tab to the landing page too.
    useEffect(() => {
        if (typeof window === "undefined") return
        const onStorage = (e: StorageEvent) => {
            if (e.key === "logout-event") {
                window.location.href = "/?auth=required"
            }
        }
        window.addEventListener("storage", onStorage)
        return () => window.removeEventListener("storage", onStorage)
    }, [])

    // Re-sync the persisted Zustand store with the server every time the active
    // session changes (and on first mount). Without this, the local state can
    // drift out of sync with the backend — e.g. a resume uploaded in another
    // tab, a session updated after a redeploy, or stale flags from an earlier
    // workflow step.
    //
    // Important: we read `selectSession` off the store imperatively via getState()
    // rather than destructuring it from the hook above. Zustand returns a new
    // function reference on every store update; if that reference were in the
    // deps array, this effect would re-fire on every rehydration and trigger an
    // infinite loop that cancels animations and floods the API.
    useEffect(() => {
        if (!isMounted) return
        if (!authChecked) return
        if (!user.isAuthenticated) return
        if (!currentSessionId) {
            setStoreRehydrated(true)
            return
        }
        let cancelled = false
        setStoreRehydrated(false)
        useDevProfileStore.getState().selectSession(currentSessionId)
            .catch(() => {
                // Backend unreachable / session no longer exists — fall through to
                // the workflow guard which will redirect to /dashboard.
            })
            .finally(() => {
                if (!cancelled) setStoreRehydrated(true)
            })
        return () => { cancelled = true }
    }, [isMounted, authChecked, user.isAuthenticated, currentSessionId])

    useEffect(() => {
        // Only run auth and workflow checks after the auth probe AND the store
        // rehydration have both finished.
        if (!isMounted) return
        if (!authChecked) return
        if (!storeRehydrated) return

        // Force viewport reset on route change
        window.scrollTo({ top: 0, behavior: "auto" });

        // Auth Guard
        if (!user.isAuthenticated) {
            router.push("/?auth=required")
            return
        }

        // Workflow Guard
        if (!isRouteAllowed(pathname, workflowStep, !!currentSessionId)) {
            if (!currentSessionId) {
                router.push("/dashboard")
            } else {
                switch (workflowStep) {
                    case "START":
                    case "GITHUB_CONNECTED":
                        router.push("/dashboard/resume")
                        break
                    case "RESUME_UPLOADED":
                        router.push("/dashboard/analysis")
                        break
                    case "ANALYSIS_READY":
                        router.push("/dashboard/analysis")
                        break
                }
            }
        }
    }, [user.isAuthenticated, workflowStep, pathname, router, isMounted, authChecked, storeRehydrated, currentSessionId])

    // Mount the DashboardThemeProvider wrapper synchronously to inject the pre-hydration FOUC script.
    // We conditionally fade the inner structure using opacity-0 to avert layout shifts and auth-flashing.
    const isReady = isMounted && authChecked && user.isAuthenticated

    return (
        <DashboardThemeProvider>
            <div className={cn("min-h-screen bg-background transition-opacity duration-500", isReady ? "opacity-100" : "opacity-0 invisible")}>
                {isReady && (
                    <>
                        <Navbar />
                        <div className="flex pt-[72px]">
                            <Sidebar />
                            <main className="flex-1 overflow-x-hidden p-6 md:p-10">
                                <div className="mx-auto max-w-5xl">
                                    {children}
                                </div>
                            </main>
                        </div>
                    </>
                )}
            </div>
        </DashboardThemeProvider>
    )
}
