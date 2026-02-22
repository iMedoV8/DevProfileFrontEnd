export type WorkflowStep =
    | "START"
    | "GITHUB_CONNECTED"
    | "RESUME_UPLOADED"
    | "ANALYSIS_READY"
    | "REPORT_AVAILABLE"

export type AnalysisStatus =
    | "idle"
    | "uploading"
    | "processing"
    | "finalizing"
    | "completed"

export interface UserProfile {
    name: string
    email: string
    isAuthenticated: boolean
}

export interface GithubRepository {
    id: string
    name: string
    description: string | null
    stars: number
    language: string
    updatedAt: string
}

export interface GithubData {
    isConnected: boolean
    username: string | null
    repositories: GithubRepository[]
    languages: string[]
}

export interface ResumeData {
    uploaded: boolean
    filename: string | null
    uploadedAt: string | null
    skills: string[]
    warnings: string[]
}

export interface ScoreBreakdown {
    code: number
    complexity: number
    activity: number
    resume: number
    tech: number
}

export interface AnalysisResult {
    hasRun: boolean
    status: AnalysisStatus
    analysisStartedAt: number | null
    analysisDuration: number | null
    score: number
    scoreBreakdown: ScoreBreakdown | null
    strengths: string[]
    weaknesses: string[]
    recommendations: string[]
    detectedTechStack: string[]
}

export interface RoadmapWeek {
    weekNumber: number
    title: string
    tasks: string[]
    outcomes: string[]
    technologies: string[]
    projectIdeas: string[]
}
