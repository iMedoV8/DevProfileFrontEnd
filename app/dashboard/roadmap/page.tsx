"use client"

import { useEffect } from "react"
import { useDevProfileStore } from "@/lib/store/devprofile-store"
import { Button } from "@/components/ui/button"
import { Map, ArrowRight, Target, Lightbulb, Code2, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function RoadmapPage() {
    const { analysis, roadmap, loadRoadmap, currentSessionId } = useDevProfileStore()

    useEffect(() => {
        if (currentSessionId && analysis.hasRun && analysis.status === "completed" && !roadmap) {
            loadRoadmap()
        }
    }, [currentSessionId, analysis.hasRun, analysis.status, roadmap, loadRoadmap])

    // --- EMPTY STATE ---
    if (!analysis.hasRun || !roadmap) {
        return (
            <div className="flex flex-col gap-6 max-w-2xl mx-auto mt-10">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Personalized Roadmap</h1>
                    <p className="mt-2 text-muted-foreground">
                        A step-by-step improvement plan tailored to your profile will appear here.
                    </p>
                </div>

                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center bg-card shadow-sm">
                    <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-secondary/50 text-foreground">
                        <Map className="size-8 opacity-50" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold tracking-tight">Run analysis to generate your roadmap</h3>
                    <p className="mb-8 max-w-md text-sm text-muted-foreground">
                        We need to evaluate your current strengths and weaknesses to build a custom curriculum.
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
    const weeks = roadmap.weeks

    return (
        <div className="flex flex-col gap-8 pb-10">
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Improvement Roadmap</h1>
                <p className="text-muted-foreground max-w-2xl">
                    {roadmap.summary || `Based on your evaluation, we've generated this ${roadmap.totalWeeks}-week technical curriculum.`}
                </p>
            </div>

            <div className="relative border-l-2 border-border/60 ml-3 md:ml-6 flex flex-col gap-10">
                {weeks.map((week) => (
                    <div key={week.weekNumber} className="relative pl-8 md:pl-10">
                        {/* Timeline Node */}
                        <div className="absolute -left-[17px] top-1.5 flex size-8 items-center justify-center rounded-full border-4 border-background bg-primary text-xs font-bold text-primary-foreground shadow-sm">
                            W{week.weekNumber}
                        </div>

                        <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm transition-colors hover:border-border/80">
                            <div className="flex items-center justify-between border-b border-border/50 pb-4">
                                <h2 className="text-xl font-bold tracking-tight text-foreground">{week.theme}</h2>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Specific Tasks */}
                                <div className="flex flex-col gap-3">
                                    <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase flex items-center gap-2">
                                        <Target className="size-4" /> Technical Tasks
                                    </h3>
                                    <ul className="flex flex-col gap-2">
                                        {week.technicalTasks.map((task, i) => (
                                            <li key={i} className="flex items-start gap-2.5 text-sm">
                                                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
                                                <span className="text-foreground/90">{task}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Outcomes */}
                                <div className="flex flex-col gap-3">
                                    <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase flex items-center gap-2">
                                        <CheckCircle2 className="size-4 text-green-500" /> Measurable Outcomes
                                    </h3>
                                    <ul className="flex flex-col gap-2">
                                        {week.measurableOutcomes.map((outcome, i) => (
                                            <li key={i} className="flex items-start gap-2.5 text-sm">
                                                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-green-500/70" />
                                                <span className="text-muted-foreground">{outcome}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Badges Footer */}
                            <div className="mt-2 flex flex-wrap gap-2 pt-4 border-t border-border/50">
                                {week.technologies.length > 0 && (
                                    <div className="flex items-center gap-2 mr-4">
                                        <Code2 className="size-4 text-muted-foreground" />
                                        {week.technologies.map((tech) => (
                                            <span key={tech} className="rounded-md bg-secondary/50 px-2 py-1 text-[11px] font-semibold tracking-wide text-foreground border border-border/50">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {week.projectIdea && (
                                    <div className="flex items-center gap-2">
                                        <Lightbulb className="size-4 text-amber-500" />
                                        <span className="text-xs font-medium text-muted-foreground">
                                            <span className="font-semibold text-foreground">Idea:</span> {week.projectIdea}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
