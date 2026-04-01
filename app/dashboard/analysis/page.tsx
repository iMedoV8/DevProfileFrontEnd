"use client"

import { useEffect, useState, useRef } from "react"
import { useDevProfileStore } from "@/lib/store/devprofile-store"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Activity, Play, CheckCircle2, ArrowRight, Cpu, AlertTriangle, Loader2 } from "lucide-react"
import Link from "next/link"

const MESSAGES = [
    "Fetching repository metadata from GitHub...",
    "Analyzing code structure and patterns...",
    "Running complexity metrics on repositories...",
    "Parsing commit history and frequency...",
    "Evaluating resume structure and content...",
    "Aggregating scores against hiring benchmarks...",
    "Generating personalized feedback...",
    "Building your improvement roadmap...",
    "Finalizing your hireability report...",
]

export default function AnalysisPage() {
    const { analysis, startAnalysis, createNewSession, currentSessionId } = useDevProfileStore()
    const router = useRouter()
    const { toast } = useToast()

    const handleStartAnalysis = async () => {
        if (!currentSessionId) {
            toast({ variant: "destructive", title: "Error", description: "No active session." })
            return
        }
        try {
            await startAnalysis()
        } catch (err: any) {
            toast({
                variant: "destructive",
                title: "Analysis Failed",
                description: err.message || "Failed to start analysis.",
            })
        }
    }

    // --- IDLE STATE ---
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
                        This will analyze your GitHub repositories and resume using AI. The process typically takes 1-2 minutes. You may navigate away while this runs.
                    </p>
                    <Button
                        onClick={handleStartAnalysis}
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

    // --- PROCESSING STATE (Smooth animated progress) ---
    if (analysis.status === "processing") {
        return <AnalysisProcessing targetPercent={analysis.progressPercent} />
    }

    // --- FAILED STATE ---
    if (analysis.status === "failed") {
        const handleRetryWithNewSession = async () => {
            try {
                await createNewSession("Retry - " + new Date().toLocaleDateString())
                toast({
                    title: "New Session Created",
                    description: "Please connect GitHub and upload your resume again, then re-run the analysis.",
                })
                router.push("/dashboard")
            } catch (err: any) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: err?.message || "Failed to create new session.",
                })
            }
        }

        return (
            <div className="flex flex-col gap-6 max-w-2xl mx-auto mt-10">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Analysis Failed</h1>
                    <p className="mt-2 text-muted-foreground">
                        Something went wrong during the evaluation.
                    </p>
                </div>

                <div className="flex flex-col items-center justify-center rounded-2xl border border-destructive/20 py-16 text-center bg-card shadow-sm">
                    <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                        <AlertTriangle className="size-8" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold tracking-tight text-destructive">Evaluation Error</h3>
                    <p className="mb-8 max-w-md text-sm text-muted-foreground">
                        {analysis.progressMessage || "The AI analysis encountered an error. Please start a new session to try again."}
                    </p>
                    <Button
                        onClick={handleRetryWithNewSession}
                        className="flex items-center gap-2 rounded-xl h-11 px-8 shadow-sm"
                    >
                        <Play className="size-4 fill-current" />
                        Start New Session
                    </Button>
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

// Separate component so hooks (useEffect/useState) run only during processing
function AnalysisProcessing({ targetPercent }: { targetPercent: number }) {
    const [displayPercent, setDisplayPercent] = useState(0)
    const [messageIndex, setMessageIndex] = useState(0)
    const targetRef = useRef(targetPercent)
    targetRef.current = targetPercent

    // Smooth progress animation — increments ~1% every 300ms toward the target,
    // and also drifts slowly upward between polls so it never feels stuck
    useEffect(() => {
        const interval = setInterval(() => {
            setDisplayPercent((prev) => {
                const target = targetRef.current
                // If target is ahead, move toward it smoothly
                if (prev < target) {
                    return Math.min(prev + 1.5, target)
                }
                // Between polls, drift slowly (max 95% before real completion)
                if (prev < 95) {
                    return prev + 0.3
                }
                return prev
            })
        }, 300)

        return () => clearInterval(interval)
    }, [])

    // Rotate messages based on displayed progress
    useEffect(() => {
        const idx = Math.min(
            Math.floor((displayPercent / 100) * MESSAGES.length),
            MESSAGES.length - 1
        )
        setMessageIndex(idx)
    }, [displayPercent])

    const rounded = Math.floor(displayPercent)

    return (
        <div className="flex flex-col gap-6 max-w-2xl mx-auto mt-10">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analyzing Profile</h1>
                <p className="mt-2 text-muted-foreground">
                    Evaluating your developer profile with AI...
                </p>
            </div>

            <div className="flex flex-col items-center justify-center rounded-2xl border border-border py-16 px-6 text-center bg-card shadow-sm mt-4">
                <div className="relative flex items-center justify-center mb-10">
                    <div className="absolute size-32 animate-[spin_4s_linear_infinite] rounded-full border border-dashed border-primary/40" />
                    <div className="absolute size-24 animate-[spin_3s_linear_infinite_reverse] rounded-full border border-dashed border-primary/60" />
                    <div className="flex size-16 items-center justify-center rounded-full bg-primary/20 text-primary border border-primary/50 relative">
                        <Cpu className="size-6 animate-pulse" />
                    </div>
                </div>

                <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">
                    {rounded}% Complete
                </h2>

                <Progress value={displayPercent} className="h-3 w-full max-w-sm mb-6" />

                <div className="flex items-center justify-center gap-3">
                    <div className="size-2 rounded-full bg-primary animate-ping" />
                    <p className="text-sm font-medium text-muted-foreground w-64 text-left">
                        {MESSAGES[messageIndex]}
                    </p>
                </div>
            </div>
        </div>
    )
}
