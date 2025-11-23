"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, X, Send, Loader2 } from "lucide-react"
import { useAbly } from "@/lib/websocket/ably"
import Image from "next/image"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

export function HelperHomieWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(true)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-message",
      role: "assistant",
      content:
        "👋 Hi there! I'm Helper Homie, your AI assistant. How can I help you today? Ask me anything about Code Homie, our features, pricing, or how to get started!",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { subscribe, isConnected } = useAbly()

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isOpen])

  // Subscribe to real-time updates
  useEffect(() => {
    if (!isOpen || !isConnected) return

    // Subscribe to helper-homie-response events
    const unsubscribe = subscribe("code-homie-updates", "helper-homie-response", (data) => {
      if (data && data.messageId) {
        setMessages((prev) => prev.map((msg) => (msg.id === data.messageId ? { ...msg, content: data.content } : msg)))
        setIsLoading(false)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [isOpen, isConnected, subscribe])

  const toggleChat = () => {
    if (isMinimized) {
      setIsOpen(true)
      setIsMinimized(false)
    } else {
      setIsMinimized(true)
      setTimeout(() => {
        setIsOpen(false)
      }, 300)
    }
  }

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

    // Create a temporary assistant message
    const assistantMessageId = `assistant-${Date.now()}`
    setMessages((prev) => [
      ...prev,
      {
        id: assistantMessageId,
        role: "assistant",
        content: "",
      },
    ])

    setInput("")
    setIsLoading(true)

    try {
      // Send message to API
      const response = await fetch("/api/helper-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          messageId: assistantMessageId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error("Failed to get response stream")

      const decoder = new TextDecoder()
      let done = false
      let assistantMessage = ""

      while (!done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading

        if (value) {
          const chunk = decoder.decode(value)
          try {
            // Parse the chunk as JSON
            const lines = chunk
              .split("\n")
              .filter(Boolean)
              .map((line) => line.replace(/^data: /, "").trim())

            for (const line of lines) {
              if (line === "[DONE]") continue
              try {
                const parsed = JSON.parse(line)
                if (parsed.type === "text" && parsed.text) {
                  assistantMessage += parsed.text
                  // Update the message in real-time
                  setMessages((prev) =>
                    prev.map((msg) => (msg.id === assistantMessageId ? { ...msg, content: assistantMessage } : msg)),
                  )
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          } catch (e) {
            console.error("Error parsing chunk:", e)
          }
        }
      }
    } catch (error) {
      console.error("Error getting AI response:", error)
      // Update the message with an error
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId ? { ...msg, content: "Sorry, I encountered an error. Please try again." } : msg,
        ),
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <div
          className={`bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg w-80 sm:w-96 transition-all duration-300 ${
            isMinimized ? "scale-95 opacity-0" : "scale-100 opacity-100"
          }`}
          style={{ maxHeight: "calc(100vh - 100px)" }}
        >
          {/* Chat Header */}
          <div className="bg-blue-600 rounded-t-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image
                src="/images/helper-homie.png"
                alt="Helper Homie"
                width={24}
                height={24}
                className="rounded-full"
              />
              <span className="font-medium">Helper Homie</span>
            </div>
            <button onClick={toggleChat} className="text-white/80 hover:text-white">
              <X size={18} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="p-3 h-80 overflow-y-auto flex flex-col gap-3">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`rounded-lg p-3 max-w-[85%] text-sm ${
                    message.role === "user" ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-200"
                  }`}
                >
                  {message.content || (message.role === "assistant" && isLoading ? "..." : "")}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-zinc-800 rounded-lg p-3 flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" />
                  <span className="text-sm text-zinc-300">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSubmit} className="border-t border-zinc-800 p-3">
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Helper Homie..."
                className="min-h-10 max-h-32 bg-zinc-800 border-zinc-700 text-sm resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                <Send size={16} />
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className={`bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-300 ${
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        <MessageSquare size={24} />
      </button>
    </div>
  )
}
