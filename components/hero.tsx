"use client"

import { Button } from "@/components/ui/button"
import { AuthModal } from "@/components/auth-modal"
import { CheckCircle2, ArrowRight } from "lucide-react"
import { useState } from "react"

const trustIndicators = [
  "No credit card required",
  "Free portfolio analysis",
  "Takes less than 2 minutes",
]

function FloatingParticles() {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${5 + Math.random() * 90}%`,
    top: `${10 + Math.random() * 80}%`,
    size: 2 + Math.random() * 3,
    delay: `${Math.random() * 8}s`,
    duration: `${6 + Math.random() * 8}s`,
    reverse: i % 2 === 0,
  }))

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-foreground/10"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animation: `${p.reverse ? "float-particle-reverse" : "float-particle"} ${p.duration} ease-in-out ${p.delay} infinite`,
          }}
        />
      ))}
    </div>
  )
}

export function Hero() {
  const [authOpen, setAuthOpen] = useState(false)

  return (
    <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden px-6 pt-24">
      {/* Subtle background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(to right, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating particles */}
      <FloatingParticles />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Badge */}
        {/* <div className="animate-fade-in-up mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm text-muted-foreground opacity-0">
          <span className="inline-block size-1.5 rounded-full bg-foreground" />
          AI-Powered Developer Analysis
        </div> */}

        {/* Heading */}
        <h1 className="animate-fade-in-up animation-delay-100 text-balance text-4xl font-bold leading-tight tracking-tight text-foreground opacity-0 sm:text-5xl md:text-6xl lg:text-7xl">
          Build Your Developer Identity, Not Just a Resume
        </h1>

        {/* Subheading */}
        <p className="animate-fade-in-up animation-delay-200 mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground opacity-0 md:text-xl">
          Upload your resume and GitHub profile. DevProfile analyzes your real
          coding skills and shows exactly how recruiters evaluate you.
        </p>

        {/* CTA Buttons */}
        <div className="animate-fade-in-up animation-delay-300 mt-10 flex flex-col items-center justify-center gap-4 opacity-0 sm:flex-row">
          <Button
            size="lg"
            className="btn-glossy h-12 rounded-full px-8 text-base text-primary-foreground"
            onClick={() => setAuthOpen(true)}
          >
            Get Started Free
            <ArrowRight className="ml-1 size-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-12 rounded-full px-8 text-base transition-all duration-200 hover:scale-[1.04] active:scale-[0.96]"
            onClick={() => {
              document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
            }}
          >
            Explore Features
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="animate-fade-in-up animation-delay-400 mt-12 flex flex-col items-center justify-center gap-4 opacity-0 sm:flex-row sm:gap-6">
          {trustIndicators.map((text) => (
            <div
              key={text}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <CheckCircle2 className="size-4 text-foreground" />
              {text}
            </div>
          ))}
        </div>
      </div>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </section>
  )
}
