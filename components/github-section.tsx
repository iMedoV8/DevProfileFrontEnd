"use client"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useScrollVisible } from "@/hooks/use-scroll-visible"
import { Github, GitBranch, Code2, Activity, FolderGit2 } from "lucide-react"

const capabilities = [
  { icon: FolderGit2, text: "Scans repositories and project structure" },
  { icon: Code2, text: "Detects technologies and frameworks used" },
  { icon: GitBranch, text: "Evaluates coding patterns and quality" },
  { icon: Activity, text: "Checks commit activity and consistency" },
]

const mockRepos = [
  {
    name: "spring-ecommerce",
    lang: "Java",
    stars: 3,
    commits: 142,
    updated: "2 days ago",
  },
  {
    name: "portfolio-api",
    lang: "TypeScript",
    stars: 1,
    commits: 67,
    updated: "1 week ago",
  },
  {
    name: "chat-app",
    lang: "Python",
    stars: 0,
    commits: 34,
    updated: "3 weeks ago",
  },
]

export function GithubSection() {
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
            GitHub Integration
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Connect GitHub. We analyze real code.
          </h2>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left: capabilities */}
          <div
            className={cn(
              "transition-all duration-500",
              visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            )}
          >
            <div className="mb-8 inline-flex size-14 items-center justify-center rounded-2xl bg-secondary text-foreground">
              <Github className="size-6" strokeWidth={1.5} />
            </div>
            <p className="mb-8 max-w-md text-muted-foreground leading-relaxed">
              We connect to your GitHub to analyze your actual code, not what you
              claim on your resume. Our AI reviews every repository in detail.
            </p>
            <div className="flex flex-col gap-4">
              {capabilities.map((cap, i) => (
                <div
                  key={cap.text}
                  className={cn(
                    "flex items-center gap-3 transition-all duration-500",
                    visible
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-4 opacity-0"
                  )}
                  style={{
                    transitionDelay: visible ? `${200 + i * 100}ms` : "0ms",
                  }}
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
                    <cap.icon className="size-4 text-foreground" />
                  </div>
                  <span className="text-sm text-foreground">{cap.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Mock GitHub UI */}
          <Card
            className={cn(
              "overflow-hidden border border-border bg-card shadow-lg transition-all duration-700",
              visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            )}
            style={{ transitionDelay: visible ? "200ms" : "0ms" }}
          >
            {/* Mock header */}
            <div className="flex items-center gap-3 border-b border-border px-6 py-4">
              <Github className="size-5 text-foreground" />
              <span className="text-sm font-medium text-foreground">
                alex-kovac
              </span>
              <Badge
                variant="secondary"
                className="ml-auto rounded-full text-xs"
              >
                3 repos
              </Badge>
            </div>

            {/* Mock repositories */}
            <div className="divide-y divide-border">
              {mockRepos.map((repo) => (
                <div
                  key={repo.name}
                  className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-accent/50"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <FolderGit2 className="size-3.5 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">
                        {repo.name}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {"Updated " + repo.updated}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="rounded-full text-xs">
                      {repo.lang}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {repo.commits + " commits"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Mock footer */}
            <div className="border-t border-border bg-secondary/30 px-6 py-3">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-foreground" />
                <span className="text-xs text-muted-foreground">
                  Analyzing repositories...
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
