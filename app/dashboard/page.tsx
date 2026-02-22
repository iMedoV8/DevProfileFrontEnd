"use client"

import { useDevProfileStore } from "@/lib/store/devprofile-store"
import { formatDistanceToNow } from "date-fns"
import { OnboardingChecklist } from "@/components/dashboard/features/onboarding-checklist"
import { ProfileCard } from "@/components/dashboard/widgets/profile-card"
import { ScoreWidget } from "@/components/dashboard/widgets/score-widget"
import { Button } from "@/components/ui/button"
import { Github, FileText, Activity, Target } from "lucide-react"
import Link from "next/link"

export default function DashboardOverviewPage() {
    const { user, workflowStep, analysis } = useDevProfileStore()

    // For greeting randomly based on time of day
    const hour = new Date().getHours()
    const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"

    return (
        <div className="flex flex-col gap-8 pb-10">
            <div className="flex flex-col gap-2 relative">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            {greeting}, {user.name ? user.name.split(" ")[0] : "Developer"}!
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Welcome to your DevProfile workspace. Start your evaluation below.
                        </p>
                    </div>
                    {analysis.lastAnalyzedAt && (
                        <div className="flex items-center gap-2 rounded-full bg-secondary/50 px-3 py-1.5 text-xs font-semibold text-muted-foreground border border-border">
                            <Activity className="size-3.5" />
                            Last analyzed {formatDistanceToNow(analysis.lastAnalyzedAt, { addSuffix: true })}
                        </div>
                    )}
                </div>
            </div>

            {user.isAuthenticated && workflowStep === "START" && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-6 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                            <Target className="size-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold tracking-tight text-foreground">Welcome to DevProfile!</h3>
                            <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                                We're excited to help you optimize your developer identity. Follow the onboarding checklist below to begin your first evaluation.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <OnboardingChecklist />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <ProfileCard />
                </div>
                <div className="h-full">
                    <ScoreWidget />
                </div>
            </div>

            <div className="mt-4 flex flex-col gap-4">
                <h2 className="text-lg font-semibold tracking-tight">Quick Actions</h2>
                <div className="grid gap-4 sm:grid-cols-3">
                    <Link href="/dashboard/github" className="outline-none">
                        <Button
                            variant="outline"
                            className="flex h-12 w-full items-center justify-start gap-3 rounded-xl border-border bg-card px-4 font-medium hover:bg-accent"
                        >
                            <Github className="size-4.5 text-foreground" />
                            Manage GitHub Connection
                        </Button>
                    </Link>
                    <Link href="/dashboard/resume" className="outline-none">
                        <Button
                            variant="outline"
                            className="flex h-12 w-full items-center justify-start gap-3 rounded-xl border-border bg-card px-4 font-medium hover:bg-accent"
                        >
                            <FileText className="size-4.5 text-foreground" />
                            Update Resume
                        </Button>
                    </Link>
                    <Link href="/dashboard/analysis" className="outline-none">
                        <Button
                            variant="outline"
                            className="flex h-12 w-full items-center justify-start gap-3 rounded-xl border-border bg-card px-4 font-medium hover:bg-accent"
                        >
                            <Activity className="size-4.5 text-foreground" />
                            Launch Analysis
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
