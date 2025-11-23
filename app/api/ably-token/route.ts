import { NextResponse } from "next/server"
import Ably from "ably"

export async function GET() {
  try {
    // Get API key from environment variable (server-side only)
    const apiKey = process.env.ABLY_API_KEY

    if (!apiKey) {
      console.error("Ably API key is missing")
      return NextResponse.json({ error: "Configuration error" }, { status: 500 })
    }

    // Generate a client ID
    const clientId = `codehomie-${Math.random().toString(36).substring(2, 10)}`

    // Create a token request
    return new Promise((resolve) => {
      const rest = new Ably.Rest(apiKey)

      rest.auth.createTokenRequest({ clientId: clientId }, null, (err, tokenRequest) => {
        if (err) {
          console.error("Error creating Ably token:", err)
          resolve(NextResponse.json({ error: "Failed to create token" }, { status: 500 }))
          return
        }

        resolve(NextResponse.json(tokenRequest))
      })
    })
  } catch (error) {
    console.error("Unexpected error in Ably token endpoint:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
