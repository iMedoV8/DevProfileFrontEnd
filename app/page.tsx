"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useDevProfileStore } from "@/lib/store/devprofile-store"
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { ProblemSection } from "@/components/problem-section"
import { CredibilitySection } from "@/components/credibility-section"
import { DemoAnalysis } from "@/components/demo-analysis"
import { Features } from "@/components/features"
import { GithubSection } from "@/components/github-section"
import { HowItWorks } from "@/components/how-it-works"
import { CtaSection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function Home() {
  const router = useRouter()
  const { user } = useDevProfileStore()
  const [isMounted, setIsMounted] = useState(false)

  // Hydration safety
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Authenticated Root Redirect
  useEffect(() => {
    if (isMounted && user.isAuthenticated) {
      router.replace("/dashboard")
    }
  }, [isMounted, user.isAuthenticated, router])

  // Prevent flashing the landing page before the redirect fires
  if (!isMounted || user.isAuthenticated) {
    return null
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <ProblemSection />
      <CredibilitySection />
      <DemoAnalysis />
      <Features />
      <GithubSection />
      <HowItWorks />
      <CtaSection />
      <Footer />
    </main>
  )
}
