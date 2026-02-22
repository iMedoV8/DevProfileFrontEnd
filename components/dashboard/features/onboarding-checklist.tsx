"use client"

import Link from "next/link"
import { useDevProfileStore } from "@/lib/store/devprofile-store"
import { CheckCircle2, Circle, ArrowRight } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export function OnboardingChecklist() {
    const { workflowStep } = useDevProfileStore()

    const steps = [
        {
            id: "GITHUB_CONNECTED",
            title: "Connect GitHub",
            description: "Link your repositories for code evaluation.",
            href: "/dashboard/github",
            isCompleted:
                workflowStep === "GITHUB_CONNECTED" ||
                workflowStep === "RESUME_UPLOADED" ||
                workflowStep === "ANALYSIS_READY" ||
                workflowStep === "REPORT_AVAILABLE",
        },
        {
            id: "RESUME_UPLOADED",
            title: "Upload Resume",
            description: "Provide your CV for ATS structure parsing.",
            href: "/dashboard/resume",
            isCompleted:
                workflowStep === "RESUME_UPLOADED" ||
                workflowStep === "ANALYSIS_READY" ||
                workflowStep === "REPORT_AVAILABLE",
        },
        {
            id: "ANALYSIS_READY",
            title: "Run Analysis",
            description: "Let our AI process your profile.",
            href: "/dashboard/analysis",
            isCompleted:
                workflowStep === "ANALYSIS_READY" || workflowStep === "REPORT_AVAILABLE",
        },
        {
            id: "REPORT_AVAILABLE",
            title: "View Report",
            description: "Unlock your hireability score and roadmap.",
            href: "/dashboard/report",
            isCompleted: workflowStep === "REPORT_AVAILABLE",
        },
    ]

    const completedCount = steps.filter((s) => s.isCompleted).length
    const progressPercentage = (completedCount / steps.length) * 100

    // Hide the onboarding checklist entirely if completed
    if (completedCount === steps.length) return null

    return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-xl font-semibold tracking-tight">Onboarding Checklist</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Complete these steps to unlock your personalized developer report.
                    </p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                    <span className="text-sm font-bold text-primary">{Math.round(progressPercentage)}%</span>
                    <Progress value={progressPercentage} className="h-2 w-32" />
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                {steps.map((step, index) => {
                    const isNextAction = !step.isCompleted && (index === 0 || steps[index - 1].isCompleted)

                    return (
                        <Link
                            key={step.id}
                            href={step.href}
                            className={cn(
                                "group relative flex items-start gap-4 rounded-xl border p-4 transition-all duration-200",
                                step.isCompleted
                                    ? "border-border bg-accent/20"
                                    : isNextAction
                                        ? "border-primary/50 bg-primary/5 shadow-sm hover:border-primary"
                                        : "border-border bg-background hover:border-border/80"
                            )}
                        >
                            <div className="mt-0.5 shrink-0">
                                {step.isCompleted ? (
                                    <CheckCircle2 className="size-5 text-primary" />
                                ) : (
                                    <Circle
                                        className={cn(
                                            "size-5",
                                            isNextAction ? "text-primary/70" : "text-muted-foreground/30"
                                        )}
                                    />
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span
                                    className={cn(
                                        "text-sm font-medium",
                                        step.isCompleted ? "text-foreground line-through opacity-70" : "text-foreground"
                                    )}
                                >
                                    {step.title}
                                </span>
                                <span className="mt-1 text-xs text-muted-foreground">{step.description}</span>
                            </div>
                            {isNextAction && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100">
                                    <ArrowRight className="size-4 text-primary" />
                                </div>
                            )}
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
