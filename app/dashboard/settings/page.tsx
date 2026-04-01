"use client"

import { useTheme } from "next-themes"
import { useDevProfileStore } from "@/lib/store/devprofile-store"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
    Moon,
    Sun,
    Monitor,
    Trash2,
    LogOut,
    RefreshCw,
    Settings as SettingsIcon,
    Archive,
} from "lucide-react"

export default function SettingsPage() {
    const { theme, setTheme } = useTheme()
    const router = useRouter()
    const { toast } = useToast()
    const { logout, analysis, currentSessionId, archiveCurrentSession, createNewSession } = useDevProfileStore()

    const isProcessing = analysis.status === "processing"

    const handleReRunAnalysis = async () => {
        try {
            await createNewSession()
            toast({ title: "New Session Created", description: "You can now re-run the analysis with fresh data." })
            router.push("/dashboard")
        } catch (err: any) {
            toast({ variant: "destructive", title: "Error", description: err?.message || "Failed to create session." })
        }
    }

    const handleArchiveSession = async () => {
        if (!currentSessionId) {
            toast({ variant: "destructive", title: "Error", description: "No active session to archive." })
            return
        }
        if (confirm("Are you sure you want to archive this session? You can still view it, but it cannot be modified.")) {
            try {
                await archiveCurrentSession()
                toast({ title: "Session Archived", description: "The session has been archived." })
                router.push("/dashboard")
            } catch (err: any) {
                toast({ variant: "destructive", title: "Error", description: err?.message || "Failed to archive session." })
            }
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
                            <h4 className="font-semibold text-foreground">New Analysis</h4>
                            <p className="text-sm text-muted-foreground">Create a new session and start a fresh evaluation from scratch.</p>
                        </div>
                        <Button
                            onClick={handleReRunAnalysis}
                            variant="secondary"
                            className="shrink-0"
                            disabled={isProcessing}
                            title={isProcessing ? "Disabled while analysis is running" : "Start new analysis"}
                        >
                            <RefreshCw className="size-4 mr-2" />
                            New Session
                        </Button>
                    </div>

                    {currentSessionId && (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-destructive/30 bg-destructive/5 relative z-10 mb-2">
                            <div className="mb-4 sm:mb-0">
                                <h4 className="font-semibold text-destructive">Archive Current Session</h4>
                                <p className="text-sm text-muted-foreground">Archive this session. It will become read-only and can no longer be modified.</p>
                            </div>
                            <Button
                                onClick={handleArchiveSession}
                                variant="destructive"
                                className="shrink-0 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                                disabled={isProcessing}
                            >
                                <Archive className="size-4 mr-2" />
                                Archive Session
                            </Button>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-border bg-background/50 relative z-10">
                        <div className="mb-4 sm:mb-0">
                            <h4 className="font-semibold text-foreground">Logout</h4>
                            <p className="text-sm text-muted-foreground">Sign out and return to the landing page.</p>
                        </div>
                        <Button
                            onClick={handleLogout}
                            variant="outline"
                            className="shrink-0"
                            disabled={isProcessing}
                        >
                            <LogOut className="size-4 mr-2 text-muted-foreground" />
                            Logout
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
