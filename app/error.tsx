"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertTriangle, Home, RefreshCw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-lg p-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-red-900/20 p-3 rounded-full">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
        <p className="text-zinc-400 mb-6">
          We're sorry, but we encountered an unexpected error. Our team has been notified.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Try again
          </Button>
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Return home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
