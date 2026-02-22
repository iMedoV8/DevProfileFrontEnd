"use client"

import { useDevProfileStore } from "@/lib/store/devprofile-store"
import { OnboardingChecklist } from "@/components/dashboard/features/onboarding-checklist"
import { ProfileCard } from "@/components/dashboard/widgets/profile-card"
import { ScoreWidget } from "@/components/dashboard/widgets/score-widget"
import { Button } from "@/components/ui/button"
import { Github, FileText, Activity } from "lucide-react"
import Link from "next/link"

export default function DashboardOverviewPage() {
    const { user } = useDevProfileStore()

    // For greeting randomly based on time of day
    const hour = new Date().getHours()
    const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"

    return (
        <div className="flex flex-col gap-8 pb-10">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    {greeting}, {user.name ? user.name.split(" ")[0] : "Developer"}!
                </h1>
                <p className="text-muted-foreground">
                    Welcome to your DevProfile workspace. Start your evaluation below.
                </p>
            </div>

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
