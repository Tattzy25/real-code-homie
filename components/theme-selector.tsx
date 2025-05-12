"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sun, Moon, Monitor } from "lucide-react"

const themes = [
  { id: "light", name: "Light", icon: Sun },
  { id: "dark", name: "Dark", icon: Moon },
  { id: "system", name: "System", icon: Monitor },
]

type ThemeSelectorProps = {
  isProUser: boolean
}

export function ThemeSelector({ isProUser }: ThemeSelectorProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={!isProUser}>
        <Button variant="outline" size="sm" className="h-8 gap-1 border-zinc-800 bg-zinc-950" disabled={!isProUser}>
          {themes.find((t) => t.id === theme)?.icon &&
            (themes.find((t) => t.id === theme)?.icon as any)({ className: "h-4 w-4" })}
          <span className="hidden sm:inline-block">{themes.find((t) => t.id === theme)?.name || "Theme"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
        {themes.map((t) => (
          <DropdownMenuItem
            key={t.id}
            onClick={() => isProUser && setTheme(t.id)}
            className={theme === t.id ? "bg-zinc-800" : ""}
            disabled={!isProUser}
          >
            {t.icon({ className: "h-4 w-4 mr-2" })}
            {t.name}
            {!isProUser && <span className="ml-2 text-xs text-blue-400">Pro</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}