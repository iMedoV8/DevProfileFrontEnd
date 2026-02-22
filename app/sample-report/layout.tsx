import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sample Developer Report - DevProfile",
  description:
    "See a full example developer analysis report. Hireability score, strengths, weaknesses, repository analysis, commit activity, and improvement roadmap.",
}

export default function SampleReportLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
