"use client"

import { Button } from "@/components/ui/button"
import { AuthModal } from "@/components/auth-modal"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useScrollVisible } from "@/hooks/use-scroll-visible"
import { useState } from "react"

export function CtaSection() {
  const { ref, visible } = useScrollVisible(0.2)
  const [authOpen, setAuthOpen] = useState(false)

  return (
    <section ref={ref} className="px-6 py-24 md:py-32">
      <div
        className={cn(
          "mx-auto max-w-4xl rounded-2xl bg-secondary p-12 text-center transition-all duration-600 md:p-20",
          visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        )}
      >
        <h2 className="text-balance text-3xl font-bold tracking-tight text-secondary-foreground md:text-4xl">
          Ready to see how companies evaluate you?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
          Join thousands of developers who have already improved their profiles
          and landed better roles.
        </p>
        <Button
          size="lg"
          className="btn-glossy mt-8 h-12 rounded-full px-8 text-base text-primary-foreground"
          onClick={() => setAuthOpen(true)}
        >
          Analyze my profile
          <ArrowRight className="ml-1 size-4" />
        </Button>
      </div>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </section>
  )
}
