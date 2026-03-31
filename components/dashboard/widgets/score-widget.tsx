"use client"

import { useDevProfileStore } from "@/lib/store/devprofile-store"
import { Activity, ArrowRight, Lock } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function ScoreWidget() {
    const { analysis, workflowStep } = useDevProfileStore()

    const hasAnalysis = analysis.status === "completed" && analysis.hasRun
    const isAnalysisReady = workflowStep === "RESUME_UPLOADED" || workflowStep === "ANALYSIS_READY"

    // Circle Math
    const radius = 48
    const circumference = 2 * Math.PI * radius
    const offset = hasAnalysis ? circumference - (analysis.overallScore / 100) * circumference : circumference

    return (
        <div className="flex h-full flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold tracking-tight">Hireability Score</h3>
                <Activity className="size-4.5 text-muted-foreground" />
            </div>

            <div className="mt-6 flex flex-1 flex-col items-center justify-center">
                <div className="relative inline-flex items-center justify-center">
                    <svg width="120" height="120" className="-rotate-90 transform">
                        <circle
                            cx="60"
                            cy="60"
                            r={radius}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="8"
                            className="text-secondary"
                        />
                        {hasAnalysis && (
                            <circle
                                cx="60"
                                cy="60"
                                r={radius}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="8"
                                strokeLinecap="round"
                                className={cn(
                                    "transition-all duration-1000 ease-out",
                                    analysis.overallScore >= 80 ? "text-green-500" : analysis.overallScore >= 60 ? "text-yellow-500" : "text-red-500"
                                )}
                                strokeDasharray={circumference}
                                strokeDashoffset={offset}
                            />
                        )}
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                        {hasAnalysis ? (
                            <>
                                <span className="text-3xl font-bold tracking-tighter text-foreground">
                                    {analysis.overallScore}
                                </span>
                                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                                    / 100
                                </span>
                            </>
                        ) : (
                            <span className="text-xl font-bold text-muted-foreground/50">N/A</span>
                        )}
                    </div>
                </div>

                <div className="mt-4 text-center">
                    {hasAnalysis ? (
                        <p className="text-sm font-medium text-muted-foreground">
                            Based on {analysis.scoreBreakdown ? Object.keys(analysis.scoreBreakdown).length : 0} core metrics.
                        </p>
                    ) : (
                        <p className="text-sm font-medium text-muted-foreground">
                            Run an analysis to generate your score.
                        </p>
                    )}
                </div>
            </div>

            <div className="mt-6">
                {hasAnalysis ? (
                    <Link
                        href="/dashboard/report"
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent/80"
                    >
                        View Full Report
                        <ArrowRight className="size-4" />
                    </Link>
                ) : (
                    <Link
                        href="/dashboard/analysis"
                        className={cn(
                            "flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors",
                            isAnalysisReady
                                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                                : "bg-secondary text-muted-foreground pointer-events-none opacity-60"
                        )}
                    >
                        {isAnalysisReady ? (
                            "Run Analysis"
                        ) : (
                            <>
                                Locked
                                <Lock className="size-3.5" />
                            </>
                        )}
                    </Link>
                )}
            </div>
        </div>
    )
}
