"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AuthModal } from "@/components/auth-modal"
import {
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  Code2,
  Database,
  GitBranch,
  Star,
  FolderGit2,
  ArrowRight,
  Calendar,
  MapPin,
} from "lucide-react"
import { useState, useEffect, useRef } from "react"

function ScoreRing({ score }: { score: number }) {
  const [current, setCurrent] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true
    let val = 0
    const timer = setInterval(() => {
      val += 1
      setCurrent(val)
      if (val >= score) clearInterval(timer)
    }, 18)
    return () => clearInterval(timer)
  }, [score])

  const radius = 52
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (current / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="140" height="140" className="-rotate-90">
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-secondary"
        />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          className="text-foreground transition-all duration-200"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold text-foreground">{current}</span>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
          Hireability
        </span>
      </div>
    </div>
  )
}

const techBadges = [
  "Java",
  "Spring Boot",
  "PostgreSQL",
  "Git",
  "REST APIs",
  "Docker",
  "Maven",
  "JUnit",
]

const strengths = [
  { text: "Strong Java OOP understanding", icon: Code2 },
  { text: "Clean project architecture", icon: GitBranch },
  { text: "Good database schema design", icon: Database },
  { text: "Consistent commit history", icon: Star },
]

const weaknesses = [
  "No automated unit or integration tests",
  "No CI/CD pipeline configured",
  "Limited project documentation and README",
  "No deployment or cloud experience visible",
]

const recommendations = [
  "Add JUnit tests to your Java projects with at least 60% coverage",
  "Deploy a project to cloud (AWS / Vercel / Railway)",
  "Improve GitHub README files with screenshots and setup instructions",
  "Set up GitHub Actions for automated testing and linting",
  "Add Docker configuration to at least one backend project",
]

const repos = [
  {
    name: "spring-ecommerce",
    lang: "Java",
    description: "Full-stack e-commerce app with Spring Boot and PostgreSQL",
    commits: 142,
    quality: "Good",
    updated: "2 days ago",
  },
  {
    name: "portfolio-api",
    lang: "TypeScript",
    description: "REST API for personal portfolio with Express.js",
    commits: 67,
    quality: "Average",
    updated: "1 week ago",
  },
  {
    name: "chat-app",
    lang: "Python",
    description: "Real-time chat application with Flask and WebSockets",
    commits: 34,
    quality: "Needs work",
    updated: "3 weeks ago",
  },
  {
    name: "algo-playground",
    lang: "Java",
    description: "Collection of data structure and algorithm implementations",
    commits: 89,
    quality: "Good",
    updated: "1 month ago",
  },
]

const commitData = [
  { month: "Jul", count: 12 },
  { month: "Aug", count: 18 },
  { month: "Sep", count: 8 },
  { month: "Oct", count: 24 },
  { month: "Nov", count: 31 },
  { month: "Dec", count: 15 },
  { month: "Jan", count: 22 },
  { month: "Feb", count: 28 },
]

const roadmap = [
  {
    week: "Week 1-2",
    title: "Add testing foundations",
    tasks: [
      "Set up JUnit 5 in spring-ecommerce",
      "Write tests for service layer",
      "Aim for 60% coverage on main project",
    ],
  },
  {
    week: "Week 3-4",
    title: "Improve documentation",
    tasks: [
      "Write comprehensive README for top 3 repos",
      "Add screenshots and GIFs of running projects",
      "Document API endpoints with examples",
    ],
  },
  {
    week: "Week 5-6",
    title: "Deploy and automate",
    tasks: [
      "Deploy spring-ecommerce to Railway or AWS",
      "Set up GitHub Actions CI pipeline",
      "Add Docker configuration",
    ],
  },
  {
    week: "Week 7-8",
    title: "Build visibility",
    tasks: [
      "Polish GitHub profile README",
      "Pin best repositories",
      "Start contributing to one open source project",
    ],
  },
]

