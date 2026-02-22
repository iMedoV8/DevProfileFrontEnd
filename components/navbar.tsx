"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AuthModal } from "@/components/auth-modal"
import { cn } from "@/lib/utils"
import { Menu, X, ChevronDown, Brain, UserSearch, LineChart, FileText, Map, MessageSquare } from "lucide-react"

const coreAnalysisItems = [
  {
    title: "AI Powered Analysis",
    description: "Resume & GitHub evaluation",
    icon: Brain,
    href: "/#features",
  },
  {
    title: "Recruiter Simulation",
    description: "Simulated technical review",
    icon: UserSearch,
    href: "/how-it-works",
  },
  {
    title: "Hireability Score",
    description: "Real readiness score",
    icon: LineChart,
    href: "/sample-report",
  },
]

const outputItems = [
  {
    title: "Sample Report",
    description: "Preview your feedback",
    icon: FileText,
    href: "/sample-report",
  },
  {
    title: "Improvement Roadmap",
    description: "Step-by-step plan",
    icon: Map,
    href: "/#roadmap",
  },
  {
    title: "Interview Preparation",
    description: "What recruiters will ask",
    icon: MessageSquare,
    href: "/#interview",
  },
]

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [featuresOpen, setFeaturesOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-400 ease-out",
          scrolled
            ? "bg-background/70 backdrop-blur-2xl border-b border-border shadow-sm"
            : "bg-transparent backdrop-blur-none"
        )}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-foreground transition-transform hover:-translate-y-[1px]"
          >
            DevProfile
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href

              return link.label === "Features" ? (
                <div
                  key={link.label}
                  className="relative group"
                  onMouseEnter={() => setFeaturesOpen(true)}
                  onMouseLeave={() => setFeaturesOpen(false)}
                >
                  <button
                    onClick={() => setFeaturesOpen(!featuresOpen)}
                    className="relative flex items-center gap-1 px-3 py-2 text-sm transition-all duration-200 hover:-translate-y-[1px] group outline-none"
                  >
                    <span className={cn(
                      "relative z-10 transition-colors duration-200",
                      featuresOpen || isActive ? "text-foreground font-medium" : "text-muted-foreground group-hover:text-foreground"
                    )}>
                      Features
                    </span>
                    <ChevronDown
                      className={cn(
                        "relative z-10 size-4 transition-transform duration-300 ease-out",
                        featuresOpen ? "rotate-180 text-foreground" : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                    {(isActive || featuresOpen) && (
                      <span className="absolute inset-0 z-0 rounded-full bg-accent" />
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  <div
                    className={cn(
                      "absolute left-1/2 top-full w-[320px] -translate-x-1/2 pt-2 transition-all duration-200 ease-out",
                      featuresOpen
                        ? "pointer-events-auto translate-y-0 opacity-100"
                        : "pointer-events-none -translate-y-2 opacity-0"
                    )}
                  >
                    <div className="rounded-2xl border border-border bg-background/90 backdrop-blur-xl p-3 shadow-xl">
                      {/* Core Analysis Section */}
                      <div className="mb-1">
                        <div className="mb-2 px-2 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                          Core Analysis
                        </div>
                        <div className="flex flex-col gap-0.5">
                          {coreAnalysisItems.map((item) => (
                            <Link
                              key={item.title}
                              href={item.href}
                              className="group/item flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-accent focus:bg-accent"
                              onClick={() => setFeaturesOpen(false)}
                            >
                              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-foreground group-hover/item:bg-background group-hover/item:border group-hover/item:border-border transition-colors">
                                <item.icon className="size-4.5" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-foreground">{item.title}</span>
                                <span className="text-xs text-muted-foreground transition-colors group-hover/item:text-foreground/80">{item.description}</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>

                      <div className="my-2 h-px bg-border/60" />

                      {/* Outputs Section */}
                      <div>
                        <div className="mb-2 px-2 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                          Outputs
                        </div>
                        <div className="flex flex-col gap-0.5">
                          {outputItems.map((item) => (
                            <Link
                              key={item.title}
                              href={item.href}
                              className="group/item flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-accent focus:bg-accent"
                              onClick={() => setFeaturesOpen(false)}
                            >
                              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-foreground group-hover/item:bg-background group-hover/item:border group-hover/item:border-border transition-colors">
                                <item.icon className="size-4.5" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-foreground">{item.title}</span>
                                <span className="text-xs text-muted-foreground transition-colors group-hover/item:text-foreground/80">{item.description}</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="relative px-3 py-2 text-sm transition-all duration-200 hover:-translate-y-[1px] group"
                >
                  <span className={cn(
                    "relative z-10 transition-colors duration-200",
                    isActive ? "text-foreground font-medium" : "text-muted-foreground group-hover:text-foreground"
                  )}>
                    {link.label}
                  </span>
                  {isActive && (
                    <span className="absolute inset-0 z-0 rounded-full bg-accent" />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-3 md:flex">
            <Button
              variant="ghost"
              size="sm"
              className="text-sm font-medium text-muted-foreground transition-all duration-200 hover:-translate-y-[1px] hover:bg-accent hover:text-foreground"
              onClick={() => setAuthOpen(true)}
            >
              Sign in
            </Button>
            <Button
              size="sm"
              className="group relative overflow-hidden rounded-full px-5 font-medium text-primary-foreground btn-glossy transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
              onClick={() => setAuthOpen(true)}
            >
              <span className="relative z-10">Get started</span>
              {/* Subtle hover shine effect */}
              <span className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:duration-1000 group-hover:translate-x-[150%] transition-transform ease-out" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="rounded-lg p-2 text-foreground md:hidden transition-transform active:scale-95"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        <div
          className={cn(
            "overflow-hidden border-b border-border bg-background/95 backdrop-blur-2xl transition-all duration-400 ease-in-out md:hidden",
            mobileOpen ? "max-h-[800px] opacity-100" : "max-h-0 border-none opacity-0"
          )}
        >
          <div className="flex flex-col gap-2 px-6 py-6">
            {navLinks.map((link, index) => {
              const isActive = pathname === link.href

              return link.label === "Features" ? (
                <div key="features-mobile" className="flex flex-col mb-2">
                  <div className="rounded-xl px-3 py-2 text-sm font-semibold tracking-wide text-foreground">
                    Features
                  </div>
                  <div className="mt-1 flex flex-col space-y-2 border-l-2 border-border/50 pl-4 ml-3">
                    <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mt-2 mb-1">Core Analysis</div>
                    {coreAnalysisItems.map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        className="rounded-lg py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.title}
                      </Link>
                    ))}
                    <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mt-3 mb-1">Outputs</div>
                    {outputItems.map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        className="rounded-lg py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                  {index !== navLinks.length - 1 && <div className="mt-4 h-px w-full bg-border/50" />}
                </div>
              ) : (
                <div key={link.label}>
                  <Link
                    href={link.href}
                    className={cn(
                      "block rounded-xl px-3 py-3 text-sm transition-colors hover:bg-accent",
                      isActive
                        ? "bg-accent text-foreground font-semibold"
                        : "text-muted-foreground font-medium hover:text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                  {index !== navLinks.length - 1 && <div className="my-2 h-px w-full bg-border/50" />}
                </div>
              )
            })}

            <div className="mt-6 flex flex-col gap-3">
              <Button
                variant="outline"
                className="w-full h-11 rounded-xl font-medium"
                onClick={() => {
                  setMobileOpen(false)
                  setAuthOpen(true)
                }}
              >
                Sign in
              </Button>
              <Button
                className="w-full h-11 rounded-xl text-primary-foreground font-medium btn-glossy relative overflow-hidden group"
                onClick={() => {
                  setMobileOpen(false)
                  setAuthOpen(true)
                }}
              >
                <span className="relative z-10">Get started</span>
                <span className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/20 to-transparent group-active:duration-1000 group-active:translate-x-[150%] transition-transform ease-out" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </>
  )
}
