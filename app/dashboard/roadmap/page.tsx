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
            <div className="flex flex-col gap-4 opacity-0 animate-fade-in-up">
                <h1 className="text-3xl font-bold tracking-tight">Improvement Roadmap</h1>
                <p className="text-muted-foreground max-w-2xl">
                    {roadmap.summary || `Based on your evaluation, we've generated this ${roadmap.totalWeeks}-week technical curriculum.`}
                </p>
            </div>

            <div className="relative border-l-2 border-border/40 ml-4 md:ml-8 flex flex-col gap-12 mt-4">
                {weeks.map((week, index) => (
                    <div 
                        key={week.weekNumber} 
                        className="group relative pl-8 md:pl-12 opacity-0 animate-fade-in-up"
                        style={{ animationDelay: `${(index + 1) * 150}ms` }}
                    >
                        {/* Timeline Node */}
                        <div className="absolute -left-[19px] top-1.5 flex size-9 items-center justify-center rounded-full border-4 border-background bg-primary text-xs font-black text-primary-foreground shadow-sm transition-all duration-200 group-hover:scale-105">
                            W{week.weekNumber}
                        </div>

                        {/* Card */}
                        <div className="relative flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:border-border/80 hover:shadow-md overflow-hidden">
                            <div className="relative z-10 flex items-center justify-between border-b border-border/50 pb-4">
                                <h2 className="text-xl font-bold tracking-tight text-foreground">
                                    {week.theme}
                                </h2>
                            </div>

                            <div className="relative z-10 grid gap-6 md:grid-cols-2">
                                {/* Specific Tasks */}
                                <div className="flex flex-col gap-3 rounded-xl bg-secondary/20 p-4 border border-border/30">
                                    <h3 className="text-xs font-bold tracking-widest text-primary uppercase flex items-center gap-2">
                                        <Target className="size-4" /> Technical Tasks
                                    </h3>
                                    <ul className="flex flex-col gap-2.5 mt-1">
                                        {(week.technicalTasks || []).map((task, i) => (
                                            <li key={i} className="flex items-start gap-2.5 text-sm">
                                                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/70" />
                                                <span className="text-foreground/80 leading-relaxed font-medium">{task}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Outcomes */}
                                <div className="flex flex-col gap-3 rounded-xl bg-green-500/5 p-4 border border-green-500/10">
                                    <h3 className="text-xs font-bold tracking-widest text-green-500 uppercase flex items-center gap-2">
                                        <CheckCircle2 className="size-4" /> Measurable Outcomes
                                    </h3>
                                    <ul className="flex flex-col gap-2.5 mt-1">
                                        {(week.measurableOutcomes || []).map((outcome, i) => (
                                            <li key={i} className="flex items-start gap-2.5 text-sm">
                                                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-green-500/70" />
                                                <span className="text-foreground/80 leading-relaxed">{outcome}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Badges Footer */}
                            <div className="relative z-10 mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border/50">
                                {week.technologies && week.technologies.length > 0 && (
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Code2 className="size-4 text-muted-foreground mr-1" />
                                        {week.technologies.map((tech) => (
                                            <span key={tech} className="rounded-md bg-secondary px-2.5 py-1 text-[11px] font-bold tracking-wider text-foreground uppercase border border-border/50 transition-colors hover:bg-primary/10 hover:text-primary hover:border-primary/30">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {week.projectIdea && (
                                    <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 px-3 py-2 border border-amber-500/20">
                                        <Lightbulb className="size-4 text-amber-500 shrink-0" />
                                        <span className="text-xs font-medium text-amber-600/90 dark:text-amber-400/90">
                                            <span className="font-bold text-amber-700 dark:text-amber-500 mr-1">Project Idea:</span> 
                                            {week.projectIdea}
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
