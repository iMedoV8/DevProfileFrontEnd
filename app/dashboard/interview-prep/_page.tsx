"use client"

import { useEffect, useState } from "react"
import { useDevProfileStore } from "@/lib/store/devprofile-store"
import { Button } from "@/components/ui/button"
import { BrainCircuit, ArrowRight, ArrowLeft, ArrowRight as ArrowRightIcon, RefreshCcw } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function InterviewPrepPage() {
    const { analysis, loadInterviewPrep, currentSessionId } = useDevProfileStore()
    
    // UI State for flashcards
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isFlipped, setIsFlipped] = useState(false)

    useEffect(() => {
        // Load data if available
        if (currentSessionId && analysis.hasRun && analysis.status === "completed" && !analysis.interviewQuestions?.length) {
            loadInterviewPrep()
        }
    }, [currentSessionId, analysis.hasRun, analysis.status, analysis.interviewQuestions, loadInterviewPrep])

    // Reset flip state when card changes
    useEffect(() => {
        setIsFlipped(false)
    }, [currentIndex])

    const questions = analysis.interviewQuestions || []

    // --- EMPTY STATE ---
    if (!analysis.hasRun || questions.length === 0) {
        return (
            <div className="flex flex-col gap-6 max-w-2xl mx-auto mt-10">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Interview Prep</h1>
                    <p className="mt-2 text-muted-foreground">
                        Custom technical questions based on your profile will appear here.
                    </p>
                </div>

                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center bg-card shadow-sm">
                    <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-secondary/50 text-foreground">
                        <BrainCircuit className="size-8 opacity-50" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold tracking-tight">Run analysis to generate questions</h3>
                    <p className="mb-8 max-w-md text-sm text-muted-foreground">
                        We generate personalized interview questions based on the technologies and patterns found in your repositories.
                    </p>
                    <Link href="/dashboard/analysis" className="outline-none">
                        <Button className="flex items-center gap-2 rounded-xl h-11 px-8 shadow-sm transition-all hover:-translate-y-0.5 active:scale-95">
                            Go to Analysis
                            <ArrowRight className="size-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    // --- POPULATED STATE (FLASHCARDS) ---
    const currentQuestion = questions[currentIndex]

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1)
        }
    }

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1)
        }
    }

    return (
        <div className="flex flex-col gap-8 pb-10 max-w-3xl mx-auto w-full">
            <div className="flex flex-col gap-4 opacity-0 animate-fade-in-up text-center">
                <h1 className="text-3xl font-bold tracking-tight">Technical Interview Prep</h1>
                <p className="text-muted-foreground">
                    Practice answering questions tailored to your specific tech stack and experience level.
                </p>
            </div>

            <div className="flex flex-col items-center gap-8 mt-4 opacity-0 animate-fade-in-up animation-delay-100">
                
                {/* Progress Indicator */}
                <div className="flex items-center justify-between w-full px-2">
                    <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
                        Question {currentIndex + 1} of {questions.length}
                    </span>
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                        {currentQuestion.category}
                    </span>
                </div>

                {/* Flashcard Container */}
                <div 
                    className="relative w-full aspect-[4/3] sm:aspect-[16/9] perspective-1000 cursor-pointer group"
                    onClick={() => setIsFlipped(!isFlipped)}
                >
                    <div className={cn(
                        "relative w-full h-full transition-transform duration-700 transform-style-3d",
                        isFlipped ? "rotate-y-180" : ""
                    )}>
                        
                        {/* Front of Card (Question) */}
                        <div className="absolute inset-0 w-full h-full backface-hidden rounded-3xl border border-border/60 bg-card p-8 shadow-md flex flex-col items-center justify-center text-center hover:border-primary/40 transition-colors">
                            <BrainCircuit className="size-10 text-primary/40 mb-6" />
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground leading-snug">
                                {currentQuestion.question}
                            </h2>
                            <p className="absolute bottom-6 text-sm text-muted-foreground font-medium flex items-center gap-2">
                                <RefreshCcw className="size-4" /> Click to reveal answer
                            </p>
                        </div>

                        {/* Back of Card (Answer) */}
                        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-3xl border border-primary/30 bg-secondary/30 p-8 shadow-lg flex flex-col overflow-y-auto custom-scrollbar">
                            <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-4">Suggested Answer</h3>
                            <div className="text-base sm:text-lg text-foreground/90 leading-relaxed font-medium">
                                {currentQuestion.answer}
                            </div>
                        </div>

                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4 w-full justify-center mt-2">
                    <Button 
                        variant="outline" 
                        size="lg"
                        onClick={handlePrev} 
                        disabled={currentIndex === 0}
                        className="rounded-xl h-14 px-6 w-32 border-border/60"
                    >
                        <ArrowLeft className="mr-2 size-5" /> Prev
                    </Button>
                    
                    <Button 
                        variant="default" 
                        size="lg"
                        onClick={handleNext} 
                        disabled={currentIndex === questions.length - 1}
                        className="rounded-xl h-14 px-6 w-32 shadow-primary/20 shadow-lg"
                    >
                        Next <ArrowRightIcon className="ml-2 size-5" />
                    </Button>
                </div>

            </div>
        </div>
    )
}