export default function SampleReportPage() {
  const [authOpen, setAuthOpen] = useState(false)
  const maxCommits = Math.max(...commitData.map((d) => d.count))

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="px-6 pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="mx-auto max-w-4xl">
          {/* Page Header */}
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Sample Report
            </p>
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Full developer analysis report
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              This is an example report for a computer science student. Your
              report will be personalized based on your actual profile.
            </p>
          </div>

          {/* Report Card */}
          <Card className="overflow-hidden border border-border bg-card shadow-xl">
            {/* Profile Header */}
            <div className="flex flex-col items-center gap-6 border-b border-border bg-secondary/20 p-8 sm:flex-row sm:justify-between">
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <div className="flex size-16 items-center justify-center rounded-full bg-secondary text-xl font-bold text-foreground">
                  AK
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-xl font-bold text-foreground">
                    Alex Kovac
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Computer Science Student
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3" />
                      Berlin, Germany
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3" />
                      Analyzed Feb 2026
                    </span>
                  </div>
                </div>
              </div>
              <ScoreRing score={72} />
            </div>

            {/* Technologies */}
            <div className="border-b border-border px-8 py-6">
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

            {/* Strengths / Weaknesses / Recommendations */}
            <div className="grid divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
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
                      <span className="text-sm text-muted-foreground">
                        {w}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

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
                  {recommendations.slice(0, 4).map((r) => (
                    <li key={r} className="flex items-start gap-2.5">
                      <TrendingUp className="mt-0.5 size-4 shrink-0 text-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {r}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Repository List */}
            <div className="border-t border-border">
              <div className="px-8 py-6">
                <h4 className="mb-4 text-sm font-semibold text-foreground">
                  Repository Analysis
                </h4>
                <div className="flex flex-col gap-3">
                  {repos.map((repo) => (
                    <div
                      key={repo.name}
                      className="flex flex-col gap-2 rounded-lg border border-border p-4 transition-colors hover:bg-accent/30 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <FolderGit2 className="size-3.5 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">
                            {repo.name}
                          </span>
                          <Badge
                            variant="outline"
                            className="rounded-full text-[10px]"
                          >
                            {repo.lang}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {repo.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-muted-foreground">
                          {repo.commits} commits
                        </span>
                        <Badge
                          variant="secondary"
                          className="rounded-full text-[10px]"
                        >
                          {repo.quality}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Commit Activity */}
            <div className="border-t border-border px-8 py-6">
              <h4 className="mb-4 text-sm font-semibold text-foreground">
                Commit Activity (Last 8 Months)
              </h4>
              <div className="flex items-end gap-3">
                {commitData.map((d) => (
                  <div
                    key={d.month}
                    className="flex flex-1 flex-col items-center gap-1"
                  >
                    <span className="text-[10px] font-medium text-muted-foreground">
                      {d.count}
                    </span>
                    <div
                      className="w-full rounded-t bg-foreground/80 transition-all duration-500"
                      style={{
                        height: `${(d.count / maxCommits) * 120}px`,
                        minHeight: 8,
                      }}
                    />
                    <span className="text-[10px] text-muted-foreground">
                      {d.month}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Improvement Roadmap */}
            <div className="border-t border-border px-8 py-6">
              <h4 className="mb-6 text-sm font-semibold text-foreground">
                8-Week Improvement Roadmap
              </h4>
              <div className="grid gap-6 md:grid-cols-2">
                {roadmap.map((phase) => (
                  <div
                    key={phase.week}
                    className="rounded-lg border border-border p-5"
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="rounded-full text-[10px] font-semibold"
                      >
                        {phase.week}
                      </Badge>
                      <span className="text-sm font-semibold text-foreground">
                        {phase.title}
                      </span>
                    </div>
                    <ul className="flex flex-col gap-1.5">
                      {phase.tasks.map((task) => (
                        <li
                          key={task}
                          className="flex items-start gap-2 text-xs text-muted-foreground"
                        >
                          <div className="mt-1.5 size-1 shrink-0 rounded-full bg-foreground/40" />
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* CTA */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-foreground">
              Want your own report?
            </h3>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">
              Get a personalized analysis of your GitHub profile and resume in
              under 2 minutes.
            </p>
            <Button
              size="lg"
              className="btn-glossy mt-6 h-12 rounded-full px-8 text-base text-primary-foreground"
              onClick={() => setAuthOpen(true)}
            >
              Analyze my profile
              <ArrowRight className="ml-1 size-4" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </main>
  )
}
