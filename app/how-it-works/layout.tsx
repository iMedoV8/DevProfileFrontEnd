import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "How It Works - DevProfile",
  description:
    "Learn how DevProfile analyzes your resume and GitHub profile. Understand the AI pipeline from data ingestion to your personalized improvement roadmap.",
}

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
