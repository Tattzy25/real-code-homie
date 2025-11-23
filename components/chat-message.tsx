import type React from "react"
import { cn } from "@/lib/utils"

type ChatMessageProps = {
  message: {
    role: "user" | "assistant" | "system"
    content: string
  }
  children?: React.ReactNode
}

export function ChatMessage({ message, children }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex items-start gap-4 rounded-lg p-4", isUser ? "bg-zinc-900" : "bg-zinc-900/50")}>
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md",
          isUser ? "bg-blue-600" : "bg-purple-600",
        )}
      >
        {isUser ? "U" : "AI"}
      </div>
      <div className="flex-1 space-y-2">
        <div className="font-medium">{isUser ? "You" : "Code Homie"}</div>
        <div className="prose prose-invert max-w-none">{children || message.content}</div>
      </div>
    </div>
  )
}
