"use client"

import { useTheme } from "next-themes"
import { useDevProfileStore } from "@/lib/store/devprofile-store"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    Moon,
    Sun,
    Monitor,
    Trash2,
    LogOut,
    RefreshCw,
    Settings as SettingsIcon,
} from "lucide-react"

export default function SettingsPage() {
    const { theme, setTheme } = useTheme()
    const router = useRouter()
    const { logout, resetAccount, analysis } = useDevProfileStore()

    const isProcessing = analysis.status === "processing"

    // Allows setting the workflow step and bypassing strict action mapping for internal utility
    const forceReRunAnalysis = () => {
        useDevProfileStore.setState((state) => ({
            analysis: {
                ...state.analysis,
                hasRun: false,
                status: "idle",
                scoreBreakdown: null,
            },
            workflowStep: "RESUME_UPLOADED",
        }))
        router.push("/dashboard/analysis")
    }

    const handleResetData = () => {
        if (confirm("Are you sure you want to delete all stored GitHub and Resume data? Your account will remain active.")) {
            resetAccount()
            router.push("/dashboard")
        }
    }

    const handleLogout = () => {
        logout()
        router.push("/")
    }

    return (
        <div className="flex flex-col gap-8 max-w-3xl pb-10">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="mt-2 text-muted-foreground">
                    Manage your account preferences, appearance, and data control.
                </p>
            </div>

            <div className="grid gap-6">
                {/* Appearance */}
                <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <div className="flex items-center gap-2 text-lg font-semibold tracking-tight mb-2">
                        <SettingsIcon className="size-5 text-primary" />
                        Appearance
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                        Customize the theme of your dashboard.
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                        <Button
                            variant={theme === "light" ? "default" : "outline"}
                            onClick={() => setTheme("light")}
                            className="h-12 flex justify-start px-4 gap-3 bg-card text-foreground"
                            style={theme === "light" ? { backgroundColor: "var(--accent)" } : {}}
                        >
                            <Sun className="size-4" />
                            Light
                        </Button>
                        <Button
                            variant={theme === "dark" ? "default" : "outline"}
                            onClick={() => setTheme("dark")}
                            className="h-12 flex justify-start px-4 gap-3 bg-card text-foreground"
                            style={theme === "dark" ? { backgroundColor: "var(--accent)" } : {}}
                        >
                            <Moon className="size-4" />
                            Dark
                        </Button>
                        <Button
                            variant={theme === "system" ? "default" : "outline"}
                            onClick={() => setTheme("system")}
                            className="h-12 flex justify-start px-4 gap-3 bg-card text-foreground cursor-pointer"
                            style={theme === "system" ? { backgroundColor: "var(--accent)" } : {}}
                        >
                            <Monitor className="size-4" />
                            System
                        </Button>
                    </div>
                </div>

                {/* Data Controls */}
                <div className="flex flex-col gap-4 rounded-2xl border border-destructive/20 bg-card p-6 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <Trash2 className="size-32 text-destructive" />
                    </div>

                    <div className="flex items-center gap-2 text-lg font-semibold tracking-tight mb-2 relative z-10">
                        <Trash2 className="size-5 text-destructive" />
                        Data Controls
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-border bg-background/50 relative z-10 mb-2">
                        <div className="mb-4 sm:mb-0">
                            <h4 className="font-semibold text-foreground">Re-run Analysis</h4>
                            <p className="text-sm text-muted-foreground">Keep your stored GitHub and Resume data, but re-evaluate the metrics.</p>
                        </div>
                        <Button
                            onClick={forceReRunAnalysis}
                            variant="secondary"
                            className="shrink-0"
                            disabled={isProcessing}
                            title={isProcessing ? "Disabled while analysis is running" : "Re-evaluate logic"}
                        >
                            <RefreshCw className="size-4 mr-2" />
                            Re-evaluate
                        </Button>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-destructive/30 bg-destructive/5 relative z-10 mb-2">
                        <div className="mb-4 sm:mb-0">
                            <h4 className="font-semibold text-destructive">Delete Dashboard Data</h4>
                            <p className="text-sm text-muted-foreground">Wipes all simulated pipeline data from the global store. Reverts you to the start.</p>
                        </div>
                        <Button
                            onClick={handleResetData}
                            variant="destructive"
                            className="shrink-0 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                            disabled={isProcessing}
                            title={isProcessing ? "Disabled while analysis is running" : "Delete User Configuration"}
                        >
                            Delete Data
                        </Button>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-border bg-background/50 relative z-10">
                        <div className="mb-4 sm:mb-0">
                            <h4 className="font-semibold text-foreground">Logout</h4>
                            <p className="text-sm text-muted-foreground">Completely erases the session and all local store data, returning to the landing page.</p>
                        </div>
                        <Button
                            onClick={handleLogout}
                            variant="outline"
                            className="shrink-0"
                            disabled={isProcessing}
                            title={isProcessing ? "Disabled while analysis is running" : "Logout Profile Session"}
                        >
                            <LogOut className="size-4 mr-2 text-muted-foreground" />
                            Logout Session
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
