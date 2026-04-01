"use client"

import { useState } from "react"
import { useDevProfileStore } from "@/lib/store/devprofile-store"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Github, Star, GitCommit, CheckCircle2, Loader2, AlertTriangle, FolderGit2, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function GithubConnectionPage() {
    const { github, connectGithub, currentSessionId } = useDevProfileStore()
    const { toast } = useToast()
    const [isConnecting, setIsConnecting] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const [usernameInput, setUsernameInput] = useState("")

    const handleConnect = async () => {
        if (!usernameInput.trim()) {
            toast({ variant: "destructive", title: "Error", description: "Please enter a GitHub username" })
            return
        }
        if (!currentSessionId) {
            toast({ variant: "destructive", title: "Error", description: "No active session. Please create one from the dashboard." })
            return
        }
        setIsConnecting(true)
        setErrorMsg(null)
        try {
            await connectGithub(usernameInput.trim())
            toast({
                title: "GitHub Connected",
                description: "Your repositories have been successfully synced.",
            })
        } catch (error: any) {
            const message = error.message || "An unexpected error occurred."
            setErrorMsg(message)
            toast({
                variant: "destructive",
                title: "Connection Failed",
                description: message,
            })
        } finally {
            setIsConnecting(false)
        }
    }

    // --- EMPTY STATE ---
    if (!github.isConnected) {
        return (
            <div className="flex flex-col gap-6 max-w-2xl mx-auto mt-10">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Connect GitHub</h1>
                    <p className="mt-2 text-muted-foreground">
                        Allow DevProfile to analyze your code quality, commit consistency, and the technologies you use.
                    </p>
                </div>

                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center bg-card shadow-sm">
                    {errorMsg ? (
                        <>
                            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                                <AlertTriangle className="size-8" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold tracking-tight text-destructive">Connection Failed</h3>
                            <p className="mb-6 max-w-md text-sm text-muted-foreground">
                                {errorMsg}
                            </p>
                            <Input
                                placeholder="Enter your GitHub username"
                                value={usernameInput}
                                onChange={(e) => setUsernameInput(e.target.value)}
                                className="max-w-sm mb-4"
                            />
                            <Button
                                onClick={handleConnect}
                                disabled={isConnecting}
                                className="flex items-center gap-2 rounded-xl h-11 px-8 shadow-sm transition-all active:scale-95"
                            >
                                {isConnecting ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Github className="mr-2 size-4.5" />}
                                Try Again
                            </Button>
                        </>
                    ) : (
                        <>
                            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-secondary/50 text-foreground">
                                <Github className="size-8" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold tracking-tight">Connect your GitHub to start evaluation</h3>
                            <p className="mb-6 max-w-md text-sm text-muted-foreground">
                                We will scan your public repositories to generate a comprehensive hireability score. We never store your source code.
                            </p>
                            <Input
                                placeholder="Enter your GitHub username"
                                value={usernameInput}
                                onChange={(e) => setUsernameInput(e.target.value)}
                                className="max-w-sm mb-4"
                            />
                            <Button
                                onClick={handleConnect}
                                disabled={isConnecting}
                                className="flex items-center gap-2 rounded-xl h-11 px-8 shadow-sm transition-all active:scale-95"
                            >
                                {isConnecting ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Github className="mr-2 size-4.5" />}
                                {isConnecting ? "Connecting..." : "Connect with GitHub"}
                            </Button>
                        </>
                    )}
                </div>
            </div>
        )
    }

    // --- POPULATED STATE ---
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">GitHub Analysis</h1>
                    <p className="mt-2 text-muted-foreground">
                        Successfully connected as <span className="font-semibold text-foreground">@{github.username}</span>.
                    </p>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-600 dark:text-green-400 border border-green-500/20">
                    <CheckCircle2 className="size-4" />
                    Connected & Synced
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Top Languages */}
                <div className="col-span-1 flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <h3 className="text-sm font-semibold tracking-tight text-muted-foreground uppercase">Top Languages</h3>
                    <div className="flex flex-wrap gap-2">
                        {github.languages.map((lang) => (
                            <span key={lang} className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground border border-border">
                                {lang}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Real Stats from Backend */}
                <div className="col-span-1 md:col-span-2 grid grid-cols-3 gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <FolderGit2 className="size-4" />
                            <span className="text-sm font-medium">Repositories</span>
                        </div>
                        <span className="text-3xl font-bold tracking-tight text-foreground">{github.totalRepos}</span>
                    </div>
                    <div className="flex flex-col gap-1 border-l border-border pl-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Star className="size-4" />
                            <span className="text-sm font-medium">Total Stars</span>
                        </div>
                        <span className="text-3xl font-bold tracking-tight text-foreground">{github.totalStars}</span>
                    </div>
                    <div className="flex flex-col gap-1 border-l border-border pl-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <GitCommit className="size-4" />
                            <span className="text-sm font-medium">Contributions</span>
                        </div>
                        <span className="text-3xl font-bold tracking-tight text-foreground">{github.contributionsLastYear}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <h3 className="text-lg font-semibold tracking-tight">Analyzed Repositories</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                    {github.repositories.map((repo) => (
                        <div key={repo.name} className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-border/80">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-semibold text-primary">{repo.name}</h4>
                                    <div className="flex items-center gap-1 text-muted-foreground text-xs font-medium">
                                        <Star className="size-3.5 fill-muted-foreground" />
                                        {repo.stars}
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">{repo.description}</p>
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="size-2.5 rounded-full bg-primary/70" />
                                    <span className="text-xs font-medium text-muted-foreground">{repo.language}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    Updated {new Date(repo.updatedAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Next Step CTA */}
            <div className="mt-4">
                <Link
                    href="/dashboard/resume"
                    className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 text-lg font-semibold text-primary-foreground shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl active:scale-95"
                >
                    Continue to Resume Upload
                    <ArrowRight className="size-5" />
                </Link>
            </div>
        </div>
    )
}
