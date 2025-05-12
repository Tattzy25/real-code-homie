"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Cpu } from "lucide-react"

type ModelSelectorProps = {
  currentModel: string
  onModelChange: (model: string) => void
  disabled?: boolean
}

const models = [
  { id: "default", name: "Default" },
  { id: "gpt-4o", name: "GPT-4o" },
  { id: "claude-3", name: "Claude 3" },
]

export function ModelSelector({ currentModel, onModelChange, disabled }: ModelSelectorProps) {
  const selectedModel = models.find((model) => model.id === currentModel) || models[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Button variant="outline" size="sm" className="h-8 gap-1 border-zinc-800 bg-zinc-950">
          <Cpu className="h-3.5 w-3.5" />
          <span className="hidden sm:inline-block">{selectedModel.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
        {models.map((model) => (
          <DropdownMenuItem
            key={model.id}
            onClick={() => onModelChange(model.id)}
            className={currentModel === model.id ? "bg-zinc-800" : ""}
          >
            {model.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
