"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useScrollVisible } from "@/hooks/use-scroll-visible"
import { Brain, UserSearch, TrendingUp, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useCallback, useRef, useState } from "react"

const features = [
  {
    icon: Brain,
    title: "AI Powered Analysis",
    description:
      "Analyzes resume + GitHub repositories to evaluate real skill level, not just keywords.",
    href: "/#features",
  },
  {
    icon: UserSearch,
    title: "Recruiter Simulation",
    description:
      "Simulates a real technical recruiter review and identifies weaknesses before they do.",
    href: "/how-it-works",
  },
  {
    icon: TrendingUp,
    title: "Hireability Score",
    description:
      "Generates a score and personalized improvement roadmap tailored to your target roles.",
    href: "/sample-report",
  },
]

function FeatureCard({
  feature,
  index,
  visible,
}: {
  feature: (typeof features)[0]
  index: number
  visible: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }, [])

  return (
    <Link href={feature.href} className="block w-full h-full outline-none">
      <Card
        ref={cardRef}
        className={cn(
          "h-full group relative overflow-hidden border border-border bg-card transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:border-foreground/10 cursor-pointer",
          visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        )}
      style={{
        transitionDelay: visible ? `${index * 120}ms` : "0ms",
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Cursor-tracking light reflection */}
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0,0,0,0.03), transparent 60%)`,
          }}
        />
      )}

      <CardContent className="relative p-8">
        <div className="mb-5 inline-flex size-12 items-center justify-center rounded-xl bg-secondary text-foreground transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-foreground group-hover:text-background">
          <feature.icon className="size-5" strokeWidth={1.5} />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          {feature.title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {feature.description}
        </p>
        <div className="mt-4 flex items-center gap-1 text-sm font-medium text-foreground opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
          See example <ArrowRight className="size-3.5" />
        </div>
      </CardContent>
    </Card>
    </Link>
  )
}

export function Features() {
  const { ref, visible } = useScrollVisible()

  return (
    <section ref={ref} id="features" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div
          className={cn(
            "mb-16 text-center transition-all duration-500",
            visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          )}
        >
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Features
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Why developers choose DevProfile
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, i) => (
            <FeatureCard
              key={feature.title}
              feature={feature}
              index={i}
              visible={visible}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
