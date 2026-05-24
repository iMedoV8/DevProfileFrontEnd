"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AuthModal } from "@/components/auth-modal"
import { useDevProfileStore } from "@/lib/store/devprofile-store"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import {
  Menu,
  X,
  ChevronDown,
  Brain,
  UserSearch,
  LineChart,
  FileText,
  Map,
  MessageSquare,
  LogOut,
  Settings as SettingsIcon,
  LayoutDashboard,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const coreAnalysisItems = [
  { title: "AI Powered Analysis", description: "Resume & GitHub evaluation", icon: Brain, href: "/#features" },
  { title: "Recruiter Simulation", description: "Simulated technical review", icon: UserSearch, href: "/how-it-works" },
  { title: "Hireability Score", description: "Real readiness score", icon: LineChart, href: "/sample-report" },
]



const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
]

const dashboardLinks = [
  { label: "Workspace", href: "/dashboard" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [featuresOpen, setFeaturesOpen] = useState(false)

  // Custom states for Dropdown close mechanics and Logout verification
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)

  const pathname = usePathname()
  const router = useRouter()
  const isDashboard = pathname.startsWith("/dashboard")

  // Global Store & Toaster
  const [isMounted, setIsMounted] = useState(false)
  const { user, logout } = useDevProfileStore()
  const { toast } = useToast()

  useEffect(() => { setIsMounted(true) }, [])

  // Scroll listener applying backdrop & shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Dropdowns inherently close on route change when state bound
  useEffect(() => {
    setMobileOpen(false)
    setDropdownOpen(false)
  }, [pathname])

  const handleLogoutConfirm = async () => {
    setLogoutDialogOpen(false)
    await logout()  // Clears the auth cookie server-side AND resets the store.
    localStorage.clear()

    toast({
      title: "Signed out completely",
      description: "Come back soon to continue building your profile.",
    })

    // Slight delay so the toast can render before forced navigation flushes the DOM
    setTimeout(() => {
      window.location.href = "/"
    }, 800)
  }

  const initials = user.name ? user.name.charAt(0).toUpperCase() : "D"

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-400 ease-out",
          scrolled || isDashboard
            ? "bg-background/70 backdrop-blur-2xl border-b border-border shadow-sm"
            : "bg-transparent backdrop-blur-none"
        )}
      >
        <nav className={cn(
          "mx-auto flex items-center justify-between px-6 py-4",
          isDashboard ? "px-6 md:px-8 w-full" : "max-w-6xl"
        )}>
          {/* Logo with Workspace Badge */}
          <div className="flex items-center gap-3">
            <Link
              href={isDashboard ? "/dashboard" : "/"}
              className="text-lg font-bold tracking-tight text-foreground transition-transform hover:-translate-y-[1px]"
            >
              DevProfile
            </Link>
            {isDashboard && (
              <span className="hidden sm:inline-flex rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-primary">
                WORKSPACE
              </span>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            {isDashboard ? ( // Dashboard Pill Links
              <div className="flex items-center gap-1">
                {dashboardLinks.map((link) => {
                  const isActive = pathname === link.href || (link.href === "/dashboard" && pathname.startsWith("/dashboard") && pathname !== "/dashboard")
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={cn(
                        "relative px-3 py-2 text-sm transition-all duration-200 hover:-translate-y-[1px] rounded-full group",
                        isActive ? "text-foreground font-medium bg-secondary" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <span className="relative z-10">{link.label}</span>
                    </Link>
                  )
                })}
              </div>
            ) : ( // Original Marketing Feature Tree
              navLinks.map((link) => {
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

                    <div
                      className={cn(
                        "absolute left-1/2 top-full w-[320px] -translate-x-1/2 pt-2 transition-all duration-200 ease-out",
                        featuresOpen
                          ? "pointer-events-auto translate-y-0 opacity-100"
                          : "pointer-events-none -translate-y-2 opacity-0"
                      )}
                    >
                      <div className="rounded-2xl border border-border bg-background/90 backdrop-blur-xl p-3 shadow-xl">
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
              })
            )}
          </div>

          {/* Desktop Auth Area */}
          <div className="hidden items-center gap-4 md:flex">
            {!isMounted ? (
              <div className="size-9 rounded-full bg-accent animate-pulse" />
            ) : user.isAuthenticated ? (
              <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger className="relative size-9 rounded-full outline-none transition-all duration-200 hover:ring-2 hover:ring-primary/50 hover:scale-105 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ring-offset-background cursor-pointer">
                  <Avatar className="size-9 border border-border">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  {/* Online Indicator Box Overlay */}
                  <div className="absolute bottom-0 right-0 size-2.5 rounded-full bg-green-500 border-2 border-background" />
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-2">
                      <p className="text-sm font-medium leading-none">{user.name || "User"}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        Signed in as {user.email || "No email available"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer w-full flex items-center">
                      <LayoutDashboard className="mr-2 size-4 text-muted-foreground" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="cursor-pointer w-full flex items-center">
                      <SettingsIcon className="mr-2 size-4 text-muted-foreground" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                    onSelect={(e: Event) => {
                      e.preventDefault()
                      setDropdownOpen(false)
                      setLogoutDialogOpen(true)
                    }}
                  >
                    <LogOut className="mr-2 size-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
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
                  <span className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:duration-1000 group-hover:translate-x-[150%] transition-transform ease-out" />
                </Button>
              </>
            )}
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

        {/* Mobile Menu Content */}
        <div
          className={cn(
            "overflow-hidden border-b border-border bg-background/95 backdrop-blur-2xl transition-all duration-400 ease-in-out md:hidden",
            mobileOpen ? "max-h-[800px] opacity-100" : "max-h-0 border-none opacity-0"
          )}
        >
          <div className="flex flex-col gap-2 px-6 py-6">
            {isDashboard ? ( // DYNAMIC DASHBOARD MOBILE MENU
              <>
                <div className="flex items-center gap-3 px-3 py-2 mb-2 bg-secondary/30 rounded-xl">
                  <div className="relative">
                    <Avatar className="size-9 border border-border">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 size-2.5 rounded-full bg-green-500 border-2 border-background" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{user.name || "User"}</span>
                    <span className="text-xs text-muted-foreground">{user.email || "No email"}</span>
                  </div>
                </div>

                <Link
                  href="/dashboard"
                  className={cn(
                    "flex items-center gap-2 block rounded-xl px-3 py-3 text-sm font-medium transition-colors hover:bg-accent",
                    pathname === "/dashboard" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <LayoutDashboard className="size-4" />
                  Dashboard
                </Link>

                <Link
                  href="/dashboard/settings"
                  className={cn(
                    "flex items-center gap-2 block rounded-xl px-3 py-3 text-sm font-medium transition-colors hover:bg-accent",
                    pathname === "/dashboard/settings" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <SettingsIcon className="size-4" />
                  Settings
                </Link>

                <div className="my-2 h-px w-full bg-border/50" />

                <button
                  onClick={() => {
                    setMobileOpen(false)
                    setLogoutDialogOpen(true)
                  }}
                  className="flex items-center gap-2 block w-full text-left rounded-xl px-3 py-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                >
                  <LogOut className="size-4" />
                  Log out
                </button>
              </>
            ) : ( // ORIGINAL MARKETING MOBILE MENU
              <>
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
                  {!isMounted ? (
                    <div className="h-24 w-full bg-accent animate-pulse rounded-xl" />
                  ) : user.isAuthenticated ? (
                    <Button
                      className="w-full h-11 rounded-xl text-primary-foreground font-medium btn-glossy relative overflow-hidden group"
                      onClick={() => router.push("/dashboard")}
                    >
                      <LayoutDashboard className="mr-2 size-4" />
                      <span className="relative z-10">Open Workspace</span>
                      <span className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/20 to-transparent group-active:duration-1000 group-active:translate-x-[150%] transition-transform ease-out" />
                    </Button>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />

      <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
            <AlertDialogDescription>
              Your analysis progress is saved safely. You can return at any time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogoutConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Log out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
