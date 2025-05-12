import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  try {
    const { subscriptionId, planId, userId, planKey } = await request.json()

    if (!subscriptionId || !planId || !userId || !planKey) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Verify user exists
    const { data: userData, error: userError } = await supabase.from("users").select("id").eq("id", userId).single()

    if (userError || !userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Create subscription record
    const { error: subscriptionError } = await supabase.from("subscriptions").insert({
      user_id: userId,
      subscription_id: subscriptionId,
      provider: "paypal",
      status: "active",
      plan_id: planId,
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    })

    if (subscriptionError) {
      console.error("Error creating subscription:", subscriptionError)
      return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 })
    }

    // Update user's subscription tier
    const { error: updateError } = await supabase
      .from("users")
      .update({
        subscription_tier: planKey,
        subscription_status: "active",
        subscription_id: subscriptionId,
        payment_provider: "paypal",
      })
      .eq("id", userId)

    if (updateError) {
      console.error("Error updating user subscription tier:", updateError)
      return NextResponse.json({ error: "Failed to update user subscription" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Subscription creation error:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}
