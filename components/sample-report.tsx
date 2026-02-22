"use client"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { useScrollVisible } from "@/hooks/use-scroll-visible"
import {
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  Code2,
  Database,
  GitBranch,
  Star,
} from "lucide-react"
import { useEffect, useState } from "react"

function ScoreRing({ score, visible }: { score: number; visible: boolean }) {
  const radius = 45
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="120" height="120" className="-rotate-90">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-secondary"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          className="text-foreground transition-all duration-1000 ease-out"
          strokeDasharray={circumference}
          strokeDashoffset={visible ? offset : circumference}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold text-foreground">{visible ? score : 0}</span>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
          Score
        </span>
      </div>
    </div>
  )
}

const strengths = [
  { text: "Strong Java OOP understanding", icon: Code2 },
  { text: "Clean project architecture", icon: GitBranch },
  { text: "Good database schema design", icon: Database },
]

const weaknesses = [
  "No automated tests",
  "No CI/CD pipeline",
  "Limited documentation",
]

const recommendations = [
  "Add JUnit tests to your Java projects",
  "Deploy a project to cloud (AWS / Vercel)",
  "Improve GitHub README with screenshots",
]

const techBadges = ["Java", "Spring Boot", "PostgreSQL", "Git", "REST APIs"]

export function SampleReport() {
  const { ref, visible } = useScrollVisible(0.1)
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    if (!visible) return
    let current = 0
    const target = 72
    const timer = setInterval(() => {
      current += 1
      setAnimatedScore(current)
      if (current >= target) clearInterval(timer)
    }, 15)
    return () => clearInterval(timer)
  }, [visible])

  return (
    <section ref={ref} className="bg-secondary/30 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div
          className={cn(
            "mb-16 text-center transition-all duration-500",
            visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          )}
        >
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Sample Report
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            See your developer report before signing up
          </h2>
        </div>

        {/* Report Card */}
        <Card
          className={cn(
            "mx-auto max-w-4xl overflow-hidden border border-border bg-card shadow-xl transition-all duration-700",
            visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )}
        >
          {/* Report Header */}
          <div className="flex flex-col items-center gap-6 border-b border-border p-8 sm:flex-row sm:justify-between">
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <div className="flex size-12 items-center justify-center rounded-full bg-secondary text-foreground">
                <span className="text-lg font-bold">AK</span>
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-semibold text-foreground">
                  Alex Kovac
                </h3>
                <p className="text-sm text-muted-foreground">
                  Computer Science Student
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <ScoreRing score={animatedScore} visible={visible} />
              <p className="mt-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Hireability
              </p>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="border-b border-border px-8 py-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Detected Technologies
            </p>
            <div className="flex flex-wrap gap-2">
              {techBadges.map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="rounded-full px-3 py-1 text-xs font-medium"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {/* 3 Column Grid */}
          <div className="grid divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
            {/* Strengths */}
            <div className="p-8">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-secondary">
                  <Star className="size-3.5 text-foreground" />
                </div>
                <h4 className="text-sm font-semibold text-foreground">
                  Strengths
                </h4>
              </div>
              <ul className="flex flex-col gap-3">
                {strengths.map((s) => (
                  <li key={s.text} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {s.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="p-8">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-secondary">
                  <AlertTriangle className="size-3.5 text-foreground" />
                </div>
                <h4 className="text-sm font-semibold text-foreground">
                  Weaknesses
                </h4>
              </div>
              <ul className="flex flex-col gap-3">
                {weaknesses.map((w) => (
                  <li key={w} className="flex items-start gap-2.5">
                    <div className="mt-1.5 size-1.5 shrink-0 rounded-full bg-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{w}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="p-8">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-secondary">
                  <Lightbulb className="size-3.5 text-foreground" />
                </div>
                <h4 className="text-sm font-semibold text-foreground">
                  Recommendations
                </h4>
              </div>
              <ul className="flex flex-col gap-3">
                {recommendations.map((r) => (
                  <li key={r} className="flex items-start gap-2.5">
                    <TrendingUp className="mt-0.5 size-4 shrink-0 text-foreground" />
                    <span className="text-sm text-muted-foreground">{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
