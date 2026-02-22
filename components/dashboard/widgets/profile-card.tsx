"use client"

import { useDevProfileStore } from "@/lib/store/devprofile-store"
import { Github, FileText, CheckCircle2, User, Mail } from "lucide-react"
import { cn } from "@/lib/utils"

export function ProfileCard() {
    const { user, github, resume } = useDevProfileStore()

    return (
        <div className="flex h-full flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div>
                <div className="flex items-center gap-3">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <User className="size-6" />
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-lg font-semibold tracking-tight">{user.name || "Developer"}</h3>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Mail className="size-3.5" />
                            <span>{user.email || "No email provided"}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex flex-col gap-3">
                <div className="flex items-center justify-between rounded-xl bg-secondary/50 p-3">
                    <div className="flex items-center gap-2.5">
                        <Github className="size-4.5 text-foreground" />
                        <span className="text-sm font-medium">GitHub Status</span>
                    </div>
                    {github.isConnected ? (
                        <div className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-semibold text-green-600 dark:text-green-400">
                            <CheckCircle2 className="size-3.5" />
                            Connected
                        </div>
                    ) : (
                        <div className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                            Not Linked
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between rounded-xl bg-secondary/50 p-3">
                    <div className="flex items-center gap-2.5">
                        <FileText className="size-4.5 text-foreground" />
                        <span className="text-sm font-medium">Resume Status</span>
                    </div>
                    {resume.uploaded ? (
                        <div className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-semibold text-green-600 dark:text-green-400">
                            <CheckCircle2 className="size-3.5" />
                            Uploaded
                        </div>
                    ) : (
                        <div className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                            Missing
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
