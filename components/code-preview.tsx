"use client"

import { useState, useEffect } from "react"
import { useSupabaseAuth } from "@/lib/hooks/use-supabase-auth"
import { subscribeToPreviewUpdates } from "@/lib/websocket/ably-service"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Lock } from "lucide-react"
import Link from "next/link"

type CodePreviewProps = {
  conversationId: string
  code: string
}

export function CodePreview({ conversationId, code }: CodePreviewProps) {
  const [previewHtml, setPreviewHtml] = useState<string>("") 
  const [isLoading, setIsLoading] = useState(true)
  const [isBlurred, setIsBlurred] = useState(false)
  const [blurTimer, setBlurTimer] = useState<NodeJS.Timeout | null>(null)
  const { session } = useSupabaseAuth()
  const [userTier, setUserTier] = useState<string>("free")

  // Get user subscription tier
  useEffect(() => {
    const getUserTier = async () => {
      if (!session?.user) return

      try {
        const supabase = (window as any).supabase
        const { data, error } = await supabase
          .from("users")
          .select("subscription_tier")
          .eq("id", session.user.id)
          .single()

        if (error) throw error
        setUserTier(data.subscription_tier)

        // For free tier, set a timer to blur the preview after 15 seconds
        if (data.subscription_tier === "free") {
          const timer = setTimeout(() => {
            setIsBlurred(true)
          }, 15000) // 15 seconds
          
          setBlurTimer(timer)
        }
      } catch (error) {
        console.error("Error fetching user tier:", error)
      }
    }

    getUserTier()

    return () => {
      // Clear the blur timer when component unmounts
      if (blurTimer) {
        clearTimeout(blurTimer)
      }
    }
  }, [session])

  // Subscribe to real-time preview updates
  useEffect(() => {
    if (!conversationId) return

    setIsLoading(true)

    // Generate initial preview
    if (code) {
      try {
        // Simple HTML preview for demonstration
        const html = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://cdn.tailwindcss.com"></script>
          </head>
          <body>
            ${code}
          </body>
          </html>
        `
        setPreviewHtml(html)
        setIsLoading(false)
      } catch (error) {
        console.error("Error generating preview:", error)
        setIsLoading(false)
      }
    }

    // Subscribe to real-time updates
    const unsubscribe = subscribeToPreviewUpdates(conversationId, (data) => {
      if (data.html) {
        setPreviewHtml(data.html)
        setIsLoading(false)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [conversationId, code])

  return (
    <Card className="bg-zinc-900 border-zinc-800 overflow-hidden h-full flex flex-col">
      <CardContent className="p-0 flex-grow relative">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-zinc-400">Generating preview...</span>
          </div>
        ) : (
          <div className="relative h-full w-full">
            <iframe
              srcDoc={previewHtml}
              className={`w-full h-full border-0 ${isBlurred ? "filter blur-md" : ""}`}
              title="Code Preview"
              sandbox="allow-scripts"
            />
            
            {isBlurred && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-10">
                <Lock className="h-12 w-12 text-purple-500 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Preview Locked</h3>
                <p className="text-zinc-400 text-center mb-4 max-w-xs">
                  Free tier preview is limited to 15 seconds. Upgrade to continue viewing.
                </p>
                <Link href="/subscription">
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600">
                    Upgrade Now
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}