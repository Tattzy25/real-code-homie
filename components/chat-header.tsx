"use client"

import { MenuIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModelSelector } from "@/components/model-selector"
import { PersonaSelector } from "@/components/persona-selector"
import Image from "next/image"
import Link from "next/link"
import { ThemeSelector } from "@/components/theme-selector"
import { useSupabaseAuth } from "@/lib/hooks/use-supabase-auth"
import { useState, useEffect } from "react"

type ChatHeaderProps = {
  toggleSidebar: () => void
  isSidebarOpen: boolean
  currentPersona?: string
  currentModel?: string
  onPersonaChange?: (persona: string) => void
  onModelChange?: (model: string) => void
  isLoading?: boolean
}

export function ChatHeader({
  toggleSidebar,
  isSidebarOpen,
  currentPersona,
  currentModel,
  onPersonaChange,
  onModelChange,
  isLoading,
}: ChatHeaderProps) {
  const { session } = useSupabaseAuth()
  const [userTier, setUserTier] = useState<string>("free")

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
      } catch (error) {
        console.error("Error fetching user tier:", error)
      }
    }
    getUserTier()
  }, [session])
  return (
    <header className="flex items-center justify-between border-b border-zinc-800 p-2 h-14">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
          <MenuIcon className="h-5 w-5" />
        </Button>
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/code-homie-logo.png"
            alt="Code Homie Logo"
            width={32}
            height={32}
            className="rounded-md"
          />
          <span className="font-bold hidden sm:inline">Code Homie</span>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        {onPersonaChange && (
          <PersonaSelector
            currentPersona={currentPersona || "default"}
            onPersonaChange={onPersonaChange}
            disabled={isLoading}
          />
        )}
        {onModelChange && (
          <ModelSelector currentModel={currentModel || "default"} onModelChange={onModelChange} disabled={isLoading} />
        )}
        {userTier !== "free" && (
          <ThemeSelector isProUser={userTier !== "free"} />
        )}
      </div>
    </header>
  )
}
