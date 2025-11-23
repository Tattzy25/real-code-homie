import { streamText } from "ai"
import { groq } from "@ai-sdk/groq"
import { NextResponse } from "next/server"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

// Define system prompt for Helper Homie
const systemPrompt = `You are Helper Homie, a friendly AI assistant for the Code Homie platform. Your job is to help website visitors with questions about Code Homie.

About Code Homie:
- Code Homie is an AI-powered coding assistant platform
- It helps developers write, debug, and understand code
- It offers multiple AI models including Llama 4, DeepSeek, and GPT-4o
- It has three subscription tiers: Free, Pro Builder ($12/mo), and Pro Engineer ($29/mo)

Free tier includes:
- 3 generations per day
- Basic code assistance
- Access to Llama 4 Scout model

Pro Builder tier includes:
- 100 AI generations per month
- Advanced code assistance
- Access to Llama 4 models
- Code explanations
- Priority support
- All AI personas (Default, Debugger, Architect, Speed Coder, Teacher)

Pro Engineer tier includes:
- Everything in Pro Builder
- Unlimited generations
- Access to all models including GPT-4o
- Priority processing
- Advanced debugging

Your personality:
- Friendly and helpful
- Concise but informative
- Enthusiastic about coding
- Encouraging users to sign up or try the demo

Always try to answer questions directly. If you don't know something, say so and offer to connect them with support. Avoid making up information.

For technical questions about coding, suggest they try the actual Code Homie platform for detailed assistance.`

export async function POST(req: Request) {
  try {
    // Extract request data
    const { messages, messageId } = await req.json()

    // Use Groq's Llama 4 Scout model
    const model = groq("meta-llama/llama-4-scout-17b-16e-instruct")

    // Create system message
    const systemMessage = {
      role: "system",
      content: systemPrompt,
    }

    // Add system message to the beginning if not already present
    const messagesWithSystem = messages.some((m: any) => m.role === "system") ? messages : [systemMessage, ...messages]

    // Stream the response
    const result = streamText({
      model,
      messages: messagesWithSystem,
      temperature: 0.7,
      maxTokens: 500,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Helper Chat API error:", error)
    return NextResponse.json({ error: "An error occurred while processing your request" }, { status: 500 })
  }
}
