import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { blogPosts, getPostBySlug } from "@/lib/blog-data"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Clock } from "lucide-react"
import type { Metadata } from "next"

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return { title: "Post not found - DevProfile" }
  return {
    title: `${post.title} - DevProfile Blog`,
    description: post.description,
  }
}

function renderContent(content: string) {
  const lines = content.split("\n")
  const elements: React.ReactNode[] = []
  let inCodeBlock = false
  let codeContent = ""

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (line.startsWith("```")) {
      if (inCodeBlock) {
        elements.push(
          <pre
            key={`code-${i}`}
            className="my-6 overflow-x-auto rounded-lg bg-foreground p-4 text-sm leading-relaxed text-primary-foreground"
          >
            <code>{codeContent.trim()}</code>
          </pre>
        )
        codeContent = ""
        inCodeBlock = false
      } else {
        inCodeBlock = true
      }
      continue
    }

    if (inCodeBlock) {
      codeContent += line + "\n"
      continue
    }

    if (line.startsWith("## ")) {
      elements.push(
        <h2
          key={i}
          className="mb-4 mt-10 text-xl font-bold tracking-tight text-foreground"
        >
          {line.slice(3)}
        </h2>
      )
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="mb-3 mt-8 text-base font-semibold text-foreground">
          {line.slice(4)}
        </h3>
      )
    } else if (line.startsWith("**") && line.endsWith("**")) {
      elements.push(
        <p key={i} className="mb-2 mt-6 text-sm font-semibold text-foreground">
          {line.slice(2, -2)}
        </p>
      )
    } else if (line.startsWith("- ")) {
      elements.push(
        <li
          key={i}
          className="ml-4 mb-1 list-disc text-sm leading-relaxed text-muted-foreground"
        >
          {line.slice(2)}
        </li>
      )
    } else if (line.trim() === "") {
      elements.push(<div key={i} className="h-3" />)
    } else {
      elements.push(
        <p key={i} className="mb-4 text-sm leading-relaxed text-muted-foreground">
          {line}
        </p>
      )
    }
  }

  return elements
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <article className="px-6 pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="mx-auto max-w-2xl">
          {/* Back link */}
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Back to blog
          </Link>

          {/* Post header */}
          <header className="mb-12">
            <div className="mb-4 flex items-center gap-3">
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
            <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {post.title}
            </h1>
            <p className="mt-4 text-muted-foreground">{post.description}</p>
            <div className="mt-6 flex items-center gap-3 border-b border-border pb-6">
              <div className="flex size-9 items-center justify-center rounded-full bg-secondary text-xs font-bold text-foreground">
                DP
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {post.author}
                </p>
                <p className="text-xs text-muted-foreground">{post.date}</p>
              </div>
            </div>
          </header>

          {/* Post content */}
          <div className="prose-devprofile">{renderContent(post.content)}</div>

          {/* Footer nav */}
          <div className="mt-16 border-t border-border pt-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
            >
              <ArrowLeft className="size-3.5" />
              All posts
            </Link>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  )
}
