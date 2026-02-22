import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pricing - DevProfile",
  description:
    "Simple, transparent pricing for DevProfile. Start free and upgrade when you need unlimited analyses, recruiter simulations, and PDF exports.",
}

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
