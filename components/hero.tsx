"use client"

import { Button } from "@/components/ui/button"
import { AuthModal } from "@/components/auth-modal"
import { ArrowRight, Upload, Github } from "lucide-react"
import { useState, useEffect, useCallback, useRef } from "react"

function FloatingParticles() {
  const [particles, setParticles] = useState<
    { id: number; left: string; top: string; size: number; delay: string; duration: string; reverse: boolean }[]
  >([])

  useEffect(() => {
    setParticles(
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: `${5 + Math.random() * 90}%`,
        top: `${10 + Math.random() * 80}%`,
        size: 2 + Math.random() * 3,
        delay: `${Math.random() * 8}s`,
        duration: `${6 + Math.random() * 8}s`,
        reverse: i % 2 === 0,
      }))
    )
  }, [])

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

function AnimatedScore() {
  const [score, setScore] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true
    const target = 72
    let current = 0
    const timer = setInterval(() => {
      current += 1
      setScore(current)
      if (current >= target) clearInterval(timer)
    }, 25)
    return () => clearInterval(timer)
  }, [])

  const radius = 40
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="100" height="100" className="-rotate-90">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          className="text-border"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          className="text-foreground transition-all duration-300 ease-out"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-xl font-bold text-foreground">{score}</span>
        <span className="text-[9px] uppercase tracking-widest text-muted-foreground">
          Score
        </span>
      </div>
    </div>
  )
}

export function Hero() {
  const [authOpen, setAuthOpen] = useState(false)
  const [username, setUsername] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const [fileName, setFileName] = useState("")

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files?.[0]) {
      setFileName(e.dataTransfer.files[0].name)
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFileName(e.target.files[0].name)
    }
  }, [])

  const handleSubmit = useCallback(() => {
    setAuthOpen(true)
  }, [])

  return (
    <section className="relative flex min-h-[94vh] items-center justify-center overflow-hidden px-6 pt-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(to right, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <FloatingParticles />

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        {/* Badge */}
        <div className="animate-fade-in-up mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm text-muted-foreground opacity-0">
          <span className="inline-block size-1.5 rounded-full bg-foreground" />
          AI-Powered Developer Analysis
        </div>

        {/* Heading */}
        <h1 className="animate-fade-in-up animation-delay-100 text-balance text-4xl font-bold leading-tight tracking-tight text-foreground opacity-0 sm:text-5xl md:text-6xl lg:text-7xl">
          Build Your Developer Identity,{" "}
          <span className="text-muted-foreground">Not Just a Resume</span>
        </h1>

        {/* Subheading */}
        <p className="animate-fade-in-up animation-delay-200 mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground opacity-0 md:text-xl">
          Upload your resume and connect your GitHub. Our AI analyzes your real
          coding skills and shows exactly how recruiters evaluate you.
        </p>

        {/* Input Form */}
        <div className="animate-fade-in-up animation-delay-300 mx-auto mt-10 max-w-xl opacity-0">
          <div className="flex flex-col gap-3">
            {/* GitHub username input */}
            <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 shadow-sm transition-all focus-within:border-foreground/20 focus-within:shadow-md">
              <Github className="size-5 shrink-0 text-muted-foreground" />
              <input
                type="text"
                placeholder="Enter your GitHub username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>

            {/* Resume upload */}
            <label
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-xl border border-dashed px-4 py-3 text-sm transition-all",
                dragActive
                  ? "border-foreground/30 bg-secondary"
                  : "border-border bg-card hover:border-foreground/20",
                fileName && "border-foreground/20 bg-secondary/50"
              )}
            >
              <Upload className="size-5 shrink-0 text-muted-foreground" />
              <span className={cn("text-muted-foreground", fileName && "text-foreground")}>
                {fileName || "Drag & drop your resume or click to upload"}
              </span>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleFileSelect}
              />
            </label>

            {/* Submit CTA */}
            <Button
              size="lg"
              className="btn-glossy h-12 rounded-xl text-base text-primary-foreground"
              onClick={handleSubmit}
            >
              Analyze my profile
              <ArrowRight className="ml-1 size-4" />
            </Button>
          </div>
        </div>

        {/* Animated Score Preview */}
        <div className="animate-fade-in-up animation-delay-500 mt-12 flex flex-col items-center gap-2 opacity-0">
          <AnimatedScore />
          <p className="text-xs text-muted-foreground">
            Average hireability score of analyzed profiles
          </p>
        </div>
      </div>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </section>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
