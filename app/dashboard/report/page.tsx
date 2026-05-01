"use client"

import { useEffect, useState, useRef } from "react"
import { useDevProfileStore } from "@/lib/store/devprofile-store"
import { Button } from "@/components/ui/button"
import { PieChart, Download, ArrowRight, ShieldCheck, ThumbsUp, ThumbsDown, Activity, Code, GitMerge, FileText, Zap } from "lucide-react"
import Link from "next/link"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"

// ── Animated counter hook ──
function useCounter(target: number, duration: number, start: boolean) {
    const [count, setCount] = useState(0)
    const rafRef = useRef<number | null>(null)

    useEffect(() => {
        if (!start) return
        const startTime = performance.now()
        const animate = (now: number) => {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.round(eased * target))
            if (progress < 1) {
                rafRef.current = requestAnimationFrame(animate)
            }
        }
        rafRef.current = requestAnimationFrame(animate)
        return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
    }, [target, duration, start])

    return count
}

function AnimatedNumber({ value }: { value: number }) {
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])
    const count = useCounter(value, 1200, mounted)
    return <>{count}</>
}

export default function ReportPage() {
    const { analysis, loadReport, currentSessionId } = useDevProfileStore()

    useEffect(() => {
        if (currentSessionId && analysis.hasRun && analysis.status === "completed" && !analysis.recruiterPerspective) {
            loadReport()
        }
    }, [currentSessionId, analysis.hasRun, analysis.status, analysis.recruiterPerspective, loadReport])

    // --- EMPTY STATE ---
    if (!analysis.hasRun || analysis.status !== "completed") {
        return (
            <div className="flex flex-col gap-6 max-w-2xl mx-auto mt-10">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Hireability Report</h1>
                    <p className="mt-2 text-muted-foreground">
                        Your detailed evaluation report will appear here once the analysis is complete.
                    </p>
                </div>

                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center bg-card shadow-sm">
                    <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-secondary/50 text-foreground">
                        <PieChart className="size-8 opacity-50" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold tracking-tight">Run analysis to generate your developer report</h3>
                    <p className="mb-8 max-w-md text-sm text-muted-foreground">
                        We need to evaluate your GitHub repositories and Resume data before we can provide actionable recruiter feedback.
                    </p>
                    <Link href="/dashboard/analysis" className="outline-none">
                        <Button className="flex items-center gap-2 rounded-xl h-11 px-8 shadow-sm transition-all hover:-translate-y-0.5 active:scale-95">
                            Go to Analysis
                            <ArrowRight className="size-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    // --- POPULATED STATE ---
    const { overallScore, scoreBreakdown, strengths, weaknesses, recruiterPerspective, percentileRanking, generatedAt } = analysis

    const scoreColor = (score: number | null | undefined) => {
        if (score == null) return "text-muted-foreground"
        if (score >= 70) return "text-green-500"
        if (score >= 50) return "text-yellow-500"
        return "text-red-500"
    }

    return (
        <div className="flex flex-col gap-8 pb-10">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Developer Report</h1>
                    <p className="mt-2 text-muted-foreground flex flex-col gap-1">
                        <span>Confidential hireability evaluation based on your public profiles.</span>
                        {generatedAt && (
                            <span className="text-xs font-medium text-foreground/50">Generated {new Date(generatedAt).toLocaleDateString()}</span>
                        )}
                    </p>
                </div>
                <Button onClick={() => alert("PDF download coming soon!")} className="flex items-center gap-2 rounded-xl bg-accent text-foreground hover:bg-accent/80 transition-colors shadow-sm">
                    <Download className="size-4" />
                    Download PDF
                </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Recruiter Perspective */}
                <div className="lg:col-span-2 flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <ShieldCheck className="size-32" />
                    </div>
                    <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2 relative z-10">
                        <ShieldCheck className="size-5 text-primary" />
                        Recruiter Perspective
                    </h2>
                    <div className="relative z-10 p-4 rounded-xl bg-secondary/30 border border-border/50">
                        <p className="text-sm font-medium leading-relaxed text-foreground/90">
                            {recruiterPerspective}
                        </p>
                    </div>
                </div>

                {/* Total Score */}
                <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Overall Hireability</h3>
                    <div className="flex items-baseline gap-1">
                        <span className={`text-6xl font-black tracking-tighter ${scoreColor(overallScore)}`}>
                            {overallScore != null ? <AnimatedNumber value={overallScore} /> : "—"}
                        </span>
                        <span className="text-lg font-bold text-muted-foreground">/100</span>
                    </div>
                    {percentileRanking && (
                        <div className="mt-4 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary border border-primary/20">
                            {percentileRanking}
                        </div>
                    )}
                </div>
            </div>

            {/* Score Breakdown (Radar Chart & Stats) */}
            <div>
                <h2 className="text-lg font-semibold tracking-tight mb-4">Score Breakdown</h2>
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Radar Chart */}
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-6 shadow-sm min-h-[350px]">
                        {scoreBreakdown ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                                    { subject: 'Code Quality', A: scoreBreakdown.codeQuality, fullMark: 100 },
                                    { subject: 'Complexity', A: scoreBreakdown.complexity, fullMark: 100 },
                                    { subject: 'Activity', A: scoreBreakdown.activity, fullMark: 100 },
                                    { subject: 'Resume', A: scoreBreakdown.resume, fullMark: 100 },
                                    { subject: 'Tech Align', A: scoreBreakdown.techAlign, fullMark: 100 },
                                ]}>
                                    <PolarGrid stroke="var(--border)" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--muted-foreground)", fontSize: 12, fontWeight: 600 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar name="Score" dataKey="A" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.3} />
                                </RadarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground">No data available</div>
                        )}
                    </div>
                    
                    {/* Grid of Scores */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        {[
                            { label: "Code Quality", score: scoreBreakdown?.codeQuality, icon: Code },
                            { label: "Complexity", score: scoreBreakdown?.complexity, icon: Zap },
                            { label: "Activity", score: scoreBreakdown?.activity, icon: Activity },
                            { label: "Resume", score: scoreBreakdown?.resume, icon: FileText },
                            { label: "Tech Align", score: scoreBreakdown?.techAlign, icon: GitMerge },
                        ].map((item) => (
                            <div key={item.label} className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:bg-secondary/20">
                                <item.icon className="size-5 text-muted-foreground mb-3" />
                                <span className={`text-2xl font-bold tabular-nums ${scoreColor(item.score)}`}>
                                    {item.score != null ? <AnimatedNumber value={item.score} /> : "—"}
                                </span>
                                <span className="text-xs font-semibold text-muted-foreground uppercase mt-1 text-center">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Strengths */}
                <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <h3 className="text-lg font-semibold tracking-tight flex items-center gap-2 text-green-500">
                        <ThumbsUp className="size-5" />
                        Core Strengths
                    </h3>
                    <ul className="flex flex-col gap-3 mt-2">
                        {strengths.map((str, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                                <span className="shrink-0 mt-[7px] size-1.5 rounded-full bg-green-500" />
                                <span>{str}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Weaknesses */}
                <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <h3 className="text-lg font-semibold tracking-tight flex items-center gap-2 text-red-500">
                        <ThumbsDown className="size-5" />
                        Areas for Growth
                    </h3>
                    <ul className="flex flex-col gap-3 mt-2">
                        {weaknesses.map((wk, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                                <span className="shrink-0 mt-[7px] size-1.5 rounded-full bg-red-500" />
                                <span>{wk}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}
