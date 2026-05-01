"use client"

import { useEffect, useState, useRef } from "react"
import { fetchDevProfile } from "@/lib/services/analysis-service"
import { DevProfileResponse } from "@/lib/types/devprofile-types"
import { cn } from "@/lib/utils"
import {
    Trophy, ArrowUp, Star, Globe, Crown, BarChart3, Gem, FileText, Github,
    Code, Zap, Activity, GitMerge, Lock, User, Loader2, Sparkles,
} from "lucide-react"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"

// ── Icon mapping for achievements ──
const ACHIEVEMENT_ICONS: Record<string, React.ElementType> = {
    trophy: Trophy,
    "arrow-up": ArrowUp,
    star: Star,
    globe: Globe,
    crown: Crown,
    chart: BarChart3,
    gem: Gem,
    "file-text": FileText,
    github: Github,
}

// ── Stat display config with unique colors per stat ──
const STAT_CONFIG = [
    { key: "codeQuality" as const, label: "Code Quality", icon: Code, bar: "bg-blue-500", text: "text-blue-600 dark:text-blue-400" },
    { key: "complexity" as const, label: "Complexity", icon: Zap, bar: "bg-violet-500", text: "text-violet-600 dark:text-violet-400" },
    { key: "activity" as const, label: "Activity", icon: Activity, bar: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
    { key: "resume" as const, label: "Resume", icon: FileText, bar: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" },
    { key: "techAlignment" as const, label: "Tech Alignment", icon: GitMerge, bar: "bg-rose-500", text: "text-rose-600 dark:text-rose-400" },
]

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
            // Ease out cubic
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

export default function ProfilePage() {
    const [profile, setProfile] = useState<DevProfileResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        fetchDevProfile()
            .then(setProfile)
            .catch((err) => setError(err?.message || "Failed to load profile"))
            .finally(() => setLoading(false))
    }, [])

    // Trigger animations after data loads
    useEffect(() => {
        if (profile) {
            const timer = setTimeout(() => setMounted(true), 100)
            return () => clearTimeout(timer)
        }
    }, [profile])

    const scoreCount = useCounter(profile?.hireabilityScore ?? 0, 1200, mounted)

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (error || !profile) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-secondary/50 text-foreground">
                    <User className="size-8 opacity-50" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold tracking-tight text-foreground">No Profile Data</h2>
                    <p className="mt-1 max-w-md text-sm text-muted-foreground">
                        Complete an analysis session to unlock your developer profile.
                    </p>
                </div>
            </div>
        )
    }

    const unlockedCount = profile.achievements.filter((a) => a.unlocked).length

    // Score ring math
    const radius = 44
    const circumference = 2 * Math.PI * radius
    const offset = mounted
        ? circumference - (profile.hireabilityScore / 100) * circumference
        : circumference

    return (
        <div className="flex flex-col gap-8 pb-10">
            {/* Page Header */}
            <div className="opacity-0 animate-fade-in-up">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Developer Profile</h1>
                <p className="mt-2 text-muted-foreground">
                    Your skill breakdown and achievements across all analysis sessions.
                </p>
            </div>

            {/* ── Profile Card ── */}
            <div className="opacity-0 animate-fade-in-up animation-delay-100 rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    {/* Left: User info */}
                    <div className="flex items-center gap-4">
                        <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <User className="size-7" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2.5">
                                <h2 className="text-xl font-bold tracking-tight text-foreground">
                                    {profile.username}
                                </h2>
                                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary border border-primary/20">
                                    {profile.level}
                                </span>
                            </div>
                            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                {profile.techField && (
                                    <span>{profile.techField.replace(/_/g, " ")}</span>
                                )}
                                {profile.techField && profile.careerGoal && (
                                    <span className="text-border">|</span>
                                )}
                                {profile.careerGoal && (
                                    <span>{profile.careerGoal.replace(/_/g, " ")}</span>
                                )}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                                {profile.completedSessions} of {profile.totalSessions} sessions completed
                            </p>
                        </div>
                    </div>

                    {/* Right: Score ring + progress */}
                    <div className="flex items-center gap-6">
                        <div className="relative inline-flex items-center justify-center">
                            <svg width="108" height="108" className="-rotate-90 transform">
                                <circle
                                    cx="54" cy="54" r={radius}
                                    fill="none"
                                    strokeWidth="7"
                                    className="stroke-secondary"
                                />
                                <circle
                                    cx="54" cy="54" r={radius}
                                    fill="none"
                                    strokeWidth="7"
                                    strokeLinecap="round"
                                    className={cn(
                                        "transition-all duration-1000 ease-out",
                                        profile.hireabilityScore >= 70 ? "stroke-green-500"
                                            : profile.hireabilityScore >= 50 ? "stroke-yellow-500"
                                                : "stroke-red-500"
                                    )}
                                    strokeDasharray={circumference}
                                    strokeDashoffset={offset}
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center justify-center">
                                <span className="text-2xl font-bold tracking-tighter text-foreground tabular-nums">
                                    {scoreCount}
                                </span>
                                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                                    / 100
                                </span>
                            </div>
                        </div>

                        <div className="hidden sm:flex flex-col gap-1.5 min-w-[140px]">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span className="font-medium">Level Progress</span>
                                <span className="tabular-nums font-semibold">{profile.levelProgress}%</span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                                <div
                                    className="h-full rounded-full bg-primary transition-all duration-1000 ease-out"
                                    style={{ width: mounted ? `${profile.levelProgress}%` : "0%" }}
                                />
                            </div>
                            <p className="text-[11px] text-muted-foreground/70">
                                Progress to next level
                            </p>
                        </div>
                    </div>
                </div>

                {/* Mobile: level progress */}
                <div className="mt-5 sm:hidden">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="font-medium">Level Progress</span>
                        <span className="tabular-nums font-semibold">{profile.levelProgress}%</span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-secondary">
                        <div
                            className="h-full rounded-full bg-primary transition-all duration-1000 ease-out"
                            style={{ width: mounted ? `${profile.levelProgress}%` : "0%" }}
                        />
                    </div>
                </div>
            </div>

            {/* ── Skills Breakdown ── */}
            {profile.stats && (
                <div className="opacity-0 animate-fade-in-up animation-delay-200">
                    <h2 className="text-lg font-semibold tracking-tight mb-4">Skills Breakdown</h2>
                    <div className="grid gap-6 lg:grid-cols-2 rounded-2xl border border-border bg-card p-6 shadow-sm">
                        {/* Radar Chart */}
                        <div className="flex flex-col items-center justify-center min-h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                                    { subject: 'Code Quality', A: profile.stats.codeQuality, fullMark: 100 },
                                    { subject: 'Complexity', A: profile.stats.complexity, fullMark: 100 },
                                    { subject: 'Activity', A: profile.stats.activity, fullMark: 100 },
                                    { subject: 'Resume', A: profile.stats.resume, fullMark: 100 },
                                    { subject: 'Tech Align', A: profile.stats.techAlignment, fullMark: 100 },
                                ]}>
                                    <PolarGrid stroke="var(--border)" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--muted-foreground)", fontSize: 12, fontWeight: 600 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar name="Score" dataKey="A" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.3} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                        
                        {/* Progress Bars */}
                        <div className="flex flex-col justify-center gap-5">
                            {STAT_CONFIG.map((stat, index) => {
                                const value = profile.stats![stat.key]
                                const Icon = stat.icon
                                return (
                                    <div key={stat.key} className="group flex items-center gap-4">
                                        <div className="flex w-32 items-center gap-2.5">
                                            <Icon className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" />
                                            <span className="text-sm font-medium text-foreground">
                                                {stat.label}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                                                <div
                                                    className={cn(
                                                        "h-full rounded-full transition-all ease-out",
                                                        stat.bar
                                                    )}
                                                    style={{
                                                        width: mounted ? `${value}%` : "0%",
                                                        transitionDuration: "900ms",
                                                        transitionDelay: `${index * 120}ms`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <span className={cn(
                                            "w-8 text-right text-sm font-bold tabular-nums",
                                            stat.text
                                        )}>
                                            {value}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Archetype ── */}
            {profile.archetype && (
                <div className="opacity-0 animate-fade-in-up animation-delay-300 rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Sparkles className="size-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                Archetype
                            </h3>
                            <p className="mt-1 text-lg font-bold tracking-tight text-foreground">
                                {profile.archetype.name}
                            </p>
                            <p className="mt-0.5 text-sm text-muted-foreground">
                                {profile.archetype.description}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Achievements ── */}
            <div className="opacity-0 animate-fade-in-up animation-delay-400">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold tracking-tight">Achievements</h2>
                    <span className="text-sm font-medium tabular-nums text-muted-foreground">
                        {unlockedCount} / {profile.achievements.length} unlocked
                    </span>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {profile.achievements.map((achievement) => {
                        const Icon = ACHIEVEMENT_ICONS[achievement.icon] || Trophy
                        return (
                            <div
                                key={achievement.id}
                                className={cn(
                                    "flex flex-col items-center gap-2.5 rounded-xl border p-4 text-center transition-all duration-200",
                                    achievement.unlocked
                                        ? "border-border bg-card shadow-sm hover:shadow-md hover:scale-[1.03] hover:border-primary/30 cursor-default"
                                        : "border-border/50 bg-secondary/30 opacity-45"
                                )}
                            >
                                <div className={cn(
                                    "flex size-10 items-center justify-center rounded-full transition-colors",
                                    achievement.unlocked
                                        ? "bg-primary/10 text-primary"
                                        : "bg-secondary text-muted-foreground"
                                )}>
                                    {achievement.unlocked ? (
                                        <Icon className="size-5" />
                                    ) : (
                                        <Lock className="size-4" />
                                    )}
                                </div>
                                <div>
                                    <p className={cn(
                                        "text-xs font-semibold leading-tight",
                                        achievement.unlocked ? "text-foreground" : "text-muted-foreground"
                                    )}>
                                        {achievement.name}
                                    </p>
                                    <p className="mt-0.5 text-[10px] leading-tight text-muted-foreground">
                                        {achievement.description}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
