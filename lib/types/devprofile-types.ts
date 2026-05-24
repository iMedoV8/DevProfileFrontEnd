// ── Workflow & Status ──

export type WorkflowStep =
    | "START"
    | "GITHUB_CONNECTED"
    | "RESUME_UPLOADED"
    | "ANALYSIS_READY"
    | "REPORT_AVAILABLE"

export type AnalysisStatus =
    | "idle"
    | "processing"
    | "completed"
    | "failed"

// ── Auth ──

export interface LoginRequest {
    username: string
    password: string
}

/**
 * Returned from POST /api/auth/login and GET /api/user/me.
 *
 * The JWT itself is in an httpOnly cookie — JavaScript can't see it. The
 * `csrfToken` field is the matching value the frontend must echo back in
 * the `X-CSRF-Token` header on every mutating request.
 */
export interface LoginResponse {
    username: string
    email: string
    role: string
    techField: string | null
    careerGoal: string | null
    csrfToken: string
}

export interface RegisterRequest {
    username: string
    email: string
    password: string
    techField: string
    careerGoal: string
}

// ── User ──

export interface UserProfile {
    name: string
    email: string
    isAuthenticated: boolean
    techField: string | null
    careerGoal: string | null
}

// ── Session (backend AnalysisSessionResponse) ──

export interface SessionResponse {
    id: number
    name: string
    status: "CREATED" | "IN_PROGRESS" | "COMPLETED" | "FAILED"
    workflowStep: string | null
    hireabilityScore: number | null
    archived: boolean
    techField: string | null
    careerGoal: string | null
    createdAt: string
    updatedAt: string
    reportViewedAt: string | null
}

// ── Dashboard (backend DashboardResponse) ──

export interface DashboardResponse {
    username: string
    email: string
    githubConnected: boolean
    resumeUploaded: boolean
    analysisCompleted: boolean
    hireabilityScore: number | null
    percentileRanking: string | null
    checklist: {
        githubConnected: boolean
        resumeUploaded: boolean
        analysisRun: boolean
        reportViewed: boolean
        progressPercent: number
    }
}

// ── GitHub (backend GitHubProfileResponse) ──

export interface GitHubRepositorySnapshot {
    name: string
    description: string | null
    primaryLanguage: string | null
    stars: number
    lastUpdated: string
}

export interface GitHubProfileResponse {
    username: string
    totalRepos: number
    totalStars: number
    contributionsLastYear: number
    topRepositories: GitHubRepositorySnapshot[]
}

// Frontend-friendly shape used in store and components
export interface GithubRepository {
    name: string
    description: string | null
    stars: number
    language: string
    updatedAt: string
}

export interface GithubData {
    isConnected: boolean
    username: string | null
    totalRepos: number
    totalStars: number
    contributionsLastYear: number
    repositories: GithubRepository[]
    languages: string[]
}

// ── Resume (backend ResumeProfileResponse) ──

export interface ResumeProfileResponse {
    originalFilename: string
    fileSize: number
    extractedTextPreview: string
    extractedTextLength: number
    uploadedAt: string
}

export interface ResumeData {
    uploaded: boolean
    filename: string | null
    fileSize: number | null
    extractedTextPreview: string | null
    extractedTextLength: number | null
    uploadedAt: string | null
}

// ── Analysis Status (backend AnalysisStatusResponse) ──

export interface AnalysisStatusResponse {
    status: string
    workflowStep: string
    progressPercent: number
    message: string
    completed: boolean
}

// ── Report (backend ReportResponse) ──

export interface ScoreBreakdown {
    codeQuality: number
    complexity: number
    activity: number
    resume: number
    techAlign: number
}

export interface ReportResponse {
    recruiterPerspective: string
    overallScore: number
    percentileRanking: string
    scoreBreakdown: ScoreBreakdown
    strengths: string[]
    weaknesses: string[]
    generatedAt: string
}

export interface InterviewQuestion {
    id: string
    category: string
    question: string
    answer: string
}

export interface AnalysisResult {
    hasRun: boolean
    status: AnalysisStatus
    progressPercent: number
    progressMessage: string | null
    overallScore: number
    scoreBreakdown: ScoreBreakdown | null
    recruiterPerspective: string | null
    percentileRanking: string | null
    strengths: string[]
    weaknesses: string[]
    generatedAt: string | null
    interviewQuestions?: InterviewQuestion[] | null
}

// ── Roadmap (backend RoadmapResponse) ──

export interface RoadmapWeek {
    weekNumber: number
    theme: string
    technicalTasks: string[]
    measurableOutcomes: string[]
    technologies: string[]
    projectIdea: string | null
}

export interface RoadmapResponse {
    summary: string
    totalWeeks: number
    weeks: RoadmapWeek[]
    generatedAt: string
}

// ── Dev Profile (RPG Gamification) ──

export interface SkillStats {
    codeQuality: number
    complexity: number
    activity: number
    resume: number
    techAlignment: number
}

export interface Archetype {
    name: string
    description: string
}

export interface Achievement {
    id: string
    name: string
    description: string
    icon: string
    unlocked: boolean
}

export interface DevProfileResponse {
    username: string
    email: string
    techField: string | null
    careerGoal: string | null
    level: string
    hireabilityScore: number
    levelProgress: number
    stats: SkillStats | null
    archetype: Archetype | null
    achievements: Achievement[]
    totalSessions: number
    completedSessions: number
}
