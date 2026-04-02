import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
    AnalysisResult,
    GithubData,
    ResumeData,
    RoadmapResponse,
    UserProfile,
    WorkflowStep,
    SessionResponse,
} from "../types/devprofile-types"
import {
    connectGithubService,
    uploadResumeService,
    triggerAnalysis,
    pollAnalysisStatus,
    fetchReport,
    fetchRoadmap,
    markReportViewed,
    fetchSessions,
    createSession,
    startSession,
    archiveSession,
    fetchSession,
    fetchGithubProfile,
    fetchResumeProfile,
    loginService,
    registerService,
    updateUserProfile,
} from "../services/analysis-service"

// ── Derive frontend workflow step from backend session state ──

function deriveWorkflowStep(
    session: SessionResponse | null,
    githubConnected: boolean,
    resumeUploaded: boolean
): WorkflowStep {
    if (!session) return "START"

    if (session.status === "COMPLETED") return "REPORT_AVAILABLE"
    if (session.status === "IN_PROGRESS") {
        // If analysis is actively running
        if (
            session.workflowStep === "ANALYZING_PROFILE" ||
            session.workflowStep === "GENERATING_SCORES" ||
            session.workflowStep === "WRITING_FEEDBACK" ||
            session.workflowStep === "GENERATING_ROADMAP"
        ) {
            return "ANALYSIS_READY"
        }
    }
    if (resumeUploaded) return "RESUME_UPLOADED"
    if (githubConnected) return "GITHUB_CONNECTED"

    return "START"
}

// ── State Interface ──

interface DevProfileState {
    user: UserProfile
    github: GithubData
    resume: ResumeData
    analysis: AnalysisResult
    roadmap: RoadmapResponse | null
    workflowStep: WorkflowStep

    // Session management
    currentSessionId: number | null
    sessions: SessionResponse[]

    // Auth Actions
    login: (username: string, password: string) => Promise<void>
    register: (username: string, email: string, password: string, techField: string, careerGoal: string) => Promise<void>
    logout: () => void
    resetAccount: () => void
    updateProfile: (techField: string, careerGoal: string) => Promise<void>

    // Session Actions
    loadSessions: () => Promise<void>
    selectSession: (sessionId: number) => Promise<void>
    createNewSession: (name: string) => Promise<void>
    archiveCurrentSession: () => Promise<void>

    // Pipeline Actions
    connectGithub: (username: string) => Promise<void>
    uploadResume: (file: File) => Promise<void>
    startAnalysis: () => Promise<void>
    loadReport: () => Promise<void>
    loadRoadmap: () => Promise<void>

    // Workflow
    setWorkflowStep: (step: WorkflowStep) => void
}

const initialState = {
    user: {
        name: "",
        email: "",
        isAuthenticated: false,
        techField: null,
        careerGoal: null,
    },
    github: {
        isConnected: false,
        username: null,
        totalRepos: 0,
        totalStars: 0,
        contributionsLastYear: 0,
        repositories: [],
        languages: [],
    },
    resume: {
        uploaded: false,
        filename: null,
        fileSize: null,
        extractedTextPreview: null,
        extractedTextLength: null,
        uploadedAt: null,
    },
    analysis: {
        hasRun: false,
        status: "idle" as const,
        progressPercent: 0,
        progressMessage: null,
        overallScore: 0,
        scoreBreakdown: null,
        recruiterPerspective: null,
        percentileRanking: null,
        strengths: [],
        weaknesses: [],
        generatedAt: null,
    },
    roadmap: null as RoadmapResponse | null,
    workflowStep: "START" as WorkflowStep,
    currentSessionId: null as number | null,
    sessions: [] as SessionResponse[],
}

