import {
    AnalysisResult,
    GithubData,
    ResumeData,
    RoadmapWeek,
    ScoreBreakdown,
} from "../types/devprofile-types"

/**
 * Simulates a network delay for the mock backend.
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const connectGithubService = async (username: string): Promise<GithubData> => {
    await delay(1500) // Simulating OAuth and data fetching latency

    // 20% chance to simulate a rate limit error
    if (Math.random() < 0.2) {
        throw new Error("GitHub API rate limit exceeded. Please try again later.")
    }

    return {
        isConnected: true,
        username,
        repositories: [
            {
                id: "repo-1",
                name: "nextjs-dashboard",
                description: "Admin dashboard utilizing server actions and Tailwind CSS",
                stars: 12,
                language: "TypeScript",
                updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
            },
            {
                id: "repo-2",
                name: "go-microservice",
                description: "High-performance payment processor mock",
                stars: 45,
                language: "Go",
                updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(), // 15 days ago
            },
            {
                id: "repo-3",
                name: "react-native-app",
                description: "Mobile e-commerce application",
                stars: 8,
                language: "TypeScript",
                updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(), // 45 days ago
            },
            {
                id: "repo-4",
                name: "personal-portfolio",
                description: "My personal website",
                stars: 2,
                language: "HTML",
                updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120).toISOString(),
            },
        ],
        languages: ["TypeScript", "Go", "JavaScript", "HTML", "CSS"],
    }
}

export const uploadResumeService = async (file: File): Promise<ResumeData> => {
    await delay(2000) // Simulating file upload and PDF parsing

    // 20% chance to simulate a parsing error
    if (Math.random() < 0.2) {
        throw new Error("Failed to parse PDF structure. The file might be corrupted or in an unsupported format.")
    }

    return {
        uploaded: true,
        filename: file.name,
        uploadedAt: new Date().toISOString(),
        skills: ["React", "TypeScript", "Node.js", "Docker", "PostgreSQL", "Go"],
        warnings: [
            "No active open-source contributions listed in the experience section.",
            "Missing dedicated section for System Design or Cloud Architecture.",
            "Description of past roles lacks quantifiable metrics (e.g., 'improved performance by X%').",
        ],
    }
}

export const runAnalysisService = async (): Promise<Partial<AnalysisResult>> => {
    // We simulate a shorter delay here because the store will manage the long running 15-second simulation via UI states.
    // This service function represents the final payload resolution.
    await delay(1000)

    // 20% chance to simulate an LLM generation timeout or processing crash
    if (Math.random() < 0.2) {
        throw new Error("Analysis engine timed out while evaluating repository patterns. Please retry.")
    }

    const scoreBreakdown: ScoreBreakdown = {
    codeQuality: 85,     // was "code"
    complexity: 70,
    activity: 88,
    resume: 62,
    techAlign: 80,       // was "tech"
}

    return {
    hasRun: true,
    status: "completed",
    overallScore: 77,              // was "score"
    scoreBreakdown,
    recruiterPerspective: "Based on the aggregate data, this candidate demonstrates a solid foundation in modern frontend frameworks. They would likely pass standard technical phone screens for mid-level frontend roles.",
    percentileRanking: "Top 24% of Candidates",
    strengths: [ ... ],            // keep existing
    weaknesses: [ ... ],           // keep existing
    // REMOVE: recommendations
    // REMOVE: detectedTechStack
}
}

export const generateRoadmapService = async (weaknesses: string[]): Promise<RoadmapWeek[]> => {
    await delay(1500) // Simulating AI generation time

    // In a real app, this would dynamically map the weaknesses to roadmap items via AI.
    // We return a highly contextual mock based on the hardcoded weaknesses above.
    return [
    {
        weekNumber: 1,
        theme: "Testing Foundations & CI/CD",      // was "title"
        technicalTasks: [                           // was "tasks"
            "Set up Jest in 'nextjs-dashboard'",
            "Write unit tests for core UI components",
            "Add GitHub Actions pipeline to run tests on PRs"
        ],
        measurableOutcomes: [                       // was "outcomes"
            "Achieve 70% test coverage",
            "Automated pipelines ensuring code quality"
        ],
        technologies: ["Jest", "GitHub Actions", "React Testing Library"],
        projectIdea: "Add a comprehensive test suite to your existing dashboard",  // was "projectIdeas: [...]"
    },
    // ... same pattern for weeks 2, 3, 4
]
}
