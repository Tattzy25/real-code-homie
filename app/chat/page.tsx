"use client"

// useState is already imported later in the file, removing duplicate import
// useRouter is imported later in the file
// Button is imported later in the file, removing duplicate import
// Removed duplicate import since useRouter is imported later in the file
// Removed duplicate import since useToast is already imported later in the file

function ChatHomePage() {
  const [isLoading, setIsLoading] = useState(false)
  const { session } = useSupabaseAuth()
  const router = useRouter()
  const { toast } = useToast()

  const startNewChat = async () => {
    if (!session?.user) {
      toast({
        title: "Error",
        description: "You must be logged in to start a new chat.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Create a new conversation
      const supabase = (window as any).supabase
      const { data, error } = await supabase
        .from("conversations")
        .insert({
          user_id: session.user.id,
          title: "New Conversation",
        })
        .select()
        .single()

      if (error) throw error

      // Redirect to the new conversation
      router.push(`/chat/${data.id}`)
    } catch (error) {
      console.error("Error starting new chat:", error)
      toast({
        title: "Error",
        description: "Failed to start a new chat. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white">
      <h1 className="text-3xl font-bold mb-4">Welcome to Code Homie</h1>
      <p className="mb-8 text-zinc-400">Your AI coding assistant is ready to help</p>
      <div className="space-y-4">
        <Button onClick={startNewChat} disabled={isLoading}>
          {isLoading ? "Starting..." : "Start a New Chat"}
        </Button>
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Suggested Prompts</h2>
          <ul className="list-disc list-inside text-zinc-400">
            <li>Build a navbar</li>
            <li>Create a login form</li>
            <li>Design a landing page</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useSupabaseAuth } from "@/lib/hooks/use-supabase-auth"
import { useSupabase } from "@/lib/supabase/provider"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { logError } from "@/lib/error-logger"
import Image from "next/image"
import Link from "next/link"
import {
  Loader2,
  Send,
  Code,
  Sparkles,
  Check,
  Copy,
  Plus,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Trash2,
  MenuIcon,
  Cpu,
  User,
} from "lucide-react"

// ===== TYPES =====
type Message = {
  id: string
  role: "user" | "assistant" | "system"
  content: string
}

type CodeBlock = {
  startIndex: number
  endIndex: number
  code: string
  language: string
}

type Conversation = {
  id: string
  title: string
  created_at: string
}

// ===== UTILITY FUNCTIONS =====
function extractCodeBlocks(text: string): { text: string; codeBlocks: CodeBlock[] } {
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

// ===== COMPONENTS =====
function CodeBlock({ code, language, className }: { code: string; language: string; className?: string }) {
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

function ChatMessage({
  message,
  children,
}: {
  message: { role: "user" | "assistant" | "system"; content: string }
  children?: React.ReactNode
}) {
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

function ModelSelector({
  currentModel,
  onModelChange,
  disabled,
}: {
  currentModel: string
  onModelChange: (model: string) => void
  disabled?: boolean
}) {
  const models = [
    { id: "default", name: "Default" },
    { id: "gpt-4o", name: "GPT-4o" },
    { id: "claude-3", name: "Claude 3" },
  ]

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

function PersonaSelector({
  currentPersona,
  onPersonaChange,
  disabled,
}: {
  currentPersona: string
  onPersonaChange: (persona: string) => void
  disabled?: boolean
}) {
  const personas = [
    { id: "default", name: "Default" },
    { id: "helper", name: "Helper" },
    { id: "pro-builder", name: "Pro Builder" },
    { id: "pro-engineer", name: "Pro Engineer" },
  ]

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

function ChatHeader({
  toggleSidebar,
  isSidebarOpen,
  currentPersona,
  currentModel,
  onPersonaChange,
  onModelChange,
  isLoading,
}: {
  toggleSidebar: () => void
  isSidebarOpen: boolean
  currentPersona?: string
  currentModel?: string
  onPersonaChange?: (persona: string) => void
  onModelChange?: (model: string) => void
  isLoading?: boolean
}) {
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
      </div>
    </header>
  )
}

function ChatSidebar({
  isOpen,
  onToggle,
  currentConversationId,
  onConversationSelect,
}: {
  isOpen: boolean
  onToggle: () => void
  currentConversationId: string | null
  onConversationSelect: (id: string) => void
}) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { session } = useSupabaseAuth()
  const { supabase } = useSupabase()
  const router = useRouter()

  useEffect(() => {
    const fetchConversations = async () => {
      if (!session?.user) return

      try {
        setIsLoading(true)

        const { data, error } = await supabase
          .from("conversations")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false })

        if (error) throw error

        setConversations(data || [])
      } catch (error) {
        console.error("Error fetching conversations:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchConversations()
  }, [session, supabase])

  const handleNewChat = () => {
    router.push("/chat")
  }

  const handleDeleteConversation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()

    if (!session?.user) return

    try {
      const { error } = await supabase.from("conversations").delete().eq("id", id).eq("user_id", session.user.id)

      if (error) throw error

      setConversations(conversations.filter((conv) => conv.id !== id))

      if (id === currentConversationId) {
        router.push("/chat")
      }
    } catch (error) {
      console.error("Error deleting conversation:", error)
    }
  }

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={onToggle}
      />

      <div
        className={cn(
          "fixed md:static inset-y-0 left-0 z-30 w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
          <h2 className="font-bold">Conversations</h2>
          <Button variant="ghost" size="icon" onClick={onToggle} className="md:hidden">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-2">
          <Button onClick={handleNewChat} className="w-full justify-start gap-2">
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {isLoading ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : conversations.length > 0 ? (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={cn(
                  "flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-zinc-800 group",
                  currentConversationId === conversation.id && "bg-zinc-800",
                )}
                onClick={() => onConversationSelect(conversation.id)}
              >
                <div className="flex items-center gap-2 truncate">
                  <MessageSquare className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{conversation.title}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 h-6 w-6"
                  onClick={(e) => handleDeleteConversation(conversation.id, e)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center p-4 text-zinc-500 text-sm">No conversations yet</div>
          )}
        </div>
      </div>

      {!isOpen && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed bottom-4 left-4 z-10 md:hidden bg-zinc-900 border border-zinc-800"
          onClick={onToggle}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      )}
    </>
  )
}

// ===== MAIN COMPONENT =====
export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [currentPersona, setCurrentPersona] = useState("default")
  const [currentModel, setCurrentModel] = useState("default")
  const [showWelcome, setShowWelcome] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { session, isLoading: loading } = useSupabaseAuth()
  const { supabase } = useSupabase()
  const router = useRouter()
  const { toast } = useToast()

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !session) {
      router.push("/login")
    }
  }, [session, loading, router])

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Create a new conversation when user sends first message
  const createConversation = async (firstMessage: string) => {
    if (!session?.user) return null

    try {
      // Create a new conversation
      const { data, error } = await supabase
        .from("conversations")
        .insert({
          user_id: session.user.id,
          title: firstMessage.substring(0, 50) + (firstMessage.length > 50 ? "..." : ""),
        })
        .select()
        .single()

      if (error) throw error

      return data.id
    } catch (error) {
      console.error("Error creating conversation:", error)
      toast({
        title: "Error",
        description: "Failed to create a new conversation. Please try again.",
        variant: "destructive",
      })
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || isLoading || !session?.user) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setShowWelcome(false)

    try {
      // Create conversation if this is the first message
      let currentConversationId = conversationId
      if (!currentConversationId) {
        currentConversationId = await createConversation(userMessage.content)
        setConversationId(currentConversationId)
      }

      // Save user message to database
      if (currentConversationId) {
        await supabase.from("messages").insert({
          conversation_id: currentConversationId,
          role: "user",
          content: userMessage.content,
        })
      }

      // Get AI response
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          conversationId: currentConversationId,
          modelName: currentModel,
          persona: currentPersona,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to get response")
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error("Failed to get response stream")

      const decoder = new TextDecoder()
      let done = false
      let assistantMessage = ""

      // Create a temporary message ID
      const tempMessageId = `assistant-${Date.now()}`
      setMessages((prev) => [...prev, { id: tempMessageId, role: "assistant", content: "" }])

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
                    prev.map((msg) => (msg.id === tempMessageId ? { ...msg, content: assistantMessage } : msg)),
                  )
                }
              } catch (e) {
                // Skip invalid JSON
                logError(e as Error, "low", { context: "JSON parsing", chunk })
              }
            }
          } catch (e) {
            logError(e as Error, "medium", {
              context: "Stream processing",
              chunk: chunk.substring(0, 100) // Log only first 100 chars to avoid huge logs
            })
          }
        }
      }
    } catch (error: any) {
      logError(error, "high", {
        component: "ChatPage",
        input: input.substring(0, 100), // First 100 chars for context
        modelName: currentModel,
        persona: currentPersona,
      })

      console.error("Error getting AI response:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to get a response. Please try again.",
        variant: "destructive",
      })

      // Remove the loading message
      setMessages((prev) => prev.filter((msg) => !msg.id.includes("assistant-")))
    } finally {
      setIsLoading(false)
    }
  }

  // Handle code blocks in messages
  const renderMessageContent = (content: string) => {
    const { text, codeBlocks } = extractCodeBlocks(content)

    if (codeBlocks.length === 0) {
      return <p className="whitespace-pre-wrap">{content}</p>
    }

    const parts = []
    let lastIndex = 0

    codeBlocks.forEach((block, index) => {
      // Add text before code block
      if (block.startIndex > lastIndex) {
        parts.push(
          <p key={`text-${index}`} className="whitespace-pre-wrap mb-4">
            {content.substring(lastIndex, block.startIndex)}
          </p>,
        )
      }

      // Add code block
      parts.push(<CodeBlock key={`code-${index}`} code={block.code} language={block.language} className="my-4" />)

      lastIndex = block.endIndex
    })

    // Add any remaining text
    if (lastIndex < content.length) {
      parts.push(
        <p key="text-end" className="whitespace-pre-wrap">
          {content.substring(lastIndex)}
        </p>,
      )
    }

    return <>{parts}</>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect to login
  }

  return (
    <div className="flex h-screen bg-zinc-950 text-white">
      {/* Sidebar */}
      <ChatSidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        currentConversationId={conversationId}
        onConversationSelect={(id) => {
          router.push(`/chat/${id}`)
        }}
      />

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <ChatHeader
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
          currentPersona={currentPersona}
          currentModel={currentModel}
          onPersonaChange={setCurrentPersona}
          onModelChange={setCurrentModel}
          isLoading={isLoading}
        />

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {showWelcome ? (
            <div className="h-full flex flex-col items-center justify-center">
              <div className="max-w-3xl w-full space-y-6">
                <div className="text-center">
                  <h1 className="text-3xl font-bold mb-2">Welcome to Code Homie</h1>
                  <p className="text-zinc-400">Your AI coding assistant is ready to help</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Example cards here */}
                </div>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message}>
                  {renderMessageContent(message.content)}
                </ChatMessage>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <form onSubmit={handleSubmit} className="border-t border-zinc-800 p-4">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Code Homie anything..."
              className="min-h-24 bg-zinc-900 border-zinc-800"
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="h-auto">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
