"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, MessageSquare, ChevronLeft, ChevronRight, Trash2 } from "lucide-react"
import { useSupabaseAuth } from "@/lib/hooks/use-supabase-auth"
import { useSupabase } from "@/lib/supabase/provider"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

type Conversation = {
  id: string
  title: string
  created_at: string
}

type ChatSidebarProps = {
  isOpen: boolean
  onToggle: () => void
  currentConversationId: string | null
  onConversationSelect: (id: string) => void
}

export function ChatSidebar({ isOpen, onToggle, currentConversationId, onConversationSelect }: ChatSidebarProps) {
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
