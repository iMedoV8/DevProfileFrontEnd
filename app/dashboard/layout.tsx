"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useDevProfileStore } from "@/lib/store/devprofile-store"
import { Sidebar } from "@/components/dashboard/sidebar"
import { WorkflowStep } from "@/lib/types/devprofile-types"

/**
 * Helper to determine if a user has sufficient workflow permissions to view a specific route.
 */
function isRouteAllowed(pathname: string, workflowStep: WorkflowStep): boolean {
    // Always allowed
    if (
        pathname === "/dashboard" ||
        pathname === "/dashboard/github" ||
        pathname === "/dashboard/resume" ||
        pathname === "/dashboard/settings"
    ) {
        return true
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
    const { user, workflowStep } = useDevProfileStore()

    // Handle Next.js hydration mismatch for Zustand persist
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        // Only run auth and workflow checks after the client has safely mounted the persisted store
        if (!isMounted) return

        // Force viewport reset on route change
        window.scrollTo({ top: 0, behavior: "auto" });

        // Auth Guard
        if (!user.isAuthenticated) {
            router.push("/?auth=required")
            return
        }

        // Workflow Guard
        if (!isRouteAllowed(pathname, workflowStep)) {
            // If they try to skip ahead, redirect them based on their current step to guide them smoothly
            switch (workflowStep) {
                case "START":
                case "GITHUB_CONNECTED":
                    router.push("/dashboard/resume")
                    break
                case "RESUME_UPLOADED":
                    router.push("/dashboard/analysis")
                    break
                case "ANALYSIS_READY":
                    router.push("/dashboard/report")
                    break
            }
        }
    }, [user.isAuthenticated, workflowStep, pathname, router, isMounted])

    // Mount the DashboardThemeProvider wrapper synchronously to inject the pre-hydration FOUC script.
    // We conditionally fade the inner structure using opacity-0 to avert layout shifts and auth-flashing.
    const isReady = isMounted && user.isAuthenticated

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
