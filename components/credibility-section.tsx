"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useScrollVisible } from "@/hooks/use-scroll-visible"
import {
  GitCommitHorizontal,
  FolderTree,
  Braces,
  FileText,
  TestTubeDiagonal,
  Layers,
  PenLine,
} from "lucide-react"
import { useState } from "react"

const metrics = [
  {
    icon: GitCommitHorizontal,
    title: "Commit Consistency",
    summary: "How regularly you contribute code",
    detail:
      "Measures commit frequency, streak patterns, and contribution regularity over the past 12 months. Consistent activity signals reliability to recruiters.",
  },
  {
    icon: FolderTree,
    title: "Repo Architecture",
    summary: "Project structure and organization",
    detail:
      "Evaluates folder structure, separation of concerns, config management, and how well the codebase scales. Clean architecture reflects real engineering thinking.",
  },
  {
    icon: Braces,
    title: "Code Patterns",
    summary: "Design patterns and best practices",
    detail:
      "Detects usage of common design patterns, error handling practices, proper abstraction layers, and avoidance of anti-patterns in your repositories.",
  },
  {
    icon: PenLine,
    title: "Naming Quality",
    summary: "Variable, function, and file naming",
    detail:
      "Analyzes naming conventions across variables, functions, classes, and files. Good naming reduces cognitive load and signals professional coding habits.",
  },
  {
    icon: FileText,
    title: "Documentation",
    summary: "README quality and code comments",
    detail:
      "Checks README completeness, inline comments, JSDoc/Javadoc usage, and whether projects have clear setup instructions. Documentation is a top signal for recruiters.",
  },
  {
    icon: TestTubeDiagonal,
    title: "Testing Presence",
    summary: "Unit, integration, and E2E tests",
    detail:
      "Scans for test files, test frameworks, coverage configs, and CI pipelines. Presence of tests strongly correlates with interview success.",
  },
  {
    icon: Layers,
    title: "Project Complexity",
    summary: "Real-world feature depth",
    detail:
      "Evaluates feature scope, database usage, authentication, external API integrations, and deployment configs. Projects with real depth stand out to hiring teams.",
  },
]

function MetricCard({
  metric,
  index,
  visible,
}: {
  metric: (typeof metrics)[0]
  index: number
  visible: boolean
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card
      className={cn(
        "group cursor-pointer border border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:shadow-lg",
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      )}
      style={{ transitionDelay: visible ? `${index * 80}ms` : "0ms" }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <CardContent className="p-6">
        <div className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-secondary text-foreground transition-all duration-300 group-hover:bg-foreground group-hover:text-background group-hover:rotate-6">
          <metric.icon className="size-4.5" strokeWidth={1.5} />
        </div>
        <h3 className="mb-1 text-sm font-semibold text-foreground">
          {metric.title}
        </h3>
        <p className="text-xs leading-relaxed text-muted-foreground">
          {metric.summary}
        </p>
        <div
          className={cn(
            "overflow-hidden transition-all duration-300",
            expanded ? "mt-3 max-h-32 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="border-t border-border pt-3">
            <p className="text-xs leading-relaxed text-muted-foreground">
              {metric.detail}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function CredibilitySection() {
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
            Evaluation Criteria
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            How DevProfile actually evaluates you
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            We analyze 7 key dimensions of your developer profile. Hover on any
            card to learn more.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* First row: 4 cards */}
          {metrics.slice(0, 4).map((metric, i) => (
            <MetricCard
              key={metric.title}
              metric={metric}
              index={i}
              visible={visible}
            />
          ))}
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Second row: 3 cards */}
          {metrics.slice(4).map((metric, i) => (
            <MetricCard
              key={metric.title}
              metric={metric}
              index={i + 4}
              visible={visible}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
