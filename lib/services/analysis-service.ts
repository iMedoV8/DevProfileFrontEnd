import { api } from "../api-client"
import {
    AnalysisStatusResponse,
    GitHubProfileResponse,
    GithubData,
    GithubRepository,
    LoginResponse,
    RegisterRequest,
    ReportResponse,
    ResumeData,
    ResumeProfileResponse,
    RoadmapResponse,
    SessionResponse,
    DashboardResponse,
    DevProfileResponse,
} from "../types/devprofile-types"

// ── Auth ──

export async function loginService(username: string, password: string): Promise<LoginResponse> {
    return api.post<LoginResponse>("/api/auth/login", { username, password })
}

export async function registerService(data: RegisterRequest): Promise<string> {
    return api.post<string>("/api/auth/register", data)
}

// ── Dashboard ──

export async function fetchDashboard(): Promise<DashboardResponse> {
    return api.get<DashboardResponse>("/api/dashboard")
}

// ── Sessions ──

export async function createSession(name: string): Promise<SessionResponse> {
    return api.post<SessionResponse>("/api/sessions", { name })
}

export async function fetchSessions(): Promise<SessionResponse[]> {
    return api.get<SessionResponse[]>("/api/sessions")
}

export async function fetchSession(sessionId: number): Promise<SessionResponse> {
    return api.get<SessionResponse>(`/api/sessions/${sessionId}`)
}

export async function startSession(sessionId: number): Promise<void> {
    return api.post<void>(`/api/sessions/${sessionId}/start`)
}

export async function archiveSession(sessionId: number): Promise<void> {
    return api.delete<void>(`/api/sessions/${sessionId}`)
}

// ── User Profile ──

export async function updateUserProfile(techField: string, careerGoal: string): Promise<void> {
    return api.put<void>("/api/user/profile", { techField, careerGoal })
}

// ── GitHub ──

function mapGitHubResponse(data: GitHubProfileResponse): GithubData {
    const repositories: GithubRepository[] = data.topRepositories.map((repo) => ({
        name: repo.name,
        description: repo.description,
        stars: repo.stars,
        language: repo.primaryLanguage || "Unknown",
        updatedAt: repo.lastUpdated,
    }))

    const languages = [
        ...new Set(
            data.topRepositories
                .map((r) => r.primaryLanguage)
                .filter((l): l is string => l !== null)
        ),
    ]

    return {
        isConnected: true,
        username: data.username,
        totalRepos: data.totalRepos,
        totalStars: data.totalStars,
        contributionsLastYear: data.contributionsLastYear,
        repositories,
        languages,
    }
}

export async function connectGithubService(
    sessionId: number,
    username: string
): Promise<GithubData> {
    const data = await api.post<GitHubProfileResponse>(
        `/api/sessions/${sessionId}/github`,
        { username }
    )
    return mapGitHubResponse(data)
}

export async function fetchGithubProfile(sessionId: number): Promise<GithubData> {
    const data = await api.get<GitHubProfileResponse>(
        `/api/sessions/${sessionId}/github`
    )
    return mapGitHubResponse(data)
}

// ── Resume ──

function mapResumeResponse(data: ResumeProfileResponse): ResumeData {
    return {
        uploaded: true,
        filename: data.originalFilename,
        fileSize: data.fileSize,
        extractedTextPreview: data.extractedTextPreview,
        extractedTextLength: data.extractedTextLength,
        uploadedAt: data.uploadedAt,
    }
}

export async function uploadResumeService(
    sessionId: number,
    file: File
): Promise<ResumeData> {
    const formData = new FormData()
    formData.append("file", file)
    const data = await api.postForm<ResumeProfileResponse>(
        `/api/sessions/${sessionId}/resume`,
        formData
    )
    return mapResumeResponse(data)
}

export async function fetchResumeProfile(sessionId: number): Promise<ResumeData> {
    const data = await api.get<ResumeProfileResponse>(
        `/api/sessions/${sessionId}/resume`
    )
    return mapResumeResponse(data)
}

// ── Analysis ──

export async function triggerAnalysis(sessionId: number): Promise<AnalysisStatusResponse> {
    return api.post<AnalysisStatusResponse>(`/api/sessions/${sessionId}/analyze`)
}

export async function pollAnalysisStatus(sessionId: number): Promise<AnalysisStatusResponse> {
    return api.get<AnalysisStatusResponse>(`/api/sessions/${sessionId}/analysis/status`)
}

// ── Report & Roadmap ──

export async function fetchReport(sessionId: number): Promise<ReportResponse> {
    return api.get<ReportResponse>(`/api/sessions/${sessionId}/report`)
}

export async function fetchRoadmap(sessionId: number): Promise<RoadmapResponse> {
    return api.get<RoadmapResponse>(`/api/sessions/${sessionId}/roadmap`)
}

export async function markReportViewed(sessionId: number): Promise<void> {
    return api.post<void>(`/api/sessions/${sessionId}/report/viewed`)
}

// ── Dev Profile (RPG Gamification) ──

export async function fetchDevProfile(): Promise<DevProfileResponse> {
    return api.get<DevProfileResponse>("/api/profile")
}
