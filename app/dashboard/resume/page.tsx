"use client"

import { useState, useRef } from "react"
import { useDevProfileStore } from "@/lib/store/devprofile-store"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { FileText, UploadCloud, CheckCircle2, Loader2, AlertTriangle, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ResumeUploadPage() {
    const { resume, uploadResume } = useDevProfileStore()
    const { toast } = useToast()
    const [isUploading, setIsUploading] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const [dragActive, setDragActive] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            await processFile(e.dataTransfer.files[0])
        }
    }

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        if (e.target.files && e.target.files[0]) {
            await processFile(e.target.files[0])
        }
    }

    const processFile = async (file: File) => {
        // Front-end validation
        if (file.type !== "application/pdf") {
            toast({
                variant: "destructive",
                title: "Invalid File Type",
                description: "Only PDF files are currently supported for accuracy.",
            })
            return
        }

        setIsUploading(true)
        setErrorMsg(null)
        try {
            await uploadResume(file)
            toast({
                title: "Resume Uploaded",
                description: "Your structural markers have been successfully extracted.",
            })
        } catch (error: any) {
            const message = error.message || "An unexpected error occurred."
            setErrorMsg(message)
            toast({
                variant: "destructive",
                title: "Upload Failed",
                description: message,
            })
        } finally {
            setIsUploading(false)
        }
    }

    // --- EMPTY STATE ---
    if (!resume.uploaded) {
        return (
            <div className="flex flex-col gap-6 max-w-2xl mx-auto mt-10">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Upload Resume</h1>
                    <p className="mt-2 text-muted-foreground">
                        Provide your latest CV. Our AI will extract your structural markers and compare them against ATS best practices.
                    </p>
                </div>

                <form
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onSubmit={(e) => e.preventDefault()}
                    className={cn(
                        "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-20 text-center transition-all bg-card",
                        dragActive ? "border-primary bg-primary/5" : "border-border hover:border-border/80"
                    )}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf"
                        title="Upload Resume PDF"
                        onChange={handleChange}
                        className="absolute inset-0 z-50 h-full w-full cursor-pointer opacity-0"
                        disabled={isUploading}
                    />
                    {errorMsg ? (
                        <>
                            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                                <AlertTriangle className="size-8" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold tracking-tight text-destructive">Parsing Failed</h3>
                            <p className="mb-8 max-w-md text-sm text-muted-foreground relative z-10 pointer-events-none">
                                {errorMsg}
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-secondary/50 text-foreground">
                                {isUploading ? <Loader2 className="size-8 animate-spin" /> : <UploadCloud className="size-8" />}
                            </div>
                            <h3 className="mb-2 text-lg font-semibold tracking-tight">
                                {isUploading ? "Uploading Resume..." : "Click or drag and drop to upload"}
                            </h3>
                            <p className="mb-8 max-w-md text-sm text-muted-foreground">
                                PDF files up to 5MB supported. It is strictly used for analysis metrics.
                            </p>
                        </>
                    )}
                    <Button
                        type="button"
                        disabled={isUploading}
                        className="flex items-center gap-2 rounded-xl h-11 px-8 shadow-sm transition-all pointer-events-none"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                Parsing...
                            </>
                        ) : errorMsg ? (
                            <>
                                <UploadCloud className="size-4.5" />
                                Try Another File
                            </>
                        ) : (
                            <>
                                <FileText className="size-4.5" />
                                Select File
                            </>
                        )}
                    </Button>
                </form>
            </div>
        )
    }

    // --- POPULATED STATE ---
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Resume Parsing Results</h1>
                    <p className="mt-2 text-muted-foreground">
                        Successfully extracted data from <span className="font-semibold text-foreground">{resume.filename}</span>.
                    </p>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-600 dark:text-green-400 border border-green-500/20">
                    <ShieldCheck className="size-4" />
                    Successfully Parsed
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Mock Extracted Skills */}
                <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <h3 className="text-sm font-semibold tracking-tight text-muted-foreground uppercase flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-green-500" />
                        Extracted Skills
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {resume.skills.map((skill) => (
                            <span key={skill} className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground border border-border">
                                {skill}
                            </span>
                        ))}
                    </div>
                    {resume.skills.length === 0 && (
                        <p className="text-sm text-muted-foreground italic">No skills definitively extracted.</p>
                    )}
                </div>

                {/* Mock ATS Warnings */}
                <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <h3 className="text-sm font-semibold tracking-tight text-amber-500 uppercase flex items-center gap-2">
                        <AlertTriangle className="size-4" />
                        ATS Structural Warnings
                    </h3>
                    <div className="flex flex-col gap-3 mt-2">
                        {resume.warnings.map((warning, index) => (
                            <div key={index} className="flex items-start gap-3 rounded-lg bg-amber-500/10 p-3 text-sm text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                <span className="shrink-0 mt-0.5">•</span>
                                <span>{warning}</span>
                            </div>
                        ))}
                    </div>
                    {resume.warnings.length === 0 && (
                        <p className="text-sm text-muted-foreground italic">No structural warnings found.</p>
                    )}
                </div>
            </div>
        </div>
    )
}
