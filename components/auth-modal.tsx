"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { useDevProfileStore } from "@/lib/store/devprofile-store"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import type { ApiError } from "@/lib/api-client"

const TECH_FIELD_OPTIONS: Record<string, string> = {
    FRONTEND: "Frontend Development",
    BACKEND: "Backend Development",
    FULLSTACK: "Full-Stack Development",
    DEVOPS: "DevOps / Infrastructure",
    MOBILE: "Mobile Development",
    DATA_SCIENCE: "Data Science",
    MACHINE_LEARNING: "Machine Learning / AI",
    CYBERSECURITY: "Cybersecurity",
    CLOUD_ENGINEERING: "Cloud Engineering",
    GAME_DEVELOPMENT: "Game Development",
    EMBEDDED_SYSTEMS: "Embedded Systems",
    QA_TESTING: "QA / Testing",
}

const CAREER_GOAL_OPTIONS: Record<string, string> = {
    INTERNSHIP: "Internship",
    JUNIOR_POSITION: "Junior Position",
    MID_LEVEL_POSITION: "Mid-Level Position",
    SENIOR_POSITION: "Senior Position",
    FREELANCING: "Freelancing",
    STARTUP_FOUNDER: "Startup Founder",
    CAREER_SWITCH: "Career Switch",
    UPSKILLING: "Upskilling",
}

interface AuthModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
    const login = useDevProfileStore((state) => state.login)
    const register = useDevProfileStore((state) => state.register)
    const router = useRouter()
    const { toast } = useToast()

    const [mode, setMode] = useState<"login" | "register">("login")
    const [isLoading, setIsLoading] = useState(false)

    // Form fields
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [techField, setTechField] = useState("")
    const [careerGoal, setCareerGoal] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

    const resetForm = () => {
        setUsername("")
        setEmail("")
        setPassword("")
        setTechField("")
        setCareerGoal("")
        setError(null)
        setFieldErrors({})
    }

    const switchMode = (newMode: "login" | "register") => {
        setMode(newMode)
        resetForm()
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)
        setFieldErrors({})

        try {
            if (mode === "register") {
                await register(username, email, password, techField, careerGoal)
                toast({
                    title: "Account created",
                    description: "You can now sign in with your credentials.",
                })
                switchMode("login")
            } else {
                await login(username, password)
                onOpenChange(false)
                router.push("/dashboard")
            }
        } catch (err: any) {
            const apiError = err as ApiError
            if (apiError?.fields) {
                setFieldErrors(apiError.fields)
            }
            setError(apiError?.message || err?.message || "An unexpected error occurred.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="text-center sm:text-center">
                    <DialogTitle className="text-xl font-bold text-foreground">
                        {mode === "login" ? "Sign in to DevProfile" : "Create your account"}
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        {mode === "login"
                            ? "Enter your credentials to access your dashboard"
                            : "Sign up to start analyzing your developer profile"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            minLength={3}
                            maxLength={50}
                            disabled={isLoading}
                        />
                        {fieldErrors.username && (
                            <p className="text-xs text-destructive">{fieldErrors.username}</p>
                        )}
                    </div>

                    {mode === "register" && (
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                            {fieldErrors.email && (
                                <p className="text-xs text-destructive">{fieldErrors.email}</p>
                            )}
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            maxLength={100}
                            disabled={isLoading}
                        />
                        {fieldErrors.password && (
                            <p className="text-xs text-destructive">{fieldErrors.password}</p>
                        )}
                    </div>

                    {mode === "register" && (
                        <>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="techField">Tech Field</Label>
                                <Select value={techField} onValueChange={setTechField} disabled={isLoading}>
                                    <SelectTrigger id="techField">
                                        <SelectValue placeholder="Select your tech field" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(TECH_FIELD_OPTIONS).map(([value, label]) => (
                                            <SelectItem key={value} value={value}>{label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {fieldErrors.techField && (
                                    <p className="text-xs text-destructive">{fieldErrors.techField}</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="careerGoal">Career Goal</Label>
                                <Select value={careerGoal} onValueChange={setCareerGoal} disabled={isLoading}>
                                    <SelectTrigger id="careerGoal">
                                        <SelectValue placeholder="Select your career goal" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(CAREER_GOAL_OPTIONS).map(([value, label]) => (
                                            <SelectItem key={value} value={value}>{label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {fieldErrors.careerGoal && (
                                    <p className="text-xs text-destructive">{fieldErrors.careerGoal}</p>
                                )}
                            </div>
                        </>
                    )}

                    {error && (
                        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="h-11 w-full font-semibold"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 size-4 animate-spin" />
                                {mode === "login" ? "Signing in..." : "Creating account..."}
                            </>
                        ) : mode === "login" ? (
                            "Sign In"
                        ) : (
                            "Create Account"
                        )}
                    </Button>
                </form>

                <p className="pt-2 text-center text-sm text-muted-foreground">
                    {mode === "login" ? (
                        <>
                            {"Don't have an account? "}
                            <button
                                type="button"
                                onClick={() => switchMode("register")}
                                className="font-semibold text-foreground underline hover:text-primary"
                            >
                                Sign up
                            </button>
                        </>
                    ) : (
                        <>
                            {"Already have an account? "}
                            <button
                                type="button"
                                onClick={() => switchMode("login")}
                                className="font-semibold text-foreground underline hover:text-primary"
                            >
                                Sign in
                            </button>
                        </>
                    )}
                </p>
            </DialogContent>
        </Dialog>
    )
}
