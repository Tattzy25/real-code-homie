import { createBrowserClient } from "@supabase/ssr"
import { createContext, useContext, useEffect, useState } from "react"
import type { SupabaseClient, Session } from "@supabase/supabase-js"

type SupabaseContextType = {
  supabase: SupabaseClient
  session: Session | null
  loading: boolean
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined)

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Missing Supabase URL or anon key")
  }

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  useEffect(() => {
    // Set client on window for debugging
    if (typeof window !== "undefined") {
      ;(window as any).supabase = supabase
    }

    // Get session on mount
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setSession(session)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error getting session:", error)
        setLoading(false)
      })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  return (
    <SupabaseContext.Provider value={{ supabase, session, loading }}>
      {children}
    </SupabaseContext.Provider>
  )
}

export function useSupabase() {
  const context = useContext(SupabaseContext)
  if (context === undefined) {
    throw new Error("useSupabase must be used within a SupabaseProvider")
  }
  return context
}