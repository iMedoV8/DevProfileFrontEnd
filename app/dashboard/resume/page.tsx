"use client"

import { useState, useRef } from "react"
import { useDevProfileStore } from "@/lib/store/devprofile-store"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { FileText, UploadCloud, Loader2, AlertTriangle, ShieldCheck, HardDrive, Type } from "lucide-react"
import { cn } from "@/lib/utils"

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function ResumeUploadPage() {
    const { resume, uploadResume, currentSessionId } = useDevProfileStore()
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
        if (file.type !== "application/pdf") {
            toast({
                variant: "destructive",
                title: "Invalid File Type",
                description: "Only PDF files are currently supported.",
            })
            return
        }

        if (!currentSessionId) {
            toast({
                variant: "destructive",
                title: "No Active Session",
                description: "Please create a session from the dashboard first.",
            })
            return
        }

        setIsUploading(true)
        setErrorMsg(null)
        try {
            await uploadResume(file)
            toast({
                title: "Resume Uploaded",
                description: "Your resume has been successfully parsed.",
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
                        Provide your latest CV. Our AI will use it alongside your GitHub data to generate a comprehensive evaluation.
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
                    <h1 className="text-3xl font-bold tracking-tight">Resume Uploaded</h1>
                    <p className="mt-2 text-muted-foreground">
                        Successfully parsed <span className="font-semibold text-foreground">{resume.filename}</span>.
                    </p>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-600 dark:text-green-400 border border-green-500/20">
                    <ShieldCheck className="size-4" />
                    Successfully Parsed
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* File Info */}
                <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <h3 className="text-sm font-semibold tracking-tight text-muted-foreground uppercase flex items-center gap-2">
                        <FileText className="size-4 text-primary" />
                        File Details
                    </h3>
                    <div className="flex flex-col gap-3 mt-2">
                        <div className="flex items-center justify-between rounded-lg bg-secondary/30 p-3">
                            <span className="text-sm font-medium text-muted-foreground">Filename</span>
                            <span className="text-sm font-semibold text-foreground">{resume.filename}</span>
                        </div>
                        {resume.fileSize !== null && (
                            <div className="flex items-center justify-between rounded-lg bg-secondary/30 p-3">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <HardDrive className="size-3.5" />
                                    <span className="text-sm font-medium">File Size</span>
                                </div>
                                <span className="text-sm font-semibold text-foreground">{formatFileSize(resume.fileSize)}</span>
                            </div>
                        )}
                        {resume.extractedTextLength !== null && (
                            <div className="flex items-center justify-between rounded-lg bg-secondary/30 p-3">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Type className="size-3.5" />
                                    <span className="text-sm font-medium">Text Extracted</span>
                                </div>
                                <span className="text-sm font-semibold text-foreground">{resume.extractedTextLength.toLocaleString()} characters</span>
                            </div>
                        )}
                        {resume.uploadedAt && (
                            <div className="flex items-center justify-between rounded-lg bg-secondary/30 p-3">
                                <span className="text-sm font-medium text-muted-foreground">Uploaded</span>
                                <span className="text-sm font-semibold text-foreground">
                                    {new Date(resume.uploadedAt).toLocaleDateString()}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Text Preview */}
                <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <h3 className="text-sm font-semibold tracking-tight text-muted-foreground uppercase flex items-center gap-2">
                        <Type className="size-4 text-primary" />
                        Extracted Text Preview
                    </h3>
                    <div className="mt-2 rounded-lg bg-secondary/30 p-4 max-h-64 overflow-y-auto">
                        <p className="text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed">
                            {resume.extractedTextPreview || "No text extracted."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
