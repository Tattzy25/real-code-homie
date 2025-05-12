"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ChatMessage } from "@/components/chat-message"
import { Code, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function DemoPage() {
  const [messages, setMessages] = useState([
    {
      id: "welcome-1",
      role: "assistant",
      content:
        "👋 Hey there! I'm Code Homie, your AI coding assistant. This is a demo version with limited features. How can I help you today? Need help with a coding problem, want to brainstorm a solution, or need an explanation of some code?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    // Add user message
    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response after a delay
    setTimeout(() => {
      const demoResponses = [
        "This is a demo version of Code Homie. In the full version, I can help you write code, debug issues, and explain programming concepts in detail. Sign up to access all features!",
        "I see what you're trying to do! In the full version, I could provide complete code examples and detailed explanations. This demo has limited functionality.",
        "Great question! The full version of Code Homie can provide in-depth answers with code examples. Sign up to unlock all capabilities!",
        "In the full version, I can generate complete code solutions for problems like this. This demo is just to give you a taste of what Code Homie can do.",
      ]

      const randomResponse = demoResponses[Math.floor(Math.random() * demoResponses.length)]

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: randomResponse,
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600">
              <Code className="h-4 w-4" />
            </div>
            <span className="font-bold">Code Homie Demo</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/signup">
              <Button>Sign Up Free</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Demo Banner */}
      <div className="bg-blue-600/20 border-b border-blue-600/30 py-2 px-4 text-center text-sm">
        This is a limited demo version.{" "}
        <Link href="/signup" className="underline font-medium">
          Sign up
        </Link>{" "}
        for full access to all features.
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isLoading && (
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse delay-75"></div>
              <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse delay-150"></div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="border-t border-zinc-800 pt-4">
          <div className="flex flex-col space-y-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Code Homie anything..."
              className="min-h-24 bg-zinc-900 border-zinc-800"
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              {isLoading ? "Thinking..." : "Send"}
            </Button>
          </div>
        </form>
      </div>

      {/* CTA Footer */}
      <div className="border-t border-zinc-800 p-4 text-center">
        <p className="mb-4">Ready to unlock the full power of Code Homie?</p>
        <Link href="/signup">
          <Button size="lg">Sign Up Now</Button>
        </Link>
      </div>
    </div>
  )
}
