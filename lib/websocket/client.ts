"use client"

import { useEffect, useState } from "react"

type WebSocketStatus = "connecting" | "connected" | "disconnected"

export function useWebSocket(url: string) {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [status, setStatus] = useState<WebSocketStatus>("disconnected")
  const [lastMessage, setLastMessage] = useState<any>(null)

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return

    const ws = new WebSocket(url)

    ws.onopen = () => {
      setStatus("connected")
    }

    ws.onclose = () => {
      setStatus("disconnected")
    }

    ws.onerror = (error) => {
      console.error("WebSocket error:", error)
      setStatus("disconnected")
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        setLastMessage(data)
      } catch (error) {
        console.error("Error parsing WebSocket message:", error)
      }
    }

    setSocket(ws)

    // Cleanup on unmount
    return () => {
      ws.close()
    }
  }, [url])

  const sendMessage = (data: any) => {
    if (socket && status === "connected") {
      socket.send(JSON.stringify(data))
    }
  }

  return { socket, status, lastMessage, sendMessage }
}
