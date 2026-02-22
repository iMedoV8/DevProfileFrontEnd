"use client"

import { useEffect, useState } from "react"
import { useDevProfileStore } from "@/lib/store/devprofile-store"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Activity, Play, CheckCircle2, ArrowRight, Server, FileCode2, Cpu, FileSpreadsheet } from "lucide-react"
import Link from "next/link"

const MESSAGES = [
    "Fetching repository metadata from GitHub...",
    "Cloning and analyzing code structure...",
    "Running cyclical complexity metrics...",
    "Parsing commit history and frequency...",
    "Evaluating Structural ATS Resume formatting...",
    "Aggregating scores against hiring benchmarks...",
    "Generating final feedback and recommendations...",
]

export default function AnalysisPage() {
    const { analysis, startAnalysis, completeAnalysis } = useDevProfileStore()
    const [progress, setProgress] = useState(0)
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0)

    // Persistent Time-Based Progress Simulator
    useEffect(() => {
        if (analysis.status === "processing" && analysis.analysisStartedAt) {
            const duration = analysis.analysisDuration || 15000 // 15 seconds

            const animateProgress = () => {
                const elapsed = Date.now() - analysis.analysisStartedAt!
                const newProgress = Math.min((elapsed / duration) * 100, 100)
                setProgress(newProgress)

                // Maps progress [0, 100] to the index of our rotating messages
                const msgIndex = Math.min(
                    Math.floor((newProgress / 100) * MESSAGES.length),
                    MESSAGES.length - 1
                )
                setCurrentMessageIndex(msgIndex)

                if (newProgress < 100) {
                    requestAnimationFrame(animateProgress)
                } else if (newProgress >= 100 && analysis.status === "processing") {
                    // Once 100% is hit locally, fire the store action to complete the analysis via API
                    completeAnalysis()
                }
            }

            requestAnimationFrame(animateProgress)
        }
    }, [analysis.status, analysis.analysisStartedAt, analysis.analysisDuration, completeAnalysis])


    // --- EMPTY / IDLE STATE ---
    if (analysis.status === "idle") {
        return (
            <div className="flex flex-col gap-6 max-w-2xl mx-auto mt-10">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Run Complete Analysis</h1>
                    <p className="mt-2 text-muted-foreground">
                        We have gathered your raw GitHub and Resume data. You are ready to launch the evaluator.
                    </p>
                </div>

                <div className="flex flex-col items-center justify-center rounded-2xl border border-border py-20 text-center bg-card shadow-sm">
                    <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Activity className="size-8" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold tracking-tight">Launch the Evaluator</h3>
                    <p className="mb-8 max-w-md text-sm text-muted-foreground">
                        This will take approximately 12–18 seconds to fully process across our mock evaluation servers. You may navigate away while this runs.
                    </p>
                    <Button
                        onClick={() => startAnalysis()}
                        size="lg"
                        className="flex h-12 items-center gap-2 rounded-full px-8 shadow-md transition-all hover:scale-105 active:scale-95"
                    >
                        <Play className="size-4 fill-current" />
                        <span className="font-semibold text-md">Run Analysis Now</span>
                    </Button>
                </div>
            </div>
        )
    }

    // --- PROCESSING STATE (Persistent) ---
    if (analysis.status === "processing") {
        return (
            <div className="flex flex-col gap-6 max-w-2xl mx-auto mt-10">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Analyzing Profile</h1>
                    <p className="mt-2 text-muted-foreground">
                        Evaluating your metrics across the DevProfile cloud...
                    </p>
                </div>

                <div className="flex flex-col items-center justify-center rounded-2xl border border-border py-16 px-6 text-center bg-card shadow-sm mt-4">
                    {/* Decorative spinning elements */}
                    <div className="relative flex items-center justify-center mb-10">
                        <div className="absolute size-32 animate-[spin_4s_linear_infinite] rounded-full border border-dashed border-primary/40" />
                        <div className="absolute size-24 animate-[spin_3s_linear_infinite_reverse] rounded-full border border-dashed border-primary/60" />
                        <div className="flex size-16 items-center justify-center rounded-full bg-primary/20 text-primary border border-primary/50 relative">
                            <Cpu className="size-6 animate-pulse" />
                        </div>
                    </div>

                    <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">
                        {Math.floor(progress)}% Complete
                    </h2>

                    <Progress value={progress} className="h-3 w-full max-w-sm mb-6" />

                    <div className="flex items-center justify-center gap-3">
                        <div className="size-2 rounded-full bg-primary animate-ping" />
                        <p className="text-sm font-medium text-muted-foreground w-64 text-left">
                            {MESSAGES[currentMessageIndex]}
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    // --- COMPLETED STATE ---
    return (
        <div className="flex flex-col gap-8 max-w-2xl mx-auto mt-10">
            <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-green-500/20 text-green-500 shadow-sm border border-green-500/20">
                    <CheckCircle2 className="size-10" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Analysis Complete</h1>
                <p className="mt-4 text-muted-foreground text-lg">
                    Your tailored developer hireability report has been successfully generated.
                </p>
            </div>

            <div className="mt-6">
                <Link
                    href="/dashboard/report"
                    className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 text-lg font-semibold text-primary-foreground shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl active:scale-95"
                >
                    View Full Report
                    <ArrowRight className="size-5" />
                </Link>
            </div>
        </div>
    )
}
