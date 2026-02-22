"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useScrollVisible } from "@/hooks/use-scroll-visible"
import {
  Github,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Search,
} from "lucide-react"
import { useState, useCallback, useEffect, useRef } from "react"

const scanMessages = [
  "Connecting to GitHub...",
  "Scanning repositories...",
  "Analyzing code patterns...",
  "Evaluating architecture...",
  "Generating report...",
]

const mockReport = {
  score: 68,
  technologies: ["JavaScript", "React", "Node.js", "MongoDB", "CSS"],
  strengths: [
    "Active commit history",
    "Multiple full-stack projects",
    "Good use of modern frameworks",
  ],
  weaknesses: [
    "Missing test coverage",
    "Inconsistent documentation",
    "No CI/CD configuration",
  ],
  recommendations: [
    "Add unit tests to at least 2 projects",
    "Write detailed README files with screenshots",
    "Set up GitHub Actions for automated testing",
  ],
}

function DemoScoreRing({ score, animate }: { score: number; animate: boolean }) {
  const [current, setCurrent] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (!animate || started.current) return
    started.current = true
    let val = 0
    const timer = setInterval(() => {
      val += 1
      setCurrent(val)
      if (val >= score) clearInterval(timer)
    }, 20)
    return () => clearInterval(timer)
  }, [animate, score])

  const radius = 35
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (current / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="88" height="88" className="-rotate-90">
        <circle
          cx="44"
          cy="44"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          className="text-border"
        />
        <circle
          cx="44"
          cy="44"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          className="text-foreground transition-all duration-200"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-lg font-bold text-foreground">{current}</span>
        <span className="text-[8px] uppercase tracking-widest text-muted-foreground">
          Score
        </span>
      </div>
    </div>
  )
}

export function DemoAnalysis() {
  const { ref, visible } = useScrollVisible()
  const [username, setUsername] = useState("")
  const [scanning, setScanning] = useState(false)
  const [scanStep, setScanStep] = useState(0)
  const [showReport, setShowReport] = useState(false)

  const handleAnalyze = useCallback(() => {
    if (!username.trim()) return
    setScanning(true)
    setShowReport(false)
    setScanStep(0)

    let step = 0
    const interval = setInterval(() => {
      step += 1
      setScanStep(step)
      if (step >= scanMessages.length) {
        clearInterval(interval)
        setTimeout(() => {
          setScanning(false)
          setShowReport(true)
        }, 400)
      }
    }, 700)
  }, [username])

  return (
    <section ref={ref} className="bg-secondary/30 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-4xl">
        <div
          className={cn(
            "mb-12 text-center transition-all duration-500",
            visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          )}
        >
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Try it now
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Interactive demo analysis
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            Enter any GitHub username and see a preview of the analysis. No
            signup required.
          </p>
        </div>

        {/* Input */}
        <div
          className={cn(
            "mx-auto mb-8 flex max-w-md gap-3 transition-all duration-500",
            visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          )}
          style={{ transitionDelay: visible ? "100ms" : "0ms" }}
        >
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 shadow-sm transition-all focus-within:border-foreground/20">
            <Github className="size-4 shrink-0 text-muted-foreground" />
            <input
              type="text"
              placeholder="GitHub username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
          <Button
            className="btn-glossy rounded-xl px-6 text-primary-foreground"
            onClick={handleAnalyze}
            disabled={scanning || !username.trim()}
          >
            {scanning ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                <Search className="mr-1 size-4" />
                Analyze
              </>
            )}
          </Button>
        </div>

        {/* Scanning animation */}
        {scanning && (
          <Card className="mx-auto max-w-md animate-fade-in border border-border bg-card p-6">
            <div className="flex flex-col gap-3">
              {scanMessages.map((msg, i) => (
                <div
                  key={msg}
                  className={cn(
                    "flex items-center gap-3 text-sm transition-all duration-300",
                    i <= scanStep ? "opacity-100" : "opacity-20"
                  )}
                >
                  {i < scanStep ? (
                    <CheckCircle2 className="size-4 shrink-0 text-foreground" />
                  ) : i === scanStep ? (
                    <Loader2 className="size-4 shrink-0 animate-spin text-foreground" />
                  ) : (
                    <div className="size-4 shrink-0 rounded-full border border-border" />
                  )}
                  <span
                    className={cn(
                      i <= scanStep
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {msg}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Report result */}
        {showReport && (
          <Card className="mx-auto max-w-2xl animate-fade-in-up border border-border bg-card shadow-lg">
            {/* Header */}
            <div className="flex flex-col items-center gap-4 border-b border-border p-6 sm:flex-row sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-secondary text-sm font-bold text-foreground">
                  {username.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {username}
                  </p>
                  <p className="text-xs text-muted-foreground">Demo Analysis</p>
                </div>
              </div>
              <DemoScoreRing score={mockReport.score} animate={showReport} />
            </div>

            {/* Technologies */}
            <div className="border-b border-border px-6 py-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Detected Technologies
              </p>
              <div className="flex flex-wrap gap-1.5">
                {mockReport.technologies.map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="rounded-full px-2.5 py-0.5 text-xs"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div className="grid divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
              <div className="p-6">
                <div className="mb-3 flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-foreground" />
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                    Strengths
                  </h4>
                </div>
                <ul className="flex flex-col gap-2">
                  {mockReport.strengths.map((s) => (
                    <li
                      key={s}
                      className="text-xs leading-relaxed text-muted-foreground"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6">
                <div className="mb-3 flex items-center gap-2">
                  <AlertTriangle className="size-4 text-foreground" />
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                    Weaknesses
                  </h4>
                </div>
                <ul className="flex flex-col gap-2">
                  {mockReport.weaknesses.map((w) => (
                    <li
                      key={w}
                      className="text-xs leading-relaxed text-muted-foreground"
                    >
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6">
                <div className="mb-3 flex items-center gap-2">
                  <Lightbulb className="size-4 text-foreground" />
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                    Recommendations
                  </h4>
                </div>
                <ul className="flex flex-col gap-2">
                  {mockReport.recommendations.map((r) => (
                    <li
                      key={r}
                      className="text-xs leading-relaxed text-muted-foreground"
                    >
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA */}
            <div className="border-t border-border p-6 text-center">
              <p className="mb-3 text-xs text-muted-foreground">
                Sign up for a full detailed analysis with improvement roadmap
              </p>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full text-xs"
                onClick={() => (window.location.href = "/sample-report")}
              >
                View full sample report
                <ArrowRight className="ml-1 size-3" />
              </Button>
            </div>
          </Card>
        )}
      </div>
    </section>
  )
}
