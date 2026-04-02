"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useDevProfileStore } from "@/lib/store/devprofile-store"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Github,
    FileText,
    Activity,
    PieChart,
    Map,
    Settings,
    Lock,
    CheckCircle2,
    Swords,
} from "lucide-react"

export function Sidebar() {
    const pathname = usePathname()
    const { workflowStep } = useDevProfileStore()

    // Helper to determine the "completed" and "locked" states of each step based on the strict machine
    const isGithubCompleted =
        workflowStep === "GITHUB_CONNECTED" ||
        workflowStep === "RESUME_UPLOADED" ||
        workflowStep === "ANALYSIS_READY" ||
        workflowStep === "REPORT_AVAILABLE"

    const isResumeCompleted =
        workflowStep === "RESUME_UPLOADED" ||
        workflowStep === "ANALYSIS_READY" ||
        workflowStep === "REPORT_AVAILABLE"

    const isAnalysisUnlocked = isResumeCompleted
    const isAnalysisCompleted =
        workflowStep === "ANALYSIS_READY" || workflowStep === "REPORT_AVAILABLE"

    const isReportUnlocked = workflowStep === "REPORT_AVAILABLE"
    const isReportCompleted = workflowStep === "REPORT_AVAILABLE" // Max step for now

    // Define the navigation hierarchy with dynamic states
    const navItems = [
        {
            title: "Overview",
            href: "/dashboard",
            icon: LayoutDashboard,
            isLocked: false,
            isCompleted: false, // Overview isn't a checklist item
        },
        {
            title: "Connect GitHub",
            href: "/dashboard/github",
            icon: Github,
            isLocked: false,
            isCompleted: isGithubCompleted,
        },
        {
            title: "Upload Resume",
            href: "/dashboard/resume",
            icon: FileText,
            isLocked: false,
            isCompleted: isResumeCompleted,
        },
        {
            title: "Analysis",
            href: "/dashboard/analysis",
            icon: Activity,
            isLocked: !isAnalysisUnlocked,
            isCompleted: isAnalysisCompleted,
        },
        {
            title: "Report",
            href: "/dashboard/report",
            icon: PieChart,
            isLocked: !isReportUnlocked,
            isCompleted: isReportCompleted,
        },
        {
            title: "Roadmap",
            href: "/dashboard/roadmap",
            icon: Map,
            isLocked: !isReportUnlocked,
            isCompleted: isReportCompleted,
        },
        {
            title: "Dev Profile",
            href: "/dashboard/profile",
            icon: Swords,
            isLocked: false,
            isCompleted: false,
        },
        {
            title: "Settings",
            href: "/dashboard/settings",
            icon: Settings,
            isLocked: false,
            isCompleted: false,
        },
    ]

    return (
        <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-background/50 backdrop-blur-xl md:flex">
            <div className="flex h-full flex-col gap-2 p-4">
                <div className="mb-4 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Workspace
                </div>

                <nav className="flex flex-1 flex-col gap-1.5">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href

                        if (item.isLocked) {
                            return (
                                <div
                                    key={item.href}
                                    className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground/50 cursor-not-allowed bg-transparent"
                                    title="Complete Previous Steps to Unlock"
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className="size-4 opacity-50" />
                                        {item.title}
                                    </div>
                                    <Lock className="size-3.5 opacity-40" />
                                </div>
                            )
                        }

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 outline-none",
                                    isActive
                                        ? "bg-accent text-foreground shadow-sm"
                                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon
                                        className={cn(
                                            "size-4 transition-colors",
                                            isActive
                                                ? "text-foreground"
                                                : "text-muted-foreground group-hover:text-foreground"
                                        )}
                                    />
                                    {item.title}
                                </div>
                                {item.isCompleted && !isActive && (
                                    <CheckCircle2 className="size-4 text-green-500/70" />
                                )}
                                {item.isCompleted && isActive && (
                                    <CheckCircle2 className="size-4 text-green-500" />
                                )}
                            </Link>
                        )
                    })}
                </nav>

                <div className="mt-auto px-4 pb-4 pt-8">
                    <p className="rounded-xl border border-border/50 bg-accent/30 p-3 text-center text-xs text-muted-foreground leading-relaxed">
                        Your data is securely stored on the server.
                    </p>
                </div>
            </div>
        </aside>
    )
}
