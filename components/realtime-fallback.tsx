"use client"

import type React from "react"

import { useAbly } from "@/lib/websocket/ably"
import { AlertCircle } from "lucide-react"
import { useEffect, useState } from "react"

export function RealtimeFallback({ children }: { children: React.ReactNode }) {
  const { isConnected, connectionError } = useAbly()
  const [showError, setShowError] = useState(false)

  // Only show error after a delay to avoid flashing during normal connection process
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isConnected && connectionError) {
        setShowError(true)
      } else {
        setShowError(false)
      }
    }, 5000) // 5 second delay

    return () => clearTimeout(timer)
  }, [isConnected, connectionError])

  if (showError) {
    return (
      <div className="p-4 border border-yellow-300 bg-yellow-50 rounded-md my-4">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800">Realtime Connection Issue</h3>
            <div className="mt-1 text-sm text-yellow-700">
              <p>
                We couldn't establish a realtime connection. Some features like live chat updates may not work properly.
              </p>
              <p className="mt-2 text-xs text-yellow-600">Error: {connectionError || "Unknown connection issue"}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
