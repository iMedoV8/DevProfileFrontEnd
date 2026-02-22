"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useScrollVisible } from "@/hooks/use-scroll-visible"
import { FileX2, Github, HelpCircle } from "lucide-react"

const problems = [
  {
    icon: FileX2,
    title: "Resume \u2260 real skills",
    description:
      "Recruiters can't evaluate coding ability from a PDF resume. Keywords don't prove competence.",
  },
  {
    icon: Github,
    title: "Recruiters check GitHub",
    description:
      "Hiring managers open repositories, not portfolios. Your code speaks louder than your CV.",
  },
  {
    icon: HelpCircle,
    title: "Students don\u2019t know what to improve",
    description:
      "Developers practice blindly and waste months building the wrong skills.",
  },
]

export function ProblemSection() {
  const { ref, visible } = useScrollVisible()

  return (
    <section ref={ref} className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div
          className={cn(
            "mb-16 text-center transition-all duration-500",
            visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          )}
        >
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            The Problem
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Why most junior developers get rejected
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {problems.map((problem, i) => (
            <Card
              key={problem.title}
              className={cn(
                "group border border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:shadow-lg",
                visible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-6 opacity-0"
              )}
              style={{ transitionDelay: visible ? `${i * 120}ms` : "0ms" }}
            >
              <CardContent className="p-8">
                <div className="mb-5 inline-flex size-12 items-center justify-center rounded-xl bg-secondary text-foreground transition-colors group-hover:bg-foreground group-hover:text-background">
                  <problem.icon className="size-5" strokeWidth={1.5} />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {problem.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {problem.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
