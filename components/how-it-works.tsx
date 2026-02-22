"use client"

import { cn } from "@/lib/utils"
import { useScrollVisible } from "@/hooks/use-scroll-visible"
import { Upload, Cpu, Rocket } from "lucide-react"

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Connect GitHub & Upload CV",
    description:
      "Connect your GitHub account and upload your CV. We securely process your data for analysis.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI Analyzes Your Real Projects",
    description:
      "Our AI evaluates code quality, technologies, contribution patterns, and experience depth.",
  },
  {
    icon: Rocket,
    step: "03",
    title: "Receive Improvement Roadmap",
    description:
      "Get a detailed report with clear, actionable steps to improve your interview chances.",
  },
]

export function HowItWorks() {
  const { ref, visible } = useScrollVisible()

  return (
    <section
      ref={ref}
      id="how-it-works"
      className="bg-secondary/50 px-6 py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <div
          className={cn(
            "mb-16 text-center transition-all duration-500",
            visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          )}
        >
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            How it works
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Three steps to a stronger profile
          </h2>
        </div>

        <div className="relative grid gap-12 md:grid-cols-3 md:gap-8">
          {/* Animated connecting line (desktop) */}
          <div
            className={cn(
              "absolute top-10 right-[16.67%] left-[16.67%] hidden h-px origin-left bg-border transition-transform duration-1000 ease-out md:block",
              visible ? "scale-x-100" : "scale-x-0"
            )}
          />

          {steps.map((step, i) => (
            <div
              key={step.title}
              className={cn(
                "relative flex flex-col items-center text-center transition-all duration-500",
                visible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-6 opacity-0"
              )}
              style={{ transitionDelay: visible ? `${i * 150}ms` : "0ms" }}
            >
              {/* Step number circle */}
              <div className="relative z-10 mb-6 flex size-20 items-center justify-center rounded-full border border-border bg-background shadow-sm">
                <step.icon
                  className="size-7 text-foreground"
                  strokeWidth={1.5}
                />
              </div>

              {/* Step label */}
              <span className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {"Step " + step.step}
              </span>

              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
