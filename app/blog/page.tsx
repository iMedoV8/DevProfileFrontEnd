import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { blogPosts } from "@/lib/blog-data"
import Link from "next/link"
import { ArrowRight, Clock } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog - DevProfile",
  description:
    "Practical advice for developers on career growth, GitHub optimization, code quality, and building portfolios that get you hired.",
}

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="px-6 pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-16">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Blog
            </p>
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Developer insights
            </h1>
            <p className="mt-4 max-w-md text-muted-foreground">
              Practical advice on career growth, GitHub optimization, and
              building a developer identity that gets you hired.
            </p>
          </div>

          {/* Post list */}
          <div className="flex flex-col gap-6">
            {blogPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <Card className="group border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:border-foreground/10">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <Badge
                          variant="secondary"
                          className="rounded-full text-[10px] font-medium"
                        >
                          {post.category}
                        </Badge>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="size-3" />
                          {post.readingTime}
                        </span>
                      </div>
                      <h2 className="mb-2 text-lg font-semibold text-foreground group-hover:underline">
                        {post.title}
                      </h2>
                      <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                        {post.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{post.author}</span>
                        <span className="text-border">|</span>
                        <span>{post.date}</span>
                      </div>
                    </div>
                    <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1 group-hover:text-foreground" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
