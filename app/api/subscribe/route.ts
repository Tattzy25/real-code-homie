import { NextResponse } from "next/server"
import { sendEmail, getWelcomeEmailTemplate } from "@/lib/email/mailer"

// MailerLite API endpoint
const MAILERLITE_API_URL = "https://connect.mailerlite.com/api"
const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Add subscriber to MailerLite
    const response = await fetch(`${MAILERLITE_API_URL}/subscribers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MAILERLITE_API_KEY}`,
      },
      body: JSON.stringify({
        email,
        fields: {
          name: name || "",
        },
        groups: ["code-homie-newsletter"],
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("MailerLite API error:", data)
      return NextResponse.json({ error: "Failed to subscribe" }, { status: response.status })
    }

    // Send welcome email
    const welcomeEmail = getWelcomeEmailTemplate(name || "")
    await sendEmail({
      to: email,
      subject: welcomeEmail.subject,
      html: welcomeEmail.html,
      text: welcomeEmail.text,
    })

    return NextResponse.json({ success: true, message: "Subscribed successfully" })
  } catch (error) {
    console.error("Subscription error:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}
