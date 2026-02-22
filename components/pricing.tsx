"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AuthModal } from "@/components/auth-modal"
import { cn } from "@/lib/utils"
import { useScrollVisible } from "@/hooks/use-scroll-visible"
import { Check, ArrowRight } from "lucide-react"
import { useState } from "react"

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with a basic analysis",
    features: [
      "1 analysis",
      "Basic feedback",
      "Hireability score",
      "Technology detection",
    ],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/ month",
    description: "Everything you need to land interviews",
    features: [
      "Unlimited analyses",
      "Detailed improvement plan",
      "Recruiter simulation",
      "Priority support",
      "Export reports as PDF",
    ],
    cta: "Start Pro Plan",
    highlighted: true,
  },
]

export function Pricing() {
  const { ref, visible } = useScrollVisible()
  const [authOpen, setAuthOpen] = useState(false)

  return (
    <section ref={ref} id="pricing" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-4xl">
        <div
          className={cn(
            "mb-16 text-center transition-all duration-500",
            visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          )}
        >
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Pricing
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Simple pricing
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            Start free and upgrade when you need more. No hidden fees.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {plans.map((plan, i) => (
            <Card
              key={plan.name}
              className={cn(
                "relative border transition-all duration-500 hover:-translate-y-1 hover:shadow-lg",
                plan.highlighted
                  ? "border-foreground bg-foreground shadow-xl"
                  : "border-border bg-card",
                visible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-6 opacity-0"
              )}
              style={{ transitionDelay: visible ? `${i * 120}ms` : "0ms" }}
            >
              {plan.highlighted && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-background px-4 py-1 text-xs font-semibold text-foreground">
                  Most Popular
                </Badge>
              )}
              <CardContent className="p-8">
                <h3
                  className={cn(
                    "text-lg font-semibold",
                    plan.highlighted
                      ? "text-primary-foreground"
                      : "text-foreground"
                  )}
                >
                  {plan.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span
                    className={cn(
                      "text-4xl font-bold",
                      plan.highlighted
                        ? "text-primary-foreground"
                        : "text-foreground"
                    )}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={cn(
                      "text-sm",
                      plan.highlighted
                        ? "text-primary-foreground/60"
                        : "text-muted-foreground"
                    )}
                  >
                    {plan.period}
                  </span>
                </div>
                <p
                  className={cn(
                    "mt-2 text-sm",
                    plan.highlighted
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  )}
                >
                  {plan.description}
                </p>

                <ul className="mt-8 flex flex-col gap-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5">
                      <Check
                        className={cn(
                          "size-4 shrink-0",
                          plan.highlighted
                            ? "text-primary-foreground"
                            : "text-foreground"
                        )}
                      />
                      <span
                        className={cn(
                          "text-sm",
                          plan.highlighted
                            ? "text-primary-foreground/80"
                            : "text-muted-foreground"
                        )}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={cn(
                    "mt-8 h-11 w-full rounded-full text-sm font-medium transition-all duration-200 hover:scale-[1.04] active:scale-[0.96]",
                    plan.highlighted
                      ? "bg-background text-foreground hover:bg-background/90"
                      : "btn-glossy text-primary-foreground"
                  )}
                  onClick={() => setAuthOpen(true)}
                >
                  {plan.cta}
                  <ArrowRight className="ml-1 size-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </section>
  )
}
