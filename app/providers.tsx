"use client"

import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { SupabaseProvider } from "@/lib/supabase/provider"
import { SupabaseAuthProvider } from "@/lib/hooks/use-supabase-auth"
import { Toaster } from "@/components/ui/toaster"
import { AblyProvider } from "@/lib/websocket/ably"
import { PayPalProvider } from "@/components/paypal-provider"
import { useState, useEffect } from "react"

export function Providers({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <SupabaseProvider>
        <SupabaseAuthProvider>
          {isClient ? (
            <AblyProvider>
              <PayPalProvider>
                {children}
                <Toaster />
              </PayPalProvider>
            </AblyProvider>
          ) : (
            <PayPalProvider>
              {children}
              <Toaster />
            </PayPalProvider>
          )}
        </SupabaseAuthProvider>
      </SupabaseProvider>
    </ThemeProvider>
  )
}
