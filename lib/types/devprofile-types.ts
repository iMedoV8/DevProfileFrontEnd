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
    codeQuality: number
    complexity: number
    activity: number
    resume: number
    techAlign: number
}

export interface AnalysisResult {
    hasRun: boolean
    status: AnalysisStatus
    analysisStartedAt: number | null
    analysisDuration: number | null
    overallScore: number                // was "score" -- matches backend
    scoreBreakdown: ScoreBreakdown | null
    recruiterPerspective: string | null // NEW -- backend returns this from AI
    percentileRanking: string | null    // NEW -- backend returns this
    strengths: string[]
    weaknesses: string[]
    // REMOVED: recommendations (backend doesn't have this)
    // REMOVED: detectedTechStack (backend doesn't have this)
    lastAnalyzedAt?: number
}

export interface RoadmapWeek {
    weekNumber: number
    theme: string               // was "title" -- matches backend
    technicalTasks: string[]    // was "tasks" -- matches backend
    measurableOutcomes: string[]  // was "outcomes" -- matches backend
    technologies: string[]
    projectIdea: string | null  // was "projectIdeas: string[]" -- backend returns single string
}
