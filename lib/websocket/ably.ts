"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

// Simple context type
type AblyContextType = {
  publish: (channel: string, event: string, data: any) => void
  subscribe: (channel: string, event: string, callback: (data: any) => void) => () => void
  isConnected: boolean
  error: string | null
}

// Default context values
const defaultContext: AblyContextType = {
  publish: () => {},
  subscribe: () => () => {},
  isConnected: false,
  error: null,
}

// Create the context
const AblyContext = createContext<AblyContextType>(defaultContext)

// Hook to use the context
export function useAbly() {
  return useContext(AblyContext)
}

// Provider component
export function AblyProvider({ children }: { children: React.ReactNode }) {
  // State
  const [client, setClient] = useState<any>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize Ably
  useEffect(() => {
    if (typeof window === "undefined") return

    let ablyInstance: any = null

    async function setup() {
      try {
        // Get token from server
        const res = await fetch("/api/ably-token")
        if (!res.ok) throw new Error("Failed to get token")
        const tokenData = await res.json()

        // Import Ably
        const Ably = (await import("ably")).default

        // Create client
        ablyInstance = new Ably.Realtime({
          authCallback: (_, callback) => {
            callback(null, tokenData)
          },
        })

        // Set up listeners
        ablyInstance.connection.on("connected", () => {
          setIsConnected(true)
          setError(null)
        })

        ablyInstance.connection.on("disconnected", () => {
          setIsConnected(false)
        })

        ablyInstance.connection.on("failed", () => {
          setIsConnected(false)
          setError("Connection failed")
        })

        setClient(ablyInstance)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      }
    }

    setup()

    // Cleanup
    return () => {
      if (ablyInstance) {
        ablyInstance.close()
      }
    }
  }, [])

  // Publish function
  function publish(channelName: string, eventName: string, data: any) {
    if (!client || !isConnected) return

    try {
      const channel = client.channels.get(channelName)
      channel.publish(eventName, data)
    } catch (err) {
      console.error("Publish error:", err)
    }
  }

  // Subscribe function
  function subscribe(channelName: string, eventName: string, callback: (data: any) => void) {
    if (!client) return () => {}

    try {
      const channel = client.channels.get(channelName)
      channel.subscribe(eventName, (message: any) => {
        callback(message.data)
      })

      return () => {
        channel.unsubscribe(eventName)
      }
    } catch (err) {
      console.error("Subscribe error:", err)
      return () => {}
    }
  }

  // Create value object separately
  const contextValue = {
    publish: publish,
    subscribe: subscribe,
    isConnected: isConnected,
    error: error,
  }

  // Return provider with simple value prop
  return React.createElement(AblyContext.Provider, { value: contextValue }, children)
}
