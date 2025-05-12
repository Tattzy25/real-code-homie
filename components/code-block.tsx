"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"

type CodeBlockProps = {
  code: string
  language: string
  className?: string
}

export function CodeBlock({ code, language, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn("relative rounded-md bg-zinc-950 group", className)}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800">
        <span className="text-xs text-zinc-400">{language}</span>
        <button
          onClick={handleCopy}
          className="text-zinc-400 hover:text-white transition-colors"
          aria-label="Copy code"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="text-sm">{code}</code>
      </pre>
    </div>
  )
}
