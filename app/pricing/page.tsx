"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AuthModal } from "@/components/auth-modal"
import { Check, ArrowRight, Minus } from "lucide-react"
import { useState } from "react"

export default function PricingPage() {
  const [authOpen, setAuthOpen] = useState(false)

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
      price: "$5",
      period: "/ month",
      description: "Everything you need to land interviews",
      features: [
        "Unlimited analyses",
        "Improvement roadmap",
        "Recruiter simulation",
        "PDF export",
        "Priority support",
      ],
      cta: "Start Pro Plan",
      highlighted: true,
    },
  ]

  const comparison = [
    { feature: "Profile analyses", free: "1", pro: "Unlimited" },
    { feature: "Hireability score", free: true, pro: true },
    { feature: "Technology detection", free: true, pro: true },
    { feature: "Basic feedback", free: true, pro: true },
    { feature: "Improvement roadmap", free: false, pro: true },
    { feature: "Recruiter simulation", free: false, pro: true },
    { feature: "PDF report export", free: false, pro: true },
    { feature: "Priority support", free: false, pro: true },
    { feature: "Historical comparisons", free: false, pro: true },
  ]

  const faqs = [
    {
      q: "Can I cancel anytime?",
      a: "Yes. Cancel your subscription at any time from your account settings. No questions asked, no cancellation fees.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept all major credit cards through Stripe. Your payment information is encrypted and never stored on our servers.",
    },
    {
      q: "Is the free plan really free?",
      a: "Absolutely. The free plan includes one full analysis with a hireability score and basic feedback. No credit card required.",
    },
    {
      q: "Do you offer student discounts?",
      a: "We are working on a student discount program. Contact us with your .edu email for early access to discounted pricing.",
    },
    {
      q: "What happens to my data?",
      a: "We only read public GitHub data. Your resume is processed securely and never shared. You can delete your data at any time.",
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="px-6 pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-16 text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Pricing
            </p>
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Simple, transparent pricing
            </h1>
            <p className="mx-auto mt-4 max-w-md text-muted-foreground">
              Start free and upgrade when you need more. No hidden fees, cancel
              anytime.
            </p>
          </div>

          {/* Plan Cards */}
          <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={
                  plan.highlighted
                    ? "relative border-foreground bg-foreground shadow-xl"
                    : "border-border bg-card"
                }
              >
                {plan.highlighted && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-background px-4 py-1 text-xs font-semibold text-foreground">
                    Most Popular
                  </Badge>
                )}
                <CardContent className="p-8">
                  <h3
                    className={
                      plan.highlighted
                        ? "text-lg font-semibold text-primary-foreground"
                        : "text-lg font-semibold text-foreground"
                    }
                  >
                    {plan.name}
                  </h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span
                      className={
                        plan.highlighted
                          ? "text-4xl font-bold text-primary-foreground"
                          : "text-4xl font-bold text-foreground"
                      }
                    >
                      {plan.price}
                    </span>
                    <span
                      className={
                        plan.highlighted
                          ? "text-sm text-primary-foreground/60"
                          : "text-sm text-muted-foreground"
                      }
                    >
                      {plan.period}
                    </span>
                  </div>
                  <p
                    className={
                      plan.highlighted
                        ? "mt-2 text-sm text-primary-foreground/70"
                        : "mt-2 text-sm text-muted-foreground"
                    }
                  >
                    {plan.description}
                  </p>

                  <ul className="mt-8 flex flex-col gap-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2.5">
                        <Check
                          className={
                            plan.highlighted
                              ? "size-4 shrink-0 text-primary-foreground"
                              : "size-4 shrink-0 text-foreground"
                          }
                        />
                        <span
                          className={
                            plan.highlighted
                              ? "text-sm text-primary-foreground/80"
                              : "text-sm text-muted-foreground"
                          }
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={
                      plan.highlighted
                        ? "mt-8 h-11 w-full rounded-full text-sm font-medium bg-background text-foreground hover:bg-background/90"
                        : "mt-8 h-11 w-full rounded-full text-sm font-medium btn-glossy text-primary-foreground"
                    }
                    onClick={() => setAuthOpen(true)}
                  >
                    {plan.cta}
                    <ArrowRight className="ml-1 size-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="mx-auto mt-24 max-w-3xl">
            <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-foreground">
              Compare plans
            </h2>
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Feature
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">
                      Free
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">
                      Pro
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row, i) => (
                    <tr
                      key={row.feature}
                      className={i < comparison.length - 1 ? "border-b border-border" : ""}
                    >
                      <td className="px-6 py-3.5 text-sm text-foreground">
                        {row.feature}
                      </td>
                      <td className="px-6 py-3.5 text-center">
                        {typeof row.free === "string" ? (
                          <span className="text-sm text-muted-foreground">
                            {row.free}
                          </span>
                        ) : row.free ? (
                          <Check className="mx-auto size-4 text-foreground" />
                        ) : (
                          <Minus className="mx-auto size-4 text-muted-foreground/40" />
                        )}
                      </td>
                      <td className="px-6 py-3.5 text-center">
                        {typeof row.pro === "string" ? (
                          <span className="text-sm font-medium text-foreground">
                            {row.pro}
                          </span>
                        ) : row.pro ? (
                          <Check className="mx-auto size-4 text-foreground" />
                        ) : (
                          <Minus className="mx-auto size-4 text-muted-foreground/40" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ */}
          <div className="mx-auto mt-24 max-w-2xl">
            <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-foreground">
              Billing FAQ
            </h2>
            <div className="flex flex-col gap-6">
              {faqs.map((faq) => (
                <div key={faq.q}>
                  <h3 className="mb-2 text-sm font-semibold text-foreground">
                    {faq.q}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </main>
  )
}
