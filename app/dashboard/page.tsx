"use client"

import { useEffect, useState } from "react"
import { useDevProfileStore } from "@/lib/store/devprofile-store"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"
import { OnboardingChecklist } from "@/components/dashboard/features/onboarding-checklist"
import { ProfileCard } from "@/components/dashboard/widgets/profile-card"
import { ScoreWidget } from "@/components/dashboard/widgets/score-widget"
import { Button } from "@/components/ui/button"
import { Github, FileText, Activity, Target, Plus, Clock, CheckCircle2, AlertTriangle, Loader2, Archive } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function DashboardOverviewPage() {
    const { user, workflowStep, analysis, sessions, currentSessionId, loadSessions, selectSession, createNewSession } = useDevProfileStore()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [isSelecting, setIsSelecting] = useState<number | null>(null)

    const hour = new Date().getHours()
    const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"

    useEffect(() => {
        if (user.isAuthenticated) {
            setIsLoading(true)
            loadSessions().finally(() => setIsLoading(false))
        }
    }, [user.isAuthenticated, loadSessions])

    const handleCreateSession = async () => {
        setIsCreating(true)
        try {
            await createNewSession()
            toast({ title: "New Analysis Created", description: "You can now connect your GitHub and upload your resume." })
        } catch (err: any) {
            toast({ variant: "destructive", title: "Error", description: err?.message || "Failed to create session." })
        } finally {
            setIsCreating(false)
        }
    }

    const handleSelectSession = async (sessionId: number) => {
        setIsSelecting(sessionId)
        try {
            await selectSession(sessionId)
        } catch (err: any) {
            toast({ variant: "destructive", title: "Error", description: err?.message || "Failed to load session." })
        } finally {
            setIsSelecting(null)
        }
    }

    const statusConfig = {
        CREATED: { label: "Created", icon: Clock, color: "text-muted-foreground", bg: "bg-muted" },
        IN_PROGRESS: { label: "In Progress", icon: Activity, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10" },
        COMPLETED: { label: "Completed", icon: CheckCircle2, color: "text-green-600 dark:text-green-400", bg: "bg-green-500/10" },
        FAILED: { label: "Failed", icon: AlertTriangle, color: "text-red-600 dark:text-red-400", bg: "bg-red-500/10" },
    }

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
                </div>
            </div>

            {/* Show onboarding + workflow widgets only when a session is selected */}
            {currentSessionId && (
                <>
                    {workflowStep === "START" && (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-6 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                                    <Target className="size-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold tracking-tight text-foreground">Session Active</h3>
                                    <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                                        Follow the onboarding checklist below to complete your evaluation.
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
                                <Button variant="outline" className="flex h-12 w-full items-center justify-start gap-3 rounded-xl border-border bg-card px-4 font-medium hover:bg-accent">
                                    <Github className="size-4.5 text-foreground" />
                                    Manage GitHub Connection
                                </Button>
                            </Link>
                            <Link href="/dashboard/resume" className="outline-none">
                                <Button variant="outline" className="flex h-12 w-full items-center justify-start gap-3 rounded-xl border-border bg-card px-4 font-medium hover:bg-accent">
                                    <FileText className="size-4.5 text-foreground" />
                                    Update Resume
                                </Button>
                            </Link>
                            <Link href="/dashboard/analysis" className="outline-none">
                                <Button variant="outline" className="flex h-12 w-full items-center justify-start gap-3 rounded-xl border-border bg-card px-4 font-medium hover:bg-accent">
                                    <Activity className="size-4.5 text-foreground" />
                                    Launch Analysis
                                </Button>
                            </Link>
                        </div>
                    </div>
                </>
            )}

            {/* Session List */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold tracking-tight">Your Analysis Sessions</h2>
                    <Button
                        onClick={handleCreateSession}
                        disabled={isCreating}
                        className="flex items-center gap-2 rounded-xl h-10 px-5 shadow-sm"
                    >
                        {isCreating ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                        New Analysis
                    </Button>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12 rounded-2xl border border-border bg-card">
                        <Loader2 className="size-6 animate-spin text-muted-foreground" />
                    </div>
                ) : sessions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center bg-card shadow-sm">
                        <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-secondary/50 text-foreground">
                            <Activity className="size-8 opacity-50" />
                        </div>
                        <h3 className="mb-2 text-lg font-semibold tracking-tight">No analysis sessions yet</h3>
                        <p className="mb-6 max-w-md text-sm text-muted-foreground">
                            Create your first analysis session to start evaluating your developer profile.
                        </p>
                        <Button
                            onClick={handleCreateSession}
                            disabled={isCreating}
                            className="flex items-center gap-2 rounded-xl h-11 px-8 shadow-sm"
                        >
                            {isCreating ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                            Create First Session
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {sessions.map((session) => {
                            const config = statusConfig[session.status]
                            const StatusIcon = config.icon
                            const isSelected = session.id === currentSessionId
                            const isLoadingThis = isSelecting === session.id

                            return (
                                <button
                                    key={session.id}
                                    onClick={() => handleSelectSession(session.id)}
                                    disabled={isLoadingThis}
                                    className={cn(
                                        "flex items-center justify-between rounded-xl border p-4 text-left transition-all hover:border-primary/40",
                                        isSelected
                                            ? "border-primary bg-primary/5 shadow-sm"
                                            : "border-border bg-card hover:bg-accent/30"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        {isLoadingThis ? (
                                            <Loader2 className="size-5 animate-spin text-muted-foreground" />
                                        ) : (
                                            <StatusIcon className={cn("size-5", config.color)} />
                                        )}
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-sm font-semibold text-foreground">
                                                Session #{session.id}
                                                {isSelected && (
                                                    <span className="ml-2 text-xs font-medium text-primary">(Active)</span>
                                                )}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                Created {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {session.hireabilityScore !== null && (
                                            <span className="text-lg font-bold text-foreground">{session.hireabilityScore}/100</span>
                                        )}
                                        <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", config.bg, config.color)}>
                                            {config.label}
                                        </span>
                                        {session.archived && (
                                            <Archive className="size-4 text-muted-foreground" />
                                        )}
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
