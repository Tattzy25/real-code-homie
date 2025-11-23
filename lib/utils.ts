import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type CodeBlock = {
  startIndex: number
  endIndex: number
  code: string
  language: string
}

export function extractCodeBlocks(text: string): { text: string; codeBlocks: CodeBlock[] } {
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g
  const codeBlocks: CodeBlock[] = []
  let match

  while ((match = codeBlockRegex.exec(text)) !== null) {
    codeBlocks.push({
      startIndex: match.index,
      endIndex: match.index + match[0].length,
      language: match[1] || "plaintext",
      code: match[2],
    })
  }

  return { text, codeBlocks }
}
