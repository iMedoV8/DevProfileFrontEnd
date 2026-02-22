"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AuthModal } from "@/components/auth-modal"
import {
  Upload,
  Cpu,
  ClipboardCheck,
  Rocket,
  ArrowRight,
  ArrowDown,
  FileText,
  Github,
  Braces,
  FolderTree,
  GitCommitHorizontal,
  TestTubeDiagonal,
  Users,
  TrendingUp,
  Target,
  BarChart3,
} from "lucide-react"
import { useState } from "react"

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload resume & connect GitHub",
    description:
      "Provide your resume as a PDF and connect your GitHub account. We request read-only access to your public repositories. No write access is ever requested, and your data is never shared with third parties.",
    details: [
      {
        icon: FileText,
        text: "Resume parsed using NLP to extract skills, experience, and education",
      },
      {
        icon: Github,
        text: "GitHub OAuth grants read-only access to public repositories only",
      },
    ],
  },
  {
    number: "02",
    icon: Cpu,
    title: "AI analyzes real repositories",
    description:
      "Our AI engine clones and analyzes each repository in detail. It evaluates code structure, patterns, naming conventions, documentation quality, test coverage, and technology choices. This is not keyword matching -- it is real static analysis.",
    details: [
      {
        icon: Braces,
        text: "Code patterns, error handling, and design pattern detection",
      },
      {
        icon: FolderTree,
        text: "Project structure, separation of concerns, and scalability",
      },
      {
        icon: GitCommitHorizontal,
        text: "Commit frequency, streak consistency, and contribution patterns",
      },
      {
        icon: TestTubeDiagonal,
        text: "Test file detection, framework usage, and coverage estimation",
      },
    ],
  },
  {
    number: "03",
    icon: ClipboardCheck,
    title: "System evaluates recruiter criteria",
    description:
      "The analysis results are weighted against real-world hiring criteria. We model how technical recruiters, engineering managers, and automated ATS systems evaluate developer profiles. Each dimension is scored independently and combined into a hireability score.",
    details: [
      {
        icon: Users,
        text: "Simulates review by technical recruiter and engineering manager",
      },
      {
        icon: BarChart3,
        text: "Scores 7 dimensions: consistency, architecture, patterns, naming, docs, tests, complexity",
      },
      {
        icon: Target,
        text: "Compares against successful candidates for your target role level",
      },
    ],
  },
  {
    number: "04",
    icon: Rocket,
    title: "Generates improvement roadmap",
    description:
      "Based on identified gaps, DevProfile generates a prioritized, week-by-week improvement plan. Each recommendation is actionable and specific to your actual repositories. The roadmap focuses on highest-impact improvements first.",
    details: [
      {
        icon: TrendingUp,
        text: "Prioritized by impact -- highest ROI improvements appear first",
      },
      {
        icon: Target,
        text: "Specific to your repos, not generic advice",
      },
    ],
  },
]

export default function HowItWorksPage() {
  const [authOpen, setAuthOpen] = useState(false)

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="px-6 pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-16 text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
              How it works
            </p>
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              The analysis pipeline
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              A detailed look at how DevProfile processes your profile, from
              data ingestion to actionable output.
            </p>
          </div>

          {/* Steps */}
          <div className="flex flex-col gap-8">
            {steps.map((step, i) => (
              <div key={step.number}>
                <Card className="overflow-hidden border border-border bg-card">
                  {/* Step Header */}
                  <div className="flex items-start gap-5 border-b border-border p-8">
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-secondary text-foreground">
                      <step.icon className="size-6" strokeWidth={1.5} />
                    </div>
                    <div>
                      <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        {"Step " + step.number}
                      </span>
                      <h2 className="text-lg font-bold text-foreground">
                        {step.title}
                      </h2>
                    </div>
                  </div>

                  {/* Step Body */}
                  <div className="p-8">
                    <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                    <div className="flex flex-col gap-3">
                      {step.details.map((detail) => (
                        <div
                          key={detail.text}
                          className="flex items-start gap-3 rounded-lg bg-secondary/50 px-4 py-3"
                        >
                          <detail.icon className="mt-0.5 size-4 shrink-0 text-foreground" />
                          <span className="text-sm text-foreground">
                            {detail.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Connector */}
                {i < steps.length - 1 && (
                  <div className="flex justify-center py-4">
                    <ArrowDown className="size-5 text-muted-foreground/40" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Architecture Diagram */}
          <div className="mt-20">
            <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-foreground">
              System architecture
            </h2>
            <Card className="overflow-hidden border border-border bg-card p-8">
              <div className="flex flex-col items-center gap-4">
                {/* Row 1: Inputs */}
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-4 py-2.5">
                    <FileText className="size-4 text-foreground" />
                    <span className="text-xs font-medium text-foreground">
                      Resume (PDF)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-4 py-2.5">
                    <Github className="size-4 text-foreground" />
                    <span className="text-xs font-medium text-foreground">
                      GitHub Repos
                    </span>
                  </div>
                </div>

                <ArrowDown className="size-4 text-muted-foreground/40" />

                {/* Row 2: Processing */}
                <div className="w-full rounded-lg border border-border bg-foreground px-6 py-4 text-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary-foreground">
                    AI Analysis Engine
                  </span>
                  <p className="mt-1 text-[10px] text-primary-foreground/60">
                    NLP + Static Analysis + Pattern Recognition
                  </p>
                </div>

                <ArrowDown className="size-4 text-muted-foreground/40" />

                {/* Row 3: Evaluation */}
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                  <div className="rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-center">
                    <span className="text-xs font-medium text-foreground">
                      Code Quality Score
                    </span>
                  </div>
                  <div className="rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-center">
                    <span className="text-xs font-medium text-foreground">
                      Recruiter Simulation
                    </span>
                  </div>
                  <div className="rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-center">
                    <span className="text-xs font-medium text-foreground">
                      Gap Analysis
                    </span>
                  </div>
                </div>

                <ArrowDown className="size-4 text-muted-foreground/40" />

                {/* Row 4: Output */}
                <div className="w-full rounded-lg border-2 border-foreground/20 px-6 py-4 text-center">
                  <span className="text-sm font-semibold text-foreground">
                    Developer Report + Improvement Roadmap
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-foreground">
              Ready to see your analysis?
            </h3>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">
              The whole process takes under 2 minutes. No credit card required
              for the free plan.
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
