import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  try {
    const { subscriptionId } = await request.json()

    if (!subscriptionId) {
      return NextResponse.json({ error: "Subscription ID is required" }, { status: 400 })
    }

    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get the subscription from our database
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("subscription_id", subscriptionId)
      .single()

    if (subscriptionError || !subscriptionData) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 })
    }

    // In a real implementation, you would call the PayPal API to cancel the subscription
    // For now, we'll just update our database

    // Update subscription status
    const { error: updateError } = await supabase
      .from("subscriptions")
      .update({
        cancel_at_period_end: true,
        status: "cancelling",
      })
      .eq("subscription_id", subscriptionId)

    if (updateError) {
      console.error("Error updating subscription:", updateError)
      return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 })
    }

    // Update user's subscription status
    const { error: userError } = await supabase
      .from("users")
      .update({
        subscription_status: "cancelling",
      })
      .eq("id", subscriptionData.user_id)

    if (userError) {
      console.error("Error updating user:", userError)
      return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Subscription cancellation error:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}
