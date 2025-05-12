"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User } from "lucide-react"

type PersonaSelectorProps = {
  currentPersona: string
  onPersonaChange: (persona: string) => void
  disabled?: boolean
}

const personas = [
  { id: "default", name: "Default" },
  { id: "helper", name: "Helper" },
  { id: "pro-builder", name: "Pro Builder" },
  { id: "pro-engineer", name: "Pro Engineer" },
  { id: "debugger", name: "Debugger" },
  { id: "architect", name: "Architect" },
  { id: "speed-coder", name: "Speed Coder" },
  { id: "teacher", name: "Teacher" },
  { id: "voice-ui", name: "Voice UI" },
  { id: "wasm-optimizer", name: "WASM Optimizer" },
  { id: "pwa-specialist", name: "PWA Specialist" },
  { id: "custom", name: "Custom Persona" },
]

export function PersonaSelector({ currentPersona, onPersonaChange, disabled }: PersonaSelectorProps) {
  const selectedPersona = personas.find((persona) => persona.id === currentPersona) || personas[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Button variant="outline" size="sm" className="h-8 gap-1 border-zinc-800 bg-zinc-950">
          <User className="h-3.5 w-3.5" />
          <span className="hidden sm:inline-block">{selectedPersona.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
        {personas.map((persona) => (
          <DropdownMenuItem
            key={persona.id}
            onClick={() => onPersonaChange(persona.id)}
            className={currentPersona === persona.id ? "bg-zinc-800" : ""}
          >
            {persona.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