export const useDevProfileStore = create<DevProfileState>()(
    persist(
        (set, get) => ({
            ...initialState,

            // ── Auth ──

            login: async (username, password) => {
                const response = await loginService(username, password)
                localStorage.setItem("token", response.token)
                set({
                    user: {
                        name: response.username,
                        email: response.email || "",
                        isAuthenticated: true,
                        techField: response.techField,
                        careerGoal: response.careerGoal,
                    },
                })
            },

            register: async (username, email, password, techField, careerGoal) => {
                await registerService({ username, email, password, techField, careerGoal })
            },

            logout: () => {
                localStorage.removeItem("token")
                set({ ...initialState })
            },

            resetAccount: () =>
                set((state) => ({
                    ...initialState,
                    user: state.user,
                })),

            updateProfile: async (techField, careerGoal) => {
                await updateUserProfile(techField, careerGoal)
                set((state) => ({
                    user: { ...state.user, techField, careerGoal },
                }))
            },

            // ── Sessions ──

            loadSessions: async () => {
                const sessions = await fetchSessions()
                set({ sessions })
            },

            selectSession: async (sessionId) => {
                const session = await fetchSession(sessionId)
                let github = { ...initialState.github }
                let resume = { ...initialState.resume }
                let analysis = { ...initialState.analysis }
                let roadmap: RoadmapResponse | null = null

                // Load GitHub data if session has it
                try {
                    const ghData = await fetchGithubProfile(sessionId)
                    github = ghData
                } catch {
                    // No GitHub data yet
                }

                // Load resume data if session has it
                try {
                    const resumeData = await fetchResumeProfile(sessionId)
                    resume = resumeData
                } catch {
                    // No resume data yet
                }

                // Load report + roadmap if session is completed
                if (session.status === "COMPLETED") {
                    try {
                        const report = await fetchReport(sessionId)
                        analysis = {
                            hasRun: true,
                            status: "completed",
                            progressPercent: 100,
                            progressMessage: null,
                            overallScore: report.overallScore,
                            scoreBreakdown: report.scoreBreakdown,
                            recruiterPerspective: report.recruiterPerspective,
                            percentileRanking: report.percentileRanking,
                            strengths: report.strengths,
                            weaknesses: report.weaknesses,
                            generatedAt: report.generatedAt,
                        }
                    } catch {
                        // Report not available
                    }

                    try {
                        roadmap = await fetchRoadmap(sessionId)
                    } catch {
                        // Roadmap not available
                    }
                }

                // If session is in progress, set analysis as processing
                if (session.status === "IN_PROGRESS" && session.workflowStep) {
                    const processingSteps = [
                        "ANALYZING_PROFILE",
                        "GENERATING_SCORES",
                        "WRITING_FEEDBACK",
                        "GENERATING_ROADMAP",
                    ]
                    if (processingSteps.includes(session.workflowStep)) {
                        analysis = {
                            ...initialState.analysis,
                            status: "processing",
                            progressPercent: 0,
                            progressMessage: "Resuming analysis...",
                        }
                    }
                }

                const workflowStep = deriveWorkflowStep(
                    session,
                    github.isConnected,
                    resume.uploaded
                )

                set({
                    currentSessionId: sessionId,
                    github,
                    resume,
                    analysis,
                    roadmap,
                    workflowStep,
                })
            },

            createNewSession: async (name: string) => {
                const session = await createSession(name)
                await startSession(session.id)
                set((state) => ({
                    currentSessionId: session.id,
                    sessions: [{ ...session, status: "IN_PROGRESS" as const }, ...state.sessions],
                    github: { ...initialState.github },
                    resume: { ...initialState.resume },
                    analysis: { ...initialState.analysis },
                    roadmap: null,
                    workflowStep: "START",
                }))
            },

            archiveCurrentSession: async () => {
                const { currentSessionId } = get()
                if (!currentSessionId) return
                await archiveSession(currentSessionId)
                set((state) => ({
                    currentSessionId: null,
                    sessions: state.sessions.filter((s) => s.id !== currentSessionId),
                    github: { ...initialState.github },
                    resume: { ...initialState.resume },
                    analysis: { ...initialState.analysis },
                    roadmap: null,
                    workflowStep: "START",
                }))
            },

            // ── Pipeline ──

            connectGithub: async (username) => {
                const { currentSessionId } = get()
                if (!currentSessionId) throw new Error("No active session")
                const githubData = await connectGithubService(currentSessionId, username)
                set((state) => ({
                    github: githubData,
                    workflowStep: deriveWorkflowStep(
                        state.sessions.find((s) => s.id === currentSessionId) || null,
                        true,
                        state.resume.uploaded
                    ),
                }))
            },

            uploadResume: async (file) => {
                const { currentSessionId } = get()
                if (!currentSessionId) throw new Error("No active session")
                const resumeData = await uploadResumeService(currentSessionId, file)
                set((state) => ({
                    resume: resumeData,
                    workflowStep: deriveWorkflowStep(
                        state.sessions.find((s) => s.id === currentSessionId) || null,
                        state.github.isConnected,
                        true
                    ),
                }))
            },

            startAnalysis: async () => {
                const { currentSessionId } = get()
                if (!currentSessionId) throw new Error("No active session")

                // Trigger the async analysis on backend
                const status = await triggerAnalysis(currentSessionId)

                set({
                    analysis: {
                        ...initialState.analysis,
                        status: "processing",
                        progressPercent: status.progressPercent,
                        progressMessage: status.message,
                    },
                    workflowStep: "ANALYSIS_READY",
                })

                // Start polling
                const pollInterval = setInterval(async () => {
                    try {
                        const statusUpdate = await pollAnalysisStatus(currentSessionId)

                        if (statusUpdate.completed) {
                            clearInterval(pollInterval)

                            // Fetch the full report and roadmap
                            let report = null
                            let roadmapData: RoadmapResponse | null = null
                            try {
                                report = await fetchReport(currentSessionId)
                            } catch { /* not ready */ }
                            try {
                                roadmapData = await fetchRoadmap(currentSessionId)
                            } catch { /* not ready */ }

                            set({
                                analysis: {
                                    hasRun: true,
                                    status: "completed",
                                    progressPercent: 100,
                                    progressMessage: null,
                                    overallScore: report?.overallScore ?? 0,
                                    scoreBreakdown: report?.scoreBreakdown ?? null,
                                    recruiterPerspective: report?.recruiterPerspective ?? null,
                                    percentileRanking: report?.percentileRanking ?? null,
                                    strengths: report?.strengths ?? [],
                                    weaknesses: report?.weaknesses ?? [],
                                    generatedAt: report?.generatedAt ?? null,
                                },
                                roadmap: roadmapData,
                                workflowStep: "REPORT_AVAILABLE",
                            })

                            // Refresh session list
                            get().loadSessions()

                            return
                        }

                        if (statusUpdate.status === "FAILED") {
                            clearInterval(pollInterval)
                            set({
                                analysis: {
                                    ...initialState.analysis,
                                    status: "failed",
                                    progressPercent: 0,
                                    progressMessage: statusUpdate.message,
                                },
                            })
                            return
                        }

                        // Update progress
                        set((state) => ({
                            analysis: {
                                ...state.analysis,
                                progressPercent: statusUpdate.progressPercent,
                                progressMessage: statusUpdate.message,
                            },
                        }))
                    } catch {
                        clearInterval(pollInterval)
                        set({
                            analysis: {
                                ...initialState.analysis,
                                status: "failed",
                                progressMessage: "Failed to check analysis status.",
                            },
                        })
                    }
                }, 4000) // Poll every 4 seconds
            },

            loadReport: async () => {
                const { currentSessionId } = get()
                if (!currentSessionId) return
                const report = await fetchReport(currentSessionId)
                await markReportViewed(currentSessionId)
                set((state) => ({
                    analysis: {
                        ...state.analysis,
                        hasRun: true,
                        status: "completed",
                        overallScore: report.overallScore,
                        scoreBreakdown: report.scoreBreakdown,
                        recruiterPerspective: report.recruiterPerspective,
                        percentileRanking: report.percentileRanking,
                        strengths: report.strengths,
                        weaknesses: report.weaknesses,
                        generatedAt: report.generatedAt,
                    },
                }))
            },

            loadRoadmap: async () => {
                const { currentSessionId } = get()
                if (!currentSessionId) return
                const roadmap = await fetchRoadmap(currentSessionId)
                set({ roadmap })
            },

            setWorkflowStep: (step) => set({ workflowStep: step }),
        }),
        {
            name: "devprofile-storage",
        }
    )
)
