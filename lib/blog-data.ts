export interface BlogPost {
  slug: string
  title: string
  description: string
  author: string
  date: string
  readingTime: string
  category: string
  content: string
}

export const blogPosts: BlogPost[] = [
  {
    slug: "why-junior-developers-get-rejected",
    title: "Why junior developers get rejected",
    description:
      "The most common reasons junior developers fail to get past the resume screen, and what you can do about it.",
    author: "DevProfile Team",
    date: "Feb 15, 2026",
    readingTime: "6 min read",
    category: "Career",
    content: `Getting rejected from developer roles is discouraging, especially when you feel qualified. But the truth is, most junior developer applications fail at the very first stage: the resume screen.

## The resume gap

Recruiters spend an average of 7.4 seconds scanning a resume. For junior developers, this creates a problem. Without years of experience, your resume needs to communicate value in other ways. Yet most junior resumes look identical: a list of technologies, a couple of course projects, and a generic objective statement.

## What recruiters actually look for

Technical recruiters at product companies have told us they evaluate candidates on three dimensions before even scheduling an interview:

**1. Evidence of real building**
Course projects and tutorials do not count as meaningful experience. Recruiters want to see projects where you made architectural decisions, handled edge cases, and solved real problems. A deployed e-commerce app with authentication beats a to-do list every time.

**2. Code quality signals**
Before your interview, someone will look at your GitHub. They check repository structure, naming conventions, commit messages, and documentation. Clean code with good README files signals professional readiness.

**3. Growth trajectory**
Consistent GitHub activity over months is more impressive than a burst of commits before job applications. Recruiters interpret commit history as a proxy for work habits and genuine interest in engineering.

## What to do about it

Stop building more tutorial projects. Instead, focus on depth:

- Pick one project and make it production-quality
- Add tests, CI/CD, Docker configuration, and deployment
- Write documentation that explains your technical decisions
- Contribute to open source to show collaboration skills

The developers who get hired are not necessarily more talented. They are better at making their skills visible.`,
  },
  {
    slug: "what-recruiters-check-in-github",
    title: "What recruiters check in your GitHub",
    description:
      "A breakdown of exactly what technical recruiters look at when they open your GitHub profile.",
    author: "DevProfile Team",
    date: "Feb 8, 2026",
    readingTime: "5 min read",
    category: "GitHub",
    content: `Your GitHub profile is your technical portfolio. Whether you realize it or not, hiring managers are looking at it. Here is exactly what they check and what they conclude.

## The 60-second GitHub review

When a recruiter opens your GitHub, they typically spend about 60 seconds before making a judgment. Here is what they look at, in order:

### 1. Profile overview
First impression matters. They check your bio, profile README, and pinned repositories. An empty profile with default settings suggests you do not take your public presence seriously.

### 2. Pinned repositories
Most recruiters only look at 2-3 repositories. They start with your pinned repos. If you have not pinned anything, they see whatever GitHub shows by default, which might not represent your best work.

### 3. Commit frequency
The contribution graph tells a story. Consistent green squares suggest discipline and genuine interest. Long gaps suggest the profile is not actively maintained.

### 4. Repository quality
For the repos they open, recruiters check:

- **README quality**: Is there a clear description, setup instructions, and screenshots?
- **Code structure**: Is the project organized logically?
- **Recent activity**: When was the last commit?
- **Issues and PRs**: Do you use GitHub features properly?

### 5. Technology choices
The languages and frameworks in your repositories should align with the job you are applying for. A Java developer role requires visible Java projects.

## How to optimize

Pin your 3-6 best repositories. Write comprehensive README files. Make sure your most relevant work is visible and well-documented. Your GitHub is not a code dump; it is a curated portfolio.`,
  },
  {
    slug: "how-to-structure-backend-project",
    title: "How to structure your backend project",
    description:
      "A practical guide to organizing backend codebases that impress reviewers and scale with complexity.",
    author: "DevProfile Team",
    date: "Jan 28, 2026",
    readingTime: "7 min read",
    category: "Engineering",
    content: `Project structure is one of the first things experienced engineers evaluate when reviewing code. A well-structured project signals that you understand separation of concerns, maintainability, and professional development practices.

## Why structure matters

A common mistake junior developers make is putting everything in a few large files. While this works for small scripts, it breaks down quickly as complexity grows. Poor structure makes code harder to test, review, and extend.

## The layered architecture

For most backend projects, a layered architecture works well:

\`\`\`
src/
  controllers/    # Handle HTTP requests and responses
  services/       # Business logic
  repositories/   # Data access
  models/         # Data structures
  middleware/     # Cross-cutting concerns
  config/        # Configuration
  utils/         # Shared utilities
tests/
  unit/
  integration/
\`\`\`

Each layer has a single responsibility and depends only on the layer below it. Controllers call services, services call repositories, and repositories interact with the database.

## Key principles

**1. Single Responsibility**
Each file should do one thing. A controller handles the HTTP layer. A service handles business logic. Mixing these responsibilities creates tightly coupled code.

**2. Dependency injection**
Pass dependencies as parameters rather than importing them directly. This makes testing straightforward because you can inject mock implementations.

**3. Configuration management**
Never hardcode configuration values. Use environment variables and a config module that validates required values at startup.

**4. Error handling**
Create custom error classes and a centralized error handler. Each layer should throw meaningful errors, and the controller layer should translate them into appropriate HTTP responses.

## The README test

If you can write a clear README that explains your project structure, your architecture is probably sound. Document why you organized code the way you did, and what each directory contains.`,
  },
  {
    slug: "how-to-build-real-portfolio",
    title: "How to build a real portfolio",
    description:
      "Stop building to-do apps. Learn how to create portfolio projects that actually impress hiring managers.",
    author: "DevProfile Team",
    date: "Jan 18, 2026",
    readingTime: "8 min read",
    category: "Career",
    content: `Every developer needs a portfolio, but most portfolios fail to impress. The problem is not talent; it is strategy. Here is how to build a portfolio that actually gets you hired.

## The portfolio problem

Most developer portfolios contain the same projects: a to-do app, a weather app, a calculator, and maybe a personal website. These projects demonstrate basic competence, but they do not differentiate you from thousands of other candidates.

## What makes a portfolio project impressive

An impressive portfolio project has four qualities:

### 1. Real-world complexity
The project solves a real problem and involves multiple moving parts. Authentication, database operations, external API integrations, file uploads, real-time features: these are the kinds of challenges that exist in production software.

### 2. Technical depth
Rather than building 10 shallow projects, build 2-3 with real depth. A single well-architected full-stack application with tests, CI/CD, deployment, and documentation is worth more than a dozen basic CRUD apps.

### 3. Code quality
Your portfolio projects should represent your best work. This means clean code, consistent naming, proper error handling, and thoughtful architecture. Treat portfolio projects like production code.

### 4. Professional presentation
Every portfolio project needs a README with:
- Clear description of what the project does
- Screenshots or demo GIF
- Technology stack and architecture decisions
- Setup instructions
- What you learned or would do differently

## Project ideas that work

Instead of tutorials, build projects that solve problems you care about:

- A tool that helps you or your community
- A SaaS MVP with authentication and billing
- A data pipeline that processes and visualizes real data
- An open source library that solves a common problem

## The deployment requirement

An undeployed project is an incomplete project. Deploy your work to Vercel, Railway, or AWS. A live URL proves your project actually works and demonstrates DevOps awareness.

Your portfolio is not about showing everything you know. It is about proving you can ship real software.`,
  },
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug)
}
