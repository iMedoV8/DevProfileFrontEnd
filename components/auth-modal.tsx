"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Github, Mail, Chrome } from "lucide-react"

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center sm:text-center">
          <DialogTitle className="text-xl font-bold text-foreground">
            Get started with DevProfile
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Create your account to analyze your developer profile
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 pt-4">
          <Button
            variant="outline"
            className="h-12 justify-center gap-3 text-sm font-medium"
          >
            <Chrome className="size-5" />
            Continue with Google
          </Button>
          <Button
            variant="outline"
            className="h-12 justify-center gap-3 text-sm font-medium"
          >
            <Github className="size-5" />
            Continue with GitHub
          </Button>
          <Button
            variant="outline"
            className="h-12 justify-center gap-3 text-sm font-medium"
          >
            <Mail className="size-5" />
            Continue with Email
          </Button>
        </div>
        <p className="pt-2 text-center text-xs text-muted-foreground">
          {"By continuing, you agree to our "}
          <a href="/terms" className="underline hover:text-foreground">
            Terms
          </a>
          {" and "}
          <a href="/privacy" className="underline hover:text-foreground">
            Privacy Policy
          </a>
        </p>
      </DialogContent>
    </Dialog>
  )
}
