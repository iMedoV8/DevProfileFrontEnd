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
