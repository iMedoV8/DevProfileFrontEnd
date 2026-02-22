import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
    AnalysisResult,
    GithubData,
    ResumeData,
    RoadmapWeek,
    UserProfile,
    WorkflowStep,
} from "../types/devprofile-types"
import {
    connectGithubService,
    generateRoadmapService,
    runAnalysisService,
    uploadResumeService,
} from "../services/analysis-service"

interface DevProfileState {
    user: UserProfile
    github: GithubData
    resume: ResumeData
    analysis: AnalysisResult
    roadmap: RoadmapWeek[] | null
    workflowStep: WorkflowStep

    // Auth Actions
    login: (name: string, email: string) => void
    logout: () => void
    resetAccount: () => void

    // Pipeline Actions
    connectGithub: (username: string) => Promise<void>
    uploadResume: (file: File) => Promise<void>
    startAnalysis: () => void
    completeAnalysis: () => Promise<void>

    // Navigation
    setWorkflowStep: (step: WorkflowStep) => void
}

const initialState = {
    user: {
        name: "",
        email: "",
        isAuthenticated: false,
    },
    github: {
        isConnected: false,
        username: null,
        repositories: [],
        languages: [],
    },
    resume: {
        uploaded: false,
        filename: null,
        uploadedAt: null,
        skills: [],
        warnings: [],
    },
    analysis: {
        hasRun: false,
        status: "idle" as const,
        analysisStartedAt: null,
        analysisDuration: 15000, // 15 seconds required simulation time
        score: 0,
        scoreBreakdown: null,
        strengths: [],
        weaknesses: [],
        recommendations: [],
        detectedTechStack: [],
    },
    roadmap: null,
    workflowStep: "START" as WorkflowStep,
}

export const useDevProfileStore = create<DevProfileState>()(
    persist(
        (set, get) => ({
            ...initialState,

            login: (name, email) =>
                set({
                    user: { name, email, isAuthenticated: true },
                }),

            logout: () => set({ ...initialState }),

            resetAccount: () =>
                set((state) => ({
                    ...initialState,
                    user: state.user, // Keep user logged in but clear all backend data
                })),

            connectGithub: async (username) => {
                try {
                    const githubData = await connectGithubService(username)
                    set((state) => ({
                        github: githubData,
                        workflowStep:
                            state.workflowStep === "START" ? "GITHUB_CONNECTED" : state.workflowStep,
                    }))
                } catch (error) {
                    console.error("Failed to connect GitHub", error)
                }
            },

            uploadResume: async (file) => {
                try {
                    const resumeData = await uploadResumeService(file)
                    set((state) => ({
                        resume: resumeData,
                        workflowStep:
                            state.workflowStep === "GITHUB_CONNECTED" || state.workflowStep === "START"
                                ? "RESUME_UPLOADED"
                                : state.workflowStep,
                    }))
                } catch (error) {
                    console.error("Failed to upload resume", error)
                }
            },

            startAnalysis: () => {
                // Only start if idle, or restart if it somehow got stuck
                set((state) => ({
                    analysis: {
                        ...state.analysis,
                        status: "processing",
                        analysisStartedAt: Date.now(),
                    },
                }))
            },

            completeAnalysis: async () => {
                try {
                    // Call the mock backend to generate the strict typed arrays and scores
                    const analysisData = await runAnalysisService()

                    let roadmapData = null
                    if (analysisData.weaknesses && analysisData.weaknesses.length > 0) {
                        roadmapData = await generateRoadmapService(analysisData.weaknesses)
                    }

                    set((state) => ({
                        analysis: {
                            ...state.analysis,
                            ...analysisData,
                        },
                        roadmap: roadmapData,
                        workflowStep: "REPORT_AVAILABLE",
                    }))
                } catch (error) {
                    console.error("Failed to complete analysis", error)
                    set((state) => ({
                        analysis: {
                            ...state.analysis,
                            status: "idle",
                            analysisStartedAt: null,
                        },
                    }))
                }
            },

            setWorkflowStep: (step) => set({ workflowStep: step }),
        }),
        {
            name: "devprofile-storage",
            // Exclude things from persistence if necessary using partialize (e.g. tracking ephemeral status)
            // partialize: (state) => ({ ...state }), 
        }
    )
)
