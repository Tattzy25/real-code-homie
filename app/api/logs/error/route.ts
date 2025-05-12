import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  try {
    const logData = await request.json()

    // Validate required fields
    if (!logData.message || !logData.timestamp || !logData.severity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Store error log in database
    const { error } = await supabase.from("error_logs").insert({
      message: logData.message,
      user_id: logData.userId,
      path: logData.path,
      component: logData.component,
      timestamp: logData.timestamp,
      severity: logData.severity,
      stack_trace: logData.stack,
      context: logData.context,
    })

    if (error) {
      console.error("Error storing log:", error)
      return NextResponse.json({ error: "Failed to store error log" }, { status: 500 })
    }

    // For critical errors, we might want to send notifications
    if (logData.severity === "critical") {
      // TODO: Implement notification system (email, Slack, etc.)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error logging API error:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}
